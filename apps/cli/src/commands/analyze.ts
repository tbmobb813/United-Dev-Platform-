/* eslint-disable no-console */
import path from 'path';
import fs from 'fs';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import pino from 'pino';
import { AIManager, ContextAwareAssistant } from '@udp/ai';

const logger = pino();

const IGNORE_DIRS = ['node_modules', '.git', 'dist', '.turbo', '.next', 'coverage', '.udp', 'build', 'out'];
const CODE_EXTENSIONS = [
  'ts', 'tsx', 'js', 'jsx', 'py', 'java', 'go', 'rs', 'c', 'cpp', 'h', 'hpp',
  'cs', 'rb', 'php', 'swift', 'kt', 'scala', 'sh', 'bash', 'sql', 'html', 'css', 'scss', 'json', 'yaml', 'yml', 'md', 'mdx',
];

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  language?: string;
  size?: number;
  extension?: string;
  children?: FileNode[];
}

export function analyzeCommand(program: Command): void {
  program
    .command('analyze [target]')
    .description('AI-powered analysis of the current project or a specific file')
    .option('--provider <provider>', 'AI provider: anthropic | openai | local', 'anthropic')
    .option('--model <model>', 'Model override (e.g., gpt-4, claude-3-opus)')
    .option('--file <path>', 'Analyze a specific file instead of the whole project')
    .option('--quiet', 'Suppress spinner output')
    .action(async (target, options) => {
      const spin = !options.quiet;
      const spinner = spin ? ora('Initializing AI analysis...').start() : null;

      try {
        const projectRoot = target ? path.resolve(target) : process.cwd();
        const configPath = path.join(projectRoot, '.udp', 'config.json');

        // Read UDP config if present
        let udpConfig: any = {};
        if (fs.existsSync(configPath)) {
          udpConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }

        // Check API keys
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
        if (!apiKey && options.provider !== 'local') {
          if (spinner) {spinner.fail();}
          console.error(chalk.red('❌ No API key found for provider'));
          console.error(chalk.dim('Set ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable'));
          process.exit(1);
        }

        if (spinner) {spinner.text = 'Initializing AI manager...';}

        // Initialize AI manager
        const manager = new AIManager({
          defaultProvider: options.provider as any,
          apiKeys: {
            anthropic: process.env.ANTHROPIC_API_KEY,
            openai: process.env.OPENAI_API_KEY,
          },
          defaultModel: options.model,
        });

        await manager.initialize();

        if (options.file) {
          // Single file analysis
          if (spinner) {spinner.text = `Analyzing ${path.basename(options.file)}...`;}

          const filePath = path.resolve(options.file);
          if (!fs.existsSync(filePath)) {
            if (spinner) {spinner.fail();}
            console.error(chalk.red(`❌ File not found: ${filePath}`));
            process.exit(1);
          }

          const content = fs.readFileSync(filePath, 'utf-8');
          const extension = path.extname(filePath).slice(1);

          const result = await manager.explainCode(content, {
            fileName: path.basename(filePath),
            language: extension,
          });

          if (spinner) {spinner.succeed('Analysis complete');}
          console.log();
          console.log(chalk.bold.cyan(`📄 ${path.basename(filePath)}`));
          console.log(chalk.dim(`   Language: ${extension}`));
          console.log();
          console.log(result.content);
          console.log();
        } else {
          // Full project analysis
          if (spinner) {spinner.text = 'Scanning project structure...';}

          const fileStructure = walkDirectory(projectRoot, IGNORE_DIRS);

          if (spinner) {spinner.text = 'Building codebase context...';}

          const assistant = new ContextAwareAssistant(manager.getService());
          const primaryLanguage = inferPrimaryLanguage(fileStructure);

          assistant.setCodebaseContext({
            projectName: udpConfig.projectName || path.basename(projectRoot),
            projectType: 'monorepo',
            language: primaryLanguage,
            fileStructure,
          });

          if (spinner) {spinner.text = 'Running AI analysis...';}
          const result = await assistant.analyzeCodebase();

          if (spinner) {spinner.succeed('Analysis complete');}

          // Pretty-print results
          printProjectAnalysis(result);
        }
      } catch (error) {
        if (spinner) {spinner.fail();}
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(msg);
        console.error(chalk.red(`❌ Analysis failed: ${msg}`));
        process.exit(1);
      }
    });
}

