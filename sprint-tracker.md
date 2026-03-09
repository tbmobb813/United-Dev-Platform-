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

### Week 2: Database + CI
- [ ] Switch Prisma datasource to SQLite in schema.prisma
- [ ] Simplify schema (keep User, Project, ProjectFile only)
- [ ] Update `.env.example` with `DATABASE_URL=file:./dev.db`
- [ ] Run `pnpm --filter @udp/db generate`
- [ ] Update CI workflows (remove web build, add CLI build)
- [ ] Run full `pnpm check` — everything passes
- [ ] Commit and push to `pivot/workflow-tool`

## Sprint 2: Sync Engine + Server (3 weeks)
### Week 1: ProjectSyncManager
- [ ] Create `packages/editor-core/ProjectSyncManager.ts`
- [ ] Implement Y.Map<Y.Text> file tree sync
- [ ] Implement lazy file content loading
- [ ] Wire to @udp/filesystem file watcher
- [ ] Write unit tests for ProjectSyncManager

### Week 2: Sync Server + CLI
- [ ] Refactor sync-server for project room protocol
- [ ] Add device discovery REST endpoint
- [ ] Add QR code endpoint
- [ ] Implement `udp sync` command (server + watcher + QR)
- [ ] Implement device pairing flow

### Week 3: Integration Testing
- [ ] Multi-client sync tests (create, edit, delete files)
- [ ] Disconnect/reconnect recovery tests
- [ ] File watcher → Yjs propagation tests
- [ ] End-to-end: `udp sync` + second client sees changes

## Sprint 3: VS Code Extension (2 weeks)
- [ ] Scaffold extension with `yo code`
- [ ] Build status bar item (sync status)
- [ ] Build sidebar webview (devices, files, QR)
- [ ] Implement Start/Stop Sync commands
- [ ] Implement "Show on Mobile" command
- [ ] Test in VS Code + Cursor
- [ ] Package as .vsix

## Sprint 4: Mobile Companion (3 weeks)
- [ ] Strip mobile app to foundation
- [ ] Upgrade Expo SDK
- [ ] Build Connect screen (QR scanner)
- [ ] Refactor FileBrowser for real Yjs data
- [ ] Refactor FileViewer with syntax highlighting
- [ ] Add edit mode with real-time sync back
- [ ] Full flow test: CLI → QR → mobile → sync → edit

## Sprint 5: AI Analysis + MCP Agent (2 weeks)
- [ ] Create cross-platform analysis prompts
- [ ] Implement `udp analyze` command
- [ ] Build MCP server with 3 tools
- [ ] Write Cursor + Claude Code integration configs
- [ ] Test end-to-end MCP flow