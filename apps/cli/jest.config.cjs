const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  displayName: 'cli',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  testTimeout: 30000,
  collectCoverage: false,
};
