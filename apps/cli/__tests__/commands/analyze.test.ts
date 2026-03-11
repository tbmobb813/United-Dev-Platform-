// Minimal smoke test for CLI analyze command

describe('CLI analyze command', () => {
  it('should load without throwing', () => {
    expect(() => require('../../src/commands/analyze')).not.toThrow();
  });
});
