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
      return await getProjectFiles(id, req, res);
    case 'POST':
      return await createFile(id, req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getProjectFiles(
  projectId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { path, type } = req.query;

    const where: any = { projectId };

    // Filter by path prefix (for directory contents)
    if (path && typeof path === 'string') {
      where.path = { startsWith: path };
    }

    // Filter by file type
    if (type && typeof type === 'string') {
      where.type = type;
    }

    const files = await prisma.projectFile.findMany({
      where,
      select: {
        id: true,
        path: true,
        name: true,
        type: true,
        size: true,
        mimeType: true,
        createdAt: true,
        updatedAt: true,
        content: req.query.includeContent === 'true' ? true : false,
      },
      orderBy: [
        { type: 'desc' }, // Directories first
        { path: 'asc' },
      ],
    });

    res.status(200).json({ files });
  } catch (error) {
    console.error('Error fetching project files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
}

async function createFile(
  projectId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { path, name, type = 'FILE', content, mimeType } = req.body;

    if (!path || !name) {
      return res.status(400).json({
        error: 'Path and name are required',
      });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const size = content ? Buffer.byteLength(content, 'utf8') : 0;

    const file = await prisma.projectFile.create({
      data: {
        path,
        name,
        type,
        content: content || null,
        size,
        mimeType: mimeType || null,
        projectId,
      },
      select: {
        id: true,
        path: true,
        name: true,
        type: true,
        size: true,
        mimeType: true,
        createdAt: true,
      },
    });

    res.status(201).json({ file });
  } catch (error: any) {
    console.error('Error creating file:', error);

    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'File already exists at this path',
      });
    }

    res.status(500).json({ error: 'Failed to create file' });
  }
}
