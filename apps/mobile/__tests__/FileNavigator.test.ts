// Minimal smoke test for FileNavigator component

describe('FileNavigator component', () => {
  it('should load without throwing', () => {
    expect(() => require('../components/FileNavigator')).not.toThrow();
  });
});
