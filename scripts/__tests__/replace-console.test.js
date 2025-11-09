const { execSync } = require('child_process');
const path = require('path');
// Jest provides CommonJS globals (__dirname/__filename) when running tests as CJS.

test('replacement script dry-run detects console.log in fixture', () => {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const fixture = path.join(
    repoRoot,
    'scripts',
    '__tests__',
    'fixtures',
    'sample-with-console.ts'
  );
  // Use absolute path to the script so tests are independent of Jest's cwd
  const scriptPath = path.join(
    repoRoot,
    'scripts',
    'replace-console-with-logger.cjs'
  );
  const cmd = `node ${scriptPath} --dry-run --files=${fixture}`;
  const out = execSync(cmd, { encoding: 'utf8' });
  expect(out).toContain('sample-with-console.ts');
  expect(out).toMatch(/console\.log/);
});
