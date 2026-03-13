# UDP — United Development Platform

A cross-platform developer workflow tool that syncs your project across devices
in real time. Work on your laptop, preview on your phone, analyze with AI — all
connected through a single CLI.

```
udp init      → detect project, create .udp/config.json
udp sync      → start Yjs sync server, show QR code for mobile pairing
udp devices   → list, confirm, or remove paired devices
udp status    → show project info and connected devices
udp analyze   → AI-powered codebase analysis (Anthropic / OpenAI / Ollama)
```

## How It Works

UDP connects your development environments through a real-time sync layer built
on Yjs and WebSockets.

**CLI** (`apps/cli`) — The primary interface. `udp init` scaffolds a `.udp/`
config directory. `udp sync` spawns the sync server, generates a QR code in your
terminal, and begins watching for file changes via `ProjectSyncManager`.
`udp analyze` runs AI analysis on your project or a single file.

**Sync Server** (`apps/sync-server`) — A Fastify server with a Yjs WebSocket
endpoint. Manages project rooms (one Y.Doc per room), device
registration/confirmation, QR-based pairing, and a REST API for device
management. Runs on port 3030 by default (configurable in `.udp/config.json`).

**VS Code Extension** (`apps/vscode-extension`) — Status bar showing sync state
(stopped/starting/running/error), a sidebar with device list and sync controls,
and a QR panel for pairing. Spawns and manages the sync server lifecycle from
within VS Code.

**Mobile Companion** (`apps/mobile`) — Expo/React Native app with a QR scanner
for pairing, a file browser that reads from Yjs, a syntax-highlighted file
viewer, and a collaborative editor that syncs edits back in real time.

**MCP Server** (`apps/mcp-server`) — Model Context Protocol server exposing
three tools (`list_files`, `get_file_content`, `analyze_file`) over stdio.
Integrates with Cursor and Claude Code so AI assistants can read and analyze
your synced project. Config lives in `.claude/mcp.json` and `.cursorrules`.

## Architecture

```
┌──────────┐     ┌──────────────┐     ┌──────────────────┐
│  CLI     │────▸│ Sync Server  │◂────│ VS Code Extension│
│ (udp)    │     │ (Fastify+Yjs)│     │ (status/sidebar) │
└──────────┘     └──────┬───────┘     └──────────────────┘
                        │ WebSocket
                 ┌──────┴───────┐
                 │ Mobile App   │
                 │ (Expo + QR)  │
                 └──────────────┘

┌──────────────┐     ┌────────────┐
│ MCP Server   │────▸│ Cursor /   │
│ (stdio)      │     │ Claude Code│
└──────────────┘     └────────────┘
```

**Monorepo layout:**

```
apps/
  cli/                  Commander.js CLI (ESM, built with tsup)
  sync-server/          Fastify + Yjs WebSocket + device pairing API
  vscode-extension/     VS Code extension (CJS, built with tsup)
  mobile/               Expo 54 / React Native companion app
  mcp-server/           MCP server with 3 tools (CJS, built with tsup)

packages/
  ai/                   AIManager, AnthropicService, ContextAwareAssistant
  editor-core/          ProjectSyncManager (Yjs file tree sync)
  filesystem/           File system abstraction + file watcher
  db/                   Prisma client (SQLite)
  git/                  Git integration utilities
  types/                Shared TypeScript types
  config/               Configuration utilities
  logger/               Pino-based logging
  ui-native/            React Native UI components
  eslint-config/        Shared ESLint config
  prettier-config/      Shared Prettier config

archive/                Preserved code from the original IDE architecture
```

## Quick Start

**Prerequisites:** Node.js 18+, pnpm 9+

```bash
# Clone and install
git clone https://github.com/tbmobb813/United-Dev-Platform-.git
cd United-Dev-Platform-
git checkout pivot/workflow-tool
pnpm install

# Set up environment
cp .env.example .env
# Edit .env — at minimum set DATABASE_URL=file:./dev.db

# Build
pnpm build

# Initialize UDP in any project
cd /path/to/your/project
udp init

# Start syncing
udp sync
```

