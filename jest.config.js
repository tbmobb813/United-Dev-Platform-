module.exports = {
  // ts-jest preset removed; transforms explicitly configure ts-jest where needed.
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: [],
  // Treat .ts files as ESM modules so imports like `import { describe } from '@jest/globals'` work
  extensionsToTreatAsEsm: ['.ts'],
  // ts-jest options are provided via transforms (see package-level configs)
  testPathIgnorePatterns: ['/node_modules/', '__tests__/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
