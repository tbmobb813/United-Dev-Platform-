import fs from 'fs';
import path from 'path';
import { AIManager } from '@udp/ai';

interface Tool {
  name: string;
  description: string;
  inputSchema: any;
  execute(args: any): Promise<any>;
}

let aiManager: AIManager | null = null;

function getAIManager(): AIManager {
  if (!aiManager) {
    const provider = (process.env.UDP_AI_PROVIDER as any) || 'anthropic';
    aiManager = new AIManager({
      defaultProvider: provider,
      apiKeys: {
        anthropic: process.env.ANTHROPIC_API_KEY,
        openai: process.env.OPENAI_API_KEY,
      },
    });
  }
  return aiManager;
}

export const analyzeFileTool: Tool = {
  name: 'analyze_file',
  description:
    'AI-powered analysis of a file from the synced project. Provides explanation, identifies issues, and suggests improvements.',
  inputSchema: {
    type: 'object',
    properties: {
      file_path: {
        type: 'string',
        description: 'Relative or absolute path to the file to analyze',
      },
      prompt: {
        type: 'string',
        description:
          'Optional specific question about the file (default: "Analyze this file and identify issues and improvements")',
      },
      project_root: {
        type: 'string',
        description: 'Project root directory (default: UDP_PROJECT_ROOT or current working directory)',
      },
    },
    required: ['file_path'],
  },
  async execute({
    file_path,
    prompt,
    project_root,
  }: {
    file_path: string;
    prompt?: string;
    project_root?: string;
  }) {
    const root = project_root || process.env.UDP_PROJECT_ROOT || process.cwd();

    // Resolve the file path
    const absPath = path.isAbsolute(file_path) ? file_path : path.resolve(root, file_path);

    // Security check
    if (!absPath.startsWith(path.resolve(root))) {
      throw new Error(`Path traversal not allowed: ${file_path}`);
    }

    if (!fs.existsSync(absPath)) {
      throw new Error(`File not found: ${absPath}`);
    }

    const stats = fs.statSync(absPath);
    if (!stats.isFile()) {
      throw new Error(`Not a file: ${absPath}`);
    }

    if (stats.size > 1024 * 1024) {
      // 1MB limit
      throw new Error(`File too large: ${(stats.size / 1024 / 1024).toFixed(1)}MB (max 1MB)`);
    }

    const content = fs.readFileSync(absPath, 'utf-8');
    const ext = path.extname(absPath).slice(1).toLowerCase();
    const relativePath = path.relative(root, absPath);

    // Initialize AI manager
    const manager = getAIManager();

    try {
      await manager.initialize();
    } catch (err) {
      throw new Error(`Failed to initialize AI: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Use provided prompt or default
    const question =
      prompt ||
      `Analyze this ${ext || 'text'} file and provide:
1. A brief explanation of what the code/content does
2. Any potential issues, bugs, or concerns
3. Suggestions for improvement
Keep the response concise and actionable.`;

    try {
      const result = await manager.chat(question, {
        fileName: path.basename(absPath),
        language: ext,
        fullCode: content,
      });

      return {
        file: relativePath,
        language: ext,
        analysis: result.content,
        lineCount: content.split('\n').length,
      };
    } catch (err) {
      throw new Error(`AI analysis failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  },
};
