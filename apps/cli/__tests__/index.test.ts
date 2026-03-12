// Minimal smoke test for CLI entry point

describe('CLI index', () => {
  it('should load without throwing', async () => {
    const originalArgv = process.argv;
    process.argv = ['node', 'udp', 'status'];

    await expect(async () => {
      await import('../src/index');
    }).not.toThrow();

    process.argv = originalArgv;
  });
});
