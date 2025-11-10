import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { prisma } from '@udp/db';
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
        // Optionally log incoming update size for debugging
        try {
          if (process.env.UDP_DEBUG_YJS) {
            const remaining = decoding.readVarUint8Array
              ? undefined
              : undefined;
            logger.info(
              `[yjs] received update (${docName}): ${new Uint8Array(message).length} bytes`
            );
          }
        } catch (e) {
          // ignore logging errors
        }
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

  // Add an update handler that broadcasts updates to the connection (except origin)
  const updateHandler = (update, origin) => {
    try {
      if (process.env.UDP_DEBUG_YJS) {
        logger.info(
          `[yjs] broadcasting update for doc=${docName} (fromOrigin=${origin === conn ? 'self' : 'remote'}) size=${
            update ? update.byteLength || update.length : 'unknown'
          }`
        );
      }
    } catch (e) {
      // ignore logging failures
    }

    if (origin !== conn) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, syncProtocol.messageYjsUpdate);
      encoding.writeVarUint8Array(encoder, update);
      conn.send(encoding.toUint8Array(encoder));
    }
  };

  doc.on('update', updateHandler);

  conn.on('message', messageHandler);
  conn.on('close', () => {
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

// Authentication middleware for REST API endpoints
async function authenticateToken(req, res, next) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    logger.error('NEXTAUTH_SECRET is not defined');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const token = await getToken({ req, secret, raw: true });

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Assuming the JWT contains the user ID in the 'sub' claim (standard for NextAuth.js)
  const decodedToken = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  );
  req.userId = decodedToken.sub; // 'sub' claim typically holds the user ID

  next();
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
    const result = `AI tool '${tool}' executed on ${filePath || 'project'}: ${
      prompt || ''
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
app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    const userId = req.userId; // From authenticateToken middleware

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
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

    res.status(201).json({ project });
  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// File Management Endpoints
app.post('/api/files', authenticateToken, async (req, res) => {
  try {
    const { projectId, path, name, content, type, mimeType } = req.body;
    const userId = req.userId; // From authenticateToken middleware

    if (!projectId || !path || !name) {
      return res
        .status(400)
        .json({ error: 'Project ID, path, and name are required' });
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
      return res.status(403).json({ error: 'Access denied to project' });
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

    res.status(201).json({ file });
  } catch (error) {
    logger.error('Error creating file:', error);
    res.status(500).json({ error: 'Failed to create file' });
  }
});

app.put('/api/files/:fileId', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { content } = req.body;
    const userId = req.userId; // From authenticateToken middleware

    if (!content) {
      return res.status(400).json({ error: 'File content is required' });
    }

    const existingFile = await prisma.projectFile.findUnique({
      where: { id: fileId },
      include: { project: { include: { members: true } } },
    });

    if (!existingFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Verify user has access to the project
    const project = existingFile.project;
    if (
      !project ||
      (!project.members.some(m => m.userId === userId) &&
        project.ownerId !== userId)
    ) {
      return res.status(403).json({ error: 'Access denied to project' });
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

    res.json({ file: updatedFile });
  } catch (error) {
    logger.error('Error updating file:', error);
    res.status(500).json({ error: 'Failed to update file' });
  }
});

app.get('/api/files/:fileId', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.userId; // From authenticateToken middleware

    const file = await prisma.projectFile.findUnique({
      where: { id: fileId },
      include: { project: { include: { members: true } } },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Verify user has access to the project
    const project = file.project;
    if (
      !project ||
      (!project.members.some(m => m.userId === userId) &&
        project.ownerId !== userId)
    ) {
      return res.status(403).json({ error: 'Access denied to project' });
    }

    res.json({ file });
  } catch (error) {
    logger.error('Error fetching file:', error);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
});

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

// Start server
app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    logger.error('Fastify failed to start:', err);
    process.exit(1);
  }
  logger.info(`[api] Fastify server listening on ${address}`);
  logger.info(`[api] Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(
    `[api] Database: ${process.env.DATABASE_URL ? 'Connected' : 'Using default'}`
  );
});
