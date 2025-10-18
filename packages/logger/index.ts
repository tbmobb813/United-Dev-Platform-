// Lightweight shared logger exported for workspace-wide use.
// Avoid depending on @types/node in every package by keeping `process` usage minimal.
declare const process: { env: Record<string, string | undefined> };
const isProd = process?.env?.NODE_ENV === 'production';

function format(...args: unknown[]) {
  return args
    .map(a => {
      if (a === null || a === undefined) return String(a);
      if (typeof a === 'string') return a;
      if (a instanceof Error) return a.message;
      try {
        return typeof a === 'object' ? JSON.stringify(a) : String(a);
      } catch {
        return String(a);
      }
    })
    .join(' ');
}

const logger = {
  info: (...args: unknown[]) => {
    if (!isProd) {
      console.log('[info]', format(...args));
    }
  },
  warn: (...args: unknown[]) => {
    console.warn('[warn]', format(...args));
  },
  error: (...args: unknown[]) => {
    console.error('[error]', format(...args));
  },
};

export default logger;
