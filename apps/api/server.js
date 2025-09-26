import cors from 'cors';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import { WebSocketServer } from 'ws';
// Use the package-exported subpath (no file extension) so Node's ESM resolver
// honors the package.json "exports" field. Importing 'y-websocket/bin/utils.js'
// caused ERR_PACKAGE_PATH_NOT_EXPORTED inside the container.
import { setupWSConnection } from 'y-websocket/bin/utils';
import { prisma } from '@udp/db';
import logger from '@udp/logger';

// (Placeholder) collaboration session/document storage can be added here when needed

// Enhanced WebSocket connection handler with Yjs collaboration
function setupCollaborativeWSConnection(conn, req) {
  logger.info('Collaborative WebSocket connection established');

  // Extract session/document ID from URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = url.searchParams.get('sessionId');
  const projectId = url.searchParams.get('projectId');
  const userId = url.searchParams.get('userId');

  if (!sessionId || !projectId) {
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
const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', (_req, res) =>
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  })
);

// API endpoints
app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

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
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    logger.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// AI stub endpoint (enhanced)
app.post('/ai/run', async (req, res) => {
  try {
    const { tool, filePath, prompt, projectId, userId } = req.body || {};

    // In a real implementation, this would integrate with AI services
    const result = `AI tool '${tool}' executed on ${filePath || 'project'}: ${
      prompt || ''
    }`;

    // Log AI interaction if projectId and userId provided
    if (projectId && userId) {
      // This could create an AI chat session and log the interaction
      logger.info(`AI interaction: ${userId} in project ${projectId}`);
    }

    res.json({ result, timestamp: new Date().toISOString() });
  } catch (error) {
    logger.error('Error in AI endpoint:', error);
    res.status(500).json({ error: 'AI service error' });
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

// Error handling middleware
app.use((err, req, res, _next) => {
  logger.error('Express error:', err);
  res.status(500).json({
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
server.listen(PORT, () => {
  logger.info(
    `[api] WebSocket collaboration server listening on http://localhost:${PORT}`
  );
  logger.info(`[api] Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(
    `[api] Database: ${
      process.env.DATABASE_URL ? 'Connected' : 'Using default'
    }`
  );
});
