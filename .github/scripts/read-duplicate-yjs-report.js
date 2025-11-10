#!/usr/bin/env node
/* eslint-disable no-console */
/* Read the duplicate-yjs report JSON and print a short summary line.
   This script is used in CI to avoid shell interpolation/quoting issues
   when building the summary for GitHub action outputs. */

import fs from 'fs';
import path from 'path';

const reportPath = process.env.REPORT_PATH || process.argv[2];
if (!reportPath) {
  console.log('no report generated');
  process.exit(0);
}

try {
  const p = path.resolve(reportPath);
  if (!fs.existsSync(p)) {
    console.log('no report generated');
    process.exit(0);
  }
  const raw = fs.readFileSync(p, 'utf8');
  const r = JSON.parse(raw || '{}');
  const scanned =
    r.scannedFiles !== null && r.scannedFiles !== undefined
      ? r.scannedFiles
      : '0';
  const flagged =
    r.flaggedFiles !== null && r.flaggedFiles !== undefined
      ? r.flaggedFiles
      : '0';
  const severity = r.severity || 'unknown';
  const strict = !!r.strict;
  const s = `scanned:${scanned} flagged:${flagged} severity:${severity} strict:${strict}`;
  console.log(s);
} catch (err) {
  // Fail gracefully - print a simple message for the workflow
  console.log('no report generated');
  // Also log to stderr for debugging
  console.error(
    'error reading report:',
    err && err.stack ? err.stack : String(err)
  );
  process.exit(0);
}
