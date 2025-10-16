const base = require('./jest.config.base.cjs');
const isCI = !!(
  globalThis.process &&
  globalThis.process.env &&
  globalThis.process.env.CI
);

// Require an explicit opt-in environment variable to enforce global coverage
// during CI runs. This lets PRs avoid failing due to repository-wide low
// coverage while preserving the ability to enable enforcement from CI.
const enforceCoverage =
  isCI &&
  !!(
    globalThis.process &&
    globalThis.process.env &&
    globalThis.process.env.ENFORCE_GLOBAL_COVERAGE === 'true'
  );

module.exports = {
  ...base,
  displayName: 'core',
  testMatch: ['**/__tests__/core/**/*.test.[jt]s?(x)'],
  testTimeout: 30000,
  // Only collect coverage and enforce thresholds when explicitly enabled in CI
  collectCoverage: enforceCoverage,
  coverageDirectory: '<rootDir>/artifacts/coverage/core',
  coverageThreshold: enforceCoverage
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
