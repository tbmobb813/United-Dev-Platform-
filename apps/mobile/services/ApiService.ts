import {
  ApiResponse,
  CreateFileRequest,
  GetFilesQuery,
  MobileFileNode,
  MobileRepository,
  PaginatedResponse,
  Project,
  ProjectFile,
  UpdateFileRequest,
} from './types';

// Configuration for API base URL
const getBaseUrl = (): string => {
  // In development, use local web app URL
  return 'http://localhost:3000';
};

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  } = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${getBaseUrl()}/api${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error:
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    // Log error for development
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Network request failed' };
  }
}

export class ApiService {
  // Project operations
  static async getProjects(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      userId?: string;
      visibility?: 'PUBLIC' | 'PRIVATE';
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<Project>>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest<PaginatedResponse<Project>>(
      `/projects?${queryParams.toString()}`
    );
  }

  static async getProject(projectId: string): Promise<ApiResponse<Project>> {
    return apiRequest<Project>(`/projects/${projectId}`);
  }

  static async createProject(data: {
    name: string;
    description?: string;
    visibility?: 'PUBLIC' | 'PRIVATE';
    repositoryUrl?: string;
  }): Promise<ApiResponse<Project>> {
    return apiRequest<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // File operations
  static async getProjectFiles(
    projectId: string,
    query: GetFilesQuery = {}
  ): Promise<ApiResponse<{ files: ProjectFile[] }>> {
    const queryParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest<{ files: ProjectFile[] }>(
      `/projects/${projectId}/files?${queryParams.toString()}`
    );
  }

  static async getFile(
    projectId: string,
    fileId: string
  ): Promise<ApiResponse<{ file: ProjectFile }>> {
    return apiRequest<{ file: ProjectFile }>(
      `/projects/${projectId}/files/${fileId}`
    );
  }

  static async createFile(
    projectId: string,
    data: CreateFileRequest
  ): Promise<ApiResponse<{ file: ProjectFile }>> {
    return apiRequest<{ file: ProjectFile }>(`/projects/${projectId}/files`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateFile(
    projectId: string,
    fileId: string,
    data: UpdateFileRequest
  ): Promise<ApiResponse<{ file: ProjectFile }>> {
    return apiRequest<{ file: ProjectFile }>(
      `/projects/${projectId}/files/${fileId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async deleteFile(
    projectId: string,
    fileId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(
      `/projects/${projectId}/files/${fileId}`,
      {
        method: 'DELETE',
      }
    );
  }

  // AI operations
  static async aiChat(data: {
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
    system?: string;
    sessionId?: string;
    userId?: string;
  }): Promise<Response> {
    // Return raw response for streaming
    const url = `${getBaseUrl()}/api/ai`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  // Helper methods for mobile-specific operations
  static async getMobileRepository(
    projectId: string
  ): Promise<ApiResponse<MobileRepository>> {
    const projectResponse = await this.getProject(projectId);

    if (projectResponse.error || !projectResponse.data) {
      return { error: projectResponse.error || 'Project not found' };
    }

    const project = projectResponse.data;

    // Convert project to mobile repository format
    const repository: MobileRepository = {
      id: project.id,
      name: project.name,
      owner: project.owner.username,
      defaultBranch: 'main', // Default branch - could be enhanced
      description: project.description,
      visibility: project.visibility,
      repositoryUrl: project.repositoryUrl,
      fileCount: project._count?.files,
      memberCount: project._count?.members,
    };

    return { data: repository };
  }

  static async getMobileFileTree(
    projectId: string,
    path?: string
  ): Promise<ApiResponse<MobileFileNode[]>> {
    const filesResponse = await this.getProjectFiles(projectId, {
      path,
      includeContent: false,
    });

    if (filesResponse.error || !filesResponse.data) {
      return { error: filesResponse.error || 'Failed to fetch files' };
    }

    // Convert ProjectFile[] to MobileFileNode[]
    const mobileFiles: MobileFileNode[] = filesResponse.data.files.map(file => {
      const fileExtension = file.name.includes('.')
        ? file.name.split('.').pop()?.toLowerCase()
        : undefined;

      return {
        id: file.id,
        name: file.name,
        path: file.path,
        type: file.type === 'DIRECTORY' ? 'directory' : 'file',
        size: file.size,
        extension: fileExtension,
        mimeType: file.mimeType,
        content: file.content,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
        language: getLanguageFromExtension(fileExtension),
        children: file.type === 'DIRECTORY' ? [] : undefined,
        isExpanded: false,
      };
    });

    return { data: mobileFiles };
  }

  static async getMobileFileContent(
    projectId: string,
    fileId: string
  ): Promise<ApiResponse<string>> {
    const fileResponse = await this.getFile(projectId, fileId);

    if (fileResponse.error || !fileResponse.data) {
      return { error: fileResponse.error || 'File not found' };
    }

    return { data: fileResponse.data.file.content || '' };
  }

  static async saveMobileFileContent(
    projectId: string,
    fileId: string,
    content: string,
    userId?: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    const updateResponse = await this.updateFile(projectId, fileId, {
      content,
      userId,
    });

    if (updateResponse.error) {
      return { error: updateResponse.error };
    }

    return { data: { success: true } };
  }
}

// Helper function to determine language from file extension
function getLanguageFromExtension(extension?: string): string | undefined {
  if (!extension) {
    return undefined;
  }

  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    css: 'css',
    html: 'html',
    json: 'json',
    md: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    dart: 'dart',
  };

  return languageMap[extension];
}

export default ApiService;
