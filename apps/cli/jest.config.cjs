const base = require('../../jest.config.base.cjs');

module.exports = {
  ...base,
  testEnvironment: 'node',
  // Only look in this package's directory to avoid picking up worktree tests
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/integration/',
  ],
  // Transform node-fetch (ESM-only) and other ESM packages
  transformIgnorePatterns: [
    'node_modules/(?!(yjs|y-websocket|y-monaco|y-protocols|y-indexeddb|node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill|chalk|ora|qrcode-terminal|pino|commander)/)',
  ],
  moduleNameMapper: {
    // Resolve relative ESM .js imports to TypeScript sources in tests
    '^(\\.{1,2}/.*)\\.js$': '$1',
    ...base.moduleNameMapper,
    // Point @udp/ai to its source entry to avoid Haste duplicate conflicts from worktrees
    '^@udp/ai$': '<rootDir>/../../packages/ai/index.ts',
    // Stub node-fetch entirely to avoid ESM parse issues
    '^node-fetch$': '<rootDir>/../../jest-mocks/node-fetch.cjs',
    // Stub pino to avoid CJS/ESM issues in test environment
    '^pino$': '<rootDir>/../../jest-mocks/pino.cjs',
    // Stub chalk, ora, qrcode-terminal, commander to avoid ESM import errors
    '^chalk$': '<rootDir>/../../jest-mocks/chalk.cjs',
    '^ora$': '<rootDir>/../../jest-mocks/ora.cjs',
    '^qrcode-terminal$': '<rootDir>/../../jest-mocks/qrcode-terminal.cjs',
    '^commander$': '<rootDir>/../../jest-mocks/commander.cjs',
  },
};
