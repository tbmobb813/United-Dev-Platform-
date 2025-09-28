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

const candidates = glob
  .sync('{apps,packages}/**/*.{ts,tsx,js,jsx,mjs,cjs}', { nodir: true, ignore: ignorePatterns })
  .map(p => path.join(repoRoot, p));

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

  fs.writeFileSync(filePath + '.bak', src, 'utf8');
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
  fs.writeFileSync(filePath, out, 'utf8');
  summary.push({ file: filePath, changed: true, edits: edits.map(e => ({ old: e.oldCallee, new: e.newCallee })) });
}

console.log(JSON.stringify(summary, null, 2));
