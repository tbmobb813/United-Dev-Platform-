import { describe, it, expect } from '@jest/globals';
import { getErrorMessage, isPrismaError } from '../errors';

describe('errors helpers', () => {
  it('getErrorMessage handles Error, string and unknown', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
    expect(getErrorMessage('simple')).toBe('simple');
    expect(getErrorMessage({ foo: 'bar' })).toBe(
      JSON.stringify({ foo: 'bar' })
    );
  });

  it('isPrismaError detects object with code string', () => {
    const fake = { code: 'P2002', meta: { target: ['email'] } };
    expect(isPrismaError(fake)).toBe(true);
    expect(isPrismaError('not an error')).toBe(false);
    expect(isPrismaError(null)).toBe(false);
  });
});
