#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const fixtureDir = path.resolve(
  __dirname,
  '__tests__',
  'fixtures',
  'duplicate-yjs-fixture'
);
const reportPath = path.resolve(
  __dirname,
  '__tests__',
  'fixtures',
  'out-report.json'
);

if (fs.existsSync(reportPath)) fs.unlinkSync(reportPath);

const detector = path.resolve(
  process.cwd(),
  'scripts',
  'check-duplicate-yjs.cjs'
);

console.log('Running duplicate-yjs detector against fixture:', fixtureDir);
const res = spawnSync(
  process.execPath,
  [detector, '--dir', fixtureDir, '--report', reportPath],
  { encoding: 'utf8' }
);
if (res.error) {
  console.error('Failed to run detector:', res.error);
  process.exit(2);
}
if (res.stdout) console.log(res.stdout);
if (res.stderr) console.error(res.stderr);

if (!fs.existsSync(reportPath)) {
  console.error('Detector did not produce report at', reportPath);
  process.exit(3);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
console.log('Detector report summary:', {
  scannedFiles: report.scannedFiles,
  matches: report.matches.length,
  flaggedFiles: report.flaggedFiles,
  severity: report.severity,
});

if (
  !Array.isArray(report.matches) ||
  report.scannedFiles < 1 ||
  report.flaggedFiles < 1
) {
  console.error(
    'Fixture verification failed: report did not meet expectations'
  );
  process.exit(4);
}

console.log('Fixture detector run OK');
process.exit(0);
