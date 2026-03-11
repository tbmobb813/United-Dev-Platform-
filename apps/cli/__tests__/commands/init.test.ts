import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { Command } from 'commander';

// Mock all external modules before importing the command
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
    // By default, nothing exists
    mockedFs.existsSync.mockReturnValue(false);
    mockedFs.mkdirSync.mockReturnValue(undefined as any);
    mockedFs.writeFileSync.mockReturnValue(undefined);
    mockedFs.appendFileSync.mockReturnValue(undefined);
    mockedFs.readFileSync.mockReturnValue('{}');

    program = new Command();
    program.exitOverride(); // prevent process.exit in tests
    initCommand(program);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('writes .udp/config.json with correct fields when no prior config exists', async () => {
    // No config exists yet, no package.json
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === pkgJsonPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === pkgJsonPath) {
        return JSON.stringify({ name: 'my-project' });
      }
      return '';
    });

    await program.parseAsync(['node', 'udp', 'init'], { from: 'user' });

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      configPath,
      expect.stringContaining('"projectName"')
    );

    const written = JSON.parse(
      (mockedFs.writeFileSync as jest.Mock).mock.calls[0][1] as string
    );
    expect(written).toMatchObject({
      projectName: expect.any(String),
      frameworks: expect.any(Array),
      syncPort: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it('detects project name from package.json', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === pkgJsonPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === pkgJsonPath) {
        return JSON.stringify({ name: 'my-awesome-app', dependencies: {} });
      }
      return '';
    });

    await program.parseAsync(['node', 'udp', 'init'], { from: 'user' });

    const written = JSON.parse(
      (mockedFs.writeFileSync as jest.Mock).mock.calls[0][1] as string
    );
    expect(written.projectName).toBe('my-awesome-app');
  });

  it('detects Next.js framework when "next" is in dependencies', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === pkgJsonPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === pkgJsonPath) {
        return JSON.stringify({ name: 'test', dependencies: { next: '^14.0.0' } });
      }
      return '';
    });

    await program.parseAsync(['node', 'udp', 'init'], { from: 'user' });

    const written = JSON.parse(
      (mockedFs.writeFileSync as jest.Mock).mock.calls[0][1] as string
    );
    expect(written.frameworks).toContain('Next.js');
  });

  it('detects React framework when "react" is in dependencies', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === pkgJsonPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === pkgJsonPath) {
        return JSON.stringify({ name: 'test', dependencies: { react: '^18.0.0' } });
      }
      return '';
    });

    await program.parseAsync(['node', 'udp', 'init'], { from: 'user' });

    const written = JSON.parse(
      (mockedFs.writeFileSync as jest.Mock).mock.calls[0][1] as string
    );
    expect(written.frameworks).toContain('React');
  });

  it('appends .udp/ to .gitignore when .gitignore exists and does not already contain it', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === gitignorePath || String(p) === pkgJsonPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === gitignorePath) return 'node_modules/\ndist/\n';
      if (String(p) === pkgJsonPath) return JSON.stringify({ name: 'test' });
      return '';
    });

    await program.parseAsync(['node', 'udp', 'init'], { from: 'user' });

    expect(mockedFs.appendFileSync).toHaveBeenCalledWith(
      gitignorePath,
      expect.stringContaining('.udp/')
    );
  });

  it('does NOT duplicate .udp/ in .gitignore if already present', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === gitignorePath || String(p) === pkgJsonPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === gitignorePath) return 'node_modules/\n.udp/\n';
      if (String(p) === pkgJsonPath) return JSON.stringify({ name: 'test' });
      return '';
    });

    await program.parseAsync(['node', 'udp', 'init'], { from: 'user' });

    expect(mockedFs.appendFileSync).not.toHaveBeenCalled();
  });

  it('uses default port 21567 when --port is not provided', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === pkgJsonPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === pkgJsonPath) return JSON.stringify({ name: 'test' });
      return '';
    });

    await program.parseAsync(['node', 'udp', 'init'], { from: 'user' });

    const written = JSON.parse(
      (mockedFs.writeFileSync as jest.Mock).mock.calls[0][1] as string
    );
    expect(written.syncPort).toBe(21567);
  });

  it('uses custom port when --port is provided', async () => {
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === pkgJsonPath;
    });
    mockedFs.readFileSync.mockImplementation((p: any) => {
      if (String(p) === pkgJsonPath) return JSON.stringify({ name: 'test' });
      return '';
    });

    await program.parseAsync(['node', 'udp', 'init', '--port', '3000'], { from: 'user' });

    const written = JSON.parse(
      (mockedFs.writeFileSync as jest.Mock).mock.calls[0][1] as string
    );
    expect(written.syncPort).toBe(3000);
  });

  it('shows warning and does not overwrite config if already initialized', async () => {
    // config.json already exists
    mockedFs.existsSync.mockImplementation((p: any) => {
      return String(p) === configPath;
    });

    await program.parseAsync(['node', 'udp', 'init'], { from: 'user' });

    // writeFileSync should NOT have been called with configPath
    const writeCalls = (mockedFs.writeFileSync as jest.Mock).mock.calls;
    const wroteConfig = writeCalls.some((call: any[]) => String(call[0]) === configPath);
    expect(wroteConfig).toBe(false);
  });
});
