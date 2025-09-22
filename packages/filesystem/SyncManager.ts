import { EventEmitter } from 'events';
import { FileWatcher } from './FileWatcher';
import type { IFileSystem, YjsDocument } from './types';

export interface SyncManagerEvents {
  'sync:started': (path: string) => void;
  'sync:completed': (path: string) => void;
  'sync:failed': (path: string, error: Error) => void;
  'conflict:detected': (
    path: string,
    localContent: string,
    remoteContent: string
  ) => void;
  'status:changed': (status: SyncStatus) => void;
}

export interface SyncStatus {
  isActive: boolean;
  syncedFiles: number;
  queueSize: number;
  errors: string[];
  lastSync: Date | null;
}

export interface SyncConflictResolution {
  strategy: 'local' | 'remote' | 'merge' | 'manual';
  resolvedContent?: string;
}

/**
 * SyncManager orchestrates synchronization between filesystem and collaborative documents
 * Handles conflicts, manages sync queue, and provides status reporting
 */
export class SyncManager extends EventEmitter {
  private fs: IFileSystem;
  private fileWatcher: FileWatcher;
  private syncStatus: SyncStatus;
  private syncedFiles = new Set<string>();
  private conflictResolver:
    | ((
        path: string,
        local: string,
        remote: string
      ) => Promise<SyncConflictResolution>)
    | null = null;

  constructor(fs: IFileSystem) {
    super();
    this.fs = fs;
    this.fileWatcher = new FileWatcher(fs);
    this.syncStatus = {
      isActive: false,
      syncedFiles: 0,
      queueSize: 0,
      errors: [],
      lastSync: null,
    };

    this.setupFileWatcherHandlers();
  }

  /**
   * Start syncing a workspace directory
   */
  public async startSync(workspacePath: string): Promise<void> {
    if (this.syncStatus.isActive) {
      return;
    }

    try {
      this.syncStatus.isActive = true;
      this.emit('status:changed', this.syncStatus);
      this.emit('sync:started', workspacePath);

      // Start watching the workspace
      await this.fileWatcher.watch(workspacePath);

      this.syncStatus.lastSync = new Date();
      this.emit('status:changed', this.syncStatus);
    } catch (error) {
      this.syncStatus.isActive = false;
      this.syncStatus.errors.push(`Failed to start sync: ${error}`);
      this.emit('sync:failed', workspacePath, error as Error);
      this.emit('status:changed', this.syncStatus);
      throw error;
    }
  }

  /**
   * Stop syncing
   */
  public async stopSync(): Promise<void> {
    if (!this.syncStatus.isActive) {
      return;
    }

    try {
      await this.fileWatcher.destroy();
      this.syncStatus.isActive = false;
      this.emit('status:changed', this.syncStatus);
    } catch (error) {
      this.syncStatus.errors.push(`Failed to stop sync: ${error}`);
      this.emit('status:changed', this.syncStatus);
      throw error;
    }
  }

  /**
   * Register a collaborative document for syncing
   */
  public registerDocument(filePath: string, yjsDoc: YjsDocument): void {
    this.fileWatcher.registerCollaborativeDocument(filePath, yjsDoc);
    this.syncedFiles.add(filePath);
    this.syncStatus.syncedFiles = this.syncedFiles.size;
    this.emit('status:changed', this.syncStatus);
  }

  /**
   * Unregister a collaborative document
   */
  public unregisterDocument(filePath: string): void {
    this.fileWatcher.unregisterCollaborativeDocument(filePath);
    this.syncedFiles.delete(filePath);
    this.syncStatus.syncedFiles = this.syncedFiles.size;
    this.emit('status:changed', this.syncStatus);
  }

