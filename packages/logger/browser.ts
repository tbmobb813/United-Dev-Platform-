// Browser / React Native friendly logger entrypoint
// Minimal wrapper that preserves the same interface as `index.ts` but uses
// `console.*` directly so bundlers can include a tiny implementation.

export type Logger = {
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

const logger: Logger = {
  info: (...args: unknown[]) => {
    // Keep simple; in production this might be a no-op or routed to telemetry
    if (typeof console !== 'undefined' && console.info)
      console.info('[info]', ...args);
  },
  warn: (...args: unknown[]) => {
    if (typeof console !== 'undefined' && console.warn)
      console.warn('[warn]', ...args);
  },
  error: (...args: unknown[]) => {
    if (typeof console !== 'undefined' && console.error)
      console.error('[error]', ...args);
  },
};

export default logger;
