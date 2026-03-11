// Minimal smoke test for mobile App.js

describe('Mobile App.js', () => {
  it('should load without throwing', () => {
    expect(() => require('../App')).not.toThrow();
  });
});
