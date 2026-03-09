import { ProjectSyncManager } from '../ProjectSyncManager';
import * as Y from 'yjs';
import { describe, it, expect, beforeEach } from '@jest/globals';

// ── Mock helpers ──────────────────────────────────────────────────────────────

/**
 * Minimal FileSystemProvider mock. Returns configurable canned values.
 */
function makeMockFs(overrides: Record<string, unknown> = {}) {
  return {
    readFile: jest.fn().mockResolvedValue(''),
    writeFile: jest.fn().mockResolvedValue(undefined),
    deleteFile: jest.fn().mockResolvedValue(undefined),
    listDirectory: jest.fn().mockResolvedValue({ entries: [], totalCount: 0, hasMore: false }),
    // IFileSystem extras
    watch: jest.fn().mockResolvedValue(undefined),
    unwatch: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

/**
 * Minimal EventEmitter-compatible FileWatcher mock.
 */
function makeMockWatcher() {
  const listeners: Record<string, ((...args: unknown[]) => void)[]> = {};
  return {
    on(event: string, handler: (...args: unknown[]) => void) {
      listeners[event] = listeners[event] ?? [];
      listeners[event].push(handler);
    },
    triggerEvent(event: string, ...args: unknown[]) {
      (listeners[event] ?? []).forEach(fn => fn(...args));
    },
  };
}

// ── Test suite ────────────────────────────────────────────────────────────────

describe('ProjectSyncManager', () => {

  // -- Pre-existing tests (keep and verify) ----------------------------------

  it('creates and retrieves Y.Text for a file', async () => {
    const manager = new ProjectSyncManager();
    const ytext = await manager.getFileText('foo.txt');
    expect(ytext).toBeInstanceOf(Y.Text);
    expect(manager.listFiles()).toContain('foo.txt');
  });

  it('removes a file from the sync map', async () => {
    const manager = new ProjectSyncManager();
    await manager.getFileText('bar.txt');
    manager.removeFile('bar.txt');
    expect(manager.listFiles()).not.toContain('bar.txt');
  });

  // -- Test Group 1: Lazy file content loading from FS -----------------------
  describe('getFileText — lazy loading', () => {

    it('reads from fs on first call and inserts content into Y.Text', async () => {
      const mockFs = makeMockFs({
        readFile: jest.fn().mockResolvedValue('hello world'),
      });
      const manager = new ProjectSyncManager(mockFs as any);
      const ytext = await manager.getFileText('/src/main.ts');

      expect((mockFs as any).readFile).toHaveBeenCalledWith('/src/main.ts');
      expect(ytext.toString()).toBe('hello world');
    });

    it('returns the same Y.Text instance on second call without re-reading fs', async () => {
      const mockFs = makeMockFs({
        readFile: jest.fn().mockResolvedValue('content'),
      });
      const manager = new ProjectSyncManager(mockFs as any);

      const first = await manager.getFileText('/index.ts');
      const second = await manager.getFileText('/index.ts');

      expect((mockFs as any).readFile).toHaveBeenCalledTimes(1); // not called again
      expect(first).toBe(second); // same reference
    });

    it('stores an empty Y.Text when fs.readFile throws', async () => {
      const mockFs = makeMockFs({
        readFile: jest.fn().mockRejectedValue(new Error('ENOENT')),
      });
      const manager = new ProjectSyncManager(mockFs as any);
      const ytext = await manager.getFileText('/missing.ts');

      expect(ytext).toBeInstanceOf(Y.Text);
      expect(ytext.toString()).toBe('');
    });
  });

  // -- Test Group 2: Lazy directory loading (covers listDirectory fix) -------
  describe('getDirectoryMap — lazy loading', () => {

    it('calls listDirectory and populates metadata for each entry', async () => {
      const fakeEntries = [
        { name: 'index.ts', path: '/src/index.ts', type: 'file' as const, lastModified: new Date() },
        { name: 'utils.ts', path: '/src/utils.ts', type: 'file' as const, lastModified: new Date() },
      ];
      const mockFs = makeMockFs({
        listDirectory: jest.fn().mockResolvedValue({
          entries: fakeEntries,
          totalCount: 2,
          hasMore: false,
        }),
        readFile: jest.fn().mockResolvedValue(''),
      });
      const manager = new ProjectSyncManager(mockFs as any);

      await manager.getDirectoryMap('/src');

      expect((mockFs as any).listDirectory).toHaveBeenCalledWith('/src');
      expect(manager.getMetadata('/src/index.ts')).toMatchObject({ path: '/src/index.ts', type: 'file' });
      expect(manager.getMetadata('/src/utils.ts')).toMatchObject({ path: '/src/utils.ts', type: 'file' });
    });

    it('returns the same Y.Map on second call without re-listing', async () => {
      const mockFs = makeMockFs({
        listDirectory: jest.fn().mockResolvedValue({ entries: [], totalCount: 0, hasMore: false }),
      });
      const manager = new ProjectSyncManager(mockFs as any);

      const first = await manager.getDirectoryMap('/src');
      const second = await manager.getDirectoryMap('/src');

      expect((mockFs as any).listDirectory).toHaveBeenCalledTimes(1);
      expect(first).toBe(second);
    });
  });

  // -- Test Group 3: FileWatcher integration --------------------------------
  describe('FileWatcher integration', () => {
    let manager: ProjectSyncManager;
    let mockWatcher: ReturnType<typeof makeMockWatcher>;
    let mockFs: ReturnType<typeof makeMockFs>;

    beforeEach(() => {
      mockFs = makeMockFs({ readFile: jest.fn().mockResolvedValue('') });
      manager = new ProjectSyncManager();
      manager.setFileSystem(mockFs as any);
      mockWatcher = makeMockWatcher();
      manager.setFileWatcher(mockWatcher as any);
    });

    it('updates Y.Text when watcher emits file:changed', async () => {
      const ytext = await manager.getFileText('/src/main.ts');

      mockWatcher.triggerEvent('file:changed', '/src/main.ts', 'updated content');
      await Promise.resolve();

      expect(ytext.toString()).toBe('updated content');
    });

    it('removes entry from files map when watcher emits file:deleted', async () => {
      await manager.getFileText('/src/main.ts');
      expect(manager.listFiles()).toContain('/src/main.ts');

      mockWatcher.triggerEvent('file:deleted', '/src/main.ts');
      await Promise.resolve();

      expect(manager.listFiles()).not.toContain('/src/main.ts');
    });

    it('creates a new Y.Text when watcher emits file:created', async () => {
      mockWatcher.triggerEvent('file:created', '/src/new.ts', 'brand new');
      await new Promise(r => setTimeout(r, 0));

      expect(manager.listFiles()).toContain('/src/new.ts');
    });

    it('creates a Y.Map when watcher emits directory:created', async () => {
      (mockFs as any).listDirectory = jest.fn().mockResolvedValue({ entries: [], totalCount: 0, hasMore: false });
      mockWatcher.triggerEvent('directory:created', '/src/newdir');
      await new Promise(r => setTimeout(r, 0));

      expect(manager.listFiles()).toContain('/src/newdir');
    });

    it('removes directory entry when watcher emits directory:deleted', async () => {
      await manager.getDirectoryMap('/src');
      expect(manager.listFiles()).toContain('/src');

      mockWatcher.triggerEvent('directory:deleted', '/src');
      await Promise.resolve();

      expect(manager.listFiles()).not.toContain('/src');
    });
  });

  // -- Test Group 4: Yjs-to-FS sync (Y.Text change → writeFile) -----------
  describe('Yjs-to-FS sync', () => {

    it('calls fs.writeFile when a new Y.Text is added to the files map', async () => {
      const mockFs = makeMockFs({ readFile: jest.fn().mockResolvedValue('test content') });
      const manager = new ProjectSyncManager(mockFs as any);

      // When getFileText is called, it inserts content into the Y.Text,
      // which triggers writeFile due to the observer
      await manager.getFileText('/output.ts');

      await new Promise(r => setTimeout(r, 10)); // Give async observer time to run

      // Verify writeFile was called with the file content
      expect((mockFs as any).writeFile).toHaveBeenCalledWith('/output.ts', 'test content');
    });

    it('calls fs.deleteFile when a file entry is deleted from the Y.Map', async () => {
      const mockFs = makeMockFs({ readFile: jest.fn().mockResolvedValue('') });
      const manager = new ProjectSyncManager(mockFs as any);

      await manager.getFileText('/gone.ts');
      // Reset mock to clear the initial write
      (mockFs as any).deleteFile.mockClear();

      manager.doc.transact(() => {
        manager.files.delete('/gone.ts');
      });

      await new Promise(r => setTimeout(r, 10));

      expect((mockFs as any).deleteFile).toHaveBeenCalledWith('/gone.ts');
    });
  });

});
