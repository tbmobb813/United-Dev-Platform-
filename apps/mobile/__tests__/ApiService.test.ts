// Minimal smoke test for ApiService

describe('ApiService', () => {
  it('should load without throwing', () => {
    expect(() => require('../services/ApiService')).not.toThrow();
  });
});
