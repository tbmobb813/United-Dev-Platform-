/** Shared base Jest config for UDP monorepo */
module.exports = {
  // ts-jest preset removed to avoid injecting deprecated `globals` settings.
  // Transform below explicitly configures ts-jest to use ESM.
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    // Ensure ts-jest compiles TypeScript and uses ESM
    '^.+\\.[tj]sx?$': ['ts-jest', { useESM: true }],
  },
  // Ignore common build folders and the repository-level jest.setup.ts under __tests__
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '<rootDir>/__tests__/jest.setup.ts',
  ],
  extensionsToTreatAsEsm: ['.ts'],
  // ts-jest options are provided per-transform (see `transform` above).
};
