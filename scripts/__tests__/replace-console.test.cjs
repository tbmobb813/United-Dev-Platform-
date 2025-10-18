#!/usr/bin/env node
// Basic test harness for replacement script (dry-run mode) using fixtures
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
function runDry(filesGlob, outReport) {
  // expand the glob into concrete absolute paths and join with commas
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
}

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

// ensure that we saw edits or alias issues for each fixture
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
  if (f.includes('direct') && (!entry.edits || entry.edits.length === 0)) {
    console.error('direct fixture should report edits');
    process.exit(1);
  }
  if (f.includes('window') && (!entry.edits || entry.edits.length === 0)) {
    console.error('window fixture should report edits');
    process.exit(1);
  }
  if (
    f.includes('alias') &&
    (!entry.aliasIssues || entry.aliasIssues.length === 0)
  ) {
    console.error('alias fixture should report aliasIssues');
    process.exit(1);
  }
  if (
    f.includes('destructure') &&
    (!entry.aliasIssues || entry.aliasIssues.length === 0)
  ) {
    console.error('destructure fixture should report aliasIssues');
    process.exit(1);
  }
}

console.log('All fixtures reported expected results');
process.exit(0);
