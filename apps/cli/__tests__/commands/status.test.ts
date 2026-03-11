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
  __esModule: true,
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

  // Capture pino logger calls via the module-mapper stub
  let pinoModule: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue(fakeProjectRoot);
    pinoModule = await import('pino');

    program = new Command();
    program.exitOverride();
    statusCommand(program);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('reads config.json and displays project information when initialized', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => String(p) === configPath);
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    // Should complete without throwing
    await expect(
      program.parseAsync(['node', 'udp', 'status'], { from: 'user' })
    ).resolves.toBeDefined();

    // config.json should have been read
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(configPath, 'utf-8');
  });

  it('reads project name, frameworks, and port from config', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => String(p) === configPath);
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    await program.parseAsync(['node', 'udp', 'status'], { from: 'user' });

    // Verify config was parsed (readFileSync called with config path)
    const readCalls = (mockedFs.readFileSync as jest.Mock).mock.calls as any[][];
    expect(readCalls.some((call) => String(call[0]) === configPath)).toBe(true);
  });

  it('reads devices.json and checks device count when it exists', async () => {
    const devices = [{ id: 'device-1' }, { id: 'device-2' }];
    mockedFs.existsSync.mockImplementation((p: any) =>
      String(p) === configPath || String(p) === devicesPath
    );
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      if (String(p) === devicesPath) return JSON.stringify(devices);
      return '';
    });

    await program.parseAsync(['node', 'udp', 'status'], { from: 'user' });

    // devices.json should have been read
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(devicesPath, 'utf-8');
  });

  it('does not read devices.json when it does not exist', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => String(p) === configPath);
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    await program.parseAsync(['node', 'udp', 'status'], { from: 'user' });

    const readCalls = (mockedFs.readFileSync as jest.Mock).mock.calls as any[][];
    expect(readCalls.some((call) => String(call[0]) === devicesPath)).toBe(false);
  });

  it('exits early without reading config when not initialized', async () => {
    mockedFs.existsSync.mockReturnValue(false);

    await program.parseAsync(['node', 'udp', 'status'], { from: 'user' });

    // config.json should NOT have been read
    const readCalls = (mockedFs.readFileSync as jest.Mock).mock.calls as any[][];
    expect(readCalls.some((call) => String(call[0]) === configPath)).toBe(false);
  });
});
