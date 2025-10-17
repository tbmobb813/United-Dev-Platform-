import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@udp/db';
import logger from '@udp/logger';
import { getErrorMessage, isPrismaError } from '@udp/server-utils';

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
      return await getProject(id, res);
    case 'PUT':
      return await updateProject(id, req, res);
    case 'DELETE':
      return await deleteProject(id, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getProject(id: string, res: NextApiResponse) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        visibility: true,
        repositoryUrl: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        members: {
          select: {
            id: true,
            role: true,
            joinedAt: true,
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
        files: {
          select: {
            id: true,
            path: true,
            name: true,
            type: true,
            size: true,
            mimeType: true,
            updatedAt: true,
          },
          orderBy: { path: 'asc' },
        },
        sessions: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            participants: {
              where: { isActive: true },
              select: {
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
        },
        gitRepository: {
          select: {
            url: true,
            branch: true,
            lastSync: true,
            syncStatus: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    logger.error('Error fetching project:', msg);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
}

async function updateProject(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, description, visibility, repositoryUrl } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(visibility && { visibility }),
        ...(repositoryUrl !== undefined && { repositoryUrl }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        visibility: true,
        repositoryUrl: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json({ project });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    logger.error('Error updating project:', msg);

    if (isPrismaError(error) && error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (isPrismaError(error) && error.code === 'P2002') {
      return res.status(400).json({
        error: 'Project name already exists',
      });
    }

    res.status(500).json({ error: 'Failed to update project' });
  }
}

async function deleteProject(id: string, res: NextApiResponse) {
  try {
    await prisma.project.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    logger.error('Error deleting project:', msg);

    if (isPrismaError(error) && error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(500).json({ error: 'Failed to delete project' });
  }
}
