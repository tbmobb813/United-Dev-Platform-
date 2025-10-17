import type { NextApiRequest, NextApiResponse } from 'next';

// Minimal requireAuth stub used at build time. In production, replace with
// actual authentication logic that integrates with NextAuth or your session store.
export async function requireAuth(
  _req: NextApiRequest,
  _res: NextApiResponse
): Promise<{ user?: { id?: string } } | null> {
  // For build-time and simple local development we return a dummy session.
  return { user: { id: process.env.DEV_USER_ID || 'dev-user' } };
}

export default requireAuth;
