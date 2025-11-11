/**
 * Test utilities for WebSocket server testing
 */

import { EventEmitter } from 'events';

/**
 * Mock WebSocket connection for testing
 */
export class MockWebSocket extends EventEmitter {
  public readyState: number = 1; // OPEN
  public sentMessages: any[] = [];
  public binaryType: string = 'arraybuffer';
  public url: string;

  constructor(url: string = 'ws://localhost:3030') {
    super();
    this.url = url;
  }

  send(data: any) {
    this.sentMessages.push(data);
    this.emit('sent', data);
  }

  close(code?: number, reason?: string) {
    this.readyState = 3; // CLOSED
    this.emit('close', code, reason);
  }

  // Simulate receiving a message
  receiveMessage(data: any) {
    this.emit('message', data);
  }

  // Get all sent JSON messages parsed
  getSentJSON() {
    return this.sentMessages
      .filter(msg => {
        try {
          JSON.parse(msg);
          return true;
        } catch {
          return false;
        }
      })
      .map(msg => JSON.parse(msg));
  }

  // Get the last sent JSON message
  getLastSentJSON() {
    const jsonMessages = this.getSentJSON();
    return jsonMessages[jsonMessages.length - 1];
  }

  // Clear sent messages
  clearSentMessages() {
    this.sentMessages = [];
  }
}

/**
 * Mock HTTP request for WebSocket upgrade
 */
export interface MockRequest {
  url: string;
  headers: Record<string, string>;
  method?: string;
}

/**
 * Create a mock request with query parameters
 */
export function createMockRequest(params: {
  sessionId?: string;
  projectId?: string;
  userId?: string;
  docName?: string;
}): MockRequest {
  const searchParams = new URLSearchParams();
  if (params.sessionId) searchParams.set('sessionId', params.sessionId);
  if (params.projectId) searchParams.set('projectId', params.projectId);
  if (params.userId) searchParams.set('userId', params.userId);

  const docName = params.docName || 'test-doc';
  const queryString = searchParams.toString();
  const url = `/${docName}${queryString ? `?${queryString}` : ''}`;

  return {
    url,
    headers: {
      host: 'localhost:3030',
      'upgrade': 'websocket',
      'connection': 'Upgrade',
    },
    method: 'GET',
  };
}

/**
 * Wait for a specific message type to be sent
 */
export async function waitForMessage(
  ws: MockWebSocket,
  messageType: string,
  timeout: number = 1000
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for message type: ${messageType}`));
    }, timeout);

    const checkMessages = () => {
      const jsonMessages = ws.getSentJSON();
      const message = jsonMessages.find(msg => msg.type === messageType);
      if (message) {
        clearTimeout(timer);
        ws.off('sent', checkMessages);
        resolve(message);
      }
    };

    ws.on('sent', checkMessages);
    checkMessages(); // Check existing messages
  });
}

/**
 * Create test database records
 */
export const testData = {
  user: {
    id: 'test-user-1',
    email: 'test@example.com',
    name: 'Test User',
    username: 'testuser',
  },
  project: {
    id: 'test-project-1',
    name: 'Test Project',
    description: 'A test project',
    visibility: 'PRIVATE' as const,
  },
  session: {
    id: 'test-session-1',
    roomId: 'test-room-1',
    name: 'Test Session',
    isActive: true,
  },
  file: {
    id: 'test-file-1',
    name: 'test.txt',
    path: '/test.txt',
    content: 'Hello, World!',
    type: 'FILE' as const,
    mimeType: 'text/plain',
    size: 13,
  },
};

/**
 * Clean up test data from database
 */
export async function cleanupTestData(prisma: any) {
  // Delete in reverse order of dependencies
  await prisma.userPresence.deleteMany({
    where: {
      OR: [
        { sessionId: { startsWith: 'test-' } },
        { userId: { startsWith: 'test-' } },
      ],
    },
  });

  await prisma.fileVersion.deleteMany({
    where: { fileId: { startsWith: 'test-' } },
  });

  await prisma.file.deleteMany({
    where: { id: { startsWith: 'test-' } },
  });

  await prisma.collaborativeSession.deleteMany({
    where: { id: { startsWith: 'test-' } },
  });

  await prisma.projectMember.deleteMany({
    where: {
      OR: [
        { projectId: { startsWith: 'test-' } },
        { userId: { startsWith: 'test-' } },
      ],
    },
  });

  await prisma.project.deleteMany({
    where: { id: { startsWith: 'test-' } },
  });

  await prisma.session.deleteMany({
    where: { userId: { startsWith: 'test-' } },
  });

  await prisma.account.deleteMany({
    where: { userId: { startsWith: 'test-' } },
  });

  await prisma.user.deleteMany({
    where: { id: { startsWith: 'test-' } },
  });
}

/**
 * Create test fixtures in database
 */
export async function createTestFixtures(prisma: any) {
  // Create user
  const user = await prisma.user.upsert({
    where: { id: testData.user.id },
    create: testData.user,
    update: testData.user,
  });

  // Create project
  const project = await prisma.project.upsert({
    where: { id: testData.project.id },
    create: {
      ...testData.project,
      ownerId: user.id,
    },
    update: {
      ...testData.project,
      ownerId: user.id,
    },
  });

  // Create project member
  await prisma.projectMember.upsert({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId: project.id,
      },
    },
    create: {
      userId: user.id,
      projectId: project.id,
      role: 'OWNER',
    },
    update: {
      role: 'OWNER',
    },
  });

  // Create collaborative session
  const session = await prisma.collaborativeSession.upsert({
    where: { id: testData.session.id },
    create: {
      ...testData.session,
      projectId: project.id,
    },
    update: {
      ...testData.session,
      projectId: project.id,
    },
  });

  // Create file
  const file = await prisma.file.upsert({
    where: { id: testData.file.id },
    create: {
      ...testData.file,
      projectId: project.id,
      createdById: user.id,
    },
    update: {
      ...testData.file,
      projectId: project.id,
    },
  });

  return { user, project, session, file };
}
