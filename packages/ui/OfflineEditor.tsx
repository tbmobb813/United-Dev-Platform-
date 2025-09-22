import { createOfflineCollabDoc, SyncEvent, SyncStatus } from '@udp/editor-core';
import React, { useEffect, useState } from 'react';
import * as Y from 'yjs';

interface CollaborativeDocument {
  doc: Y.Doc;
  sync: () => Promise<boolean>;
  getStatus: () => SyncStatus;
  onSync: (callback: (event: SyncEvent) => void) => void;
  onOffline: (callback: (event: SyncEvent) => void) => void;
  destroy: () => void;
}

interface OfflineEditorProps {
  room: string;
  serverUrl?: string;
  children: (doc: Y.Doc, status: SyncStatus) => React.ReactNode;
}

/**
 * Demo component showing offline-enabled collaborative editing
 */
export const OfflineEditor: React.FC<OfflineEditorProps> = ({
  room,
  serverUrl = 'ws://localhost:1234',
  children,
}) => {
  const [collaborativeDoc, setCollaborativeDoc] = useState<CollaborativeDocument | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isConnected: false,
    lastSync: null,
    pendingChanges: 0,
    syncInProgress: false,
    error: null,
  });

  useEffect(() => {
    // Create offline-enabled collaborative document
    const collab = createOfflineCollabDoc({
      room,
      serverUrl,
      syncIntervalMs: 30000, // Sync every 30 seconds
      enableAutoSync: true,
      enableOfflineMode: true,
    });

    setCollaborativeDoc(collab);

    // Subscribe to sync events
    const handleSyncEvent = (event: SyncEvent) => {
      if (event.type === 'sync-complete' || event.type === 'sync-error') {
        setSyncStatus(collab.getStatus());
      }
      if (event.type === 'connection-change') {
        setSyncStatus(collab.getStatus());
      }
      if (event.type === 'offline-change') {
        setSyncStatus(collab.getStatus());
      }
    };

    collab.onSync(handleSyncEvent);
    collab.onOffline(handleSyncEvent);

    // Update status initially
    setSyncStatus(collab.getStatus());

    // Cleanup on unmount
    return () => {
      collab.destroy();
    };
  }, [room, serverUrl]);

  // Update sync status periodically
  useEffect(() => {
    if (!collaborativeDoc) {
      return;
    }

    const interval = window.setInterval(() => {
      setSyncStatus(collaborativeDoc.getStatus());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [collaborativeDoc]);

  if (!collaborativeDoc) {
    return <div>Initializing offline editor...</div>;
  }

  return (
    <div className='offline-editor'>
      <div className='sync-status'>
        <SyncStatusIndicator status={syncStatus} onManualSync={() => collaborativeDoc.sync()} />
      </div>
      {children(collaborativeDoc.doc, syncStatus)}
    </div>
  );
};

interface SyncStatusIndicatorProps {
  status: SyncStatus;
  onManualSync: () => void;
}

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ status, onManualSync }) => {
  const getStatusColor = () => {
    if (status.error) {
      return '#ef4444'; // red
    }
    if (status.syncInProgress) {
      return '#f59e0b'; // amber
    }
    if (!status.isOnline) {
      return '#6b7280'; // gray
    }
    if (status.isConnected) {
      return '#10b981'; // green
    }
    return '#f59e0b'; // amber for connecting
  };

  const getStatusText = () => {
    if (status.error) {
      return `Error: ${status.error}`;
    }
    if (status.syncInProgress) {
      return 'Syncing...';
    }
    if (!status.isOnline) {
      return 'Offline';
    }
    if (status.isConnected) {
      return 'Connected';
    }
    return 'Connecting...';
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      padding: '8px 12px',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Status indicator dot */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          flexShrink: 0,
        }}
      />
      
      {/* Status text */}
      <span style={{ color: '#374151' }}>{getStatusText()}</span>
      
      {/* Pending changes indicator */}
      {status.pendingChanges > 0 && (
        <span style={{ 
          color: '#f59e0b', 
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {status.pendingChanges} pending
        </span>
      )}
      
      {/* Last sync time */}
      {status.lastSync && (
        <span style={{ 
          color: '#6b7280', 
          fontSize: '12px' 
        }}>
          Last sync: {status.lastSync.toLocaleTimeString()}
        </span>
      )}
      
      {/* Manual sync button */}
      <button
        onClick={onManualSync}
        disabled={status.syncInProgress || !status.isOnline}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: status.isOnline ? '#3b82f6' : '#d1d5db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: status.isOnline ? 'pointer' : 'not-allowed',
          marginLeft: 'auto',
        }}
      >
        {status.syncInProgress ? 'Syncing...' : 'Sync'}
      </button>
    </div>
  );
};

/**
 * Example usage with Monaco Editor
 */
export const MonacoOfflineDemo: React.FC = () => {
  return (
    <OfflineEditor room='demo-room' serverUrl='ws://localhost:1234'>
      {(doc, status) => (
        <div style={{ height: '400px', border: '1px solid #e5e7eb' }}>
          <MonacoEditorWithYjs 
            doc={doc} 
            language='typescript'
            offline={!status.isConnected}
          />
        </div>
      )}
    </OfflineEditor>
  );
};

interface MonacoEditorWithYjsProps {
  doc: Y.Doc;
  language: string;
  offline: boolean;
}

const MonacoEditorWithYjs: React.FC<MonacoEditorWithYjsProps> = ({ 
  doc, 
  language: _language,
  offline 
}) => {
  useEffect(() => {
    // This would integrate with Monaco Editor
    // using y-monaco binding for real-time collaboration
    const textType = doc.getText('monaco');
    
    // Example of how to bind to Monaco (simplified)
    const updateHandler = () => {
      // Handle document updates
      // eslint-disable-next-line no-console
      console.log('Document updated');
    };
    
    textType.observe(updateHandler);
    
    return () => {
      textType.unobserve(updateHandler);
    };
  }, [doc]);

  return (
    <div style={{ 
      padding: '16px', 
      backgroundColor: offline ? '#fef3c7' : '#ffffff',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#374151'
    }}>
      {offline ? (
        <div>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>📝 Offline Mode</div>
          <div>Changes will sync when reconnected</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>🔗 Connected</div>
          <div>Real-time collaboration active</div>
        </div>
      )}
    </div>
  );
};

export default OfflineEditor;