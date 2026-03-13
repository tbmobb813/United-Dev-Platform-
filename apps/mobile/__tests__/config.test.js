// Minimal smoke test for mobile config.js

describe('Mobile config.js', () => {
  it('should load without throwing', () => {
    expect(() => require('../config')).not.toThrow();
  });
});
