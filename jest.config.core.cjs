const base = require('./jest.config.base.cjs');
module.exports = {
  ...base,
  displayName: 'core',
  testMatch: ['**/__tests__/core/**/*.test.[jt]s?(x)'],
  testTimeout: 30000,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/artifacts/coverage/core',
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 38,
      lines: 44,
      statements: 44,
    },
  },
};
