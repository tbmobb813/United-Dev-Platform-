import type { NextAuthOptions } from 'next-auth';

// Minimal authOptions placeholder for build-time. Replace with real
// provider configuration and callbacks in production.
export const authOptions: NextAuthOptions = {
  providers: [],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret',
};

export default authOptions;
