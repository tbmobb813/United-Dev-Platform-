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
  testPathIgnorePatterns: ['/node_modules/', '__tests__/jest.setup.ts'],
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
    '^y-websocket$': '<rootDir>/jest-mocks/y-websocket.cjs',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Run a global teardown for diagnostic purposes in CI/dev when tests
  // leave open handles. We add a small globalTeardown script that prints
  // why-is-node-running output to help locate leaking async resources.
  globalTeardown: '<rootDir>/scripts/jest-global-teardown.cjs',
};
