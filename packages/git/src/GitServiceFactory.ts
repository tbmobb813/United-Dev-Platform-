/**
 * Git Service Factory
 * Creates GitService instances with appropriate file system implementations
 */

import { GitService } from './GitService';

/**
 * File System Interface for GitService
 * This interface allows GitService to work with different environments
 */
export interface FileSystemInterface {
  readFile(path: string): Promise<Uint8Array>;
  writeFile(path: string, data: Uint8Array): Promise<void>;
  readdir(path: string): Promise<string[]>;
  stat(path: string): Promise<{ isDirectory(): boolean; isFile(): boolean }>;
  exists(path: string): Promise<boolean>;
}

/**
 * Browser File System Implementation
 * Uses browser APIs and IndexedDB for file operations
 */
export class BrowserFileSystem implements FileSystemInterface {
  async readFile(path: string): Promise<Uint8Array> {
    // Browser implementation would use FileSystem API or other browser storage
    throw new Error('Browser file system not implemented yet');
  }

  async writeFile(_path: string, _data: Uint8Array): Promise<void> {
    throw new Error('Browser file system not implemented yet');
  }

  async readdir(_path: string): Promise<string[]> {
    throw new Error('Browser file system not implemented yet');
  }

  async stat(
    _path: string
  ): Promise<{ isDirectory(): boolean; isFile(): boolean }> {
    throw new Error('Browser file system not implemented yet');
  }

  async exists(_path: string): Promise<boolean> {
    throw new Error('Browser file system not implemented yet');
  }
}

/**
 * Node.js File System Implementation
 * Uses Node.js fs module for file operations
 */
export class NodeFileSystem implements FileSystemInterface {
  private fs: any;

  constructor() {
    // Dynamic import to avoid errors in browser environments
    if (typeof window === 'undefined' && typeof process !== 'undefined') {
      this.fs = require('fs').promises;
    }
  }

  async readFile(path: string): Promise<Uint8Array> {
    if (!this.fs) {
      throw new Error('Node.js file system not available in this environment');
    }
    return new Uint8Array(await this.fs.readFile(path));
  }

  async writeFile(path: string, data: Uint8Array): Promise<void> {
    if (!this.fs) {
      throw new Error('Node.js file system not available in this environment');
    }
    await this.fs.writeFile(path, data);
  }

  async readdir(path: string): Promise<string[]> {
    if (!this.fs) {
      throw new Error('Node.js file system not available in this environment');
    }
    return await this.fs.readdir(path);
  }

  async stat(
    path: string
  ): Promise<{ isDirectory(): boolean; isFile(): boolean }> {
    if (!this.fs) {
      throw new Error('Node.js file system not available in this environment');
    }
    const stats = await this.fs.stat(path);
    return {
      isDirectory: () => stats.isDirectory(),
      isFile: () => stats.isFile(),
    };
  }

  async exists(path: string): Promise<boolean> {
    if (!this.fs) {
      throw new Error('Node.js file system not available in this environment');
    }
    try {
      await this.fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Git Service Factory
 * Creates GitService instances with appropriate file system implementations
 */
export class GitServiceFactory {
  /**
   * Create a GitService instance for the current environment
   */
  static create(): GitService {
    if (typeof window !== 'undefined') {
      // Browser environment
      return new GitService(new BrowserFileSystem());
    } else {
      // Node.js environment
      return new GitService(new NodeFileSystem());
    }
  }

  /**
   * Create a GitService instance with a custom file system
   */
  static createWithFileSystem(fileSystem: FileSystemInterface): GitService {
    return new GitService(fileSystem);
  }
}

// Export default factory method for convenience
export default GitServiceFactory;
