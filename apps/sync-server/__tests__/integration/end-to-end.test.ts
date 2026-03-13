import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
// Increase Jest timeout for slow integration tests
jest.setTimeout(30000);
import { spawn, ChildProcess } from 'child_process';
import * as Y from '@udp/editor-core/yjs-singleton';
import { WebsocketProvider } from 'y-websocket';
import path from 'path';
import fs from 'fs';

const PORT = 18767;
const WS_URL = `ws://localhost:${PORT}`;
const TEST_PROJECT_DIR = path.join(__dirname, '../.test-e2e-project');

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
      env: {
        ...process.env,
        PORT: String(PORT),
        DATABASE_URL: 'file:./test.db',
      },
      stdio: 'pipe',
    });

    // removed unused 'ready' variable
    const timeout = setTimeout(() => {
      reject(new Error('Server failed to start within 5s'));
    }, 5000);

    serverProc.stdout?.on('data', data => {
      const msg = data.toString();
      if (msg.includes('listening')) {
        clearTimeout(timeout);
        resolve();
      }
    });

    serverProc.on('error', err => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function stopTestServer(): Promise<void> {
  return new Promise(resolve => {
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

function setupTestProject(): void {
  if (!fs.existsSync(TEST_PROJECT_DIR)) {
    fs.mkdirSync(TEST_PROJECT_DIR, { recursive: true });
  }
  // Initialize with some files
  fs.writeFileSync(
    path.join(TEST_PROJECT_DIR, 'README.md'),
    '# Test Project\n'
  );
  fs.writeFileSync(
    path.join(TEST_PROJECT_DIR, 'index.ts'),
    'console.log("hello");'
  );
}

function cleanupTestProject(): void {
  if (fs.existsSync(TEST_PROJECT_DIR)) {
    fs.rmSync(TEST_PROJECT_DIR, { recursive: true });
  }
}

describe('End-to-End Sync Flow', () => {
  beforeAll(async () => {
    setupTestProject();
    await startTestServer();
    await new Promise(r => setTimeout(r, 500));
  });

  afterAll(async () => {
    await stopTestServer();
    cleanupTestProject();
  });

  describe('Complete sync scenario', () => {
    it('client 1 and client 2 can sync files created by each other', async () => {
      const doc1 = new Y.Doc();
      const doc2 = new Y.Doc();
      const roomId = `e2e-${Date.now()}`;

      const provider1 = new WebsocketProvider(WS_URL, roomId, doc1, {
        awareness: undefined,
      });
      const provider2 = new WebsocketProvider(WS_URL, roomId, doc2, {
        awareness: undefined,
      });

      try {
        const files1 = doc1.getMap('files');
        const files2 = doc2.getMap('files');

        // Wait for both clients to sync
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error('Initial sync failed')),
            15000
          );
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

        // Client 1 creates README.md
        const readme = new Y.Text();
        readme.insert(0, '# My Project\n\nThis is a test project.\n');
        files1.set('/README.md', readme);

        // Wait for sync
        await new Promise<void>(resolve => {
          const checkFile = () => {
            const readmeClient2 = files2.get('/README.md') as
              | Y.Text
              | undefined;
            if (
              readmeClient2 &&
              readmeClient2.toString().includes('My Project')
            ) {
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

        expect((files2.get('/README.md') as Y.Text)?.toString()).toContain(
          'My Project'
        );

        // Client 2 creates package.json
        const packageJson = new Y.Text();
        packageJson.insert(0, '{"name":"test-project","version":"1.0.0"}');
        files2.set('/package.json', packageJson);

        // Wait for sync
        await new Promise<void>(resolve => {
          const checkFile = () => {
            const pkgClient1 = files1.get('/package.json') as
              | Y.Text
              | undefined;
            if (pkgClient1 && pkgClient1.toString().includes('test-project')) {
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

        expect((files1.get('/package.json') as Y.Text)?.toString()).toContain(
          'test-project'
        );

        // Verify both clients see both files
        expect(files1.has('/README.md')).toBe(true);
        expect(files1.has('/package.json')).toBe(true);
        expect(files2.has('/README.md')).toBe(true);
        expect(files2.has('/package.json')).toBe(true);
      } finally {
        closeProvider(provider1);
        closeProvider(provider2);
        doc1.destroy();
        doc2.destroy();
      }
    });

    it('handles rapid concurrent edits from multiple clients', async () => {
      const doc1 = new Y.Doc();
      const doc2 = new Y.Doc();
      const roomId = `e2e-concurrent-${Date.now()}`;

      const provider1 = new WebsocketProvider(WS_URL, roomId, doc1, {
        awareness: undefined,
      });
      const provider2 = new WebsocketProvider(WS_URL, roomId, doc2, {
        awareness: undefined,
      });

      try {
        const files1 = doc1.getMap('files');
        const files2 = doc2.getMap('files');

        // Wait for initial sync
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error('Initial sync failed')),
            15000
          );
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

        // Create a shared document
        const code = new Y.Text();
        code.insert(0, '// start\n');
        files1.set('/app.ts', code);

        await new Promise<void>(resolve => {
          setTimeout(resolve, 500);
        });

        // Both clients edit simultaneously
        const codeClient2 = files2.get('/app.ts') as Y.Text;

        // Client 1 adds a line at the end
        code.insert(code.length, 'console.log("client1");\n');

        // Client 2 adds a line at the end
        codeClient2.insert(codeClient2.length, 'console.log("client2");\n');

        // Wait for convergence
        await new Promise<void>(resolve => {
          let client1Length = 0;
          let client2Length = 0;

          const checkConvergence = () => {
            client1Length = code.length;
            client2Length = codeClient2.length;
            // Both should converge to the same length
            if (client1Length > 0 && client1Length === client2Length) {
              clearInterval(interval);
              resolve();
            }
          };
          const interval = setInterval(checkConvergence, 100);
          setTimeout(() => {
            clearInterval(interval);
            resolve();
          }, 5000);
        });

        // Both clients should have both edits
        const finalCode1 = code.toString();
        const finalCode2 = codeClient2.toString();

        expect(finalCode1).toContain('client1');
        expect(finalCode1).toContain('client2');
        expect(finalCode2).toContain('client1');
        expect(finalCode2).toContain('client2');
      } finally {
        closeProvider(provider1);
        closeProvider(provider2);
        doc1.destroy();
        doc2.destroy();
      }
    });

    it('maintains consistency after multiple rounds of edits', async () => {
      const doc1 = new Y.Doc();
      const doc2 = new Y.Doc();
      const roomId = `e2e-consistency-${Date.now()}`;

      const provider1 = new WebsocketProvider(WS_URL, roomId, doc1, {
        awareness: undefined,
      });
      const provider2 = new WebsocketProvider(WS_URL, roomId, doc2, {
        awareness: undefined,
      });

      try {
        const files1 = doc1.getMap('files');
        const files2 = doc2.getMap('files');

        // Wait for initial sync
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error('Initial sync failed')),
            15000
          );
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

        // Create initial file
        const data = new Y.Text();
        data.insert(0, 'version: 1');
        files1.set('/data.txt', data);

        await new Promise<void>(resolve => {
          setTimeout(resolve, 500);
        });

        const dataClient2 = files2.get('/data.txt') as Y.Text;

        // Round 1: Client 1 edits
        data.delete(0, 10); // remove "version: 1"
        data.insert(0, 'version: 2');

        await new Promise<void>(resolve => {
          setTimeout(resolve, 500);
        });

        // Round 2: Client 2 edits
        dataClient2.delete(0, 10); // remove "version: 2"
        dataClient2.insert(0, 'version: 3');

        await new Promise<void>(resolve => {
          setTimeout(resolve, 500);
        });

        // Round 3: Client 1 edits again
        data.delete(0, 10); // remove "version: 3"
        data.insert(0, 'version: 4');

        // Wait for all edits to converge
        await new Promise<void>(resolve => {
          const checkConvergence = () => {
            if (
              data.toString() === 'version: 4' &&
              dataClient2.toString() === 'version: 4'
            ) {
              clearInterval(interval);
              resolve();
            }
          };
          const interval = setInterval(checkConvergence, 100);
          setTimeout(() => {
            clearInterval(interval);
            resolve();
          }, 3000);
        });

        // Both should converge to final version
        expect(data.toString()).toBe('version: 4');
        expect(dataClient2.toString()).toBe('version: 4');
      } finally {
        closeProvider(provider1);
        closeProvider(provider2);
        doc1.destroy();
        doc2.destroy();
      }
    });
  });
});
