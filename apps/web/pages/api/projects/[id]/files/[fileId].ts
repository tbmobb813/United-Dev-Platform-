import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, fileId } = req.query;

  if (typeof id !== 'string' || typeof fileId !== 'string') {
    return res.status(400).json({ error: 'Invalid project or file ID' });
  }

  switch (req.method) {
    case 'GET':
      return await getFile(id, fileId, res);
    case 'PUT':
      return await updateFile(id, fileId, req, res);
    case 'DELETE':
      return await deleteFile(id, fileId, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getFile(
  projectId: string,
  fileId: string,
  res: NextApiResponse
) {
  try {
    const file = await prisma.projectFile.findFirst({
      where: {
        id: fileId,
        projectId,
      },
      select: {
        id: true,
        path: true,
        name: true,
        type: true,
        content: true,
        size: true,
        mimeType: true,
        createdAt: true,
        updatedAt: true,
        activities: {
          select: {
            id: true,
            action: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.status(200).json({ file });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
}

async function updateFile(
  projectId: string,
  fileId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { path, name, content, userId } = req.body;

    const updateData: any = {};

    if (path) updateData.path = path;
    if (name) updateData.name = name;
    if (content !== undefined) {
      updateData.content = content;
      updateData.size = content ? Buffer.byteLength(content, 'utf8') : 0;
    }

    const file = await prisma.projectFile.update({
      where: {
        id: fileId,
        projectId,
      },
      data: updateData,
      select: {
        id: true,
        path: true,
        name: true,
        type: true,
        size: true,
        mimeType: true,
        updatedAt: true,
      },
    });

    // Log the file activity if userId provided
    if (userId && (content !== undefined || path || name)) {
      await prisma.fileActivity.create({
        data: {
          action: 'UPDATE',
          fileId,
          userId,
          changes: {
            hasContentChange: content !== undefined,
            hasPathChange: !!path,
            hasNameChange: !!name,
          },
        },
      });
    }

    res.status(200).json({ file });
  } catch (error: any) {
    console.error('Error updating file:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'File not found' });
    }

    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'File already exists at this path',
      });
    }

    res.status(500).json({ error: 'Failed to update file' });
  }
}

async function deleteFile(
  projectId: string,
  fileId: string,
  res: NextApiResponse
) {
  try {
    await prisma.projectFile.delete({
      where: {
        id: fileId,
        projectId,
      },
    });

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting file:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'File not found' });
    }

    res.status(500).json({ error: 'Failed to delete file' });
  }
}
