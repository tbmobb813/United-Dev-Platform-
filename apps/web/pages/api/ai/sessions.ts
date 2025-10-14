import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@udp/db';
import type { Prisma } from '@prisma/client';
import logger from '@udp/logger';
import { getErrorMessage, toEnum, isPrismaError } from 'lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return await getChatSessions(req, res);
    case 'POST':
      return await createChatSession(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getChatSessions(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, projectId, context } = req.query;

    const where = {} as Prisma.AiChatSessionWhereInput;

    if (userId && typeof userId === 'string') {
      where.userId = userId;
    }

    if (projectId && typeof projectId === 'string') {
      where.projectId = projectId;
    }

    if (context && typeof context === 'string') {
      where.context = toEnum(context);
    }

    const sessions = await prisma.aiChatSession.findMany({
      where,
      select: {
        id: true,
        title: true,
        context: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json({ sessions });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    logger.error('Error fetching chat sessions:', msg);
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
}

async function createChatSession(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, context = 'GENERAL', userId, projectId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required',
      });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Verify project exists if provided
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return res.status(400).json({ error: 'Project not found' });
      }
    }

    const session = await prisma.aiChatSession.create({
      data: {
        title: title || null,
        context,
        userId,
        projectId: projectId || null,
      },
      select: {
        id: true,
        title: true,
        context: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
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

    res.status(201).json({ session });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    logger.error('Error creating chat session:', msg);

    if (isPrismaError(error) && error.code === 'P2003') {
      return res.status(400).json({ error: 'User or project not found' });
    }

    res.status(500).json({ error: 'Failed to create chat session' });
  }
}
