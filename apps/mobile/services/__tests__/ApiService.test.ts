import { ApiService } from '../ApiService';

describe('ApiService', () => {
  it('handles network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network down'));
    const result = await ApiService.getProjects();
    expect(result.error).toBe('Network down');
  });

  it('handles HTTP error with error message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ error: 'Bad input' }),
    });
    const result = await ApiService.getProjects();
    expect(result.error).toBe('Bad input');
  });

  it('handles HTTP error with no error message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => { throw new Error('fail'); },
    });
    const result = await ApiService.getProjects();
    expect(result.error).toMatch(/HTTP 404/);
  });

  it('returns data on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ projects: [{ id: '1', name: 'Test' }] }),
    });
    const result = await ApiService.getProjects();
    expect(result.data).toBeDefined();
  });
});
