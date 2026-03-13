const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^vscode$': '<rootDir>/__mocks__/vscode.js',
  },
};
