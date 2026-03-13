import { describe, it, expect } from '@jest/globals';
import { AIServiceFactory } from '../AIServiceFactory';
import { OpenAIService } from '../OpenAIService';
import { AnthropicService } from '../AnthropicService';
import { OllamaService } from '../OllamaService';

describe('AIServiceFactory', () => {
  it('should create OpenAIService when type is openai', () => {
    const service = AIServiceFactory.create('openai', { apiKey: 'test' });
    expect(service).toBeInstanceOf(OpenAIService);
  });

  it('should create AnthropicService when type is anthropic', () => {
    const service = AIServiceFactory.create('anthropic', { apiKey: 'test' });
    expect(service).toBeInstanceOf(AnthropicService);
  });

  it('should create OllamaService when type is ollama', () => {
    const service = AIServiceFactory.create('ollama', { apiKey: 'test' });
    expect(service).toBeInstanceOf(OllamaService);
  });

  it('should throw for unknown type', () => {
    expect(() => AIServiceFactory.create('unknown', {})).toThrow();
  });
});
