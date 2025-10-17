import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __udp_prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.__udp_prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__udp_prisma = prisma;
}

export default prisma;
