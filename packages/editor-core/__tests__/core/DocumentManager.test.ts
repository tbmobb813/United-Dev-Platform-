
import { DocumentManager } from '../../DocumentManager';
import { UserPresence } from '../../types';
import { jest } from '@jest/globals';

// Mock the WebsocketProvider to avoid actual network connections in tests
jest.mock('y-websocket', () => ({
  WebsocketProvider: jest.fn().mockImplementation(() => ({
    on: jest.fn((event, callback) => {
      // Immediately simulate a 'connected' event
      if (event === 'status') {
        (callback as any)({ status: 'connected' });
      }
    }),
    destroy: jest.fn(),
  })),
}));

describe('DocumentManager', () => {
  let docManager: DocumentManager;
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
