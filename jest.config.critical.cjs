const base = require('./jest.config.base.cjs');
module.exports = {
  ...base,
  displayName: 'critical',
  testMatch: ['**/__tests__/critical/**/*.test.[jt]s?(x)'],
  testTimeout: 10000,
  collectCoverage: false,
};
