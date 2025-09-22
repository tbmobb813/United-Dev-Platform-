import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  switch (req.method) {
    case 'GET':
      return await getSessions(id, res);
    case 'POST':
      return await createSession(id, req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getSessions(projectId: string, res: NextApiResponse) {
  try {
    const sessions = await prisma.collaborationSession.findMany({
      where: { projectId },
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        endedAt: true,
        participants: {
          select: {
            id: true,
            isActive: true,
            joinedAt: true,
            leftAt: true,
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
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
}

async function createSession(
  projectId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, userId } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Session name is required',
      });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create session and add creator as participant
    const session = await prisma.collaborationSession.create({
      data: {
        name,
        projectId,
        participants: userId
          ? {
              create: {
                userId,
                isActive: true,
              },
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
        participants: {
          select: {
            id: true,
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
      },
    });

    res.status(201).json({ session });
  } catch (error: any) {
    console.error('Error creating session:', error);

    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'User not found' });
    }

    res.status(500).json({ error: 'Failed to create session' });
  }
}
