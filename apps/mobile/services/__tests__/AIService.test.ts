import { AIService } from '../AIService';

describe('AIService', () => {
  it('returns a stream for explainCode', async () => {
    const gen = await AIService.explainCode('console.log(1)', 'file.js', 'js');
    expect(typeof gen.next).toBe('function');
  });

  it('returns a stream for generateTests', async () => {
    const gen = await AIService.generateTests(
      'function foo(){}',
      'foo.js',
      'js'
    );
    expect(typeof gen.next).toBe('function');
  });

  // You can add more tests for error/edge cases if streamAIResponse is implemented
});
