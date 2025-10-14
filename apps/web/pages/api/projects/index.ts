import { NextApiRequest, NextApiResponse } from 'next';
import type { Prisma } from '@prisma/client';
import { prisma } from '@udp/db';
import { requireAuth } from '../../../lib/auth';
import logger from '@udp/logger';
import { getErrorMessage, isPrismaError } from '../../../lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Require authentication for all project operations
  const session = await requireAuth(req, res);
  if (!session || !session.user) {
    return;
  }
  const userId = (session.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return;
  }

  switch (req.method) {
    case 'GET':
      return await getProjects(req, res, userId);
    case 'POST':
      return await createProject(req, res, userId);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getProjects(
  req: NextApiRequest,
  res: NextApiResponse,
  currentUserId: string
) {
  try {
    const { userId, visibility, page = '1', limit = '10', search } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where = {} as Prisma.ProjectWhereInput;

    // Filter by visibility with access control
    if (visibility && typeof visibility === 'string') {
      // pass-through: query param string -> Prisma enum value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where.visibility = visibility as any;
    } else {
      // Default: show public projects and projects user has access to
      where.OR = [
        { visibility: 'PUBLIC' },
        { ownerId: currentUserId },
        { members: { some: { userId: currentUserId } } },
      ];
    }

    // Filter by user (owned or member) - only if requested user ID matches current user
    if (userId && typeof userId === 'string') {
      if (userId === currentUserId) {
        where.OR = [{ ownerId: userId }, { members: { some: { userId } } }];
      }
    }

    // Search by name or description
    if (search && typeof search === 'string') {
      where.AND = [
        where.OR ? { OR: where.OR } : {},
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
      delete where.OR;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limitNum,
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
              role: true,
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
          _count: {
            select: {
              files: true,
              members: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    res.status(200).json({
      projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    logger.error('Error fetching projects:', msg);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

async function createProject(
  req: NextApiRequest,
  res: NextApiResponse,
  currentUserId: string
) {
  try {
    const {
      name,
      description,
      visibility = 'PRIVATE',
      repositoryUrl,
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Project name is required',
      });
    }

    // Use current user as owner
    const ownerId = currentUserId;

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        visibility,
        ownerId,
        repositoryUrl: repositoryUrl || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        visibility: true,
        repositoryUrl: true,
        createdAt: true,
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

    res.status(201).json({ project });
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    logger.error('Error creating project:', msg);

    // Handle unique constraint violations (Prisma error shape)
    if (isPrismaError(error) && error.code === 'P2002') {
      return res.status(400).json({
        error: 'Project name already exists for this owner',
      });
    }

    res.status(500).json({ error: 'Failed to create project' });
  }
}
