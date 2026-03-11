// Minimal smoke test for CLI init command

describe('CLI init command', () => {
  it('should load without throwing', () => {
    expect(() => require('../../src/commands/init')).not.toThrow();
  });
});
