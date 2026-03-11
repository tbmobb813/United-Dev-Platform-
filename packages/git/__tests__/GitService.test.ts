import { GitService } from '../src/GitService';
import { GitError, GitErrorCode } from '../src/types';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// ─── Mock isomorphic-git ─────────────────────────────────────────────────────
jest.mock('isomorphic-git');

// Mock the http client module so getHttpClient() doesn't break in tests
jest.mock('../src/http.ts', () => ({
  getHttpClient: jest.fn(() => ({})),
}));

import * as git from 'isomorphic-git';

// Cast every git function to a jest.Mock so TypeScript lets us call mockResolvedValue etc.
const gitMock = git as unknown as Record<string, jest.Mock>;

// ─── Mock FileSystem ─────────────────────────────────────────────────────────
const createMockFS = () => ({
  readFile: jest.fn<() => Promise<Uint8Array>>().mockResolvedValue(new Uint8Array()),
  writeFile: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  readdir: jest.fn<() => Promise<string[]>>().mockResolvedValue([]),
  stat: jest.fn<() => Promise<{ isDirectory(): boolean; isFile(): boolean }>>().mockResolvedValue({
    isDirectory: () => false,
    isFile: () => true,
  }),
  exists: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
const REPO_PATH = '/test/repo';

/** Returns a minimal isomorphic-git commit object */
const makeRawCommit = (oid = 'abc1234def5678') => ({
  oid,
  commit: {
    message: 'Test commit message',
    author: { name: 'Alice', email: 'alice@example.com', timestamp: 1700000000 },
    committer: { name: 'Alice', email: 'alice@example.com', timestamp: 1700000000 },
    parent: [],
  },
});

/** Sets up all the git mocks that openRepository() relies on */
const setupOpenRepositoryMocks = () => {
  gitMock['findRoot'].mockResolvedValue('/test/repo');
  gitMock['currentBranch'].mockResolvedValue('main');
  gitMock['listRemotes'].mockResolvedValue([{ remote: 'origin', url: 'https://github.com/test/repo' }]);
  gitMock['statusMatrix'].mockResolvedValue([]);
  gitMock['log'].mockResolvedValue([makeRawCommit()]);
};

// ─────────────────────────────────────────────────────────────────────────────

describe('GitService', () => {
  let mockFS: ReturnType<typeof createMockFS>;
  let service: GitService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFS = createMockFS();
    service = new GitService(mockFS);

    // Provide sensible defaults for all git functions so tests that don't
    // care about a specific call don't fail with "not a function".
    gitMock['findRoot'].mockResolvedValue(REPO_PATH);
    gitMock['currentBranch'].mockResolvedValue('main');
    gitMock['listRemotes'].mockResolvedValue([]);
    gitMock['statusMatrix'].mockResolvedValue([]);
    gitMock['log'].mockResolvedValue([]);
    gitMock['init'].mockResolvedValue(undefined);
    gitMock['clone'].mockResolvedValue(undefined);
    gitMock['add'].mockResolvedValue(undefined);
    gitMock['resetIndex'].mockResolvedValue(undefined);
    gitMock['commit'].mockResolvedValue('abc1234def5678');
    gitMock['readCommit'].mockResolvedValue(makeRawCommit());
    gitMock['listBranches'].mockResolvedValue(['main']);
    gitMock['branch'].mockResolvedValue(undefined);
    gitMock['checkout'].mockResolvedValue(undefined);
    gitMock['deleteBranch'].mockResolvedValue(undefined);
    gitMock['push'].mockResolvedValue({ ok: true });
    gitMock['pull'].mockResolvedValue(undefined);
    gitMock['fetch'].mockResolvedValue(undefined);
    gitMock['addRemote'].mockResolvedValue(undefined);
    gitMock['deleteRemote'].mockResolvedValue(undefined);
    gitMock['getConfig'].mockResolvedValue(undefined);
    gitMock['setConfig'].mockResolvedValue(undefined);
    gitMock['merge'].mockResolvedValue(undefined);
  });

  // ── Instantiation ──────────────────────────────────────────────────────────

  it('instantiates with a FileSystemInterface', () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(GitService);
  });

  // ── initRepository ─────────────────────────────────────────────────────────

  describe('initRepository()', () => {
    it('calls git.init with the correct dir', async () => {
      setupOpenRepositoryMocks();
      await service.initRepository(REPO_PATH);
      expect(gitMock['init']).toHaveBeenCalledWith(
        expect.objectContaining({ dir: REPO_PATH })
      );
    });

    it('returns a Repository object after init', async () => {
      setupOpenRepositoryMocks();
      const repo = await service.initRepository(REPO_PATH);
      expect(repo).toMatchObject({
        path: REPO_PATH,
        currentBranch: 'main',
      });
    });

    it('passes bare=true to git.init when requested', async () => {
      setupOpenRepositoryMocks();
      await service.initRepository(REPO_PATH, true);
      expect(gitMock['init']).toHaveBeenCalledWith(
        expect.objectContaining({ bare: true })
      );
    });
  });

  // ── openRepository ─────────────────────────────────────────────────────────

  describe('openRepository()', () => {
    it('returns a Repository when .git is detected', async () => {
      setupOpenRepositoryMocks();
      const repo = await service.openRepository(REPO_PATH);
      expect(repo.path).toBe(REPO_PATH);
      expect(repo.currentBranch).toBe('main');
    });

    it('includes remoteUrl when an "origin" remote exists', async () => {
      setupOpenRepositoryMocks();
      const repo = await service.openRepository(REPO_PATH);
      expect(repo.remoteUrl).toBe('https://github.com/test/repo');
    });

    it('throws GitError with NOT_A_REPOSITORY when findRoot rejects', async () => {
      gitMock['findRoot'].mockRejectedValue(new Error('Not a git repo'));
      await expect(service.openRepository('/not/a/repo')).rejects.toThrow(GitError);
    });

    it('throws GitError with code NOT_A_REPOSITORY', async () => {
      gitMock['findRoot'].mockRejectedValue(new Error('Not a git repo'));
      try {
        await service.openRepository('/not/a/repo');
      } catch (err) {
        expect(err).toBeInstanceOf(GitError);
        expect((err as GitError).code).toBe(GitErrorCode.NOT_A_REPOSITORY);
      }
    });
  });

  // ── cloneRepository ────────────────────────────────────────────────────────

  describe('cloneRepository()', () => {
    it('calls git.clone with the correct url and dir', async () => {
      setupOpenRepositoryMocks();
      await service.cloneRepository({
        url: 'https://github.com/example/repo.git',
        directory: REPO_PATH,
      });
      expect(gitMock['clone']).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://github.com/example/repo.git',
          dir: REPO_PATH,
        })
      );
    });

    it('passes auth credentials when provided', async () => {
      setupOpenRepositoryMocks();
      await service.cloneRepository({
        url: 'https://github.com/example/repo.git',
        directory: REPO_PATH,
        auth: { token: 'ghp_token123' },
      });
      // onAuth should be set (not undefined) when auth is provided
      const callArgs = gitMock['clone'].mock.calls[0][0] as Record<string, unknown>;
      expect(callArgs['onAuth']).toBeDefined();
    });

    it('returns a Repository object after clone', async () => {
      setupOpenRepositoryMocks();
      const repo = await service.cloneRepository({
        url: 'https://github.com/example/repo.git',
        directory: REPO_PATH,
      });
      expect(repo).toMatchObject({ path: REPO_PATH });
    });
  });

  // ── getRepositoryStatus ────────────────────────────────────────────────────

  describe('getRepositoryStatus()', () => {
    it('returns clean status when statusMatrix is empty', async () => {
      gitMock['statusMatrix'].mockResolvedValue([]);
      const status = await service.getRepositoryStatus(REPO_PATH);
      expect(status.clean).toBe(true);
      expect(status.staged).toHaveLength(0);
      expect(status.unstaged).toHaveLength(0);
      expect(status.untracked).toHaveLength(0);
    });

    it('correctly maps untracked files (0,2,0)', async () => {
      // [filepath, HEAD, workdir, stage]: 0,2,0 = untracked
      gitMock['statusMatrix'].mockResolvedValue([['new-file.ts', 0, 2, 0]]);
      const status = await service.getRepositoryStatus(REPO_PATH);
      expect(status.untracked).toContain('new-file.ts');
      expect(status.clean).toBe(false);
    });

    it('correctly maps staged added files (0,2,2)', async () => {
      // 0,2,2 = new file staged
      gitMock['statusMatrix'].mockResolvedValue([['staged.ts', 0, 2, 2]]);
      const status = await service.getRepositoryStatus(REPO_PATH);
      expect(status.staged).toHaveLength(1);
      expect(status.staged[0].path).toBe('staged.ts');
      expect(status.staged[0].status).toBe('added');
    });

    it('correctly maps staged modified files (1,2,1)', async () => {
      // 1,2,1 = staged modified
      gitMock['statusMatrix'].mockResolvedValue([['modified.ts', 1, 2, 1]]);
      const status = await service.getRepositoryStatus(REPO_PATH);
      expect(status.staged).toHaveLength(1);
      expect(status.staged[0].path).toBe('modified.ts');
    });

    it('returns current branch in status', async () => {
      gitMock['currentBranch'].mockResolvedValue('feature/my-branch');
      gitMock['statusMatrix'].mockResolvedValue([]);
      const status = await service.getRepositoryStatus(REPO_PATH);
      expect(status.branch).toBe('feature/my-branch');
    });
  });

  // ── stageFiles ─────────────────────────────────────────────────────────────

  describe('stageFiles()', () => {
    it('calls git.add for each provided file path', async () => {
      await service.stageFiles(REPO_PATH, ['src/a.ts', 'src/b.ts']);
      expect(gitMock['add']).toHaveBeenCalledTimes(2);
      expect(gitMock['add']).toHaveBeenCalledWith(
        expect.objectContaining({ filepath: 'src/a.ts', dir: REPO_PATH })
      );
      expect(gitMock['add']).toHaveBeenCalledWith(
        expect.objectContaining({ filepath: 'src/b.ts', dir: REPO_PATH })
      );
    });

    it('does not call git.add when files array is empty', async () => {
      await service.stageFiles(REPO_PATH, []);
      expect(gitMock['add']).not.toHaveBeenCalled();
    });
  });

  // ── unstageFiles ───────────────────────────────────────────────────────────

  describe('unstageFiles()', () => {
    it('calls git.resetIndex for each provided file path', async () => {
      await service.unstageFiles(REPO_PATH, ['src/a.ts', 'src/b.ts']);
      expect(gitMock['resetIndex']).toHaveBeenCalledTimes(2);
      expect(gitMock['resetIndex']).toHaveBeenCalledWith(
        expect.objectContaining({ filepath: 'src/a.ts', dir: REPO_PATH })
      );
    });

    it('does not call git.resetIndex when files array is empty', async () => {
      await service.unstageFiles(REPO_PATH, []);
      expect(gitMock['resetIndex']).not.toHaveBeenCalled();
    });
  });

  // ── commit ─────────────────────────────────────────────────────────────────

  describe('commit()', () => {
    it('calls git.commit with the provided message', async () => {
      gitMock['readCommit'].mockResolvedValue(makeRawCommit());
      await service.commit(REPO_PATH, { message: 'feat: add login' });
      expect(gitMock['commit']).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'feat: add login', dir: REPO_PATH })
      );
    });

    it('passes author name and email to git.commit', async () => {
      gitMock['readCommit'].mockResolvedValue(makeRawCommit());
      await service.commit(REPO_PATH, {
        message: 'fix: typo',
        author: { name: 'Bob', email: 'bob@example.com' },
      });
      expect(gitMock['commit']).toHaveBeenCalledWith(
        expect.objectContaining({
          author: { name: 'Bob', email: 'bob@example.com' },
        })
      );
    });

    it('returns CommitInfo with hash, message, and author', async () => {
      const raw = makeRawCommit('deadbeef1234567');
      gitMock['commit'].mockResolvedValue('deadbeef1234567');
      gitMock['readCommit'].mockResolvedValue(raw);

      const info = await service.commit(REPO_PATH, { message: 'chore: cleanup' });
      expect(info.hash).toBe('deadbeef1234567');
      expect(info.message).toBe('Test commit message');
      expect(info.author.name).toBe('Alice');
    });

    it('throws GitError when git.commit rejects', async () => {
      gitMock['commit'].mockRejectedValue(new Error('nothing to commit'));
      await expect(
        service.commit(REPO_PATH, { message: 'empty' })
      ).rejects.toThrow(GitError);
    });
  });

  // ── getCommitHistory ───────────────────────────────────────────────────────

  describe('getCommitHistory()', () => {
    it('returns an array of CommitInfo objects', async () => {
      gitMock['log'].mockResolvedValue([
        makeRawCommit('aaa0001'),
        makeRawCommit('bbb0002'),
      ]);
      const history = await service.getCommitHistory(REPO_PATH);
      expect(history).toHaveLength(2);
      expect(history[0].hash).toBe('aaa0001');
      expect(history[1].hash).toBe('bbb0002');
    });

    it('passes maxCount to git.log as depth', async () => {
      gitMock['log'].mockResolvedValue([]);
      await service.getCommitHistory(REPO_PATH, { maxCount: 10 });
      expect(gitMock['log']).toHaveBeenCalledWith(
        expect.objectContaining({ depth: 10 })
      );
    });

    it('passes branch to git.log as ref', async () => {
      gitMock['log'].mockResolvedValue([]);
      await service.getCommitHistory(REPO_PATH, { branch: 'feature/x' });
      expect(gitMock['log']).toHaveBeenCalledWith(
        expect.objectContaining({ ref: 'feature/x' })
      );
    });

    it('returns empty array when there are no commits', async () => {
      gitMock['log'].mockResolvedValue([]);
      const history = await service.getCommitHistory(REPO_PATH);
      expect(history).toEqual([]);
    });
  });

  // ── listBranches ───────────────────────────────────────────────────────────

  describe('listBranches()', () => {
    it('returns local branches from git.listBranches', async () => {
      gitMock['listBranches'].mockResolvedValue(['main', 'develop']);
      const branches = await service.listBranches(REPO_PATH);
      expect(branches).toHaveLength(2);
      expect(branches.map(b => b.name)).toContain('main');
      expect(branches.map(b => b.name)).toContain('develop');
    });

    it('marks the current branch correctly', async () => {
      gitMock['listBranches'].mockResolvedValue(['main', 'feature/x']);
      gitMock['currentBranch'].mockResolvedValue('feature/x');
      const branches = await service.listBranches(REPO_PATH);
      const current = branches.find(b => b.current);
      expect(current?.name).toBe('feature/x');
    });

    it('all branches have type "local" when includeRemotes is false', async () => {
      gitMock['listBranches'].mockResolvedValue(['main']);
      const branches = await service.listBranches(REPO_PATH, false);
      expect(branches.every(b => b.type === 'local')).toBe(true);
    });
  });

  // ── createBranch ───────────────────────────────────────────────────────────

  describe('createBranch()', () => {
    it('calls git.branch with the correct ref', async () => {
      await service.createBranch(REPO_PATH, 'feature/new-ui');
      expect(gitMock['branch']).toHaveBeenCalledWith(
        expect.objectContaining({ ref: 'feature/new-ui', dir: REPO_PATH })
      );
    });

    it('passes the "from" ref as object when provided', async () => {
      await service.createBranch(REPO_PATH, 'hotfix/bug', 'main');
      expect(gitMock['branch']).toHaveBeenCalledWith(
        expect.objectContaining({ object: 'main' })
      );
    });

    it('throws GitError when git.branch rejects', async () => {
      gitMock['branch'].mockRejectedValue(new Error('ref already exists'));
      await expect(service.createBranch(REPO_PATH, 'existing-branch')).rejects.toThrow(GitError);
    });
  });

  // ── switchBranch ───────────────────────────────────────────────────────────

  describe('switchBranch()', () => {
    it('calls git.checkout with the correct ref', async () => {
      await service.switchBranch(REPO_PATH, 'develop');
      expect(gitMock['checkout']).toHaveBeenCalledWith(
        expect.objectContaining({ ref: 'develop', dir: REPO_PATH })
      );
    });

    it('throws GitError with BRANCH_NOT_FOUND when checkout fails', async () => {
      gitMock['checkout'].mockRejectedValue(new Error('branch not found'));
      try {
        await service.switchBranch(REPO_PATH, 'ghost-branch');
      } catch (err) {
        expect(err).toBeInstanceOf(GitError);
        expect((err as GitError).code).toBe(GitErrorCode.BRANCH_NOT_FOUND);
      }
    });
  });

  // ── deleteBranch ───────────────────────────────────────────────────────────

  describe('deleteBranch()', () => {
    it('calls git.deleteBranch with the correct ref', async () => {
      await service.deleteBranch(REPO_PATH, 'old-feature');
      expect(gitMock['deleteBranch']).toHaveBeenCalledWith(
        expect.objectContaining({ ref: 'old-feature', dir: REPO_PATH })
      );
    });

    it('throws GitError when deleteBranch fails', async () => {
      gitMock['deleteBranch'].mockRejectedValue(new Error('no such branch'));
      await expect(service.deleteBranch(REPO_PATH, 'missing')).rejects.toThrow(GitError);
    });
  });

  // ── push ───────────────────────────────────────────────────────────────────

  describe('push()', () => {
    it('calls git.push with the default remote "origin"', async () => {
      gitMock['currentBranch'].mockResolvedValue('main');
      await service.push(REPO_PATH);
      expect(gitMock['push']).toHaveBeenCalledWith(
        expect.objectContaining({ remote: 'origin', dir: REPO_PATH })
      );
    });

    it('calls git.push with the specified remote and branch', async () => {
      await service.push(REPO_PATH, { remote: 'upstream', branch: 'release' });
      expect(gitMock['push']).toHaveBeenCalledWith(
        expect.objectContaining({ remote: 'upstream', ref: 'release' })
      );
    });

    it('sets onAuth when auth is provided', async () => {
      gitMock['currentBranch'].mockResolvedValue('main');
      await service.push(REPO_PATH, { auth: { token: 'tok' } });
      const callArgs = gitMock['push'].mock.calls[0][0] as Record<string, unknown>;
      expect(callArgs['onAuth']).toBeDefined();
    });

    it('throws GitError with NETWORK_ERROR when push fails', async () => {
      gitMock['currentBranch'].mockResolvedValue('main');
      gitMock['push'].mockRejectedValue(new Error('connection refused'));
      try {
        await service.push(REPO_PATH);
      } catch (err) {
        expect(err).toBeInstanceOf(GitError);
        expect((err as GitError).code).toBe(GitErrorCode.NETWORK_ERROR);
      }
    });
  });

  // ── pull ───────────────────────────────────────────────────────────────────

  describe('pull()', () => {
    it('calls git.pull with the default remote "origin"', async () => {
      gitMock['currentBranch'].mockResolvedValue('main');
      await service.pull(REPO_PATH);
      expect(gitMock['pull']).toHaveBeenCalledWith(
        expect.objectContaining({ remote: 'origin', dir: REPO_PATH })
      );
    });

    it('calls git.pull with the specified remote and branch', async () => {
      await service.pull(REPO_PATH, { remote: 'upstream', branch: 'feature/x' });
      expect(gitMock['pull']).toHaveBeenCalledWith(
        expect.objectContaining({ remote: 'upstream', ref: 'feature/x' })
      );
    });

    it('throws GitError with NETWORK_ERROR when pull fails', async () => {
      gitMock['currentBranch'].mockResolvedValue('main');
      gitMock['pull'].mockRejectedValue(new Error('network error'));
      try {
        await service.pull(REPO_PATH);
      } catch (err) {
        expect(err).toBeInstanceOf(GitError);
        expect((err as GitError).code).toBe(GitErrorCode.NETWORK_ERROR);
      }
    });
  });

  // ── Event System ───────────────────────────────────────────────────────────

  describe('Event System', () => {
    it('on() registers an event handler', () => {
      const handler = jest.fn();
      service.on('commit:created', handler);
      service.emit({
        type: 'commit:created',
        repositoryPath: REPO_PATH,
        timestamp: new Date(),
        data: {},
      });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('emit() calls all registered handlers for an event type', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      service.on('status:changed', handler1);
      service.on('status:changed', handler2);
      service.emit({
        type: 'status:changed',
        repositoryPath: REPO_PATH,
        timestamp: new Date(),
        data: {},
      });
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('off() removes the registered handler so it is no longer called', () => {
      const handler = jest.fn();
      service.on('branch:switched', handler);
      service.off('branch:switched', handler);
      service.emit({
        type: 'branch:switched',
        repositoryPath: REPO_PATH,
        timestamp: new Date(),
        data: {},
      });
      expect(handler).not.toHaveBeenCalled();
    });

    it('emit() passes the event object to the handler', () => {
      const handler = jest.fn();
      service.on('push:completed', handler);
      const event = {
        type: 'push:completed' as const,
        repositoryPath: REPO_PATH,
        timestamp: new Date(),
        data: { remote: 'origin', branch: 'main' },
      };
      service.emit(event);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('handlers for different event types do not interfere', () => {
      const commitHandler = jest.fn();
      const statusHandler = jest.fn();
      service.on('commit:created', commitHandler);
      service.on('status:changed', statusHandler);
      service.emit({
        type: 'commit:created',
        repositoryPath: REPO_PATH,
        timestamp: new Date(),
        data: {},
      });
      expect(commitHandler).toHaveBeenCalledTimes(1);
      expect(statusHandler).not.toHaveBeenCalled();
    });
  });

  // ── Error Handling ─────────────────────────────────────────────────────────

  describe('Error Handling', () => {
    it('re-throws a GitError as-is without wrapping', async () => {
      const original = new GitError('original', GitErrorCode.BRANCH_NOT_FOUND);
      gitMock['branch'].mockRejectedValue(original);
      try {
        await service.createBranch(REPO_PATH, 'any');
      } catch (err) {
        expect(err).toBe(original);
      }
    });

    it('wraps generic errors in GitError with the default code', async () => {
      gitMock['add'].mockRejectedValue(new Error('disk full'));
      try {
        await service.stageFiles(REPO_PATH, ['file.ts']);
      } catch (err) {
        expect(err).toBeInstanceOf(GitError);
        expect((err as GitError).code).toBe(GitErrorCode.UNKNOWN_ERROR);
      }
    });
  });
});
