import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@jest/globals';

test('replacement script dry-run detects console.log in fixture', () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
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
