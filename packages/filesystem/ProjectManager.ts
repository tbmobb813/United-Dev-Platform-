import { FileSystemEntry, FileSystemProvider } from './types';

// Shared types used by ProjectManager and other filesystem modules
export interface ProjectDependency {
  name: string;
  version: string;
  type: 'dependency' | 'devDependency' | 'peerDependency' | 'optionalDependency' | string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified?: Date;
  language?: string;
  isConfigFile?: boolean;
  isTestFile?: boolean;
  children?: FileTreeNode[];
}

export interface ProjectStructureAnalysis {
  totalFiles: number;
  totalDirectories: number;
  languages: Record<string, number>;
  frameworks: string[];
  hasTests: boolean;
  hasDocumentation: boolean;
  hasConfig: boolean;
  dependencies: ProjectDependency[];
  structure: FileTreeNode[];
}

export interface WorkspaceConfig {
  name: string;
  version: string;
  description?: string;
  type: string;
  framework?: string;
  language?: string;
  rootPath: string;
  srcPath?: string;
  buildPath?: string;
  testPath?: string;
  configFiles?: string[];
  ignorePatterns?: string[];
  dependencies?: ProjectDependency[];
  scripts?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: 'web' | 'mobile' | 'desktop' | 'fullstack';
  framework: string;
  language: 'typescript' | 'javascript' | 'python' | 'java' | 'other';
  files: ProjectFile[];
  dependencies?: ProjectDependency[];
  scripts?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface ProjectFile {
  path: string;
  content: string;
  encoding?: 'utf8' | 'base64' | 'binary';
  template?: boolean; // Whether this is a template file with placeholders
  language?: string;
  isGenerated?: boolean;
  isConfigFile?: boolean;
  isTestFile?: boolean;
}

/**
 * Project management system for creating, analyzing, and managing project structures
 */
export class ProjectManager {
  private fileSystem: FileSystemProvider;
  private templates: Map<string, ProjectTemplate> = new Map();

  constructor(fileSystem: FileSystemProvider) {
    this.fileSystem = fileSystem;
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // React TypeScript Template
    this.addTemplate({
      id: 'react-typescript',
      name: 'React TypeScript App',
      description:
        'Modern React application with TypeScript, Vite, and modern tooling',
      type: 'web',
      framework: 'react',
      language: 'typescript',
      files: [
        {
          path: 'package.json',
          content: JSON.stringify(
            {
              name: '{{projectName}}',
              version: '0.1.0',
              type: 'module',
              scripts: {
                dev: 'vite',
                build: 'tsc && vite build',
                preview: 'vite preview',
                test: 'vitest',
                lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
              },
              dependencies: {
                react: '^18.2.0',
                'react-dom': '^18.2.0',
              },
              devDependencies: {
                '@types/react': '^18.2.37',
                '@types/react-dom': '^18.2.15',
                '@typescript-eslint/eslint-plugin': '^6.10.0',
                '@typescript-eslint/parser': '^6.10.0',
                '@vitejs/plugin-react': '^4.1.1',
                eslint: '^8.53.0',
                'eslint-plugin-react-hooks': '^4.6.0',
                'eslint-plugin-react-refresh': '^0.4.4',
                typescript: '^5.2.2',
                vite: '^5.0.0',
                vitest: '^1.0.0',
              },
            },
            null,
            2
          ),
          template: true,
        },
        {
          path: 'tsconfig.json',
          content: JSON.stringify(
            {
              compilerOptions: {
                target: 'ES2020',
                useDefineForClassFields: true,
                lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                module: 'ESNext',
                skipLibCheck: true,
                moduleResolution: 'bundler',
                allowImportingTsExtensions: true,
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: 'react-jsx',
                strict: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                noFallthroughCasesInSwitch: true,
              },
              include: ['src'],
              references: [{ path: './tsconfig.node.json' }],
            },
            null,
            2
          ),
        },
        {
          path: 'vite.config.ts',
          content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`,
        },
        {
          path: 'index.html',
          content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{projectName}}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
          template: true,
        },
        {
          path: 'src/main.tsx',
          content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`,
        },
        {
          path: 'src/App.tsx',
          content: `import React from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to {{projectName}}</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App
`,
          template: true,
        },
        {
          path: 'src/App.css',
          content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}
`,
        },
        {
          path: 'src/index.css',
          content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,
        },
        {
          path: 'README.md',
          content: `# {{projectName}}

A modern React application built with TypeScript and Vite.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm test\` - Run tests
- \`npm run lint\` - Lint code

## Project Structure

\`\`\`
src/
  ├── App.tsx          # Main application component
  ├── App.css          # Application styles
  ├── main.tsx         # Application entry point
  └── index.css        # Global styles
\`\`\`
`,
          template: true,
        },
      ],
    });

