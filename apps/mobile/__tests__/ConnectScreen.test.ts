// Minimal smoke test for ConnectScreen component

describe('ConnectScreen component', () => {
  it('should load without throwing', () => {
    expect(() => require('../components/ConnectScreen')).not.toThrow();
  });
});
