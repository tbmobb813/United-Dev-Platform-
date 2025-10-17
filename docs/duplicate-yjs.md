# Duplicate-Yjs detector

This repository includes a small heuristic detector that scans built JavaScript
artifacts (for example Next.js `apps/web/.next`) for signs that multiple copies
of the Yjs runtime were bundled. Duplicate Yjs runtimes break constructor checks
and can cause hard-to-debug runtime issues in collaborative code.

Files

- `scripts/check-duplicate-yjs.js` (ESM) — the main detector implementation.
- `scripts/check-duplicate-yjs.cjs` (CJS wrapper) — convenience entrypoint used
  by npm/pnpm scripts and CI.
- `scripts/duplicate-yjs-allowlist.txt` — repository allowlist (substring
  tokens) for known benign vendor noise (monaco-editor, lib0, etc.).
- `scripts/ci/read-duplicate-report.cjs` — small helper used by CI to summarize
  the report for PR comments.

How it works (short)

- Scans `.js` files under a provided `--dir` (default `apps/web/.next`).
- Matches known Yjs indicators (weak and strong). For matches it attempts to map
  back to original sources using source maps and heuristics.
- Applies the allowlist and vendor-aware rules (vendor hits require stronger
  evidence before being considered a real Yjs runtime).

Run locally

1. Build the target app so `.next` (or other build output) exists:

```bash
pnpm --filter ./apps/web --dir ./apps/web build
```

1. Run the detector and write a JSON report:

```bash
node ./scripts/check-duplicate-yjs.cjs --dir apps/web/.next \
  --report artifacts/duplicate-yjs/local-report.json
```

1. Inspect the report at `artifacts/duplicate-yjs/local-report.json`.

CI behaviour in this repo

- `ci-pr.yml` runs the detector in report-only mode (the detector will not fail
  the build from the `build-and-detect` job). The report is uploaded as an
  artifact and a summary is posted on the PR.
- There is an early/strict check in the `validate` job which will fail the PR
  only when the `AGENT_CHECK_STRICT` environment variable (or repository secret)
  is set to `true`. This lets you make the detector blocking only after the repo
  is stabilized.

Making the check strict (two options)

- Fast: set the repository secret `AGENT_CHECK_STRICT=true`. This triggers the
  early strict check in CI which will run `pnpm run check:duplicate-yjs` and
  fail the job on a non-zero exit from the detector.
- Stronger (code change): revert the detector's warning->non-failure change in
  `scripts/check-duplicate-yjs.js` so it treats a single flagged Yjs runtime as
  an error and exits non-zero. (This is a small change near the
  `yjsRuntimeCandidates`/`severity` logic.)

Updating the allowlist

- Edit `scripts/duplicate-yjs-allowlist.txt`. Lines starting with `#` are
  comments. Each non-empty line is treated as a substring token — any match
  against generated file path, resolved source or raw source will be ignored.

Troubleshooting

- If the detector is noisy, first add vendor tokens to the allowlist (e.g.
  `monaco-editor`).
- If the build fails in CI due to missing environment variables, the workflow
  provides safe fallbacks for `NEXT_PUBLIC_*` values so the detector step can
  run and produce a report. For a production-grade CI, set the real env vars in
  your CI provider or adjust the workflow to build the specific app only.

Questions or changes

- If you want, I can revert the temporary warning behavior and make the detector
  strict by default once you confirm the repo is deduped.

License: same as the repository.
