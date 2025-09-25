import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import type { NextAuthOptions } from 'next-auth';

// Minimal placeholder authOptions. Replace with your production config.
export const authOptions: NextAuthOptions = {
  providers: [],
  session: { strategy: 'jwt' },
};

export async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(
      req as any,
      res as any,
      authOptions as any
    );
    return session;
  } catch {
    return null;
  }
}
