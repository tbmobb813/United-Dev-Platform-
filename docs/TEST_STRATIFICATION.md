# Test Suite Stratification Guide — United Dev Platform (UDP)

This document adapts the KidMap Phase 3 stratification model to the UDP
monorepo. It defines three test tiers (Critical, Core, Full), how tests map to
packages, recommended run scripts, CI triggers, reporting expectations, and
failure handling.

---

## 🎯 Overview

We stratify tests into three tiers to optimize feedback velocity, CI cost, and
release confidence.

- Critical (`test:critical`) — fastest, highest-signal tests that must pass on
  every commit/PR.
- Core (`test:core`) — broader coverage for feature-level correctness, run on
  merges and scheduled runs.
- Full (`test:full`) — exhaustive test suite (integration, performance,
  cross-platform) run nightly or pre-release.

Tiers are sized to balance speed vs confidence. Each tier has clear pass/fail
thresholds and reporting.

---

## Tier definitions (UDP)

### 1) Critical tests — `test:critical`

- Target runtime: < 30s (per package where possible)
- Scope: Safety, auth, core editor collaboration primitive, WebSocket health, DB
  migrations, bundle sanity checks for duplicate runtimes (Yjs), basic API
  contract tests.
- Trigger: Every commit and PR (fast feedback)
- Pass requirement: 100%
- Suggested location(s):
  - `packages/*/__tests__/critical/`
  - `apps/*/__tests__/critical/`
  - small, focused tests in `packages/editor-core/__tests__/critical/` for
    DocumentManager and awareness
- Example checks: websocket connect/disconnect, critical endpoints respond,
  simple Yjs join/merge smoke, auth cookie/session flows.

### 2) Core tests — `test:core`

- Target runtime: < 5 minutes
- Scope: Main features and component integration: editor features, API
  integration, UI component behavior, core hooks, DB operations, AI
  request/response happy-paths.
- Trigger: Daily builds, feature branch merges, release candidates
- Pass requirement: 95% (team-defined), coverage target: ~70% per critical
  packages
- Suggested locations:
  - `packages/*/__tests__/core/`
  - `apps/*/__tests__/core/`
  - Integration-style tests that exercise two or more packages together

### 3) Full tests — `test:full`

- Target runtime: < 15 minutes (can be longer if CI split across runners)
- Scope: Full integration, E2E, performance/load, large-scale presence tests,
  cross-platform scenarios (web + mobile sync), visual regression.
- Trigger: Nightly builds, pre-release pipelines, manual runs
- Pass requirement: 90% (or project-defined), coverage target: ~80% across repo
- Suggested locations:
  - `__tests__` (package-root) or `tests/e2e/` and `tests/perf/`
  - Playwright suites, Detox/Appium suites, k6 scenarios.

---

## Recommended repository layout for stratified tests

```
__tests__/
├── critical/          # very small, focused tests
├── core/              # feature and integration tests
├── full/              # E2E, perf, visual regression
packages/
  editor-core/
    __tests__/
      critical/
      core/
      full/
  ui/
    __tests__/
      critical/
      core/
      full/
apps/
  web/__tests__/
    critical/
    core/
    full/
  mobile/__tests__/
    critical/
    core/
    full/
```

Notes:

- Use `critical` folders for the fastest and most important checks. Keep them
  tiny.
- Keep `full` suites isolated and heavy; they should run on separate CI agents
  or with scheduling.

---

## Example npm/pnpm scripts (root `package.json` recommendations)

Add the following scripts to standardize runs across packages. These are
examples — adapt to your root tooling (Turbo, pnpm):

```json
{
  "scripts": {
    "test:critical": "turbo run test --filter=./... --scope-critical",
    "test:core": "turbo run test --filter=./... --scope-core",
    "test:full": "turbo run test --filter=./... --scope-full",
    "test:stratified": "pnpm test:critical && pnpm test:core && pnpm test:full"
  }
}
```

Implementation notes:

- We recommend adding package-level test scripts that accept a `--config` or
  `--testPathPattern` to run per-tier tests (e.g.
  `jest --config=jest.config.critical.js`).
- Alternatively, use naming conventions and `--testPathPattern` to pick up
  `critical/`, `core/`, or `full/` subfolders.

---

## Jest config suggestions

Create tiered Jest configs that inherit from a base config and adjust
timeouts/coverage:

- `jest.config.base.js` — shared transforms, testRegex, moduleNameMapper etc.
- `jest.config.critical.js` — extends base; sets `testMatch` to
  `**/critical/**/*.test.*`, tight `testTimeout`, no coverage threshold
  enforcement (fast only).
