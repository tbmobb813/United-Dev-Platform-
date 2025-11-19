#!/usr/bin/env node
// When discovered by Jest's ESM worker env this CommonJS script may throw
// due to missing globals (require). Make it a harmless no-op for the test
// runner so package-level test orchestrators don't fail.
if (process.env.JEST_WORKER_ID) {
  module.exports = {};
} else {
  const fs = require('fs');
  const path = require('path');

  const repoRoot = path.resolve(__dirname, '..', '..');
  const reportPath = path.join(
    repoRoot,
    'artifacts',
    'console-replace-report.json'
  );

  if (!fs.existsSync(reportPath)) {
    console.error('No console replace report found at', reportPath);
    process.exit(2);
  }

  const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const hasEdits = data.some(e => Array.isArray(e.edits) && e.edits.length > 0);
  if (hasEdits) {
    console.error(
      'console-replace-report contains edits. Run the replacement tool in apply mode or fix files manually.'
    );
    process.exit(1);
  }

  console.log('No edits detected in console-replace-report.json');
  process.exit(0);

}
