/** Shared base Jest config for UDP monorepo */
module.exports = {
  // ts-jest preset removed to avoid injecting deprecated `globals` settings.
  // Transform below explicitly configures ts-jest to use ESM.
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    // Ensure ts-jest compiles TypeScript and uses ESM
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
        isolatedModules: true,
      },
    ],
  },
  // Ignore common build folders and the repository-level jest.setup.ts under __tests__
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '<rootDir>/__tests__/jest.setup.ts',
  ],
  // Treat TypeScript and JS files as ESM so test files and built dist/*.js that use
  // `import` are executed as ESM by ts-jest / Jest runtime.
  extensionsToTreatAsEsm: ['.ts', '.js'],
  // Allow transforming ESM-only node_modules that Jest otherwise ignores.
  // Some dependencies (yjs, y-websocket, y-monaco, y-protocols, y-indexeddb) ship ESM and
  // must be transformed so Jest can run them in this monorepo setup.
  transformIgnorePatterns: [
    'node_modules/(?!(yjs|y-websocket|y-monaco|y-protocols|y-indexeddb)/)'
  ],
  // ts-jest options are provided per-transform (see `transform` above).
};
