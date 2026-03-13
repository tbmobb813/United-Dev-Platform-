import fs from 'fs';
import path from 'path';

interface Tool {
  name: string;
  description: string;
  inputSchema: any;
  execute(args: any): Promise<any>;
}

export const getFileContentTool: Tool = {
  name: 'get_file_content',
  description:
    'Get the full content of a file from the synced project. Returns the complete file text.',
  inputSchema: {
    type: 'object',
    properties: {
      file_path: {
        type: 'string',
        description: 'Relative or absolute path to the file to read',
      },
      project_root: {
        type: 'string',
        description:
          'Project root directory (default: UDP_PROJECT_ROOT or current working directory)',
      },
    },
    required: ['file_path'],
  },
  async execute({
    file_path,
    project_root,
  }: {
    file_path: string;
    project_root?: string;
  }) {
    const root = project_root || process.env.UDP_PROJECT_ROOT || process.cwd();

    // Resolve the file path
    const absPath = path.isAbsolute(file_path)
      ? file_path
      : path.resolve(root, file_path);

    // Security check: ensure path is within root
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
      throw new Error(
        `File too large: ${(stats.size / 1024 / 1024).toFixed(1)}MB (max 1MB)`
      );
    }

    const content = fs.readFileSync(absPath, 'utf-8');
    const relativePath = path.relative(root, absPath);

    return {
      path: relativePath,
      content,
      size: stats.size,
      encoding: 'utf-8',
      lastModified: stats.mtime.toISOString(),
      lineCount: content.split('\n').length,
    };
  },
};
