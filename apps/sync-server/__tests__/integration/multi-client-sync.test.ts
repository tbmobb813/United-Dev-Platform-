import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
// Increase Jest timeout for slow integration tests
jest.setTimeout(30000);
import WebSocket from 'ws';
import * as Y from 'yjs';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';
import { WebsocketProvider } from 'y-websocket';

const PORT = 18765; // Use different port for tests
const TEST_ROOM = 'test-room';
const WS_URL = `ws://localhost:${PORT}`;

let serverProc: ChildProcess;

function closeProvider(provider: WebsocketProvider): void {
  try {
    provider.disconnect();
  } catch (_error) {
    void _error;
  }
  try {
    provider.destroy();
  } catch (_error) {
    void _error;
  }
}

async function startTestServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const serverPath = path.resolve(__dirname, '../../server.js');
    serverProc = spawn('node', [serverPath], {
      env: { ...process.env, PORT: String(PORT), DATABASE_URL: 'file:./test.db' },
      stdio: 'pipe',
    });

    let ready = false;
    const timeout = setTimeout(() => {
      reject(new Error('Server failed to start within 5s'));
    }, 5000);

    serverProc.stdout?.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('listening')) {
        ready = true;
        clearTimeout(timeout);
        resolve();
      }
    });

    serverProc.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function stopTestServer(): Promise<void> {
  return new Promise((resolve) => {
    if (!serverProc || serverProc.killed) {
      resolve();
      return;
    }

    const fallback = setTimeout(() => resolve(), 2000);
    serverProc.once('exit', () => {
      clearTimeout(fallback);
      resolve();
    });
    serverProc.kill();
  });
}

