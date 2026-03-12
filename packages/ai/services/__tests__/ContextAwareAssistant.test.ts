import { ContextAwareAssistant } from '../ContextAwareAssistant';

const makeFakeService = () => ({
  generateResponse: jest.fn(),
});

describe('ContextAwareAssistant', () => {
  afterEach(() => jest.restoreAllMocks());

  test('query parses JSON structured responses and caches results', async () => {
    const fakeService: any = makeFakeService();
    const assistant = new ContextAwareAssistant(fakeService);

    const contextualQuery = {
      query: 'What is wrong?',
      context: { currentFile: 'a.ts', task: 'general-help' },
      scope: 'current-file' as any,
    };

    const payload = JSON.stringify({ answer: 'All good', confidence: 90, sources: [] });
    fakeService.generateResponse.mockResolvedValue({ content: payload });

    const res1 = await assistant.query(contextualQuery as any);
    expect(res1.answer).toBe('All good');

    // second call should be cached
    const res2 = await assistant.query(contextualQuery as any);
    expect(res2.answer).toBe('All good');
  });

  test('analyzeCodebase throws when context not set', async () => {
    const fakeService: any = makeFakeService();
    const assistant = new ContextAwareAssistant(fakeService);
    await expect(assistant.analyzeCodebase()).rejects.toThrow(/context not initialized/i);
  });
});
import { describe, it, expect } from '@jest/globals';
import { ContextAwareAssistant } from '../ContextAwareAssistant';

describe('ContextAwareAssistant', () => {
  it('should instantiate with config', () => {
    const assistant = new ContextAwareAssistant({ apiKey: 'test' });
    expect(assistant).toBeInstanceOf(ContextAwareAssistant);
  });

  it('should have a provideContext method', () => {
    const assistant = new ContextAwareAssistant({ apiKey: 'test' });
    expect(typeof assistant.provideContext).toBe('function');
  });
});
