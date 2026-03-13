// Minimal smoke test for FileBrowser component

describe('FileBrowser component', () => {
  it('should load without throwing', () => {
    expect(() => require('../components/FileBrowser')).not.toThrow();
  });
});
