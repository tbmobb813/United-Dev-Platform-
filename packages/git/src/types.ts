/**
 * Git Integration Types and Interfaces
 * Provides comprehensive TypeScript definitions for git operations
 */

// Repository Information
export interface Repository {
  id: string;
  name: string;
  path: string;
  remoteUrl?: string;
  defaultBranch: string;
  currentBranch: string;
  isClean: boolean;
  lastCommit?: CommitInfo;
  remotes: Remote[];
  metadata?: RepositoryMetadata;
}

export interface RepositoryMetadata {
  description?: string;
  homepage?: string;
  language?: string;
  topics?: string[];
  isPrivate?: boolean;
  fork?: boolean;
  archived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  size?: number;
  stargazersCount?: number;
  forksCount?: number;
}

// Remote Configuration
export interface Remote {
  name: string;
  url: string;
  type: 'fetch' | 'push';
}

// Branch Information
export interface Branch {
  name: string;
  type: 'local' | 'remote';
  current: boolean;
  upstream?: string;
  ahead: number;
  behind: number;
  lastCommit?: CommitInfo;
}

// Commit Information
export interface CommitInfo {
  hash: string;
  shortHash: string;
  message: string;
  author: Author;
  committer: Author;
  date: Date;
  parents: string[];
  stats?: CommitStats;
}

export interface Author {
  name: string;
  email: string;
  date?: Date;
}

export interface CommitStats {
  additions: number;
  deletions: number;
  total: number;
  files: FileStats[];
}

export interface FileStats {
  path: string;
  additions: number;
  deletions: number;
  status: FileStatus;
}

// File Status and Changes
export type FileStatus =
  | 'untracked'
  | 'added'
  | 'modified'
  | 'deleted'
  | 'renamed'
  | 'copied'
  | 'typechange'
  | 'unmerged'
  | 'ignored';

export interface FileChange {
  path: string;
  status: FileStatus;
  oldPath?: string; // for renames
  staged: boolean;
  unstaged: boolean;
}

export interface RepositoryStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: FileChange[];
  unstaged: FileChange[];
  untracked: string[];
  conflicted: string[];
  clean: boolean;
}

// Git Operations
export interface GitCloneOptions {
  url: string;
  directory: string;
  branch?: string;
  depth?: number;
  recursive?: boolean;
  auth?: GitAuth;
  onProgress?: (progress: CloneProgress) => void;
}

export interface CloneProgress {
  phase:
    | 'initializing'
    | 'counting'
    | 'compressing'
    | 'receiving'
    | 'resolving'
    | 'done';
  loaded: number;
  total: number;
  percentage: number;
  message?: string;
}

export interface GitAuth {
  username?: string;
  password?: string;
  token?: string;
  sshKey?: {
    privateKey: string;
    publicKey?: string;
    passphrase?: string;
  };
}

export interface CommitOptions {
  message: string;
  author?: Author;
  committer?: Author;
  date?: Date;
  amend?: boolean;
  allowEmpty?: boolean;
  parents?: string[];
}

export interface PushOptions {
  remote?: string;
  branch?: string;
  force?: boolean;
  setUpstream?: boolean;
  auth?: GitAuth;
  onProgress?: (progress: TransferProgress) => void;
}

export interface PullOptions {
  remote?: string;
  branch?: string;
  rebase?: boolean;
  auth?: GitAuth;
  onProgress?: (progress: TransferProgress) => void;
}

export interface TransferProgress {
  phase: 'counting' | 'compressing' | 'writing' | 'done';
  objects: {
    indexed: number;
    received: number;
    total: number;
  };
  bytes: {
    received: number;
    total: number;
  };
  percentage: number;
}

// Merge and Conflict Resolution
export interface MergeResult {
  success: boolean;
  conflicts: ConflictInfo[];
  message?: string;
  commit?: string;
}

export interface ConflictInfo {
  path: string;
  reason: ConflictReason;
  ours?: string;
  theirs?: string;
  base?: string;
  resolved?: boolean;
}

export type ConflictReason =
  | 'content'
  | 'add-add'
  | 'modify-delete'
  | 'delete-modify'
  | 'rename-rename'
  | 'rename-add'
  | 'mode-change';

export interface MergeOptions {
  branch: string;
  message?: string;
  strategy?: MergeStrategy;
  noCommit?: boolean;
  squash?: boolean;
  fastForwardOnly?: boolean;
}

export type MergeStrategy =
  | 'recursive'
  | 'resolve'
  | 'octopus'
  | 'ours'
  | 'subtree';

// Git History and Log
export interface LogOptions {
  maxCount?: number;
  skip?: number;
  since?: Date;
  until?: Date;
  author?: string;
  grep?: string;
  path?: string;
  branch?: string;
  format?: 'full' | 'summary' | 'oneline';
}

export interface DiffOptions {
  base?: string;
  head?: string;
  paths?: string[];
  cached?: boolean;
  unified?: number;
  ignoreWhitespace?: boolean;
}

export interface DiffResult {
  files: FileDiff[];
  stats: DiffStats;
}

export interface FileDiff {
  path: string;
  oldPath?: string;
  status: FileStatus;
  hunks: DiffHunk[];
  isBinary?: boolean;
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  header: string;
  lines: DiffLine[];
}

