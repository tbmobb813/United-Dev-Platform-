#!/usr/bin/env node

import fs from 'node:fs';

function usage() {
  console.log('Usage: node scripts/evaluate-sprint0-gate.js <responses.csv> [--column="Q3"] [--yes="yes"] [--threshold=0.6]');
}

const args = process.argv.slice(2);
if (args.length === 0) {
  usage();
  process.exit(1);
}

const csvPath = args[0];
let column = 'Q3';
let yesValue = 'yes';
let threshold = 0.6;

for (const arg of args.slice(1)) {
  if (arg.startsWith('--column=')) column = arg.slice('--column='.length);
  if (arg.startsWith('--yes=')) yesValue = arg.slice('--yes='.length).toLowerCase();
  if (arg.startsWith('--threshold=')) threshold = Number(arg.slice('--threshold='.length));
}

if (!fs.existsSync(csvPath)) {
  console.error(`File not found: ${csvPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(csvPath, 'utf8').trim();
if (!raw) {
  console.error('CSV file is empty.');
  process.exit(1);
}

const lines = raw.split(/\r?\n/);
const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim());
const idx = headers.findIndex((h) => h.toLowerCase() === column.toLowerCase());

if (idx === -1) {
  console.error(`Column not found: ${column}`);
  console.error(`Available columns: ${headers.join(', ')}`);
  process.exit(1);
}

let yes = 0;
let no = 0;

for (const row of lines.slice(1)) {
  if (!row.trim()) continue;
  const cols = row.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
  const value = (cols[idx] || '').toLowerCase();
  if (!value) continue;
  if (value === yesValue) yes += 1;
  else no += 1;
}

const total = yes + no;
if (total === 0) {
  console.error(`No usable responses found in column: ${column}`);
  process.exit(1);
}

const ratio = yes / total;
const decision = ratio >= threshold ? 'GO' : 'NO-GO';

console.log('--- Sprint 0 Go/No-Go Evaluation ---');
console.log(`Column: ${column}`);
console.log(`Yes value: ${yesValue}`);
console.log(`Yes: ${yes}`);
console.log(`No/Other: ${no}`);
console.log(`Total: ${total}`);
console.log(`Yes ratio: ${(ratio * 100).toFixed(2)}%`);
console.log(`Threshold: ${(threshold * 100).toFixed(2)}%`);
console.log(`Decision: ${decision}`);

process.exit(0);
