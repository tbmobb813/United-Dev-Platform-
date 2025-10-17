# Test Architecture Analysis & Refactoring Plan

Date: 2025-09-26

This document analyzes the current testing landscape of the monorepo, highlights
gaps, and provides a pragmatic, staged refactoring plan to reach a stable,
maintainable test architecture with CI enforcement and an automated
duplicate-Yjs detection check for production bundles.

## Goals

- Provide a clear, low-friction path to reliable CI (PR/merge/nightly) that
  enforces safety gates.
- Detect critical runtime problems (like duplicate Yjs runtime in bundles) early
  in PRs.
- Make tests fast and stable using stratified runs (critical/core/full) so PRs
  remain fast while guaranteeing quality on merge and nightly.
- Produce a repeatable migration/refactor plan so teams can implement
  improvements incrementally.

## Current state (short)

- Monorepo managed by pnpm + turbo.
- Root Jest + ts-jest installed; many packages contain lightweight smoke tests.
- Root `jest.config.js` exists; package `jest.setup.ts` files placed at package
  roots.
- No CI workflows yet; test stratification is not enforced in automation.
- Duplicate-Yjs runtime remains an open production-bundle issue to detect and
  prevent.

## Gap analysis

- No CI: no automated PR-level checks that run critical tests and bundle scans.
- No stratification enforcement: tests exist but tiers (critical/core/full) are
  not enforced.
- No consistent coverage collection/thresholds for core packages.
- No E2E skeleton integrated with CI (Playwright/Detox missing).
- No automated duplicate-Yjs detection integrated into CI.

## High-level test architecture (proposal)

### 1) Tiered tests

1. Critical
   - Extremely fast checks that run on every PR and block merge: lint,
     type-checks, tiny unit/smoke tests for platform entrypoints, and a
     bundle-scan to detect duplicate runtimes. Target runtime: under 3 minutes.

2. Core
   - Deeper unit and integration tests for core runtime packages (editor-core,
     api, web). Run on merge to main. Target runtime: under 15 minutes.

3. Full (Nightly)
   - Full integration, E2E, and cross-package workflows (Playwright, Detox,
     performance tests). Run nightly or on-demand.

### 2) Shared config

- Provide root-level jest configs per tier: `jest.config.critical.js`,
  `jest.config.core.js`, `jest.config.full.js` that extend a shared base.
- Add package-level scripts that map to tiers, e.g. `test:critical`,
  `test:core`, `test:full`.

### 3) CI strategy (GitHub Actions recommended)

- PR workflow: run `lint`, `typecheck`, `test:critical`, and `bundle-scan`
  (duplicate-Yjs detection). Fail fast and report status checks.
- Merge-to-main workflow: run `test:core`, build affected packages, and perform
  stricter duplicate-Yjs scans on production bundles.
- Nightly workflow: run `test:full`, E2E, and performance tests.
- Use turbo and pnpm workspace filters to limit scope to affected packages when
  possible.

### 4) Artifacts & cache

- Cache the pnpm store and turbo cache to speed CI runs.
- Upload coverage reports and source maps as artifacts for later analysis.

## Duplicate-Yjs detection: practical script design

### Goal

Detect when more than one copy of the Yjs runtime appears in production bundles.

### Approach (heuristic, reliable with source maps)

1. Build production bundles in CI (web `.next`, mobile artifacts if applicable)
   and keep source maps.
2. Find JS chunks and their source maps (for Next.js: `.next/static/chunks/*.js`
   and `*.js.map`).
3. For each chunk and source map, scan the original/source files referenced for
   signs of Yjs runtime presence (identifiers like `yjs`, `Y`, `y-protocols`,
   `y-websocket`).
4. Count distinct runtime definitions or bundled runtime bodies. If more than
   one unique runtime is detected, fail.

Notes

- Source maps greatly increase accuracy; prefer scanning source-mapped
  references rather than minified text when possible.
- The script will be heuristic-based; it is intended to catch regressions where
  a dependency accidentally bundles its own Yjs copy.
- The script should expose `--dir` (bundle directory) and `--report` (JSON
  output) flags and exit non-zero on failure.

