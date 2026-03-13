// Minimal smoke test for AIService

describe('AIService', () => {
  it('should load without throwing', () => {
    expect(() => require('../services/AIService')).not.toThrow();
  });
});
