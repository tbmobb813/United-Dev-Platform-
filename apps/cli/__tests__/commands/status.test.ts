import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { Command } from 'commander';

jest.mock('node:fs');
jest.mock('chalk', () => ({
  default: {
    green: (s: string) => s,
    red: (s: string) => s,
    yellow: (s: string) => s,
    cyan: (s: string) => s,
    dim: (s: string) => s,
    bold: Object.assign((s: string) => s, {
      blue: (s: string) => s,
    }),
  },
}));
jest.mock('pino', () => ({
  default: jest.fn(() => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  })),
}));

import fs from 'node:fs';
import path from 'node:path';
import { statusCommand } from '../../src/commands/status';

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('status command', () => {
  let program: Command;
  const fakeProjectRoot = '/fake/project';
  const configPath = path.join(fakeProjectRoot, '.udp', 'config.json');
  const devicesPath = path.join(fakeProjectRoot, '.udp', 'devices.json');

  const mockConfig = {
    projectName: 'test-project',
    frameworks: ['React', 'Next.js'],
    syncPort: 21567,
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  let logSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue(fakeProjectRoot);
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    program = new Command();
    program.exitOverride();
    statusCommand(program);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('reads and displays project name from config.json', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === configPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    await program.parseAsync(['node', 'udp', 'status'], { from: 'user' });

    // The command uses logger.info (pino mock), so check pino mock was called
    // with content containing project name
    const pinoMock = (await import('pino')).default as jest.Mock;
    const loggerInstance = pinoMock.mock.results[0]?.value;
    expect(loggerInstance).toBeDefined();
    const infoCalls = loggerInstance.info.mock.calls as string[][];
    const allOutput = infoCalls.map((c: any[]) => String(c[0])).join('\n');
    expect(allOutput).toContain('test-project');
  });

  it('displays frameworks from config.json', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === configPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    await program.parseAsync(['node', 'udp', 'status'], { from: 'user' });

    const pinoMock = (await import('pino')).default as jest.Mock;
    const loggerInstance = pinoMock.mock.results[0]?.value;
    const infoCalls = loggerInstance.info.mock.calls as any[][];
    const allOutput = infoCalls.map((c: any[]) => String(c[0])).join('\n');
    expect(allOutput).toContain('React');
    expect(allOutput).toContain('Next.js');
  });

  it('displays sync port from config.json', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === configPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    await program.parseAsync(['node', 'udp', 'status'], { from: 'user' });

    const pinoMock = (await import('pino')).default as jest.Mock;
    const loggerInstance = pinoMock.mock.results[0]?.value;
    const infoCalls = loggerInstance.info.mock.calls as any[][];
    const allOutput = infoCalls.map((c: any[]) => String(c[0])).join('\n');
    expect(allOutput).toContain('21567');
  });

  it('shows device count when devices.json exists', async () => {
    const devices = [{ id: 'device-1' }, { id: 'device-2' }];
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === configPath || String(p) === devicesPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      if (String(p) === devicesPath) return JSON.stringify(devices);
      return '';
    });

    await program.parseAsync(['node', 'udp', 'status'], { from: 'user' });

    const pinoMock = (await import('pino')).default as jest.Mock;
    const loggerInstance = pinoMock.mock.results[0]?.value;
    const infoCalls = loggerInstance.info.mock.calls as any[][];
    const allOutput = infoCalls.map((c: any[]) => String(c[0])).join('\n');
    expect(allOutput).toContain('2');
    expect(allOutput).toContain('paired');
  });

  it('shows "none paired" when devices.json does not exist', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === configPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    await program.parseAsync(['node', 'udp', 'status'], { from: 'user' });

    const pinoMock = (await import('pino')).default as jest.Mock;
    const loggerInstance = pinoMock.mock.results[0]?.value;
    const infoCalls = loggerInstance.info.mock.calls as any[][];
    const allOutput = infoCalls.map((c: any[]) => String(c[0])).join('\n');
    expect(allOutput).toContain('none paired');
  });

  it('shows error/warning when not initialized (no config.json)', async () => {
    mockedFs.existsSync.mockReturnValue(false);

    await program.parseAsync(['node', 'udp', 'status'], { from: 'user' });

    const pinoMock = (await import('pino')).default as jest.Mock;
    const loggerInstance = pinoMock.mock.results[0]?.value;
    // Should warn when not initialized
    const warnCalls = loggerInstance.warn.mock.calls as any[][];
    const allWarnOutput = warnCalls.map((c: any[]) => String(c[0])).join('\n');
    expect(allWarnOutput).toContain('not initialized');
  });
});
