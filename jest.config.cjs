module.exports = {
  // Use the ts-jest ESM preset so test files that use `import` / ESM syntax work
  // across the monorepo. This enables ts-jest to compile TypeScript as ESM
  // during Jest runs.
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: [],
  // Treat .ts files as ESM modules. Jest will infer .js as ESM when the nearest
  // Treat TypeScript files as ESM modules. Jest will infer .js as ESM from the
  // nearest package.json "type": "module" where applicable, so keep only
  // '.ts' here to avoid validation errors in some Jest versions.
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  // Let ts-jest transform both TS and JS files when needed (allow transforming
  // JS so plain .js ESM test files under the repo can be handled by ts-jest).
  transform: {
    '^.+\.[tj]sx?$': ['ts-jest', { useESM: true, isolatedModules: true }],
  },
  testPathIgnorePatterns: ['/node_modules/', '__tests__/jest.setup.ts'],
  // Transform some ESM-only node_modules so Jest can run them in this monorepo.
  transformIgnorePatterns: [
    'node_modules/(?!(yjs|y-websocket|y-monaco|y-protocols|y-indexeddb)/)'
  ],
  // For some ESM packages used at runtime (y-websocket), prefer the published
  // CJS bundle in tests to avoid transforming upstream ESM source files.
  moduleNameMapper: {
    '^y-websocket$': '<rootDir>/jest-mocks/y-websocket.mjs'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
