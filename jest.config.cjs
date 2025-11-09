module.exports = {
  // Use the ts-jest ESM preset so test files that use `import` / ESM syntax work
  // across the monorepo. This enables ts-jest to compile TypeScript as ESM
  // during Jest runs.
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: [],
  // Treat .ts files as ESM modules. Jest will infer .js as ESM when the nearest
  // package.json contains "type": "module" (the repo root does), so do not
  // explicitly include '.js' here to avoid a validation error.
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '__tests__/jest.setup.ts'],
  // Transform some ESM-only node_modules so Jest can run them in this monorepo.
  transformIgnorePatterns: [
    'node_modules/(?!(yjs|y-websocket|y-monaco|y-protocols|y-indexeddb)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
