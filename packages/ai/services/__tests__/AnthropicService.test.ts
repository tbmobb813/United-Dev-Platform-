import { describe, it, expect } from '@jest/globals';
import { AnthropicService } from '../AnthropicService';

describe('AnthropicService', () => {
  it('should instantiate with config', () => {
    const service = new AnthropicService({ apiKey: 'test' });
    expect(service).toBeInstanceOf(AnthropicService);
  });

  it('should throw if no apiKey provided', () => {
    // @ts-expect-error
    expect(() => new AnthropicService({})).toThrow();
  });

  it('should have a generate method', () => {
    const service = new AnthropicService({ apiKey: 'test' });
    expect(typeof service.generate).toBe('function');
  });
});
