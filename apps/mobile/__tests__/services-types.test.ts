// Minimal smoke test for services/types

describe('services/types', () => {
  it('should load without throwing', () => {
    expect(() => require('../services/types')).not.toThrow();
  });
});