## Environment Variables

Create a `.env` file in the repo root:

```
DATABASE_URL=file:./dev.db

# AI (optional — needed for `udp analyze`)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Pairing auth
UDP_PAIR_AUTH=your-auth-token

# Server
PORT=3030
NODE_ENV=development
```

## Key Commands

```bash
# Build everything
pnpm build

# Build individual apps
pnpm --filter @udp/cli build
pnpm --filter @udp/mcp-server build

# Run the CLI (after build)
node apps/cli/dist/index.js init
node apps/cli/dist/index.js sync
node apps/cli/dist/index.js devices
node apps/cli/dist/index.js analyze
node apps/cli/dist/index.js analyze --file src/index.ts

# Run the sync server standalone
cd apps/sync-server && pnpm dev

# Test
pnpm test                  # Unit tests
pnpm test:integration      # Integration tests

# Lint and typecheck
pnpm lint
pnpm typecheck
pnpm format:check
```

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Monorepo       | pnpm workspaces + Turborepo                     |
| Language       | TypeScript (strict mode)                        |
| Real-time sync | Yjs + y-protocols + WebSocket                   |
| CLI            | Commander.js + chalk + ora                      |
| Server         | Fastify                                         |
| Database       | SQLite via Prisma                               |
| VS Code        | @vscode/vsce extension API                      |
| Mobile         | Expo 54 + React Native                          |
| AI             | Anthropic / OpenAI / Ollama (raw fetch, no SDK) |
| MCP            | @modelcontextprotocol/sdk (stdio transport)     |
| Build          | tsup (CLI: ESM, VS Code + MCP: CJS)             |
| Test           | Jest + ts-jest                                  |

## MCP Integration (Cursor / Claude Code)

The MCP server lets AI assistants browse and analyze your project. After
building:

```bash
pnpm --filter @udp/mcp-server build
```

**Cursor** — The `.cursorrules` file at the repo root provides full project
context automatically.

**Claude Code** — The `.claude/mcp.json` config registers the MCP server:

```json
{
  "mcpServers": {
    "udp": {
      "command": "node",
      "args": ["apps/mcp-server/dist/index.js"],
      "env": {
        "UDP_PROJECT_ROOT": ".",
        "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

Available MCP tools: `list_files` (browse project tree), `get_file_content`
(read any file), `analyze_file` (AI-powered analysis).

## Database

UDP uses SQLite via Prisma. The schema lives at
`apps/sync-server/prisma/schema.prisma` and defines four core models: **User**,
**Project**, **ProjectFile**, and **Device** (with DeviceEvent for pairing audit
trail).

```bash
# Generate Prisma client after schema changes
pnpm --filter @udp/db generate

# Create a migration
pnpm --filter @udp/db prisma migrate dev --name <name>
```

## Testing

Unit tests run with Jest across all packages. Integration tests (sync server
connectivity, multi-client Yjs sync, file watcher propagation) are separated and
run on demand.

```bash
pnpm test              # Unit tests only
pnpm test:integration  # Integration tests
pnpm test:core         # Core package tests
pnpm test:full         # Everything
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. The short version: fork
the repo, branch from `pivot/workflow-tool`, follow the existing patterns in
`apps/cli/src/commands/` for new CLI commands and `apps/mcp-server/src/tools/`
for new MCP tools, and run `pnpm check` before pushing.

## Archive

The `archive/` directory preserves code from UDP's original IDE architecture
(web app, desktop Electron wrapper, NextAuth, server-utils). This code is
excluded from the workspace and build pipeline but kept for reference. See
[archive/README.md](archive/README.md) for details.

## License

See [SECURITY.md](SECURITY.md) for security policies.
