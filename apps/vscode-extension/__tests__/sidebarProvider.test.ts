// Minimal smoke test for VSCode Extension sidebarProvider

describe('VSCode Extension sidebarProvider', () => {
  it('should load without throwing', () => {
    expect(() => require('../src/sidebarProvider')).not.toThrow();
  });
});
