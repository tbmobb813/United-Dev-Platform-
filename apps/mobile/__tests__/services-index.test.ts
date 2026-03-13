// Minimal smoke test for services/index

describe('services/index', () => {
  it('should load without throwing', () => {
    expect(() => require('../services/index')).not.toThrow();
  });
});
