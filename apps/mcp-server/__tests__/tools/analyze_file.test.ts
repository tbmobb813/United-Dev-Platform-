// Minimal smoke test for MCP Server analyze_file tool

describe('MCP Server analyze_file tool', () => {
  it('should load without throwing', () => {
    expect(() => require('../../src/tools/analyze_file')).not.toThrow();
  });
});
