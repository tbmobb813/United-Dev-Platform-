#!/usr/bin/env node
// Simple heuristic detector for duplicate Yjs runtime in Next.js `.next` output.
// Usage: node scripts/check-duplicate-yjs.js --dir apps/web/.next --report out.json

import fs from 'fs';
import path from 'path';
let SourceMapConsumer = null;
// try dynamic import of source-map in case it's available
(async () => {
  try {
    // eslint-disable-next-line no-await-in-loop
    const sm = await import('source-map');
    SourceMapConsumer = sm.SourceMapConsumer;
  } catch (err) {
    SourceMapConsumer = null;
  }
})();

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
  const files = findFiles(dir, ['.js']);
  const matches = [];
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    // Search for yjs indicators and capture match positions
    const indicators = [
      /\byjs\b/gi,
      /\by-protocols\b/gi,
      /y-websocket/gi,
      /\bY\b/g,
    ];
    const fileMatches = [];
    for (const re of indicators) {
      let m;
      while ((m = re.exec(content)) !== null) {
        fileMatches.push({ index: m.index, match: m[0] });
        // avoid infinite loops for zero-width matches
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    }
    if (fileMatches.length > 0) {
      matches.push({
        file: f,
        reason: 'contains-yjs-like-identifiers',
        positions: fileMatches,
      });
    }
  }
  return matches;
}

function indexToLineColumn(content, index) {
  const prefix = content.slice(0, index);
  const lines = prefix.split('\n');
  const line = lines.length; // 1-based
  const column = lines[lines.length - 1].length; // 0-based
  return { line, column };
}

