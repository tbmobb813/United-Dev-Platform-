// Minimal smoke test for FileViewer component

describe('FileViewer component', () => {
  it('should load without throwing', () => {
    expect(() => require('../components/FileViewer')).not.toThrow();
  });
});
