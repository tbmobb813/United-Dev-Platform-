import { describe, it, expect } from 'vitest';
import { getErrorMessage, isPrismaError } from '../errors';

describe('errors helpers', () => {
  it('getErrorMessage handles Error, string and unknown', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
<<<<<<< HEAD
  expect(getErrorMessage('simple')).toBe('simple');
  expect(getErrorMessage({ foo: 'bar' })).toBe(JSON.stringify({ foo: 'bar' }));
=======
    expect(getErrorMessage('simple')).toBe('simple');
    expect(getErrorMessage({ foo: 'bar' })).toBe(
      JSON.stringify({ foo: 'bar' })
    );
>>>>>>> 385dfa5 (chore(web): mark client-only pages to avoid Next prerender errors)
  });

  it('isPrismaError detects object with code string', () => {
    const fake = { code: 'P2002', meta: { target: ['email'] } };
    expect(isPrismaError(fake)).toBe(true);
    expect(isPrismaError('not an error')).toBe(false);
    expect(isPrismaError(null)).toBe(false);
  });
});
