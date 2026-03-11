// Minimal smoke test for useYjsFiles hook

describe('useYjsFiles hook', () => {
  it('should load without throwing', () => {
    expect(() => require('../hooks/useYjsFiles')).not.toThrow();
  });
});
