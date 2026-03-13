import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { OllamaService } from '../OllamaService';
import { TextEncoder, TextDecoder } from 'util';

if (typeof (globalThis as any).TextEncoder === 'undefined') {
  (globalThis as any).TextEncoder = TextEncoder;
}

if (typeof (globalThis as any).TextDecoder === 'undefined') {
  (globalThis as any).TextDecoder = TextDecoder;
}

describe('OllamaService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

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

  it('generateResponse returns structured response on success', async () => {
    const service = new OllamaService({ apiKey: 'test', model: 'llama2' });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        model: 'llama2',
        created_at: 'now',
        message: { role: 'assistant', content: 'done' },
        done: true,
      }),
    });

    const response = await service.generateResponse([
      { role: 'user', content: 'hello' },
    ]);

    expect(response.content).toBe('done');
    expect(response.model).toBe('llama2');
    expect(response.finish_reason).toBe('stop');
  });

  it('generateStreamResponse reads chunked responses and emits chunks', async () => {
    const service = new OllamaService({ apiKey: 'test', model: 'llama2' });
    const onChunk = jest.fn();
    const releaseLock = jest.fn();
    const reader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode(
            '{"model":"llama2","message":{"content":"Hi "},"done":false}\n'
          ),
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode(
            '{"model":"llama2","message":{"content":"there"},"done":true}\n'
          ),
        }),
      releaseLock,
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: { getReader: () => reader },
    });

    const response = await service.generateStreamResponse(
      [{ role: 'user', content: 'go' }],
      undefined,
      onChunk
    );

    expect(response.content).toBe('Hi there');
    expect(onChunk).toHaveBeenCalledWith('Hi ');
    expect(onChunk).toHaveBeenCalledWith('there');
    expect(releaseLock).toHaveBeenCalled();
  });

  it('returns fallback models when tags endpoint fails', async () => {
    const service = new OllamaService({ apiKey: 'test' });
    (global.fetch as jest.Mock).mockRejectedValue(new Error('offline'));

    const models = await service.getAvailableModels();
    expect(models).toContain('codellama');
    expect(models.length).toBeGreaterThan(3);
  });

  it('deleteModel throws wrapped message when API fails', async () => {
    const service = new OllamaService({ apiKey: 'test' });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    await expect(service.deleteModel('bad-model')).rejects.toThrow(
      'Failed to delete model bad-model'
    );
  });
});
