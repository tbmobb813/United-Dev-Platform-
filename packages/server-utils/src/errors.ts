export const getErrorMessage = (error: unknown): string => {
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
};

// Narrow Prisma error detection to the Prisma client known error shape
export const isPrismaError = (
  error: unknown
): error is { code: string; meta?: Record<string, unknown> } => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  // Use safe indexing to check for 'code' property
  const e = error as Record<string, unknown>;
  return typeof e.code === 'string';
};

export const toEnum = <T extends string | number | undefined>(
  value: unknown
): T | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  return value as T;
};

// Provide a default export object to avoid certain ESM transform shapes
export default {
  getErrorMessage,
  isPrismaError,
  toEnum,
};
