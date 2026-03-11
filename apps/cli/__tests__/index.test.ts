// Minimal smoke test for CLI entry point

describe('CLI index', () => {
  it('should load without throwing', () => {
    expect(() => require('../src/index')).not.toThrow();
  });
});
