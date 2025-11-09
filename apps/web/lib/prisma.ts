import * as PrismaPkg from '@prisma/client';
import type { PrismaClient } from '@prisma/client';

// The generated Prisma client can be exported in slightly different shapes
// depending on build/tooling. Resolve the available constructor at runtime
// while avoiding `any` in exported symbols. We express a union of possible
// constructor shapes using `unknown` then narrow to `new (...args) => PrismaClient`.
const PrismaClientCtor =
  ((PrismaPkg as unknown) as {
    PrismaClient?: new (...args: unknown[]) => PrismaClient;
    default?: new (...args: unknown[]) => PrismaClient;
  }).PrismaClient ??
  ((PrismaPkg as unknown) as { default?: new (...args: unknown[]) => PrismaClient }).default ??
  ((PrismaPkg as unknown) as new (...args: unknown[]) => PrismaClient);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClientCtor();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
