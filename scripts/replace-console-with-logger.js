#!/usr/bin/env node
/* eslint-disable no-console */
/*
  Conservative AST-based replacement script.
  - Only examines a curated list of candidate files (not the whole repo)
  - Uses TypeScript parser to find CallExpressions where callee is `console.<method>`
  - Replaces the callee text with `logger.<mappedMethod>` (log/debug -> info)
  - Adds `import logger from '@udp/logger'` if missing
  - Creates a .bak of each modified file
  - Prints a JSON summary to stdout

  Run at repo root: node scripts/replace-console-with-logger.js
*/
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const repoRoot = path.resolve(__dirname, '..');

// Curated candidate files from previous workspace grep/search (source files only)
const candidates = [
  'apps/web/components/CodeCompletionProvider.ts',
  'apps/web/pages/test-ai.client.tsx',
  'apps/web/pages/presence-demo.client.tsx',
  'packages/filesystem/ProjectManager.ts',
  'packages/logger/index.ts',
  'packages/filesystem/FileWatcher.ts'
].map(p => path.join(repoRoot, p));

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
  if (!fs.existsSync(filePath)) continue;
  const src = fs.readFileSync(filePath, 'utf8');
  const calls = findConsoleCalls(src, filePath);
  if (calls.length === 0) {
    summary.push({ file: filePath, changed: false, reason: 'no-console-call-expr-found' });
    continue;
  }

  // We'll perform textual edits from end->start to avoid offset shifting
  let out = src;
  const edits = [];
  for (let i = calls.length - 1; i >= 0; i--) {
    const c = calls[i];
    // find the callee text range inside the call expression
    const sf = ts.createSourceFile(filePath, src, ts.ScriptTarget.Latest, true);
    const node = c.node;
    const expr = node.expression;
    const calleeStart = expr.getStart(sf);
    const calleeEnd = expr.getEnd();
    const oldCallee = src.slice(calleeStart, calleeEnd);
    const newMethod = methodMap[c.propName] || c.propName;
    const newCallee = oldCallee.replace(/^console\./, 'logger.');
    // safety: if replacement would be identical (e.g., logger already present), skip
    if (oldCallee.startsWith('logger.')) continue;
    edits.push({ calleeStart, calleeEnd, oldCallee, newCallee, propName: c.propName });
  }

  if (edits.length === 0) {
    summary.push({ file: filePath, changed: false, reason: 'no-editable-console-calls' });
    continue;
  }

  // Backup
  fs.writeFileSync(filePath + '.bak', src, 'utf8');

  // Apply edits
  for (const e of edits) {
    out = out.slice(0, e.calleeStart) + e.newCallee + out.slice(e.calleeEnd);
  }

  // Add import logger if missing (try after existing imports)
  if (!hasLoggerImport(out)) {
    const importStmt = "import logger from '@udp/logger';\n";
    // insert after the last import or at top
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
