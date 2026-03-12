import { AIManager } from '../AIManager';

jest.mock('../services/AIServiceFactory', () => ({
  AIServiceFactory: {
    createService: jest.fn(),
  },
  DEFAULT_CONFIGS: { development: { model: 'gpt-4' } },
}));

import { AIServiceFactory } from '../services/AIServiceFactory';

describe('AIManager', () => {
  afterEach(() => jest.restoreAllMocks());

  test('initialize throws without api key', async () => {
    const mgr = new AIManager({ defaultProvider: 'openai', apiKeys: {}, enableStreaming: false });
    await expect(mgr.initialize()).rejects.toThrow(/API key/);
  });

  test('initialize sets up service when validateConnection is true', async () => {
    const fakeService: any = { validateConnection: jest.fn().mockResolvedValue(true), validate: jest.fn(), generateResponse: jest.fn() };
    (AIServiceFactory as any).createService.mockReturnValue(fakeService);

    const mgr = new AIManager({ defaultProvider: 'openai', apiKeys: { openai: 'k' }, enableStreaming: false });
    await expect(mgr.initialize()).resolves.toBeUndefined();
    expect(mgr.isReady()).toBe(true);
  });

  test('chat uses generateStreamResponse when onChunk provided and streaming enabled', async () => {
    const fakeService: any = {
      validateConnection: jest.fn().mockResolvedValue(true),
      generateResponse: jest.fn().mockResolvedValue({ content: 'ok' }),
      generateStreamResponse: jest.fn().mockResolvedValue({ content: 'streamed' }),
      getAvailableModels: jest.fn().mockResolvedValue(['m1'])
    };
    (AIServiceFactory as any).createService.mockReturnValue(fakeService);

    const mgr = new AIManager({ defaultProvider: 'openai', apiKeys: { openai: 'k' }, enableStreaming: true });
    await mgr.initialize();

    const chunks: string[] = [];
    const res = await mgr.chat('hello', undefined, 'chat', c => chunks.push(c));
    expect(fakeService.generateStreamResponse).toHaveBeenCalled();
    expect(res.content).toBe('streamed');
  });

  test('getAvailableModels delegates to service', async () => {
    const fakeService: any = { validateConnection: jest.fn().mockResolvedValue(true), getAvailableModels: jest.fn().mockResolvedValue(['m1']) };
    (AIServiceFactory as any).createService.mockReturnValue(fakeService);

    const mgr = new AIManager({ defaultProvider: 'openai', apiKeys: { openai: 'k' }, enableStreaming: false });
    await mgr.initialize();
    const models = await mgr.getAvailableModels();
    expect(models).toEqual(['m1']);
  });
});
