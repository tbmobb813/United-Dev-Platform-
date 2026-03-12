import { AnthropicService } from '../AnthropicService';

describe('AnthropicService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    // @ts-ignore
    delete (global as any).fetch;
  });

  test('generateResponse maps API response to AIResponse', async () => {
    // @ts-ignore
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ content: [{ text: 'Hi there' }], usage: { input_tokens: 1, output_tokens: 2 }, model: 'claude-3', stop_reason: 'stop' }) });

    const svc = new AnthropicService({ apiKey: 'key' });
    const res = await svc.generateResponse([{ role: 'user', content: 'hello' }]);
    expect(res.content).toBe('Hi there');
    expect(res.model).toBe('claude-3');
    expect(res.usage).toEqual({ prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 });
  });

  test('generateStreamResponse accumulates streamed deltas and calls onChunk', async () => {
    const encoder = new TextEncoder();
    const chunk1 = 'data: {"type":"content_block_delta","delta":{"text":"Part1 "}}\n';
    const chunk2 = 'data: {"type":"content_block_delta","delta":{"text":"Part2"}}\n';
    const chunk3 = 'data: {"type":"message_start","message":{"model":"claude-3","usage":{"input_tokens":1,"output_tokens":2}}}\n';
    const chunk4 = 'data: {"type":"message_delta","delta":{"stop_reason":"stop"}}\n';

    let idx = 0;
    const reader = {
      read: async () => {
        const chunks = [chunk1, chunk2, chunk3, chunk4];
        if (idx < chunks.length) {
          return { done: false, value: encoder.encode(chunks[idx++]) } as any;
        }
        return { done: true, value: undefined } as any;
      },
    } as any;

    // @ts-ignore
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true, body: { getReader: () => reader } });

    const svc = new AnthropicService({ apiKey: 'k' });
    const seen: string[] = [];
    const res = await svc.generateStreamResponse([{ role: 'user', content: 'x' }], undefined, c => seen.push(c));

    expect(seen.join('')).toBe('Part1 Part2');
    expect(res.content).toBe('Part1 Part2');
    expect(res.model).toBe('claude-3');
    expect(res.finish_reason).toBe('stop');
    // streaming may expose usage in the raw anthopic shape (input_tokens/output_tokens)
    expect(res.usage).toEqual({ input_tokens: 1, output_tokens: 2 });
  });

  test('generateResponse throws on non-ok', async () => {
    // @ts-ignore
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: { message: 'nope' } }) });
    const svc = new AnthropicService({ apiKey: 'k' });
    await expect(svc.generateResponse([{ role: 'user', content: 'x' }])).rejects.toThrow('Anthropic API error');
  });
});
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
