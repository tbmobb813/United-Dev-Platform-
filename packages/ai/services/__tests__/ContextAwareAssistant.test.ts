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
