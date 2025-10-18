import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { spawnSync } from 'child_process';
import { describe, it, expect, beforeAll } from '@jest/globals';

import logger from '@udp/logger';
describe('duplicate-yjs detector - integration', () => {
  const fixtureDir = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'scripts',
    '__tests__',
    'fixtures',
    'duplicate-yjs-fixture'
  );
  const reportPath = path.resolve(
    fs.mkdtempSync(path.join(os.tmpdir(), 'duplicate-yjs-')),
    'out-report.json'
  );

  beforeAll(() => {
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }
  });

  it('runs detector in report-only mode and writes a JSON report', () => {
    const detector = path.resolve(
      process.cwd(),
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
    // eslint-disable-next-line no-console
    if (res.stdout) {
      logger.log('detector stdout:', res.stdout);
    }
    // eslint-disable-next-line no-console
    if (res.stderr) {
      logger.log('detector stderr:', res.stderr);
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
