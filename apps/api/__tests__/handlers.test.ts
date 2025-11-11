/**
 * Unit tests for WebSocket message handlers
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { prisma } from '@udp/db';
import {
  handleJoinSession,
  handleLeaveSession,
  handleCursorUpdate,
  handleFileSave,
  updateUserPresence,
  broadcastToSession,
} from '../handlers.js';
import {
  MockWebSocket,
  createMockRequest,
  cleanupTestData,
  createTestFixtures,
  testData,
} from './utils/test-helpers';

describe('WebSocket Handlers', () => {
  let fixtures: any;

  beforeAll(async () => {
    await cleanupTestData(prisma);
    fixtures = await createTestFixtures(prisma);
  });

  afterAll(async () => {
    await cleanupTestData(prisma);
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up presence records before each test
    await prisma.userPresence.deleteMany({
      where: { sessionId: testData.session.id },
    });
  });

  describe('handleJoinSession', () => {
    it('should successfully join a session with valid credentials', async () => {
      const ws = new MockWebSocket();
      const data = { userName: 'Test User' };

      const result = await handleJoinSession(
        ws,
        data,
        testData.session.id,
        testData.project.id,
        testData.user.id
      );

      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.response).toBeDefined();
      expect(result.response.type).toBe('session-joined');
      expect(result.response.sessionId).toBe(testData.session.id);

      // Check that message was sent
      const sentMessage = ws.getLastSentJSON();
      expect(sentMessage.type).toBe('session-joined');
      expect(sentMessage.sessionId).toBe(testData.session.id);

      // Verify presence was created
      const presence = await prisma.userPresence.findUnique({
        where: {
          userId_sessionId: {
            userId: testData.user.id,
            sessionId: testData.session.id,
          },
        },
      });
      expect(presence).toBeDefined();
      expect(presence?.isActive).toBe(true);
    });

    it('should reject join with invalid session', async () => {
      const ws = new MockWebSocket();
      const data = { userName: 'Test User' };

      const result = await handleJoinSession(
        ws,
        data,
        'invalid-session-id',
        testData.project.id,
        testData.user.id
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Session not found');

      const sentMessage = ws.getLastSentJSON();
      expect(sentMessage.type).toBe('error');
      expect(sentMessage.message).toContain('Session not found');
    });

    it('should reject join for unauthorized user', async () => {
      const ws = new MockWebSocket();
      const data = { userName: 'Unauthorized User' };

      const result = await handleJoinSession(
        ws,
        data,
        testData.session.id,
        testData.project.id,
        'unauthorized-user-id'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Access denied');

      const sentMessage = ws.getLastSentJSON();
      expect(sentMessage.type).toBe('error');
      expect(sentMessage.message).toContain('Access denied');
    });

    it('should update presence for existing participant', async () => {
      const ws = new MockWebSocket();
      const data = { userName: 'Test User' };

      // Join first time
      await handleJoinSession(
        ws,
        data,
        testData.session.id,
        testData.project.id,
        testData.user.id
      );

      // Leave (set inactive)
      await handleLeaveSession(ws, {}, testData.session.id, testData.user.id);

      // Join again
      const result = await handleJoinSession(
        ws,
        data,
        testData.session.id,
        testData.project.id,
        testData.user.id
      );

      expect(result.success).toBe(true);

      // Verify presence was reactivated
      const presence = await prisma.userPresence.findUnique({
        where: {
          userId_sessionId: {
            userId: testData.user.id,
            sessionId: testData.session.id,
          },
        },
      });
      expect(presence?.isActive).toBe(true);
      expect(presence?.lastSeen).toBeNull();
    });
  });

  describe('handleLeaveSession', () => {
    it('should successfully leave a session', async () => {
      const ws = new MockWebSocket();

      // First join
      await handleJoinSession(
        ws,
        { userName: 'Test User' },
        testData.session.id,
        testData.project.id,
        testData.user.id
      );

      ws.clearSentMessages();

      // Then leave
      const result = await handleLeaveSession(
        ws,
        {},
        testData.session.id,
        testData.user.id
      );

      expect(result.success).toBe(true);
      expect(result.response.type).toBe('session-left');

      const sentMessage = ws.getLastSentJSON();
      expect(sentMessage.type).toBe('session-left');
      expect(sentMessage.sessionId).toBe(testData.session.id);

      // Verify presence is inactive
      const presence = await prisma.userPresence.findUnique({
        where: {
          userId_sessionId: {
            userId: testData.user.id,
            sessionId: testData.session.id,
          },
        },
      });
      expect(presence?.isActive).toBe(false);
      expect(presence?.lastSeen).not.toBeNull();
    });
  });

  describe('handleCursorUpdate', () => {
    beforeEach(async () => {
      // Join session before each cursor update test
      const ws = new MockWebSocket();
      await handleJoinSession(
        ws,
        { userName: 'Test User' },
        testData.session.id,
        testData.project.id,
        testData.user.id
      );
    });

    it('should update cursor position successfully', async () => {
      const ws = new MockWebSocket();
      const cursor = { line: 10, column: 25 };

      const result = await handleCursorUpdate(
        ws,
        { cursor },
        testData.session.id,
        testData.user.id
      );

      expect(result.success).toBe(true);
      expect(result.cursor).toEqual(cursor);

      // Verify cursor was saved
      const presence = await prisma.userPresence.findUnique({
        where: {
          userId_sessionId: {
            userId: testData.user.id,
            sessionId: testData.session.id,
          },
        },
      });
      expect(presence?.cursor).toEqual(cursor);
    });

    it('should reject cursor update without cursor data', async () => {
      const ws = new MockWebSocket();

      const result = await handleCursorUpdate(
        ws,
        {},
        testData.session.id,
        testData.user.id
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cursor data is required');
    });

    it('should update cursor multiple times', async () => {
      const ws = new MockWebSocket();

      const cursor1 = { line: 5, column: 10 };
      await handleCursorUpdate(
        ws,
        { cursor: cursor1 },
        testData.session.id,
        testData.user.id
      );

      const cursor2 = { line: 15, column: 30 };
      const result = await handleCursorUpdate(
        ws,
        { cursor: cursor2 },
        testData.session.id,
        testData.user.id
      );

      expect(result.success).toBe(true);

      // Verify latest cursor position
      const presence = await prisma.userPresence.findUnique({
        where: {
          userId_sessionId: {
            userId: testData.user.id,
            sessionId: testData.session.id,
          },
        },
      });
      expect(presence?.cursor).toEqual(cursor2);
    });
  });

  describe('handleFileSave', () => {
    it('should save file with valid permissions', async () => {
      const ws = new MockWebSocket();
      const newContent = 'Updated content!';

      const result = await handleFileSave(
        ws,
        {
          fileId: testData.file.id,
          content: newContent,
        },
        testData.project.id,
        testData.user.id
      );

      expect(result.success).toBe(true);
      expect(result.file).toBeDefined();
      expect(result.file.content).toBe(newContent);
      expect(result.response.type).toBe('file-saved');

      const sentMessage = ws.getLastSentJSON();
      expect(sentMessage.type).toBe('file-saved');
      expect(sentMessage.fileId).toBe(testData.file.id);

      // Verify file was updated
      const file = await prisma.file.findUnique({
        where: { id: testData.file.id },
      });
      expect(file?.content).toBe(newContent);
      expect(file?.size).toBe(Buffer.byteLength(newContent, 'utf8'));
    });

    it('should reject save with missing fileId', async () => {
      const ws = new MockWebSocket();

      const result = await handleFileSave(
        ws,
        { content: 'Some content' },
        testData.project.id,
        testData.user.id
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid parameters');

      const sentMessage = ws.getLastSentJSON();
      expect(sentMessage.type).toBe('error');
    });

    it('should reject save with missing content', async () => {
      const ws = new MockWebSocket();

      const result = await handleFileSave(
        ws,
        { fileId: testData.file.id },
        testData.project.id,
        testData.user.id
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid parameters');
    });

    it('should reject save for non-existent file', async () => {
      const ws = new MockWebSocket();

      const result = await handleFileSave(
        ws,
        {
          fileId: 'non-existent-file-id',
          content: 'Some content',
        },
        testData.project.id,
        testData.user.id
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('File not found');

      const sentMessage = ws.getLastSentJSON();
      expect(sentMessage.message).toContain('File not found');
    });

    it('should reject save for unauthorized user', async () => {
      const ws = new MockWebSocket();

      const result = await handleFileSave(
        ws,
        {
          fileId: testData.file.id,
          content: 'Unauthorized content',
        },
        testData.project.id,
        'unauthorized-user-id'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Access denied');

      const sentMessage = ws.getLastSentJSON();
      expect(sentMessage.message).toContain('Access denied');
    });
  });

  describe('updateUserPresence', () => {
    it('should create new presence record', async () => {
      const result = await updateUserPresence(
        testData.session.id,
        testData.user.id,
        true
      );

      expect(result.success).toBe(true);

      const presence = await prisma.userPresence.findUnique({
        where: {
          userId_sessionId: {
            userId: testData.user.id,
            sessionId: testData.session.id,
          },
        },
      });
      expect(presence).toBeDefined();
      expect(presence?.isActive).toBe(true);
    });

    it('should update existing presence record', async () => {
      // Create initial presence
      await updateUserPresence(testData.session.id, testData.user.id, true);

      // Update to inactive
      const result = await updateUserPresence(
        testData.session.id,
        testData.user.id,
        false
      );

      expect(result.success).toBe(true);

      const presence = await prisma.userPresence.findUnique({
        where: {
          userId_sessionId: {
            userId: testData.user.id,
            sessionId: testData.session.id,
          },
        },
      });
      expect(presence?.isActive).toBe(false);
      expect(presence?.lastSeen).not.toBeNull();
    });

    it('should clear lastSeen when user becomes active', async () => {
      // Set inactive first
      await updateUserPresence(testData.session.id, testData.user.id, false);

      // Verify lastSeen is set
      let presence = await prisma.userPresence.findUnique({
        where: {
          userId_sessionId: {
            userId: testData.user.id,
            sessionId: testData.session.id,
          },
        },
      });
      expect(presence?.lastSeen).not.toBeNull();

      // Set active again
      await updateUserPresence(testData.session.id, testData.user.id, true);

      presence = await prisma.userPresence.findUnique({
        where: {
          userId_sessionId: {
            userId: testData.user.id,
            sessionId: testData.session.id,
          },
        },
      });
      expect(presence?.isActive).toBe(true);
      expect(presence?.lastSeen).toBeNull();
    });
  });

  describe('broadcastToSession', () => {
    it('should broadcast to all active participants except sender', async () => {
      const user1Id = 'test-user-broadcast-1';
      const user2Id = 'test-user-broadcast-2';
      const user3Id = 'test-user-broadcast-3';

      // Create additional users
      await prisma.user.createMany({
        data: [
          { id: user1Id, email: 'user1@test.com', name: 'User 1' },
          { id: user2Id, email: 'user2@test.com', name: 'User 2' },
          { id: user3Id, email: 'user3@test.com', name: 'User 3' },
        ],
        skipDuplicates: true,
      });

      // Create presence for all users
      await prisma.userPresence.createMany({
        data: [
          { sessionId: testData.session.id, userId: user1Id, isActive: true },
          { sessionId: testData.session.id, userId: user2Id, isActive: true },
          { sessionId: testData.session.id, userId: user3Id, isActive: false }, // Inactive
        ],
      });

      // Create mock connections
      const connections = new Map<string, MockWebSocket>();
      connections.set(user1Id, new MockWebSocket());
      connections.set(user2Id, new MockWebSocket());
      connections.set(user3Id, new MockWebSocket());

      const message = {
        type: 'test-broadcast',
        content: 'Hello!',
      };

      const result = await broadcastToSession(
        connections,
        testData.session.id,
        message,
        user1Id // Exclude user1
      );

      expect(result.success).toBe(true);
      expect(result.recipientCount).toBe(1); // Only user2 should receive (user1 excluded, user3 inactive)

      // Check that user2 received the message
      const ws2 = connections.get(user2Id);
      expect(ws2?.sentMessages.length).toBe(1);
      expect(ws2?.getLastSentJSON()).toEqual(message);

      // Check that user1 didn't receive the message (excluded)
      const ws1 = connections.get(user1Id);
      expect(ws1?.sentMessages.length).toBe(0);

      // Check that user3 didn't receive the message (inactive)
      const ws3 = connections.get(user3Id);
      expect(ws3?.sentMessages.length).toBe(0);

      // Cleanup
      await prisma.userPresence.deleteMany({
        where: {
          userId: { in: [user1Id, user2Id, user3Id] },
        },
      });
      await prisma.user.deleteMany({
        where: {
          id: { in: [user1Id, user2Id, user3Id] },
        },
      });
    });

    it('should broadcast to all participants when no exclusion', async () => {
      const user1Id = 'test-user-broadcast-all-1';
      const user2Id = 'test-user-broadcast-all-2';

      // Create users
      await prisma.user.createMany({
        data: [
          { id: user1Id, email: 'user1@test.com', name: 'User 1' },
          { id: user2Id, email: 'user2@test.com', name: 'User 2' },
        ],
        skipDuplicates: true,
      });

      // Create presence
      await prisma.userPresence.createMany({
        data: [
          { sessionId: testData.session.id, userId: user1Id, isActive: true },
          { sessionId: testData.session.id, userId: user2Id, isActive: true },
        ],
      });

      // Create mock connections
      const connections = new Map<string, MockWebSocket>();
      connections.set(user1Id, new MockWebSocket());
      connections.set(user2Id, new MockWebSocket());

      const message = { type: 'test-broadcast', content: 'Hello all!' };

      const result = await broadcastToSession(
        connections,
        testData.session.id,
        message
      );

      expect(result.success).toBe(true);
      expect(result.recipientCount).toBe(2);

      // Both users should receive the message
      expect(connections.get(user1Id)?.sentMessages.length).toBe(1);
      expect(connections.get(user2Id)?.sentMessages.length).toBe(1);

      // Cleanup
      await prisma.userPresence.deleteMany({
        where: { userId: { in: [user1Id, user2Id] } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: [user1Id, user2Id] } },
      });
    });
  });
});
