// Runtime imports (fastify, cors, http, ws) are loaded dynamically in startFastify()
import * as Y from '@udp/editor-core/yjs-singleton';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { prisma as importedPrisma } from '@udp/db';
// Allow tests to inject a mocked prisma instance
let prisma = importedPrisma;
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
            logger.info(
              `[yjs] received update (${docName}): ${new Uint8Array(message).length} bytes`
            );
          }
        } catch {
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
    } catch {
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
    } catch {
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

  // Pass Fastify's raw Node request to getToken
  const token = await getToken({ req: request.raw, secret, raw: true });

  if (!token) {
    reply.code(401).send({ error: 'Unauthorized' });
    return;
  }

  // Assuming the JWT contains the user ID in the 'sub' claim (standard for NextAuth.js)
  const decodedToken = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  );
  // Attach to Fastify request for downstream handlers
  request.userId = decodedToken.sub; // 'sub' claim typically holds the user ID
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
export async function handleJoinSession(conn, data, sessionId, projectId, userId) {
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

// Defer runtime server initialization so unit tests can import handlers
// (like `handleJoinSession`) without requiring the 'fastify' package to be
// resolvable at module import time. Routes and server are registered when
// `startFastify()` is called.
let server = null;
let app = null;
let wss = null;

function registerRoutes(fastifyApp, fastifyCorsImport, httpModule, wsModule) {
  // Register CORS
  fastifyApp.register(fastifyCorsImport, {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  fastifyApp.addHook('onRequest', async (request, _reply) => {
    logger.info(`${request.method} ${request.url}`);
  });

  // Health check
  fastifyApp.get('/health', async (request, reply) => {
    reply.send({
      ok: true,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
    });
  });

  // API endpoints (project/files/session handlers)
  fastifyApp.get('/api/sessions/:sessionId', async (request, reply) => {
    try {
      const sessionId = request.params.sessionId;
      const session = await prisma.collaborationSession.findUnique({
        where: { id: sessionId },
        include: {
          participants: {
            where: { isActive: true },
            include: {
              user: {
                select: { id: true, username: true, name: true, avatar: true },
              },
            },
          },
          project: { select: { id: true, name: true } },
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

  fastifyApp.post('/ai/run', async (request, reply) => {
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

  // Project and file endpoints (minimal re-registrations for tests)
  fastifyApp.post('/api/projects', { preHandler: authenticateToken }, async (request, reply) => {
    try {
      const { name, description, visibility } = request.body || {};
      const userId = request.userId;
      if (!name) {
        reply.code(400).send({ error: 'Project name is required' });
        return;
      }
      const project = await prisma.project.create({
        data: {
          name,
          description,
          visibility: visibility || 'PRIVATE',
          owner: { connect: { id: userId } },
          members: { create: { userId, role: 'OWNER' } },
        },
      });
      reply.code(201).send({ project });
    } catch (error) {
      logger.error('Error creating project:', error);
      reply.code(500).send({ error: 'Failed to create project' });
    }
  });

  fastifyApp.post('/api/files', { preHandler: authenticateToken }, async (request, reply) => {
    try {
      const { projectId, path: filePath, name, content, type, mimeType } = request.body || {};
      const userId = request.userId;
      if (!projectId || !filePath || !name) {
        reply.code(400).send({ error: 'Project ID, path, and name are required' });
        return;
      }
      const project = await prisma.project.findUnique({ where: { id: projectId }, include: { members: true } });
      if (!project || (!project.members.some(m => m.userId === userId) && project.ownerId !== userId)) {
        reply.code(403).send({ error: 'Access denied to project' });
        return;
      }
      const file = await prisma.projectFile.create({ data: { projectId, path: filePath, name, content: content || '', type: type || 'FILE', mimeType: mimeType || 'text/plain', size: content ? Buffer.byteLength(content, 'utf8') : 0 } });
      await prisma.fileActivity.create({ data: { action: 'CREATE', fileId: file.id, userId } });
      reply.code(201).send({ file });
    } catch (error) {
      logger.error('Error creating file:', error);
      reply.code(500).send({ error: 'Failed to create file' });
    }
  });

  fastifyApp.put('/api/files/:fileId', { preHandler: authenticateToken }, async (request, reply) => {
    try {
      const { fileId } = request.params || {};
      const { content } = request.body || {};
      const userId = request.userId;
      if (!content) { reply.code(400).send({ error: 'File content is required' }); return; }
      const existingFile = await prisma.projectFile.findUnique({ where: { id: fileId }, include: { project: { include: { members: true } } } });
      if (!existingFile) { reply.code(404).send({ error: 'File not found' }); return; }
      const project = existingFile.project;
      if (!project || (!project.members.some(m => m.userId === userId) && project.ownerId !== userId)) { reply.code(403).send({ error: 'Access denied to project' }); return; }
      const updatedFile = await prisma.projectFile.update({ where: { id: fileId }, data: { content, size: Buffer.byteLength(content, 'utf8'), updatedAt: new Date() } });
      await prisma.fileActivity.create({ data: { action: 'UPDATE', fileId, userId, changes: { contentChanged: true, size: updatedFile.size } } });
      reply.send({ file: updatedFile });
    } catch (error) { logger.error('Error updating file:', error); reply.code(500).send({ error: 'Failed to update file' }); }
  });

  fastifyApp.get('/api/files/:fileId', { preHandler: authenticateToken }, async (request, reply) => {
    try {
      const { fileId } = request.params || {};
      const userId = request.userId;
      const file = await prisma.projectFile.findUnique({ where: { id: fileId }, include: { project: { include: { members: true } } } });
      if (!file) { reply.code(404).send({ error: 'File not found' }); return; }
      const project = file.project;
      if (!project || (!project.members.some(m => m.userId === userId) && project.ownerId !== userId)) { reply.code(403).send({ error: 'Access denied to project' }); return; }
      reply.send({ file });
    } catch (error) { logger.error('Error fetching file:', error); reply.code(500).send({ error: 'Failed to fetch file' }); }
  });

  // Create HTTP server and WebSocket server
  server = httpModule.createServer(fastifyApp);
  wss = new wsModule.WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    logger.info('WebSocket upgrade request:', request.url);
    wss.handleUpgrade(request, socket, head, ws => { setupCollaborativeWSConnection(ws, request); });
  });

  // Error handler
  fastifyApp.setErrorHandler((error, request, reply) => {
    logger.error('Fastify error:', error);
    reply.code(500).send({ error: 'Internal Server Error', timestamp: new Date().toISOString() });
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  try {
    await prisma.$disconnect();
  } catch {
    // ignore
  }

  try {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  } catch {
    process.exit(0);
  }
});

// Expose helpers so tests can control server lifecycle and inject mocks
export function __setPrisma(newPrisma) { prisma = newPrisma; }

export async function startFastify({ port = PORT } = {}) {
  // Dynamically import runtime dependencies so unit tests can import handlers
  // without requiring these packages to be resolved at module load time.
  let FastifyModule;
  let fastifyCorsModule;
  const httpModule = await import('http');
  let wsModule;

  // Try to dynamically import fastify and @fastify/cors using the normal resolver.
  // If that fails (Turborrepo/Jest worker CWDs sometimes can't resolve workspace deps),
  // fall back to the API package's node_modules entry to ensure deterministic resolution.
  try {
    FastifyModule = await import('fastify');
    fastifyCorsModule = await import('@fastify/cors');
    wsModule = await import('ws');
  // resolved via normal package resolver
  } catch {
    // Attempt to load from the API package's node_modules location directly.
    try {
      // Resolve paths relative to the API package directory. We avoid using
      // the literal `import.meta` token here so this file can be imported by
      // CommonJS-based test runners (Jest) without a parse error.
      const path = await import('path');
      const fs = await import('fs');
      const { pathToFileURL } = await import('url');

      let baseDir;
      if (typeof __dirname !== 'undefined') {
        baseDir = __dirname;
      } else {
        try {
          // Use a Function to reference import.meta at runtime only when ESM is active
          const maybeUrl = new Function('return (typeof import !== "undefined" && import.meta && import.meta.url) ? import.meta.url : undefined')();
          if (maybeUrl) {
            baseDir = path.dirname(new URL(maybeUrl).pathname);
          }
        } catch {
          baseDir = process.cwd();
        }
      }

      baseDir = baseDir || process.cwd();
      const candidateFastify = path.resolve(baseDir, 'node_modules', 'fastify', 'fastify.js');
      const candidateCors = path.resolve(baseDir, 'node_modules', '@fastify', 'cors', 'index.js');
      const candidateWs = path.resolve(baseDir, 'node_modules', 'ws', 'index.js');

      if (fs.existsSync(candidateFastify)) {
        FastifyModule = await import(pathToFileURL(candidateFastify).href);
  // resolved via candidate file
      }
      if (fs.existsSync(candidateCors)) {
        fastifyCorsModule = await import(pathToFileURL(candidateCors).href);
  // resolved @fastify/cors via candidate file
      }
      if (fs.existsSync(candidateWs)) {
        wsModule = await import(pathToFileURL(candidateWs).href);
  // resolved ws via candidate file
      }
    } catch {
      // swallow - we'll rethrow below if we couldn't load the modules
    }
  }

  // If still not loaded, throw an informative error to help debugging test runner resolution.
  if (!FastifyModule || !fastifyCorsModule || !wsModule) {
    const err = new Error('Failed to dynamically import Fastify/@fastify/cors/ws. Ensure dependencies are installed and resolvable from the test runner CWD.');
    logger.error(err.message, { fastifyLoaded: !!FastifyModule, corsLoaded: !!fastifyCorsModule, wsLoaded: !!wsModule });
    throw err;
  }

  const FastifyImport = FastifyModule && FastifyModule.default ? FastifyModule.default : FastifyModule;
  const fastifyCorsImport = fastifyCorsModule && fastifyCorsModule.default ? fastifyCorsModule.default : fastifyCorsModule;

  // (diagnostic logging removed) ensure factory is callable

  app = FastifyImport({ logger: true });
  // removed debug logging; inspect app shape only when necessary
  // If the imported fastify factory returned an app without addHook (likely a test mock
  // or an alternative implementation), attempt to load the real fastify entry from the
  // API package node_modules directory and recreate the app. This helps when Jest's
  // resolver returns a manual/mock implementation (for example apps/api/__mocks__/fastify.js)
  // while we still want the real Fastify behavior for integration tests.
  if (!app || typeof (app && app.addHook) !== 'function') {
    try {
      const path = await import('path');
      const fs = await import('fs');
      const { pathToFileURL } = await import('url');
      let baseDir;
  if (typeof __dirname !== 'undefined') { baseDir = __dirname; }
  else {
        try {
          const maybeUrl = new Function('return (typeof import !== "undefined" && import.meta && import.meta.url) ? import.meta.url : undefined')();
          if (maybeUrl) { baseDir = path.dirname(new URL(maybeUrl).pathname); }
        } catch {
          baseDir = process.cwd();
        }
      }
      baseDir = baseDir || process.cwd();
      const realFastifyPath = path.resolve(baseDir, 'node_modules', 'fastify', 'fastify.js');
      if (fs.existsSync(realFastifyPath)) {
  // attempting to load real fastify implementation from candidate path
        const RealFastifyModule = await import(pathToFileURL(realFastifyPath).href);
        const RealFastifyImport = RealFastifyModule && RealFastifyModule.default ? RealFastifyModule.default : RealFastifyModule;
        // Recreate app using the real factory
        app = RealFastifyImport({ logger: true });
  // recreated fastify app from real implementation
        // If still missing addHook, we'll let the subsequent registration fail with a clearer message
      }
    } catch {
      // failed to load real fastify fallback — let the original error surface later
    }
  }
  // Register routes and create server/wss
  registerRoutes(app, fastifyCorsImport, httpModule, wsModule);

  return new Promise((resolve, reject) => {
    server.listen({ port, host: '0.0.0.0' }, err => {
      if (err) { logger.error('Fastify failed to start:', err); return reject(err); }
      try {
        const addr = server.address();
        const actualPort = addr && addr.port ? addr.port : port;
        logger.info(`[api] Fastify server listening on ${actualPort}`);
        logger.info(`[api] Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`[api] Database: ${process.env.DATABASE_URL ? 'Connected' : 'Using default'}`);
        resolve({ port: actualPort });
      } catch (e) { reject(e); }
    });
  });
}

export async function stopFastify() {
  try {
    await prisma?.$disconnect?.();
  } catch {
    // ignore
  }

  return new Promise(resolve => {
    try {
      if (server) {
        server.close(() => resolve());
      } else {
        resolve();
      }
    } catch {
      resolve();
    }
  });
}

// If not running under Jest, start the server when the script is executed directly.
// Tests import this module and control lifecycle via exported helpers.
if (!process.env.JEST_WORKER_ID) {
  startFastify().catch(err => { logger.error('Failed to start server:', err); process.exit(1); });
}
