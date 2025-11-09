describe('errors helpers', () => {
  it('getErrorMessage handles Error, string and unknown', async () => {
    // Prefer runtime import from built dist when available to avoid Vitest transform quirks
    let mod;
    try {
      // dist is at ../../dist relative to this test file
      mod = await import('../../dist/errors.js');
    } catch {
      mod = await import('../errors');
    }
    const { getErrorMessage } = mod;
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
    expect(getErrorMessage('simple')).toBe('simple');
    expect(getErrorMessage({ foo: 'bar' })).toBe(JSON.stringify({ foo: 'bar' }));
  });

  it('isPrismaError detects object with code string', async () => {
    let mod;
    try {
      mod = await import('../../dist/errors.js');
    } catch {
      mod = await import('../errors');
    }
    const { isPrismaError } = mod;
    const fake = { code: 'P2002', meta: { target: ['email'] } };
    expect(isPrismaError(fake)).toBe(true);
    expect(isPrismaError('not an error')).toBe(false);
    expect(isPrismaError(null)).toBe(false);
  });
});
