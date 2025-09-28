/** Shared base Jest config for UDP monorepo */
module.exports = {
  // Use ts-jest ESM preset so TypeScript tests that use ESM import syntax work
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    // Ensure ts-jest compiles TypeScript and uses ESM
    '^.+\\.[tj]sx?$': ['ts-jest', { useESM: true }],
  },
  // Ignore common build folders and the repository-level jest.setup.ts under __tests__
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '<rootDir>/__tests__/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
