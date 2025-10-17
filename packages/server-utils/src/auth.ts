import type { IncomingMessage, ServerResponse } from 'http';
import { getServerSession } from 'next-auth/next';
import type { NextAuthOptions, Session } from 'next-auth';

// Minimal placeholder authOptions. Replace with your production config.
export const authOptions: NextAuthOptions = {
  providers: [],
  session: { strategy: 'jwt' },
};

export async function requireAuth(
  req: IncomingMessage,
  res: ServerResponse
): Promise<Session | null> {
  try {
    const session = (await getServerSession(
      req as any,
      res as any,
      authOptions
    )) as Session | null;
    return session;
  } catch {
    return null;
  }
}
