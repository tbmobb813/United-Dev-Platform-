// Minimal utility helpers used by API routes.
// These are intentionally small, safe stubs to satisfy server-side imports
// during the Next.js build. Replace with full implementations as needed.

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  try {
    if (error instanceof Error) return error.message;
    return String(error);
  } catch {
    return 'Unknown error';
  }
}

export function isPrismaError(error: unknown): error is { code?: string } {
  return (
    !!error &&
    typeof error === 'object' &&
    'code' in (error as Record<string, unknown>)
  );
}

export function toEnum<T extends string = string>(v: string | undefined): T | undefined {
  if (v === undefined || v === null) return undefined;
  // simple passthrough; callers usually convert strings to enum types
  return (v as unknown) as T;
}

export { toEnum as toEnumString };
