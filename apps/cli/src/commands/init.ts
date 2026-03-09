import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "node:fs";
import path from "node:path";
import pino from "pino";
const logger = pino();

interface UDPConfig {
  version: string;
  projectName: string;
  projectRoot: string;
  frameworks: string[];
  syncPort: number;
  createdAt: string;
}

export function initCommand(program: Command): void {
  program
    .command("init")
    .description("Initialize UDP in your project")
    .option("-p, --port <port>", "Sync server port", "21567")
    .action(async (options) => {
      const spinner = ora("Initializing UDP...").start();

      try {
        const projectRoot = process.cwd();
        const udpDir = path.join(projectRoot, ".udp");
        const configPath = path.join(udpDir, "config.json");

        // Check if already initialized
        if (fs.existsSync(configPath)) {
          spinner.warn("UDP is already initialized in this project.");
          logger.info(chalk.dim(`  Config: ${configPath}`));
          return;
        }

        // Detect project info
        spinner.text = "Detecting project structure...";
        const projectName = detectProjectName(projectRoot);
        const frameworks = detectFrameworks(projectRoot);

        // Create .udp directory
        fs.mkdirSync(udpDir, { recursive: true });

        // Create config
        const config: UDPConfig = {
          version: "0.1.0",
          projectName,
          projectRoot,
          frameworks,
          syncPort: parseInt(options.port, 10),
          createdAt: new Date().toISOString(),
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        // Add .udp to .gitignore if not already there
        const gitignorePath = path.join(projectRoot, ".gitignore");
        if (fs.existsSync(gitignorePath)) {
          const content = fs.readFileSync(gitignorePath, "utf-8");
          if (!content.includes(".udp/")) {
            fs.appendFileSync(gitignorePath, "\n# UDP workflow tool\n.udp/\n");
          }
        }

        spinner.succeed(chalk.green("UDP initialized!"));
        logger.info("\n" +
          chalk.bold("  Project: ") + projectName + "\n" +
          chalk.bold("  Frameworks: ") + (frameworks.length > 0 ? frameworks.join(", ") : "none detected") + "\n" +
          chalk.bold("  Sync port: ") + config.syncPort + "\n" +
          chalk.bold("  Config: ") + chalk.dim(configPath) + "\n" +
          chalk.dim("Next: run ") + chalk.cyan("udp sync") + chalk.dim(" to start syncing across devices")
        );
      } catch (error) {
        spinner.fail(chalk.red("Failed to initialize UDP"));
        logger.error(error);
        process.exit(1);
      }
    });
}

function detectProjectName(root: string): string {
  try {
    const pkgPath = path.join(root, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      return pkg.name || path.basename(root);
    }
  } catch {
    // ignore
  }
  return path.basename(root);
}

function detectFrameworks(root: string): string[] {
  const frameworks: string[] = [];
  try {
    const pkgPath = path.join(root, "package.json");
    if (!fs.existsSync(pkgPath)) { return frameworks; }
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    const detectors: Record<string, string> = {
      next: "Next.js",
      react: "React",
      "react-native": "React Native",
      expo: "Expo",
      vue: "Vue.js",
      angular: "Angular",
      svelte: "Svelte",
      flutter: "Flutter",
      electron: "Electron",
      tauri: "Tauri",
    };

    for (const [dep, name] of Object.entries(detectors)) {
      if (deps[dep]) { frameworks.push(name); }
    }
  } catch {
    // ignore
  }
  return frameworks;
}
