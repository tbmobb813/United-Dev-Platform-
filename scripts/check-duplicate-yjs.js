#!/usr/bin/env node
/* eslint-disable no-console */
// Simple heuristic detector for duplicate Yjs runtime in Next.js `.next` output.
// Usage: node scripts/check-duplicate-yjs.js --dir apps/web/.next --report out.json

import fs from 'fs';
import path from 'path';
import os from 'os';

let SourceMapConsumer = null;
// try dynamic import of source-map in case it's available (top-level await)
try {
  const sm = await import('source-map');
  SourceMapConsumer = sm.SourceMapConsumer;
} catch (err) {
  SourceMapConsumer = null;
}

function findFiles(dir, exts = ['.js', '.map']) {
  const out = [];
  if (!fs.existsSync(dir)) {
    return out;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...findFiles(p, exts));
    } else if (exts.includes(path.extname(e.name))) {
      out.push(p);
    }
  }
  return out;
}

function indexToLineColumn(content, index) {
  const prefix = content.slice(0, index);
  const lines = prefix.split('\n');
  const line = lines.length; // 1-based
  const column = lines[lines.length - 1].length; // 0-based
  return { line, column };
}

// Scan the generated JS files for yjs-related identifiers and return a
// list of matches with positions and a 'strong' flag if the file clearly
// references yjs artifacts.
function scanBundleDir(dir) {
  const files = findFiles(dir, ['.js']);
  const matches = [];
  const strongIndicators = [/\byjs\b/i, /y-websocket/i, /y-protocols/i];
  const weakIndicators = [/\bY\b/g, /\byjs\b/gi];

  for (const f of files) {
    try {
      const content = fs.readFileSync(f, 'utf8');
      const fileMatches = [];
      let isStrong = false;

      for (const re of strongIndicators) {
        if (re.test(content)) {
          isStrong = true;
          // reset lastIndex in case of global regex reuse
          if (re.global) {
            re.lastIndex = 0;
          }
        }
      }

      for (const re of weakIndicators) {
        let m;
        // ensure global regex has lastIndex reset
        if (re.global) {
          re.lastIndex = 0;
        }
        while ((m = re.exec(content)) !== null) {
          fileMatches.push({ index: m.index, match: m[0] });
          if (m.index === re.lastIndex) {
            re.lastIndex++;
          }
        }
      }

      if (fileMatches.length > 0) {
        matches.push({ file: f, positions: fileMatches, strong: isStrong });
      }
    } catch (e) {
      // ignore unreadable files
    }
  }

  return matches;
}

