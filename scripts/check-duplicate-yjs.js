#!/usr/bin/env node
// Simple heuristic detector for duplicate Yjs runtime in Next.js `.next` output.
// Usage: node scripts/check-duplicate-yjs.js --dir apps/web/.next --report out.json

import fs from 'fs';
import path from 'path';
let SourceMapConsumer = null;
// try dynamic import of source-map in case it's available
try {
  // top-level await is allowed in ESM
  // eslint-disable-next-line no-await-in-loop
  const sm = await import('source-map');
  SourceMapConsumer = sm.SourceMapConsumer;
} catch (err) {
  SourceMapConsumer = null;
}

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
    // Search for yjs indicators and capture match positions.
    // We categorize "strong" Yjs indicators vs weaker ones to avoid
    // vendor false positives (e.g. monaco-editor uses many single-letter
    // identifiers that incidentally match 'Y').
    const weakIndicators = [
      /\byjs\b/gi,
      /\by-protocols\b/gi,
      /y-websocket/gi,
      /\bY\b/g,
    ];
    // Strong indicators look for Yjs runtime usage (constructor, API, imports)
    const strongIndicators = [
      /new\s+Y\.Doc\b/g,
      /Y\.Doc\b/g,
      /Y\.applyUpdate\b/g,
      /import\s+.*from\s+['"]yjs['"]/g,
      /require\(['"]yjs['"]\)/g,
      /\byjs\.encodeStateAsUpdate\b/g,
      /y-protocols/gi,
      /y-websocket/gi,
    ];

    const fileMatches = [];
    // look for weak matches first, capture some context
    for (const re of weakIndicators) {
      let m;
      while ((m = re.exec(content)) !== null) {
        const idx = m.index;
        const before = Math.max(0, idx - 80);
        const after = Math.min(content.length, idx + 120);
        const snippet = content.slice(before, after);
        fileMatches.push({ index: idx, match: m[0], snippet });
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
      }
    }
    // also look for strong matches (may overlap)
    for (const re of strongIndicators) {
      let m;
      while ((m = re.exec(content)) !== null) {
        const idx = m.index;
        const before = Math.max(0, idx - 80);
        const after = Math.min(content.length, idx + 120);
        const snippet = content.slice(before, after);
        fileMatches.push({ index: idx, match: m[0], snippet, strong: true });
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
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
    if (!rawSource) {
      return null;
    }
    // If already an absolute path
    if (path.isAbsolute(rawSource) && fs.existsSync(rawSource)) {
      return rawSource;
    }

    // webpack:///./src/index.tsx or webpack:///src/index.tsx
    if (/^webpack:(?:\/+)?/.test(rawSource)) {
      let s = rawSource.replace(/^webpack:(?:\/+)?/, '');
      // remove leading ./
      if (s.startsWith('./')) {
        s = s.slice(2);
      }
      const tryRoot = path.resolve(process.cwd(), s);
      if (fs.existsSync(tryRoot)) {
        return tryRoot;
      }
      // try node_modules portion
      const nmIdx = s.indexOf('node_modules');
      if (nmIdx !== -1) {
        const nmPath = path.resolve(process.cwd(), s.slice(nmIdx));
        if (fs.existsSync(nmPath)) {
          return nmPath;
        }
      }
      // try relative to generated file
      const tryRel = path.resolve(path.dirname(generatedFile), s);
      if (fs.existsSync(tryRel)) {
        return tryRel;
      }
    }

    // If it looks like a URL, try to map the pathname to a repo path (no network fetch)
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
        // fallback: try basename somewhere under .next (cheap attempt)
        const base = path.basename(u.pathname);
        const possible = path.resolve(process.cwd(), '.next', base);
        if (fs.existsSync(possible)) {
          return possible;
        }
      } catch (e) {
        // ignore URL parse errors
        void e;
      }
    }

    // If relative path-like, resolve relative to generated file
    const relTry = path.resolve(path.dirname(generatedFile), rawSource);
    if (fs.existsSync(relTry)) {
      return relTry;
    }

    // Try relative to project root
    const rootTry = path.resolve(process.cwd(), rawSource.replace(/^\/+/, ''));
    if (fs.existsSync(rootTry)) {
      return rootTry;
    }

    // If it contains node_modules, try to find within node_modules
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
    // If no obvious sidecar map, attempt to parse sourceMappingURL from the generated file
    let inlineSourceMap = null;
    if (!mapPath) {
      // Look for //# sourceMappingURL=... or //@ sourceMappingURL=... or /*# sourceMappingURL=... */
      const singleLineMatch = content.match(
        /(?:\/\/|\/\*)#?\s*sourceMappingURL=([^\n\r*]+)/i
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
        snippet: pos.snippet || null,
        strong: !!pos.strong,
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
          entry.mapError = String(
            err && err.message ? err.message : String(err)
          );
          void err;
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
  // Allowlist entries are treated as substrings to match against paths.
  const entries = allowlist.map(s => String(s).trim()).filter(Boolean);
  return matches.filter(m => {
    const gf = m.generatedFile || '';
    const rs = m.resolvedSource || '';
    const src = m.source || '';
    // If any allowlist token appears in any candidate path, filter it out
    for (const a of entries) {
      if (gf.includes(a) || rs.includes(a) || src.includes(a)) {
        return false;
      }
    }
    return true;
  });
}

// uniq helper removed (was unused)

async function main() {
  const argv = process.argv.slice(2);
  const dirIdx = argv.indexOf('--dir');
  const reportIdx = argv.indexOf('--report');
  const strictIdx = argv.indexOf('--strict');
  const dir = dirIdx >= 0 ? argv[dirIdx + 1] : 'apps/web/.next';
  const report = reportIdx >= 0 ? argv[reportIdx + 1] : null;
  const strict = strictIdx >= 0;
  const allowlistIdx = argv.indexOf('--allowlist');
  const cliAllowlist =
    allowlistIdx >= 0 ? argv[allowlistIdx + 1].split(',') : [];

  // Load repo-level allowlist if present
  const repoAllowlistPath = path.resolve(
    process.cwd(),
    'scripts',
    'duplicate-yjs-allowlist.txt'
  );
  let repoAllowlist = [];
  try {
    if (fs.existsSync(repoAllowlistPath)) {
      repoAllowlist = fs
        .readFileSync(repoAllowlistPath, 'utf8')
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean)
        .filter(l => !l.startsWith('#'));
    }
  } catch (e) {
    repoAllowlist = [];
    void e;
  }
  const allowlist = [...repoAllowlist, ...cliAllowlist];

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(2);
  }

  // Count scanned JS files
  const allJsFiles = findFiles(dir, ['.js']);
  const scannedFiles = allJsFiles.length;

  const matches = scanBundleDir(dir);
  const mapped = await mapMatchesToSources(matches);

  // Apply allowlist (substring matching) and improved heuristics:
  // - If an entry maps back to a resolvedSource that contains 'node_modules',
  //   treat it as vendor and require a strong indicator to keep it.
  // - Non-vendor (no 'node_modules' in resolvedSource) keep both weak and strong.
  let filtered = filterAllowlist(mapped, allowlist);
  filtered = filtered.filter(e => {
    const resolved = e.resolvedSource || '';
    const isVendor = /node_modules/.test(
      resolved + ' ' + (e.generatedFile || '')
    );
    // strong property comes from scanBundleDir when a strong indicator matched
    if (isVendor) {
      // keep only if strong indicator or mapped back to an explicit yjs file
      if (e.strong) {
        return true;
      }
      const lower = (resolved + ' ' + (e.source || '')).toLowerCase();
      if (
        lower.includes('/yjs') ||
        lower.includes('/yjs@') ||
        lower.includes('yjs/dist')
      ) {
        return true;
      }
      return false;
    }
    // non-vendor: keep by default
    return true;
  });

  // Determine unique flagged keys (prefer resolvedSource when available)
  const uniqueKeys = Array.from(
    new Set(filtered.map(e => e.resolvedSource || e.source || e.generatedFile))
  );

  // Identify distinct resolved sources that look like Yjs runtime files. We
  // consider entries that include 'yjs' and either mention '/node_modules',
  // 'dist', or an @version token as Yjs runtime candidates.
  const yjsRuntimeCandidates = new Set();
  for (const k of uniqueKeys) {
    if (!k) {
      continue;
    }
    const lower = k.toLowerCase();
    if (
      lower.includes('yjs/dist') ||
      /node_modules[\\/].*yjs/.test(lower) ||
      /yjs@\d/.test(lower) ||
      (/\byjs\b/.test(lower) && lower.includes('dist'))
    ) {
      yjsRuntimeCandidates.add(k);
    }
  }

  // Build the result object. Severity and exit behavior are adjusted so CI
  // only fails when multiple distinct Yjs runtime files are present. This
  // avoids failing on many generated chunks that merely reference the same
  // hoisted vendor yjs bundle.
  const result = {
    dir,
    scannedFiles,
    rawMatches: mapped.length,
    matches: filtered,
    uniqueKeysCount: uniqueKeys.length,
    yjsRuntimeCandidates: Array.from(yjsRuntimeCandidates),
    allowlist,
    strict: !!strict,
  };

  // Determine severity/exit logic:
  // - If more than one distinct Yjs runtime candidate exists => error
  // - If exactly one Yjs runtime candidate exists => warning (do not fail CI)
  // - Otherwise fall back to counting unique keys: >1 => error, ===1 => warning, 0 => ok
  if (yjsRuntimeCandidates.size > 1) {
    result.flaggedFiles = yjsRuntimeCandidates.size;
    result.severity = 'error';
  } else if (yjsRuntimeCandidates.size === 1) {
    // A single vendor Yjs runtime found; surface as a warning but don't fail
    // when application chunks also contain Y/Yjs literals.
    result.flaggedFiles = 1;
    result.severity = 'warning';
  } else {
    result.flaggedFiles = uniqueKeys.length;
    result.severity =
      uniqueKeys.length > 1
        ? 'error'
        : uniqueKeys.length === 1
          ? 'warning'
          : 'ok';
  }

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
    process.exit(3);
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
