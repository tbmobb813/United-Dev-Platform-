// CJS stub for pino logger — used in Jest tests
// Returns a logger-shaped object that records calls silently.
const pinoLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  fatal: jest.fn(),
  child: jest.fn().mockReturnThis(),
};

const pino = jest.fn(() => pinoLogger);
pino.default = pino;

module.exports = pino;
module.exports.default = pino;
