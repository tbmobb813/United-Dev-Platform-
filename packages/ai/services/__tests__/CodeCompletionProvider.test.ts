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
