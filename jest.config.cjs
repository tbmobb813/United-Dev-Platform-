module.exports = {
  // Use the ts-jest ESM preset so test files that use `import` / ESM syntax work
  // across the monorepo. This enables ts-jest to compile TypeScript as ESM
  // during Jest runs.
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: [],
  // Treat .ts and .js files as ESM modules so imports like `import { describe } from '@jest/globals'`
  // and built `dist/*.js` files using `import` are executed as ESM by the Jest runtime.
  extensionsToTreatAsEsm: ['.ts', '.js'],
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
