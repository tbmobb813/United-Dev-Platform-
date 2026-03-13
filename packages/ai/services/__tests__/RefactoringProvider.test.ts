import { describe, it, expect } from '@jest/globals';
import { RefactoringProvider } from '../RefactoringProvider';

describe('RefactoringProvider', () => {
  it('should instantiate with config', () => {
    const provider = new RefactoringProvider({ apiKey: 'test' });
    expect(provider).toBeInstanceOf(RefactoringProvider);
  });

  it('should have a refactor method', () => {
    const provider = new RefactoringProvider({ apiKey: 'test' });
    expect(typeof provider.refactor).toBe('function');
  });
});
