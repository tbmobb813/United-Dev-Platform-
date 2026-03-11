module.exports = {
  // Use the ts-jest ESM preset so test files that use `import` / ESM syntax work
  // across the monorepo. This enables ts-jest to compile TypeScript as ESM
  // during Jest runs.
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  // Exclude integration tests — run those separately with jest.config.integration.cjs
  // which uses real WebSocket connections and no y-websocket mock.
  testPathIgnorePatterns: [
    '/node_modules/',
    '__tests__/jest.setup.ts',
    '/__tests__/integration/',
  ],
  setupFilesAfterEnv: [],
  // Treat TypeScript files as ESM modules.
  extensionsToTreatAsEsm: ['.ts'],
  // Let ts-jest transform both TS and JS files.
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { useESM: true }],
  },
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
    '^y-websocket$': `${__dirname}/jest-mocks/y-websocket.cjs`,
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
