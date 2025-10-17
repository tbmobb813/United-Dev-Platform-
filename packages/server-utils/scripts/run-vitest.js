#!/usr/bin/env node
const { spawnSync } = require('child_process');

// Deduplicate flags (vitest errors on duplicate --passWithNoTests)
const rawArgs = process.argv.slice(2);
const seen = new Set();
const args = [];
for (const a of rawArgs) {
  if (a.startsWith('--')) {
    if (seen.has(a)) continue;
    seen.add(a);
  }
  args.push(a);
}

// Always run vitest in run mode
const cmdArgs = ['exec', 'vitest', '--run', ...args];
const res = spawnSync('pnpm', cmdArgs, { stdio: 'inherit', shell: false });
process.exit(res.status === null ? 1 : res.status);
