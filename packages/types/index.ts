export type FileNode = {
  path: string;
  kind:
    | 'page'
    | 'component'
    | 'hook'
    | 'util'
    | 'screen'
    | 'style'
    | 'test'
    | 'unknown';
  platform?: 'web' | 'native' | 'shared';
  imports: string[];
  exports: string[];
  size: number;
};

export type CrossPlatformLink = {
  shared: string[];
  platformPairs: { web?: string; native?: string }[];
  gaps: { missingOn: 'web' | 'native'; counterpart: string }[];
};

export type ProjectGraph = {
  files: Record<string, FileNode>;
  crossPlatform: CrossPlatformLink;
  lastIndexedAt: string;
};

// Export filesystem types
export * from './ai';
export * from './filesystem';
export * from './project';
