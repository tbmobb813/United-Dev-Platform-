import Y from './yjs-singleton';
import type * as YTypes from './yjs-singleton';

import { FileWatcher } from '@udp/filesystem/FileWatcher';
import { NodeFileSystem } from '@udp/filesystem/NodeFileSystem';
import type { FileSystemEntry } from '@udp/filesystem/types';

/**
 * ProjectSyncManager manages collaborative file tree and file content sync using Yjs.
 * - Uses Y.Map<Y.Text> to represent the file tree and file contents.
 * - Supports lazy loading of file contents.
 * - Intended to be wired to @udp/filesystem file watcher for real-time updates.
 */
export class ProjectSyncManager {
  /**
   * The Yjs document for this project.
   */
  public readonly doc: YTypes.Doc;

  /**
   * The root map: keys are file paths, values are Y.Text (file content) or Y.Map (directory).
   */
  public readonly files: YTypes.Map<YTypes.Text | YTypes.Map<unknown>>;

  /**
   * Metadata map: keys are file/directory paths, values are metadata objects.
   */
  public readonly metadata: YTypes.Map<FileSystemEntry>;

  private fileWatcher?: FileWatcher;
  private fs?: NodeFileSystem;
  private readonly yjsObserver = async (
    event: YTypes.YMapEvent<YTypes.Text | YTypes.Map<unknown>>
  ) => {
    if (!this.fs) {
      return;
    }
    for (const [path, change] of event.changes.keys) {
      if (change.action === 'add' || change.action === 'update') {
        const newValue = this.files.get(path);
        if (newValue instanceof Y.Text) {
          const content = newValue.toString();
          await this.fs.writeFile(path, content);
          this.emit('file:synced', path, content);
        }
      } else if (change.action === 'delete') {
        await this.fs.deleteFile(path);
        this.emit('file:deleted', path);
      }
    }
  };

  constructor(fs?: NodeFileSystem) {
    this.doc = new Y.Doc();
    this.files = this.doc.getMap<YTypes.Text | YTypes.Map<unknown>>('files');
    this.metadata = this.doc.getMap<FileSystemEntry>('metadata');
    if (fs) {
      this.fs = fs;
      this.fileWatcher = new FileWatcher(fs);
      this.setupFileWatcher();
    }
    this.setupYjsToFsSync();
  }

  /**
   * Get or create a Y.Text for a file path. If not loaded, will lazy load from fs if available.
   */
  async getFileText(path: string): Promise<YTypes.Text> {
    let ytext = this.files.get(path) as YTypes.Text | undefined;
    if (!ytext) {
      ytext = new Y.Text();
      // Lazy load content if fs is available
      if (this.fs) {
        try {
          const content = await this.fs.readFile(path);
          ytext.insert(0, content as string);
        } catch {
          // File may not exist yet, ignore
        }
      }
      this.files.set(path, ytext);
    }
    return ytext;
  }

  /**
   * Get or create a Y.Map for a directory path. Optionally lazy load children.
   */
  async getDirectoryMap(path: string): Promise<YTypes.Map<unknown>> {
    let ymap = this.files.get(path) as YTypes.Map<unknown> | undefined;
    if (!ymap) {
      ymap = new Y.Map();
      // Lazy load children if fs is available
      if (this.fs) {
        try {
          const listing = await this.fs.listDirectory(path);
          for (const entry of listing.entries) {
            if (entry.type === 'file') {
              await this.getFileText(entry.path);
            } else if (entry.type === 'directory') {
              await this.getDirectoryMap(entry.path);
            }
            this.metadata.set(entry.path, entry);
          }
        } catch {
          // Directory may not exist yet, ignore
        }
      }
      this.files.set(path, ymap);
    }
    return ymap;
  }

  /**
   * Remove a file from the sync map.
   */
  removeFile(path: string): void {
    this.files.delete(path);
    this.metadata.delete(path);
  }

  /**
   * List all file paths currently tracked.
   */
  listFiles(): string[] {
    return Array.from(this.files.keys());
  }

  /**
   * Get metadata for a file or directory.
   */
  getMetadata(path: string): FileSystemEntry | undefined {
    return this.metadata.get(path);
  }

  /**
   * Set up file watcher integration to sync file system changes to Yjs.
   */
  private setupFileWatcher() {
    if (!this.fileWatcher) {
      return;
    }
    this.fileWatcher.on(
      'file:changed',
      async (path: string, content: string) => {
        let ytext = this.files.get(path) as YTypes.Text | undefined;
        if (!ytext) {
          ytext = new Y.Text();
          this.files.set(path, ytext);
        }
        ytext.delete(0, ytext.length);
        ytext.insert(0, content);
        this.emit('file:updated', path, content);
      }
    );
    this.fileWatcher.on('file:deleted', (path: string) => {
      this.files.delete(path);
      this.metadata.delete(path);
      this.emit('file:deleted', path);
    });
    this.fileWatcher.on('file:created', (path: string, content: string) => {
      this.getFileText(path).then(() => {
        this.emit('file:created', path, content);
      });
    });
    this.fileWatcher.on('directory:created', (path: string) => {
      this.getDirectoryMap(path).then(() => {
        this.emit('directory:created', path);
      });
    });
    this.fileWatcher.on('directory:deleted', (path: string) => {
      this.files.delete(path);
      this.metadata.delete(path);
      this.emit('directory:deleted', path);
    });
  }

  /**
   * Bi-directional sync: propagate Yjs changes to filesystem.
   */
  private setupYjsToFsSync() {
    this.files.observe(this.yjsObserver);
  }

  /**
   * Event emitter for external consumers (UI/server).
   */
  private listeners: Record<string, ((...args: unknown[]) => void)[]> = {};

  on(event: string, handler: (...args: unknown[]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  emit(event: string, ...args: unknown[]) {
    if (this.listeners[event]) {
      for (const fn of this.listeners[event]) {
        fn(...args);
      }
    }
  }

  /**
   * For testing: inject a mock FileWatcher.
   */
  setFileWatcher(watcher: FileWatcher) {
    this.fileWatcher = watcher;
    this.setupFileWatcher();
  }

  /**
   * For testing: inject a mock fs.
   */
  setFileSystem(fs: NodeFileSystem) {
    this.fs = fs;
  }

  async destroy(): Promise<void> {
    this.files.unobserve(this.yjsObserver);
    this.listeners = {};
    if (this.fileWatcher) {
      await this.fileWatcher.destroy();
      this.fileWatcher = undefined;
    }
    this.doc.destroy();
  }
}
