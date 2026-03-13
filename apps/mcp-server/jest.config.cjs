const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  testEnvironment: 'node',
  // Override transform to use inline ts-jest config (non-deprecated form)
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        module: 'ESNext',
        moduleResolution: 'node',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        target: 'ES2020',
      },
    }],
  },
  moduleNameMapper: {
    ...base.moduleNameMapper,
    // Map @udp/ai to workspace source so ts-jest can compile and mock it
    '^@udp/ai$': '<rootDir>/../../packages/ai/index.ts',
    // Strip .js extension from relative imports so Jest can resolve .ts files
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