  /**
   * Force sync a specific file
   */
  public async syncFile(filePath: string): Promise<void> {
    try {
      await this.fileWatcher.syncFile(filePath);
      this.syncStatus.lastSync = new Date();
      this.emit('sync:completed', filePath);
      this.emit('status:changed', this.syncStatus);
    } catch (error) {
      this.syncStatus.errors.push(`Failed to sync ${filePath}: ${error}`);
      this.emit('sync:failed', filePath, error as Error);
      this.emit('status:changed', this.syncStatus);
      throw error;
    }
  }

  /**
   * Set a conflict resolution strategy
   */
  public setConflictResolver(
    resolver: (
      path: string,
      local: string,
      remote: string
    ) => Promise<SyncConflictResolution>
  ): void {
    this.conflictResolver = resolver;
  }

  /**
   * Get current sync status
   */
  public getStatus(): SyncStatus {
    const watcherStatus = this.fileWatcher.getSyncStatus();
    return {
      ...this.syncStatus,
      queueSize: watcherStatus.queueLength,
    };
  }

  /**
   * Get list of currently synced files
   */
  public getSyncedFiles(): string[] {
    return Array.from(this.syncedFiles);
  }

  /**
   * Clear sync errors
   */
  public clearErrors(): void {
    this.syncStatus.errors = [];
    this.emit('status:changed', this.syncStatus);
  }

  /**
   * Manually resolve a conflict
   */
  public async resolveConflict(
    filePath: string,
    resolution: SyncConflictResolution
  ): Promise<void> {
    if (!resolution.resolvedContent && resolution.strategy === 'manual') {
      throw new Error('Manual resolution requires resolved content');
    }

    try {
      let finalContent: string;

      switch (resolution.strategy) {
        case 'local':
          // Keep local version - read from filesystem
          finalContent = (await this.fs.readFile(filePath)) as string;
          break;
        case 'remote':
          // Use remote version - this should be provided
          if (!resolution.resolvedContent) {
            throw new Error('Remote resolution requires resolved content');
          }
          finalContent = resolution.resolvedContent;
          break;
        case 'manual':
        case 'merge':
          if (!resolution.resolvedContent) {
            throw new Error(
              'Manual/merge resolution requires resolved content'
            );
          }
          finalContent = resolution.resolvedContent;
          break;
        default:
          throw new Error(
            `Unknown resolution strategy: ${resolution.strategy}`
          );
      }

      // Write the resolved content to both filesystem and collaborative document
      await this.fs.writeFile(filePath, finalContent);
      await this.fileWatcher.syncFile(filePath);

      this.emit('sync:completed', filePath);
    } catch (error) {
      this.syncStatus.errors.push(
        `Failed to resolve conflict for ${filePath}: ${error}`
      );
      this.emit('sync:failed', filePath, error as Error);
      this.emit('status:changed', this.syncStatus);
      throw error;
    }
  }

  private setupFileWatcherHandlers(): void {
    this.fileWatcher.on('file:changed', (path: string, _content: string) => {
      // File was changed in filesystem, sync to collaborative document
      this.syncStatus.lastSync = new Date();
      this.emit('sync:completed', path);
      this.emit('status:changed', this.syncStatus);
    });

    this.fileWatcher.on('file:created', (path: string, _content: string) => {
      // New file created, sync to collaborative document
      this.syncStatus.lastSync = new Date();
      this.emit('sync:completed', path);
      this.emit('status:changed', this.syncStatus);
    });

    this.fileWatcher.on('file:deleted', (path: string) => {
      // File deleted, clean up
      this.unregisterDocument(path);
      this.emit('sync:completed', path);
    });

    this.fileWatcher.on(
      'sync:required',
      (_path: string, _operation: string) => {
        // Update queue size
        const watcherStatus = this.fileWatcher.getSyncStatus();
        this.syncStatus.queueSize = watcherStatus.queueLength;
        this.emit('status:changed', this.syncStatus);
      }
    );
  }

  /**
   * Clean up resources
   */
  public async destroy(): Promise<void> {
    await this.stopSync();
    this.removeAllListeners();
  }
}

export default SyncManager;
