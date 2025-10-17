# Console → Logger Migration

This document describes the lightweight workflow we use to replace runtime `console.*` calls
with the shared `@udp/logger` API and how to handle the tricky cases.

Quick steps
1. Run a dry-run of the replacement tool which writes `artifacts/console-replace-report.json`:

   pnpm -w exec node scripts/replace-console-with-logger.cjs --dry-run --report=artifacts/console-replace-report.json

2. Inspect the report. It contains entries per-file with `edits` and `aliasIssues`.

   - `edits`: list of simple callee replacements (e.g. `console.log` → `logger.info`). These can be applied automatically.
   - `aliasIssues`: aliasing/destructuring cases (e.g. `const c = console; c.log()` or `const { log } = console`) that need manual fixes.

3. For files with only `edits`, you can run the apply mode (this will create `.bak` backups):

   pnpm -w exec node scripts/replace-console-with-logger.cjs --apply --report=artifacts/console-replace-report.json

4. For files with `aliasIssues` or where the tool couldn't safely transform, open the file and manually:
   - Replace `console.xxx(...)` usages with `logger.xxx(...)` and add `import logger from '@udp/logger'` at the top for ESM/TS files.
   - For CommonJS scripts (in `scripts/` or `bin/`) it's acceptable to keep `console.*` — update ESLint overrides if needed.
   - For destructured aliases (`const { log } = console`), prefer replacing call sites with `logger.info(...)` or re-create a small adapter: `const logger = require('@udp/logger').default || console;`

5. Run quality gates before committing:

   pnpm -w run lint
   pnpm -w run type-check
   pnpm -w run test

CI note
- The PR checks include a step that reads `artifacts/console-replace-report.json` and fails the job if any entry lists `edits` (so the dry-run must be run and committed or the edits applied before merging).

Tips and FAQs
- If you see console usage inside template strings (example: generator templates), these are source strings for generated projects and don't need to be changed.
- If you need to allow `console` in a package (rare), update `eslint.config.js` overrides to explicitly permit the path.
- For browser bundles we intentionally provide `packages/logger/browser.ts` that forwards to `console.*` to keep bundles small.

Example manual fix (TypeScript ESM file):

Before:

```ts
console.log('Starting server');
```

After:

```ts
import logger from '@udp/logger';
logger.info('Starting server');
```

If you want, follow the automated tests located in `scripts/__tests__` which exercise the replace tooling on fixtures.

---
End of migration notes.
