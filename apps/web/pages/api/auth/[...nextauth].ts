import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '../../../lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === 'github') {
        // Extract GitHub username from profile
        const githubUsername = profile?.login;
        const githubId = profile?.id?.toString();

        if (githubUsername && githubId) {
          // Update or create user with GitHub info
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              username: githubUsername,
              githubId: githubId,
              name: user.name || githubUsername,
              avatar: user.image,
              image: user.image,
            },
            create: {
              email: user.email,
              username: githubUsername,
              githubId: githubId,
              name: user.name || githubUsername,
              avatar: user.image,
              image: user.image,
            },
          });
        }
      }
      return true;
    },
    async session({ session, user }: any) {
      // Add custom fields to session
      if (session?.user && user) {
        session.user.id = user.id;
        session.user.username = user.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database' as const,
  },
};

export default NextAuth(authOptions);
