// Minimal smoke test for MCP Server list_files tool

describe('MCP Server list_files tool', () => {
  it('should load without throwing', () => {
    expect(() => require('../../src/tools/list_files')).not.toThrow();
  });
});
