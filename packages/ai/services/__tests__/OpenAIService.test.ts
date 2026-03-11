import { describe, it, expect } from '@jest/globals';
import { OpenAIService } from '../OpenAIService';

describe('OpenAIService', () => {
  it('should instantiate with config', () => {
    const service = new OpenAIService({ apiKey: 'test' });
    expect(service).toBeInstanceOf(OpenAIService);
  });

  it('should throw if no apiKey provided', () => {
    // @ts-expect-error
    expect(() => new OpenAIService({})).toThrow();
  });

  it('should have a generate method', () => {
    const service = new OpenAIService({ apiKey: 'test' });
    expect(typeof service.generate).toBe('function');
  });
});
