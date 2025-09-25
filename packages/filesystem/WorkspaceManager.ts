import {
  FileTreeNode,
  ProjectManager,
  ProjectStructureAnalysis,
  WorkspaceConfig,
} from './ProjectManager';
import { FileSystemProvider } from './types';

export interface WorkspaceSession {
  id: string;
  name: string;
  rootPath: string;
  config: WorkspaceConfig | null;
  openFiles: string[];
  activeFile: string | null;
  lastAccessed: Date;
  bookmarks: WorkspaceBookmark[];
  recentFiles: string[];
  gitInfo?: GitInfo;
}

export interface WorkspaceBookmark {
  id: string;
  name: string;
  path: string;
  description?: string;
  color?: string;
  createdAt: Date;
}

export interface GitInfo {
  isGitRepository: boolean;
  currentBranch?: string;
  hasUncommittedChanges?: boolean;
  remoteUrl?: string;
  lastCommit?: {
    hash: string;
    message: string;
    author: string;
    date: Date;
  };
}

export interface WorkspaceSearchOptions {
  query: string;
  fileExtensions?: string[];
  excludePaths?: string[];
  caseSensitive?: boolean;
  useRegex?: boolean;
  includeContent?: boolean;
}

export interface SearchResult {
  path: string;
  filename: string;
  matches: SearchMatch[];
  lastModified: Date;
}

export interface SearchMatch {
  line: number;
  column: number;
  text: string;
  context: string;
}

/**
 * Workspace management system for handling multiple projects and development sessions
 */
export class WorkspaceManager {
  private fileSystem: FileSystemProvider;
  private projectManager: ProjectManager;
  private activeSessions: Map<string, WorkspaceSession> = new Map();
  private sessionStoragePath: string;

  constructor(
    fileSystem: FileSystemProvider,
    sessionStoragePath: string = '/.udp-sessions'
  ) {
    this.fileSystem = fileSystem;
    this.projectManager = new ProjectManager(fileSystem);
    this.sessionStoragePath = sessionStoragePath;
    this.initializeSessionStorage();
  }

  private async initializeSessionStorage(): Promise<void> {
    try {
      if (!(await this.fileSystem.exists(this.sessionStoragePath))) {
        await this.fileSystem.createDirectory(this.sessionStoragePath, true);
      }

      // Load existing sessions
      await this.loadSessions();
    } catch {
      // Failed to initialize session storage
    }
  }

  public async createWorkspace(
    name: string,
    rootPath: string,
    templateId?: string,
    variables?: Record<string, string>
  ): Promise<WorkspaceSession> {
    const sessionId = this.generateSessionId();

    // Ensure workspace directory exists
    await this.fileSystem.createDirectory(rootPath, true);

    // Create project from template if specified
    if (templateId) {
      await this.projectManager.createProject(templateId, rootPath, variables);
    }

    // Analyze project structure
    const analysis = await this.projectManager.analyzeProject(rootPath);

    // Create workspace config
    const config: WorkspaceConfig = {
      name,
      version: '1.0.0',
      description: variables?.projectDescription,
      type: this.detectProjectType(analysis),
      framework: analysis.frameworks[0] || 'other',
      language: this.detectPrimaryLanguage(analysis.languages),
      rootPath,
      srcPath: this.detectSourcePath(analysis.structure),
      buildPath: this.detectBuildPath(analysis.structure),
      testPath: this.detectTestPath(analysis.structure),
      configFiles: this.findConfigFiles(analysis.structure),
      ignorePatterns: [
        'node_modules',
        'dist',
        'build',
        '.git',
        '.next',
        '.nuxt',
      ],
      dependencies: analysis.dependencies,
      scripts: {},
      metadata: {
        createdAt: new Date().toISOString(),
        templateId,
        analysis,
      },
    };

    await this.projectManager.createWorkspaceConfig(rootPath, config);

    // Create workspace session
    const session: WorkspaceSession = {
      id: sessionId,
      name,
      rootPath,
      config,
      openFiles: [],
      activeFile: null,
      lastAccessed: new Date(),
      bookmarks: [],
      recentFiles: [],
      gitInfo: await this.detectGitInfo(rootPath),
    };

    this.activeSessions.set(sessionId, session);
    await this.saveSession(session);

    return session;
  }

