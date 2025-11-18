import { jest } from '@jest/globals';
import path from 'path';

// Mock the prisma client exported by @udp/db
const mockFindFirst = jest.fn();
const mockUpsert = jest.fn();

// Mock server dependencies that are expensive / not needed for unit tests.
// Resolve the 'fastify' module relative to the API package so Jest can
// find the module even when tests are executed from other package CWDs
// (turbo runs tests from different working directories).
const fastifyResolved = (() => {
  try {
    // Resolve using the API package folder as the base
    return require.resolve('fastify', { paths: [path.resolve(__dirname, '..')] });
  } catch (e) {
    // Fall back to the bare name; Jest will use moduleNameMapper or other
    // resolution strategies if configured. If that still fails (common when
    // Turbo/Jest runs tests from a different CWD), point directly at the
    // repository-level proxy mock which is guaranteed to exist in this repo.
    return path.resolve(__dirname, '../../..', 'jest-mocks', 'fastify-proxy.cjs');
  }
})();

jest.unstable_mockModule(fastifyResolved, async () => ({
  default: () => ({
    addHook: () => {},
    register: () => {},
    listen: async () => {},
    ready: async () => {},
    server: { close: () => {} },
  }),
}));
// Also mock the bare 'fastify' name so imports that reference the package
// by name (rather than the resolved absolute path) get the same mock.
try {
  jest.unstable_mockModule('fastify', async () => ({
    default: () => ({
      addHook: () => {},
      register: () => {},
      listen: async () => {},
      ready: async () => {},
      server: { close: () => {} },
    }),
  }));
} catch (e) {
  // If mocking the bare name throws because the resolver cannot find 'fastify'
  // at mock registration time, ignore and rely on the resolved-path mock.
}
jest.unstable_mockModule('@fastify/cors', async () => ({ default: () => {} }));

jest.unstable_mockModule('@udp/db', async () => ({
  prisma: {
    collaborationSession: { findFirst: mockFindFirst },
    sessionParticipant: { upsert: mockUpsert },
  },
}));

// Import the handler after mocking (do this inside beforeAll to avoid top-level await)
let handleJoinSession;

beforeAll(async () => {
  // Debug: show what fastifyResolved resolved to and its exported keys
  // This helps verify the mocked module shape under turbo/Jest worker contexts.
  // eslint-disable-next-line no-console
  console.log('fastifyResolved for test:', fastifyResolved);
  try {
    const fastifyMock = await import(fastifyResolved);
    // eslint-disable-next-line no-console
    console.log('fastifyMock keys:', Object.keys(fastifyMock));
    // eslint-disable-next-line no-console
    console.log('typeof fastifyMock:', typeof fastifyMock);
    // eslint-disable-next-line no-console
    console.log('typeof fastifyMock.default:', typeof fastifyMock.default);
    // eslint-disable-next-line no-console
    console.log('typeof fastifyMock.fastify:', typeof fastifyMock.fastify);
    if (fastifyMock.fastify && typeof fastifyMock.fastify === 'function') {
      // eslint-disable-next-line no-console
      console.log('fastifyMock.fastify is a function, keys:', Object.keys(fastifyMock.fastify));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('failed to import fastifyResolved for debug:', e && e.message);
  }
  const mod = await import('../server.js');
  // debug: list exports if handleJoinSession is missing
  // eslint-disable-next-line no-console
  console.log('server exports:', Object.keys(mod));
  // Inject our mocked prisma into the server module so handlers use it
  mod.__setPrisma({
    collaborationSession: { findFirst: mockFindFirst },
    sessionParticipant: { upsert: mockUpsert },
  });
  handleJoinSession = mod.handleJoinSession;
});

class MockWebSocket {
  constructor() {
    this._sent = [];
  }
  send(payload) {
    this._sent.push(typeof payload === 'string' ? payload : payload.toString());
  }
  getLastSentJSON() {
    if (!this._sent.length) return null;
    try {
      return JSON.parse(this._sent[this._sent.length - 1]);
    } catch (e) {
      return null;
    }
  }
}

describe('handleJoinSession (unit)', () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
    mockUpsert.mockReset();
  });

  it('should successfully join with valid credentials', async () => {
    const sessionId = 'sess-1';
    const projectId = 'proj-1';
    const userId = 'owner-user';

    // Fake session returned by prisma
    const fakeSession = {
      id: sessionId,
      projectId,
      isActive: true,
      project: {
        id: projectId,
        ownerId: userId,
        members: [],
      },
      participants: [
        {
          isActive: true,
          userId: 'other-user',
          user: { username: 'other', name: 'Other', avatar: null },
        },
      ],
    };

    mockFindFirst.mockResolvedValue(fakeSession);
    mockUpsert.mockResolvedValue({});

    const ws = new MockWebSocket();
    await handleJoinSession(ws, {}, sessionId, projectId, userId);

    const sent = ws.getLastSentJSON();
    expect(sent).not.toBeNull();
    expect(sent.type).toBe('session-joined');
    expect(sent.sessionId).toBe(sessionId);
    expect(Array.isArray(sent.participants)).toBe(true);
  });

  it('should send error when session not found', async () => {
    mockFindFirst.mockResolvedValue(null);
    const ws = new MockWebSocket();
    await handleJoinSession(ws, {}, 'missing', 'proj', 'user');
    const sent = ws.getLastSentJSON();
    expect(sent.type).toBe('error');
    expect(sent.message).toMatch(/Session not found/i);
  });
});
