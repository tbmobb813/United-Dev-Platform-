/** Jest config for integration tests that require real WebSocket connections.
 *
 * These tests spawn a real server process and use the actual y-websocket
 * package to establish live WebSocket connections. The y-websocket mock used
 * in unit/core tests is intentionally excluded here.
 */
const base = require('./jest.config.base.cjs');

module.exports = {
  ...base,
  displayName: 'integration',
  testMatch: ['**/__tests__/integration/**/*.test.[jt]s?(x)'],
  testTimeout: 30000,
  // Override moduleNameMapper to remove the y-websocket mock so integration
  // tests can make real WebSocket connections to the spawned test server.
  moduleNameMapper: {},
};
