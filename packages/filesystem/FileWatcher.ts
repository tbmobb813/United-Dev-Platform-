import { EventEmitter } from 'events';
import logger from '@udp/logger';
import type {
  FileSystemEvent,
  FileSystemEventType,
  IFileSystem,
  YjsDocument,
} from './types';

export interface FileWatcherEvents {
  'file:changed': (path: string, content: string) => void;
  'file:deleted': (path: string) => void;
  'file:created': (path: string, content: string) => void;
  'directory:created': (path: string) => void;
  'directory:deleted': (path: string) => void;
  'sync:required': (path: string, operation: string) => void;
}

export interface SyncOperation {
  path: string;
  type:
    | 'file-change'
    | 'file-create'
    | 'file-delete'
    | 'dir-create'
    | 'dir-delete';
  content?: string;
  timestamp: number;
}

/**
 * FileWatcher connects filesystem changes to collaborative editing
 * Provides real-time sync between file system and Yjs documents
 */
export class FileWatcher extends EventEmitter {
  private fs: IFileSystem;
  private watchedPaths = new Set<string>();
  private syncQueue: SyncOperation[] = [];
  private isProcessing = false;
  private collaborativeDocuments = new Map<string, YjsDocument>(); // Map of file paths to Yjs documents
  private documentHandlers = new Map<string, (update: Uint8Array) => void>(); // Map of file paths to update handlers

  constructor(fs: IFileSystem) {
    super();
    this.fs = fs;
    this.setupFileSystemEventHandlers();
  }

  /**
   * Start watching a path for changes
   */
  public async watch(path: string): Promise<void> {
    if (this.watchedPaths.has(path)) {
      return;
    }

    try {
      await this.fs.watch(path, (event: FileSystemEvent) =>
        this.handleFileSystemEvent(event)
      );
      this.watchedPaths.add(path);
    } catch (error) {
      logger.error(`Failed to watch path ${path}:`, error);
      throw error;
    }
  }

  /**
   * Stop watching a path
   */
  public async unwatch(path: string): Promise<void> {
    if (!this.watchedPaths.has(path)) {
      return;
    }

    try {
      await this.fs.unwatch(path);
      this.watchedPaths.delete(path);
    } catch (error) {
      logger.error(`Failed to unwatch path ${path}:`, error);
      throw error;
    }
  }

  /**
   * Register a collaborative document for a file path
   */
  public registerCollaborativeDocument(
    filePath: string,
    yjsDoc: YjsDocument
  ): void {
    this.collaborativeDocuments.set(filePath, yjsDoc);

    // Create bound handler for document updates
    const updateHandler = (_update: Uint8Array) => {
      this.handleDocumentUpdate(filePath, yjsDoc);
    };

    // Store handler reference for cleanup
    this.documentHandlers.set(filePath, updateHandler);

    // Listen to document changes and sync back to filesystem
    yjsDoc.on('update', updateHandler);
  }

  /**
   * Unregister a collaborative document
   */
  public unregisterCollaborativeDocument(filePath: string): void {
    const yjsDoc = this.collaborativeDocuments.get(filePath);
    const handler = this.documentHandlers.get(filePath);

    if (yjsDoc && handler) {
      yjsDoc.off('update', handler);
    }

    this.collaborativeDocuments.delete(filePath);
    this.documentHandlers.delete(filePath);
  }

  /**
   * Force sync a file between filesystem and collaborative document
   */
  public async syncFile(filePath: string): Promise<void> {
    try {
      const fileContent = await this.fs.readFile(filePath);
      const yjsDoc = this.collaborativeDocuments.get(filePath);

      if (yjsDoc) {
        // Update Yjs document with file content
        const yText = yjsDoc.getText('content');
        yText.delete(0, yText.length);
        yText.insert(0, fileContent as string);
      }

      this.emit('file:changed', filePath, fileContent as string);
    } catch (error) {
      logger.error(`Failed to sync file ${filePath}:`, error);
    }
  }

  /**
   * Get current sync queue status
   */
  public getSyncStatus(): {
    queueLength: number;
    isProcessing: boolean;
    watchedPaths: string[];
  } {
    return {
      queueLength: this.syncQueue.length,
      isProcessing: this.isProcessing,
      watchedPaths: Array.from(this.watchedPaths),
    };
  }

