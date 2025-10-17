/* global __dirname */
/* eslint-env node */
const base = require('../../jest.config.base.cjs');
module.exports = {
  ...base,
  displayName: 'ui',
  rootDir: __dirname,
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};
