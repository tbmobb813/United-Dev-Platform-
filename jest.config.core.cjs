const base = require('./jest.config.base.cjs');
const isCI = !!(
  globalThis.process &&
  globalThis.process.env &&
  globalThis.process.env.CI
);

module.exports = {
  ...base,
  displayName: 'core',
  testMatch: ['**/__tests__/core/**/*.test.[jt]s?(x)'],
  testTimeout: 30000,
  // Only collect coverage and enforce thresholds in CI to avoid blocking local dev runs
  collectCoverage: isCI,
  coverageDirectory: '<rootDir>/artifacts/coverage/core',
  coverageThreshold: isCI
    ? {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50,
        },
      }
    : undefined,
};
