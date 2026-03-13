import fs from 'fs';
import path from 'path';

const IGNORE = [
  'node_modules',
  '.git',
  'dist',
  '.turbo',
  '.next',
  'coverage',
  '.udp',
  'build',
  'out',
];

interface Tool {
  name: string;
  description: string;
  inputSchema: any;
  execute(args: any): Promise<any>;
}

export const listFilesTool: Tool = {
  name: 'list_files',
  description:
    'List files in the UDP project directory. Returns relative paths of all code files.',
  inputSchema: {
    type: 'object',
    properties: {
      directory: {
        type: 'string',
        description:
          'Project root directory path (default: current working directory)',
      },
      pattern: {
        type: 'string',
        description:
          'Optional file extension filter, e.g. ".ts" to only show TypeScript files',
      },
    },
  },
  async execute({
    directory,
    pattern,
  }: {
    directory?: string;
    pattern?: string;
  }) {
    const root = directory || process.env.UDP_PROJECT_ROOT || process.cwd();

    if (!fs.existsSync(root)) {
      throw new Error(`Directory not found: ${root}`);
    }

    const files = walkDir(root);
    const filtered = pattern
      ? files.filter(f =>
          f.endsWith(pattern.startsWith('.') ? pattern : `.${pattern}`)
        )
      : files;

    return {
      files: filtered,
      count: filtered.length,
      root,
      pattern: pattern || 'all files',
    };
  },
};

function walkDir(root: string, ignore = IGNORE): string[] {
  const files: string[] = [];

  try {
    const entries = fs.readdirSync(root, { withFileTypes: true });

    for (const entry of entries) {
      if (ignore.includes(entry.name)) continue;

      const fullPath = path.join(root, entry.name);
      const relativePath = path.relative(process.cwd(), fullPath);

      if (entry.isDirectory()) {
        files.push(...walkDir(fullPath, ignore));
      } else if (entry.isFile()) {
        files.push(relativePath);
      }
    }
  } catch {
    // Silently skip unreadable directories
  }

  return files.sort();
}
