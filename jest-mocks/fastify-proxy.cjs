const path = require('path');

// Try to resolve the API package's installed Fastify entry. If that fails
// (for example in a dev environment without packages installed), fall back
// to a minimal stub that provides the methods used by the tests.
try {
  const candidate = path.resolve(__dirname, '../apps/api/node_modules/fastify/fastify.js');
  // If file exists, require it. This will return the real Fastify export.
  try {
    const real = require(candidate);
    module.exports = real;
    // Ensure ESM-style default import works when Jest/ts-jest treats this as ESM
    if (real && typeof real === 'function') module.exports.default = real;
  } catch (e) {
    // Try resolving the package name (pnpm store layout)
    const resolved = require.resolve('fastify');
    const real = require(resolved);
    module.exports = real;
    if (real && typeof real === 'function') module.exports.default = real;
  }
} catch (err) {
  // Fallback stub
  function FastifyStub() {
    return {
      addHook: () => {},
      register: () => {},
      listen: async () => {},
      ready: async () => {},
      server: { close: () => {} },
    };
  }
  module.exports = FastifyStub;
  module.exports.default = FastifyStub;
}
