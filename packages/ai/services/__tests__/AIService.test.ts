import { describe, it, expect } from '@jest/globals';
import { AIService } from '../AIService';

describe('AIService (abstract)', () => {
  it('should throw if instantiated directly', () => {
    // @ts-expect-error
    expect(() => new AIService({})).toThrow();
  });

  it('should require implementers to define generate', () => {
    class Dummy extends AIService {}
    const dummy = new Dummy({});
    expect(() => dummy.generate('prompt')).toThrow();
  });
});
