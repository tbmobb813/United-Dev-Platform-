import { jest } from '@jest/globals';

// Mock the prisma client exported by @udp/db
const mockFindFirst = jest.fn();
const mockUpsert = jest.fn();

// Mock server dependencies that are expensive / not needed for unit tests
jest.unstable_mockModule('fastify', async () => ({
  default: () => ({
    register: () => {},
    listen: async () => {},
    ready: async () => {},
    server: { close: () => {} },
  }),
}));
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
