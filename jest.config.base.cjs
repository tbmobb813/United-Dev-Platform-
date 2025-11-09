/** Shared base Jest config for UDP monorepo */
module.exports = {
  // Use ts-jest ESM preset so TypeScript tests that use ESM import syntax work
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    // Ensure ts-jest compiles TypeScript and uses ESM
    '^.+\.[tj]sx?$': ['ts-jest', { useESM: true, isolatedModules: true }],
  },
  // Ignore common build folders and the repository-level jest.setup.ts under __tests__
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '<rootDir>/__tests__/jest.setup.ts'],
  // Treat TypeScript files as ESM so test files and built dist/*.js that use
  // `import` are executed as ESM by ts-jest / Jest runtime. Do NOT explicitly
  // include '.js' here — Jest will infer .js from the nearest package.json
  // "type": "module" when appropriate.
  // Treat both TypeScript and JS files as ESM so test files and built
  // `dist/*.js` that use `import` are executed as ESM by ts-jest / Jest runtime.
  // This is required for several packages that publish ESM artifacts.
  extensionsToTreatAsEsm: ['.ts', '.js'],
  // Allow transforming ESM-only node_modules that Jest otherwise ignores.
  // Some dependencies (yjs, y-websocket, y-monaco, y-protocols, y-indexeddb) ship ESM and
  // must be transformed so Jest can run them in this monorepo setup.
  transformIgnorePatterns: ['node_modules/(?!(yjs|y-websocket|y-monaco|y-protocols|y-indexeddb)/)'],
  globals: {
    'ts-jest': {
      useESM: true,
      // Ensure ts-jest compiles JS/TS with module settings that allow
      // top-level await and modern ESM features used in tests.
      tsconfig: {
        compilerOptions: {
          module: 'es2022',
          target: 'es2017',
          allowJs: true,
        },
      },
    },
  },
};
