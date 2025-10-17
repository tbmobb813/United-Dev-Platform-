/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);
const root = process.cwd();

function safeJSONParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function compactLine(pkgPath, version, resolved) {
  return `${pkgPath} | version=${version || 'n/a'} | resolved=${resolved || 'n/a'}`;
}

console.log('prisma diagnostic (compact) - workspace root:', root);

// root-level quick checks
try {
  const p = require('prisma/package.json');
  console.log(`root prisma: ${p.version}`);
} catch {
  console.log('root prisma: not found');
}
try {
  const c = require('@prisma/client/package.json');
  console.log(`root @prisma/client: ${c.version}`);
} catch {
  console.log('root @prisma/client: not found');
}

// Parse pnpm workspace resolutions
try {
  const out = execSync('pnpm -w -r --json ls @prisma/client prisma', {
    encoding: 'utf8',
  });
  const lines = out.split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    const obj = safeJSONParse(line);
    if (obj && obj.path) {
      console.log(`pnpm: workspace=${obj.name} path=${obj.path}`);
    }
  }
} catch {
  console.log('pnpm ls: unavailable or failed (ignored)');
}

// Inspect workspace packages/apps and emit compact lines
const workspaceDirs = ['packages', 'apps'];
for (const wd of workspaceDirs) {
  const dir = path.join(root, wd);
  if (!fs.existsSync(dir)) {
    continue;
  }
  const children = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  for (const child of children) {
    const pkgPath = path.join(dir, child);
    let resolved = null;
    let version = null;
    try {
      resolved = require.resolve('@prisma/client', { paths: [pkgPath] });
      // find nearest package.json for @prisma/client
      let d = path.dirname(resolved);
      for (let i = 0; i < 12; i++) {
        const cand = path.join(d, 'package.json');
        if (fs.existsSync(cand)) {
          try {
            version = JSON.parse(fs.readFileSync(cand, 'utf8')).version;
          } catch {
            version = null;
          }
          break;
        }
        const parent = path.dirname(d);
        if (parent === d) {
          break;
        }
        d = parent;
      }
    } catch {
      // not installed for this package
    }

    console.log(compactLine(pkgPath, version, resolved));

    // generated prisma presence
    const gen = path.join(pkgPath, 'generated', 'prisma');
    if (fs.existsSync(gen)) {
      const files = fs.readdirSync(gen).slice(0, 10);
      console.log(
        `  generated: yes (files=${files.length}) ${files.join(', ')}`
      );
    }
  }
}

// Heuristic scan of root .pnpm for all @prisma/client package.jsons
try {
  const rootNm = path.join(root, 'node_modules');
  if (fs.existsSync(rootNm)) {
    const pnpmDirs = fs.readdirSync(rootNm).filter(n => n.startsWith('.pnpm'));
    for (const pd of pnpmDirs) {
      const pdir = path.join(rootNm, pd);
      try {
        const subs = fs.readdirSync(pdir);
        for (const s of subs) {
          if (s.includes('@prisma+client')) {
            const candidate = path.join(
              pdir,
              s,
              'node_modules',
              '@prisma',
              'client',
              'package.json'
            );
            if (fs.existsSync(candidate)) {
              try {
                const pj = JSON.parse(fs.readFileSync(candidate, 'utf8'));
                console.log(`root-pnpm: ${candidate} -> ${pj.version}`);
              } catch {
                // ignore
              }
            }
          }
        }
      } catch {
        // ignore
      }
    }
  }
} catch {
  // ignore
}

console.log('prisma diagnostic complete (compact)');

process.exit(0);
