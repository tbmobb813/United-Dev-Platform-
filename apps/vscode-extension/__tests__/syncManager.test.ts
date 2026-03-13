// Minimal smoke test for VSCode Extension syncManager

describe('VSCode Extension syncManager', () => {
  it('should load without throwing', () => {
    expect(() => require('../src/syncManager')).not.toThrow();
  });
});
