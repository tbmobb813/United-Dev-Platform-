// Minimal smoke test for CLI sync command

describe('CLI sync command', () => {
  it('should load without throwing', () => {
    expect(() => require('../../src/commands/sync')).not.toThrow();
  });
});
