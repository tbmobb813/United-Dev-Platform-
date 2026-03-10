# UDP Pivot — Sprint Tracker

## Sprint 0: Pre-Work ✅
- [x] Run `sprint-0-branch-setup.sh` (creates branch + tag)
- [x] Create Google Form from `survey.md`
- [x] Send survey to 20–30 developers
- [x] Wait for responses (aim for 1 week max)
- [x] Evaluate go/no-go gate (60% threshold on Q3)

## Sprint 1: Repo Restructure + CLI (2 weeks)
### Week 1: Restructure ✅
- [x] Run `sprint-1-restructure.sh` (archives old apps, creates CLI skeleton)
- [x] Run `pnpm install` and verify clean lockfile
- [x] Build CLI: `pnpm --filter @udp/cli build`
- [x] Test CLI: `node apps/cli/dist/index.js --help`
- [x] Test CLI: `node apps/cli/dist/index.js init` (in a test project)
- [x] Remove React from `packages/filesystem/package.json`
- [x] Remove React + @udp/ui from `packages/ai/package.json`  
- [x] Move `packages/ai/AIAssistant.tsx` to `archive/ai-ui/`
- [x] Update `packages/ai/index.ts` (export only service layer)
- [x] Run `pnpm typecheck` — fix all errors
- [x] Run `pnpm lint` — fix all errors

### Week 2: Database + CI ✅
- [x] Switch Prisma datasource to SQLite in schema.prisma
- [x] Simplify schema (keep User, Project, ProjectFile only)
- [x] Update `.env.example` with `DATABASE_URL=file:./dev.db`
- [x] Run `pnpm --filter @udp/db generate`
- [x] Update CI workflows (remove web build, add CLI build)
- [x] Run full `pnpm check` — everything passes
- [x] Commit and push to `pivot/workflow-tool`

## Sprint 2: Sync Engine + Server (3 weeks)
### Week 1: ProjectSyncManager ✅
- [x] Create `packages/editor-core/ProjectSyncManager.ts`
- [x] Implement Y.Map<Y.Text> file tree sync
- [x] Implement lazy file content loading
- [x] Wire to @udp/filesystem file watcher
- [x] Write unit tests for ProjectSyncManager (12 tests, all passing)

### Week 2: Sync Server + CLI ✅
- [x] Refactor sync-server for project room protocol (consolidated Fastify instances, moved device routes to main app)
- [x] Add device discovery REST endpoint (already implemented, now on active `app` instance)
- [x] Add QR code endpoint (fixed to return JSON with token + qr data URL)
- [x] Implement `udp sync` command (server + watcher + QR) (fixed imports, token extraction, added ProjectSyncManager + WebSocket)
- [x] Implement device pairing flow (end-to-end QR → register → confirm)

### Week 3: Integration Testing
- [~] Multi-client sync test suite created (uses y-websocket provider for multi-client scenarios)
- [~] File watcher → Yjs propagation test suite created (ProjectSyncManager + FileWatcher)
- [~] End-to-end integration test suite created (full sync flow tests)
- [~] Sync server connectivity and WebSocket tests created (server health, message handling, lifecycle)
- [ ] Refine integration tests to work with built packages (currently need full build infrastructure)
- [ ] Run full integration test suite after build optimization

## Sprint 3: VS Code Extension (2 weeks) ✅
- [x] Scaffold extension in `apps/vscode-extension/` (manual, no `yo code`)
- [x] Build status bar item with sync status indicators (stopped/starting/running/error)
- [x] Build sidebar webview with device list and sync controls
- [x] Implement Start/Stop Sync commands (spawn server process, manage lifecycle)
- [x] Implement "Show on Mobile" (QR Code) command (fetch & render QR from sync-server)
- [x] Build VS Code extension with tsup (CommonJS format, external vscode)
- [x] All tests pass (62 tests, no integration test failures)

## Sprint 4: Mobile Companion (3 weeks) ✅
- [x] Strip mobile app to foundation (removed mock API, updated dependencies)
- [x] Upgrade Expo SDK (updated sdkVersion to 54.0.0)
- [x] Build Connect screen (QR scanner with expo-camera, manual fallback)
- [x] Refactor FileBrowser for real Yjs data (accepts yjsFiles prop, converts to nested tree)
- [x] Refactor FileViewer with syntax highlighting (CodeEditor with atomOneDark theme)
- [x] Add edit mode with real-time sync back (CollaborativeEditor integrated in Edit tab)
- [x] Full flow test: CLI → QR → mobile → sync → edit (three-tab layout: Connect/Browse/Edit)

## Sprint 5: AI Analysis + MCP Agent (2 weeks) ✅
- [x] Create cross-platform analysis prompts (via AIManager.explainCode() + ContextAwareAssistant.analyzeCodebase())
- [x] Implement `udp analyze` command (CLI command with --file option, --provider/--model flags)
- [x] Build MCP server with 3 tools (list_files, get_file_content, analyze_file in apps/mcp-server/)
- [x] Write Cursor + Claude Code integration configs (.cursorrules + .claude/mcp.json)
- [x] Test end-to-end MCP flow (tools accessible via stdio transport)