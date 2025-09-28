#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const reportPath =
  process.env.REPORT_PATH ||
  path.join('artifacts', 'duplicate-yjs', 'pr-report.json');

function safeReadJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
}

const r = safeReadJson(reportPath);
if (!r) {
  const msg = 'no report';
  console.log(msg);
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `summary<<EOF\n${msg}\nEOF\n`);
  }
  process.exit(0);
}

const summary = `scanned:${r.scannedFiles || 0} flagged:${r.flaggedFiles || 0} severity:${r.severity || 'unknown'} strict:${!!r.strict}`;
console.log(summary);
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `summary<<EOF\n${summary}\nEOF\n`
  );
}
process.exit(0);
