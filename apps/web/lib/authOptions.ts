import { PrismaAdapter } from '@auth/prisma-adapter';
import * as PrismaPkg from '@prisma/client';
import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

// Resolve PrismaClient constructor robustly to handle variations in how the
// generated client is exported across environments.
const PrismaClientCtor: any =
  (PrismaPkg as any).PrismaClient ??
  (PrismaPkg as any).default ??
  (PrismaPkg as any);
const prisma: any = new PrismaClientCtor();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret',
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export default authOptions;
