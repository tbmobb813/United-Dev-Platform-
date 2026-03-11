import { describe, it, expect } from '@jest/globals';
import { OllamaService } from '../OllamaService';

describe('OllamaService', () => {
  it('should instantiate with config', () => {
    const service = new OllamaService({ apiKey: 'test' });
    expect(service).toBeInstanceOf(OllamaService);
  });

  it('should throw if no apiKey provided', () => {
    // @ts-expect-error
    expect(() => new OllamaService({})).toThrow();
  });

  it('should have a generate method', () => {
    const service = new OllamaService({ apiKey: 'test' });
    expect(typeof service.generate).toBe('function');
  });
});
