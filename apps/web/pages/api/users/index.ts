import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@udp/db';
import logger from '@udp/logger';
import { getErrorMessage, isPrismaError } from '../../../lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return await getUsers(req, res);
    case 'POST':
      return await createUser(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.status(200).json({ users });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    logger.error('Error fetching users:', msg);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, username, name, avatar, githubId } = req.body;

    // Validate required fields
    if (!email || !username) {
      return res.status(400).json({
        error: 'Email and username are required',
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name: name || null,
        avatar: avatar || null,
        githubId: githubId || null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.status(201).json({ user });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    logger.error('Error creating user:', msg);

    // Handle unique constraint violations
    if (isPrismaError(error) && error.code === 'P2002') {
      const field = error.meta?.target?.[0] ?? 'field';
      return res.status(400).json({
        error: `${field} already exists`,
      });
    }

    res.status(500).json({ error: 'Failed to create user' });
  }
}
