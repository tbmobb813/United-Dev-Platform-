// TypeScript types for mobile API integration
export interface Project {
  id: string;
  name: string;
  description?: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  repositoryUrl?: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  members?: {
    role: string;
    user: {
      id: string;
      username: string;
      name?: string;
      avatar?: string;
    };
  }[];
  _count?: {
    files: number;
    members: number;
  };
}

export interface ProjectFile {
  id: string;
  path: string;
  name: string;
  type: 'FILE' | 'DIRECTORY';
  content?: string;
  size: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
  activities?: FileActivity[];
}

export interface FileActivity {
  id: string;
  action: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Request types
export interface CreateFileRequest {
  path: string;
  name: string;
  type?: 'FILE' | 'DIRECTORY';
  content?: string;
  mimeType?: string;
}

export interface UpdateFileRequest {
  path?: string;
  name?: string;
  content?: string;
  userId?: string;
}

export interface GetFilesQuery {
  path?: string;
  type?: 'FILE' | 'DIRECTORY';
  includeContent?: boolean;
}

export interface AIRequest {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  system?: string;
  sessionId?: string;
  userId?: string;
}

// Convert ProjectFile to mobile FileNode format
export interface MobileFileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  language?: string;
  extension?: string;
  children?: MobileFileNode[];
  isExpanded?: boolean;
  // Backend-specific fields
  id?: string;
  mimeType?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Repository info for mobile
export interface MobileRepository {
  id: string;
  name: string;
  owner: string;
  defaultBranch: string;
  description?: string;
  language?: string;
  // Additional project info
  visibility?: 'PUBLIC' | 'PRIVATE';
  repositoryUrl?: string;
  fileCount?: number;
  memberCount?: number;
}
