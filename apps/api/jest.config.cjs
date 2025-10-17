const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  displayName: 'api',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  testTimeout: 30000,
  // Disable coverage collection at package level (core enforces global thresholds in CI)
  collectCoverage: false,
};