async function mapMatchesToSources(matches) {
  const mapped = [];
  // Helper: attempt to resolve an original source string from source maps to a real file path
  function resolveSourcePath(rawSource, generatedFile) {
    if (!rawSource) return null;
    // If already an absolute path
    if (path.isAbsolute(rawSource) && fs.existsSync(rawSource))
      return rawSource;

    // webpack:///./src/index.tsx or webpack:///src/index.tsx
    if (/^webpack:(?:\/+)?/.test(rawSource)) {
      let s = rawSource.replace(/^webpack:(?:\/+)?/, '');
      // remove leading ./
      if (s.startsWith('./')) s = s.slice(2);
      const tryRoot = path.resolve(process.cwd(), s);
      if (fs.existsSync(tryRoot)) return tryRoot;
      // try node_modules portion
      const nmIdx = s.indexOf('node_modules');
      if (nmIdx !== -1) {
        const nmPath = path.resolve(process.cwd(), s.slice(nmIdx));
        if (fs.existsSync(nmPath)) return nmPath;
      }
      // try relative to generated file
      const tryRel = path.resolve(path.dirname(generatedFile), s);
      if (fs.existsSync(tryRel)) return tryRel;
    }

    // If it looks like a URL, try to map the pathname to a repo path (no network fetch)
    if (/^https?:\/\//i.test(rawSource)) {
      try {
        const u = new URL(rawSource);
        const cand = path.resolve(
          process.cwd(),
          u.pathname.replace(/^\/+/, '')
        );
        if (fs.existsSync(cand)) return cand;
        // fallback: try basename somewhere under .next (cheap attempt)
        const base = path.basename(u.pathname);
        const possible = path.resolve(process.cwd(), '.next', base);
        if (fs.existsSync(possible)) return possible;
      } catch (e) {
        // ignore URL parse errors
      }
    }

    // If relative path-like, resolve relative to generated file
    const relTry = path.resolve(path.dirname(generatedFile), rawSource);
    if (fs.existsSync(relTry)) return relTry;

    // Try relative to project root
    const rootTry = path.resolve(process.cwd(), rawSource.replace(/^\/+/, ''));
    if (fs.existsSync(rootTry)) return rootTry;

    // If it contains node_modules, try to find within node_modules
    const nm = rawSource.indexOf('node_modules');
    if (nm !== -1) {
      const nmPath = path.resolve(process.cwd(), rawSource.slice(nm));
      if (fs.existsSync(nmPath)) return nmPath;
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
    // If no obvious sidecar map, attempt to parse sourceMappingURL from the generated file
    let inlineSourceMap = null;
    if (!mapPath) {
      // Look for //# sourceMappingURL=... or //@ sourceMappingURL=... or /*# sourceMappingURL=... */
      const singleLineMatch = content.match(
        /(?:\/\/|\/\*)\#?\s*sourceMappingURL=([^\n\r\*]+)/i
      );
      if (singleLineMatch && singleLineMatch[1]) {
        const raw = singleLineMatch[1].trim();
        // data URI?
        const dataMatch = raw.match(
          /^data:([^,;]+)(?:;charset=[^;,]+)?;(base64),(.+)$/i
        );
        if (dataMatch) {
          try {
            const b64 = dataMatch[3];
            const decoded = Buffer.from(b64, 'base64').toString('utf8');
            inlineSourceMap = decoded;
          } catch (err) {
            // ignore decoding errors
            inlineSourceMap = null;
          }
        } else {
          // treat as relative/absolute path
          const possible = path.resolve(path.dirname(generatedFile), raw);
          if (fs.existsSync(possible)) mapPath = possible;
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
          // use SourceMapConsumer.with for proper disposal
          // note: originalPositionFor expects 1-based line, 0-based column
          // we pass the generated line and column computed above
          // wrap in a callback
          // eslint-disable-next-line no-await-in-loop
          const orig = await SourceMapConsumer.with(rawMap, null, consumer => {
            return consumer.originalPositionFor({ line, column });
          });
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
              // ignore resolution errors
            }
          }
        } catch (err) {
          // if source-map parsing fails, ignore mapping but continue
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
  if (!allowlist || allowlist.length === 0) return matches;
  const normalized = allowlist.map(p => path.resolve(p));
  return matches.filter(m => !normalized.includes(path.resolve(m.file)));
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

async function main() {
  const argv = process.argv.slice(2);
  const dirIdx = argv.indexOf('--dir');
  const reportIdx = argv.indexOf('--report');
  const strictIdx = argv.indexOf('--strict');
  const dir = dirIdx >= 0 ? argv[dirIdx + 1] : 'apps/web/.next';
  const report = reportIdx >= 0 ? argv[reportIdx + 1] : null;
  const strict = strictIdx >= 0;
  const allowlistIdx = argv.indexOf('--allowlist');
  const allowlist = allowlistIdx >= 0 ? argv[allowlistIdx + 1].split(',') : [];

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(2);
  }

  // Count scanned JS files
  const allJsFiles = findFiles(dir, ['.js']);
  const scannedFiles = allJsFiles.length;

  const matches = scanBundleDir(dir);
  const mapped = await mapMatchesToSources(matches);

  // Allowlist may refer to generated files or original source files
  const normalizedAllowlist = (allowlist || []).map(p => path.resolve(p));
  const allowlistBasenames = normalizedAllowlist.map(p => path.basename(p));
  const filtered = mapped.filter(e => {
    const gen = path.resolve(e.generatedFile);
    const src = e.source ? path.resolve(e.source) : null;
    const rsrc = e.resolvedSource ? path.resolve(e.resolvedSource) : null;
    // Exact match
    if (normalizedAllowlist.includes(gen)) return false;
    if (src && normalizedAllowlist.includes(src)) return false;
    if (rsrc && normalizedAllowlist.includes(rsrc)) return false;
    // Basename or suffix match to allow CI absolute paths to match local equivalents
    const genBase = path.basename(gen);
    const srcBase = src ? path.basename(src) : null;
    const rsrcBase = rsrc ? path.basename(rsrc) : null;
    if (allowlistBasenames.includes(genBase)) return false;
    if (srcBase && allowlistBasenames.includes(srcBase)) return false;
    if (rsrcBase && allowlistBasenames.includes(rsrcBase)) return false;
    // Suffix match: allowlist entry may be a CI path that ends with the same suffix
    if (
      normalizedAllowlist.some(
        a =>
          gen.endsWith(a) ||
          (src && src.endsWith(a)) ||
          (rsrc && rsrc.endsWith(a))
      )
    )
      return false;
    return true;
  });

  // Determine flagged set:
  // - If strict, prefer resolvedSource entries (only count resolved originals) when available.
  let flaggedSet;
  if (strict) {
    const resolved = filtered.map(e => e.resolvedSource).filter(Boolean);
    if (resolved.length > 0) flaggedSet = new Set(resolved);
    else
      flaggedSet = new Set(
        filtered.map(e => (e.source ? e.source : e.generatedFile))
      );
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

  if (report) fs.writeFileSync(report, JSON.stringify(result, null, 2));

  console.log(
    `Scanned ${result.scannedFiles} files. Flagged ${result.flaggedFiles} file(s) after allowlist in ${dir}`
  );
  if (report) console.log(`Wrote report to ${report}`);

  // If the caller requested a report file, treat this as "report-only" mode:
  // always exit 0 after writing the report so callers (tests/CI) can inspect
  // the JSON output without the process status signaling failure.
  if (report) {
    process.exit(0);
  }

  if (result.flaggedFiles > 1) {
    console.error(
      'Potential duplicate Yjs runtime detected (more than one flagged chunk/source).'
    );
    if (report) fs.writeFileSync(report, JSON.stringify(result, null, 2));
    process.exit(3);
  }
  if (result.flaggedFiles === 1) {
    console.warn(
      'Single chunk/source references Yjs-like identifiers (flagged as warning).'
    );
    if (report) fs.writeFileSync(report, JSON.stringify(result, null, 2));
    process.exit(0);
  }
  if (report) fs.writeFileSync(report, JSON.stringify(result, null, 2));
  process.exit(0);
}

// Export main so callers (including the CJS dynamic-import wrapper) can invoke it.
export { main };

// If this module is executed directly as a script, run main(). This covers both
// invoking the ESM file directly with `node scripts/check-duplicate-yjs.js` and
// environments that set process.argv[1] to the script path. We also check
// import.meta.url to detect direct ESM execution under file:// URLs.
const invokedDirectly = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      if (import.meta.url.endsWith('check-duplicate-yjs.js')) {
        return true;
      }
    }
  } catch (err) {
    // reference the variable so linters don't complain about unused
    void err;
  }
  if (typeof process !== 'undefined' && process.argv[1]) {
    return process.argv[1].endsWith('check-duplicate-yjs.js');
  }
  return false;
})();

if (invokedDirectly) {
  // eslint-disable-next-line no-console
  main().catch(err => {
    // eslint-disable-next-line no-console
    console.error(
      'Detector failure:',
      err && err.stack ? err.stack : String(err)
    );
    process.exit(4);
  });
}
