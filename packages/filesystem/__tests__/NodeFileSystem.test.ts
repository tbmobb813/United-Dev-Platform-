import { NodeFileSystem } from '../NodeFileSystem';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('NodeFileSystem (focused)', () => {
  let tmpDir: string;
  let nfs: NodeFileSystem;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'udp-nfs-'));
    nfs = new NodeFileSystem(tmpDir);
  });

  afterEach(async () => {
    if (tmpDir) {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  test('writeFile and readFile (utf8)', async () => {
    await nfs.writeFile('hello.txt', 'hello world');
    const content = await nfs.readFile('hello.txt', { encoding: 'utf8' });
    expect(content).toBe('hello world');
  });

  test('readFile base64 and binary', async () => {
    const buf = Buffer.from('binary-data');
    await fs.writeFile(path.join(tmpDir, 'bin.dat'), buf);

    const b64 = await nfs.readFile('bin.dat', { encoding: 'base64' });
    expect(typeof b64).toBe('string');
    expect(b64).toBe(buf.toString('base64'));

    const binary = await nfs.readFile('bin.dat', { encoding: 'binary' as any });
    expect(binary instanceof Uint8Array).toBe(true);
    expect(Buffer.from(binary as Uint8Array).toString()).toBe(buf.toString());
  });

  test('writeFile createDirectories and overwrite behavior', async () => {
    await nfs.writeFile('sub/dir/file.txt', 'x', { createDirectories: true });
    expect(await nfs.exists('sub/dir/file.txt')).toBe(true);

    // attempt overwrite disabled
    await expect(
      nfs.writeFile('sub/dir/file.txt', 'y', { overwrite: false })
    ).rejects.toThrow(/File already exists/);
  });

  test('exists and deleteFile', async () => {
    await nfs.writeFile('temp.txt', 't');
    expect(await nfs.exists('temp.txt')).toBe(true);
    await nfs.deleteFile('temp.txt');
    expect(await nfs.exists('temp.txt')).toBe(false);

    // deleting non-existent file should not throw
    await expect(nfs.deleteFile('nope.txt')).resolves.toBeUndefined();
  });

  test('copyFile and moveFile', async () => {
    await nfs.writeFile('a.txt', 'a');
    await nfs.copyFile('a.txt', 'b.txt');
    expect(await nfs.exists('b.txt')).toBe(true);

    await nfs.moveFile('b.txt', 'c.txt');
    expect(await nfs.exists('b.txt')).toBe(false);
    expect(await nfs.exists('c.txt')).toBe(true);
  });

  test('listDirectory pagination and recursive', async () => {
    await nfs.writeFile('d1/f1.txt', '1', { createDirectories: true });
    await nfs.writeFile('d1/f2.txt', '2');
    await nfs.writeFile('d1/sub/f3.txt', '3', { createDirectories: true });

    const listing = await nfs.listDirectory('d1', { recursive: true });
    expect(listing.totalCount).toBeGreaterThanOrEqual(3);
    const paged = await nfs.listDirectory('d1', { recursive: true, limit: 1, offset: 0 });
    expect(paged.entries.length).toBe(1);
    expect(paged.hasMore).toBe(true);
  });

  test('getFileSystemStats and getStats', async () => {
    await nfs.writeFile('s1.txt', 'hello');
    await nfs.writeFile('s2.txt', 'world');

    const stats = await nfs.getFileSystemStats('.');
    expect(stats.totalFiles).toBeGreaterThanOrEqual(2);
    expect(stats.totalSize).toBeGreaterThan(0);

    const entry = await nfs.getStats('s1.txt');
    expect(entry.name).toBe('s1.txt');
    expect(entry.type).toBe('file');
  });
});
