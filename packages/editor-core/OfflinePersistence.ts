import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export interface OfflineConfig {
  room: string;
  serverUrl: string;
  syncIntervalMs?: number;
  enableAutoSync?: boolean;
  enableOfflineMode?: boolean;
  persistenceKey?: string;
}

export interface SyncStatus {
  isOnline: boolean;
  isConnected: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  syncInProgress: boolean;
  error: string | null;
}

export interface OfflineDocument {
  id: string;
  room: string;
  lastModified: Date;
  size: number;
  syncStatus: 'synced' | 'pending' | 'error' | 'offline';
}

export type SyncEvent =
  | { type: 'sync-start' }
  | { type: 'sync-complete'; success: boolean }
  | { type: 'sync-error'; error: string }
  | { type: 'connection-change'; isConnected: boolean }
  | { type: 'offline-change'; isOffline: boolean };

/**
 * Manages offline persistence and synchronization for collaborative documents
 */
export class OfflinePersistenceManager {
  private doc: Y.Doc;
  private websocketProvider: WebsocketProvider | null = null;
  private indexeddbProvider: IndexeddbPersistence | null = null;
  private config: OfflineConfig;
  private syncStatus: SyncStatus;
  private eventListeners: Map<string, ((event: SyncEvent) => void)[]> =
    new Map();
  private syncIntervalId: number | null = null;
  private connectionCheckInterval: number | null = null;

  constructor(config: OfflineConfig) {
    this.config = {
      syncIntervalMs: 30000, // 30 seconds default
      enableAutoSync: true,
      enableOfflineMode: true,
      persistenceKey: `udp-doc-${config.room}`,
      ...config,
    };

    this.syncStatus = {
      isOnline: navigator.onLine,
      isConnected: false,
      lastSync: null,
      pendingChanges: 0,
      syncInProgress: false,
      error: null,
    };

    this.doc = new Y.Doc();
    this.setupOfflineSupport();
  }

  private async setupOfflineSupport(): Promise<void> {
    // Set up IndexedDB persistence first
    if (this.config.enableOfflineMode) {
      await this.initializeIndexedDB();
    }

    // Set up WebSocket provider for online sync
    this.initializeWebSocketProvider();

    // Set up network monitoring
    this.setupNetworkMonitoring();

    // Set up automatic sync
    if (this.config.enableAutoSync) {
      this.startAutoSync();
    }

    // Monitor document changes
    this.setupDocumentMonitoring();
  }

