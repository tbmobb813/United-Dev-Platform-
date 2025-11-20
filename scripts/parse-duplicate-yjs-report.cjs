const fs = require('fs');
const p = process.argv[2] || 'duplicate-yjs-report-filtered.json';
const t = fs.readFileSync(p, 'utf8');
const keywords = ['monaco-editor','@monaco-editor/react','yjs','y-protocols','lib0','y-websocket'];
console.log('Keyword counts:');
keywords.forEach(k => {
  const re = new RegExp(k.replace(/[-\\/\\^$*+?.()|[\\]{}]/g, '\\$&'), 'g');
  const m = t.match(re);
  console.log((m ? m.length : 0).toString().padStart(6), ' ', k);
});
console.log('\nUnique resolvedSource paths containing key keywords:');
const uniq = new Set();
t.replace(/"resolvedSource"\s*:\s*"([^"]+)"/g, (s, m) => {
  if (/monaco-editor|yjs|y-protocols|lib0|y-websocket/.test(m)) { uniq.add(m); }
});
[...uniq].slice(0,200).forEach(u => console.log('-', u));
console.log('\nTotal unique matched resolvedSource (all):');
const all = new Set();
t.replace(/"resolvedSource"\s*:\s*"([^"]+)"/g, (s, m) => all.add(m));
console.log(all.size);
