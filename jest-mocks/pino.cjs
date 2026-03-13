

// Jest-compatible pino mock for both CJS and ESM imports
const pinoLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  fatal: jest.fn(),
  child: () => pinoLogger,
};
const pino = Object.assign(
  function () { return pinoLogger; },
  { default: function () { return pinoLogger; } }
);
module.exports = pino;
module.exports.default = pino;
