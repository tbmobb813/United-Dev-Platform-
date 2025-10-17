'use client';

import React, { useEffect, useRef, useState } from 'react';
pnpm --filter ./apps/web add y-indexeddb

type Status = {
  isConnected: boolean;
  pendingChanges: number;
  lastSync?: Date;
};

interface OfflineEditorClientProps {
  room: string;
  serverUrl: string;
  children: (doc: Y.Doc, status: Status) => React.ReactNode;
}

export const OfflineEditorClient: React.FC<OfflineEditorClientProps> = ({
  room,
  serverUrl,
  children,
}) => {
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const [status, setStatus] = useState<Status>({
    isConnected: false,
    pendingChanges: 0,
    lastSync: undefined,
  });

  useEffect(() => {
    // Create Y.Doc
    const ydoc = new Y.Doc();
    docRef.current = ydoc;

    // IndexedDB persistence for offline support
    const persistence = new IndexeddbPersistence(room, ydoc);
    persistence.whenSynced
      .then(() => setStatus(s => ({ ...s, lastSync: new Date() })))
      .catch(() => {
        /* ignore */
      });

    // WebSocket provider for realtime collaboration
    const provider = new WebsocketProvider(serverUrl, room, ydoc);
    providerRef.current = provider;

    provider.on('status', (event: { status: string }) => {
      setStatus(s => ({ ...s, isConnected: event.status === 'connected' }));
    });

    // 'sync' event indicates whether the provider has synced at least once
    // with the server
    provider.on('sync', (isSynced: boolean) => {
      setStatus(s => ({
        ...s,
        pendingChanges: isSynced ? 0 : s.pendingChanges,
        lastSync: new Date(),
      }));
    });

    // Track local updates when offline to show pending changes
    const onUpdate = () => {
      // If the provider is not connected, increment pending changes
      if (!provider.wsconnected) {
        setStatus(s => ({ ...s, pendingChanges: s.pendingChanges + 1 }));
      }
    };

    ydoc.on('update', onUpdate);

    return () => {
      try {
        ydoc.off('update', onUpdate);
        provider.destroy();
      } catch {
        // ignore cleanup errors
      }
      // Note: IndexeddbPersistence doesn't provide a destroy API; let it GC
      docRef.current?.destroy?.();
      docRef.current = null;
      providerRef.current = null;
    };
  }, [room, serverUrl]);

  if (!docRef.current) {
    return <div>Loading editor...</div>;
  }

  return <>{children(docRef.current, status)}</>;
};

export default OfflineEditorClient;
