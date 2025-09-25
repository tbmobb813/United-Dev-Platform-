import * as chokidar from 'chokidar';
import { Stats } from 'fs';
import * as fs from 'fs/promises';
import * as mime from 'mime-types';
import * as path from 'path';
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
 * Node.js file system implementation
 * Provides access to the real file system in server environments
 */
export class NodeFileSystem implements FileSystemProvider {
  private watchers: Map<string, chokidar.FSWatcher> = new Map();
  private basePath: string;

  constructor(basePath = process.cwd()) {
    this.basePath = path.resolve(basePath);
  }

  private resolveFullPath(inputPath: string): string {
    if (path.isAbsolute(inputPath)) {
      return path.resolve(inputPath);
    }
    return path.resolve(this.basePath, inputPath);
  }

  private async createFileSystemEntry(
    fullPath: string
  ): Promise<FileSystemEntry> {
    const stats = await fs.stat(fullPath);
    const relativePath = path.relative(this.basePath, fullPath);

    const entry: FileSystemEntry = {
      name: path.basename(fullPath),
      path: '/' + relativePath.replace(/\\/g, '/'),
      type: stats.isDirectory() ? 'directory' : 'file',
      size: stats.isFile() ? stats.size : undefined,
      lastModified: stats.mtime,
      permissions: {
        readable: true, // We'll assume readable for now
        writable: true, // We'll assume writable for now
        executable: stats.isFile() ? false : true,
      },
    };

    return entry;
  }

  // Core file operations
  async readFile(
    filePath: string,
    options: ReadFileOptions = {}
  ): Promise<string | Uint8Array> {
    const fullPath = this.resolveFullPath(filePath);
    const encoding = options.encoding || 'utf8';

    if (encoding === 'utf8') {
      return await fs.readFile(fullPath, 'utf8');
    } else if (encoding === 'base64') {
      const buffer = await fs.readFile(fullPath);
      return buffer.toString('base64');
    } else {
      // Binary
      const buffer = await fs.readFile(fullPath);
      return new Uint8Array(buffer);
    }
  }

  async writeFile(
    filePath: string,
    content: string | Uint8Array,
    options: CreateFileOptions = {}
  ): Promise<void> {
    const fullPath = this.resolveFullPath(filePath);
    const encoding = options.encoding || 'utf8';

    // Create directories if needed
    if (options.createDirectories) {
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
    }

    // Check if file exists and overwrite is disabled
    if (!options.overwrite) {
      try {
        await fs.access(fullPath);
        throw new Error(`File already exists: ${filePath}`);
      } catch {
        // File doesn't exist, proceed
      }
    }

    if (content instanceof Uint8Array) {
      await fs.writeFile(fullPath, content);
    } else if (encoding === 'base64') {
      const buffer = Buffer.from(content, 'base64');
      await fs.writeFile(fullPath, buffer);
    } else {
      await fs.writeFile(fullPath, content, 'utf8');
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = this.resolveFullPath(filePath);
    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      throw new Error(`Path is not a file: ${filePath}`);
    }

    await fs.unlink(fullPath);
  }

  async copyFile(
    sourcePath: string,
    destinationPath: string,
    options: MoveOptions = {}
  ): Promise<void> {
    const sourceFullPath = this.resolveFullPath(sourcePath);
    const destFullPath = this.resolveFullPath(destinationPath);

    // Create directories if needed
    if (options.createDirectories) {
      await fs.mkdir(path.dirname(destFullPath), { recursive: true });
    }

    // Check if destination exists and overwrite is disabled
    if (!options.overwrite) {
      try {
        await fs.access(destFullPath);
        throw new Error(`Destination already exists: ${destinationPath}`);
      } catch {
        // Destination doesn't exist, proceed
      }
    }

    await fs.copyFile(sourceFullPath, destFullPath);
  }

  async moveFile(
    sourcePath: string,
    destinationPath: string,
    options: MoveOptions = {}
  ): Promise<void> {
    await this.copyFile(sourcePath, destinationPath, options);
    await this.deleteFile(sourcePath);
  }

  // Directory operations
  async createDirectory(dirPath: string, recursive = false): Promise<void> {
    const fullPath = this.resolveFullPath(dirPath);
    await fs.mkdir(fullPath, { recursive });
  }

  async deleteDirectory(dirPath: string, recursive = false): Promise<void> {
    const fullPath = this.resolveFullPath(dirPath);

    if (recursive) {
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.rmdir(fullPath);
    }
  }

