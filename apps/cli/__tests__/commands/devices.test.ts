// Minimal smoke test for CLI devices command

describe('CLI devices command', () => {
  it('should load without throwing', () => {
    expect(() => require('../../src/commands/devices')).not.toThrow();
  });
});
