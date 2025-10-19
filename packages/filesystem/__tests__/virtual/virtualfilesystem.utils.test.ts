import { VirtualFileSystem } from '../../VirtualFileSystem';
import { describe, it, expect } from '@jest/globals';

describe('VirtualFileSystem - utilities', () => {
  const vfs = new VirtualFileSystem('test-db-utils');

  it('resolves and normalizes paths', () => {
    expect(vfs.resolvePath('a/b')).toBe('/a/b');
    expect(vfs.resolvePath('/a/./b/..')).toBe('/a');
    expect(vfs.isAbsolute('/foo')).toBe(true);
    expect(vfs.isAbsolute('foo')).toBe(false);
  });

  it('basename, dirname, join, extname behave as expected', () => {
    expect(vfs.basename('/foo/bar.txt')).toBe('bar.txt');
    expect(vfs.dirname('/foo/bar.txt')).toBe('/foo');
    expect(vfs.join('/foo', 'bar', 'baz.txt')).toBe('/foo/bar/baz.txt');
    expect(vfs.extname('/foo/bar.txt')).toBe('.txt');
  });

  it('mime helpers return reasonable defaults', () => {
    const mimeType = vfs.getMimeType('file.txt');
    expect(typeof mimeType).toBe('string');
    expect(vfs.getExtensionFromMimeType('text/plain')).toBeTruthy();
  });
});
