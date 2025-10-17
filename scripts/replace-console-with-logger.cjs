#!/usr/bin/env node
/* eslint-disable no-console */
/*
  Conservative AST-based replacement script (CommonJS).
*/
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const repoRoot = path.resolve(__dirname, '..');

// Build candidate list by globbing apps/ and packages/ but exclude build artifacts, node_modules, docs, and the logger package itself.
const glob = require('glob');
const ignorePatterns = [
  '**/.next/**',
  '**/dist/**',
  '**/node_modules/**',
  '**/*.map',
  '**/*.d.ts',
  '**/*.md',
  '**/docs/**',
  'packages/logger/**',
  'apps/**/generated/**',
];

// allow an explicit --files=absPath1,relPath2,... for testing/targeted runs
const filesArg = args.find(a => a.startsWith('--files='));
let candidates;
if (filesArg) {
  const raw = filesArg.split('=')[1];
  candidates = raw.split(',').map(p => {
    if (path.isAbsolute(p)) return p;
    return path.join(repoRoot, p);
  });
} else {
  candidates = glob
    .sync('{apps,packages}/**/*.{ts,tsx,js,jsx,mjs,cjs}', { nodir: true, ignore: ignorePatterns })
    .map(p => path.join(repoRoot, p));
}

const methodMap = { log: 'info', warn: 'warn', error: 'error', info: 'info', debug: 'info' };

function findConsoleCalls(sourceText, filePath) {
  const sf = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
  const calls = [];
  function visit(node) {
    if (ts.isCallExpression(node)) {
      const expr = node.expression;
      if (ts.isPropertyAccessExpression(expr)) {
        const objText = expr.expression.getText(sf);
        const propName = expr.name.getText(sf);
        if (objText === 'console' && Object.keys(methodMap).includes(propName)) {
          const start = node.getStart(sf);
          const end = node.getEnd();
          calls.push({ node, start, end, propName });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return calls;
}

function hasLoggerImport(text) {
  return /from\s+['"]@udp\/logger['"]/.test(text) || /require\(\s*['"]@udp\/logger['"]\s*\)/.test(text);
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || !args.includes('--apply');
const reportArg = args.find(a => a.startsWith('--report='));
const reportPath = reportArg ? reportArg.split('=')[1] : null;
const summary = [];

for (const filePath of candidates) {
  if (!fs.existsSync(filePath)) {
    summary.push({ file: filePath, changed: false, reason: 'not-found' });
    continue;
  }
  const src = fs.readFileSync(filePath, 'utf8');

  // Skip CLI scripts (shebang) and files in scripts/ or bin/
  if (src.startsWith('#!') || /(^|\/)scripts\//.test(filePath) || /(^|\/)bin\//.test(filePath)) {
    summary.push({ file: filePath, changed: false, reason: 'skipped-cli-or-shebang' });
    continue;
  }

  const calls = findConsoleCalls(src, filePath);
  if (calls.length === 0) {
    summary.push({ file: filePath, changed: false, reason: 'no-console-call-expr-found' });
    continue;
  }

  let out = src;
  const edits = [];
  // Apply from end to start
  for (let i = calls.length - 1; i >= 0; i--) {
    const c = calls[i];
    const sf = ts.createSourceFile(filePath, src, ts.ScriptTarget.Latest, true);
    const expr = c.node.expression;
    const calleeStart = expr.getStart(sf);
    const calleeEnd = expr.getEnd();
    const oldCallee = src.slice(calleeStart, calleeEnd);
    const newCallee = oldCallee.replace(/^console\./, 'logger.');
    if (oldCallee.startsWith('logger.')) continue;
    edits.push({ calleeStart, calleeEnd, oldCallee, newCallee, propName: c.propName });
  }

  if (edits.length === 0) {
    summary.push({ file: filePath, changed: false, reason: 'no-editable-console-calls' });
    continue;
  }

  // Build the modified content (do not write until we decide)
  for (const e of edits) {
    out = out.slice(0, e.calleeStart) + e.newCallee + out.slice(e.calleeEnd);
  }
  if (!hasLoggerImport(out)) {
    const importStmt = "import logger from '@udp/logger';\n";
    const importRegex = /^(import\s.+;\s*\n)/gm;
    let lastImportMatch;
    let m;
    while ((m = importRegex.exec(out)) !== null) { lastImportMatch = m; }
    if (lastImportMatch) {
      const insertPos = lastImportMatch.index + lastImportMatch[0].length;
      out = out.slice(0, insertPos) + importStmt + out.slice(insertPos);
    } else {
      out = importStmt + out;
    }
  }

  if (dryRun) {
    // Do not write files; report what would change
    summary.push({ file: filePath, changed: false, reason: 'dry-run', edits: edits.map(e => ({ old: e.oldCallee, new: e.newCallee })) });
  } else {
    // Safe apply: backup then write
    fs.writeFileSync(filePath + '.bak', src, 'utf8');
    fs.writeFileSync(filePath, out, 'utf8');
    summary.push({ file: filePath, changed: true, edits: edits.map(e => ({ old: e.oldCallee, new: e.newCallee })) });
  }
}

const outJson = JSON.stringify(summary, null, 2);
console.log(outJson);
if (reportPath) {
  try {
    fs.mkdirSync(require('path').dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, outJson, 'utf8');
  } catch (err) {
    console.error('Failed to write report to', reportPath, err && err.message);
  }
}
