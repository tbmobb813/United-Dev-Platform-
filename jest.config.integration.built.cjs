const integration = require('./jest.config.integration.cjs');

module.exports = {
  ...integration,
  displayName: 'integration-built',
  moduleNameMapper: {
    '^@udp/editor-core$': '<rootDir>/packages/editor-core/dist/index.js',
    '^@udp/editor-core/(.*)$': '<rootDir>/packages/editor-core/dist/$1.js',
    '^@udp/filesystem$': '<rootDir>/packages/filesystem/dist/index.js',
    '^@udp/filesystem/(.*)$': '<rootDir>/packages/filesystem/dist/$1.js',
  },
};
