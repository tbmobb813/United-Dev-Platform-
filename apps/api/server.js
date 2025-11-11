import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
// Runtime prisma holder - tests can inject a mocked prisma via __setPrisma
let __testPrisma = null;
export function __setPrisma(p) {
  __testPrisma = p;
}
import logger from '@udp/logger';
import { getToken } from 'next-auth/jwt';

// Yjs document storage
const docs = new Map();

// Get or create Yjs document
const getYDoc = docname => {
  let doc = docs.get(docname);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(docname, doc);
  }
  return doc;
};

// Simple setupWSConnection replacement
const setupWSConnection = (
  conn,
  req,
  { docName = req.url.slice(1).split('?')[0] } = {}
) => {
  conn.binaryType = 'arraybuffer';
  const doc = getYDoc(docName);
  const awareness = new awarenessProtocol.Awareness(doc);

  const messageHandler = message => {
    const encoder = encoding.createEncoder();
    const decoder = decoding.createDecoder(new Uint8Array(message));
    const messageType = decoding.readVarUint(decoder);

    switch (messageType) {
      case syncProtocol.messageYjsSyncStep1:
        encoding.writeVarUint(encoder, syncProtocol.messageYjsSyncStep2);
        syncProtocol.readSyncStep1(decoder, encoder, doc);
        conn.send(encoding.toUint8Array(encoder));
        break;
      case syncProtocol.messageYjsSyncStep2:
        syncProtocol.readSyncStep2(decoder, doc, null);
        break;
      case syncProtocol.messageYjsUpdate:
        syncProtocol.readUpdate(decoder, doc, null);
        break;
      case awarenessProtocol.messageAwareness:
        awarenessProtocol.applyAwarenessUpdate(
          awareness,
          decoding.readVarUint8Array(decoder),
          conn
        );
        break;
    }
  };

  // (update handler is attached below as `updateHandler`) -- ensure only one listener exists

  // Keep a reference to the update handler so it can be removed on close
  const updateHandler = (update, origin) => {
    if (origin !== conn) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, syncProtocol.messageYjsUpdate);
      encoding.writeVarUint8Array(encoder, update);
      try {
        conn.send(encoding.toUint8Array(encoder));
      } catch (e) {
        // ignore errors sending to closed sockets
      }
    }
  };

  doc.on('update', updateHandler);

  conn.on('message', messageHandler);
  conn.on('close', () => {
    // remove update handler to avoid sending to closed connection
    try {
      doc.off('update', updateHandler);
    } catch (e) {
      // ignore
    }
  });

  // Send sync step 1
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, syncProtocol.messageYjsSyncStep1);
  syncProtocol.writeSyncStep1(encoder, doc);
  conn.send(encoding.toUint8Array(encoder));
};

// (Placeholder) collaboration session/document storage can be added here when needed

// Authentication middleware for REST API endpoints (Fastify preHandler)
async function authenticateToken(request, reply) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    logger.error('NEXTAUTH_SECRET is not defined');
    reply.code(500).send({ error: 'Server configuration error' });
    return;
  }

  // next-auth's getToken expects a `req` object similar to Next.js requests.
  // We pass the Fastify request as `req` which works for our tests and basic usage.
  const token = await getToken({ req: request, secret, raw: true });

  if (!token) {
    reply.code(401).send({ error: 'Unauthorized' });
    return;
  }

  // Assuming the JWT contains the user ID in the 'sub' claim
  try {
    const decodedToken = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    request.userId = decodedToken.sub;
  } catch (e) {
    logger.error('Failed to decode token', e);
    reply.code(401).send({ error: 'Unauthorized' });
    return;
  }
}

