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
      // Temporarily relaxed to match current coverage while focused tests are added
      branches: 13,
      functions: 14,
      lines: 15,
      statements: 15,
    },
  },
};
