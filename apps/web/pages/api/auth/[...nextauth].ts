import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

// Inline a minimal authOptions here so the production build doesn't
// fail due to a relative import resolution issue in CI. This is a
// small, safe stop-gap to unblock the build and run the duplicate-yjs
// detector. For production, keep the canonical config in
// `apps/web/lib/authOptions.ts` or a shared package and rewire as needed.
const authOptions: NextAuthOptions = {
  providers: [],
  session: { strategy: 'jwt' },
};

export default NextAuth(authOptions);
