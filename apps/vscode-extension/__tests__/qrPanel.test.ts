// Minimal smoke test for VSCode Extension qrPanel

describe('VSCode Extension qrPanel', () => {
  it('should load without throwing', () => {
    expect(() => require('../src/qrPanel')).not.toThrow();
  });
});
