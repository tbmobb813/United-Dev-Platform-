#!/usr/bin/env node
// Simple heuristic detector for duplicate Yjs runtime in Next.js `.next` output.
// Usage: node scripts/check-duplicate-yjs.js --dir apps/web/.next --report out.json

const fs = require('fs');
const path = require('path');

function findFiles(dir, exts = ['.js', '.map']) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...findFiles(p, exts));
    else if (exts.includes(path.extname(e.name))) out.push(p);
  }
  return out;
}

function scanBundleDir(dir) {
  const files = findFiles(dir, ['.js', '.map']);
  const matches = [];
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    // Search for yjs indicators
    if (
      /\byjs\b/i.test(content) ||
      /\by-protocols\b/i.test(content) ||
      /y-websocket/i.test(content) ||
      /Y\b/.test(content)
    ) {
      matches.push({ file: f, reason: 'contains-yjs-like-identifiers' });
    }
  }
  return matches;
}

function filterAllowlist(matches, allowlist = []) {
  if (!allowlist || allowlist.length === 0) return matches;
  const normalized = allowlist.map((p) => path.resolve(p));
  return matches.filter((m) => !normalized.includes(path.resolve(m.file)));
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function main() {
  const argv = process.argv.slice(2);
  const dirIdx = argv.indexOf('--dir');
  const reportIdx = argv.indexOf('--report');
  const dir = dirIdx >= 0 ? argv[dirIdx + 1] : 'apps/web/.next';
  const report = reportIdx >= 0 ? argv[reportIdx + 1] : null;
  const allowlistIdx = argv.indexOf('--allowlist');
  const allowlist = allowlistIdx >= 0 ? argv[allowlistIdx + 1].split(',') : [];

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(2);
  }

  const matches = scanBundleDir(dir);
  // Heuristic: count distinct chunk files that contain indicators
  const filesWithIndicators = uniq(matches.map(m => m.file));

  let filteredMatches = filterAllowlist(matches, allowlist);
  const filteredFiles = uniq(filteredMatches.map((m) => m.file));

  const result = {
    dir,
    scannedFiles: files.length,
    rawMatches: matches.length,
    matches: filteredMatches,
    flaggedFiles: filteredFiles.length,
    allowlist,
    severity: filteredFiles.length > 1 ? 'error' : filteredFiles.length === 1 ? 'warning' : 'ok',
  };

  if (report) fs.writeFileSync(report, JSON.stringify(result, null, 2));

  console.log(
    `Scanned ${result.scannedFiles} files. Flagged ${result.flaggedFiles} file(s) after allowlist in ${dir}`
  );
  if (report) console.log(`Wrote report to ${report}`);

  if (result.flaggedFiles > 1) {
    console.error('Potential duplicate Yjs runtime detected (more than one flagged chunk).');
    if (report) fs.writeFileSync(report, JSON.stringify(result, null, 2));
    process.exit(3);
  }
  if (result.flaggedFiles === 1) {
    console.warn('Single chunk references Yjs-like identifiers (flagged as warning).');
    if (report) fs.writeFileSync(report, JSON.stringify(result, null, 2));
    process.exit(0);
  }
  if (report) fs.writeFileSync(report, JSON.stringify(result, null, 2));
  process.exit(0);
}

if (require.main === module) main();
