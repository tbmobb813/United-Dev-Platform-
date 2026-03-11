// Minimal smoke test for MobileHome component

describe('MobileHome component', () => {
  it('should load without throwing', () => {
    expect(() => require('../components/MobileHome')).not.toThrow();
  });
});
