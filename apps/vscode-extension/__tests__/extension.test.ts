// Minimal smoke test for VSCode Extension extension

describe('VSCode Extension extension', () => {
  it('should load without throwing', () => {
    expect(() => require('../src/extension')).not.toThrow();
  });
});