function walkDirectory(root: string, ignore: string[]): FileNode[] {
  const results: FileNode[] = [];

  try {
    const entries = fs.readdirSync(root, { withFileTypes: true });

    for (const entry of entries) {
      if (ignore.includes(entry.name)) {continue;}

      const fullPath = path.join(root, entry.name);
      const relativePath = path.relative(process.cwd(), fullPath);

      if (entry.isDirectory()) {
        const children = walkDirectory(fullPath, ignore);
        results.push({
          name: entry.name,
          path: relativePath,
          type: 'directory',
          children: children.length > 0 ? children : undefined,
        });
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).slice(1).toLowerCase();
        if (CODE_EXTENSIONS.includes(ext) || ext === '') {
          const stats = fs.statSync(fullPath);
          results.push({
            name: entry.name,
            path: relativePath,
            type: 'file',
            extension: ext,
            size: stats.size,
            language: getLanguageFromExtension(ext),
          });
        }
      }
    }
  } catch {
    // Silently skip directories we can't read
  }

  return results;
}

function inferPrimaryLanguage(files: FileNode[]): string {
  const extCount: Record<string, number> = {};

  function countExts(nodes: FileNode[]) {
    for (const node of nodes) {
      if (node.type === 'file' && node.extension) {
        extCount[node.extension] = (extCount[node.extension] || 0) + 1;
      } else if (node.children) {
        countExts(node.children);
      }
    }
  }

  countExts(files);

  // Prefer languages in this order
  const preferred = ['ts', 'tsx', 'js', 'jsx', 'py', 'go', 'rs', 'java'];
  for (const ext of preferred) {
    if (extCount[ext]) {return ext;}
  }

  // Return most common
  const sorted = Object.entries(extCount).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || 'typescript';
}

function getLanguageFromExtension(ext: string): string {
  const langMap: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TypeScript React',
    js: 'JavaScript',
    jsx: 'JavaScript React',
    py: 'Python',
    java: 'Java',
    go: 'Go',
    rs: 'Rust',
    cs: 'C#',
    rb: 'Ruby',
    php: 'PHP',
    swift: 'Swift',
    kt: 'Kotlin',
    scala: 'Scala',
    c: 'C',
    cpp: 'C++',
    h: 'C Header',
    hpp: 'C++ Header',
    sh: 'Shell',
    bash: 'Bash',
    sql: 'SQL',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    md: 'Markdown',
    mdx: 'MDX',
  };
  return langMap[ext.toLowerCase()] || 'Text';
}

function printProjectAnalysis(result: any) {
  const { healthScore, insights, recommendations } = result;

  console.log();
  console.log(chalk.bold.cyan('📊 Project Analysis'));
  console.log(chalk.dim('─'.repeat(50)));
  console.log();

  // Health score
  if (typeof healthScore === 'number') {
    const percentage = Math.min(100, Math.max(0, healthScore));
    const filledLen = Math.round(percentage / 5);
    const emptyLen = 20 - filledLen;
    const bar = '█'.repeat(filledLen) + '░'.repeat(emptyLen);

    const scoreColor = percentage >= 70 ? chalk.green : percentage >= 50 ? chalk.yellow : chalk.red;
    console.log(`Health Score: ${scoreColor(bar)} ${percentage.toFixed(0)}%`);
    console.log();
  }

  // Insights
  if (insights && Array.isArray(insights) && insights.length > 0) {
    console.log(chalk.bold('💡 Insights:'));
    for (const insight of insights) {
      const text = typeof insight === 'string' ? insight : insight.text || insight;
      console.log(`  • ${text}`);
    }
    console.log();
  }

  // Recommendations
  if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
    console.log(chalk.bold('🎯 Recommendations:'));
    for (const rec of recommendations) {
      const text = typeof rec === 'string' ? rec : rec.text || rec;
      console.log(`  • ${text}`);
    }
    console.log();
  }

  console.log(chalk.dim('─'.repeat(50)));
}
