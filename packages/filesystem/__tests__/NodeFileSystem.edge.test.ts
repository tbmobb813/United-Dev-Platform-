import { NodeFileSystem } from '../NodeFileSystem';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

describe('NodeFileSystem edge and error cases', () => {
  let nfs: NodeFileSystem;
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nfs-edge-'));
    nfs = new NodeFileSystem(tmp);
  });

  afterEach(async () => {
    try {
      await nfs.deleteDirectory('/', true);
    } catch {}
  });

  it('throws when reading a non-existent file', async () => {
    await expect(nfs.readFile('nope.txt')).rejects.toThrow();
  });

  it('throws when writing a file that exists and overwrite is false', async () => {
    await nfs.writeFile('file.txt', 'abc', { overwrite: true });
    await expect(nfs.writeFile('file.txt', 'def', { overwrite: false })).rejects.toThrow();
  });

  it('writes and reads with base64 encoding', async () => {
    const data = Buffer.from('hello world');
    await nfs.writeFile('b64.txt', data.toString('base64'), { encoding: 'base64', overwrite: true });
    const read = await nfs.readFile('b64.txt', { encoding: 'base64' });
    expect(typeof read).toBe('string');
    expect(Buffer.from(read as string, 'base64').toString()).toBe('hello world');
  });

  it('creates directories recursively', async () => {
    await nfs.writeFile('a/b/c/file.txt', 'hi', { overwrite: true, createDirectories: true });
    const content = await nfs.readFile('a/b/c/file.txt');
    expect(content).toBe('hi');
  });

  it('deletes a non-existent file gracefully', async () => {
    await expect(nfs.deleteFile('nope.txt')).resolves.toBeUndefined();
  });

  it('lists an empty directory', async () => {
    await nfs.createDirectory('empty', true);
    const listing = await nfs.listDirectory('empty');
    expect(listing.entries.length).toBe(0);
  });

  it('returns false for exists on missing file', async () => {
    expect(await nfs.exists('nope.txt')).toBe(false);
  });
});
