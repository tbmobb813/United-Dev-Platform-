// Minimal smoke test for CollaborativeEditor component

describe('CollaborativeEditor component', () => {
  it('should load without throwing', () => {
    expect(() => require('../components/CollaborativeEditor')).not.toThrow();
  });
});