async function mapMatchesToSources(matches) {
  const mapped = [];

  function resolveSourcePath(rawSource, generatedFile) {
    if (!rawSource) {
      return null;
    }
    if (path.isAbsolute(rawSource) && fs.existsSync(rawSource)) {
      return rawSource;
    }
    if (/^webpack:(?:\/+)?/.test(rawSource)) {
      let s = rawSource.replace(/^webpack:(?:\/+)?/, '');
      if (s.startsWith('./')) {
        s = s.slice(2);
      }
      const tryRoot = path.resolve(process.cwd(), s);
      if (fs.existsSync(tryRoot)) {
        return tryRoot;
      }
      const nmIdx = s.indexOf('node_modules');
      if (nmIdx !== -1) {
        const nmPath = path.resolve(process.cwd(), s.slice(nmIdx));
        if (fs.existsSync(nmPath)) {
          return nmPath;
        }
      }
      const tryRel = path.resolve(path.dirname(generatedFile), s);
      if (fs.existsSync(tryRel)) {
        return tryRel;
      }
    }
    if (/^https?:\/\//i.test(rawSource)) {
      try {
        const u = new URL(rawSource);
        const cand = path.resolve(
          process.cwd(),
          u.pathname.replace(/^\/+/, '')
        );
        if (fs.existsSync(cand)) {
          return cand;
        }
        const base = path.basename(u.pathname);
        const possible = path.resolve(process.cwd(), '.next', base);
        if (fs.existsSync(possible)) {
          return possible;
        }
      } catch (e) {
        /* ignore */
      }
    }
    const relTry = path.resolve(path.dirname(generatedFile), rawSource);
    if (fs.existsSync(relTry)) {
      return relTry;
    }
    const rootTry = path.resolve(process.cwd(), rawSource.replace(/^\/+/, ''));
    if (fs.existsSync(rootTry)) {
      return rootTry;
    }
    const nm = rawSource.indexOf('node_modules');
    if (nm !== -1) {
      const nmPath = path.resolve(process.cwd(), rawSource.slice(nm));
      if (fs.existsSync(nmPath)) {
        return nmPath;
      }
    }
    return null;
  }

  for (const m of matches) {
    const generatedFile = m.file;
    const mapPathCandidates = [
      generatedFile + '.map',
      generatedFile.replace(/\.js$/, '.js.map'),
      generatedFile.replace(/\.js$/, '.map'),
    ];
    let mapPath = mapPathCandidates.find(p => fs.existsSync(p));
    const content = fs.readFileSync(generatedFile, 'utf8');
    let inlineSourceMap = null;
    if (!mapPath) {
      const singleLineMatch = content.match(
        /(?:\/\/|\/\*)#?\s*sourceMappingURL=([^\n\r*]+)/i
      );
      if (singleLineMatch && singleLineMatch[1]) {
        const raw = singleLineMatch[1].trim();
        const dataMatch = raw.match(
          /^data:([^,;]+)(?:;charset=[^;,]+)?;(base64),(.+)$/i
        );
        if (dataMatch) {
          try {
            const b64 = dataMatch[3];
            const decoded = Buffer.from(b64, 'base64').toString('utf8');
            inlineSourceMap = decoded;
          } catch (err) {
            inlineSourceMap = null;
          }
        } else {
          const possible = path.resolve(path.dirname(generatedFile), raw);
          if (fs.existsSync(possible)) {
            mapPath = possible;
          }
        }
      }
    }

    for (const pos of m.positions) {
      const { line, column } = indexToLineColumn(content, pos.index);
      const entry = {
        generatedFile,
        generatedIndex: pos.index,
        generatedMatch: pos.match,
        generatedLine: line,
        generatedColumn: column,
        source: null,
        sourceLine: null,
        sourceColumn: null,
        sourceName: null,
      };

      if ((mapPath || inlineSourceMap) && SourceMapConsumer) {
        try {
          let rawMap;
          if (inlineSourceMap) {
            rawMap = JSON.parse(inlineSourceMap);
          } else {
            rawMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
          }
          const orig = await SourceMapConsumer.with(rawMap, null, consumer =>
            consumer.originalPositionFor({ line, column })
          );
          if (orig && orig.source) {
            entry.source = orig.source;
            entry.sourceLine = orig.line;
            entry.sourceColumn = orig.column;
            entry.sourceName = orig.name || null;
            try {
              const resolved = resolveSourcePath(orig.source, generatedFile);
              if (resolved) {
                entry.resolvedSource = resolved;
              }
            } catch (e) {
              /* ignore */
            }
          }
        } catch (err) {
          entry.mapError = String(err.message || err);
        }
      } else if (!mapPath) {
        entry.mapError = 'no-source-map';
      } else if (!SourceMapConsumer) {
        entry.mapError = 'missing-dependency-source-map';
      }
      mapped.push(entry);
    }
  }
  return mapped;
}

function filterAllowlist(matches, allowlist = []) {
  if (!allowlist || allowlist.length === 0) {
    return matches;
  }
  const normalized = allowlist.map(p => path.resolve(p));
  return matches.filter(
    m => !normalized.includes(path.resolve(m.generatedFile))
  );
}

