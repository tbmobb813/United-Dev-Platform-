import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { Command } from 'commander';

const mockPinoLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.mock('node:fs');
jest.mock('node-fetch');
jest.mock('chalk', () => ({
  __esModule: true,
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
jest.mock('ora', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    warn: jest.fn().mockReturnThis(),
    get text() {
      return '';
    },
    set text(_: string) {},
  })),
}));
jest.mock('pino', () => ({
  __esModule: true,
  default: jest.fn(() => mockPinoLogger),
}));

import fs from 'node:fs';
import nodeFetch from 'node-fetch';
import path from 'node:path';
import { devicesCommand } from '../../src/commands/devices';

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedFetch = nodeFetch as jest.MockedFunction<typeof nodeFetch>;

describe('devices command', () => {
  let program: Command;
  const fakeProjectRoot = '/fake/project';
  const configPath = path.join(fakeProjectRoot, '.udp', 'config.json');

  const mockConfig = { syncPort: 21567 };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue(fakeProjectRoot);

    mockedFs.existsSync.mockReturnValue(false);
    mockedFs.readFileSync.mockReturnValue('');

    program = new Command();
    program.exitOverride();
    devicesCommand(program);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('list action: calls GET /api/devices and displays device names', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === configPath
    );
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    const mockDevices = {
      devices: [
        { deviceId: 'dev-abc', info: { name: 'My Phone' }, confirmed: true },
        { deviceId: 'dev-xyz', info: { name: 'Tablet' }, confirmed: false },
      ],
    };

    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => mockDevices,
    } as any);

    await program.parseAsync(['devices', 'list'], { from: 'user' });

    expect(mockedFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/devices')
    );

    const pinoMock = (await import('pino')).default as jest.Mock;
    const loggerInstance = pinoMock();
    const infoCalls = loggerInstance.info.mock.calls as any[][];
    const allOutput = infoCalls.map((c: any[]) => String(c[0])).join('\n');
    expect(allOutput).toContain('dev-abc');
    expect(allOutput).toContain('My Phone');
  });

  it('list action (no action arg): defaults to listing devices', async () => {
    mockedFs.existsSync.mockReturnValue(false);

    const mockDevices = { devices: [] };
    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => mockDevices,
    } as any);

    await program.parseAsync(['devices'], { from: 'user' });

    expect(mockedFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/devices')
    );
  });

  it('list action: shows "(none)" message when device list is empty', async () => {
    mockedFs.existsSync.mockReturnValue(false);

    const mockDevices = { devices: [] };
    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => mockDevices,
    } as any);

    await program.parseAsync(['devices', 'list'], { from: 'user' });

    const pinoMock = (await import('pino')).default as jest.Mock;
    const loggerInstance = pinoMock();
    const infoCalls = loggerInstance.info.mock.calls as any[][];
    const allOutput = infoCalls.map((c: any[]) => String(c[0])).join('\n');
    expect(allOutput).toContain('(none)');
  });

  it('remove action: calls DELETE /api/devices/:id', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === configPath
    );
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(mockConfig);
      return '';
    });

    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as any);

    await program.parseAsync(['devices', 'remove', 'dev-abc'], {
      from: 'user',
    });

    expect(mockedFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/devices/dev-abc'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('list action: fails gracefully when fetch throws', async () => {
    mockedFs.existsSync.mockReturnValue(false);
    mockedFetch.mockRejectedValue(new Error('Connection refused'));

    // Should not throw
    await expect(
      program.parseAsync(['devices', 'list'], { from: 'user' })
    ).resolves.not.toThrow();

    const oraMock = (await import('ora')).default as jest.Mock;
    const spinnerInstance = oraMock.mock.results[0]?.value;
    expect(spinnerInstance.fail).toHaveBeenCalled();
  });

  it('remove action: fails gracefully when fetch returns non-ok', async () => {
    mockedFs.existsSync.mockReturnValue(false);
    mockedFetch.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as any);

    await expect(
      program.parseAsync(['devices', 'remove', 'dev-xyz'], { from: 'user' })
    ).resolves.not.toThrow();

    const oraMock = (await import('ora')).default as jest.Mock;
    const spinnerInstance = oraMock.mock.results[0]?.value;
    expect(spinnerInstance.fail).toHaveBeenCalled();
  });

  it('uses port from config.json if available', async () => {
    const customConfig = { syncPort: 9999 };
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === configPath
    );
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === configPath) return JSON.stringify(customConfig);
      return '';
    });

    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ devices: [] }),
    } as any);

    await program.parseAsync(['devices', 'list'], { from: 'user' });

    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining('9999'));
  });

  it('logs error for unknown action', async () => {
    const pinoMock = (await import('pino')).default as jest.Mock;
    await program.parseAsync(['devices', 'foobar'], { from: 'user' });
    const loggerInstance = pinoMock();
    expect(loggerInstance.error).toHaveBeenCalledWith(
      expect.stringContaining('Unknown action')
    );
  });

  it('logs error for missing deviceId on remove', async () => {
    const pinoMock = (await import('pino')).default as jest.Mock;
    await program.parseAsync(['devices', 'remove'], { from: 'user' });
    const loggerInstance = pinoMock();
    expect(loggerInstance.error).toHaveBeenCalledWith(
      expect.stringContaining('Unknown action')
    );
  });

  it('handles config file JSON parse error gracefully', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockImplementation(() => '{bad json');
    // Should not throw
    await expect(
      program.parseAsync(['devices', 'list'], { from: 'user' })
    ).resolves.not.toThrow();
  });

  it('handles devices file JSON parse error gracefully', async () => {
    const configPath = path.join(fakeProjectRoot, '.udp', 'config.json');
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === configPath || String(p).endsWith('devices.json')
    );
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p).endsWith('config.json'))
        return JSON.stringify({ syncPort: 21567 });
      if (String(p).endsWith('devices.json')) return '{bad json';
      return '';
    });
    // Should not throw
    await expect(
      program.parseAsync(['devices', 'list'], { from: 'user' })
    ).resolves.not.toThrow();
  });
});
