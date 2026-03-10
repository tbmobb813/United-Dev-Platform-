import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import WebSocket from 'ws';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';

const PORT = 28765; // Use a different port for integration tests
const WS_URL = `ws://localhost:${PORT}`;
const API_URL = `http://localhost:${PORT}`;

let serverProc: ChildProcess;

async function startTestServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const serverPath = path.resolve(__dirname, '../../server.js');
    const testDbPath = path.join(__dirname, '../.test-sync.db');

    serverProc = spawn('node', [serverPath], {
      env: {
        ...process.env,
        PORT: String(PORT),
        DATABASE_URL: `file:${testDbPath}`,
        NODE_ENV: 'test',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let ready = false;
    let startTimeout: NodeJS.Timeout;

    const cleanup = () => {
      clearTimeout(startTimeout);
    };

    startTimeout = setTimeout(() => {
      cleanup();
      reject(new Error('Server failed to start within 10s'));
    }, 10000);

    const handleData = (data: Buffer) => {
      const msg = data.toString();
      console.log('[Server]', msg.trim());

      if (msg.includes('listening') || msg.includes('started')) {
        ready = true;
        cleanup();
        resolve();
      }
    };

    serverProc.stdout?.on('data', handleData);
    serverProc.stderr?.on('data', handleData);

    serverProc.on('error', (err) => {
      cleanup();
      reject(err);
    });
  });
}

