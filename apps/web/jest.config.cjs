/* eslint-disable @typescript-eslint/no-require-imports */
/* global __dirname */
/* eslint-env node */
const base = require('../../jest.config.base.cjs');
module.exports = {
  ...base,
  displayName: 'web',
  rootDir: __dirname,
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};
