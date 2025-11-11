/**
 * Integration tests for WebSocket server
 * Tests the full WebSocket server flow
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { WebSocket } from 'ws';
import { prisma } from '@udp/db';
import {
  cleanupTestData,
  createTestFixtures,
  testData,
} from '../utils/test-helpers';

const WS_URL = 'ws://localhost:3030';
const WS_TIMEOUT = 5000;

/**
 * Helper to wait for WebSocket to be ready
 */
function waitForOpen(ws: WebSocket, timeout = WS_TIMEOUT): Promise<void> {
  return new Promise((resolve, reject) => {
    if (ws.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error('WebSocket connection timeout'));
    }, timeout);

    ws.once('open', () => {
      clearTimeout(timer);
      resolve();
    });

    ws.once('error', error => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

/**
 * Helper to wait for a specific message
 */
function waitForMessage(
  ws: WebSocket,
  messageType: string,
  timeout = WS_TIMEOUT
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for message type: ${messageType}`));
    }, timeout);

    const handler = (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === messageType) {
          clearTimeout(timer);
          ws.off('message', handler);
          resolve(message);
        }
      } catch (error) {
        // Ignore non-JSON messages (Yjs binary messages)
      }
    };

    ws.on('message', handler);
  });
}

// Skip integration tests if server is not running
const describeIfServerRunning = process.env.TEST_INTEGRATION ? describe : describe.skip;

describeIfServerRunning('WebSocket Server Integration', () => {
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
    // Clean up presence records
    await prisma.userPresence.deleteMany({
      where: { sessionId: testData.session.id },
    });
  });

  describe('Connection Establishment', () => {
    it('should successfully establish WebSocket connection', async () => {
      const ws = new WebSocket(WS_URL);

      await waitForOpen(ws);
      expect(ws.readyState).toBe(WebSocket.OPEN);

      ws.close();
    });

    it('should connect with authentication parameters', async () => {
      const url = `${WS_URL}?sessionId=${testData.session.id}&projectId=${testData.project.id}&userId=${testData.user.id}`;
      const ws = new WebSocket(url);

      await waitForOpen(ws);
      expect(ws.readyState).toBe(WebSocket.OPEN);

      ws.close();
    });

    it('should accept connection without parameters in development', async () => {
      const ws = new WebSocket(WS_URL);

      await waitForOpen(ws);
      expect(ws.readyState).toBe(WebSocket.OPEN);

      ws.close();
    });
  });

  describe('Session Join/Leave', () => {
    it('should handle join session message', async () => {
      const url = `${WS_URL}/test-doc?sessionId=${testData.session.id}&projectId=${testData.project.id}&userId=${testData.user.id}`;
      const ws = new WebSocket(url);

      await waitForOpen(ws);

      // Send join message
      ws.send(
        JSON.stringify({
          type: 'join-session',
          sessionId: testData.session.id,
          projectId: testData.project.id,
          userId: testData.user.id,
          userName: 'Test User',
        })
      );

      // Wait for response
      const response = await waitForMessage(ws, 'session-joined');

      expect(response.type).toBe('session-joined');
      expect(response.sessionId).toBe(testData.session.id);
      expect(response.participants).toBeDefined();

      // Verify presence in database
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

      ws.close();
    });

    it('should handle leave session message', async () => {
      const url = `${WS_URL}/test-doc?sessionId=${testData.session.id}&projectId=${testData.project.id}&userId=${testData.user.id}`;
      const ws = new WebSocket(url);

      await waitForOpen(ws);

      // Join first
      ws.send(
        JSON.stringify({
          type: 'join-session',
          sessionId: testData.session.id,
          projectId: testData.project.id,
          userId: testData.user.id,
        })
      );

      await waitForMessage(ws, 'session-joined');

      // Then leave
      ws.send(
        JSON.stringify({
          type: 'leave-session',
          sessionId: testData.session.id,
          userId: testData.user.id,
        })
      );

      const response = await waitForMessage(ws, 'session-left');
      expect(response.type).toBe('session-left');

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

      ws.close();
    });

    it('should reject join with invalid session', async () => {
      const url = `${WS_URL}/test-doc?sessionId=invalid-session&projectId=${testData.project.id}&userId=${testData.user.id}`;
      const ws = new WebSocket(url);

      await waitForOpen(ws);

      ws.send(
        JSON.stringify({
          type: 'join-session',
          sessionId: 'invalid-session',
          projectId: testData.project.id,
          userId: testData.user.id,
        })
      );

      const response = await waitForMessage(ws, 'error');
      expect(response.type).toBe('error');
      expect(response.message).toContain('Session not found');

      ws.close();
    });

    it('should reject join for unauthorized user', async () => {
      const url = `${WS_URL}/test-doc?sessionId=${testData.session.id}&projectId=${testData.project.id}&userId=unauthorized-user`;
      const ws = new WebSocket(url);

      await waitForOpen(ws);

      ws.send(
        JSON.stringify({
          type: 'join-session',
          sessionId: testData.session.id,
          projectId: testData.project.id,
          userId: 'unauthorized-user',
        })
      );

      const response = await waitForMessage(ws, 'error');
      expect(response.type).toBe('error');
      expect(response.message).toContain('Access denied');

      ws.close();
    });
  });

  describe('Cursor Updates', () => {
    it('should handle cursor update messages', async () => {
      const url = `${WS_URL}/test-doc?sessionId=${testData.session.id}&projectId=${testData.project.id}&userId=${testData.user.id}`;
      const ws = new WebSocket(url);

      await waitForOpen(ws);

      // Join session first
      ws.send(
        JSON.stringify({
          type: 'join-session',
          sessionId: testData.session.id,
          projectId: testData.project.id,
          userId: testData.user.id,
        })
      );

      await waitForMessage(ws, 'session-joined');

      // Send cursor update
      const cursor = { line: 10, column: 25 };
      ws.send(
        JSON.stringify({
          type: 'cursor-update',
          sessionId: testData.session.id,
          userId: testData.user.id,
          cursor,
        })
      );

      // Wait a bit for processing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify cursor in database
      const presence = await prisma.userPresence.findUnique({
        where: {
          userId_sessionId: {
            userId: testData.user.id,
            sessionId: testData.session.id,
          },
        },
      });
      expect(presence?.cursor).toEqual(cursor);

      ws.close();
    });
  });

  describe('File Operations', () => {
    it('should handle file save messages', async () => {
      const url = `${WS_URL}/test-doc?sessionId=${testData.session.id}&projectId=${testData.project.id}&userId=${testData.user.id}`;
      const ws = new WebSocket(url);

      await waitForOpen(ws);

      const newContent = 'Updated content from WebSocket!';

      ws.send(
        JSON.stringify({
          type: 'file-save',
          fileId: testData.file.id,
          content: newContent,
        })
      );

      const response = await waitForMessage(ws, 'file-saved');
      expect(response.type).toBe('file-saved');
      expect(response.fileId).toBe(testData.file.id);

      // Verify file content in database
      const file = await prisma.file.findUnique({
        where: { id: testData.file.id },
      });
      expect(file?.content).toBe(newContent);

      ws.close();
    });

    it('should reject file save with invalid file ID', async () => {
      const url = `${WS_URL}/test-doc?sessionId=${testData.session.id}&projectId=${testData.project.id}&userId=${testData.user.id}`;
      const ws = new WebSocket(url);

      await waitForOpen(ws);

      ws.send(
        JSON.stringify({
          type: 'file-save',
          fileId: 'invalid-file-id',
          content: 'Some content',
        })
      );

      const response = await waitForMessage(ws, 'error');
      expect(response.type).toBe('error');
      expect(response.message).toContain('File not found');

      ws.close();
    });
  });

  describe('Multi-Client Collaboration', () => {
    it('should handle multiple clients in same session', async () => {
      const user2Id = 'test-user-multi-1';

      // Create second user
      await prisma.user.create({
        data: {
          id: user2Id,
          email: 'user2@test.com',
          name: 'User 2',
        },
      });

      // Add user to project
      await prisma.projectMember.create({
        data: {
          userId: user2Id,
          projectId: testData.project.id,
          role: 'MEMBER',
        },
      });

      // Create connections for both users
      const ws1 = new WebSocket(
        `${WS_URL}/test-doc?sessionId=${testData.session.id}&projectId=${testData.project.id}&userId=${testData.user.id}`
      );
      const ws2 = new WebSocket(
        `${WS_URL}/test-doc?sessionId=${testData.session.id}&projectId=${testData.project.id}&userId=${user2Id}`
      );

      await Promise.all([waitForOpen(ws1), waitForOpen(ws2)]);

      // Both join session
      ws1.send(
        JSON.stringify({
          type: 'join-session',
          sessionId: testData.session.id,
          projectId: testData.project.id,
          userId: testData.user.id,
        })
      );

      ws2.send(
        JSON.stringify({
          type: 'join-session',
          sessionId: testData.session.id,
          projectId: testData.project.id,
          userId: user2Id,
        })
      );

      await Promise.all([
        waitForMessage(ws1, 'session-joined'),
        waitForMessage(ws2, 'session-joined'),
      ]);

      // Verify both are in session
      const participants = await prisma.userPresence.findMany({
        where: {
          sessionId: testData.session.id,
          isActive: true,
        },
      });

      expect(participants).toHaveLength(2);
      expect(participants.map(p => p.userId)).toContain(testData.user.id);
      expect(participants.map(p => p.userId)).toContain(user2Id);

      ws1.close();
      ws2.close();

      // Cleanup
      await prisma.projectMember.delete({
        where: {
          userId_projectId: {
            userId: user2Id,
            projectId: testData.project.id,
          },
        },
      });
      await prisma.user.delete({ where: { id: user2Id } });
    });
  });

  describe('Connection Cleanup', () => {
    it('should mark user as inactive on disconnect', async () => {
      const url = `${WS_URL}/test-doc?sessionId=${testData.session.id}&projectId=${testData.project.id}&userId=${testData.user.id}`;
      const ws = new WebSocket(url);

      await waitForOpen(ws);

      // Join session
      ws.send(
        JSON.stringify({
          type: 'join-session',
          sessionId: testData.session.id,
          projectId: testData.project.id,
          userId: testData.user.id,
        })
      );

      await waitForMessage(ws, 'session-joined');

      // Close connection
      ws.close();

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));

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

  describe('Error Handling', () => {
    it('should handle malformed JSON messages gracefully', async () => {
      const ws = new WebSocket(WS_URL);

      await waitForOpen(ws);

      // Send invalid JSON
      ws.send('{ invalid json }');

      // Connection should remain open
      await new Promise(resolve => setTimeout(resolve, 500));
      expect(ws.readyState).toBe(WebSocket.OPEN);

      ws.close();
    });

    it('should handle unknown message types', async () => {
      const ws = new WebSocket(WS_URL);

      await waitForOpen(ws);

      // Send unknown message type
      ws.send(
        JSON.stringify({
          type: 'unknown-message-type',
          data: 'test',
        })
      );

      // Connection should remain open
      await new Promise(resolve => setTimeout(resolve, 500));
      expect(ws.readyState).toBe(WebSocket.OPEN);

      ws.close();
    });
  });
});