## Refactor plan — incremental steps (PR-sized tasks)

### Phase 0 — Prep (small, low-risk PRs)

1. Add this plan file (done).
2. Create root-tier jest configs (base + critical/core/full).
3. Add workspace scripts: `test:critical`, `test:core`, `test:full`.

### Phase 1 — CI + quick gates

1. Add a PR GitHub Actions workflow that runs lint, typecheck, `test:critical`,
   and the duplicate-Yjs scan.
2. Add a merge-to-main workflow that runs `test:core`, builds affected packages,
   and runs stricter bundle scans.
3. Implement the `scripts/check-duplicate-yjs.js` detector and wire it into the
   workflows.

### Phase 2 — Stabilize tests and coverage

1. Expand smoke tests to include runtime-level checks for editor-core and web
   entrypoints.
2. Enable coverage collection for core packages and enforce thresholds in
   `jest.config.core.js`.

### Phase 3 — E2E and performance

1. Add a Playwright skeleton for web E2E and a RN E2E approach (Detox or RN
   Testing Library) for mobile.
2. Add a nightly performance job (k6 or Artillery) to exercise real-time editor
   sync scenarios.

### Phase 4 — Ongoing hardening

1. Create `packages/test-utils` and consolidate shared jest helpers, mock
   servers, and fixtures.
2. Triage and fix flaky tests; adopt stable run modes and prefer deterministic
   tests.

## Contract: what's in / out

- Inputs: the existing monorepo (pnpm/turbo), build outputs, source maps in CI,
  and current smoke tests.
- Outputs: tiered jest configs, CI workflows, duplicate-Yjs detector script,
  updated package scripts, and incremental PRs as described.
- Success criteria:
  - PRs block on failing critical checks (lint/type/test/bundle-scan).
  - Merges run core tests and fail on coverage regressions or bundle-scan
    failures.
  - Nightly runs execute the full suite and at least one E2E test.

## Edge cases & risks

- Next.js/minifiers can obfuscate signatures used by the scanner; mitigate by
  using source maps and multiple heuristics.
- Mixed ESM/CJS packages can cause jest transform issues; mitigate with
  per-package transforms and a clear `ts-jest` root config.
- CI build times: Next.js builds are slow; mitigate with caching and selective
  builds for affected packages.

## Metrics / quality gates

- Lint: no lint errors on PRs.
- Typecheck: no TypeScript errors in core packages.
- Tests: `test:critical` must pass on PRs; `test:core` must pass on merge.
- Coverage: per-package thresholds enforced in `jest.config.core.js`.
- Bundle-scan: zero duplicate Yjs runtime occurrences.

## Minimal example: duplicate-yjs check pseudo-workflow

1. CI job: `pnpm --filter web build` (preserve `.next` and source maps).
2. CI job:
   `node scripts/check-duplicate-yjs.js --dir apps/web/.next --report out.json`.
3. Fail job if script exits non-zero; upload `out.json` as an artifact for
   triage.

## Timeline & effort estimate (rough)

- Phase 0 (configs + scripts): 0.5–1 day
- Phase 1 (CI + detector): 1–2 days
- Phase 2 (stabilize tests & enforce coverage): 2–4 days
- Phase 3 (E2E & performance): 2–5 days

## Next concrete steps I can take now (pick one or more)

1. Create root-tier jest configs and add workspace scripts (`test:critical`,
   `test:core`, `test:full`).
2. Implement the duplicate-Yjs detector (`scripts/check-duplicate-yjs.js`) and a
   minimal `ci-pr.yml` that runs the critical gate.
3. Implement both the detector and CI workflows in a single branch/PR and open a
   draft PR for review.

If you'd like, I can implement option 2 next (detector + PR CI). I will:

- create a branch, add the detector script under `scripts/`, and add
  `.github/workflows/ci-pr.yml` that runs the critical gate using cached
  pnpm/turbo steps, and
- preserve source maps in the web build step so the detector can analyze
  bundles.

---

Requirements coverage

- Provide Test Architecture Analysis & Refactoring Plan: Done.
- Make the plan actionable (phased PRs, scripts, CI): Done.
- Include duplicate-Yjs detection design and CI integration point: Done.
