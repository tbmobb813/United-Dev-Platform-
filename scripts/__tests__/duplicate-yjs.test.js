import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { execFileSync } from 'child_process';

const require = createRequire(import.meta.url);

describe('duplicate-yjs detector - fixture', () => {
  const fixtureDir = path.resolve(
    __dirname,
    'fixtures',
    'duplicate-yjs-fixture'
  );
  const reportPath = path.resolve(__dirname, 'fixtures', 'out-report.json');

  beforeAll(() => {
    if (fs.existsSync(reportPath)) fs.unlinkSync(reportPath);
  });

  it('detects a vendor yjs runtime and application reference', () => {
    // Run the detector script pointing at the fixture directory. Use an
    // absolute path to the script so it runs correctly regardless of Jest cwd.
    const detector = path.resolve(
      path.resolve(__dirname, '..', '..'),
      'scripts',
      'check-duplicate-yjs.cjs'
    );
    // Ensure node can import ESM detector even if source-map missing
    const out = execFileSync(
      'node',
      [detector, '--dir', fixtureDir, '--report', reportPath],
      {
        encoding: 'utf8',
        stdio: 'pipe',
      }
    );
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    // We expect at least one flagged entry and a warning or error severity
    expect(report).toBeDefined();
    expect(report.scannedFiles).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(report.matches)).toBe(true);
    // Since our fixture includes a vendor-like file and an app chunk, the detector
    // should identify at least one Yjs runtime candidate or a flagged file.
    expect(report.flaggedFiles).toBeGreaterThanOrEqual(1);
  });
});
