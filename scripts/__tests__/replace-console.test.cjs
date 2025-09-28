const { execSync } = require('child_process');
const path = require('path');

function main() {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const fixture = path.join(repoRoot, 'scripts', '__tests__', 'fixtures', 'sample-with-console.ts');
  const cmd = `node scripts/replace-console-with-logger.cjs --dry-run --files=${fixture}`;
  let out;
  try {
    out = execSync(cmd, { encoding: 'utf8' });
  } catch (err) {
    console.error('Replacement script failed to run', err && err.message);
    process.exit(2);
  }
  if (!out.includes('sample-with-console.ts')) {
    console.error('fixture missing in output');
    console.error(out);
    process.exit(3);
  }
  if (!/console\.log/.test(out)) {
    console.error('expected console.log in output');
    console.error(out);
    process.exit(4);
  }
  console.log('OK');
}

main();
