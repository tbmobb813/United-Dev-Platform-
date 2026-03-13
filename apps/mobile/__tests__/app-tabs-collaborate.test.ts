// Minimal smoke test for mobile collaborate tab

describe('Mobile collaborate tab', () => {
  it('should load without throwing', () => {
    expect(() => require('../../../app/(tabs)/collaborate')).not.toThrow();
  });
});
