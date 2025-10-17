// Minimal type declarations for the shared logger package used across the monorepo
declare module '@udp/logger' {
  export function info(...args: unknown[]): void;
  export function warn(...args: unknown[]): void;
  export function error(...args: unknown[]): void;
  const logger: { info: typeof info; warn: typeof warn; error: typeof error };
  export default logger;
}
