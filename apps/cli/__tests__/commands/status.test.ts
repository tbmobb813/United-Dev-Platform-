// Minimal smoke test for CLI status command

describe('CLI status command', () => {
  it('should load without throwing', () => {
    expect(() => require('../../src/commands/status')).not.toThrow();
  });
});