- `jest.config.core.js` — extends base; includes core patterns and coverage
  thresholds for core packages.
- `jest.config.full.js` — extends base; enables `setupFilesAfterEnv`, longer
  timeouts, and performance hooks.

Example extract for `jest.config.critical.js`:

```js
const base = require('./jest.config.base');
module.exports = {
  ...base,
  testMatch: ['**/__tests__/critical/**/*.test.[jt]s?(x)'],
  testTimeout: 10000,
};
```

---

## CI/CD integration (GitHub Actions example)

Why: run fast feedback first, gate merges on critical tests, run core tests for
branch merges, and schedule full tests nightly.

Suggested workflow stages:

1. PR: run `test:critical` (fast) and `lint`/`typecheck`.
2. Merge to main: run `test:core` and incremental build checks.
3. Nightly: run `test:full` with E2E and perf harnesses; if failure, open
   automated issue.

Example job matrix snippet (simplified):

```yaml
jobs:
  critical:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:critical

  core:
    needs: critical
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:core

  full-nightly:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:full
```

---

## Reporting & thresholds

- Critical: fail fast on any failure; provide time metrics and slowest tests
  list.
- Core: enforce coverage gates per package (e.g. `packages/editor-core >= 70%`)
  and global warnings for near-threshold.
- Full: collect full coverage, performance artifacts, and E2E logs. Attach
  reports to nightly runs.

Place reports into artifact buckets:

- `artifacts/coverage/critical/`
- `artifacts/coverage/core/`
- `artifacts/coverage/full/`

---

## Failure handling & notifications

- Critical failure: block PR merge; add a PR comment automatically summarizing
  failures and top 5 stack traces.
- Core failure: fail merge to main but allow fix-on-branch; open an issue
  automatically if multiple recent failures.
- Full failure: create nightly failure issue, assign to maintainers, and attach
  logs/trace.

Notifications:

- Use Slack/GitHub actions notifications for critical failures only.
- Use daily digests for core and full failures to avoid noise.

---

## Performance monitoring & test health

- Track the following metrics over time:
  - Average critical suite runtime
  - Flaky test rate (retries / total runs)
  - Test coverage per package
  - Slowest test trends
- Weekly maintenance: triage flaky tests and reassign tests from full->core or
  core->critical when necessary.

---

## Test classification guidelines (how to pick a tier)

- Critical: tests that validate invariants that must never fail in production.
  Examples: authentication, WebSocket connect/disconnect, DB migrations, small
  Yjs join/merge smoke.
- Core: tests that validate feature correctness (editor features, API
  integrations, component behaviour).
- Full: broad scenarios, platform compatibility, load/perf tests, and
  long-running stability tests.

When in doubt: prefer moving tests to a higher tier (core) rather than critical;
keep critical strictly minimal.

---

## Maintenance cadence & practices

- Weekly: monitor slow tests and flakiness; triage and fix or quarantine flaky
  tests.
- Monthly: update thresholds and evaluate coverage goals per package.
- Before releases: run `test:full` and ensure no regressions in performance or
  E2E flows.

---

## Troubleshooting & common fixes

- Timeouts: increase `testTimeout` for slow packages or move slow tests to
  `full` tier.
- Flaky tests: add retries in CI for non-critical flaky tests, or quarantine
  until fixed.
- Coverage regressions: add targeted tests for areas flagged by coverage
  reports.

Commands to debug:

```bash
# Run only critical tests with verbose output
pnpm test -- --config=jest.config.critical.js --runInBand --verbose

# Show tests matching a pattern
pnpm test -- --listTests | grep -E "(critical|core)"
```

---

## Metrics & KPIs

Track and publish in dashboards:

- Critical suite pass rate (target 100%)
- Mean time for critical suite (target < 30s)
- Flaky test rate (target < 1%)
- Coverage by package (track trends)

---

## Future improvements

- Dynamic test tiering (only run core/full tests impacted by changed files)
- AI-assisted flaky test detection and triage
- Parallelized E2E on demand using build-matrix

---

If you'd like, I can:

- Add example `jest.config.*.js` files and package-level scripts to the repo.
- Create `.github/workflows/test-stratification.yml` to implement the CI flow
  above.
- Add a small runner script `scripts/run-stratified.js` that orchestrates tier
  runs with reporting.

Tell me which of the above you'd like next and I'll implement it.
