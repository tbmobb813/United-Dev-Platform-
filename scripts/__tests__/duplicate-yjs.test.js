const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

// Run under CommonJS; Jest will provide __dirname/__filename globals.

describe('duplicate-yjs detector - fixture', () => {
  const fixtureDir = path.resolve(
    __dirname,
    'fixtures',
    'duplicate-yjs-fixture'
  );

  it('detects a vendor yjs runtime and application reference', () => {
    // Run the detector script pointing at the fixture directory. Use an
    // absolute path to the script so it runs correctly regardless of Jest cwd.
    const detector = path.resolve(
      path.resolve(__dirname, '..', '..'),
      'scripts',
      'check-duplicate-yjs.cjs'
    );
    // Only pass --report (no path) so detector writes to a temp file and prints the path
    let out = '';
    let errOut = '';
    try {
      out = execFileSync('node', [detector, '--dir', fixtureDir, '--report'], {
        encoding: 'utf8',
        stdio: 'pipe',
      });
    } catch (err) {
      if (err.stdout) out = err.stdout.toString();
      if (err.stderr) errOut = err.stderr.toString();
      if (!out && !errOut) throw err;
    }
    // Find the temp report path from detector output (stdout or stderr)
    const allLines = (out + '\n' + errOut).split('\n');
    const reportLine = allLines.find(l => l.includes('Wrote report to'));
    let reportPath;
    if (reportLine) {
      reportPath = reportLine.split('Wrote report to')[1].trim();
    } else {
      // Debug: print all lines if not found
      // eslint-disable-next-line no-console
      console.error('Detector output lines:', allLines);
      // Fallback: try to find the most recent /tmp/duplicate-yjs-*/out-report.json
      const tmpDir = '/tmp';
      const prefix = 'duplicate-yjs-';
      let candidate = null;
      try {
        const dirs = fs
          .readdirSync(tmpDir)
          .filter(d => d.startsWith(prefix))
          .map(d => path.join(tmpDir, d, 'out-report.json'))
          .filter(f => fs.existsSync(f));
        if (dirs.length > 0) {
          // Use the most recently modified
          dirs.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
          candidate = dirs[0];
        }
      } catch (e) {
        // ignore errors
      }
      if (candidate) {
        reportPath = candidate;
      } else {
        throw new Error(
          'Could not find report path in detector output or /tmp fallback'
        );
      }
    }
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
