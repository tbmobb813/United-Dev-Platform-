const path = require('path');

module.exports = {
  // Use the ts-jest ESM preset so test files that use `import` / ESM syntax work
  // across the monorepo. This enables ts-jest to compile TypeScript as ESM
  // during Jest runs.
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/scripts/jest-test-helpers.cjs'],
  // Treat .ts files as ESM modules. Jest will infer .js as ESM when the nearest
  // Treat TypeScript files as ESM modules. Jest will infer .js as ESM from the
  // nearest package.json "type": "module" where applicable, so keep only
  // '.ts' here to avoid validation errors in some Jest versions.
  extensionsToTreatAsEsm: ['.ts'],
  // ts-jest options are provided inline in the `transform` entry below. Avoid
  // using the deprecated `globals['ts-jest']` configuration.
  // Let ts-jest transform both TS and JS files when needed (allow transforming
  // JS so plain .js ESM test files under the repo can be handled by ts-jest).
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { useESM: true }],
  },
  testPathIgnorePatterns: ['/node_modules/', '__tests__/jest.setup.ts', 'scripts/__tests__/.*\\.cjs$'],
  // Transform some ESM-only node_modules so Jest can run them in this monorepo.
  transformIgnorePatterns: [
    'node_modules/(?!(yjs|y-websocket|y-monaco|y-protocols|y-indexeddb)/)',
  ],
  // For some ESM packages used at runtime (y-websocket), prefer the published
  // CJS bundle in tests to avoid transforming upstream ESM source files.
  moduleNameMapper: {
    // Point to the CommonJS mock by default so tests running under Jest/CJS
    // don't fail parsing `export` in the ESM mock. Packages that run as ESM
    // can still mock via unstable_mockModule in their tests when needed.
  '^y-websocket$': path.resolve(__dirname, 'jest-mocks/y-websocket.cjs'),
  // Ensure 'fastify' resolves consistently across workspace test runners by
  // mapping it to the API package's installed entry point. Use an absolute
  // path (resolved from this repo root) so package-level Jest runs whose
  // `rootDir` is a package directory still resolve the mock correctly.
  '^fastify$': path.resolve(__dirname, 'jest-mocks/fastify-proxy.cjs'),
  // Map the workspace DB package to its source entry so Jest can resolve
  // and (optionally) mock it in tests without requiring the package to be
  // built to `dist/` during CI test runs. Use an absolute path from the
  // repository root so package-level runs find the source file.
  '^@udp/db$': path.resolve(__dirname, 'packages/db/src/index.ts'),
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Run a global teardown for diagnostic purposes in CI/dev when tests
  // leave open handles. We add a small globalTeardown script that prints
  // why-is-node-running output to help locate leaking async resources.
  globalTeardown: '<rootDir>/scripts/jest-global-teardown.cjs',
};
