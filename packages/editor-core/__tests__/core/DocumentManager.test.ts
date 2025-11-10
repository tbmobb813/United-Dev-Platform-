import { jest } from '@jest/globals';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
} from '@jest/globals';

// We avoid top-level await so this test file can run under either CJS or
// ESM Jest runtimes. Register the ESM mock and load the runtime module inside
// a beforeAll lifecycle hook where async/await is permitted.
import type { DocumentManager as DocumentManagerType } from '../../index';
import type { UserPresence } from '../../types';
let DocumentManager: any;

describe('DocumentManager', () => {
  beforeAll(async () => {
    // Register an ESM mock for the y-websocket dependency before importing
    // the module under test. Doing this inside beforeAll avoids top-level
    // await so the file can run as CJS under Jest when necessary.
    await jest.unstable_mockModule('y-websocket', async () => {
      // Create a small in-memory awareness mock that supports the
      // API used by DocumentManager: setLocalStateField, on, getStates,
      // getLocalState and clientID.
      return {
        WebsocketProvider: jest.fn().mockImplementation(() => {
          const awarenessState: any = { user: undefined };
          const listeners: Record<string, Function[]> = {};
          const awareness = {
            setLocalStateField: jest.fn((field: string, value: any) => {
              if (field === 'user') {
                awarenessState.user = value;
                // notify change listeners
                (listeners['change'] || []).forEach(fn => fn());
              }
            }),
            getStates: jest.fn(() => new Map([[1, awarenessState]])),
            getLocalState: jest.fn(() => ({ user: awarenessState.user })),
            on: jest.fn((event: string, cb: Function) => {
              listeners[event] = listeners[event] || [];
              listeners[event].push(cb);
            }),
            clientID: 1,
          };

          return {
            awareness,
            on: jest.fn((event: string, callback: (e: any) => void) => {
              if (event === 'status') {callback({ status: 'connected' });}
            }),
            destroy: jest.fn(),
            wsconnected: true,
          };
        }),
      };
    });

    // Import the runtime module from the package entry (index) so the
    // mocked ESM modules (e.g. y-websocket) are applied before the module
    // is evaluated. The project exposes DocumentManager from `index.ts`.
    const mod = await import('../../index');
    DocumentManager = mod.DocumentManager;
  });
  let docManager: DocumentManagerType;
  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    color: '#ff0000',
  };
  const wsUrl = 'ws://localhost:1234';

  beforeEach(() => {
    docManager = new DocumentManager(mockUser, wsUrl);
  });

  afterEach(() => {
    docManager.destroy();
  });

  it('should initialize with the local user in the awareness state', () => {
    const connectedUsers = docManager.getConnectedUsers();
    expect(connectedUsers).toHaveLength(1);
    const localUserPresence = connectedUsers[0];
    expect(localUserPresence.id).toBe(mockUser.id);
    expect(localUserPresence.name).toBe(mockUser.name);
    expect(localUserPresence.isActive).toBe(true);
  });

  it('should update the local user presence', () => {
    // Presence shape may include additional runtime fields (cursor etc.)
    const presenceUpdate: any = {
      cursor: { x: 100, y: 200 },
    };
    docManager.updateUserPresence(presenceUpdate);

    const connectedUsers = docManager.getConnectedUsers();
    const localUserPresence = connectedUsers[0];
    expect(localUserPresence.cursor).toEqual(presenceUpdate.cursor);
    expect(localUserPresence.isActive).toBe(true);
  });

  it('should call the collaborators callback immediately with the current users', () => {
    const callback = jest.fn();
    docManager.onCollaboratorsChanged(callback);

    // It should be called once upon registration
    expect(callback).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: mockUser.id,
        }),
      ])
    );
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should return the Y.Text content for a document', async () => {
    const roomId = 'test-room';
    const documentId = 'test-doc';
    const { content } = await docManager.openDocument(roomId, documentId);

    expect(content).toBeDefined();
    expect(content.constructor.name).toBe('YText');
  });
});
