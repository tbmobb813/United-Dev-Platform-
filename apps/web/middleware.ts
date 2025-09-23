import { withAuth } from 'next-auth/middleware';
import logger from '../api/lib/logger';

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
    logger.info(`Authenticated request to ${req.nextUrl.pathname}`);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    // Protect API routes (except auth and public endpoints)
    '/api/users/:path*',
    '/api/projects/:path*',
    '/api/ai/sessions/:path*',
    // Protect app pages that require authentication
    '/dashboard/:path*',
    '/projects/:path*',
  ],
};