  private async initializeIndexedDB(): Promise<void> {
    try {
      this.indexeddbProvider = new IndexeddbPersistence(
        this.config.persistenceKey!,
        this.doc
      );

      // Wait for IndexedDB to load existing data
      await new Promise<void>((resolve, reject) => {
        if (!this.indexeddbProvider) {
          reject(new Error('IndexedDB provider not initialized'));
          return;
        }

        this.indexeddbProvider.on('synced', () => {
          this.updateSyncStatus({
            lastSync: new Date(),
          });
          resolve();
        });

        this.indexeddbProvider.on('sync-error', (error: Error) => {
          this.updateSyncStatus({
            error: error.message,
          });
          reject(error);
        });

        // Timeout after 5 seconds if IndexedDB doesn't respond
        window.setTimeout(() => {
          reject(new Error('IndexedDB initialization timeout'));
        }, 5000);
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to initialize IndexedDB:', error);
      this.updateSyncStatus({
        error: `IndexedDB initialization failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      });
    }
  }

  private initializeWebSocketProvider(): void {
    this.websocketProvider = new WebsocketProvider(
      this.config.serverUrl,
      this.config.room,
      this.doc,
      {
        // Connect only if online and auto-sync is enabled
        connect: this.syncStatus.isOnline && this.config.enableAutoSync,
      }
    );

    // Monitor connection status
    this.websocketProvider.on('status', (event: { status: string }) => {
      const isConnected = event.status === 'connected';
      this.updateSyncStatus({ isConnected });

      this.emitEvent({
        type: 'connection-change',
        isConnected,
      });

      if (isConnected && this.hasPendingChanges()) {
        this.triggerSync();
      }
    });

    this.websocketProvider.on('connection-error', (error: Error) => {
      this.updateSyncStatus({
        error: error.message,
        isConnected: false,
      });

      this.emitEvent({
        type: 'sync-error',
        error: error.message,
      });
    });

    this.websocketProvider.on('sync', () => {
      this.updateSyncStatus({
        lastSync: new Date(),
        pendingChanges: 0,
        error: null,
      });

      this.emitEvent({
        type: 'sync-complete',
        success: true,
      });
    });
  }

  private setupNetworkMonitoring(): void {
    const handleOnline = () => {
      this.updateSyncStatus({ isOnline: true });
      this.emitEvent({ type: 'offline-change', isOffline: false });

      if (this.config.enableAutoSync && this.websocketProvider) {
        this.websocketProvider.connect();
      }
    };

    const handleOffline = () => {
      this.updateSyncStatus({ isOnline: false, isConnected: false });
      this.emitEvent({ type: 'offline-change', isOffline: true });

      if (this.websocketProvider) {
        this.websocketProvider.disconnect();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connection check
    this.connectionCheckInterval = window.setInterval(() => {
      this.checkConnectionHealth();
    }, 10000); // Check every 10 seconds
  }

  private setupDocumentMonitoring(): void {
    this.doc.on('update', () => {
      // Increment pending changes if offline
      if (!this.syncStatus.isConnected) {
        this.updateSyncStatus({
          pendingChanges: this.syncStatus.pendingChanges + 1,
        });
      }
    });
  }

  private startAutoSync(): void {
    if (this.syncIntervalId) {
      window.clearInterval(this.syncIntervalId);
    }

    this.syncIntervalId = window.setInterval(() => {
      if (this.syncStatus.isOnline && this.hasPendingChanges()) {
        this.triggerSync();
      }
    }, this.config.syncIntervalMs);
  }

  private async checkConnectionHealth(): Promise<void> {
    if (!this.syncStatus.isOnline) {
      return;
    }

    try {
      // Simple ping to check if server is reachable
      const controller = new window.AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        this.config.serverUrl.replace('ws', 'http'),
        {
          method: 'HEAD',
          signal: controller.signal,
        }
      );

      window.clearTimeout(timeoutId);

      if (!response.ok && this.syncStatus.isConnected) {
        // Server is not responding, but we think we're connected
        this.websocketProvider?.disconnect();
        this.updateSyncStatus({ isConnected: false });
      }
    } catch {
      // Network error - we might be offline
      if (this.syncStatus.isOnline) {
        this.updateSyncStatus({ isOnline: false, isConnected: false });
        this.emitEvent({ type: 'offline-change', isOffline: true });
      }
    }
  }

  public async triggerSync(): Promise<boolean> {
    if (this.syncStatus.syncInProgress) {
      return false;
    }

    if (!this.syncStatus.isOnline) {
      this.updateSyncStatus({
        error: 'Cannot sync while offline',
      });
      return false;
    }

    this.updateSyncStatus({
      syncInProgress: true,
      error: null,
    });

    this.emitEvent({ type: 'sync-start' });

    try {
      // Ensure WebSocket provider is connected
      if (!this.websocketProvider) {
        throw new Error('WebSocket provider not initialized');
      }

      if (!this.syncStatus.isConnected) {
        await new Promise<void>((resolve, reject) => {
          if (!this.websocketProvider) {
            reject(new Error('WebSocket provider not available'));
            return;
          }

          this.websocketProvider.connect();

          const timeout = window.setTimeout(() => {
            reject(new Error('Connection timeout'));
          }, 10000);

          this.websocketProvider.on('status', (event: { status: string }) => {
            if (event.status === 'connected') {
              window.clearTimeout(timeout);
              resolve();
            }
          });
        });
      }

      // Force sync by sending current document state
      if (this.doc.store.clients.size > 0) {
        const update = Y.encodeStateAsUpdate(this.doc);
        if (update.length > 0) {
          // Document has content to sync
          this.websocketProvider.awareness?.setLocalStateField(
            'forceSync',
            Date.now()
          );
        }
      }

      this.updateSyncStatus({
        syncInProgress: false,
        lastSync: new Date(),
        pendingChanges: 0,
        error: null,
      });

      this.emitEvent({ type: 'sync-complete', success: true });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown sync error';

      this.updateSyncStatus({
        syncInProgress: false,
        error: errorMessage,
      });

      this.emitEvent({
        type: 'sync-error',
        error: errorMessage,
      });

      return false;
    }
  }

  public async forceOfflineMode(): Promise<void> {
    if (this.websocketProvider) {
      this.websocketProvider.disconnect();
    }

    this.updateSyncStatus({
      isOnline: false,
      isConnected: false,
    });

    this.emitEvent({ type: 'offline-change', isOffline: true });
  }

  public async forceOnlineMode(): Promise<void> {
    this.updateSyncStatus({ isOnline: true });

    if (this.config.enableAutoSync && this.websocketProvider) {
      this.websocketProvider.connect();
    }

    this.emitEvent({ type: 'offline-change', isOffline: false });
  }

  public getDocument(): Y.Doc {
    return this.doc;
  }

  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  public hasPendingChanges(): boolean {
    return this.syncStatus.pendingChanges > 0;
  }

  public addEventListener(
    eventType: string,
    callback: (event: SyncEvent) => void
  ): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  public removeEventListener(
    eventType: string,
    callback: (event: SyncEvent) => void
  ): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitEvent(event: SyncEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  private updateSyncStatus(updates: Partial<SyncStatus>): void {
    this.syncStatus = { ...this.syncStatus, ...updates };
  }

  public async clearOfflineData(): Promise<void> {
    if (this.indexeddbProvider) {
      await this.indexeddbProvider.clearData();
    }
  }

  public async getOfflineDocuments(): Promise<OfflineDocument[]> {
    // This would typically query IndexedDB for all stored documents
    // For now, return current document info
    return [
      {
        id: this.config.persistenceKey!,
        room: this.config.room,
        lastModified: this.syncStatus.lastSync || new Date(),
        size: Y.encodeStateAsUpdate(this.doc).length,
        syncStatus: this.syncStatus.isConnected
          ? 'synced'
          : this.syncStatus.pendingChanges > 0
          ? 'pending'
          : this.syncStatus.error
          ? 'error'
          : 'offline',
      },
    ];
  }

  public destroy(): void {
    // Clean up intervals
    if (this.syncIntervalId) {
      window.clearInterval(this.syncIntervalId);
    }
    if (this.connectionCheckInterval) {
      window.clearInterval(this.connectionCheckInterval);
    }

    // Remove event listeners
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);

    // Destroy providers
    if (this.websocketProvider) {
      this.websocketProvider.destroy();
    }
    if (this.indexeddbProvider) {
      this.indexeddbProvider.destroy();
    }

    // Clear event listeners
    this.eventListeners.clear();
  }

  private handleOnline = () => {
    this.updateSyncStatus({ isOnline: true });
    this.emitEvent({ type: 'offline-change', isOffline: false });

    if (this.config.enableAutoSync && this.websocketProvider) {
      this.websocketProvider.connect();
    }
  };

  private handleOffline = () => {
    this.updateSyncStatus({ isOnline: false, isConnected: false });
    this.emitEvent({ type: 'offline-change', isOffline: true });

    if (this.websocketProvider) {
      this.websocketProvider.disconnect();
    }
  };
}

/**
 * Factory function to create an offline-enabled collaborative document
 */
export function createOfflineCollabDoc(config: OfflineConfig) {
  const manager = new OfflinePersistenceManager(config);

  return {
    doc: manager.getDocument(),
    manager,

    // Convenience methods
    sync: () => manager.triggerSync(),
    getStatus: () => manager.getSyncStatus(),
    onSync: (callback: (event: SyncEvent) => void) => {
      manager.addEventListener('sync-complete', callback);
      manager.addEventListener('sync-error', callback);
    },
    onOffline: (callback: (event: SyncEvent) => void) => {
      manager.addEventListener('offline-change', callback);
    },

    // Cleanup
    destroy: () => manager.destroy(),
  };
}
