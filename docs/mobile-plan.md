Short answer: yes—include it. But make it a mobile-extended experience (continue/review/ship) rather
than “full desktop IDE on a phone.” Start small, prove value, then expand.

What to build first (phased, low-risk) Phase 1 — “Continue on Mobile” MVP (2–4 weeks of focused
work)

Read-only repo + diffs: Browse files, syntax-highlighted code, PR list, inline comments.

AI Quick Actions: “Summarize this PR,” “Explain this error,” “Draft a fix,” “Write tests for this
diff.”

Safe edits: Single-file edits with preview diff → open PR from phone.

Build/CI hooks: Trigger/retry CI, view logs, rollback/deploy toggles.

Auth & security: OAuth with GitHub/GitLab; device attestation; per-action scopes.

Why this first: It captures 80% of mobile value (reviews, quick fixes, ops) with low UX risk.

Phase 2 — Cloud Workspace Hand-off (4–8 weeks)

Open-in-Cloud: Tap to open the same branch in a cloud VS Code-like environment (containers/VM).
Phone = thin client.

Agent Tasks: “Upgrade to RN 0.xx,” “Fix failing tests,” “Bump deps safely,” “Generate migration +
run.” Agent runs in the cloud; phone monitors, approves, or reverts.

Artifacts & previews: Per-PR web preview links, Android emulator snapshots, screenshot diffs.

Phase 3 — Power-User Mobile (optional)

Multi-file edits, terminal attach (read-only by default), local keyboard shortcuts, external
keyboard support.

Offline notes & TODOs that sync back as issues/PR comments.

Architecture sketch

Frontend: React Native app (iOS/Android) + small responsive web shell.

Backend:

API gateway for VCS, CI/CD, artifact store.

Cloud dev-env service (container-per-branch) with persistent volumes.

AI layer: stateless function calling + long-running “agent” jobs (queue + worker with guardrails).

Storage: Object store for logs/builds, vector store for code embeddings (for AI context).

Security: OAuth, short-lived tokens, repo/branch ACLs, server-side code execution only (no eval on
device).

UX principles that keep this lovable on a phone

Task cards, not tabs: Present “Review PR #42,” “Fix failing test,” “Bump axios” as cards with 1-tap
outcomes.

Chunked diffs: Collapsed hunks; tap-to-expand; “summarize this hunk.”

One-screen compose: Edit → AI suggest → preview diff → commit/PR in one flow.

Voice-to-code prompts: Let users say the change; agent drafts it.

Safe rails: Every AI action creates a branch/PR with a checklist (tests run, typecheck, lint).

Where this differentiates you

Agent-as-Teammate for mobile: Not just chat—bounded, reviewable plans (plan → apply → open PR),
always reversible.

DevOps on the go: CI controls + targeted rollbacks + release notes summaries.

Context-rich AI: Embeddings of the codebase + repo conventions → higher-precision suggestions than
generic assistants.

KPIs to prove it’s working

Time to first review on a PR (desktop vs mobile).

% PRs with mobile comments or approvals.

AI-suggested patches merged from mobile.

Mean time to remediate failing builds from mobile.

Weekly active mobile “continuation” users; retention at 4 weeks.

Risks & how you mitigate

Tiny-screen fatigue: Focus on review/ops/quick edits first; defer complex refactors to cloud
hand-off.

Safety of AI edits: Always branch + CI gate + explicit human approval.

Latency: Prewarm containers for hot branches; cache embeddings; stream logs.

Trust: Full audit log of agent actions; “undo” button that force-pushes back.

Pricing & packaging (simple)

Free: Read-only review, comments, CI retry, 10 AI summaries/day.

Pro: Unlimited AI, safe edits/PR-from-phone, 5 concurrent agent tasks, cloud workspace hours.

Team: SSO, policy controls (who can run agents), prewarmed envs, usage analytics.

30/60/90 quick plan

30 days: Ship Phase-1 MVP (review + safe edits + AI summaries + CI triggers). Dogfood on your own
repos.

60 days: Cloud hand-off + agent jobs with guardrails; add PR previews and artifact viewing.

90 days: External beta; add voice prompts, keyboard shortcuts, and team analytics.

“Build list” you can hand to Copilot/engineers today

Mobile app scaffold (RN + Auth w/ GitHub).

PR list view → diff viewer (collapsed hunks) → inline comments.

