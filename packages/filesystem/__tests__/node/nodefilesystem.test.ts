import { NodeFileSystem } from '../../NodeFileSystem';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('NodeFileSystem - basic file operations', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'udp-nfs-'));
  let nfs: NodeFileSystem;

  beforeAll(() => {
    nfs = new NodeFileSystem(tmpRoot);
  });

  afterAll(async () => {
    // cleanup the temp directory created for tests
    try {
      await nfs.deleteDirectory('/', true);
    } catch {
      // best-effort cleanup
    }
  });

  it('write/read/delete a file (utf8)', async () => {
    await nfs.writeFile('hello.txt', 'world', {
      overwrite: true,
      createDirectories: true,
    });
    const content = await nfs.readFile('hello.txt');
    expect(String(content)).toBe('world');
    const stats = await nfs.getStats('hello.txt');
    expect(stats).toBeDefined();
    expect(await nfs.exists('hello.txt')).toBe(true);
    await nfs.deleteFile('hello.txt');
    expect(await nfs.exists('hello.txt')).toBe(false);
  });

  it('copy and move files', async () => {
    await nfs.writeFile('src.txt', 'copy-me', {
      overwrite: true,
      createDirectories: true,
    });
    await nfs.copyFile('src.txt', 'copy.txt', {
      overwrite: true,
      createDirectories: true,
    });
    expect(await nfs.exists('copy.txt')).toBe(true);

    await nfs.moveFile('copy.txt', 'moved.txt', {
      overwrite: true,
      createDirectories: true,
    });
    expect(await nfs.exists('copy.txt')).toBe(false);
    expect(await nfs.exists('moved.txt')).toBe(true);

    // cleanup
    await nfs.deleteFile('src.txt');
    await nfs.deleteFile('moved.txt');
  });

  it('create/list/delete directories and getFileSystemStats', async () => {
    await nfs.createDirectory('projects/myapp/src', true);
    await nfs.writeFile('projects/myapp/src/index.ts', 'console.log(1);', {
      overwrite: true,
      createDirectories: true,
    });

    const listing = await nfs.listDirectory('projects', { recursive: true });
    expect(listing.totalCount).toBeGreaterThan(0);

    const fsStats = await nfs.getFileSystemStats('projects');
    expect(fsStats.totalFiles).toBeGreaterThan(0);

    // cleanup
    await nfs.deleteDirectory('projects', true);
    expect(await nfs.exists('projects')).toBe(false);
  });
});
