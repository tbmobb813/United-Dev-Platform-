import { GitService } from '../src/GitService';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock FileSystemInterface
const createMockFS = () => ({
  readFile: jest.fn(async () => new Uint8Array()),
  writeFile: jest.fn(async () => {}),
  readdir: jest.fn(async () => []),
  stat: jest.fn(async () => ({ isDirectory: () => false, isFile: () => true })),
  exists: jest.fn(async () => true),
});

describe('GitService', () => {
  let fs: ReturnType<typeof createMockFS>;
  let service: GitService;

  beforeEach(() => {
    fs = createMockFS();
    service = new GitService(fs);
  });

  it('should instantiate with a file system', () => {
    expect(service).toBeDefined();
  });

  it('should throw on openRepository if not a git repo', async () => {
    jest.spyOn(service, 'isGitRepository' as any).mockResolvedValue(false);
    await expect(service.openRepository('/not-a-repo')).rejects.toThrow(/not a git repository/i);
  });

  it('should call git.init on initRepository', async () => {
    const spy = jest.spyOn(require('isomorphic-git'), 'init').mockResolvedValue(undefined);
    jest.spyOn(service, 'openRepository').mockResolvedValue({} as any);
    await service.initRepository('/repo');
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ dir: '/repo' }));
    spy.mockRestore();
  });

  // Add more tests for cloneRepository, event emission, error handling as needed
});
