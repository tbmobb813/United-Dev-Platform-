import { describe, it, expect } from '@jest/globals';

describe('packages/filesystem - sanity', () => {
  it('string manipulation sanity', () => {
    expect('abc'.toUpperCase()).toBe('ABC');
  });
});
