import type { NextApiRequest, NextApiResponse } from 'next';

// Minimal requireAuth stub used at build time. In production, replace with
// actual authentication logic that integrates with NextAuth or your session store.
// Parameters are intentionally unused in this minimal build-time stub.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function requireAuth(
  _req: NextApiRequest,
  _res: NextApiResponse
): Promise<{ user?: { id?: string } } | null> {
  // Silence unused parameter warnings in environments where this stub is used.
  void _req;
  void _res;
  // For build-time and simple local development we return a dummy session.
  // Mark parameters as used to satisfy lint rules in this build-time stub
  void _req;
  void _res;
  return { user: { id: process.env.DEV_USER_ID || 'dev-user' } };
}

export default requireAuth;
