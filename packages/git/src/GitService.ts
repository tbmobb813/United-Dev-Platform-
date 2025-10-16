import * as git from 'isomorphic-git';
import { getHttpClient } from './http.js';
import { FileSystemInterface } from './GitServiceFactory';

import type {
  Branch,
  CommitInfo,
  CommitOptions,
  DiffOptions,
  DiffResult,
  FileChange,
  FileDiff,
  FileStatus,
  GitAuth,
  GitCloneOptions,
  GitConfig,
  GitEvent,
  GitEventListener,
  GitEventType,
  GitServiceInterface,
  LogOptions,
  MergeOptions,
  MergeResult,
  PullOptions,
  PushOptions,
  Remote,
  Repository,
  RepositoryStatus,
} from './types';

import { GitError, GitErrorCode } from './types';

/**
 * Isomorphic-git compatible file system adapter
 */
interface IsomorphicGitFS {
  readFile(
    filepath: string,
    options?: { encoding?: string }
  ): Promise<Uint8Array>;
  writeFile(filepath: string, data: Uint8Array): Promise<void>;
  readdir(filepath: string): Promise<string[]>;
  stat(filepath: string): Promise<{
    isDirectory(): boolean;
    isFile(): boolean;
    mode: number;
    size: number;
  }>;
  lstat(filepath: string): Promise<{
    isDirectory(): boolean;
    isFile(): boolean;
    mode: number;
    size: number;
  }>;
  mkdir(filepath: string): Promise<void>;
  rmdir(filepath: string): Promise<void>;
  unlink(filepath: string): Promise<void>;
}

/**
 * Core Git Service Implementation
 * Provides comprehensive git operations using isomorphic-git
 */
export class GitService implements GitServiceInterface {
  private eventListeners: Map<GitEventType, GitEventListener[]> = new Map();
  private fileSystem: FileSystemInterface;
  private gitFS: IsomorphicGitFS;

  constructor(fileSystem: FileSystemInterface) {
    this.fileSystem = fileSystem;
    this.gitFS = this.createGitFSAdapter(fileSystem);
    this.initializeEventListeners();
  }

  /**
   * Create isomorphic-git compatible file system adapter
   */
  private createGitFSAdapter(fs: FileSystemInterface): IsomorphicGitFS {
    return {
      async readFile(
        filepath: string,
        _options?: { encoding?: string }
      ): Promise<Uint8Array> {
        return fs.readFile(filepath);
      },
      async writeFile(filepath: string, data: Uint8Array): Promise<void> {
        return fs.writeFile(filepath, data);
      },
      async readdir(filepath: string): Promise<string[]> {
        return fs.readdir(filepath);
      },
      async stat(filepath: string): Promise<{
        isDirectory(): boolean;
        isFile(): boolean;
        mode: number;
        size: number;
      }> {
        const stat = await fs.stat(filepath);
        return {
          ...stat,
          mode: stat.isDirectory() ? 16877 : 33188, // Basic file modes
          size: 0, // Size not implemented in basic interface
        };
      },
      async lstat(filepath: string): Promise<{
        isDirectory(): boolean;
        isFile(): boolean;
        mode: number;
        size: number;
      }> {
        return this.stat(filepath);
      },
      async mkdir(_filepath: string): Promise<void> {
        // Basic mkdir - implementation would depend on specific file system
        throw new Error('mkdir not implemented');
      },
      async rmdir(_filepath: string): Promise<void> {
        // Basic rmdir - implementation would depend on specific file system
        throw new Error('rmdir not implemented');
      },
      async unlink(_filepath: string): Promise<void> {
        // Basic unlink - implementation would depend on specific file system
        throw new Error('unlink not implemented');
      },
    };
  }