export interface DiffLine {
  type: 'add' | 'delete' | 'context';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffStats {
  files: number;
  additions: number;
  deletions: number;
  changes: number;
}

// Stash Operations
export interface StashEntry {
  index: number;
  message: string;
  hash: string;
  author: Author;
  date: Date;
  branch: string;
}

export interface StashOptions {
  message?: string;
  keepIndex?: boolean;
  includeUntracked?: boolean;
  all?: boolean;
}

// Tags
export interface Tag {
  name: string;
  hash: string;
  type: 'lightweight' | 'annotated';
  message?: string;
  author?: Author;
  date?: Date;
  commit: CommitInfo;
}

export interface TagOptions {
  message?: string;
  annotated?: boolean;
  force?: boolean;
  sign?: boolean;
}

// Remote Repository Providers
export interface RemoteProvider {
  name: string;
  type: 'github' | 'gitlab' | 'bitbucket' | 'azure-devops' | 'custom';
  baseUrl: string;
  auth?: RemoteProviderAuth;
}

export interface RemoteProviderAuth {
  type: 'token' | 'oauth' | 'basic' | 'ssh';
  credentials: {
    token?: string;
    username?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
    sshKey?: string;
  };
}

// Git Configuration
export interface GitConfig {
  user?: {
    name?: string;
    email?: string;
  };
  core?: {
    editor?: string;
    autocrlf?: boolean | 'input';
    safecrlf?: boolean;
    symlinks?: boolean;
    ignorecase?: boolean;
  };
  remote?: Record<string, Remote>;
  branch?: Record<string, BranchConfig>;
  alias?: Record<string, string>;
  custom?: Record<string, unknown>;
}

export interface BranchConfig {
  remote?: string;
  merge?: string;
  rebase?: boolean;
  pushRemote?: string;
}

// Error Handling
export class GitError extends Error {
  constructor(
    message: string,
    public code: GitErrorCode,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'GitError';

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, GitError.prototype);
  }
}

export enum GitErrorCode {
  REPOSITORY_NOT_FOUND = 'REPOSITORY_NOT_FOUND',
  NOT_A_REPOSITORY = 'NOT_A_REPOSITORY',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  MERGE_CONFLICT = 'MERGE_CONFLICT',
  BRANCH_NOT_FOUND = 'BRANCH_NOT_FOUND',
  COMMIT_NOT_FOUND = 'COMMIT_NOT_FOUND',
  WORKING_DIRECTORY_DIRTY = 'WORKING_DIRECTORY_DIRTY',
  INVALID_REFERENCE = 'INVALID_REFERENCE',
  OPERATION_CANCELLED = 'OPERATION_CANCELLED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Event System
export type GitEventType =
  | 'repository:opened'
  | 'repository:closed'
  | 'branch:switched'
  | 'commit:created'
  | 'status:changed'
  | 'push:started'
  | 'push:completed'
  | 'pull:started'
  | 'pull:completed'
  | 'fetch:started'
  | 'fetch:completed'
  | 'merge:started'
  | 'merge:completed'
  | 'conflict:detected'
  | 'conflict:resolved';

export interface GitEvent<T = unknown> {
  type: GitEventType;
  repositoryPath: string;
  timestamp: Date;
  data: T;
}

export type GitEventListener<T = unknown> = (event: GitEvent<T>) => void;

// Service Interfaces
export interface GitServiceInterface {
  // Repository Operations
  initRepository(path: string, bare?: boolean): Promise<Repository>;
  openRepository(path: string): Promise<Repository>;
  cloneRepository(options: GitCloneOptions): Promise<Repository>;
  getRepositoryStatus(path: string): Promise<RepositoryStatus>;

  // Branch Operations
  listBranches(path: string, includeRemotes?: boolean): Promise<Branch[]>;
  createBranch(path: string, name: string, from?: string): Promise<void>;
  switchBranch(path: string, name: string): Promise<void>;
  deleteBranch(path: string, name: string, force?: boolean): Promise<void>;
  mergeBranch(path: string, options: MergeOptions): Promise<MergeResult>;

  // Commit Operations
  stageFiles(path: string, files: string[]): Promise<void>;
  unstageFiles(path: string, files: string[]): Promise<void>;
  commit(path: string, options: CommitOptions): Promise<CommitInfo>;
  getCommitHistory(path: string, options?: LogOptions): Promise<CommitInfo[]>;
  getCommitDiff(path: string, options: DiffOptions): Promise<DiffResult>;

  // Remote Operations
  addRemote(path: string, name: string, url: string): Promise<void>;
  removeRemote(path: string, name: string): Promise<void>;
  push(path: string, options?: PushOptions): Promise<void>;
  pull(path: string, options?: PullOptions): Promise<void>;
  fetch(
    path: string,
    remote?: string,
    options?: { auth?: GitAuth }
  ): Promise<void>;

  // Configuration
  getConfig(path: string, global?: boolean): Promise<GitConfig>;
  setConfig(
    path: string,
    key: string,
    value: string,
    global?: boolean
  ): Promise<void>;

  // Events
  on<T>(event: GitEventType, listener: GitEventListener<T>): void;
  off<T>(event: GitEventType, listener: GitEventListener<T>): void;
  emit<T>(event: GitEvent<T>): void;
}