// Enhanced WebSocket connection handler with Yjs collaboration
function setupCollaborativeWSConnection(conn, req) {
  logger.info('Collaborative WebSocket connection established');

  // Extract session/document ID from URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = url.searchParams.get('sessionId');
  const projectId = url.searchParams.get('projectId');
  const userId = url.searchParams.get('userId');

  // For development, allow connections without sessionId/projectId
  if (!sessionId && !projectId && process.env.NODE_ENV !== 'production') {
    logger.info(
      'Development mode: accepting connection without session params'
    );
  } else if (!sessionId || !projectId) {
    logger.warn('Missing sessionId or projectId, closing connection');
    conn.close(1008, 'Missing required parameters');
    return;
  }

  // Set up Yjs document collaboration
  setupWSConnection(conn, req);

  // Track user presence in session
  if (userId) {
    updateUserPresence(sessionId, userId, true);
  }

  conn.on('message', async message => {
    try {
      const data = JSON.parse(message.toString());

      switch (data.type) {
        case 'join-session':
          await handleJoinSession(conn, data, sessionId, projectId, userId);
          break;
        case 'leave-session':
          await handleLeaveSession(conn, data, sessionId, userId);
          break;
        case 'cursor-update':
          await handleCursorUpdate(conn, data, sessionId, userId);
          break;
        case 'file-save':
          await handleFileSave(conn, data, projectId, userId);
          break;
        default:
          logger.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      if (message.toString().startsWith('{')) {
        logger.error('Error processing message:', error);
      }
      // Ignore non-JSON messages (likely Yjs sync messages)
    }
  });

  conn.on('close', async () => {
    logger.info('Collaborative WebSocket connection closed');
    if (userId && sessionId) {
      await updateUserPresence(sessionId, userId, false);
    }
  });
}

// Handle user joining a collaboration session
async function handleJoinSession(conn, data, sessionId, projectId, userId) {
  try {
    // Use injected test prisma if provided, otherwise load dynamically
    const { prisma } = __testPrisma ? { prisma: __testPrisma } : await import('@udp/db');
    // Verify session exists and user has access
    const session = await prisma.collaborationSession.findFirst({
      where: {
        id: sessionId,
        projectId: projectId,
        isActive: true,
      },
      include: {
        project: {
          include: {
            owner: true,
            members: true,
          },
        },
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!session) {
      conn.send(
        JSON.stringify({
          type: 'error',
          message: 'Session not found or inactive',
        })
      );
      return;
    }

    // Check if user has access to the project
    const hasAccess =
      session.project.ownerId === userId ||
      session.project.members.some(m => m.userId === userId);

    if (!hasAccess) {
      conn.send(
        JSON.stringify({
          type: 'error',
          message: 'Access denied to this project',
        })
      );
      return;
    }

    // Add user as participant if not already
    await prisma.sessionParticipant.upsert({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        },
      },
      create: {
        sessionId,
        userId,
        isActive: true,
      },
      update: {
        isActive: true,
        leftAt: null,
      },
    });

    // Send success response with session info
    conn.send(
      JSON.stringify({
        type: 'session-joined',
        sessionId,
        participants: session.participants
          .filter(p => p.isActive)
          .map(p => ({
            id: p.userId,
            username: p.user.username,
            name: p.user.name,
            avatar: p.user.avatar,
          })),
      })
    );

    // Notify other participants
    broadcastToSession(
      sessionId,
      {
        type: 'user-joined',
        userId,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  } catch (error) {
    logger.error('Error handling join session:', error);
    conn.send(
      JSON.stringify({
        type: 'error',
        message: 'Failed to join session',
      })
    );
  }
}

// Handle user leaving a collaboration session
async function handleLeaveSession(conn, data, sessionId, userId) {
  try {
    await updateUserPresence(sessionId, userId, false);

    conn.send(
      JSON.stringify({
        type: 'session-left',
        sessionId,
      })
    );

    // Notify other participants
    broadcastToSession(
      sessionId,
      {
        type: 'user-left',
        userId,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  } catch (error) {
    logger.error('Error handling leave session:', error);
  }
}

// Handle cursor position updates
async function handleCursorUpdate(conn, data, sessionId, userId) {
  try {
    const { cursor } = data;

    // Update cursor in database
    await prisma.sessionParticipant.update({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        },
      },
      data: {
        cursor: cursor,
      },
    });

    // Broadcast cursor update to other participants
    broadcastToSession(
      sessionId,
      {
        type: 'cursor-update',
        userId,
        cursor,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  } catch (error) {
    logger.error('Error handling cursor update:', error);
  }
}

// Handle file save operations
async function handleFileSave(conn, data, projectId, userId) {
  try {
    const { fileId, content } = data;

    if (fileId) {
      // Update existing file
      const file = await prisma.projectFile.update({
        where: { id: fileId },
        data: {
          content,
          size: Buffer.byteLength(content, 'utf8'),
          updatedAt: new Date(),
        },
      });

      // Log file activity
      await prisma.fileActivity.create({
        data: {
          action: 'UPDATE',
          fileId,
          userId,
          changes: {
            contentChanged: true,
            size: file.size,
          },
        },
      });

      conn.send(
        JSON.stringify({
          type: 'file-saved',
          fileId,
          timestamp: new Date().toISOString(),
        })
      );
    }
  } catch (error) {
    logger.error('Error handling file save:', error);
    conn.send(
      JSON.stringify({
        type: 'error',
        message: 'Failed to save file',
      })
    );
  }
}

// Update user presence in session
async function updateUserPresence(sessionId, userId, isActive) {
  try {
    const { prisma } = __testPrisma ? { prisma: __testPrisma } : await import('@udp/db');
    await prisma.sessionParticipant.upsert({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        },
      },
      create: {
        sessionId,
        userId,
        isActive,
      },
      update: {
        isActive,
        leftAt: isActive ? null : new Date(),
      },
    });
  } catch (error) {
    logger.error('Error updating user presence:', error);
  }
}

// Broadcast message to all participants in a session except sender
function broadcastToSession(sessionId, message, _excludeUserId) {
  // In a real implementation, you'd keep track of WebSocket connections
  // and broadcast to active connections. This is a simplified version.
  logger.info(`Broadcasting to session ${sessionId}:`, message);
}

const PORT = process.env.PORT || 3030;
const app = Fastify({ logger: true });

app.register(fastifyCors, {
  origin:
    process.env.NODE_ENV === 'production'
      ? ['https://your-domain.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
});

app.addHook('onRequest', async (request, _reply) => {
  // Morgan-like logging
  logger.info(`${request.method} ${request.url}`);
});

// Health check
app.get('/health', async (request, reply) => {
  reply.send({
    ok: true,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// API endpoints
app.get('/api/sessions/:sessionId', async (request, reply) => {
  try {
    const sessionId = request.params.sessionId;
    const session = await prisma.collaborationSession.findUnique({
      where: { id: sessionId },
      include: {
        participants: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!session) {
      reply.code(404).send({ error: 'Session not found' });
      return;
    }
    reply.send({ session });
  } catch (error) {
    logger.error('Error fetching session:', error);
    reply.code(500).send({ error: 'Failed to fetch session' });
  }
});

// AI stub endpoint (enhanced)
app.post('/ai/run', async (request, reply) => {
  try {
    const { tool, filePath, prompt, projectId, userId } = request.body || {};
    const result = `AI tool '${tool}' executed on ${filePath || 'project'}: ${prompt || ''
      }`;
    if (projectId && userId) {
      logger.info(`AI interaction: ${userId} in project ${projectId}`);
    }
    reply.send({ result, timestamp: new Date().toISOString() });
  } catch (error) {
    logger.error('Error in AI endpoint:', error);
    reply.code(500).send({ error: 'AI service error' });
  }
});

// Project Management Endpoints
app.post(
  '/api/projects',
  { preHandler: authenticateToken },
  async (request, reply) => {
    try {
      const { name, description, visibility } = request.body;
      const userId = request.userId; // From authenticateToken preHandler

      if (!name) {
        return reply.code(400).send({ error: 'Project name is required' });
      }

      const project = await prisma.project.create({
        data: {
          name,
          description,
          visibility: visibility || 'PRIVATE',
          owner: {
            connect: { id: userId },
          },
          members: {
            create: { userId, role: 'OWNER' },
          },
        },
      });

      reply.code(201).send({ project });
    } catch (error) {
      logger.error('Error creating project:', error);
      reply.code(500).send({ error: 'Failed to create project' });
    }
  }
);

// File Management Endpoints
app.post(
  '/api/files',
  { preHandler: authenticateToken },
  async (request, reply) => {
    try {
      const { projectId, path, name, content, type, mimeType } = request.body;
      const userId = request.userId; // From authenticateToken preHandler

      if (!projectId || !path || !name) {
        return reply
          .code(400)
          .send({ error: 'Project ID, path, and name are required' });
      }

      // Verify user has access to the project
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { members: true },
      });

      if (
        !project ||
        (!project.members.some(m => m.userId === userId) &&
          project.ownerId !== userId)
      ) {
        return reply.code(403).send({ error: 'Access denied to project' });
      }

      const file = await prisma.projectFile.create({
        data: {
          projectId,
          path,
          name,
          content: content || '',
          type: type || 'FILE',
          mimeType: mimeType || 'text/plain',
          size: content ? Buffer.byteLength(content, 'utf8') : 0,
        },
      });

      // Log file activity
      await prisma.fileActivity.create({
        data: {
          action: 'CREATE',
          fileId: file.id,
          userId,
        },
      });

      reply.code(201).send({ file });
    } catch (error) {
      logger.error('Error creating file:', error);
      reply.code(500).send({ error: 'Failed to create file' });
    }
  }
);

app.put(
  '/api/files/:fileId',
  { preHandler: authenticateToken },
  async (request, reply) => {
    try {
      const { fileId } = request.params;
      const { content } = request.body;
      const userId = request.userId; // From authenticateToken preHandler

      if (!content) {
        return reply.code(400).send({ error: 'File content is required' });
      }

      const existingFile = await prisma.projectFile.findUnique({
        where: { id: fileId },
        include: { project: { include: { members: true } } },
      });

      if (!existingFile) {
        return reply.code(404).send({ error: 'File not found' });
      }

      // Verify user has access to the project
      const project = existingFile.project;
      if (
        !project ||
        (!project.members.some(m => m.userId === userId) &&
          project.ownerId !== userId)
      ) {
        return reply.code(403).send({ error: 'Access denied to project' });
      }

      const updatedFile = await prisma.projectFile.update({
        where: { id: fileId },
        data: {
          content,
          size: Buffer.byteLength(content, 'utf8'),
          updatedAt: new Date(),
        },
      });

      // Log file activity
      await prisma.fileActivity.create({
        data: {
          action: 'UPDATE',
          fileId,
          userId,
          changes: { contentChanged: true, size: updatedFile.size },
        },
      });

      reply.send({ file: updatedFile });
    } catch (error) {
      logger.error('Error updating file:', error);
      reply.code(500).send({ error: 'Failed to update file' });
    }
  }
);

app.get(
  '/api/files/:fileId',
  { preHandler: authenticateToken },
  async (request, reply) => {
    try {
      const { fileId } = request.params;
      const userId = request.userId; // From authenticateToken preHandler

      const file = await prisma.projectFile.findUnique({
        where: { id: fileId },
        include: { project: { include: { members: true } } },
      });

      if (!file) {
        return reply.code(404).send({ error: 'File not found' });
      }

      // Verify user has access to the project
      const project = file.project;
      if (
        !project ||
        (!project.members.some(m => m.userId === userId) &&
          project.ownerId !== userId)
      ) {
        return reply.code(403).send({ error: 'Access denied to project' });
      }

      reply.send({ file });
    } catch (error) {
      logger.error('Error fetching file:', error);
      reply.code(500).send({ error: 'Failed to fetch file' });
    }
  }
);

// Create HTTP server
const server = http.createServer(app);

// Set up WebSocket server with Yjs support
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket upgrades
server.on('upgrade', (request, socket, head) => {
  logger.info('WebSocket upgrade request:', request.url);

  wss.handleUpgrade(request, socket, head, ws => {
    setupCollaborativeWSConnection(ws, request);
  });
});

// Error handling
app.setErrorHandler((error, request, reply) => {
  logger.error('Fastify error:', error);
  reply.code(500).send({
    error: 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');

  // Close database connection
  await prisma.$disconnect();

  // Close server
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Export important functions for tests
export {
  handleJoinSession,
  handleLeaveSession,
  setupCollaborativeWSConnection,
  updateUserPresence,
  broadcastToSession,
};

// Start server programmatically (exported for tests)
export async function startFastify(options = {}) {
  const port = typeof options.port === 'number' ? options.port : PORT;
  try {
    // Ensure Fastify is ready (registers routes/hooks)
    await app.ready();

    // Start the underlying HTTP server we attached the WebSocket upgrade handler to.
    await new Promise((resolve, reject) => {
      server.listen(port, '0.0.0.0', err => {
        if (err) return reject(err);
        resolve();
      });
    });
    // Determine actual listening port (in case port 0 / ephemeral port was requested)
    const address = server.address && server.address();
    const actualPort = address && address.port ? address.port : port;

    logger.info(`[api] Fastify server listening on http://0.0.0.0:${actualPort}`);
    logger.info(`[api] Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(
      `[api] Database: ${process.env.DATABASE_URL ? 'Connected' : 'Using default'}`
    );
    return { port: actualPort, server };
  } catch (err) {
    logger.error('Fastify failed to start:', err);
    throw err;
  }
}

// Stop server programmatically (for tests) - closes HTTP server, Fastify and DB connection
export async function stopFastify() {
  // Close WebSocket clients and WSS first so connection "close" handlers run
  try {
    if (typeof wss !== 'undefined' && wss && wss.clients) {
      const clients = Array.from(wss.clients || []);
      // ask each client to close and wait for close event (with a timeout fallback)
      await Promise.all(
        clients.map(
          client =>
            new Promise(resolve => {
              let resolved = false;
              const onClose = () => {
                if (resolved) return;
                resolved = true;
                resolve();
              };

              try {
                client.once('close', onClose);
                // attempt a graceful close; if it throws, terminate
                try {
                  client.close();
                } catch (e) {
                  try {
                    client.terminate();
                  } catch (_e) {
                    // ignore
                  }
                }
              } catch (e) {
                // ignore
                resolve();
              }

              // fallback timeout to avoid hanging forever
              setTimeout(onClose, 500);
            })
        )
      );

      // close the WSS itself
      await new Promise((resolve, reject) => {
        try {
          wss.close(err => {
            if (err) return reject(err);
            resolve();
          });
        } catch (e) {
          resolve();
        }
      });
    }
  } catch (err) {
    logger.error('Error closing WebSocketServer during stopFastify:', err);
  }
  try {
    // Close the underlying Node HTTP server if listening
    if (server && server.listening) {
      await new Promise((resolve, reject) => {
        server.close(err => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
  } catch (err) {
    logger.error('Error closing HTTP server during stopFastify:', err);
  }

  try {
    // Close Fastify (cleans up resources)
    if (app && typeof app.close === 'function') {
      await app.close();
    }
  } catch (err) {
    logger.error('Error closing Fastify instance during stopFastify:', err);
  }

  try {
    // Disconnect prisma if available (use injected test prisma if provided)
    const { prisma } = __testPrisma ? { prisma: __testPrisma } : await import('@udp/db');
    if (prisma && typeof prisma.$disconnect === 'function') {
      await prisma.$disconnect();
    }
  } catch (err) {
    // ignore errors during test teardown
  }
}

