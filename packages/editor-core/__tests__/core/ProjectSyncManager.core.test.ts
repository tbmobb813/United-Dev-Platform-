import { describe, expect, it, jest } from '@jest/globals';
import { ProjectSyncManager } from '../../ProjectSyncManager';

function createMockFs(overrides: Record<string, unknown> = {}) {
  return {
    readFile: jest.fn().mockResolvedValue(''),
    writeFile: jest.fn().mockResolvedValue(undefined),
    deleteFile: jest.fn().mockResolvedValue(undefined),
    listDirectory: jest
      .fn()
      .mockResolvedValue({ entries: [], totalCount: 0, hasMore: false }),
    watch: jest.fn().mockResolvedValue(undefined),
    unwatch: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function createMockWatcher() {
  const handlers: Record<string, ((...args: unknown[]) => void)[]> = {};
  return {
    on(event: string, handler: (...args: unknown[]) => void) {
      handlers[event] = handlers[event] ?? [];
      handlers[event].push(handler);
    },
    async destroy() {
      Object.keys(handlers).forEach(key => {
        handlers[key] = [];
      });
    },
    emit(event: string, ...args: unknown[]) {
      (handlers[event] ?? []).forEach(handler => handler(...args));
    },
  };
}

describe('ProjectSyncManager core behavior', () => {
  it('keeps empty text when filesystem read fails (invalid/missing path)', async () => {
    const mockFs = createMockFs({
      readFile: jest.fn().mockRejectedValue(new Error('ENOENT: missing')),
    });
    const manager = new ProjectSyncManager(mockFs as any);

    const ytext = await manager.getFileText('/missing/path.txt');

    expect(ytext.toString()).toBe('');
    expect(mockFs.readFile).toHaveBeenCalledWith('/missing/path.txt');
    await manager.destroy();
  });

  it('emits file:synced for large payload writes through Yjs observer', async () => {
    const largePayload = 'x'.repeat(512 * 1024);
    const mockFs = createMockFs({
      readFile: jest.fn().mockResolvedValue(largePayload),
    });
    const manager = new ProjectSyncManager(mockFs as any);
    const events: string[] = [];

    manager.on('file:synced', (path: unknown) => {
      events.push(String(path));
    });

    await manager.getFileText('/large-file.txt');
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockFs.writeFile).toHaveBeenCalledWith(
      '/large-file.txt',
      largePayload
    );
    expect(events).toContain('/large-file.txt');
    await manager.destroy();
  });

  it('handles rapid watcher updates in order (race-like sequence)', async () => {
    const manager = new ProjectSyncManager();
    const mockWatcher = createMockWatcher();

    manager.setFileWatcher(mockWatcher as any);
    const text = await manager.getFileText('/race.txt');

    mockWatcher.emit('file:changed', '/race.txt', 'v1');
    mockWatcher.emit('file:changed', '/race.txt', 'v2');
    mockWatcher.emit('file:changed', '/race.txt', 'v3');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(text.toString()).toBe('v3');
    await manager.destroy();
  });

  it('destroy cleans observers/listeners and calls watcher destroy once', async () => {
    const manager = new ProjectSyncManager();
    const mockWatcher = createMockWatcher();
    const watcherDestroySpy = jest.spyOn(mockWatcher, 'destroy');
    const callback = jest.fn();

    manager.on('file:synced', callback);
    manager.setFileWatcher(mockWatcher as any);

    await manager.destroy();
    manager.emit('file:synced', '/after-destroy');

    expect(watcherDestroySpy).toHaveBeenCalledTimes(1);
    expect(callback).not.toHaveBeenCalled();
  });
});
