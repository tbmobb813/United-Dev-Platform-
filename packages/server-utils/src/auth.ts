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
    // Use parameter types from getServerSession to avoid `any` while remaining
    // compatible with Next.js request/response shapes in different runtimes.
    const session = await getServerSession(
      req as unknown as Parameters<typeof getServerSession>[0],
      res as unknown as Parameters<typeof getServerSession>[1],
      authOptions as unknown as Parameters<typeof getServerSession>[2]
    );
    return session;
  } catch {
    return null;
  }
}
