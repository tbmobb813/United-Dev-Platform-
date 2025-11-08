import { describe, it, expect } from 'vitest';

describe('errors helpers', () => {
  it('getErrorMessage handles Error, string and unknown', async () => {
    const { getErrorMessage } = await import('../errors');
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
    expect(getErrorMessage('simple')).toBe('simple');
    expect(getErrorMessage({ foo: 'bar' })).toBe(JSON.stringify({ foo: 'bar' }));
  });

  it('isPrismaError detects object with code string', async () => {
    const { isPrismaError } = await import('../errors');
    const fake = { code: 'P2002', meta: { target: ['email'] } };
    expect(isPrismaError(fake)).toBe(true);
    expect(isPrismaError('not an error')).toBe(false);
    expect(isPrismaError(null)).toBe(false);
  });
});
