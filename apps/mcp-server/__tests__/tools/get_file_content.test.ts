// Minimal smoke test for MCP Server get_file_content tool

describe('MCP Server get_file_content tool', () => {
  it('should load without throwing', () => {
    expect(() => require('../../src/tools/get_file_content')).not.toThrow();
  });
});
