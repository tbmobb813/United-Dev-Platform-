import type { IncomingMessage, ServerResponse } from 'http';
import { getServerSession } from 'next-auth/next';
import type { NextAuthOptions } from 'next-auth';

// Minimal placeholder authOptions. Replace with your production config.
export const authOptions: NextAuthOptions = {
  providers: [],
  session: { strategy: 'jwt' },
};

export async function requireAuth(req: IncomingMessage, res: ServerResponse) {
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
