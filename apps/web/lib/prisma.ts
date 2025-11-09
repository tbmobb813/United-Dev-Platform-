import * as PrismaPkg from '@prisma/client';

// The generated Prisma client can be exported in slightly different shapes
// depending on build/tooling. Resolve the available constructor at runtime
// and use `any` for the local types so this file compiles across CI
// environments where the installed @prisma/client typings may differ.
const PrismaClientCtor: any =
  (PrismaPkg as any).PrismaClient ??
  (PrismaPkg as any).default ??
  (PrismaPkg as any);

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClientCtor();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
