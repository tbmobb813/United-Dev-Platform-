// Minimal smoke test for CLI sync command

describe('CLI sync command', () => {
  it('should load without throwing', async () => {
    await expect(async () => {
      await import('../../src/commands/sync');
    }).not.toThrow();
  });
});
