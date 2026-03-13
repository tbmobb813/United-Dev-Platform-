// Minimal smoke test for useDevicePairing hook

describe('useDevicePairing hook', () => {
  it('should load without throwing', () => {
    expect(() => require('../hooks/useDevicePairing')).not.toThrow();
  });
});
