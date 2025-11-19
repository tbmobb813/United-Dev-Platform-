import { jest } from '@jest/globals';
import WebSocket from 'ws';

// Helpers
function waitForOpen(ws) {
  return new Promise((resolve, reject) => {
    if (ws.readyState === WebSocket.OPEN) {
      return resolve();
    }
    const onOpen = () => {
      cleanup();
      resolve();
    };
    const onError = err => {
      cleanup();
      reject(err);
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('WebSocket open timeout'));
    }, 5000);

    const cleanup = () => {
      ws.off('open', onOpen);
      ws.off('error', onError);
      clearTimeout(timer);
    };

    ws.on('open', onOpen);
    ws.on('error', onError);
  });
}

function waitForMessage(ws, type, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const onMessage = msg => {
      try {
        const parsed = JSON.parse(msg.toString());
        if (parsed && parsed.type === type) {
          cleanup();
          resolve(parsed);
        }
      } catch {
        // ignore binary/Yjs messages
      }
    };
    const onError = err => {
      cleanup();
      reject(err);
    };

    const cleanup = () => {
      ws.off('message', onMessage);
      ws.off('error', onError);
      clearTimeout(timer);
    };

    ws.on('message', onMessage);
    ws.on('error', onError);

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Timed out waiting for message ' + type));
    }, timeout);
  });
}

// Mock prisma so tests don't require a real DB
const mockFindFirst = jest.fn();
const mockUpsert = jest.fn();

// We intentionally do NOT mock fastify here; tests will start the real server in-process

jest.unstable_mockModule('@udp/db', async () => ({
  prisma: {
    collaborationSession: { findFirst: mockFindFirst },
    sessionParticipant: { upsert: mockUpsert },
  },
}));

// Import server after mocks so it uses mocked prisma (do import inside beforeAll)
let serverModule;
let serverActualPort;
// Use a per-Jest-worker port to avoid EADDRINUSE when tests run in parallel
const WORKER_ID = process.env.JEST_WORKER_ID
  ? Number(process.env.JEST_WORKER_ID)
  : 0;
const PORT = process.env.PORT ? Number(process.env.PORT) : 3030 + WORKER_ID;
// WS_URL not used; per-test URLs are constructed using the actual port

describe('handleJoinSession (integration)', () => {
  // increase hook timeout to allow server startup in parallel CI/workers
  beforeAll(async () => {
    // make findFirst return a valid session object
    mockFindFirst.mockResolvedValue({
      id: 'sess-integ',
      projectId: 'proj-integ',
      isActive: true,
      project: { ownerId: 'user-integ', members: [] },
      participants: [
        {
          isActive: true,
          userId: 'user-integ',
          user: { username: 'bob', name: 'Bob' },
        },
      ],
    });
    mockUpsert.mockResolvedValue({});

    // import server after mocks so it uses the mocked prisma and then start it
    serverModule = await import('../server.js');
    // Inject mocked prisma into the server module
    serverModule.__setPrisma({
      collaborationSession: { findFirst: mockFindFirst },
      sessionParticipant: { upsert: mockUpsert },
    });
    // request an ephemeral port to avoid collisions across parallel processes
    const started = await serverModule.startFastify({ port: 0 });
    // use the actual bound port
    const actualPort = started.port;
    // update WS_URL to use the actual port for this run
    // (recompute the const by creating a new WebSocket URL below when needed)
    // wait a short time for server to be fully listening
    await new Promise(resolve => setTimeout(resolve, 150));

    // expose actualPort for test that builds WS URL
    // IMPORTANT: do NOT assign to imported module namespace objects (they are
    // non-extensible in ESM worker VMs). Store the port in a test-scoped
    // variable instead so parallel test workers don't race or attempt writes.
    serverActualPort = actualPort;
  }, 20000);

  afterAll(async () => {
    // close the server via exported helper for cleaner teardown
    try {
      if (serverModule && serverModule.stopFastify) {
        await serverModule.stopFastify();
      } else if (
        serverModule &&
        serverModule.server &&
        serverModule.server.close
      ) {
        serverModule.server.close();
      }
    } catch {
      // ignore
    }
  });

  it('should handle join session message', async () => {
    const portToUse = serverActualPort || PORT;
    const ws = new WebSocket(
      `ws://localhost:${portToUse}/?sessionId=sess-integ&projectId=proj-integ&userId=user-integ`
    );
    await waitForOpen(ws);

    ws.send(JSON.stringify({ type: 'join-session' }));
    const response = await waitForMessage(ws, 'session-joined', 3000);

    expect(response.sessionId).toBe('sess-integ');

    // ensure the client socket is fully closed before finishing the test
    ws.close();
    await new Promise(resolve => {
      const timer = setTimeout(() => {
        // fallback: forcefully terminate if close doesn't arrive in time
        try {
          ws.terminate();
        } catch {
          /* ignore */
        }
        resolve();
      }, 2000);

      ws.on('close', () => {
        clearTimeout(timer);
        resolve();
      });
    });
  });
});
