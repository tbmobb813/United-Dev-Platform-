/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
// Simple CommonJS shim that ensures a single Yjs instance is used across bundles.
// This file intentionally uses CommonJS so it can be resolved consistently by webpack.
let yjsInstance;
try {
  const y = require('yjs');
  if (!globalThis.__UDP_YJS_SINGLETON) {
    globalThis.__UDP_YJS_SINGLETON = y;
  }
  yjsInstance = globalThis.__UDP_YJS_SINGLETON;
} catch {
  // If require fails during some build phases, fall back to undefined.
  // The alias will still allow modules to import, but they may fail at runtime if yjs is missing.
  // We swallow the error so build-time resolution doesn't crash.
  // If you need the error for debugging, temporarily uncomment and log it:
  // try { require('fs').writeFileSync('/tmp/yjs-shim-error.log', String(err)) } catch {}
}

module.exports = yjsInstance;
