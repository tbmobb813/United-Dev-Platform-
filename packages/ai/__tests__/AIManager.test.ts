import { describe, it, expect } from '@jest/globals';
import { AIManager } from '../AIManager';

describe('AIManager', () => {
  it('should instantiate', () => {
    const manager = new AIManager();
    expect(manager).toBeInstanceOf(AIManager);
  });

  it('should have a getService method', () => {
    const manager = new AIManager();
    expect(typeof manager.getService).toBe('function');
  });
});
