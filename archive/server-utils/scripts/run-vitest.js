#!/usr/bin/env node
// Filter out Jest/Turbo flags that Vitest doesn't understand and forward others
import { spawn } from 'child_process';

// Filter arguments to remove Jest-only flags
const args = process.argv.slice(2).filter(a => {
  if (
    a.startsWith('--runInBand') ||
    a.startsWith('--no-cache') ||
    a.startsWith('--testLocationInResults') ||
    a.startsWith('--passWithNoTests') ||
    a === '--debug' ||
    a === '--showConfig'
  ) {
    return false;
  }
  return true;
});

const child = spawn('npx', ['vitest', ...args], { stdio: 'inherit' });
child.on('exit', code => process.exit(code));
child.on('error', _err => {
  // Exit with non-zero if spawning fails
  process.exit(1);
});
