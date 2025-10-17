/**
 * Git Package Index
 * Main entry point for the git integration package
 */

// Export types
export * from './types';

// Export GitService
export { GitService } from './GitService';

// Export GitServiceFactory and file system implementations
export {
  BrowserFileSystem,
  GitServiceFactory,
  NodeFileSystem,
  type FileSystemInterface,
} from './GitServiceFactory';

// Export default factory for convenience
export { default as createGitService } from './GitServiceFactory';
