/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
const base = require('../../jest.config.base.cjs');
module.exports = {
  ...base,
  displayName: 'web',
  rootDir: __dirname,
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};
