const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  displayName: 'editor-core',
  collectCoverage: false,
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};
