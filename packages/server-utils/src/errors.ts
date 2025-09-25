import type { Prisma } from '@prisma/client';

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error ?? 'Unknown error');
  } catch {
    return 'Unknown error';
  }
}

// Narrow Prisma error detection to the Prisma client known error shape
export function isPrismaError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  // Use safe indexing to check for 'code' property
  const e = error as Record<string, unknown>;
  return typeof e.code === 'string';
}

export function toEnum<T extends string | number | undefined>(
  value: unknown
): T | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  return value as T;
}
