// Minimal smoke test for CLI entry point

describe('CLI index', () => {
  it('should load without throwing', async () => {
    await expect(async () => {
      await import('../src/index');
    }).not.toThrow();
  });
});
