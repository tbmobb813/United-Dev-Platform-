
// Jest-compatible pino mock for both CJS and ESM imports
const pinoLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
  trace: () => {},
  fatal: () => {},
  child: () => pinoLogger,
};
function pino() { return pinoLogger; }
pino.default = pino;
module.exports = pino;
module.exports.default = pino;