AI endpoints: summarizeDiff, explainError(log), draftFix(file, prompt).

Commit/PR API: create branch → apply patch → open PR.

CI controls: rerun job, fetch logs, surface status in PR view.

Audit log service (every AI/CI action; actor; repo; PR; hash).

Feature flags: per-repo enable agent tasks.

If you want, I can draft the mobile MVP screens map (routes + components) and a minimal backend API
spec you can drop into a .github/copilot-instructions.md to align the agent with this plan.

You said: yes ChatGPT said: Thought for 12s Mobile Mvp Spec — “continue On Mobile” (phase 1) Mobile
MVP Spec — “Continue on Mobile” (Phase 1)

Goal: Ship a focused, low‑risk mobile experience that lets users review, summarize, make safe edits,
open PRs, and poke CI from their phone. Cloud agents do the heavy lifting; mobile stays fast and
simple.

1. App Surface (Screens Map)

Stack: React Native (Expo ok), React Navigation, TypeScript.

Routes

AuthStack

SignInScreen — OAuth with GitHub/GitLab. Shows org/repo scope consent summary.

DeviceLinkScreen — Device attestation; shows device name + revoke button.

MainTabs

HomeScreen — Recent activity cards: “PR #42 needs review”, “Build failed”, “Agent fix ready to
review”.

ReposScreen — Org/repo picker; search; starred repos sticky.

PRListScreen — Filter: Open / Needs review / Assigned / Mine.

MyTasksScreen — AI/Agent jobs queue with statuses (Queued → Running → Needs approval →
Completed/Failed).

SettingsScreen — Account, tokens, feature flags.

Modals / Stacks

PRDetailScreen — Header: title, labels, CI status chips; tabs: Overview | Diff | Checks | Files |
Comments.

DiffViewerScreen — Collapsed hunks; tap to expand; inline comments; AI “Summarize hunk / Explain
change / Draft tests”.

FileViewerScreen — Read-only code viewer with jump-to-symbol and search.

EditFileScreen — Single-file editor → Preview diff → Commit (branch) → Open PR.

CILogScreen — Streamed logs with AI "Explain error" & "Suggest fix".

AIPromptSheet — Prompt → Plan → Apply as PR (always branch, never force-push main).

Core Components

PRCard, StatusChip, DiffHunk, InlineComment, AIActionsBar, MonacoLite (or RN code editor),
LogViewer, TaskRow, SkeletonList.

2. Golden Flows

Review a PR on the go

Tap PR → PRDetail → Diff → Expand hunk → Summarize hunk → Leave inline comment → Approve/Request
changes.

Safe quick edit

Open file from PR → EditFile → Save → Preview diff → Create branch (user@mobile/quickfix-xyz) → Open
PR.

Unblock CI

From CILog, press Retry → If fail → Explain error → Draft fix → Review patch → Open PR.

Agent task (guard‑railed)

In AIPromptSheet: “Add null check in src/utils/date.ts and tests.”

Server Agent: Plan → Create branch → Patch → Run typecheck + lint + test.

Mobile: show Plan + Diff summary + Checks → user Approve → server opens PR.

3. Backend/API (minimal, Copilot-friendly)

Principles: Server holds tokens; mobile never talks to VCS directly. All AI/agent changes go through
branch + PR; everything is auditable and reversible.

REST-ish Endpoints (v1)

Auth

POST /v1/auth/github/start → { authUrl }

POST /v1/auth/github/callback { code } → { jwt, user }

POST /v1/auth/device/register { deviceInfo } → { deviceId }

Repos/PRs

GET /v1/repos → [{ id, name, provider, defaultBranch, permissions }]

GET /v1/repos/:id/pulls → list PRs (query: state, assignee, author, search)

GET /v1/pulls/:number → { meta, reviewers, statuses }

GET /v1/pulls/:number/diff → unified diff chunks [{ file, hunks: [...] }]

GET /v1/pulls/:number/checks → CI status, latest run ids

POST /v1/pulls/:number/comments { path?, line?, body }

POST /v1/pulls/:number/review { event: APPROVE|REQUEST_CHANGES|COMMENT, body? }

Edits/PR creation

POST /v1/branches { repoId, from: sha|branch, name }

POST /v1/patch { repoId, branch, patches: [{ path, beforeSha?, content|unifiedDiff }] } → {
commitSha }

POST /v1/pulls { repoId, head, base, title, body, draft? } → { number, url }

