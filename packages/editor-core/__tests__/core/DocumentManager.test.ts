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
import type { DocumentManager as DocumentManagerType } from '../../DocumentManager';
import type { UserPresence } from '../../types';
let DocumentManager: any;

describe('DocumentManager', () => {
  beforeAll(async () => {
    // Register an ESM mock for the y-websocket dependency before importing
    // the module under test. Doing this inside beforeAll avoids top-level
    // await so the file can run as CJS under Jest when necessary.
    await jest.unstable_mockModule('y-websocket', async () => ({
      WebsocketProvider: jest.fn().mockImplementation(() => ({
        on: jest.fn(
          (event: string, callback: (event: { status: string }) => void) => {
            if (event === 'status') {
              callback({ status: 'connected' });
            }
          }
        ),
        destroy: jest.fn(),
      })),
    }));

    const mod = await import('../../DocumentManager');
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
    const presenceUpdate: Partial<UserPresence> = {
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
