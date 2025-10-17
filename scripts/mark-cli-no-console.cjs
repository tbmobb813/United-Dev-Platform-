#!/usr/bin/env node
// Scan scripts/ and bin/ for files that use console and prepend an ESLint disable
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ts = require('typescript');

const repoRoot = path.resolve(__dirname, '..');

const patterns = [
  'scripts/**/*.{js,ts,cjs,mjs,jsx,tsx}',
  'bin/**/*.{js,ts,cjs,mjs}',
];
const ignore = ['**/node_modules/**', '**/.next/**', '**/dist/**'];

function fileUsesConsole(sourceText, filePath) {
  try {
    const sf = ts.createSourceFile(
      filePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );
    let found = false;
    function visit(node) {
      if (ts.isCallExpression(node)) {
        const expr = node.expression;
        if (ts.isPropertyAccessExpression(expr)) {
          const obj = expr.expression.getText(sf);
          if (obj === 'console') {
            found = true;
            return;
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    return found;
  } catch (e) {
    // Fall back to regex
    return /console\.[a-zA-Z0-9_]+\s*\(/.test(sourceText);
  }
}

const files = patterns
  .flatMap(p => glob.sync(p, { cwd: repoRoot, nodir: true, ignore }))
  .map(p => path.join(repoRoot, p));
const edits = [];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  const src = fs.readFileSync(filePath, 'utf8');
  // skip if already has eslint-disable no-console
  if (/eslint-disable\s+no-console/.test(src)) continue;
  // detect shebang or in scripts/bin
  const isCli =
    src.startsWith('#!') ||
    /(^|\/)scripts\//.test(filePath) ||
    /(^|\/)bin\//.test(filePath);
  if (!isCli) continue;
  if (!fileUsesConsole(src, filePath)) continue;
  // prepend disable comment (preserve shebang if present)
  let out;
  if (src.startsWith('#!')) {
    const firstLineEnd = src.indexOf('\n');
    if (firstLineEnd === -1) {
      out = src + '\n/* eslint-disable no-console */\n';
    } else {
      out =
        src.slice(0, firstLineEnd + 1) +
        '/* eslint-disable no-console */\n' +
        src.slice(firstLineEnd + 1);
    }
  } else {
    out = '/* eslint-disable no-console */\n' + src;
  }
  fs.writeFileSync(filePath + '.bak', src, 'utf8');
  fs.writeFileSync(filePath, out, 'utf8');
  edits.push(filePath);
}

console.log(JSON.stringify({ marked: edits.length, files: edits }, null, 2));
