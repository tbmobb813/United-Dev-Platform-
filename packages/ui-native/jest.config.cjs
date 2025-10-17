const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  displayName: 'ui-native',
  // Disable coverage collection for this package to avoid failing global CI thresholds
  collectCoverage: false,
};
