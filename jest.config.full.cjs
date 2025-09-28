const base = require('./jest.config.base.cjs');
module.exports = {
  ...base,
  displayName: 'full',
  testMatch: [
    '**/__tests__/full/**/*.test.[jt]s?(x)',
    '**/tests/e2e/**/*.test.[jt]s?(x)',
  ],
  testTimeout: 120000,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/artifacts/coverage/full',
};
