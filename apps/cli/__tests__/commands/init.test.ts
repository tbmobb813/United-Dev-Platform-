import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { Command } from 'commander';

// Mock fs before importing the command
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

import fs from 'node:fs';
import path from 'node:path';
import { initCommand } from '../../src/commands/init';

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('init command', () => {
  let program: Command;
  const fakeProjectRoot = '/fake/project';
  const udpDir = path.join(fakeProjectRoot, '.udp');
  const configPath = path.join(udpDir, 'config.json');
  const gitignorePath = path.join(fakeProjectRoot, '.gitignore');
  const pkgJsonPath = path.join(fakeProjectRoot, 'package.json');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue(fakeProjectRoot);
    mockedFs.existsSync.mockReturnValue(false);
    mockedFs.mkdirSync.mockReturnValue(undefined as any);
    mockedFs.writeFileSync.mockReturnValue(undefined);
    mockedFs.appendFileSync.mockReturnValue(undefined);
    mockedFs.readFileSync.mockReturnValue('{}');

    program = new Command();
    program.exitOverride();
    initCommand(program);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('writes .udp/config.json with correct fields when no prior config exists', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === pkgJsonPath
    );
    // @ts-expect-error: mockImplementation signature does not match all overloads
    mockedFs.readFileSync.mockImplementation((p: any, opts?: any) => {
      const encoding =
        typeof opts === 'string' || (opts && typeof opts.encoding === 'string');
      if (encoding) {
        if (String(p) === pkgJsonPath)
          return JSON.stringify({ name: 'my-project' });
        return '';
      }
      return Buffer.from('');
    });

    await program.parseAsync(['init'], { from: 'user' });

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      configPath,
      expect.stringContaining('"projectName"')
    );

    const writtenJson = (mockedFs.writeFileSync as jest.Mock).mock
      .calls[0][1] as string;
    const written = JSON.parse(writtenJson);
    expect(written).toMatchObject({
      projectName: expect.any(String),
      frameworks: expect.any(Array),
      syncPort: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it('detects project name from package.json', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === pkgJsonPath
    );
    // @ts-expect-error: mockImplementation signature does not match all overloads
    mockedFs.readFileSync.mockImplementation((p: any, opts?: any) => {
      const encoding =
        typeof opts === 'string' || (opts && typeof opts.encoding === 'string');
      if (encoding) {
        if (String(p) === pkgJsonPath)
          return JSON.stringify({ name: 'my-awesome-app', dependencies: {} });
        return '';
      }
      return Buffer.from('');
    });

    await program.parseAsync(['init'], { from: 'user' });

    const writtenJson = (mockedFs.writeFileSync as jest.Mock).mock
      .calls[0][1] as string;
    const written = JSON.parse(writtenJson);
    expect(written.projectName).toBe('my-awesome-app');
  });

  it('detects Next.js framework when "next" is in dependencies', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === pkgJsonPath
    );
    // @ts-expect-error: mockImplementation signature does not match all overloads
    mockedFs.readFileSync.mockImplementation((p: any, opts?: any) => {
      const encoding =
        typeof opts === 'string' || (opts && typeof opts.encoding === 'string');
      if (encoding) {
        if (String(p) === pkgJsonPath)
          return JSON.stringify({
            name: 'test',
            dependencies: { next: '^14.0.0' },
          });
        return '';
      }
      return Buffer.from('');
    });

    await program.parseAsync(['init'], { from: 'user' });

    const writtenJson = (mockedFs.writeFileSync as jest.Mock).mock
      .calls[0][1] as string;
    const written = JSON.parse(writtenJson);
    expect(written.frameworks).toContain('Next.js');
  });

  it('detects React framework when "react" is in dependencies', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === pkgJsonPath
    );
    // @ts-expect-error: mockImplementation signature does not match all overloads
    mockedFs.readFileSync.mockImplementation((p: any, opts?: any) => {
      const encoding =
        typeof opts === 'string' || (opts && typeof opts.encoding === 'string');
      if (encoding) {
        if (String(p) === pkgJsonPath)
          return JSON.stringify({
            name: 'test',
            dependencies: { react: '^18.0.0' },
          });
        return '';
      }
      return Buffer.from('');
    });

    await program.parseAsync(['init'], { from: 'user' });

    const writtenJson = (mockedFs.writeFileSync as jest.Mock).mock
      .calls[0][1] as string;
    const written = JSON.parse(writtenJson);
    expect(written.frameworks).toContain('React');
  });

  it('appends .udp/ to .gitignore when it exists and does not already contain .udp/', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === gitignorePath || String(p) === pkgJsonPath
    );
    // @ts-expect-error: mockImplementation signature does not match all overloads
    mockedFs.readFileSync.mockImplementation((p: any, opts?: any) => {
      const encoding =
        typeof opts === 'string' || (opts && typeof opts.encoding === 'string');
      if (encoding) {
        if (String(p) === gitignorePath) return 'node_modules/\ndist/\n';
        if (String(p) === pkgJsonPath) return JSON.stringify({ name: 'test' });
        return '';
      }
      return Buffer.from('');
    });

    await program.parseAsync(['init'], { from: 'user' });

    expect(mockedFs.appendFileSync).toHaveBeenCalledWith(
      gitignorePath,
      expect.stringContaining('.udp/')
    );
  });

  it('does NOT duplicate .udp/ in .gitignore if already present', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === gitignorePath || String(p) === pkgJsonPath
    );
    // @ts-expect-error: mockImplementation signature does not match all overloads
    mockedFs.readFileSync.mockImplementation((p: any, opts?: any) => {
      const encoding =
        typeof opts === 'string' || (opts && typeof opts.encoding === 'string');
      if (encoding) {
        if (String(p) === gitignorePath) return 'node_modules/\n.udp/\n';
        if (String(p) === pkgJsonPath) return JSON.stringify({ name: 'test' });
        return '';
      }
      return Buffer.from('');
    });

    await program.parseAsync(['init'], { from: 'user' });

    expect(mockedFs.appendFileSync).not.toHaveBeenCalled();
  });

  it('uses default port 21567 when --port is not provided', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === pkgJsonPath
    );
    // @ts-expect-error: mockImplementation signature does not match all overloads
    mockedFs.readFileSync.mockImplementation((p: any, opts?: any) => {
      const encoding =
        typeof opts === 'string' || (opts && typeof opts.encoding === 'string');
      if (encoding) {
        if (String(p) === pkgJsonPath) return JSON.stringify({ name: 'test' });
        return '';
      }
      return Buffer.from('');
    });

    await program.parseAsync(['init'], { from: 'user' });

    const writtenJson = (mockedFs.writeFileSync as jest.Mock).mock
      .calls[0][1] as string;
    const written = JSON.parse(writtenJson);
    expect(written.syncPort).toBe(21567);
  });

  it('uses custom port when --port is provided', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === pkgJsonPath
    );
    // @ts-expect-error: mockImplementation signature does not match all overloads
    mockedFs.readFileSync.mockImplementation((p: any, opts?: any) => {
      const encoding =
        typeof opts === 'string' || (opts && typeof opts.encoding === 'string');
      if (encoding) {
        if (String(p) === pkgJsonPath) return JSON.stringify({ name: 'test' });
        return '';
      }
      return Buffer.from('');
    });

    await program.parseAsync(['init', '--port', '3000'], { from: 'user' });

    const writtenJson = (mockedFs.writeFileSync as jest.Mock).mock
      .calls[0][1] as string;
    const written = JSON.parse(writtenJson);
    expect(written.syncPort).toBe(3000);
  });

  it('does not overwrite config if already initialized', async () => {
    mockedFs.existsSync.mockImplementation(
      (p: any) => String(p) === configPath
    );

    await program.parseAsync(['init'], { from: 'user' });

    const writeCalls = (mockedFs.writeFileSync as jest.Mock).mock
      .calls as any[][];
    const wroteConfig = writeCalls.some(call => String(call[0]) === configPath);
    expect(wroteConfig).toBe(false);
  });
});
