import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';

// Top-level mocks — stable across the whole suite (no resetModules)
jest.mock('fs');
jest.mock('@udp/ai');

import fs from 'fs';
import { AIManager } from '@udp/ai';

const mockFs = fs as jest.Mocked<typeof fs>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockAIManager = AIManager as jest.MockedClass<any>;

function makeStats(overrides: Partial<{ isFile: boolean; size: number }> = {}) {
  const { isFile = true, size = 200 } = overrides;
  return {
    isFile: () => isFile,
    size,
    mtime: new Date('2024-01-01T00:00:00Z'),
  } as unknown as fs.Stats;
}

describe('analyze_file tool', () => {
  const fakeRoot = '/fake/project';
  const fakeFile = 'src/app.ts';
  const fakeContent =
    'export function greet(name: string) {\n  return `Hello ${name}`;\n}\n';

  // Untyped so mockResolvedValue / mockRejectedValue are unconstrained
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockInitialize: jest.MockedFunction<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockChat: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue(fakeRoot);

    mockInitialize = jest.fn().mockResolvedValue(undefined);
    mockChat = jest.fn().mockResolvedValue({
      content: 'This file exports a greet function. No issues found.',
    });

    // Wire the AIManager constructor to return our per-test method mocks.
    // Because we use jest.clearAllMocks() above (not resetModules), the module
    // cache is intact and this mock implementation is visible to the already-
    // imported analyze_file module.
    MockAIManager.mockImplementation(() => ({
      initialize: mockInitialize,
      chat: mockChat,
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Import once at suite level — the module singleton is reset between tests by
  // clearing MockAIManager and re-setting the implementation in beforeEach.
  // We use jest.isolateModules here so each test gets a fresh module instance
  // (clearing the `aiManager` singleton inside analyze_file.ts).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function getToolFresh(): Promise<any> {
    let tool: any;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      tool = require('../../src/tools/analyze_file').analyzeFileTool;
    });
    return tool;
  }

  it('calls AIManager with file content and returns analysis', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    const tool = await getToolFresh();
    const result = await tool.execute({
      file_path: fakeFile,
      project_root: fakeRoot,
    });

    expect(mockInitialize).toHaveBeenCalled();
    expect(mockChat).toHaveBeenCalled();
    expect(result.analysis).toBe(
      'This file exports a greet function. No issues found.'
    );
    expect(result.file).toBe(fakeFile);
  });

  it('includes language derived from file extension in the result', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    const tool = await getToolFresh();
    const result = await tool.execute({
      file_path: fakeFile,
      project_root: fakeRoot,
    });

    expect(result.language).toBe('ts');
  });

  it('includes lineCount in the result', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    const tool = await getToolFresh();
    const result = await tool.execute({
      file_path: fakeFile,
      project_root: fakeRoot,
    });

    expect(result.lineCount).toBe(fakeContent.split('\n').length);
  });

  it('accepts a custom prompt and forwards it to AIManager.chat', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    const customPrompt = 'What does this function return?';

    const tool = await getToolFresh();
    await tool.execute({
      file_path: fakeFile,
      project_root: fakeRoot,
      prompt: customPrompt,
    });

    const chatFirstArg = mockChat.mock.calls[0]?.[0];
    expect(chatFirstArg).toBe(customPrompt);
  });

  it('rejects path traversal attempts', async () => {
    const tool = await getToolFresh();
    await expect(
      tool.execute({
        file_path: '../../etc/passwd',
        project_root: fakeRoot,
      })
    ).rejects.toThrow('Path traversal not allowed');
  });

  it('rejects absolute paths outside project root', async () => {
    const tool = await getToolFresh();
    await expect(
      tool.execute({
        file_path: '/etc/shadow',
        project_root: fakeRoot,
      })
    ).rejects.toThrow('Path traversal not allowed');
  });

  it('enforces 1MB file size limit', async () => {
    const oversizeBytes = 1024 * 1024 + 1;
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: oversizeBytes }));

    const tool = await getToolFresh();
    await expect(
      tool.execute({
        file_path: fakeFile,
        project_root: fakeRoot,
      })
    ).rejects.toThrow('File too large');
  });

  it('throws for non-existent files', async () => {
    mockFs.existsSync.mockReturnValue(false);

    const tool = await getToolFresh();
    await expect(
      tool.execute({
        file_path: fakeFile,
        project_root: fakeRoot,
      })
    ).rejects.toThrow('File not found');
  });

  it('throws if path points to a directory', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ isFile: false }));

    const tool = await getToolFresh();
    await expect(
      tool.execute({
        file_path: 'src',
        project_root: fakeRoot,
      })
    ).rejects.toThrow('Not a file');
  });

  it('wraps AIManager initialization failures with a clear error message', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    mockInitialize.mockRejectedValue(
      new Error('API key for anthropic is required')
    );

    const tool = await getToolFresh();
    await expect(
      tool.execute({
        file_path: fakeFile,
        project_root: fakeRoot,
      })
    ).rejects.toThrow('Failed to initialize AI');
  });

  it('wraps AIManager.chat failures with a clear error message', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    mockChat.mockRejectedValue(new Error('Network timeout'));

    const tool = await getToolFresh();
    await expect(
      tool.execute({
        file_path: fakeFile,
        project_root: fakeRoot,
      })
    ).rejects.toThrow('AI analysis failed');
  });
});
