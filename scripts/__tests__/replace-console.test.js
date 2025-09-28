const { execSync } = require('child_process');
const path = require('path');

test('replacement script dry-run detects console.log in fixture', () => {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const fixture = path.join(repoRoot, 'scripts', '__tests__', 'fixtures', 'sample-with-console.ts');
  const cmd = `node scripts/replace-console-with-logger.cjs --dry-run --files=${fixture}`;
  const out = execSync(cmd, { encoding: 'utf8' });
  expect(out).toContain('sample-with-console.ts');
  expect(out).toMatch(/console\.log/);
});
