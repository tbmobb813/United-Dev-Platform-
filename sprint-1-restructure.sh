#!/bin/bash
# ============================================================
# UDP Sprint 1: Repository Restructure
# Run this from the root of your United-Dev-Platform- repo
# on the pivot/workflow-tool branch
# ============================================================

set -e

echo ""
echo "========================================"
echo "  UDP Sprint 1.1: Archive Old Apps"
echo "========================================"
echo ""

# Verify we're on the right branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "pivot/workflow-tool" ]; then
  echo "ERROR: Not on pivot/workflow-tool branch (currently on $BRANCH)"
  echo "Run: git checkout pivot/workflow-tool"
  exit 1
fi
echo "  ✓ On pivot/workflow-tool branch"
echo ""

# --- Step 1: Move apps to archive ---
echo "[1/7] Moving apps to archive/..."
mkdir -p archive

# Move each app/package to archive
git mv apps/web archive/web
echo "  ✓ apps/web → archive/web"

git mv apps/desktop archive/desktop
echo "  ✓ apps/desktop → archive/desktop"

# Worker is empty, just archive it
git mv apps/worker archive/worker
echo "  ✓ apps/worker → archive/worker"

# Move web UI package (IDE-specific components)
git mv packages/ui archive/ui-web
echo "  ✓ packages/ui → archive/ui-web"

# Move server-utils (NextAuth-dependent)
git mv packages/server-utils archive/server-utils
echo "  ✓ packages/server-utils → archive/server-utils"

# Move auth package (JWT/bcrypt - replaced by GitHub device code grant)
git mv packages/auth archive/auth
echo "  ✓ packages/auth → archive/auth"

echo ""

# --- Step 2: Update pnpm-workspace.yaml ---
echo "[2/7] Updating pnpm-workspace.yaml..."
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
  # archive/ is explicitly excluded — those packages are preserved
  # for reference but are not part of the active workspace
EOF
echo "  ✓ pnpm-workspace.yaml updated"
echo ""

# --- Step 3: Update .gitignore ---
echo "[3/7] Adding archive exclusions to .gitignore..."
if ! grep -q "archive/*/node_modules" .gitignore 2>/dev/null; then
  cat >> .gitignore << 'EOF'

