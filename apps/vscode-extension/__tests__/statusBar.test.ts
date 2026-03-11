// Minimal smoke test for VSCode Extension statusBar

describe('VSCode Extension statusBar', () => {
  it('should load without throwing', () => {
    expect(() => require('../src/statusBar')).not.toThrow();
  });
});
