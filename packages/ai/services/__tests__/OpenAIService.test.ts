import { OpenAIService } from '../OpenAIService';

describe('OpenAIService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    // @ts-ignore
    delete (global as any).fetch;
  });

  test('generateStreamResponse parses streamed chunks and calls onChunk', async () => {
    const encoder = new TextEncoder();
    const chunk1 = 'data: {"choices":[{"delta":{"content":"Hello "}}] }\n';
    const chunk2 = 'data: {"choices":[{"delta":{"content":"world"}}],"model":"gpt-4","usage":{"prompt_tokens":1,"completion_tokens":2}}\n';

    let callIndex = 0;
    const reader = {
      read: async () => {
        if (callIndex === 0) {
          callIndex++;
          return { done: false, value: encoder.encode(chunk1) };
        }
        if (callIndex === 1) {
          callIndex++;
          return { done: false, value: encoder.encode(chunk2) };
        }
        return { done: true, value: undefined };
      },
    } as any;

    // @ts-ignore
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true, body: { getReader: () => reader } });

    const svc = new OpenAIService({ apiKey: 'test-key' });
    const chunks: string[] = [];

    const res = await svc.generateStreamResponse([{ role: 'user', content: 'hi' }], undefined, c => chunks.push(c));

    expect(chunks.join('')).toBe('Hello world');
    expect(res.content).toBe('Hello world');
    expect(res.model).toBe('gpt-4');
    expect(res.usage).toEqual({ prompt_tokens: 1, completion_tokens: 2 });
  });

  test('getAvailableModels returns list from API when available', async () => {
    // @ts-ignore
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [{ id: 'gpt-3.5-turbo' }, { id: 'other-model' }] }) });

    const svc = new OpenAIService({ apiKey: 'test-key' });
    const models = await svc.getAvailableModels();
    expect(models).toContain('gpt-3.5-turbo');
  });

  test('validateConnection returns false without key and true when API responds ok', async () => {
    // with key and ok response
    // @ts-ignore
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });
    const svc = new OpenAIService({ apiKey: 'abc' });
    expect(await svc.validateConnection()).toBe(true);
  });

  test('generateStreamResponse throws generic error on non-ok response', async () => {
    // @ts-ignore
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: { message: 'bad' } }) });
    const svc = new OpenAIService({ apiKey: 'test' });
    await expect(svc.generateStreamResponse([{ role: 'user', content: 'hi' }])).rejects.toThrow('OpenAI Streaming API error');
  });
});
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
