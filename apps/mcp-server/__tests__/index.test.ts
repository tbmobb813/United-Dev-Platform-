// Minimal smoke test for MCP Server index

describe('MCP Server index', () => {
  it('should load without throwing', () => {
    expect(() => require('../src/index')).not.toThrow();
  });
});
