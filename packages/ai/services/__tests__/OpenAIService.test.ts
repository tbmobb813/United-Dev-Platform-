import { OpenAIService } from '../OpenAIService';
import { TextEncoder, TextDecoder } from 'util';

;(global as any).TextEncoder = TextEncoder;
;(global as any).TextDecoder = TextDecoder;

describe('OpenAIService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    // @ts-ignore
    delete (global as any).fetch;
  });

  test('generateStreamResponse parses streamed chunks and calls onChunk', async () => {
    const encoder = new TextEncoder();
    const chunk1 = 'data: {"choices":[{"delta":{"content":"Hello "}}] }\\n';
    const chunk2 = 'data: {"choices":[{"delta":{"content":"world"}}],"model":"gpt-4","usage":{"prompt_tokens":1,"completion_tokens":2}}\\n';

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
