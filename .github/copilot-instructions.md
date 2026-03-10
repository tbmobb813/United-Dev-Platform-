<!--
This file documents the Agent-PR-Checklist HTML comment block which automation
looks for in PR bodies. The enforcement workflow
`.github/workflows/agent-checklist-enforce.yml` parses that block and will
post a comment (or fail the job when `AGENT_CHECK_STRICT` is enabled) if the
block is missing or incomplete.
-->

# Agent PR Checklist (guidance)

Purpose
- Provide a small, machine-readable checklist that automated agents (and
  humans) can include in Pull Request bodies so repository workflows can
  validate basic checks were performed before requesting review.

Where to put it
- Include the checklist as an HTML comment in the PR body. Placing it in the
  project PR template (`.github/pull_request_template.md`) helps contributors
  include it by default; agents should still populate it with concrete values.

Required keys
- The enforcement workflow requires the following keys to exist in the
  comment block (case-insensitive key matching):
  - `branch`
  - `pr_summary`
  - `files_changed`
  - `commands_run`
  - `ci_status`

The format
- The block must be an HTML comment that begins with `Agent-PR-Checklist:` and
  ends with `-->`. Keys may be indented YAML-like lines (no strict YAML
  parsing is performed by the workflow; the workflow looks for the presence of
  the named keys and checks some required command substrings in
  `commands_run`).

Minimal example (what the enforcement workflow looks for)

<!--
Agent-PR-Checklist:
branch: feature/fix-yjs-dup
pr_summary: Fix duplicate yjs import by consolidating vendor bundle
files_changed:
  - apps/web/next.config.mjs
  - packages/ui/CollaborationPanel.tsx
commands_run:
  - pnpm -w format
  - pnpm -w type-check
  - pnpm -w lint
  - pnpm -w test
  - pnpm -w check:duplicate-yjs
ci_status: all checks passing locally
-->

Notes on commands
- The enforcement workflow is permissive about the exact notation but requires
  that `commands_run` includes at least one entry that matches each of these
  checks (see `agent-checklist-enforce.yml`):
  - type-check (matches `type-?check`)
  - lint (matches `lint`)
  - test (matches `test`)
  - check:duplicate-yjs (matches `check:?duplicate-?yjs`)

You can use workspace-wide forms (for example `pnpm -w type-check`) or
package-scoped forms (for example `pnpm --filter @udp/web run type-check`) as
long as the above keywords appear in the block.

Strict mode
- If you want missing/invalid checklist blocks to fail the GitHub Action job
  instead of posting a comment, set the repository secret `AGENT_CHECK_STRICT`
  to `true`. (Repository Settings → Secrets → Actions → New repository
  secret)

Troubleshooting
- If the workflow posts a comment asking for the Agent-PR-Checklist block,
  edit the PR body and paste the HTML comment (fill keys with concrete
  values). Updating the PR body will re-trigger the `pull_request` event and
  the workflow will re-validate.
- If the workflow complains about missing keys, make sure each of the
  five required keys listed above is present somewhere in the comment block.
- If the workflow complains about missing commands, ensure `commands_run` has
  entries that include the substrings `type-check`, `lint`, `test`, and
  `check:duplicate-yjs`.

Contributing
- If you want to change the enforcement behavior, update
  `.github/workflows/agent-checklist-enforce.yml`. Keep in mind that the
  workflow uses simple regexp checks and is intentionally permissive in order
  to accept slight formatting differences.

Contact
- If you have suggestions for improvements to this guidance, open an issue
  or PR and mention the `infra` or `devops` team.
