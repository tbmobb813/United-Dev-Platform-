/**
 * WebSocket message handlers for collaborative sessions
 * Extracted for testing and reusability
 */

import { prisma } from '@udp/db';
import logger from '@udp/logger';

/**
 * Handle user joining a collaboration session
 */
export async function handleJoinSession(conn, data, sessionId, projectId, userId) {
  try {
    // Verify session exists and user has access
    const session = await prisma.collaborativeSession.findFirst({
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
      return { success: false, error: 'Session not found' };
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
      return { success: false, error: 'Access denied' };
    }

    // Add user as participant if not already
    await prisma.userPresence.upsert({
      where: {
        userId_sessionId: {
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
        lastSeen: null,
      },
    });

    // Send success response with session info
    const response = {
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
    };

    conn.send(JSON.stringify(response));

    return { success: true, session, response };
  } catch (error) {
    logger.error('Error handling join session:', error);
    conn.send(
      JSON.stringify({
        type: 'error',
        message: 'Failed to join session',
      })
    );
    return { success: false, error: error.message };
  }
}

/**
 * Handle user leaving a collaboration session
 */
export async function handleLeaveSession(conn, data, sessionId, userId) {
  try {
    await updateUserPresence(sessionId, userId, false);

    const response = {
      type: 'session-left',
      sessionId,
    };

    conn.send(JSON.stringify(response));

    return { success: true, response };
  } catch (error) {
    logger.error('Error handling leave session:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle cursor position updates
 */
export async function handleCursorUpdate(conn, data, sessionId, userId) {
  try {
    const { cursor } = data;

    if (!cursor) {
      return { success: false, error: 'Cursor data is required' };
    }

    // Update cursor in database
    await prisma.userPresence.update({
      where: {
        userId_sessionId: {
          sessionId,
          userId,
        },
      },
      data: {
        cursor: cursor,
      },
    });

    return { success: true, cursor };
  } catch (error) {
    logger.error('Error handling cursor update:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle file save operations
 */
export async function handleFileSave(conn, data, projectId, userId) {
  try {
    const { fileId, content } = data;

    if (!fileId || content === undefined) {
      conn.send(
        JSON.stringify({
          type: 'error',
          message: 'File ID and content are required',
        })
      );
      return { success: false, error: 'Invalid parameters' };
    }

    // Verify user has access to the project
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        project: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!file) {
      conn.send(
        JSON.stringify({
          type: 'error',
          message: 'File not found',
        })
      );
      return { success: false, error: 'File not found' };
    }

    const hasAccess =
      file.project.ownerId === userId ||
      file.project.members.some(m => m.userId === userId);

    if (!hasAccess) {
      conn.send(
        JSON.stringify({
          type: 'error',
          message: 'Access denied to this file',
        })
      );
      return { success: false, error: 'Access denied' };
    }

    // Update existing file
    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: {
        content,
        size: Buffer.byteLength(content, 'utf8'),
        updatedAt: new Date(),
      },
    });

    const response = {
      type: 'file-saved',
      fileId,
      timestamp: new Date().toISOString(),
    };

    conn.send(JSON.stringify(response));

    return { success: true, file: updatedFile, response };
  } catch (error) {
    logger.error('Error handling file save:', error);
    conn.send(
      JSON.stringify({
        type: 'error',
        message: 'Failed to save file',
      })
    );
    return { success: false, error: error.message };
  }
}

/**
 * Update user presence in session
 */
export async function updateUserPresence(sessionId, userId, isActive) {
  try {
    await prisma.userPresence.upsert({
      where: {
        userId_sessionId: {
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
        lastSeen: isActive ? null : new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    logger.error('Error updating user presence:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Broadcast message to all participants in a session except sender
 * @param {Map} connections - Map of userId to WebSocket connection
 * @param {string} sessionId - Session ID
 * @param {object} message - Message to broadcast
 * @param {string} excludeUserId - User ID to exclude from broadcast
 */
export async function broadcastToSession(
  connections,
  sessionId,
  message,
  excludeUserId = null
) {
  try {
    // Get all active participants in the session
    const participants = await prisma.userPresence.findMany({
      where: {
        sessionId,
        isActive: true,
        ...(excludeUserId && { userId: { not: excludeUserId } }),
      },
    });

    // Send message to each active participant
    participants.forEach(participant => {
      const conn = connections.get(participant.userId);
      if (conn && conn.readyState === 1) {
        // WebSocket.OPEN
        conn.send(JSON.stringify(message));
      }
    });

    logger.info(`Broadcasting to session ${sessionId}:`, message);
    return { success: true, recipientCount: participants.length };
  } catch (error) {
    logger.error('Error broadcasting to session:', error);
    return { success: false, error: error.message };
  }
}
