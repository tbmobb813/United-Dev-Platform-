import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { spawnSync } from 'child_process';
import { describe, it, expect, beforeAll } from '@jest/globals';

// Provide __dirname in ESM tests
import logger from '@udp/logger';
describe('duplicate-yjs detector - integration', () => {
  // We'll compute fixtureDir/reportPath at runtime in beforeAll so this test
  // works under both CJS and ESM Jest runtimes (avoid import.meta at top-level).
  let fixtureDir;
  let reportPath;

  beforeAll(() => {
    // Prefer __dirname when available; otherwise fall back to process.cwd().
    // Use `typeof` to avoid ReferenceError in ESM contexts.
    const anchor = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

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
  });

  it('runs detector in report-only mode and writes a JSON report', () => {
    // Resolve detector relative to the repository root via the test file __dirname.
    // Some test runners change process.cwd() when running per-package; using
    // __dirname keeps the path deterministic regardless of cwd.
    const detector = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'scripts',
      'check-duplicate-yjs.cjs'
    );

    const res = spawnSync(
      process.execPath,
      [detector, '--dir', fixtureDir, '--report', reportPath],
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
