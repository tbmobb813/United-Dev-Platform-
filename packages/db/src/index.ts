import * as Prisma from '@prisma/client';

type PrismaClientType = Prisma.PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __udp_prisma: PrismaClientType | undefined;
}

export const prisma: PrismaClientType =
  global.__udp_prisma ?? new Prisma.PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__udp_prisma = prisma;
}

export default prisma;
