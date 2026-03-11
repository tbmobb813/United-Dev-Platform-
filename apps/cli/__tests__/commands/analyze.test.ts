import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { Command } from 'commander';

jest.mock('fs');
jest.mock('@udp/ai');
jest.mock('chalk', () => ({
  default: {
    green: (s: string) => s,
    red: (s: string) => s,
    yellow: (s: string) => s,
    cyan: (s: string) => s,
    dim: (s: string) => s,
    bold: Object.assign((s: string) => s, {
      blue: (s: string) => s,
      cyan: (s: string) => s,
    }),
  },
}));
jest.mock('ora', () => ({
  default: jest.fn(() => ({
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    warn: jest.fn().mockReturnThis(),
    get text() { return ''; },
    set text(_: string) {},
  })),
}));
jest.mock('pino', () => ({
  default: jest.fn(() => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  })),
}));

import fs from 'fs';
import path from 'path';
import { AIManager, ContextAwareAssistant } from '@udp/ai';
import { analyzeCommand } from '../../src/commands/analyze';

const mockedFs = fs as jest.Mocked<typeof fs>;
const MockedAIManager = AIManager as jest.MockedClass<typeof AIManager>;
const MockedContextAwareAssistant = ContextAwareAssistant as jest.MockedClass<typeof ContextAwareAssistant>;

describe('analyze command', () => {
  let program: Command;
  const fakeProjectRoot = '/fake/project';
  const configPath = path.join(fakeProjectRoot, '.udp', 'config.json');

  const mockConfig = {
    projectName: 'test-project',
    frameworks: ['TypeScript'],
  };

  const mockAIResponse = { content: 'This is an AI analysis result.' };
  const mockAnalysisResult = {
    healthScore: 80,
    insights: ['Good structure'],
    recommendations: ['Add more tests'],
  };

  let mockManagerInstance: {
    initialize: jest.Mock;
    explainCode: jest.Mock;
    getService: jest.Mock;
  };
  let mockAssistantInstance: {
    setCodebaseContext: jest.Mock;
    analyzeCodebase: jest.Mock;
  };

  let consoleLogSpy: ReturnType<typeof jest.spyOn>;
  let consoleErrorSpy: ReturnType<typeof jest.spyOn>;
  let processExitSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue(fakeProjectRoot);

    // Set up API key environment variable
    process.env.ANTHROPIC_API_KEY = 'test-api-key';

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation((_code?: any) => {
      throw new Error(`process.exit(${_code})`);
    });

    // Set up AIManager mock
    mockManagerInstance = {
      initialize: jest.fn().mockResolvedValue(undefined),
      explainCode: jest.fn().mockResolvedValue(mockAIResponse),
      getService: jest.fn().mockReturnValue({}),
    };
    MockedAIManager.mockImplementation(() => mockManagerInstance as any);

    // Set up ContextAwareAssistant mock
    mockAssistantInstance = {
      setCodebaseContext: jest.fn(),
      analyzeCodebase: jest.fn().mockResolvedValue(mockAnalysisResult),
    };
    MockedContextAwareAssistant.mockImplementation(() => mockAssistantInstance as any);

    // Default fs: nothing exists
    mockedFs.existsSync.mockReturnValue(false);
    mockedFs.readFileSync.mockReturnValue('');
    mockedFs.readdirSync.mockReturnValue([]);
    mockedFs.statSync.mockReturnValue({ size: 100 } as any);

    program = new Command();
    program.exitOverride();
    analyzeCommand(program);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.ANTHROPIC_API_KEY;
  });

  it('calls AIManager with the correct provider option (anthropic default)', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => String(p) === configPath);
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    await program.parseAsync(['node', 'udp', 'analyze'], { from: 'user' });

    expect(MockedAIManager).toHaveBeenCalledWith(
      expect.objectContaining({ defaultProvider: 'anthropic' })
    );
  });

  it('passes --provider option to AIManager', async () => {
    process.env.OPENAI_API_KEY = 'test-openai-key';
    mockedFs.existsSync.mockReturnValue(false);

    await program.parseAsync(['node', 'udp', 'analyze', '--provider', 'openai'], { from: 'user' });

    expect(MockedAIManager).toHaveBeenCalledWith(
      expect.objectContaining({ defaultProvider: 'openai' })
    );

    delete process.env.OPENAI_API_KEY;
  });

  it('calls manager.initialize() before analysis', async () => {
    mockedFs.existsSync.mockReturnValue(false);

    await program.parseAsync(['node', 'udp', 'analyze'], { from: 'user' });

    expect(mockManagerInstance.initialize).toHaveBeenCalled();
  });

  it('analyzes specific file when --file is given', async () => {
    const targetFile = '/fake/project/src/index.ts';
    mockedFs.existsSync.mockImplementation((p: any) => String(p) === targetFile);
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === targetFile) return 'const x = 1;';
      return '';
    });

    await program.parseAsync(['node', 'udp', 'analyze', '--file', targetFile], { from: 'user' });

    expect(mockManagerInstance.explainCode).toHaveBeenCalledWith(
      'const x = 1;',
      expect.objectContaining({ fileName: 'index.ts' })
    );
  });

  it('outputs the AI result content when analyzing a specific file', async () => {
    const targetFile = '/fake/project/src/app.ts';
    mockedFs.existsSync.mockImplementation((p: any) => String(p) === targetFile);
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === targetFile) return 'export const foo = () => {};';
      return '';
    });

    await program.parseAsync(['node', 'udp', 'analyze', '--file', targetFile], { from: 'user' });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('This is an AI analysis result.')
    );
  });

  it('--quiet flag suppresses the spinner', async () => {
    mockedFs.existsSync.mockReturnValue(false);

    await program.parseAsync(['node', 'udp', 'analyze', '--quiet'], { from: 'user' });

    const oraMock = (await import('ora')).default as jest.Mock;
    // ora should not be called with --quiet
    expect(oraMock).not.toHaveBeenCalled();
  });

  it('handles missing .udp config gracefully (proceeds with basename as project name)', async () => {
    // No config file exists at all
    mockedFs.existsSync.mockReturnValue(false);

    // Should not throw
    await expect(
      program.parseAsync(['node', 'udp', 'analyze'], { from: 'user' })
    ).resolves.not.toThrow();

    expect(MockedAIManager).toHaveBeenCalled();
  });

  it('shows error and exits if --file path does not exist', async () => {
    const missingFile = '/fake/project/does-not-exist.ts';
    // File does not exist
    mockedFs.existsSync.mockReturnValue(false);

    await expect(
      program.parseAsync(['node', 'udp', 'analyze', '--file', missingFile], { from: 'user' })
    ).rejects.toThrow('process.exit(1)');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('File not found')
    );
  });

  it('shows error and exits if no API key is set for non-local provider', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENAI_API_KEY;
    mockedFs.existsSync.mockReturnValue(false);

    await expect(
      program.parseAsync(['node', 'udp', 'analyze'], { from: 'user' })
    ).rejects.toThrow('process.exit(1)');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('No API key')
    );
  });

  it('runs full project analysis with ContextAwareAssistant when no --file given', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => String(p) === configPath);
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    await program.parseAsync(['node', 'udp', 'analyze'], { from: 'user' });

    expect(mockAssistantInstance.setCodebaseContext).toHaveBeenCalled();
    expect(mockAssistantInstance.analyzeCodebase).toHaveBeenCalled();
  });
});
