import { describe, it, expect, jest } from '@jest/globals';
import { VirtualFileSystem } from '../../VirtualFileSystem';
import type { FileSystemEntry } from '../../types';

type Request<T> = {
  result?: T;
  onsuccess: null | (() => void);
  onerror: null | (() => void);
};

type Cursor = {
  value: FileSystemEntry;
  continue: () => void;
};

function createAsyncRequest<T>(executor: (request: Request<T>) => void): Request<T> {
  const request: Request<T> = {
    result: undefined,
    onsuccess: null,
    onerror: null,
  };
  setTimeout(() => executor(request), 0);
  return request;
}

function createStore(seed: FileSystemEntry[] = []) {
  const entries = new Map<string, FileSystemEntry>();
  seed.forEach(entry => entries.set(entry.path, entry));

  return {
    objectStore() {
      return {
        get(path: string): Request<FileSystemEntry | undefined> {
          return createAsyncRequest(request => {
            request.result = entries.get(path);
            request.onsuccess?.();
          });
        },
        put(entry: FileSystemEntry): Request<FileSystemEntry> {
          return createAsyncRequest(request => {
            entries.set(entry.path, entry);
            request.result = entry;
            request.onsuccess?.();
          });
        },
        delete(path: string): Request<undefined> {
          return createAsyncRequest(request => {
            entries.delete(path);
            request.result = undefined;
            request.onsuccess?.();
          });
        },
        openCursor(): Request<Cursor | null> {
          const snapshot = Array.from(entries.values());
          let index = 0;
          const request: Request<Cursor | null> = {
            result: undefined,
            onsuccess: null,
            onerror: null,
          };

          const emit = () => {
            if (index < snapshot.length) {
              const current = snapshot[index];
              request.result = {
                value: current,
                continue: () => {
                  index += 1;
                  setTimeout(emit, 0);
                },
              };
            } else {
              request.result = null;
            }
            request.onsuccess?.();
          };

          setTimeout(emit, 0);
          return request;
        },
      };
    },
  };
}

function createTestVfs(seed: FileSystemEntry[] = []) {
  const vfs = new VirtualFileSystem('test-vfs-core');
  const transaction = createStore(seed);
  (vfs as any).getTransaction = jest.fn(async () => transaction);
  return { vfs };
}

describe('VirtualFileSystem - core operations', () => {
  it('writes, reads and lists files with recursive directory creation', async () => {
    const { vfs } = createTestVfs();

    await vfs.writeFile('/projects/app/src/index.ts', 'export const ok = true;', {
      createDirectories: true,
      overwrite: true,
    });

    const content = await vfs.readFile('/projects/app/src/index.ts');
    expect(content).toBe('export const ok = true;');

    const direct = await vfs.listDirectory('/projects/app/src');
    expect(direct.entries.map(entry => entry.path)).toContain('/projects/app/src/index.ts');

    const recursive = await vfs.listDirectory('/projects', { recursive: true });
    expect(recursive.totalCount).toBe(3);
  });

  it('rejects write when file exists and overwrite is false', async () => {
    const { vfs } = createTestVfs();

    await vfs.writeFile('/a.txt', 'first', { overwrite: true });

    await expect(vfs.writeFile('/a.txt', 'second', { overwrite: false })).rejects.toThrow(
      'File already exists: /a.txt'
    );
  });

  it('moves files and deletes source', async () => {
    const { vfs } = createTestVfs();

    await vfs.writeFile('/from/data.json', '{"v":1}', {
      createDirectories: true,
      overwrite: true,
    });

    await vfs.moveFile('/from/data.json', '/to/data.json', {
      createDirectories: true,
      overwrite: true,
    });

    await expect(vfs.readFile('/from/data.json')).rejects.toThrow('File not found: /from/data.json');
    await expect(vfs.readFile('/to/data.json')).resolves.toBe('{"v":1}');
  });

  it('deletes directories recursively', async () => {
    const { vfs } = createTestVfs();

    await vfs.writeFile('/workspace/a/file-1.ts', 'a', {
      createDirectories: true,
      overwrite: true,
    });
    await vfs.writeFile('/workspace/a/b/file-2.ts', 'b', {
      createDirectories: true,
      overwrite: true,
    });

    await vfs.deleteDirectory('/workspace/a', true);

    expect(await vfs.exists('/workspace/a/file-1.ts')).toBe(false);
    expect(await vfs.exists('/workspace/a/b/file-2.ts')).toBe(false);
    expect(await vfs.exists('/workspace/a')).toBe(false);
  });

  it('supports watchFile and unwatch callbacks', async () => {
    const { vfs } = createTestVfs();
    const callback = jest.fn();

    const unwatch = await vfs.watchFile('/watch/me.txt', callback);
    await vfs.writeFile('/watch/me.txt', 'hello', {
      createDirectories: true,
      overwrite: true,
    });

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(callback).toHaveBeenCalled();

    callback.mockClear();
    unwatch();
    await vfs.writeFile('/watch/me.txt', 'hello-again', {
      overwrite: true,
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(callback).not.toHaveBeenCalled();
  });
});
