import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock fs and @udp/ai before importing the tool
jest.mock('fs');
jest.mock('@udp/ai');

import fs from 'fs';
import { AIManager } from '@udp/ai';
import { analyzeFileTool } from '../../src/tools/analyze_file.js';

const mockFs = fs as jest.Mocked<typeof fs>;
const MockAIManager = AIManager as jest.MockedClass<typeof AIManager>;

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
  const fakeContent = 'export function greet(name: string) {\n  return `Hello ${name}`;\n}\n';

  let mockInitialize: jest.MockedFunction<() => Promise<void>>;
  let mockChat: jest.MockedFunction<(...args: any[]) => Promise<any>>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue(fakeRoot);

    // Set up AIManager mock instance methods
    mockInitialize = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
    mockChat = jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue({
      content: 'This file exports a greet function. No issues found.',
    });

    MockAIManager.mockImplementation(() => ({
      initialize: mockInitialize,
      chat: mockChat,
    }) as unknown as AIManager);

    // Reset the module-level singleton so a fresh AIManager is created each test
    // The tool caches aiManager in module scope; we can't reset it directly,
    // but clearing and re-mocking the constructor ensures the mock is used.
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls AIManager with file content and returns analysis', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    const result = await analyzeFileTool.execute({
      file_path: fakeFile,
      project_root: fakeRoot,
    });

    expect(mockInitialize).toHaveBeenCalled();
    expect(mockChat).toHaveBeenCalled();
    expect(result.analysis).toBe('This file exports a greet function. No issues found.');
    expect(result.file).toBe(fakeFile);
  });

  it('includes language derived from file extension in the result', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    const result = await analyzeFileTool.execute({
      file_path: fakeFile,
      project_root: fakeRoot,
    });

    expect(result.language).toBe('ts');
  });

  it('includes lineCount in the result', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    const result = await analyzeFileTool.execute({
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

    await analyzeFileTool.execute({
      file_path: fakeFile,
      project_root: fakeRoot,
      prompt: customPrompt,
    });

    // The first argument to chat() should be our custom prompt
    const chatFirstArg = mockChat.mock.calls[0]?.[0];
    expect(chatFirstArg).toBe(customPrompt);
  });

  it('rejects path traversal attempts', async () => {
    await expect(
      analyzeFileTool.execute({
        file_path: '../../etc/passwd',
        project_root: fakeRoot,
      })
    ).rejects.toThrow('Path traversal not allowed');
  });

  it('rejects absolute paths outside project root', async () => {
    await expect(
      analyzeFileTool.execute({
        file_path: '/etc/shadow',
        project_root: fakeRoot,
      })
    ).rejects.toThrow('Path traversal not allowed');
  });

  it('enforces 1MB file size limit', async () => {
    const oversizeBytes = 1024 * 1024 + 1;
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: oversizeBytes }));

    await expect(
      analyzeFileTool.execute({
        file_path: fakeFile,
        project_root: fakeRoot,
      })
    ).rejects.toThrow('File too large');
  });

  it('throws for non-existent files', async () => {
    mockFs.existsSync.mockReturnValue(false);

    await expect(
      analyzeFileTool.execute({
        file_path: fakeFile,
        project_root: fakeRoot,
      })
    ).rejects.toThrow('File not found');
  });

  it('throws if path points to a directory', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ isFile: false }));

    await expect(
      analyzeFileTool.execute({
        file_path: 'src',
        project_root: fakeRoot,
      })
    ).rejects.toThrow('Not a file');
  });

  it('wraps AIManager initialization failures with a clear error message', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    mockInitialize.mockRejectedValue(new Error('API key for anthropic is required'));

    await expect(
      analyzeFileTool.execute({
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

    await expect(
      analyzeFileTool.execute({
        file_path: fakeFile,
        project_root: fakeRoot,
      })
    ).rejects.toThrow('AI analysis failed');
  });
});
