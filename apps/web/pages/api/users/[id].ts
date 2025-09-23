import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@udp/db';
import logger from '@udp/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  switch (req.method) {
    case 'GET':
      return await getUser(id, res);
    case 'PUT':
      return await updateUser(id, req, res);
    case 'DELETE':
      return await deleteUser(id, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getUser(id: string, res: NextApiResponse) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        ownedProjects: {
          select: {
            id: true,
            name: true,
            description: true,
            visibility: true,
            createdAt: true,
          },
        },
        memberships: {
          select: {
            role: true,
            joinedAt: true,
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                visibility: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

async function updateUser(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { username, name, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(name !== undefined && { name }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ user });
  } catch (error: any) {
    logger.error('Error updating user:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }

    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return res.status(400).json({
        error: `${field} already exists`,
      });
    }

    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function deleteUser(id: string, res: NextApiResponse) {
  try {
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting user:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(500).json({ error: 'Failed to delete user' });
  }
}
