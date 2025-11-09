'use client';

import React from 'react';
import styles from './styles/DemoPages.module.css';
import dynamic from 'next/dynamic';

// Import the heavy Yjs-based editor only on the client. Use dynamic import
// to keep the demo fast and avoid any SSR issues.
const OfflineEditorClient = dynamic(
  () =>
    import('../components/OfflineEditorClient').then(
      m => m as unknown as { default: React.ComponentType<Record<string, unknown>> }
    ),
  { ssr: false }
);
const OfflineEditorClientComp = OfflineEditorClient as unknown as React.ComponentType<
  Record<string, unknown>
>;

/**
 * Complete demonstration of offline-enabled collaborative editing
 */
const OfflineCollaborationDemo: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>🔗 Offline-Enabled Collaborative Platform</h1>

      <div className={styles.marginBottom20}>
        <h2>✨ Key Features Implemented:</h2>
        <ul className={styles.lineHeight16}>
          <li>
            <strong>🤖 Complete AI Integration Suite</strong>
            <ul>
              <li>Local Model Support (Ollama) for offline AI capabilities</li>
              <li>
                Intelligent Code Completion with caching and context awareness
              </li>
              <li>13+ Refactoring Tools with safety analysis</li>
              <li>Context-Aware Assistant with codebase understanding</li>
            </ul>
          </li>
          <li>
            <strong>📱 Offline Persistence with IndexedDB</strong>
            <ul>
              <li>Automatic synchronization when connection returns</li>
              <li>Real-time connection monitoring and status indication</li>
              <li>Seamless offline editing with change tracking</li>
              <li>Manual sync capabilities and error handling</li>
            </ul>
          </li>
          <li>
            <strong>🔄 Real-time Collaboration</strong>
            <ul>
              <li>WebSocket-based live collaboration with Yjs</li>
              <li>User awareness and presence indicators</li>
              <li>Conflict-free document merging</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.cardHeader}>
          📝 Live Collaborative Editor with Offline Support
        </div>

        <OfflineEditorClientComp
          // @ts-ignore - props are intentionally treated as unknown during rebase
          room='platform-demo'
          // @ts-ignore
          serverUrl='ws://localhost:1234'
        >
          {(doc: unknown, status: unknown) => {
            const statusRec = status as {
              isConnected?: boolean;
              pendingChanges?: number;
              lastSync?: Date;
            };

            return (
              <div className={styles.cardPadding}>
                <div
                  className={`${styles.mb20} ${statusRec.isConnected ? styles.onlineBox : styles.offlineBox}`}
                >
                  <h3 className={styles.statusHeaderTitle}>
                    {statusRec.isConnected ? '🌐 Online Mode' : '📱 Offline Mode'}
                  </h3>
                  <p className={styles.statusParagraph}>
                    {statusRec.isConnected
                      ? 'Real-time collaboration active. Changes sync instantly with other users.'
                      : 'Working offline. Your changes are being saved locally and will sync when you reconnect.'}
                  </p>
                  {statusRec.pendingChanges && statusRec.pendingChanges > 0 && (
                    <p className={styles.pendingChanges}>
                      📋 {statusRec.pendingChanges} changes pending sync
                    </p>
                  )}
                </div>

                <div className={styles.statusBox}>
                  <div className={styles.bigIcon}>
                    {statusRec.isConnected ? '⚡' : '💾'}
                  </div>
                  <h3 className={styles.statusTitle}>
                    {statusRec.isConnected
                      ? 'Connected & Synced'
                      : 'Offline Mode Active'}
                  </h3>
                  <p className={styles.statusParaSmall}>
                    {statusRec.isConnected
                      ? 'Your document is live and syncing with collaborators in real-time.'
                      : 'Continue editing! All changes are saved locally and will automatically sync when you reconnect.'}
                  </p>

                  {statusRec.lastSync && (
                    <p className={styles.pendingChanges}>
                      Last sync: {statusRec.lastSync.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          }}
        </OfflineEditorClientComp>
      </div>
      <div className={styles.footerSection}>
        <h3 className={styles.footerTitle}>🚀 Platform Status:</h3>
        <ul className={styles.footerList}>
          <li>✅ AI Integration Complete (OpenAI, Anthropic, Ollama)</li>
          <li>✅ Code Completion & Refactoring Tools</li>
          <li>✅ Context-Aware AI Assistant</li>
          <li>✅ Real-time Collaboration (Yjs + WebSocket)</li>
          <li>✅ Offline Persistence (IndexedDB)</li>
          <li>✅ Cross-Platform Support (Web, Mobile, Desktop)</li>
        </ul>
      </div>
    </div>
  );
};

export default OfflineCollaborationDemo;
