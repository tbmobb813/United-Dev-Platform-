import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { OpenAIService } from '../OpenAIService';

describe('OpenAIService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

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

  it('generates stream response and aggregates chunks', async () => {
    const service = new OpenAIService({ apiKey: 'test', model: 'gpt-4' });
    const onChunk = jest.fn();

    const streamText =
      'data: {"choices":[{"delta":{"content":"Hello "}}],"model":"gpt-4"}\n' +
      'data: {"choices":[{"delta":{"content":"world"},"finish_reason":"stop"}],"usage":{"prompt_tokens":1,"completion_tokens":2,"total_tokens":3}}\n' +
      'data: [DONE]\n';

    const reader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode(streamText),
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: { getReader: () => reader },
    });

    const response = await service.generateStreamResponse(
      [{ role: 'user', content: 'hi' }],
      'You are helpful',
      onChunk
    );

    expect(response.content).toBe('Hello world');
    expect(response.model).toBe('gpt-4');
    expect(response.finish_reason).toBe('stop');
    expect(onChunk).toHaveBeenCalledWith('Hello ');
    expect(onChunk).toHaveBeenCalledWith('world');
  });

  it('returns fallback models when model fetch fails', async () => {
    const service = new OpenAIService({ apiKey: 'test' });
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network'));

    const models = await service.getAvailableModels();
    expect(models).toEqual(['gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo']);
  });

  it('returns false for validateConnection when fetch throws', async () => {
    const service = new OpenAIService({ apiKey: 'test' });
    (global.fetch as jest.Mock).mockRejectedValue(new Error('down'));

    await expect(service.validateConnection()).resolves.toBe(false);
  });
});