  /**
   * Initialize a new git repository
   */
  async initRepository(path: string, bare = false): Promise<Repository> {
    try {
      await git.init({
        fs: this.gitFS,
        dir: path,
        bare,
      });

      this.emit({
        type: 'repository:opened',
        repositoryPath: path,
        timestamp: new Date(),
        data: { initialized: true, bare },
      });

      return await this.openRepository(path);
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Open an existing git repository
   */
  async openRepository(repositoryPath: string): Promise<Repository> {
    try {
      // Check if it's a git repository
      const isRepo = await this.isGitRepository(repositoryPath);
      if (!isRepo) {
        throw new GitError(
          `Not a git repository: ${repositoryPath}`,
          GitErrorCode.NOT_A_REPOSITORY
        );
      }

      // Get repository information
      const [currentBranch, remotes, status, lastCommit] = await Promise.all([
        this.getCurrentBranch(repositoryPath),
        this.listRemotes(repositoryPath),
        this.getRepositoryStatus(repositoryPath),
        this.getLastCommit(repositoryPath).catch(() => undefined),
      ]);

      const repository: Repository = {
        id: this.generateRepositoryId(repositoryPath),
        name: this.getBaseName(repositoryPath),
        path: repositoryPath,
        remoteUrl: remotes.find(r => r.name === 'origin')?.url,
        defaultBranch: 'main',
        currentBranch,
        isClean: status.clean,
        lastCommit,
        remotes,
      };

      this.emit({
        type: 'repository:opened',
        repositoryPath,
        timestamp: new Date(),
        data: repository,
      });

      return repository;
    } catch (error) {
      throw this.handleError(error, GitErrorCode.REPOSITORY_NOT_FOUND);
    }
  }

  /**
   * Clone a remote repository
   */
  async cloneRepository(options: GitCloneOptions): Promise<Repository> {
    try {
      const { url, directory, branch, depth, auth, onProgress } = options;

      await git.clone({
        fs: this.gitFS,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        http: getHttpClient() as any,
        dir: directory,
        url,
        ref: branch,
        singleBranch: !!branch,
        depth,
        onAuth: auth ? () => this.formatAuth(auth) : undefined,
        onProgress: onProgress
          ? progress => {
              onProgress({
                phase: progress.phase as
                  | 'initializing'
                  | 'counting'
                  | 'compressing'
                  | 'receiving'
                  | 'resolving'
                  | 'done',
                loaded: progress.loaded || 0,
                total: progress.total || 0,
                percentage: progress.total
                  ? ((progress.loaded || 0) / progress.total) * 100
                  : 0,
              });
            }
          : undefined,
      });

      return await this.openRepository(directory);
    } catch (error) {
      throw this.handleError(error, GitErrorCode.NETWORK_ERROR);
    }
  }

  /**
   * Get repository status
   */
  async getRepositoryStatus(repositoryPath: string): Promise<RepositoryStatus> {
    try {
      const [currentBranch, statusMatrix] = await Promise.all([
        this.getCurrentBranch(repositoryPath),
        git.statusMatrix({
          fs: this.gitFS,
          dir: repositoryPath,
        }),
      ]);

      const staged: FileChange[] = [];
      const unstaged: FileChange[] = [];
      const untracked: string[] = [];

      statusMatrix.forEach(
        ([filepath, headStatus, workdirStatus, stageStatus]) => {
          const change: FileChange = {
            path: filepath,
            status: this.mapFileStatus(headStatus, workdirStatus, stageStatus),
            staged: stageStatus === 1,
            unstaged: workdirStatus !== stageStatus,
          };

          if (headStatus === 0 && workdirStatus === 2 && stageStatus === 0) {
            // Untracked file
            untracked.push(filepath);
          } else if (stageStatus === 1 || stageStatus === 2) {
            // Staged changes
            staged.push(change);
          } else if (workdirStatus !== stageStatus) {
            // Unstaged changes
            unstaged.push(change);
          }
        }
      );

      const status: RepositoryStatus = {
        branch: currentBranch,
        ahead: 0, // TODO: Calculate ahead/behind
        behind: 0,
        staged,
        unstaged,
        untracked,
        conflicted: [], // TODO: Detect conflicts
        clean:
          staged.length === 0 &&
          unstaged.length === 0 &&
          untracked.length === 0,
      };

      this.emit({
        type: 'status:changed',
        repositoryPath,
        timestamp: new Date(),
        data: status,
      });

      return status;
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * List branches
   */
  async listBranches(
    repositoryPath: string,
    includeRemotes = false
  ): Promise<Branch[]> {
    try {
      const [localBranches, remoteBranches, currentBranch] = await Promise.all([
        git.listBranches({
          fs: this.gitFS,
          dir: repositoryPath,
        }),
        includeRemotes
          ? git.listBranches({
              fs: this.gitFS,
              dir: repositoryPath,
              remote: 'origin',
            })
          : Promise.resolve([]),
        this.getCurrentBranch(repositoryPath),
      ]);

      const branches: Branch[] = [];

      // Add local branches
      for (const branchName of localBranches) {
        branches.push({
          name: branchName,
          type: 'local',
          current: branchName === currentBranch,
          ahead: 0, // TODO: Calculate ahead/behind
          behind: 0,
        });
      }

      // Add remote branches
      if (includeRemotes) {
        for (const branchName of remoteBranches) {
          branches.push({
            name: branchName,
            type: 'remote',
            current: false,
            ahead: 0,
            behind: 0,
          });
        }
      }

      return branches;
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Create a new branch
   */
  async createBranch(
    repositoryPath: string,
    name: string,
    from?: string
  ): Promise<void> {
    try {
      await git.branch({
        fs: this.gitFS,
        dir: repositoryPath,
        ref: name,
        object: from,
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Switch to a different branch
   */
  async switchBranch(repositoryPath: string, name: string): Promise<void> {
    try {
      await git.checkout({
        fs: this.gitFS,
        dir: repositoryPath,
        ref: name,
      });

      this.emit({
        type: 'branch:switched',
        repositoryPath,
        timestamp: new Date(),
        data: { branch: name },
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.BRANCH_NOT_FOUND);
    }
  }

  /**
   * Delete a branch
   */
  async deleteBranch(
    repositoryPath: string,
    name: string,
    _force = false
  ): Promise<void> {
    try {
      await git.deleteBranch({
        fs: this.gitFS,
        dir: repositoryPath,
        ref: name,
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.BRANCH_NOT_FOUND);
    }
  }

  /**
   * Merge branches with conflict detection
   */
  async mergeBranch(
    repositoryPath: string,
    options: MergeOptions
  ): Promise<MergeResult> {
    try {
      const { branch, message } = options;
      const currentBranch = await this.getCurrentBranch(repositoryPath);

      // Check for conflicts before merge
      const conflicts = await this.checkForConflicts(
        repositoryPath,
        currentBranch,
        branch
      );

      if (conflicts.length > 0) {
        const result: MergeResult = {
          success: false,
          conflicts: conflicts.map(path => ({
            path,
            reason: 'content' as const,
            resolved: false,
          })),
          message: `Merge conflict detected between ${currentBranch} and ${branch}`,
        };

        this.emit({
          type: 'conflict:detected',
          repositoryPath,
          timestamp: new Date(),
          data: {
            conflicts: result.conflicts,
            branches: [currentBranch, branch],
          },
        });

        return result;
      }

      // Proceed with merge
      await git.merge({
        fs: this.gitFS,
        dir: repositoryPath,
        ours: currentBranch,
        theirs: branch,
        message,
      });

      // Ensure `commit` is a string by using the `hash` property from `CommitInfo`
      const mergedCommit =
        (await this.getLastCommit(repositoryPath))?.hash || '';

      this.emit({
        type: 'merge:completed',
        repositoryPath,
        timestamp: new Date(),
        data: { success: true, commit: mergedCommit },
      });

      return {
        success: true,
        commit: mergedCommit,
        conflicts: [],
      };
    } catch (error) {
      // Enhanced error handling for merge conflicts
      if (isMergeError(error)) {
        const conflicts = await this.detectMergeConflicts(repositoryPath);
        const result: MergeResult = {
          success: false,
          conflicts: conflicts.map(path => ({
            path,
            reason: 'content' as const,
            resolved: false,
          })),
          message: `Merge conflict detected between branches`,
        };

        this.emit({
          type: 'conflict:detected',
          repositoryPath,
          timestamp: new Date(),
          data: {
            conflicts: result.conflicts,
            branches: [],
          },
        });

        return result;
      }

      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Check for merge conflicts
   */
  private async detectMergeConflicts(
    repositoryPath: string
  ): Promise<string[]> {
    try {
      const statusMatrix = await git.statusMatrix({
        fs: this.gitFS,
        dir: repositoryPath,
      });

      // Look for files with merge conflict markers or unusual status
      const conflicts: string[] = [];

      for (const [filepath] of statusMatrix) {
        try {
          const fileContent = await this.fileSystem.readFile(
            `${repositoryPath}/${filepath}`
          );
          const content = Buffer.from(fileContent).toString('utf8');
          // Check for conflict markers
          if (
            content.includes('<<<<<<<') ||
            content.includes('>>>>>>>') ||
            content.includes('=======')
          ) {
            conflicts.push(filepath);
          }
        } catch {
          // If we can't read the file, skip it
        }
      }

      return conflicts;
    } catch {
      return [];
    }
  }

  /**
   * Resolve a merge conflict
   */
  async resolveConflict(
    repositoryPath: string,
    filePath: string,
    resolution: 'ours' | 'theirs' | 'manual'
  ): Promise<void> {
    try {
      if (resolution === 'manual') {
        // For manual resolution, just stage the file assuming user resolved it
        await this.stageFiles(repositoryPath, [filePath]);
      } else {
        // Resolve conflict by choosing one side
        await git.checkout({
          fs: this.gitFS,
          dir: repositoryPath,
          ref: resolution === 'ours' ? 'HEAD' : 'MERGE_HEAD',
          filepaths: [filePath],
        });

        // Stage the resolved file
        await this.stageFiles(repositoryPath, [filePath]);
      }

      this.emit({
        type: 'conflict:resolved',
        repositoryPath,
        timestamp: new Date(),
        data: { filePath, resolution },
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.MERGE_CONFLICT);
    }
  }

  /**
   * Abort an ongoing merge
   */
  async abortMerge(repositoryPath: string): Promise<void> {
    try {
      // Reset to HEAD to abort merge
      await git.checkout({
        fs: this.gitFS,
        dir: repositoryPath,
        ref: 'HEAD',
        force: true,
      });

      this.emit({
        type: 'merge:completed',
        repositoryPath,
        timestamp: new Date(),
        data: { success: false, message: 'Merge aborted' },
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Stage files for commit
   */
  async stageFiles(repositoryPath: string, files: string[]): Promise<void> {
    try {
      for (const file of files) {
        await git.add({
          fs: this.gitFS,
          dir: repositoryPath,
          filepath: file,
        });
      }
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Unstage files
   */
  async unstageFiles(repositoryPath: string, files: string[]): Promise<void> {
    try {
      for (const file of files) {
        await git.resetIndex({
          fs: this.gitFS,
          dir: repositoryPath,
          filepath: file,
        });
      }
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Create a commit
   */
  async commit(
    repositoryPath: string,
    options: CommitOptions
  ): Promise<CommitInfo> {
    try {
      const { message, author, committer } = options;

      const commitHash = await git.commit({
        fs: this.gitFS,
        dir: repositoryPath,
        message,
        author: author
          ? {
              name: author.name,
              email: author.email,
            }
          : undefined,
        committer: committer
          ? {
              name: committer.name,
              email: committer.email,
            }
          : undefined,
      });

      const commitInfo = await this.getCommitInfoInternal(
        repositoryPath,
        commitHash
      );

      this.emit({
        type: 'commit:created',
        repositoryPath,
        timestamp: new Date(),
        data: commitInfo,
      });

      return commitInfo;
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Get commit history
   */
  async getCommitHistory(
    repositoryPath: string,
    options: LogOptions = {}
  ): Promise<CommitInfo[]> {
    try {
      const commits = await git.log({
        fs: this.gitFS,
        dir: repositoryPath,
        depth: options.maxCount,
        ref: options.branch,
        since: options.since,
      });

      return commits.map(commit => this.mapCommitInfo(commit));
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Get diff between commits or working directory
   */
  async getCommitDiff(
    repositoryPath: string,
    options: DiffOptions
  ): Promise<DiffResult> {
    try {
      const { base } = options;

      // Get file changes between commits
      const statusMatrix = await git.statusMatrix({
        fs: this.gitFS,
        dir: repositoryPath,
        ref: base,
      });

      const files: FileDiff[] = [];
      let totalAdditions = 0;
      let totalDeletions = 0;

      for (const [
        filepath,
        headStatus,
        workdirStatus,
        stageStatus,
      ] of statusMatrix) {
        if (headStatus !== workdirStatus || workdirStatus !== stageStatus) {
          const status = this.mapFileStatus(
            headStatus,
            workdirStatus,
            stageStatus
          );

          // Create a basic diff structure - in a real implementation,
          // we would parse actual diff output
          const fileDiff: FileDiff = {
            path: filepath,
            status,
            hunks: [
              {
                oldStart: 1,
                oldLines: status === 'added' ? 0 : 10,
                newStart: 1,
                newLines: status === 'deleted' ? 0 : 10,
                header: `@@ -1,${status === 'added' ? 0 : 10} +1,${
                  status === 'deleted' ? 0 : 10
                } @@`,
                lines: [
                  {
                    type:
                      status === 'added'
                        ? 'add'
                        : status === 'deleted'
                          ? 'delete'
                          : 'context',
                    content: `${status} file: ${filepath}`,
                    oldLineNumber: 1,
                    newLineNumber: 1,
                  },
                ],
              },
            ],
            isBinary: false,
          };

          files.push(fileDiff);
          // Simple heuristic for diff stats
          if (status === 'added') {
            totalAdditions += 10;
          } else if (status === 'deleted') {
            totalDeletions += 10;
          } else if (status === 'modified') {
            totalAdditions += 5;
            totalDeletions += 5;
          }
        }
      }

      return {
        files,
        stats: {
          files: files.length,
          additions: totalAdditions,
          deletions: totalDeletions,
          changes: totalAdditions + totalDeletions,
        },
      };
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Get staged files that are ready for commit
   */
  async getStagedFiles(repositoryPath: string): Promise<FileChange[]> {
    try {
      const status = await this.getRepositoryStatus(repositoryPath);
      return status.staged;
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Stage all modified and new files
   */
  async stageAllChanges(repositoryPath: string): Promise<void> {
    try {
      const status = await this.getRepositoryStatus(repositoryPath);
      const filesToStage = [
        ...status.unstaged.map(f => f.path),
        ...status.untracked,
      ];

      if (filesToStage.length > 0) {
        await this.stageFiles(repositoryPath, filesToStage);
      }
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Reset all staged files
   */
  async resetAllStaged(repositoryPath: string): Promise<void> {
    try {
      const status = await this.getRepositoryStatus(repositoryPath);
      if (status.staged.length > 0) {
        const stagedFiles = status.staged.map(f => f.path);
        await this.unstageFiles(repositoryPath, stagedFiles);
      }
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Get commit information by hash
   */
  async getCommitInfo(
    repositoryPath: string,
    commitHash: string
  ): Promise<CommitInfo> {
    try {
      return await this.getCommitInfoInternal(repositoryPath, commitHash);
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Add a remote
   */
  async addRemote(
    repositoryPath: string,
    name: string,
    url: string
  ): Promise<void> {
    try {
      await git.addRemote({
        fs: this.gitFS,
        dir: repositoryPath,
        remote: name,
        url,
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Remove a remote
   */
  async removeRemote(repositoryPath: string, name: string): Promise<void> {
    try {
      await git.deleteRemote({
        fs: this.gitFS,
        dir: repositoryPath,
        remote: name,
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Push changes to remote
   */
  async push(repositoryPath: string, options: PushOptions = {}): Promise<void> {
    try {
      const { remote = 'origin', branch, auth, onProgress } = options;

      // Get current branch if not specified
      const currentBranch =
        branch || (await this.getCurrentBranch(repositoryPath));

      await git.push({
        fs: this.gitFS,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        http: getHttpClient() as any,
        dir: repositoryPath,
        remote,
        ref: currentBranch,
        onAuth: auth ? () => this.formatAuth(auth) : undefined,
        onProgress: onProgress
          ? () => {
              // Progress handling disabled due to type complexity
            }
          : undefined,
      });

      this.emit({
        type: 'push:completed',
        repositoryPath,
        timestamp: new Date(),
        data: { remote, branch: currentBranch },
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.NETWORK_ERROR);
    }
  }

  /**
   * Pull changes from remote
   */
  async pull(repositoryPath: string, options: PullOptions = {}): Promise<void> {
    try {
      const { remote = 'origin', branch, auth, onProgress } = options;

      // Get current branch if not specified
      const currentBranch =
        branch || (await this.getCurrentBranch(repositoryPath));

      await git.pull({
        fs: this.gitFS,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        http: getHttpClient() as any,
        dir: repositoryPath,
        ref: currentBranch,
        remote,
        onAuth: auth ? () => this.formatAuth(auth) : undefined,
        onProgress: onProgress
          ? () => {
              // Progress handling disabled due to type complexity
            }
          : undefined,
      });

      this.emit({
        type: 'pull:completed',
        repositoryPath,
        timestamp: new Date(),
        data: { remote, branch: currentBranch },
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.NETWORK_ERROR);
    }
  }

  /**
   * Fetch from remote
   */
  async fetch(
    repositoryPath: string,
    remote = 'origin',
    options: { auth?: GitAuth } = {}
  ): Promise<void> {
    try {
      const { auth } = options;

      await git.fetch({
        fs: this.gitFS,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        http: getHttpClient() as any,
        dir: repositoryPath,
        remote,
        onAuth: auth ? () => this.formatAuth(auth) : undefined,
      });

      this.emit({
        type: 'fetch:completed',
        repositoryPath,
        timestamp: new Date(),
        data: { remote },
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.NETWORK_ERROR);
    }
  }

  /**
   * Get git configuration
   */
  async getConfig(repositoryPath: string, _global = false): Promise<GitConfig> {
    try {
      const userName = await git.getConfig({
        fs: this.gitFS,
        dir: repositoryPath,
        path: 'user.name',
      });

      const userEmail = await git.getConfig({
        fs: this.gitFS,
        dir: repositoryPath,
        path: 'user.email',
      });

      return {
        user: {
          name: userName,
          email: userEmail,
        },
      };
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Set git configuration
   */
  async setConfig(
    repositoryPath: string,
    key: string,
    value: string,
    _global = false
  ): Promise<void> {
    try {
      await git.setConfig({
        fs: this.gitFS,
        dir: repositoryPath,
        path: key,
        value,
      });
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * Event system implementation
   */
  on<T>(event: GitEventType, listener: GitEventListener<T>): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener as GitEventListener);
  }

  off<T>(event: GitEventType, listener: GitEventListener<T>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener as GitEventListener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit<T>(event: GitEvent<T>): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => listener(event));
    }
  }

  // Helper methods
  private initializeEventListeners(): void {
    const eventTypes: GitEventType[] = [
      'repository:opened',
      'repository:closed',
      'branch:switched',
      'commit:created',
      'status:changed',
      'push:started',
      'push:completed',
      'pull:started',
      'pull:completed',
      'merge:started',
      'merge:completed',
      'conflict:detected',
      'conflict:resolved',
    ];

    eventTypes.forEach(event => {
      this.eventListeners.set(event, []);
    });
  }

  private async isGitRepository(repositoryPath: string): Promise<boolean> {
    try {
      await git.findRoot({
        fs: this.gitFS,
        filepath: repositoryPath,
      });
      return true;
    } catch {
      return false;
    }
  }

  private async getCurrentBranch(repositoryPath: string): Promise<string> {
    try {
      return (
        (await git.currentBranch({
          fs: this.gitFS,
          dir: repositoryPath,
        })) || 'main'
      );
    } catch {
      return 'main';
    }
  }

  private async listRemotes(repositoryPath: string): Promise<Remote[]> {
    try {
      const remotes = await git.listRemotes({
        fs: this.gitFS,
        dir: repositoryPath,
      });

      return remotes.map(remote => ({
        name: remote.remote,
        url: remote.url,
        type: 'fetch' as const,
      }));
    } catch {
      return [];
    }
  }

  private async getLastCommit(
    repositoryPath: string
  ): Promise<CommitInfo | undefined> {
    try {
      const commits = await git.log({
        fs: this.gitFS,
        dir: repositoryPath,
        depth: 1,
      });

      if (commits.length === 0) {
        return undefined;
      }

      return this.mapCommitInfo(commits[0]);
    } catch {
      return undefined;
    }
  }

  private async getCommitInfoInternal(
    repositoryPath: string,
    commitHash: string
  ): Promise<CommitInfo> {
    const commit = await git.readCommit({
      fs: this.gitFS,
      dir: repositoryPath,
      oid: commitHash,
    });

    return this.mapCommitInfo(commit);
  }

  private mapCommitInfo(commit: unknown): CommitInfo {
    const commitData = commit as {
      oid: string;
      commit: {
        message: string;
        author: { name: string; email: string; timestamp: number };
        committer: { name: string; email: string; timestamp: number };
        parent?: string[];
      };
    };

    return {
      hash: commitData.oid,
      shortHash: commitData.oid.substring(0, 7),
      message: commitData.commit.message,
      author: {
        name: commitData.commit.author.name,
        email: commitData.commit.author.email,
        date: new Date(commitData.commit.author.timestamp * 1000),
      },
      committer: {
        name: commitData.commit.committer.name,
        email: commitData.commit.committer.email,
        date: new Date(commitData.commit.committer.timestamp * 1000),
      },
      date: new Date(commitData.commit.author.timestamp * 1000),
      parents: commitData.commit.parent || [],
    };
  }

  private mapFileStatus(
    headStatus: number,
    workdirStatus: number,
    stageStatus: number
  ): FileStatus {
    if (headStatus === 0 && workdirStatus === 2 && stageStatus === 0) {
      return 'untracked';
    }
    if (headStatus === 1 && workdirStatus === 0 && stageStatus === 0) {
      return 'deleted';
    }
    if (headStatus === 1 && workdirStatus === 2 && stageStatus === 1) {
      return 'modified';
    }
    if (headStatus === 0 && workdirStatus === 2 && stageStatus === 2) {
      return 'added';
    }
    return 'modified';
  }

  private formatAuth(
    auth: GitAuth
  ): { username: string; password: string } | undefined {
    if (auth.token) {
      return {
        username: auth.token,
        password: 'x-oauth-basic',
      };
    }
    if (auth.username && auth.password) {
      return {
        username: auth.username,
        password: auth.password,
      };
    }
    return undefined;
  }

  private getBaseName(repositoryPath: string): string {
    return (
      repositoryPath.split('/').pop() ||
      repositoryPath.split('\\').pop() ||
      'repository'
    );
  }

  private generateRepositoryId(repositoryPath: string): string {
    // Simple hash-like encoding for repository path (cross-platform)
    let hash = 0;
    for (let i = 0; i < repositoryPath.length; i++) {
      const char = repositoryPath.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).padStart(8, '0').substring(0, 16);
  }

  private handleError(error: unknown, defaultCode: GitErrorCode): GitError {
    if (error instanceof GitError) {
      return error;
    }

    const errorObj = error as Error | { message?: string };
    const message = errorObj?.message || 'Unknown git error';
    return new GitError(message, defaultCode, error);
  }

  /**
   * Check for potential conflicts before merge
   */
  private async checkForConflicts(
    repositoryPath: string,
    baseBranch: string,
    targetBranch: string
  ): Promise<string[]> {
    try {
      // Get files changed in both branches
      const baseStatus = await git.statusMatrix({
        fs: this.gitFS,
        dir: repositoryPath,
        ref: baseBranch,
      });

      const targetStatus = await git.statusMatrix({
        fs: this.gitFS,
        dir: repositoryPath,
        ref: targetBranch,
      });

      const conflicts: string[] = [];

      // Compare status matrices to detect conflicts
      baseStatus.forEach(([filepath, , baseWorktree]) => {
        const targetEntry = targetStatus.find(([path]) => path === filepath);
        if (targetEntry) {
          const [, , targetWorktree] = targetEntry;
          if (baseWorktree !== targetWorktree) {
            conflicts.push(filepath);
          }
        }
      });

      return conflicts;
    } catch (error) {
      throw this.handleError(error, GitErrorCode.UNKNOWN_ERROR);
    }
  }
}

// Type guard for merge errors
function isMergeError(e: unknown): e is { message: string; code: GitErrorCode } {
  return (
    typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    typeof (e as any).code === 'string' &&
    ((e as any).code === GitErrorCode.MERGE_CONFLICT ||
     (e as any).code === GitErrorCode.MERGE_FAILED)
  );
}
