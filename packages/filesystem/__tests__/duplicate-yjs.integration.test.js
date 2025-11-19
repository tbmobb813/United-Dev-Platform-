import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { describe, it, expect, beforeAll } from '@jest/globals';

// Provide __dirname in ESM tests
import logger from '@udp/logger';
describe('duplicate-yjs detector - integration', () => {
  // We'll compute fixtureDir/reportPath/detectorPath at runtime in beforeAll so
  // this test works under both CJS and ESM Jest runtimes (avoid import.meta at top-level).
  let fixtureDir;
  let reportPath;
  let detectorPath;

  beforeAll(() => {
    // Prefer __dirname when available; otherwise derive from import.meta.url or fall back to process.cwd().
    // This makes the test robust when Jest runs tests from package root or under ESM.
    const anchor =
      typeof __dirname !== 'undefined'
        ? __dirname
        : typeof import.meta !== 'undefined'
        ? path.dirname(fileURLToPath(import.meta.url))
        : process.cwd();

    fixtureDir = path.resolve(
      anchor,
      '..',
      '..',
      '..',
      'scripts',
      '__tests__',
      'fixtures',
      'duplicate-yjs-fixture'
    );

    reportPath = path.resolve(
      fs.mkdtempSync(path.join(os.tmpdir(), 'duplicate-yjs-')),
      'out-report.json'
    );

    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }
    // Resolve detector here using the same anchor so this file works under ESM/CJS
    detectorPath = path.resolve(
      anchor,
      '..',
      '..',
      '..',
      'scripts',
      'check-duplicate-yjs.cjs'
    );
  });

  it('runs detector in report-only mode and writes a JSON report', () => {
    const res = spawnSync(
      process.execPath,
      [detectorPath, '--dir', fixtureDir, '--report', reportPath],
      {
        encoding: 'utf8',
        timeout: 60_000,
        maxBuffer: 10 * 1024 * 1024,
      }
    );

    // Surface stdout/stderr to help debug CI flakes
    if (res.stdout) {
      logger.info('detector stdout:', res.stdout);
    }
    if (res.stderr) {
      logger.info('detector stderr:', res.stderr);
    }

    if (res.error) {
      throw res.error;
    }

    expect(res.status === 0).toBe(true);

    // Ensure report was written
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    expect(report).toBeDefined();
    expect(typeof report.scannedFiles).toBe('number');
    expect(Array.isArray(report.matches)).toBe(true);
    expect(report.flaggedFiles).toBeGreaterThanOrEqual(0);
  });
});
