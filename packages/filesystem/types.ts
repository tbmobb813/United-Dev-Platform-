export interface FileSystemEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified: Date;
  content?: string;
  encoding?: 'utf8' | 'base64' | 'binary';
  permissions?: FilePermissions;
  metadata?: Record<string, unknown>;
}

export interface FilePermissions {
  readable: boolean;
  writable: boolean;
  executable: boolean;
}

export interface DirectoryListing {
  entries: FileSystemEntry[];
  totalCount: number;
  hasMore: boolean;
}

export interface FileSystemStats {
  totalFiles: number;
  totalDirectories: number;
  totalSize: number;
  lastModified: Date;
}

export interface FileWatchEvent {
  type: 'created' | 'modified' | 'deleted' | 'renamed';
  path: string;
  oldPath?: string; // For rename events
  entry?: FileSystemEntry;
  timestamp: Date;
}

export interface CreateFileOptions {
  content?: string;
  encoding?: 'utf8' | 'base64' | 'binary';
  overwrite?: boolean;
  createDirectories?: boolean;
}

export interface ReadFileOptions {
  encoding?: 'utf8' | 'base64' | 'binary';
  maxSize?: number;
}

export interface ListDirectoryOptions {
  recursive?: boolean;
  includeHidden?: boolean;
  filter?: (entry: FileSystemEntry) => boolean;
  limit?: number;
  offset?: number;
}

export interface MoveOptions {
  overwrite?: boolean;
  createDirectories?: boolean;
}

// File system event types for file watching
export type FileSystemEventType =
  | 'add'
  | 'change'
  | 'unlink'
  | 'addDir'
  | 'unlinkDir'
  | 'ready'
  | 'error';

export interface FileSystemEvent {
  type: FileSystemEventType;
  path: string;
  stats?: FileSystemEntry;
  timestamp: Date;
}

// Yjs document interface for collaborative editing
export interface YjsDocument {
  getText(name: string): YjsText;
  on(event: string, callback: (update: Uint8Array) => void): void;
  off(event: string, callback: (update: Uint8Array) => void): void;
}

export interface YjsText {
  toString(): string;
  insert(index: number, text: string): void;
  delete(index: number, length: number): void;
  length: number;
}

// Main filesystem interface
export interface IFileSystem extends FileSystemProvider {
  // File watching with simplified callback
  watch(
    path: string,
    callback: (event: FileSystemEvent) => void
  ): Promise<void>;
  unwatch(path: string): Promise<void>;
}

export interface FileSystemProvider {
  // Core file operations
  readFile(
    path: string,
    options?: ReadFileOptions
  ): Promise<string | Uint8Array>;
  writeFile(
    path: string,
    content: string | Uint8Array,
    options?: CreateFileOptions
  ): Promise<void>;
  deleteFile(path: string): Promise<void>;
  copyFile(
    sourcePath: string,
    destinationPath: string,
    options?: MoveOptions
  ): Promise<void>;
  moveFile(
    sourcePath: string,
    destinationPath: string,
    options?: MoveOptions
  ): Promise<void>;

  // Directory operations
  createDirectory(path: string, recursive?: boolean): Promise<void>;
  deleteDirectory(path: string, recursive?: boolean): Promise<void>;
  listDirectory(
    path: string,
    options?: ListDirectoryOptions
  ): Promise<DirectoryListing>;

  // File system queries
  exists(path: string): Promise<boolean>;
  getStats(path: string): Promise<FileSystemEntry>;
  getFileSystemStats(path?: string): Promise<FileSystemStats>;

  // File watching
  watchFile(
    path: string,
    callback: (event: FileWatchEvent) => void
  ): Promise<() => void>;
  watchDirectory(
    path: string,
    callback: (event: FileWatchEvent) => void,
    recursive?: boolean
  ): Promise<() => void>;

  // Utility methods
  resolvePath(path: string): string;
  isAbsolute(path: string): boolean;
  join(...paths: string[]): string;
  dirname(path: string): string;
  basename(path: string): string;
  extname(path: string): string;
}