    // Node.js TypeScript API Template
    this.addTemplate({
      id: 'node-typescript-api',
      name: 'Node.js TypeScript API',
      description:
        'RESTful API server with TypeScript, Express, and modern tooling',
      type: 'web',
      framework: 'express',
      language: 'typescript',
      files: [
        {
          path: 'package.json',
          content: JSON.stringify(
            {
              name: '{{projectName}}',
              version: '1.0.0',
              description: '{{projectDescription}}',
              main: 'dist/index.js',
              scripts: {
                start: 'node dist/index.js',
                dev: 'tsx watch src/index.ts',
                build: 'tsc',
                test: 'vitest',
                lint: 'eslint src --ext .ts',
                'lint:fix': 'eslint src --ext .ts --fix',
              },
              dependencies: {
                express: '^4.18.2',
                cors: '^2.8.5',
                helmet: '^7.1.0',
                dotenv: '^16.3.1',
              },
              devDependencies: {
                '@types/express': '^4.17.21',
                '@types/cors': '^2.8.17',
                '@types/node': '^20.8.0',
                '@typescript-eslint/eslint-plugin': '^6.10.0',
                '@typescript-eslint/parser': '^6.10.0',
                eslint: '^8.53.0',
                tsx: '^4.1.0',
                typescript: '^5.2.2',
                vitest: '^1.0.0',
              },
            },
            null,
            2
          ),
          template: true,
        },
        {
          path: 'tsconfig.json',
          content: JSON.stringify(
            {
              compilerOptions: {
                target: 'ES2020',
                module: 'commonjs',
                lib: ['ES2020'],
                outDir: './dist',
                rootDir: './src',
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                forceConsistentCasingInFileNames: true,
                resolveJsonModule: true,
                declaration: true,
                declarationMap: true,
                sourceMap: true,
              },
              include: ['src/**/*'],
              exclude: ['node_modules', 'dist'],
            },
            null,
            2
          ),
        },
        {
          path: 'src/index.ts',
          content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Prefer the monorepo logger in generated projects
import logger from '@udp/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to {{projectName}} API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(\`🚀 Server running on port \${PORT}\`);
});
`,
          template: true,
        },
        {
          path: '.env.example',
          content: `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
# DATABASE_URL=postgresql://username:password@localhost:5432/database

# JWT Configuration
# JWT_SECRET=your-super-secret-jwt-key

# API Keys
# EXTERNAL_API_KEY=your-api-key
`,
        },
        {
          path: 'README.md',
          content: `# {{projectName}}

{{projectDescription}}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server with hot reload
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm test\` - Run tests
- \`npm run lint\` - Lint code

## API Endpoints

- \`GET /\` - Welcome message
- \`GET /health\` - Health check

## Project Structure

\`\`\`
src/
  └── index.ts         # Main server file
\`\`\`
`,
          template: true,
        },
      ],
    });

    // Next.js Template
    this.addTemplate({
      id: 'nextjs-typescript',
      name: 'Next.js TypeScript App',
      description:
        'Full-stack React application with Next.js, TypeScript, and Tailwind CSS',
      type: 'fullstack',
      framework: 'nextjs',
      language: 'typescript',
      files: [
        {
          path: 'package.json',
          content: JSON.stringify(
            {
              name: '{{projectName}}',
              version: '0.1.0',
              private: true,
              scripts: {
                dev: 'next dev',
                build: 'next build',
                start: 'next start',
                lint: 'next lint',
                test: 'vitest',
              },
              dependencies: {
                next: '^14.0.0',
                react: '^18.0.0',
                'react-dom': '^18.0.0',
              },
              devDependencies: {
                '@types/node': '^20.0.0',
                '@types/react': '^18.0.0',
                '@types/react-dom': '^18.0.0',
                autoprefixer: '^10.0.0',
                eslint: '^8.0.0',
                'eslint-config-next': '^14.0.0',
                postcss: '^8.0.0',
                tailwindcss: '^3.0.0',
                typescript: '^5.0.0',
                vitest: '^1.0.0',
              },
            },
            null,
            2
          ),
          template: true,
        },
        {
          path: 'next.config.js',
          content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
`,
        },
        {
          path: 'tsconfig.json',
          content: JSON.stringify(
            {
              compilerOptions: {
                target: 'es5',
                lib: ['dom', 'dom.iterable', 'esnext'],
                allowJs: true,
                skipLibCheck: true,
                strict: true,
                noEmit: true,
                esModuleInterop: true,
                module: 'esnext',
                moduleResolution: 'bundler',
                resolveJsonModule: true,
                isolatedModules: true,
                jsx: 'preserve',
                incremental: true,
                plugins: [
                  {
                    name: 'next',
                  },
                ],
                paths: {
                  '@/*': ['./src/*'],
                },
              },
              include: [
                'next-env.d.ts',
                '**/*.ts',
                '**/*.tsx',
                '.next/types/**/*.ts',
              ],
              exclude: ['node_modules'],
            },
            null,
            2
          ),
        },
        {
          path: 'tailwind.config.js',
          content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
        },
        {
          path: 'src/app/layout.tsx',
          content: `import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '{{projectName}}',
  description: '{{projectDescription}}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`,
          template: true,
        },
        {
          path: 'src/app/page.tsx',
          content: `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to {{projectName}}
        </h1>
        <p className="text-center text-lg">
          Get started by editing <code className="bg-gray-100 p-1 rounded">src/app/page.tsx</code>
        </p>
      </div>
    </main>
  )
}
`,
          template: true,
        },
        {
          path: 'src/app/globals.css',
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
        },
      ],
    });
  }

  public addTemplate(template: ProjectTemplate): void {
    this.templates.set(template.id, template);
  }

  public getTemplates(): ProjectTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplate(id: string): ProjectTemplate | undefined {
    return this.templates.get(id);
  }

  public async createProject(
    templateId: string,
    projectPath: string,
    variables: Record<string, string> = {}
  ): Promise<void> {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Ensure project directory exists
    await this.fileSystem.createDirectory(projectPath, true);

    // Process and create files
    for (const file of template.files) {
      const filePath = this.fileSystem.join(projectPath, file.path);
      let content = file.content;

      // Process template variables if this is a template file
      if (file.template) {
        content = this.processTemplate(content, variables);
      }

      // Ensure parent directory exists
      const parentDir = this.fileSystem.dirname(filePath);
      if (!(await this.fileSystem.exists(parentDir))) {
        await this.fileSystem.createDirectory(parentDir, true);
      }

      // Write file
      await this.fileSystem.writeFile(filePath, content, {
        encoding: file.encoding || 'utf8',
        createDirectories: true,
      });
    }
  }

  private processTemplate(
    content: string,
    variables: Record<string, string>
  ): string {
    let processed = content;

    // Replace template variables ({{variableName}})
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, value);
    }

    return processed;
  }

  public async analyzeProject(
    projectPath: string
  ): Promise<ProjectStructureAnalysis> {
    const listing = await this.fileSystem.listDirectory(projectPath, {
      recursive: true,
      includeHidden: false,
    });

    const analysis: ProjectStructureAnalysis = {
      totalFiles: 0,
      totalDirectories: 0,
      languages: {},
      frameworks: [],
      hasTests: false,
      hasDocumentation: false,
      hasConfig: false,
      dependencies: [],
      structure: [],
    };

    // Build file tree and analyze
    const fileTree = this.buildFileTree(listing.entries);
    analysis.structure = fileTree;

    for (const entry of listing.entries) {
      if (entry.type === 'file') {
        analysis.totalFiles++;

        // Detect language
        const language = this.detectLanguage(entry.path);
        if (language) {
          analysis.languages[language] =
            (analysis.languages[language] || 0) + 1;
        }

        // Check for specific file types
        if (this.isTestFile(entry.path)) {
          analysis.hasTests = true;
        }

        if (this.isDocumentationFile(entry.path)) {
          analysis.hasDocumentation = true;
        }

        if (this.isConfigFile(entry.path)) {
          analysis.hasConfig = true;
        }

        // Parse package.json for dependencies and framework detection
        if (entry.name === 'package.json') {
          try {
            const content = (await this.fileSystem.readFile(
              entry.path
            )) as string;
            const packageJson = JSON.parse(content);

            if (packageJson.dependencies) {
              const deps = Object.entries(packageJson.dependencies).map(
                ([name, version]) => ({
                  name,
                  version: version as string,
                  type: 'dependency' as const,
                })
              );
              analysis.dependencies.push(...deps);
            }

            // Detect frameworks
            analysis.frameworks = this.detectFrameworks(packageJson);
          } catch {
            // Ignore parsing errors
          }
        }
      } else {
        analysis.totalDirectories++;
      }
    }

    return analysis;
  }

  private buildFileTree(entries: FileSystemEntry[]): FileTreeNode[] {
    const tree: FileTreeNode[] = [];
    const pathMap = new Map<string, FileTreeNode>();

    // Sort entries by path depth and name
    const sortedEntries = entries.sort((a, b) => {
      const depthA = a.path.split('/').length;
      const depthB = b.path.split('/').length;
      if (depthA !== depthB) {
        return depthA - depthB;
      }
      return a.path.localeCompare(b.path);
    });

    for (const entry of sortedEntries) {
      const node: FileTreeNode = {
        name: entry.name,
        path: entry.path,
        type: entry.type,
        size: entry.size,
        lastModified: entry.lastModified,
        language:
          entry.type === 'file' ? this.detectLanguage(entry.path) : undefined,
        isConfigFile:
          entry.type === 'file' ? this.isConfigFile(entry.path) : undefined,
        isTestFile:
          entry.type === 'file' ? this.isTestFile(entry.path) : undefined,
        children: entry.type === 'directory' ? [] : undefined,
      };

      pathMap.set(entry.path, node);

      // Find parent
      const parentPath = this.fileSystem.dirname(entry.path);
      if (parentPath === '/' || parentPath === entry.path) {
        tree.push(node);
      } else {
        const parent = pathMap.get(parentPath);
        if (parent && parent.children) {
          parent.children.push(node);
        }
      }
    }

    return tree;
  }

  private detectLanguage(filePath: string): string | undefined {
    const ext = this.fileSystem.extname(filePath).toLowerCase();
    const languageMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.cs': 'csharp',
      '.php': 'php',
      '.rb': 'ruby',
      '.go': 'go',
      '.rs': 'rust',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.sass': 'sass',
      '.less': 'less',
      '.json': 'json',
      '.xml': 'xml',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.md': 'markdown',
      '.sql': 'sql',
      '.sh': 'shell',
      '.bash': 'shell',
      '.zsh': 'shell',
    };

    return languageMap[ext];
  }

  private isTestFile(filePath: string): boolean {
    const testPatterns = [
      /\.test\./,
      /\.spec\./,
      /\/__tests__\//,
      /\/tests?\//,
      /\.test$/,
      /\.spec$/,
    ];

    return testPatterns.some(pattern => pattern.test(filePath));
  }

  private isDocumentationFile(filePath: string): boolean {
    const docPatterns = [
      /readme/i,
      /changelog/i,
      /contributing/i,
      /license/i,
      /docs?\//,
      /\.md$/,
      /\.mdx$/,
    ];

    return docPatterns.some(pattern => pattern.test(filePath));
  }

  private isConfigFile(filePath: string): boolean {
    const configPatterns = [
      /\.config\./,
      /\.conf$/,
      /\.rc$/,
      /\.json$/,
      /\.yaml$/,
      /\.yml$/,
      /^\.env/,
      /package\.json$/,
      /tsconfig\.json$/,
      /webpack\./,
      /vite\./,
      /next\./,
      /eslint/,
      /prettier/,
      /babel/,
    ];

    return configPatterns.some(pattern => pattern.test(filePath));
  }

  private detectFrameworks(packageJson: Record<string, unknown>): string[] {
    const frameworks: string[] = [];
    const dependencies =
      (packageJson.dependencies as Record<string, string>) || {};
    const devDependencies =
      (packageJson.devDependencies as Record<string, string>) || {};
    const deps = { ...dependencies, ...devDependencies };

    const frameworkDetection: Record<string, string> = {
      react: 'React',
      vue: 'Vue.js',
      angular: 'Angular',
      svelte: 'Svelte',
      next: 'Next.js',
      nuxt: 'Nuxt.js',
      gatsby: 'Gatsby',
      express: 'Express.js',
      fastify: 'Fastify',
      koa: 'Koa.js',
      nestjs: 'NestJS',
      electron: 'Electron',
      'react-native': 'React Native',
      flutter: 'Flutter',
      django: 'Django',
      flask: 'Flask',
      'spring-boot': 'Spring Boot',
    };

    for (const [dep, framework] of Object.entries(frameworkDetection)) {
      if (deps[dep] || Object.keys(deps).some(key => key.includes(dep))) {
        frameworks.push(framework);
      }
    }

    return [...new Set(frameworks)]; // Remove duplicates
  }

  public async createWorkspaceConfig(
    projectPath: string,
    config: Partial<WorkspaceConfig>
  ): Promise<void> {
    const workspaceConfig: WorkspaceConfig = {
      name: config.name || 'my-project',
      version: config.version || '1.0.0',
      description: config.description,
      type: config.type || 'web',
      framework: config.framework || 'react',
      language: config.language || 'typescript',
      rootPath: config.rootPath || '/',
      srcPath: config.srcPath || '/src',
      buildPath: config.buildPath || '/dist',
      testPath: config.testPath || '/tests',
      configFiles: config.configFiles || [],
      ignorePatterns: config.ignorePatterns || ['node_modules', 'dist', '.git'],
      dependencies: config.dependencies || [],
      scripts: config.scripts || {},
      metadata: config.metadata || {},
    };

    const configPath = this.fileSystem.join(projectPath, '.udp-workspace.json');
    const content = JSON.stringify(workspaceConfig, null, 2);

    await this.fileSystem.writeFile(configPath, content, {
      createDirectories: true,
    });
  }

  public async loadWorkspaceConfig(
    projectPath: string
  ): Promise<WorkspaceConfig | null> {
    const configPath = this.fileSystem.join(projectPath, '.udp-workspace.json');

    try {
      if (await this.fileSystem.exists(configPath)) {
        const content = (await this.fileSystem.readFile(configPath)) as string;
        return JSON.parse(content) as WorkspaceConfig;
      }
    } catch {
      // Ignore errors and return null
    }

    return null;
  }
}