  private setupFileSystemEventHandlers(): void {
    // Handle filesystem events and add to sync queue
  }

  private handleFileSystemEvent(event: FileSystemEvent): void {
    const operation: SyncOperation = {
      path: event.path,
      type: this.mapEventTypeToSyncType(event.type),
      timestamp: Date.now(),
    };

    // Add content for file operations
    if (event.type === 'change' || event.type === 'add') {
      this.fs
        .readFile(event.path)
        .then((content: string | Uint8Array) => {
          operation.content = content as string;
          this.addToSyncQueue(operation);
        })
        .catch((error: Error) => {
          logger.error(
            `Failed to read file content for sync: ${event.path}`,
            error
          );
        });
    } else {
      this.addToSyncQueue(operation);
    }
  }

  private addToSyncQueue(operation: SyncOperation): void {
    this.syncQueue.push(operation);
    this.processSyncQueue();
  }

  private async processSyncQueue(): Promise<void> {
    if (this.isProcessing || this.syncQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.syncQueue.length > 0) {
        const operation = this.syncQueue.shift()!;
        await this.processSyncOperation(operation);
      }
    } catch (error) {
      logger.error('Error processing sync queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processSyncOperation(operation: SyncOperation): Promise<void> {
    const { path, type, content } = operation;

    try {
      switch (type) {
        case 'file-change':
        case 'file-create':
          if (content !== undefined) {
            await this.syncFileToCollaborativeDoc(path, content);
            this.emit('file:changed', path, content);
          }
          break;

        case 'file-delete':
          await this.handleFileDelete(path);
          this.emit('file:deleted', path);
          break;

        case 'dir-create':
          this.emit('directory:created', path);
          break;

        case 'dir-delete':
          this.emit('directory:deleted', path);
          break;
      }

      this.emit('sync:required', path, type);
    } catch (error) {
      logger.error(`Failed to process sync operation for ${path}:`, error);
    }
  }

  private async syncFileToCollaborativeDoc(
    filePath: string,
    content: string
  ): Promise<void> {
    const yjsDoc = this.collaborativeDocuments.get(filePath);
    const handler = this.documentHandlers.get(filePath);

    if (yjsDoc && handler) {
      // Prevent circular updates by temporarily removing listener
      yjsDoc.off('update', handler);

      try {
        const yText = yjsDoc.getText('content');
        const currentContent = yText.toString();

        // Only update if content is different
        if (currentContent !== content) {
          yText.delete(0, yText.length);
          yText.insert(0, content);
        }
      } finally {
        // Restore the handler
        yjsDoc.on('update', handler);
      }
    }
  }

  private async handleDocumentUpdate(
    filePath: string,
    yjsDoc: YjsDocument
  ): Promise<void> {
    try {
      const yText = yjsDoc.getText('content');
      const content = yText.toString();

      // Write changes back to filesystem
      await this.fs.writeFile(filePath, content);
    } catch (error) {
      logger.error(
        `Failed to sync document changes to filesystem for ${filePath}:`,
        error
      );
    }
  }

  private async handleFileDelete(path: string): Promise<void> {
    // Clean up collaborative document
    this.unregisterCollaborativeDocument(path);
  }

  private mapEventTypeToSyncType(
    eventType: FileSystemEventType
  ): SyncOperation['type'] {
    switch (eventType) {
      case 'change':
        return 'file-change';
      case 'add':
        return 'file-create';
      case 'unlink':
        return 'file-delete';
      case 'addDir':
        return 'dir-create';
      case 'unlinkDir':
        return 'dir-delete';
      default:
        return 'file-change';
    }
  }

  /**
   * Clean up all watchers and sync operations
   */
  public async destroy(): Promise<void> {
    // Stop all watchers
    for (const path of this.watchedPaths) {
      try {
        await this.fs.unwatch(path);
      } catch (error) {
        logger.error(`Failed to cleanup watcher for ${path}:`, error);
      }
    }

    // Clean up all collaborative documents
    for (const [filePath] of this.collaborativeDocuments) {
      this.unregisterCollaborativeDocument(filePath);
    }

    this.watchedPaths.clear();
    this.syncQueue.length = 0;
    this.collaborativeDocuments.clear();
    this.documentHandlers.clear();
    this.removeAllListeners();
  }
}

export default FileWatcher;
