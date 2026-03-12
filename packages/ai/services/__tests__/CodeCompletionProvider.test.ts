import { CodeCompletionProvider, CodeCompletionRequest } from '../CodeCompletionProvider';

const makeFakeService = () => ({
  generateResponse: jest.fn(),
});

describe('CodeCompletionProvider', () => {
  afterEach(() => jest.restoreAllMocks());

  test('parses JSON array response into suggestions and caches results', async () => {
    const fakeService: any = makeFakeService();
    const provider = new CodeCompletionProvider(fakeService);

    const req: CodeCompletionRequest = {
      fileName: 'file.ts',
      language: 'typescript',
      code: 'const a = 1\n',
      position: { line: 1, column: 7 },
    };

    const aiContent = JSON.stringify([
      { text: 'suggest1', description: 'd1', type: 'completion', priority: 5, insertText: 'suggest1' },
      { text: 'suggest2', insertText: 'suggest2' }
    ]);

    fakeService.generateResponse.mockResolvedValue({ content: aiContent });

    const res1 = await provider.getCompletions(req);
    expect(res1.suggestions.length).toBeGreaterThan(0);
    // call again - should use cache and not call aiService again
    const res2 = await provider.getCompletions(req);
    expect(fakeService.generateResponse).toHaveBeenCalledTimes(1);
    expect(res2.suggestions).toEqual(res1.suggestions);
  });

  test('returns fallback suggestions on error', async () => {
    const fakeService: any = makeFakeService();
    const provider = new CodeCompletionProvider(fakeService);

    const req: CodeCompletionRequest = {
      fileName: 'file.py',
      language: 'python',
      code: 'lst.\n',
      // cursor after the '.'
      position: { line: 1, column: 5 },
    };

    fakeService.generateResponse.mockRejectedValue(new Error('boom'));

    const res = await provider.getCompletions(req);
    expect(res.suggestions.length).toBeGreaterThan(0);
    // python fallback should include 'append()'
    expect(res.suggestions.some(s => s.insertText.includes('append'))).toBe(true);
  });
});
import { describe, it, expect } from '@jest/globals';
import { CodeCompletionProvider } from '../CodeCompletionProvider';

describe('CodeCompletionProvider', () => {
  it('should instantiate with config', () => {
    const provider = new CodeCompletionProvider({ apiKey: 'test' });
    expect(provider).toBeInstanceOf(CodeCompletionProvider);
  });

  it('should have a completeCode method', () => {
    const provider = new CodeCompletionProvider({ apiKey: 'test' });
    expect(typeof provider.completeCode).toBe('function');
  });
});