async function main() {
  const argv = process.argv.slice(2);
  const dirIdx = argv.indexOf('--dir');
  const reportIdx = argv.indexOf('--report');
  const strictIdx = argv.indexOf('--strict');
  const dir = dirIdx >= 0 ? argv[dirIdx + 1] : 'apps/web/.next';
  let report = null;
  if (reportIdx >= 0) {
    const candidate = argv[reportIdx + 1];
    // If --report is passed without a path (or followed by another flag),
    // create a temp report file under /tmp and use that path.
    if (!candidate || candidate.startsWith('--')) {
      const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'duplicate-yjs-'));
      report = path.join(tmpBase, 'out-report.json');
    } else {
      report = candidate;
    }
  }
  const strict = strictIdx >= 0;
  const allowlistIdx = argv.indexOf('--allowlist');
  const allowlist = allowlistIdx >= 0 ? argv[allowlistIdx + 1].split(',') : [];

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(2);
  }

  const allJsFiles = findFiles(dir, ['.js']);
  const scannedFiles = allJsFiles.length;

  const matches = scanBundleDir(dir);
  const mapped = await mapMatchesToSources(matches);

  const normalizedAllowlist = (allowlist || []).map(p => path.resolve(p));
  const allowlistBasenames = normalizedAllowlist.map(p => path.basename(p));
  const filtered = mapped.filter(e => {
    const gen = path.resolve(e.generatedFile);
    const src = e.source ? path.resolve(e.source) : null;
    const rsrc = e.resolvedSource ? path.resolve(e.resolvedSource) : null;
    if (normalizedAllowlist.includes(gen)) {
      return false;
    }
    if (src && normalizedAllowlist.includes(src)) {
      return false;
    }
    if (rsrc && normalizedAllowlist.includes(rsrc)) {
      return false;
    }
    const genBase = path.basename(gen);
    const srcBase = src ? path.basename(src) : null;
    const rsrcBase = rsrc ? path.basename(rsrc) : null;
    if (allowlistBasenames.includes(genBase)) {
      return false;
    }
    if (srcBase && allowlistBasenames.includes(srcBase)) {
      return false;
    }
    if (rsrcBase && allowlistBasenames.includes(rsrcBase)) {
      return false;
    }
    if (
      normalizedAllowlist.some(
        a =>
          gen.endsWith(a) ||
          (src && src.endsWith(a)) ||
          (rsrc && rsrc.endsWith(a))
      )
    ) {
      return false;
    }
    return true;
  });

  let flaggedSet;
  if (strict) {
    const resolved = filtered.map(e => e.resolvedSource).filter(Boolean);
    if (resolved.length > 0) {
      flaggedSet = new Set(resolved);
    } else {
      flaggedSet = new Set(
        filtered.map(e => (e.source ? e.source : e.generatedFile))
      );
    }
  } else {
    flaggedSet = new Set(
      filtered.map(e => (e.source ? e.source : e.generatedFile))
    );
  }

  const result = {
    dir,
    scannedFiles,
    rawMatches: mapped.length,
    matches: filtered,
    flaggedFiles: flaggedSet.size,
    allowlist,
    strict: !!strict,
    severity:
      flaggedSet.size > 1 ? 'error' : flaggedSet.size === 1 ? 'warning' : 'ok',
  };

  if (report) {
    fs.writeFileSync(report, JSON.stringify(result, null, 2));
  }

  console.log(
    `Scanned ${result.scannedFiles} files. Flagged ${result.flaggedFiles} file(s) after allowlist in ${dir}`
  );
  if (report) {
    console.log(`Wrote report to ${report}`);
  }

  if (result.flaggedFiles > 1) {
    console.error(
      'Potential duplicate Yjs runtime detected (more than one flagged chunk/source).'
    );
    if (report) {
      fs.writeFileSync(report, JSON.stringify(result, null, 2));
    }
    if (report) {
      /* no-op */
    } else {
      process.exit(3);
    }
  }
  if (result.flaggedFiles === 1) {
    console.warn(
      'Single chunk/source references Yjs-like identifiers (flagged as warning).'
    );
    if (report) {
      fs.writeFileSync(report, JSON.stringify(result, null, 2));
    }
    process.exit(0);
  }
  if (report) {
    fs.writeFileSync(report, JSON.stringify(result, null, 2));
  }
  process.exit(0);
}

export { main };

const invokedDirectly = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      if (import.meta.url.endsWith('check-duplicate-yjs.js')) {
        return true;
      }
    }
  } catch (err) {
    void err;
  }
  if (typeof process !== 'undefined' && process.argv[1]) {
    return process.argv[1].endsWith('check-duplicate-yjs.js');
  }
  return false;
})();

if (invokedDirectly) {
  main().catch(err => {
    console.error(
      'Detector failure:',
      err && err.stack ? err.stack : String(err)
    );
    process.exit(4);
  });
}
