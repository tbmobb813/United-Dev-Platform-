import * as index from '../index';

describe('services/index', () => {
  it('should export AIService and ApiService', () => {
    expect(index.AIService).toBeDefined();
    expect(index.ApiService).toBeDefined();
  });
});
