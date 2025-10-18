#!/usr/bin/env node
// Minimal wrapper so package-local tests can execute the repository-wide
// duplicate-yjs detector script which lives at /scripts/check-duplicate-yjs.cjs
// The wrapper forwards argv and exits with the same status code.
const { spawnSync } = require('child_process');
const path = require('path');

const repoScript = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'scripts',
  'check-duplicate-yjs.cjs'
);

const res = spawnSync(
  process.execPath,
  [repoScript, ...process.argv.slice(2)],
  { stdio: 'inherit' }
);
process.exit(res.status || 0);