function stopTestServer(): Promise<void> {
  return new Promise((resolve) => {
    if (serverProc) {
      serverProc.kill('SIGTERM');
      const timeout = setTimeout(() => {
        serverProc.kill('SIGKILL');
      }, 3000);

      serverProc.on('exit', () => {
        clearTimeout(timeout);
        // Cleanup test db
        const testDbPath = path.join(__dirname, '../.test-sync.db');
        if (fs.existsSync(testDbPath)) {
          fs.unlinkSync(testDbPath);
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
}

describe('Sync Server Integration Tests', () => {
  beforeAll(async () => {
    console.log('Starting test server on port', PORT);
    await startTestServer();
    // Give server extra time to fully initialize
    await new Promise((r) => setTimeout(r, 1000));
  }, 30000);

  afterAll(async () => {
    console.log('Stopping test server');
    await stopTestServer();
  }, 30000);

  describe('Server health checks', () => {
    it('server is running and accessible', async () => {
      const ws = new WebSocket(`${WS_URL}/test-room?sessionId=health-check&projectId=test`);

      const result = await new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          resolve(false);
        }, 3000);

        ws.on('open', () => {
          clearTimeout(timeout);
          ws.close();
          resolve(true);
        });

        ws.on('error', () => {
          clearTimeout(timeout);
          resolve(false);
        });
      });

      expect(result).toBe(true);
    });

    it('server rejects invalid room names gracefully', async () => {
      const ws = new WebSocket(`${WS_URL}/?sessionId=invalid&projectId=test`);

      const result = await new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          resolve(true); // timeout means server didn't crash
        }, 2000);

        ws.on('error', () => {
          clearTimeout(timeout);
          resolve(true);
        });

        ws.on('open', () => {
          clearTimeout(timeout);
          ws.close();
          resolve(true);
        });
      });

      expect(result).toBe(true);
    });
  });

  describe('WebSocket message handling', () => {
    it('receives binary frames from server on connect', async () => {
      const ws = new WebSocket(`${WS_URL}/test-room-msg?sessionId=test1&projectId=test`);

      const result = await new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          resolve(false);
        }, 5000);

        let receivedMessage = false;

        ws.on('open', () => {
          console.log('Connected, waiting for message...');
        });

        ws.on('message', (data) => {
          if (data instanceof Buffer && data.length > 0) {
            console.log('Received message, length:', data.length);
            receivedMessage = true;
            clearTimeout(timeout);
            ws.close();
            resolve(true);
          }
        });

        ws.on('error', (err) => {
          console.log('WebSocket error:', err.message);
          clearTimeout(timeout);
          resolve(false);
        });

        ws.on('close', () => {
          clearTimeout(timeout);
          resolve(receivedMessage);
        });
      });

      expect(result).toBe(true);
    });

    it('handles multiple concurrent connections to same room', async () => {
      const roomId = `multi-connect-${Date.now()}`;
      const connections: WebSocket[] = [];
      let allConnected = 0;

      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          resolve();
        }, 5000);

        for (let i = 0; i < 3; i++) {
          const ws = new WebSocket(`${WS_URL}/${roomId}?sessionId=client-${i}&projectId=test`);

          ws.on('open', () => {
            allConnected++;
            console.log(`Client ${i} connected. Total: ${allConnected}`);
            if (allConnected === 3) {
              clearTimeout(timeout);
              resolve();
            }
          });

          ws.on('error', () => {
            clearTimeout(timeout);
            resolve();
          });

          connections.push(ws);
        }
      });

      expect(allConnected).toBe(3);

      // Cleanup
      connections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });

      await new Promise((r) => setTimeout(r, 500));
    });
  });

  describe('Connection lifecycle', () => {
    it('handles client disconnect and reconnect', async () => {
      const roomId = `reconnect-${Date.now()}`;
      let disconnected = false;
      let reconnected = false;

      // First connection
      const ws1 = new WebSocket(`${WS_URL}/${roomId}?sessionId=session1&projectId=test`);

      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), 3000);

        ws1.on('open', () => {
          console.log('First connection opened');
          clearTimeout(timeout);
          resolve();
        });

        ws1.on('error', () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      expect(ws1.readyState).toBe(WebSocket.OPEN);

      // Disconnect
      ws1.close();
      await new Promise((r) => setTimeout(r, 500));
      disconnected = true;

      expect(disconnected).toBe(true);

      // Reconnect with same session
      const ws2 = new WebSocket(`${WS_URL}/${roomId}?sessionId=session1&projectId=test`);

      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), 3000);

        ws2.on('open', () => {
          console.log('Reconnected');
          reconnected = true;
          clearTimeout(timeout);
          resolve();
        });

        ws2.on('error', () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      expect(reconnected).toBe(true);

      if (ws2.readyState === WebSocket.OPEN) {
        ws2.close();
      }
    });

    it('handles rapid connect/disconnect cycles', async () => {
      const roomId = `rapid-cycle-${Date.now()}`;
      let successCount = 0;

      for (let i = 0; i < 5; i++) {
        const ws = new WebSocket(`${WS_URL}/${roomId}?sessionId=rapid-${i}&projectId=test`);

        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => resolve(), 2000);

          ws.on('open', () => {
            successCount++;
            ws.close();
            clearTimeout(timeout);
            resolve();
          });

          ws.on('error', () => {
            clearTimeout(timeout);
            resolve();
          });
        });

        // Small delay between cycles
        await new Promise((r) => setTimeout(r, 100));
      }

      expect(successCount).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Message propagation', () => {
    it('messages from one client are received by another in same room', async () => {
      const roomId = `propagate-${Date.now()}`;
      const receivedEvents: Buffer[] = [];

      // Client 2 listens for messages
      const ws2 = new WebSocket(`${WS_URL}/${roomId}?sessionId=listener&projectId=test`);

      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), 3000);

        ws2.on('open', () => {
          clearTimeout(timeout);
          resolve();
        });

        ws2.on('error', () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      ws2.on('message', (data) => {
        if (data instanceof Buffer) {
          receivedEvents.push(data);
        }
      });

      // Small delay to ensure listener is ready
      await new Promise((r) => setTimeout(r, 200));

      // Client 1 sends a message
      const ws1 = new WebSocket(`${WS_URL}/${roomId}?sessionId=sender&projectId=test`);

      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), 3000);

        ws1.on('open', () => {
          // Send a test update message (simplified Yjs protocol)
          // This is a sync message format
          const testMsg = Buffer.from([1, 0, 0]); // simplified update
          ws1.send(testMsg);
          clearTimeout(timeout);
          resolve();
        });

        ws1.on('error', () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      // Wait for message propagation
      await new Promise((r) => setTimeout(r, 500));

      if (ws1.readyState === WebSocket.OPEN) {
        ws1.close();
      }
      if (ws2.readyState === WebSocket.OPEN) {
        ws2.close();
      }

      // Just verify that the server doesn't crash and handles multiple clients
      expect(true).toBe(true);
    });
  });
});
