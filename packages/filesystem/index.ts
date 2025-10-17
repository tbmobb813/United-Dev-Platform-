export { FileExplorer } from './FileExplorer';
export { FileManager } from './FileManager';
export { FileWatcher } from './FileWatcher';
export { NodeFileSystem } from './NodeFileSystem';
export { ProjectManager } from './ProjectManager';
export { ProjectNavigator } from './ProjectNavigator';
export { SyncManager } from './SyncManager';
export { VirtualFileSystem } from './VirtualFileSystem';
export { WorkspaceManager } from './WorkspaceManager';
export * from './types';

import { NodeFileSystem } from './NodeFileSystem';
import { ProjectManager } from './ProjectManager';
import { VirtualFileSystem } from './VirtualFileSystem';
import { WorkspaceManager } from './WorkspaceManager';
import { FileSystemProvider } from './types';

/**
 * Factory function to create the appropriate file system provider
 * based on the environment
 */
export function createFileSystem(options: {
  type: 'virtual' | 'node';
  basePath?: string;
  dbName?: string;
}): FileSystemProvider {
  switch (options.type) {
    case 'virtual':
      return new VirtualFileSystem(options.dbName);
    case 'node':
      return new NodeFileSystem(options.basePath);
    default:
      throw new Error(`Unknown file system type: ${options.type}`);
  }
}

/**
 * Auto-detect and create the appropriate file system provider
 */
export function createAutoFileSystem(
  options: {
    basePath?: string;
    dbName?: string;
  } = {}
): FileSystemProvider {
  // Check if we're in a Node.js environment
  if (
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node
  ) {
    return new NodeFileSystem(options.basePath);
  }

  // Default to virtual file system for browser environments
  return new VirtualFileSystem(options.dbName);
}

/**
 * Create a project manager with auto-detected file system
 */
export function createProjectManager(
  options: {
    fileSystem?: FileSystemProvider;
    basePath?: string;
    dbName?: string;
  } = {}
): ProjectManager {
  const fileSystem =
    options.fileSystem ||
    createAutoFileSystem({
      basePath: options.basePath,
      dbName: options.dbName,
    });

  return new ProjectManager(fileSystem);
}

/**
 * Create a workspace manager with auto-detected file system
 */
export function createWorkspaceManager(
  options: {
    fileSystem?: FileSystemProvider;
    sessionStoragePath?: string;
    basePath?: string;
    dbName?: string;
  } = {}
): WorkspaceManager {
  const fileSystem =
    options.fileSystem ||
    createAutoFileSystem({
      basePath: options.basePath,
      dbName: options.dbName,
    });

  return new WorkspaceManager(fileSystem, options.sessionStoragePath);
}

// Default export for convenience
export default createAutoFileSystem;