  public async openWorkspace(rootPath: string): Promise<WorkspaceSession> {
    // Check if workspace already exists in active sessions
    const existingSession = Array.from(this.activeSessions.values()).find(
      session => session.rootPath === rootPath
    );

    if (existingSession) {
      existingSession.lastAccessed = new Date();
      await this.saveSession(existingSession);
      return existingSession;
    }

    // Load workspace config
    const config = await this.projectManager.loadWorkspaceConfig(rootPath);

    if (!config) {
      throw new Error(`No workspace configuration found at ${rootPath}`);
    }

    const sessionId = this.generateSessionId();
    const session: WorkspaceSession = {
      id: sessionId,
      name: config.name,
      rootPath,
      config,
      openFiles: [],
      activeFile: null,
      lastAccessed: new Date(),
      bookmarks: [],
      recentFiles: [],
      gitInfo: await this.detectGitInfo(rootPath),
    };

    // Try to restore session data
    const savedSession = await this.loadSessionData(rootPath);
    if (savedSession) {
      session.openFiles = savedSession.openFiles || [];
      session.activeFile = savedSession.activeFile || null;
      session.bookmarks = savedSession.bookmarks || [];
      session.recentFiles = savedSession.recentFiles || [];
    }

    this.activeSessions.set(sessionId, session);
    await this.saveSession(session);

    return session;
  }