CI/Logs

GET /v1/ci/runs (query: repoId, pr) → [{ id, status, url }]

GET /v1/ci/runs/:id/log → stream text (SSE/websocket)

POST /v1/ci/runs/:id/retry → { ok }

AI & Agent

POST /v1/ai/summarize-diff { repoId, prNumber, range? }

POST /v1/ai/explain-log { text, repoId?, toolchainHint? }

POST /v1/ai/draft-fix { repoId, branch, prompt, constraints? } → returns plan + proposed patch (no
write yet)

POST /v1/agent/tasks { type: UPGRADE|REFCTOR|FIX|TESTS, repoId, prompt, branchBase } → { taskId }

GET /v1/agent/tasks/:taskId → { state, plan, diffs, checks }

POST /v1/agent/tasks/:taskId/approve → applies patch + opens PR

POST /v1/agent/tasks/:taskId/cancel

Audit

GET /v1/audit (query: actor, repoId, since)

Webhooks

/wh/github → events: pull_request, check_suite, check_run, push, issue_comment. Fan‑out to
notifications and cache.

Minimal Data Models // PR summary type PR = { number: number title: string author: { login: string,
avatarUrl: string } status: 'OPEN'|'DRAFT'|'MERGED'|'CLOSED' ci: { state:
'SUCCESS'|'FAILED'|'PENDING', runId?: string } updatedAt: string }

// Agent task type AgentTask = { id: string type: 'UPGRADE'|'REFACTOR'|'FIX'|'TESTS' state:
'QUEUED'|'RUNNING'|'AWAITING_APPROVAL'|'COMPLETED'|'FAILED' plan?: string diffs?:
Array<{path:string, summary:string}> checks?: { typecheck:'OK|FAIL', lint:'OK|FAIL', tests:{
passed:number, failed:number } } pr?: { number:number, url:string } } Permissions & Safety

Server exchanges OAuth for provider token → mints short‑lived JWT for mobile.

Per‑action authorization (repo + branch ACLs). Feature flag: Agent allowed per repo.

All write ops require server‑side branch creation; force‑push disabled.

Audit log row for every AI/agent action: {actor, repoId, branch, sha, diffHash, timestamp}.

4. Copilot Alignment (drop‑in .github/copilot-instructions.md seed)

Purpose: Help coding agents avoid breaking CI and enforce safe patterns.

# Coding Agent Ground Rules

## Build & Test

- Use Node 20 (set in CI). Run `bun install` or `npm ci` per repo `packageManager` field.
- Always run `bun run typecheck && bun run lint && bun run test` before proposing PRs.

## Branch & PR

- Never commit to `main`/`master`. Create `user/mobile/<short-desc>`.
- Keep changes scoped. If touching config or deps, open as **separate PR**.
- Include a PR checklist with CI status and test results.

## Files & Conventions

- TypeScript strict mode. Prefer `zod` for input validation.
- Tests live under `tests/` or `__tests__/`. Name: `*.test.ts(x)`.
- Lint: ESLint + Prettier. Fix with `bun run lint:fix`.

## Mobile UI

- Keep renders <50ms. Virtualize long lists. Chunk diffs into hunks.
- Wrap async ops with toasts + retry. Stream logs via SSE.

## AI/Agent Safety

- All automated edits must be applied on a branch and pass typecheck/lint/tests.
- Include a **plan** section in PR description summarizing changes.

5. CI/Infra (MVP)

GitHub Actions: typecheck, lint, test jobs; mobile-preview job to build diff summary artifact.

Cache embeddings per commit (e.g., sqlite or pg vector ext) for fast AI context.

Containers: One per hot branch (LRU prewarm 3 most active).

6. Telemetry & KPIs

Event names: pr.viewed, diff.summarized, ci.retry, edit.pr_opened, agent.task_approved.

Weekly dashboard: time‑to‑first‑review (desktop vs mobile), AI patch merge rate, MTTR for failing
builds.

7. Roadmap Next (Phase 2 hooks)

Open in Cloud: deep link to web IDE with same branch + context.

Preview Artifacts: PR web preview + Android emulator snapshot viewer.

Voice prompts and external keyboard shortcuts.

8. Open Questions (tracked)

Which code editor on RN? (Monaco wrapper vs lightweight RN editors)

Per‑provider feature parity (GitHub first, GitLab later).

Self‑hosted option (orgs that can’t share code to cloud).
