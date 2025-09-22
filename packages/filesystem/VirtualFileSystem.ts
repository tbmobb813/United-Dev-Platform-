import * as mime from 'mime-types';
import {
  CreateFileOptions,
  DirectoryListing,
  FileSystemEntry,
  FileSystemEvent,
  FileSystemEventType,
  FileSystemProvider,
  FileSystemStats,
  FileWatchEvent,
  ListDirectoryOptions,
  MoveOptions,
  ReadFileOptions,
} from './types';

/**
 * Virtual file system implementation for browser environments
 * Uses IndexedDB for persistence and provides a Node.js-like API
 */
export class VirtualFileSystem implements FileSystemProvider {
  private dbName: string;
  private db: IDBDatabase | null = null;
  private watchers: Map<string, Set<(event: FileWatchEvent) => void>> =
    new Map();
  private initialized = false;

  constructor(dbName = 'udp-filesystem') {
    this.dbName = dbName;
  }

  private async initializeDB(): Promise<void> {
    if (this.initialized && this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create file store
        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', { keyPath: 'path' });
          fileStore.createIndex('parentPath', 'parentPath', { unique: false });
          fileStore.createIndex('type', 'type', { unique: false });
          fileStore.createIndex('lastModified', 'lastModified', {
            unique: false,
          });
        }

        // Create metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initializeDB();
    }
  }

  private getParentPath(path: string): string {
    const normalized = this.resolvePath(path);
    if (normalized === '/') {
      return '/';
    }
    return this.dirname(normalized);
  }

  private async getTransaction(
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBTransaction> {
    await this.ensureInitialized();
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db.transaction(['files'], mode);
  }

  private async notifyWatchers(event: FileWatchEvent): Promise<void> {
    const pathWatchers = this.watchers.get(event.path);
    if (pathWatchers) {
      pathWatchers.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error in file watcher callback:', error);
        }
      });
    }

    // Notify directory watchers for parent directories
    let currentPath = this.getParentPath(event.path);
    while (currentPath !== '/') {
      const dirWatchers = this.watchers.get(currentPath);
      if (dirWatchers) {
        dirWatchers.forEach(callback => {
          try {
            callback(event);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error in directory watcher callback:', error);
          }
        });
      }
      currentPath = this.getParentPath(currentPath);
    }
  }

  // Core file operations
  async readFile(
    path: string,
    options: ReadFileOptions = {}
  ): Promise<string | Uint8Array> {
    const normalizedPath = this.resolvePath(path);
    const transaction = await this.getTransaction('readonly');
    const store = transaction.objectStore('files');

    return new Promise((resolve, reject) => {
      const request = store.get(normalizedPath);

      request.onsuccess = () => {
        const entry = request.result as FileSystemEntry;
        if (!entry) {
          reject(new Error(`File not found: ${normalizedPath}`));
          return;
        }

        if (entry.type !== 'file') {
          reject(new Error(`Path is not a file: ${normalizedPath}`));
          return;
        }

        const content = entry.content || '';
        const encoding = options.encoding || entry.encoding || 'utf8';

        if (encoding === 'utf8') {
          resolve(content);
        } else if (encoding === 'base64') {
          resolve(content);
        } else {
          // Convert to Uint8Array for binary
          const encoder = new TextEncoder();
          resolve(encoder.encode(content));
        }
      };

      request.onerror = () => {
        reject(new Error(`Failed to read file: ${normalizedPath}`));
      };
    });
  }

  async writeFile(
    path: string,
    content: string | Uint8Array,
    options: CreateFileOptions = {}
  ): Promise<void> {
    const normalizedPath = this.resolvePath(path);
    const parentPath = this.getParentPath(normalizedPath);

    // Ensure parent directory exists
    if (options.createDirectories && parentPath !== '/') {
      await this.createDirectory(parentPath, true);
    }

    const encoding = options.encoding || 'utf8';
    let stringContent: string;

    if (content instanceof Uint8Array) {
      if (encoding === 'base64') {
        stringContent = btoa(String.fromCharCode(...content));
      } else {
        const decoder = new TextDecoder();
        stringContent = decoder.decode(content);
      }
    } else {
      stringContent = content;
    }

    const entry: FileSystemEntry = {
      name: this.basename(normalizedPath),
      path: normalizedPath,
      type: 'file',
      size: stringContent.length,
      lastModified: new Date(),
      content: stringContent,
      encoding,
      permissions: {
        readable: true,
        writable: true,
        executable: false,
      },
    };

    const transaction = await this.getTransaction('readwrite');
    const store = transaction.objectStore('files');

    return new Promise((resolve, reject) => {
      // Check if file exists and overwrite is disabled
      if (!options.overwrite) {
        const checkRequest = store.get(normalizedPath);
        checkRequest.onsuccess = () => {
          if (checkRequest.result) {
            reject(new Error(`File already exists: ${normalizedPath}`));
            return;
          }
          // File doesn't exist, proceed with creation
          proceedWithWrite();
        };
      } else {
        proceedWithWrite();
      }

      function proceedWithWrite() {
        const request = store.put(entry);

        request.onsuccess = () => {
          resolve();
          // Notify watchers
          const event: FileWatchEvent = {
            type: 'created',
            path: normalizedPath,
            entry,
            timestamp: new Date(),
          };
          // Don't await this to avoid blocking the write operation
          void notifyWatchers(event);
        };

        request.onerror = () => {
          reject(new Error(`Failed to write file: ${normalizedPath}`));
        };
      }

      const notifyWatchers = this.notifyWatchers.bind(this);
    });
  }

  async deleteFile(path: string): Promise<void> {
    const normalizedPath = this.resolvePath(path);
    const transaction = await this.getTransaction('readwrite');
    const store = transaction.objectStore('files');

    return new Promise((resolve, reject) => {
      // First get the entry to check if it exists and is a file
      const getRequest = store.get(normalizedPath);

      getRequest.onsuccess = () => {
        const entry = getRequest.result as FileSystemEntry;
        if (!entry) {
          reject(new Error(`File not found: ${normalizedPath}`));
          return;
        }

        if (entry.type !== 'file') {
          reject(new Error(`Path is not a file: ${normalizedPath}`));
          return;
        }

        // Delete the file
        const deleteRequest = store.delete(normalizedPath);

        deleteRequest.onsuccess = () => {
          resolve();
          // Notify watchers
          const event: FileWatchEvent = {
            type: 'deleted',
            path: normalizedPath,
            entry,
            timestamp: new Date(),
          };
          void this.notifyWatchers(event);
        };

        deleteRequest.onerror = () => {
          reject(new Error(`Failed to delete file: ${normalizedPath}`));
        };
      };

      getRequest.onerror = () => {
        reject(new Error(`Failed to access file: ${normalizedPath}`));
      };
    });
  }

  async copyFile(
    sourcePath: string,
    destinationPath: string,
    options: MoveOptions = {}
  ): Promise<void> {
    const content = await this.readFile(sourcePath);
    await this.writeFile(destinationPath, content, {
      overwrite: options.overwrite,
      createDirectories: options.createDirectories,
    });
  }

  async moveFile(
    sourcePath: string,
    destinationPath: string,
    options: MoveOptions = {}
  ): Promise<void> {
    await this.copyFile(sourcePath, destinationPath, options);
    await this.deleteFile(sourcePath);

    // Notify watchers about rename
    const event: FileWatchEvent = {
      type: 'renamed',
      path: destinationPath,
      oldPath: sourcePath,
      timestamp: new Date(),
    };
    await this.notifyWatchers(event);
  }

  // Directory operations
  async createDirectory(path: string, recursive = false): Promise<void> {
    const normalizedPath = this.resolvePath(path);

    if (recursive) {
      const parts = normalizedPath.split('/').filter(Boolean);
      let currentPath = '/';

      for (const part of parts) {
        currentPath = this.join(currentPath, part);
        if (!(await this.exists(currentPath))) {
          await this.createSingleDirectory(currentPath);
        }
      }
    } else {
      await this.createSingleDirectory(normalizedPath);
    }
  }

  private async createSingleDirectory(path: string): Promise<void> {
    const entry: FileSystemEntry = {
      name: this.basename(path),
      path,
      type: 'directory',
      lastModified: new Date(),
      permissions: {
        readable: true,
        writable: true,
        executable: true,
      },
    };

    const transaction = await this.getTransaction('readwrite');
    const store = transaction.objectStore('files');

    return new Promise((resolve, reject) => {
      const request = store.put(entry);

      request.onsuccess = () => {
        resolve();
        // Notify watchers
        const event: FileWatchEvent = {
          type: 'created',
          path,
          entry,
          timestamp: new Date(),
        };
        void this.notifyWatchers(event);
      };

      request.onerror = () => {
        reject(new Error(`Failed to create directory: ${path}`));
      };
    });
  }

  async deleteDirectory(path: string, recursive = false): Promise<void> {
    const normalizedPath = this.resolvePath(path);

    if (recursive) {
      // Get all entries in the directory
      const listing = await this.listDirectory(normalizedPath, {
        recursive: true,
      });

      // Delete all files first, then directories (bottom-up)
      const sortedEntries = listing.entries.sort(
        (a: FileSystemEntry, b: FileSystemEntry) => {
          // Files first, then directories
          if (a.type !== b.type) {
            return a.type === 'file' ? -1 : 1;
          }
          // Deeper paths first for directories
          return b.path.split('/').length - a.path.split('/').length;
        }
      );

      for (const entry of sortedEntries) {
        if (entry.type === 'file') {
          await this.deleteFile(entry.path);
        } else {
          await this.deleteSingleDirectory(entry.path);
        }
      }
    }

    // Delete the directory itself
    await this.deleteSingleDirectory(normalizedPath);
  }

  private async deleteSingleDirectory(path: string): Promise<void> {
    const transaction = await this.getTransaction('readwrite');
    const store = transaction.objectStore('files');

    return new Promise((resolve, reject) => {
      const request = store.delete(path);

      request.onsuccess = () => {
        resolve();
        // Notify watchers
        const event: FileWatchEvent = {
          type: 'deleted',
          path,
          timestamp: new Date(),
        };
        void this.notifyWatchers(event);
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete directory: ${path}`));
      };
    });
  }

  async listDirectory(
    path: string,
    options: ListDirectoryOptions = {}
  ): Promise<DirectoryListing> {
    const normalizedPath = this.resolvePath(path);
    const transaction = await this.getTransaction('readonly');
    const store = transaction.objectStore('files');

    return new Promise((resolve, reject) => {
      const entries: FileSystemEntry[] = [];
      const request = store.openCursor();

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const entry = cursor.value as FileSystemEntry;
          const entryParent = this.getParentPath(entry.path);

          // Check if entry is in the target directory
          if (options.recursive) {
            if (
              entry.path.startsWith(normalizedPath) &&
              entry.path !== normalizedPath
            ) {
              if (!options.filter || options.filter(entry)) {
                entries.push(entry);
              }
            }
          } else {
            if (entryParent === normalizedPath) {
              if (!options.filter || options.filter(entry)) {
                entries.push(entry);
              }
            }
          }

          cursor.continue();
        } else {
          // Apply pagination
          const offset = options.offset || 0;
          const limit = options.limit || entries.length;
          const paginatedEntries = entries.slice(offset, offset + limit);

          resolve({
            entries: paginatedEntries,
            totalCount: entries.length,
            hasMore: offset + limit < entries.length,
          });
        }
      };

      request.onerror = () => {
        reject(new Error(`Failed to list directory: ${normalizedPath}`));
      };
    });
  }

  // File system queries
  async exists(path: string): Promise<boolean> {
    const normalizedPath = this.resolvePath(path);
    const transaction = await this.getTransaction('readonly');
    const store = transaction.objectStore('files');

    return new Promise(resolve => {
      const request = store.get(normalizedPath);

      request.onsuccess = () => {
        resolve(!!request.result);
      };

      request.onerror = () => {
        resolve(false);
      };
    });
  }

  async getStats(path: string): Promise<FileSystemEntry> {
    const normalizedPath = this.resolvePath(path);
    const transaction = await this.getTransaction('readonly');
    const store = transaction.objectStore('files');

    return new Promise((resolve, reject) => {
      const request = store.get(normalizedPath);

      request.onsuccess = () => {
        const entry = request.result as FileSystemEntry;
        if (!entry) {
          reject(new Error(`Path not found: ${normalizedPath}`));
          return;
        }
        resolve(entry);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get stats for: ${normalizedPath}`));
      };
    });
  }

  async getFileSystemStats(path = '/'): Promise<FileSystemStats> {
    const listing = await this.listDirectory(path, { recursive: true });

    let totalFiles = 0;
    let totalDirectories = 0;
    let totalSize = 0;
    let lastModified = new Date(0);

    for (const entry of listing.entries) {
      if (entry.type === 'file') {
        totalFiles++;
        totalSize += entry.size || 0;
      } else {
        totalDirectories++;
      }

      if (entry.lastModified > lastModified) {
        lastModified = entry.lastModified;
      }
    }

    return {
      totalFiles,
      totalDirectories,
      totalSize,
      lastModified,
    };
  }

  // File watching
  async watchFile(
    path: string,
    callback: (event: FileWatchEvent) => void
  ): Promise<() => void> {
    const normalizedPath = this.resolvePath(path);

    if (!this.watchers.has(normalizedPath)) {
      this.watchers.set(normalizedPath, new Set());
    }

    this.watchers.get(normalizedPath)!.add(callback);

    // Return unwatch function
    return () => {
      const pathWatchers = this.watchers.get(normalizedPath);
      if (pathWatchers) {
        pathWatchers.delete(callback);
        if (pathWatchers.size === 0) {
          this.watchers.delete(normalizedPath);
        }
      }
    };
  }

  async watchDirectory(
    path: string,
    callback: (event: FileWatchEvent) => void,
    _recursive = false
  ): Promise<() => void> {
    const normalizedPath = this.resolvePath(path);

    if (!this.watchers.has(normalizedPath)) {
      this.watchers.set(normalizedPath, new Set());
    }

    this.watchers.get(normalizedPath)!.add(callback);

    // Return unwatch function
    return () => {
      const pathWatchers = this.watchers.get(normalizedPath);
      if (pathWatchers) {
        pathWatchers.delete(callback);
        if (pathWatchers.size === 0) {
          this.watchers.delete(normalizedPath);
        }
      }
    };
  }

  // Utility methods
  resolvePath(path: string): string {
    // Normalize path to always start with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Remove double slashes and resolve relative paths
    const parts = path.split('/').filter(Boolean);
    const resolved: string[] = [];

    for (const part of parts) {
      if (part === '..') {
        resolved.pop();
      } else if (part !== '.') {
        resolved.push(part);
      }
    }

    return '/' + resolved.join('/');
  }

  isAbsolute(path: string): boolean {
    return path.startsWith('/');
  }

  join(...paths: string[]): string {
    return this.resolvePath(paths.join('/'));
  }

  dirname(path: string): string {
    const normalized = this.resolvePath(path);
    if (normalized === '/') {
      return '/';
    }

    const lastSlash = normalized.lastIndexOf('/');
    if (lastSlash === 0) {
      return '/';
    }

    return normalized.substring(0, lastSlash);
  }

  basename(path: string): string {
    const normalized = this.resolvePath(path);
    if (normalized === '/') {
      return '/';
    }

    const lastSlash = normalized.lastIndexOf('/');
    return normalized.substring(lastSlash + 1);
  }

  extname(path: string): string {
    const name = this.basename(path);
    const lastDot = name.lastIndexOf('.');

    if (lastDot === -1 || lastDot === 0) {
      return '';
    }
    return name.substring(lastDot);
  }

  // Utility methods for MIME types
  getMimeType(path: string): string {
    return mime.lookup(path) || 'application/octet-stream';
  }

  getExtensionFromMimeType(mimeType: string): string | false {
    return mime.extension(mimeType);
  }

  // IFileSystem-specific methods for simplified watching
  async watch(
    path: string,
    callback: (event: FileSystemEvent) => void
  ): Promise<void> {
    const normalizedPath = this.resolvePath(path);

    // Create FileSystemEvent adapter for FileWatchEvent
    const adapter = (watchEvent: FileWatchEvent) => {
      const fsEvent: FileSystemEvent = {
        type: this.mapWatchEventToFileSystemEventType(watchEvent.type),
        path: watchEvent.path,
        stats: watchEvent.entry,
        timestamp: watchEvent.timestamp,
      };
      callback(fsEvent);
    };

    // Check if this is a file or directory to determine watch method
    try {
      const stats = await this.getStats(normalizedPath);
      if (stats.type === 'file') {
        await this.watchFile(normalizedPath, adapter);
      } else {
        await this.watchDirectory(normalizedPath, adapter, true);
      }
    } catch {
      // If path doesn't exist, watch as directory (it might be created later)
      await this.watchDirectory(normalizedPath, adapter, true);
    }
  }

  async unwatch(path: string): Promise<void> {
    const normalizedPath = this.resolvePath(path);
    const watchers = this.watchers.get(normalizedPath);

    if (watchers) {
      watchers.clear();
      this.watchers.delete(normalizedPath);
    }
  }

  private mapWatchEventToFileSystemEventType(
    type: 'created' | 'modified' | 'deleted' | 'renamed'
  ): FileSystemEventType {
    switch (type) {
      case 'created':
        return 'add';
      case 'modified':
        return 'change';
      case 'deleted':
        return 'unlink';
      case 'renamed':
        return 'change';
      default:
        return 'change';
    }
  }
}