  public async closeWorkspace(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      await this.saveSession(session);
      this.activeSessions.delete(sessionId);
    }
  }

  public getActiveWorkspaces(): WorkspaceSession[] {
    return Array.from(this.activeSessions.values());
  }

  public getWorkspace(sessionId: string): WorkspaceSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  public async updateWorkspaceSession(
    sessionId: string,
    updates: Partial<WorkspaceSession>
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Workspace session not found: ${sessionId}`);
    }

    Object.assign(session, updates);
    session.lastAccessed = new Date();
    await this.saveSession(session);
  }

  public async addBookmark(
    sessionId: string,
    bookmark: Omit<WorkspaceBookmark, 'id' | 'createdAt'>
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Workspace session not found: ${sessionId}`);
    }

    const newBookmark: WorkspaceBookmark = {
      ...bookmark,
      id: this.generateBookmarkId(),
      createdAt: new Date(),
    };

    session.bookmarks.push(newBookmark);
    await this.saveSession(session);
  }

  public async removeBookmark(
    sessionId: string,
    bookmarkId: string
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Workspace session not found: ${sessionId}`);
    }

    session.bookmarks = session.bookmarks.filter(b => b.id !== bookmarkId);
    await this.saveSession(session);
  }

  public async openFile(sessionId: string, filePath: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Workspace session not found: ${sessionId}`);
    }

    // Add to open files if not already open
    if (!session.openFiles.includes(filePath)) {
      session.openFiles.push(filePath);
    }

    // Set as active file
    session.activeFile = filePath;

    // Add to recent files
    session.recentFiles = [
      filePath,
      ...session.recentFiles.filter(f => f !== filePath),
    ].slice(0, 20); // Keep only last 20 files

    await this.saveSession(session);
  }

  public async closeFile(sessionId: string, filePath: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Workspace session not found: ${sessionId}`);
    }

    session.openFiles = session.openFiles.filter(f => f !== filePath);

    if (session.activeFile === filePath) {
      session.activeFile =
        session.openFiles.length > 0
          ? session.openFiles[session.openFiles.length - 1] || null
          : null;
    }

    await this.saveSession(session);
  }

  public async searchWorkspace(
    sessionId: string,
    options: WorkspaceSearchOptions
  ): Promise<SearchResult[]> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Workspace session not found: ${sessionId}`);
    }

    const results: SearchResult[] = [];
    const listing = await this.fileSystem.listDirectory(session.rootPath, {
      recursive: true,
      includeHidden: false,
    });

    for (const entry of listing.entries) {
      if (entry.type !== 'file') {
        continue;
      }

      // Filter by extension
      if (options.fileExtensions && options.fileExtensions.length > 0) {
        const ext = this.fileSystem.extname(entry.path);
        if (!options.fileExtensions.includes(ext)) {
          continue;
        }
      }

      // Filter by exclude paths
      if (
        options.excludePaths &&
        options.excludePaths.some(pattern => entry.path.includes(pattern))
      ) {
        continue;
      }

      // Check filename match
      const filename = this.fileSystem.basename(entry.path);
      const flags = options.caseSensitive ? 'g' : 'gi';
      const searchRegex = options.useRegex
        ? new RegExp(options.query, flags)
        : new RegExp(this.escapeRegex(options.query), flags);

      const filenameMatches = filename.match(searchRegex);

      // If searching content or filename matches, read the file
      const matches: SearchMatch[] = [];

      if (filenameMatches || options.includeContent) {
        try {
          const content = (await this.fileSystem.readFile(
            entry.path
          )) as string;

          if (options.includeContent) {
            const lines = content.split('\n');

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (!line) {
                continue;
              }

              const lineMatches = line.match(searchRegex);

              if (lineMatches) {
                for (const match of lineMatches) {
                  const column = line.indexOf(match);
                  matches.push({
                    line: i + 1,
                    column: column + 1,
                    text: match,
                    context: line.trim(),
                  });
                }
              }
            }
          }
        } catch {
          // Skip files that can't be read as text
          continue;
        }
      }

      // Add filename matches
      if (filenameMatches) {
        for (const match of filenameMatches) {
          matches.push({
            line: 0,
            column: filename.indexOf(match) + 1,
            text: match,
            context: filename,
          });
        }
      }

      if (matches.length > 0) {
        results.push({
          path: entry.path,
          filename,
          matches,
          lastModified: entry.lastModified,
        });
      }
    }

    return results;
  }

  public async getFileTree(
    sessionId: string,
    path?: string
  ): Promise<FileTreeNode[]> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Workspace session not found: ${sessionId}`);
    }

    const targetPath = path || session.rootPath;
    const analysis = await this.projectManager.analyzeProject(targetPath);
    return analysis.structure;
  }

  private async detectGitInfo(
    projectPath: string
  ): Promise<GitInfo | undefined> {
    try {
      const gitPath = this.fileSystem.join(projectPath, '.git');
      const isGitRepo = await this.fileSystem.exists(gitPath);

      if (!isGitRepo) {
        return undefined;
      }

      // Basic git info detection
      return {
        isGitRepository: true,
        // Note: For full git integration, we'd need to use a git library
        // This is a placeholder for basic detection
      };
    } catch {
      return undefined;
    }
  }

  private detectProjectType(
    analysis: ProjectStructureAnalysis
  ): WorkspaceConfig['type'] {
    if (
      analysis.frameworks.some(
        f => f.includes('React Native') || f.includes('Flutter')
      )
    ) {
      return 'mobile';
    }

    if (analysis.frameworks.some(f => f.includes('Electron'))) {
      return 'desktop';
    }

    if (
      analysis.frameworks.some(
        f => f.includes('Next.js') || f.includes('Nuxt.js')
      )
    ) {
      return 'fullstack';
    }

    return 'web';
  }

  private detectPrimaryLanguage(
    languages: Record<string, number>
  ): WorkspaceConfig['language'] {
    const sorted = Object.entries(languages).sort(([, a], [, b]) => b - a);
    const primary = sorted[0]?.[0];

    if (primary === 'typescript') {
      return 'typescript';
    }
    if (primary === 'javascript') {
      return 'javascript';
    }
    if (primary === 'python') {
      return 'python';
    }
    if (primary === 'java') {
      return 'java';
    }

    return 'other';
  }

  private detectSourcePath(structure: FileTreeNode[]): string {
    const commonSrcPaths = ['src', 'source', 'lib', 'app'];

    for (const path of commonSrcPaths) {
      if (
        structure.some(node => node.name === path && node.type === 'directory')
      ) {
        return `/${path}`;
      }
    }

    return '/';
  }

  private detectBuildPath(structure: FileTreeNode[]): string {
    const commonBuildPaths = ['dist', 'build', 'out', '.next', '.nuxt'];

    for (const path of commonBuildPaths) {
      if (
        structure.some(node => node.name === path && node.type === 'directory')
      ) {
        return `/${path}`;
      }
    }

    return '/dist';
  }

  private detectTestPath(structure: FileTreeNode[]): string {
    const commonTestPaths = ['test', 'tests', '__tests__', 'spec'];

    for (const path of commonTestPaths) {
      if (
        structure.some(node => node.name === path && node.type === 'directory')
      ) {
        return `/${path}`;
      }
    }

    return '/tests';
  }

  private findConfigFiles(structure: FileTreeNode[]): string[] {
    const configFiles: string[] = [];

    const findConfigs = (nodes: FileTreeNode[]): void => {
      for (const node of nodes) {
        if (node.type === 'file' && node.isConfigFile) {
          configFiles.push(node.path);
        }
        if (node.children) {
          findConfigs(node.children);
        }
      }
    };

    findConfigs(structure);
    return configFiles;
  }

  private async saveSession(session: WorkspaceSession): Promise<void> {
    try {
      const sessionFile = this.fileSystem.join(
        this.sessionStoragePath,
        `${session.id}.json`
      );
      const content = JSON.stringify(session, null, 2);
      await this.fileSystem.writeFile(sessionFile, content, {
        createDirectories: true,
      });
    } catch {
      // Failed to save session
    }
  }

  private async loadSessions(): Promise<void> {
    try {
      const listing = await this.fileSystem.listDirectory(
        this.sessionStoragePath
      );

      for (const entry of listing.entries) {
        if (entry.type === 'file' && entry.name.endsWith('.json')) {
          try {
            const content = (await this.fileSystem.readFile(
              entry.path
            )) as string;
            const session = JSON.parse(content) as WorkspaceSession;
            this.activeSessions.set(session.id, session);
          } catch {
            // Skip invalid session files
          }
        }
      }
    } catch {
      // Session storage doesn't exist yet
    }
  }

  private async loadSessionData(
    rootPath: string
  ): Promise<Partial<WorkspaceSession> | null> {
    try {
      // Find session by root path
      const sessions = Array.from(this.activeSessions.values());
      return sessions.find(s => s.rootPath === rootPath) || null;
    } catch {
      return null;
    }
  }

  private generateSessionId(): string {
    return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateBookmarkId(): string {
    return `bm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
