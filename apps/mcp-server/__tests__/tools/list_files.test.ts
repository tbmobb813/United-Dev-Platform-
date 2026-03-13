import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';

// Mock fs before importing the module under test
jest.mock('fs');

import fs from 'fs';
import { listFilesTool } from '../../src/tools/list_files.js';

// Cast to jest mocks for type safety
const mockFs = fs as jest.Mocked<typeof fs>;

// Helper to build a fake dirent
function makeDirent(name: string, isDir: boolean, isFile: boolean) {
  return {
    name,
    isDirectory: () => isDir,
    isFile: () => isFile,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isFIFO: () => false,
    isSocket: () => false,
    isSymbolicLink: () => false,
  } as unknown as fs.Dirent;
}

describe('list_files tool', () => {
  const fakeRoot = '/fake/project';
  let originalCwd: string;

  beforeEach(() => {
    jest.clearAllMocks();
    originalCwd = process.cwd();
    // Stub cwd so relative paths are deterministic
    jest.spyOn(process, 'cwd').mockReturnValue(fakeRoot);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns file list for a valid directory', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue([
      makeDirent('index.ts', false, true),
      makeDirent('utils.ts', false, true),
    ] as unknown as fs.Dirent[]);

    const result = await listFilesTool.execute({ directory: fakeRoot });

    expect(result.files).toHaveLength(2);
    expect(result.count).toBe(2);
    expect(result.root).toBe(fakeRoot);
    // Files should be present (relative paths)
    expect(result.files.some((f: string) => f.includes('index.ts'))).toBe(true);
    expect(result.files.some((f: string) => f.includes('utils.ts'))).toBe(true);
  });

  it('filters files by pattern when provided', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue([
      makeDirent('index.ts', false, true),
      makeDirent('styles.css', false, true),
      makeDirent('README.md', false, true),
    ] as unknown as fs.Dirent[]);

    const result = await listFilesTool.execute({
      directory: fakeRoot,
      pattern: '.ts',
    });

    expect(result.files).toHaveLength(1);
    expect(result.count).toBe(1);
    expect(result.pattern).toBe('.ts');
    expect(result.files[0]).toContain('index.ts');
  });

  it('filters files by pattern without leading dot', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue([
      makeDirent('app.tsx', false, true),
      makeDirent('config.json', false, true),
      makeDirent('helper.ts', false, true),
    ] as unknown as fs.Dirent[]);

    // Pattern without leading dot — source normalises it to .tsx
    const result = await listFilesTool.execute({
      directory: fakeRoot,
      pattern: 'tsx',
    });

    expect(result.files).toHaveLength(1);
    expect(result.files[0]).toContain('app.tsx');
  });

  it('ignores node_modules, .git, and dist directories', async () => {
    mockFs.existsSync.mockReturnValue(true);

    // First call returns top-level entries; subsequent calls for real dirs
    (
      mockFs.readdirSync as jest.MockedFunction<typeof fs.readdirSync>
    ).mockImplementation((dirPath: fs.PathLike | number, _opts?: any) => {
      const p = String(dirPath);
      if (p === fakeRoot) {
        return [
          makeDirent('node_modules', true, false),
          makeDirent('.git', true, false),
          makeDirent('dist', true, false),
          makeDirent('src', true, false),
          makeDirent('index.ts', false, true),
        ] as unknown as fs.Dirent[];
      }
      if (p === `${fakeRoot}/src`) {
        return [makeDirent('app.ts', false, true)] as unknown as fs.Dirent[];
      }
      return [] as unknown as fs.Dirent[];
    });

    const result = await listFilesTool.execute({ directory: fakeRoot });

    // Only src/app.ts and index.ts should appear — ignored dirs must be absent
    expect(result.files.some((f: string) => f.includes('node_modules'))).toBe(
      false
    );
    expect(result.files.some((f: string) => f.includes('.git'))).toBe(false);
    expect(result.files.some((f: string) => f.includes('dist'))).toBe(false);
    expect(result.files.some((f: string) => f.includes('app.ts'))).toBe(true);
    expect(result.files.some((f: string) => f.includes('index.ts'))).toBe(true);
  });

  it('throws for a non-existent directory', async () => {
    mockFs.existsSync.mockReturnValue(false);

    await expect(
      listFilesTool.execute({ directory: '/nonexistent/path' })
    ).rejects.toThrow('Directory not found: /nonexistent/path');
  });

  it('returns correct count matching files array length', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue([
      makeDirent('a.ts', false, true),
      makeDirent('b.ts', false, true),
      makeDirent('c.ts', false, true),
    ] as unknown as fs.Dirent[]);

    const result = await listFilesTool.execute({ directory: fakeRoot });

    expect(result.count).toBe(result.files.length);
    expect(result.count).toBe(3);
  });

  it('returns "all files" as pattern when no pattern is given', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue([] as unknown as fs.Dirent[]);

    const result = await listFilesTool.execute({ directory: fakeRoot });

    expect(result.pattern).toBe('all files');
  });

  it('uses process.cwd() as root when no directory is provided', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue([
      makeDirent('main.ts', false, true),
    ] as unknown as fs.Dirent[]);

    const result = await listFilesTool.execute({});

    expect(result.root).toBe(fakeRoot); // fakeRoot is what cwd() returns
  });
});