# Archive - excluded from workspace but tracked in git for reference
archive/*/node_modules/
archive/*/.next/
archive/*/dist/
archive/*/build/
archive/*/.expo/
EOF
  echo "  ✓ .gitignore updated"
else
  echo "  ✓ .gitignore already has archive exclusions"
fi
echo ""

# --- Step 4: Clean up root files that were IDE-specific ---
echo "[4/7] Archiving IDE-specific root files..."
mkdir -p archive/root-files

# Move IDE-specific docs to archive
for f in docs/mobile-plan.md docs/platform-ai-ml.md docs/strategic-roadmap.md \
         docs/backend-integration-summary.md docs/mobile-implementation-summary.md \
         docs/areas-of-impprovements.md docs/platform_development_strategy.md; do
  if [ -f "$f" ]; then
    git mv "$f" archive/root-files/$(basename "$f") 2>/dev/null || true
  fi
done
echo "  ✓ IDE-specific docs moved to archive/root-files/"

# Move large debug/report files
for f in eslint-report.worker.json full_run_log.txt lint_chunk1.txt lint_chunk2.txt \
         lint_job_logs.txt lint_job_logs.zip lint_job_section.txt yjs-report.json \
         report_summary.txt run_logs.zip test-ai.js fix-resolve-merge-conflicts.patch; do
  if [ -f "$f" ]; then
    git mv "$f" archive/root-files/$(basename "$f") 2>/dev/null || true
  fi
done
echo "  ✓ Debug/report files moved to archive/root-files/"

# Move Docker files (not needed for CLI-first approach initially)
for f in Dockerfile Dockerfile.dev Dockerfile.playwright docker-compose.yml \
         docker-compose.dev.yml; do
  if [ -f "$f" ]; then
    git mv "$f" archive/root-files/$(basename "$f") 2>/dev/null || true
  fi
done
echo "  ✓ Docker files moved to archive/root-files/"

# Move nginx config
if [ -d "nginx" ]; then
  git mv nginx archive/root-files/nginx 2>/dev/null || true
  echo "  ✓ nginx/ moved to archive/"
fi
echo ""

# --- Step 5: Update root package.json scripts ---
echo "[5/7] Updating root package.json scripts..."
# We'll use node for this since bash JSON editing is fragile
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Remove IDE-specific scripts
delete pkg.scripts['dev:web'];
delete pkg.scripts['dev:mobile'];
delete pkg.scripts['dev:all'];

// Update remaining scripts
pkg.scripts['dev:api'] = 'cd apps/sync-server && pnpm dev';
pkg.scripts['dev:sync'] = 'cd apps/sync-server && pnpm dev';

// Add new CLI scripts
pkg.scripts['dev:cli'] = 'cd apps/cli && pnpm dev';
pkg.scripts['build:cli'] = 'pnpm --filter @udp/cli build';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('  ✓ Root package.json updated');
"
echo ""

# --- Step 6: Rename apps/api to apps/sync-server ---
echo "[6/7] Renaming apps/api to apps/sync-server..."
git mv apps/api apps/sync-server
echo "  ✓ apps/api → apps/sync-server"

# Update the package name inside sync-server
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('apps/sync-server/package.json', 'utf8'));
pkg.name = '@udp/sync-server';
pkg.description = 'Yjs WebSocket sync relay server for UDP';
fs.writeFileSync('apps/sync-server/package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('  ✓ sync-server package.json updated');
"
echo ""

# --- Step 7: Create the CLI app skeleton ---
echo "[7/7] Creating apps/cli/ skeleton..."
mkdir -p apps/cli/src/commands

# Create CLI package.json
cat > apps/cli/package.json << 'CLIPKG'
{
  "name": "@udp/cli",
  "version": "0.1.0",
  "description": "Cross-platform developer workflow tool",
  "type": "module",
  "bin": {
    "udp": "./dist/index.js"
  },
  "scripts": {
    "dev": "tsup src/index.ts --format cjs --platform node --watch --onSuccess 'node dist/index.js'",
    "build": "tsup src/index.ts --format cjs --platform node --dts --clean",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "test": "jest --config ../../jest.config.cjs"
  },
  "dependencies": {
    "@udp/config": "workspace:*",
    "@udp/filesystem": "workspace:*",
    "@udp/git": "workspace:*",
    "@udp/logger": "workspace:*",
    "@udp/types": "workspace:*",
    "chalk": "^5.3.0",
    "commander": "^13.1.0",
    "ora": "^8.2.0"
  },
  "devDependencies": {
    "@types/node": "^24.10.0",
    "tsup": "^8.0.0",
    "typescript": "^5.9.3"
  },
  "files": [
    "dist",
    "README.md"
  ]
}
CLIPKG
echo "  ✓ apps/cli/package.json created"

# Create CLI tsconfig
cat > apps/cli/tsconfig.json << 'CLITS'
{
  "extends": "../../packages/tsconfig.base.node.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
CLITS
echo "  ✓ apps/cli/tsconfig.json created"

# Create the main CLI entry point
cat > apps/cli/src/index.ts << 'CLIENTRY'
#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";
import { statusCommand } from "./commands/status.js";
import { syncCommand } from "./commands/sync.js";

const program = new Command();

program
  .name("udp")
  .description(
    chalk.bold("UDP") +
      " — Cross-platform developer workflow tool\n" +
      "  Sync your project across devices, preview on mobile, analyze cross-platform parity."
  )
  .version("0.1.0");

// Register commands
initCommand(program);
statusCommand(program);
syncCommand(program);

program.parse();
CLIENTRY
echo "  ✓ apps/cli/src/index.ts created"

# Create the init command
cat > apps/cli/src/commands/init.ts << 'CLINIT'
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "node:fs";
import path from "node:path";

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
          console.log(
            chalk.dim(`  Config: ${configPath}`)
          );
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
        console.log();
        console.log(chalk.bold("  Project: ") + projectName);
        console.log(
          chalk.bold("  Frameworks: ") +
            (frameworks.length > 0 ? frameworks.join(", ") : "none detected")
        );
        console.log(chalk.bold("  Sync port: ") + config.syncPort);
        console.log(chalk.bold("  Config: ") + chalk.dim(configPath));
        console.log();
        console.log(
          chalk.dim("Next: run ") +
            chalk.cyan("udp sync") +
            chalk.dim(" to start syncing across devices")
        );
      } catch (error) {
        spinner.fail(chalk.red("Failed to initialize UDP"));
        console.error(error);
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
    if (!fs.existsSync(pkgPath)) return frameworks;
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
      if (deps[dep]) frameworks.push(name);
    }
  } catch {
    // ignore
  }
  return frameworks;
}
CLINIT
echo "  ✓ apps/cli/src/commands/init.ts created"

# Create the status command
cat > apps/cli/src/commands/status.ts << 'CLSTATUS'
import { Command } from "commander";
import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";

export function statusCommand(program: Command): void {
  program
    .command("status")
    .description("Show UDP project status")
    .action(async () => {
      const configPath = path.join(process.cwd(), ".udp", "config.json");

      if (!fs.existsSync(configPath)) {
        console.log(
          chalk.yellow("UDP is not initialized in this directory.")
        );
        console.log(
          chalk.dim("Run ") +
            chalk.cyan("udp init") +
            chalk.dim(" to get started.")
        );
        return;
      }

      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

      console.log();
      console.log(chalk.bold.blue("UDP Project Status"));
      console.log(chalk.dim("─".repeat(40)));
      console.log(chalk.bold("  Project:    ") + config.projectName);
      console.log(
        chalk.bold("  Frameworks: ") +
          (config.frameworks?.length > 0
            ? config.frameworks.join(", ")
            : chalk.dim("none detected"))
      );
      console.log(chalk.bold("  Sync port:  ") + config.syncPort);
      console.log(
        chalk.bold("  Initialized: ") +
          new Date(config.createdAt).toLocaleDateString()
      );
      console.log(chalk.dim("─".repeat(40)));

      // Check devices
      const devicesPath = path.join(process.cwd(), ".udp", "devices.json");
      if (fs.existsSync(devicesPath)) {
        const devices = JSON.parse(fs.readFileSync(devicesPath, "utf-8"));
        console.log(
          chalk.bold("  Devices:    ") + devices.length + " paired"
        );
      } else {
        console.log(
          chalk.bold("  Devices:    ") + chalk.dim("none paired")
        );
      }

      // Check sync status
      console.log(
        chalk.bold("  Sync:       ") + chalk.dim("not running")
      );
      console.log();
      console.log(
        chalk.dim("Run ") +
          chalk.cyan("udp sync") +
          chalk.dim(" to start syncing")
      );
    });
}
CLSTATUS
echo "  ✓ apps/cli/src/commands/status.ts created"

# Create the sync command (stub for Sprint 1)
cat > apps/cli/src/commands/sync.ts << 'CLSYNC'
import { Command } from "commander";
import chalk from "chalk";

export function syncCommand(program: Command): void {
  program
    .command("sync")
    .description("Start real-time project sync across devices")
    .option("-p, --port <port>", "Override sync server port")
    .action(async (_options) => {
      console.log();
      console.log(
        chalk.yellow("⚠ ") +
          chalk.bold("udp sync") +
          " is coming in Sprint 2"
      );
      console.log();
      console.log(
        chalk.dim(
          "  This command will start the Yjs sync server, watch your\n" +
            "  project files, and display a QR code for mobile pairing.\n" +
            "\n" +
            "  For now, the CLI skeleton is working. Run:\n" +
            "    udp init     — Initialize a project\n" +
            "    udp status   — Check project status"
        )
      );
      console.log();
    });
}
CLSYNC
echo "  ✓ apps/cli/src/commands/sync.ts created (stub)"

# Create CLI README
cat > apps/cli/README.md << 'CLIREADME'
# @udp/cli

Cross-platform developer workflow tool. Sync your project across devices,
preview on mobile, analyze cross-platform parity.

## Usage

```bash
# Initialize UDP in your project
udp init

# Check project status
udp status

# Start real-time sync (Sprint 2)
udp sync
```

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Run directly
node dist/index.js init
```
CLIREADME
echo "  ✓ apps/cli/README.md created"
echo ""

echo "========================================"
echo "  Sprint 1.1 Complete!"
echo "========================================"
echo ""
echo "  Next steps:"
echo "  1. Run: pnpm install"
echo "  2. Run: pnpm --filter @udp/cli build"
echo "  3. Test: node apps/cli/dist/index.js --help"
echo "  4. Test: node apps/cli/dist/index.js init"
echo "  5. Commit: git add -A && git commit -m 'feat: restructure repo for workflow tool pivot'"
echo ""
echo "  Then continue with Sprint 1.2 (dependency cleanup):"
echo "  - Remove React from packages/filesystem"
echo "  - Decouple packages/ai from React/web UI"
echo "  - Switch packages/db to SQLite"
echo ""