describe('Multi-Client Sync Integration Tests', () => {
  beforeAll(async () => {
    await startTestServer();
    // Give server time to initialize
    await new Promise((r) => setTimeout(r, 500));
  });

  afterAll(async () => {
    await stopTestServer();
    // Cleanup test db
    const testDb = path.resolve(__dirname, '../../test.db');
    if (fs.existsSync(testDb)) {
      fs.unlinkSync(testDb);
    }
  });

  describe('Basic WebSocket connection', () => {
    it('connects to the sync server', async () => {
      const ws = new WebSocket(`${WS_URL}/${TEST_ROOM}?sessionId=test-1&projectId=test`);

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 3000);
        ws.on('open', () => resolve());
        ws.on('error', reject);
        ws.on('open', () => clearTimeout(timeout));
        ws.on('error', () => clearTimeout(timeout));
      });

      expect(ws.readyState).toBe(WebSocket.OPEN);
      ws.close();
    });

    it('receives message frame from server on connect', async () => {
      const ws = new WebSocket(`${WS_URL}/${TEST_ROOM}?sessionId=test-2&projectId=test`);

      const message = await new Promise<Uint8Array>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('No message received')), 3000);
        ws.on('open', () => {
          ws.on('message', (data) => {
            if (data instanceof Buffer) {
              clearTimeout(timeout);
              resolve(new Uint8Array(data));
            }
          });
        });
        ws.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      expect(message).toBeDefined();
      expect(message.length).toBeGreaterThan(0);
      ws.close();
    });
  });

  describe('Multi-client sync — file creation and edit', () => {
    it('client2 sees file created by client1', async () => {
      const doc1 = new Y.Doc();
      const doc2 = new Y.Doc();

      const provider1 = new WebsocketProvider(WS_URL, TEST_ROOM, doc1, {
        awareness: undefined,
      }) as any;
      const provider2 = new WebsocketProvider(WS_URL, TEST_ROOM, doc2, {
        awareness: undefined,
      }) as any;

      try {

      const files1 = doc1.getMap('files');
      const files2 = doc2.getMap('files');

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Providers failed to sync')), 15000);

        let syncCount = 0;
        const checkSync = () => {
          syncCount++;
          if (syncCount >= 2) {
            clearTimeout(timeout);
            resolve();
          }
        };

        provider1.on('sync', checkSync);
        provider2.on('sync', checkSync);
      });

      // Client 1 creates a file
      const ytext1 = new Y.Text();
      ytext1.insert(0, 'hello world');
      files1.set('/test.txt', ytext1);

      // Wait for sync to client2
      await new Promise<void>((resolve) => {
        const checkFile = () => {
          const ytext2 = files2.get('/test.txt') as Y.Text | undefined;
          if (ytext2 && ytext2.toString() === 'hello world') {
            clearInterval(interval);
            resolve();
          }
        };
        const interval = setInterval(checkFile, 100);
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 3000);
      });

      const ytext2 = files2.get('/test.txt') as Y.Text | undefined;
      expect(ytext2?.toString()).toBe('hello world');
      } finally {
        closeProvider(provider1);
        closeProvider(provider2);
        doc1.destroy();
        doc2.destroy();
      }
    });

    it('client2 sees edits made by client1', async () => {
      const doc1 = new Y.Doc();
      const doc2 = new Y.Doc();
      const roomId = `test-room-${Date.now()}`;

      const provider1 = new WebsocketProvider(WS_URL, roomId, doc1, {
        awareness: undefined,
      }) as any;
      const provider2 = new WebsocketProvider(WS_URL, roomId, doc2, {
        awareness: undefined,
      }) as any;

      try {

      const files1 = doc1.getMap('files');
      const files2 = doc2.getMap('files');

      // Wait for initial sync
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Initial sync failed')), 15000);
        let syncCount = 0;
        const checkSync = () => {
          syncCount++;
          if (syncCount >= 2) {
            clearTimeout(timeout);
            resolve();
          }
        };
        provider1.on('sync', checkSync);
        provider2.on('sync', checkSync);
      });

      // Client 1 creates and edits
      const ytext = new Y.Text();
      ytext.insert(0, 'original');
      files1.set('/editable.txt', ytext);

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      // Client 1 edits the file
      ytext.delete(0, 8); // remove 'original'
      ytext.insert(0, 'updated');

      // Wait for edit to sync to client2
      await new Promise<void>((resolve) => {
        const checkFile = () => {
          const ytext2 = files2.get('/editable.txt') as Y.Text | undefined;
          if (ytext2 && ytext2.toString() === 'updated') {
            clearInterval(interval);
            resolve();
          }
        };
        const interval = setInterval(checkFile, 100);
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 3000);
      });

      const ytext2 = files2.get('/editable.txt') as Y.Text | undefined;
      expect(ytext2?.toString()).toBe('updated');
      } finally {
        closeProvider(provider1);
        closeProvider(provider2);
        doc1.destroy();
        doc2.destroy();
      }
    });
  });

  describe('Multi-client sync — file deletion', () => {
    it('client2 sees file deleted by client1', async () => {
      const doc1 = new Y.Doc();
      const doc2 = new Y.Doc();
      const roomId = `test-room-${Date.now()}`;

      const provider1 = new WebsocketProvider(WS_URL, roomId, doc1, {
        awareness: undefined,
      }) as any;
      const provider2 = new WebsocketProvider(WS_URL, roomId, doc2, {
        awareness: undefined,
      }) as any;

      try {

      const files1 = doc1.getMap('files');
      const files2 = doc2.getMap('files');

      // Wait for initial sync
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Initial sync failed')), 15000);
        let syncCount = 0;
        const checkSync = () => {
          syncCount++;
          if (syncCount >= 2) {
            clearTimeout(timeout);
            resolve();
          }
        };
        provider1.on('sync', checkSync);
        provider2.on('sync', checkSync);
      });

      // Client 1 creates a file
      const ytext = new Y.Text();
      ytext.insert(0, 'to be deleted');
      files1.set('/temp.txt', ytext);

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      // Client 1 deletes the file
      files1.delete('/temp.txt');

      // Wait for deletion to sync to client2
      await new Promise<void>((resolve) => {
        const checkFile = () => {
          if (!files2.has('/temp.txt')) {
            clearInterval(interval);
            resolve();
          }
        };
        const interval = setInterval(checkFile, 100);
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 3000);
      });

      expect(files2.has('/temp.txt')).toBe(false);
      } finally {
        closeProvider(provider1);
        closeProvider(provider2);
        doc1.destroy();
        doc2.destroy();
      }
    });
  });

  describe('Disconnect and reconnect recovery', () => {
    it('reconnected client receives pending updates', async () => {
      const doc1 = new Y.Doc();
      const doc2 = new Y.Doc();
      const roomId = `test-room-reconnect-${Date.now()}`;

      const provider1 = new WebsocketProvider(WS_URL, roomId, doc1, {
        awareness: undefined,
      }) as any;
      const provider2 = new WebsocketProvider(WS_URL, roomId, doc2, {
        awareness: undefined,
      }) as any;

      try {

      const files1 = doc1.getMap('files');
      const files2 = doc2.getMap('files');

      // Wait for initial sync
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Initial sync failed')), 15000);
        let syncCount = 0;
        const checkSync = () => {
          syncCount++;
          if (syncCount >= 2) {
            clearTimeout(timeout);
            resolve();
          }
        };
        provider1.on('sync', checkSync);
        provider2.on('sync', checkSync);
      });

      // Disconnect client2
      provider2.disconnect();

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      // Client1 makes changes while client2 is disconnected
      const ytext = new Y.Text();
      ytext.insert(0, 'offline update');
      files1.set('/offline.txt', ytext);

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      // Reconnect client2
      provider2.connect();

      // Wait for client2 to receive the update
      await new Promise<void>((resolve) => {
        const checkFile = () => {
          const ytext2 = files2.get('/offline.txt') as Y.Text | undefined;
          if (ytext2 && ytext2.toString() === 'offline update') {
            clearInterval(interval);
            resolve();
          }
        };
        const interval = setInterval(checkFile, 100);
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 5000);
      });

      const ytext2 = files2.get('/offline.txt') as Y.Text | undefined;
      expect(ytext2?.toString()).toBe('offline update');
      } finally {
        closeProvider(provider1);
        closeProvider(provider2);
        doc1.destroy();
        doc2.destroy();
      }
    });
  });
});
