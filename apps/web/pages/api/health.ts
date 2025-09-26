import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    ok: true,
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
}
