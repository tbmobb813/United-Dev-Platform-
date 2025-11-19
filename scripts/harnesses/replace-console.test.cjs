#!/usr/bin/env node
// Basic test harness for replacement script (dry-run mode) using fixtures
// This file is the manual-run harness moved out of `__tests__` so Jest
// won't auto-discover and execute the CommonJS-only code path inside
// ESM worker VMs. Keep identical behavior to the original harness.

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const script = path.join(
  repoRoot,
  'scripts',
  'replace-console-with-logger.cjs'
);
const fixturesDir = path.join(repoRoot, 'scripts', '__tests__', 'fixtures');

const glob = require('glob');
const runDry = (filesGlob, outReport) => {
  const matches = glob.sync(filesGlob, { cwd: repoRoot, absolute: true });
  if (!matches || matches.length === 0) {
    console.error('No fixture files found for', filesGlob);
    process.exit(2);
  }
  const filesArg = matches.join(',');
  const cmd = `node ${script} --dry-run --report=${outReport} --files=${filesArg}`;
  try {
    const out = execSync(cmd, { cwd: repoRoot, stdio: 'pipe' }).toString();
    return JSON.parse(out);
  } catch (e) {
    console.error('dry-run failed', e.stdout && e.stdout.toString());
    process.exit(2);
  }
};

const reportPath = path.join(repoRoot, 'artifacts', 'console-test-report.json');
if (!fs.existsSync(path.dirname(reportPath)))
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });

const res = runDry(fixturesDir + '/**/*.ts', reportPath);
console.log('Report entries:', res.length);
let expected = 4;
if (!Array.isArray(res) || res.length < expected) {
  console.error('Expected at least', expected, 'entries - got', res.length);
  process.exit(1);
}

const byFile = res.reduce((acc, r) => {
  acc[r.file] = r;
  return acc;
}, {});
for (const f of fs.readdirSync(fixturesDir)) {
  const full = path.join(fixturesDir, f);
  if (!fs.existsSync(full)) continue;
  const entry = byFile[full];
  if (!entry) {
    console.error('Missing report entry for', full);
    process.exit(1);
  }
}

console.log('All fixtures reported expected results');
process.exit(0);