  async listDirectory(
    dirPath: string,
    options: ListDirectoryOptions = {}
  ): Promise<DirectoryListing> {
    const fullPath = this.resolveFullPath(dirPath);
    const entries: FileSystemEntry[] = [];

    const processDirectory = async (currentPath: string): Promise<void> => {
      const items = await fs.readdir(currentPath);

      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = await fs.stat(itemPath);

        // Skip hidden files unless explicitly requested
        if (!options.includeHidden && item.startsWith('.')) {
          continue;
        }

        const entry = await this.createFileSystemEntry(itemPath);

        // Apply filter if provided
        if (!options.filter || options.filter(entry)) {
          entries.push(entry);
        }

        // Recurse into subdirectories if requested
        if (options.recursive && stats.isDirectory()) {
          await processDirectory(itemPath);
        }
      }
    };

    await processDirectory(fullPath);

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || entries.length;
    const paginatedEntries = entries.slice(offset, offset + limit);

    return {
      entries: paginatedEntries,
      totalCount: entries.length,
      hasMore: offset + limit < entries.length,
    };
  }

  // File system queries
  async exists(filePath: string): Promise<boolean> {
    try {
      const fullPath = this.resolveFullPath(filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async getStats(filePath: string): Promise<FileSystemEntry> {
    const fullPath = this.resolveFullPath(filePath);
    return await this.createFileSystemEntry(fullPath);
  }

  async getFileSystemStats(dirPath = '/'): Promise<FileSystemStats> {
    const listing = await this.listDirectory(dirPath, { recursive: true });

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
    filePath: string,
    callback: (event: FileWatchEvent) => void
  ): Promise<() => void> {
    const fullPath = this.resolveFullPath(filePath);
    const watcher = chokidar.watch(fullPath, {
      persistent: true,
      ignoreInitial: true,
    });

    const eventHandler = async (eventType: string, eventPath: string) => {
      try {
        let entry: FileSystemEntry | undefined;

        if (eventType !== 'unlink' && eventType !== 'unlinkDir') {
          entry = await this.createFileSystemEntry(eventPath);
        }

        const watchEvent: FileWatchEvent = {
          type: this.mapChokidarEvent(eventType),
          path:
            '/' + path.relative(this.basePath, eventPath).replace(/\\/g, '/'),
          entry,
          timestamp: new Date(),
        };

        callback(watchEvent);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in file watcher:', error);
      }
    };

    watcher
      .on('add', filePath => eventHandler('add', filePath))
      .on('change', filePath => eventHandler('change', filePath))
      .on('unlink', filePath => eventHandler('unlink', filePath));

    this.watchers.set(fullPath, watcher);

    // Return unwatch function
    return () => {
      watcher.close();
      this.watchers.delete(fullPath);
    };
  }

  async watchDirectory(
    dirPath: string,
    callback: (event: FileWatchEvent) => void,
    recursive = false
  ): Promise<() => void> {
    const fullPath = this.resolveFullPath(dirPath);
    const watcher = chokidar.watch(fullPath, {
      persistent: true,
      ignoreInitial: true,
      depth: recursive ? undefined : 1,
    });

    const eventHandler = async (
      eventType: string,
      eventPath: string,
      oldPath?: string
    ) => {
      try {
        let entry: FileSystemEntry | undefined;

        if (eventType !== 'unlink' && eventType !== 'unlinkDir') {
          entry = await this.createFileSystemEntry(eventPath);
        }

        const watchEvent: FileWatchEvent = {
          type: this.mapChokidarEvent(eventType),
          path:
            '/' + path.relative(this.basePath, eventPath).replace(/\\/g, '/'),
          oldPath: oldPath
            ? '/' + path.relative(this.basePath, oldPath).replace(/\\/g, '/')
            : undefined,
          entry,
          timestamp: new Date(),
        };

        callback(watchEvent);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in directory watcher:', error);
      }
    };

    watcher
      .on('add', filePath => eventHandler('add', filePath))
      .on('addDir', dirPath => eventHandler('addDir', dirPath))
      .on('change', filePath => eventHandler('change', filePath))
      .on('unlink', filePath => eventHandler('unlink', filePath))
      .on('unlinkDir', dirPath => eventHandler('unlinkDir', dirPath));

    this.watchers.set(fullPath, watcher);

    // Return unwatch function
    return () => {
      watcher.close();
      this.watchers.delete(fullPath);
    };
  }

  private mapChokidarEvent(chokidarEvent: string): FileWatchEvent['type'] {
    switch (chokidarEvent) {
      case 'add':
      case 'addDir':
        return 'created';
      case 'change':
        return 'modified';
      case 'unlink':
      case 'unlinkDir':
        return 'deleted';
      default:
        return 'modified';
    }
  }

  // Utility methods
  resolvePath(inputPath: string): string {
    // Convert to forward slashes and normalize for the interface
    if (path.isAbsolute(inputPath)) {
      const relativePath = path.relative(this.basePath, inputPath);
      return '/' + relativePath.replace(/\\/g, '/');
    }
    return '/' + inputPath.replace(/\\/g, '/');
  }

  isAbsolute(inputPath: string): boolean {
    return path.isAbsolute(inputPath);
  }

  join(...paths: string[]): string {
    return path.join(...paths).replace(/\\/g, '/');
  }

  dirname(inputPath: string): string {
    return path.dirname(inputPath).replace(/\\/g, '/');
  }

  basename(inputPath: string): string {
    return path.basename(inputPath);
  }

  extname(inputPath: string): string {
    return path.extname(inputPath);
  }

  // Utility methods for MIME types
  getMimeType(inputPath: string): string {
    return mime.lookup(inputPath) || 'application/octet-stream';
  }

  getExtensionFromMimeType(mimeType: string): string | false {
    return mime.extension(mimeType);
  }

  // IFileSystem-specific methods for simplified watching
  async watch(
    targetPath: string,
    callback: (event: FileSystemEvent) => void
  ): Promise<void> {
    const normalizedPath = this.resolvePath(targetPath);

    // Create FileSystemEvent adapter for chokidar events
    const adapter = (eventType: string, eventPath: string, stats?: Stats) => {
      const fsEvent: FileSystemEvent = {
        type: this.mapChokidarEventToFileSystemEventType(eventType),
        path: eventPath,
        stats: stats ? this.convertStatsToEntry(eventPath, stats) : undefined,
        timestamp: new Date(),
      };
      callback(fsEvent);
    };

    // Use chokidar to watch the path
    const watcher = chokidar.watch(normalizedPath, {
      persistent: true,
      ignoreInitial: false,
      followSymlinks: false,
      depth: undefined, // Watch recursively
    });

    // Set up event handlers
    watcher
      .on('add', (eventPath, stats) => adapter('add', eventPath, stats))
      .on('change', (eventPath, stats) => adapter('change', eventPath, stats))
      .on('unlink', eventPath => adapter('unlink', eventPath))
      .on('addDir', (eventPath, stats) => adapter('addDir', eventPath, stats))
      .on('unlinkDir', eventPath => adapter('unlinkDir', eventPath))
      .on('ready', () => adapter('ready', normalizedPath))
      .on('error', error => {
        // eslint-disable-next-line no-console
        console.error('File watcher error:', error);
        adapter('error', normalizedPath);
      });

    this.watchers.set(normalizedPath, watcher);
  }

  async unwatch(targetPath: string): Promise<void> {
    const normalizedPath = this.resolvePath(targetPath);
    const watcher = this.watchers.get(normalizedPath);

    if (watcher) {
      await watcher.close();
      this.watchers.delete(normalizedPath);
    }
  }

  private mapChokidarEventToFileSystemEventType(
    eventType: string
  ): FileSystemEventType {
    switch (eventType) {
      case 'add':
        return 'add';
      case 'change':
        return 'change';
      case 'unlink':
        return 'unlink';
      case 'addDir':
        return 'addDir';
      case 'unlinkDir':
        return 'unlinkDir';
      case 'ready':
        return 'ready';
      case 'error':
        return 'error';
      default:
        return 'change';
    }
  }

  private convertStatsToEntry(filePath: string, stats: Stats): FileSystemEntry {
    return {
      name: this.basename(filePath),
      path: filePath,
      type: stats.isDirectory() ? 'directory' : 'file',
      size: stats.size,
      lastModified: stats.mtime,
      permissions: {
        readable: true, // Simplified - could check actual permissions
        writable: true,
        executable: stats.mode ? (stats.mode & 0o111) !== 0 : false,
      },
    };
  }

  // Cleanup method
  async destroy(): Promise<void> {
    for (const watcher of this.watchers.values()) {
      await watcher.close();
    }
    this.watchers.clear();
  }
}
