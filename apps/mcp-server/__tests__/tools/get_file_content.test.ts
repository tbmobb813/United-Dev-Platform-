import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';

jest.mock('fs');

import fs from 'fs';
import { getFileContentTool } from '../../src/tools/get_file_content.js';

const mockFs = fs as jest.Mocked<typeof fs>;

function makeStats(
  overrides: Partial<{
    isFile: boolean;
    size: number;
    mtime: Date;
  }> = {}
) {
  const {
    isFile = true,
    size = 100,
    mtime = new Date('2024-01-01T00:00:00Z'),
  } = overrides;
  return {
    isFile: () => isFile,
    size,
    mtime,
  } as unknown as fs.Stats;
}

describe('get_file_content tool', () => {
  const fakeRoot = '/fake/project';
  const fakeFile = 'src/index.ts';
  const fakeAbsPath = `${fakeRoot}/${fakeFile}`;
  const fakeContent = 'const x = 1;\nconst y = 2;\n';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'cwd').mockReturnValue(fakeRoot);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('reads file content correctly', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    const result = await getFileContentTool.execute({
      file_path: fakeFile,
      project_root: fakeRoot,
    });

    expect(result.content).toBe(fakeContent);
    expect(result.path).toBe(fakeFile);
    expect(result.encoding).toBe('utf-8');
  });

  it('returns metadata including size, lineCount, and lastModified', async () => {
    const mtime = new Date('2024-06-15T10:30:00Z');
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(
      makeStats({ size: fakeContent.length, mtime })
    );
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    const result = await getFileContentTool.execute({
      file_path: fakeFile,
      project_root: fakeRoot,
    });

    expect(result.size).toBe(fakeContent.length);
    expect(result.lineCount).toBe(fakeContent.split('\n').length);
    expect(result.lastModified).toBe(mtime.toISOString());
  });

  it('rejects path traversal attempts that escape project root', async () => {
    await expect(
      getFileContentTool.execute({
        file_path: '../../etc/passwd',
        project_root: fakeRoot,
      })
    ).rejects.toThrow('Path traversal not allowed');
  });

  it('rejects absolute path outside project root', async () => {
    await expect(
      getFileContentTool.execute({
        file_path: '/etc/passwd',
        project_root: fakeRoot,
      })
    ).rejects.toThrow('Path traversal not allowed');
  });

  it('enforces 1MB file size limit', async () => {
    const oversizeBytes = 1024 * 1024 + 1;
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: oversizeBytes }));

    await expect(
      getFileContentTool.execute({
        file_path: fakeFile,
        project_root: fakeRoot,
      })
    ).rejects.toThrow('File too large');
  });

  it('throws for a non-existent file', async () => {
    mockFs.existsSync.mockReturnValue(false);

    await expect(
      getFileContentTool.execute({
        file_path: fakeFile,
        project_root: fakeRoot,
      })
    ).rejects.toThrow('File not found');
  });

  it('throws when path points to a directory, not a file', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ isFile: false }));

    await expect(
      getFileContentTool.execute({
        file_path: 'src',
        project_root: fakeRoot,
      })
    ).rejects.toThrow('Not a file');
  });

  it('uses cwd as project_root when project_root is omitted', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: 5 }));
    mockFs.readFileSync.mockReturnValue('hello' as unknown as Buffer);

    const result = await getFileContentTool.execute({
      file_path: fakeFile,
      // project_root intentionally omitted
    });

    // Root should default to cwd() which is fakeRoot
    expect(result.path).toBe(fakeFile);
  });

  it('accepts an absolute file_path that is inside project root', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue(makeStats({ size: fakeContent.length }));
    mockFs.readFileSync.mockReturnValue(fakeContent as unknown as Buffer);

    const result = await getFileContentTool.execute({
      file_path: fakeAbsPath,
      project_root: fakeRoot,
    });

    expect(result.content).toBe(fakeContent);
  });
});
