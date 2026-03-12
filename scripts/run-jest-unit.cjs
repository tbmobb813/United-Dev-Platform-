#!/usr/bin/env node

const { spawn } = require('node:child_process');

const forwardedArgs = process.argv.slice(2).filter((arg) => arg !== '--');
const jestArgs = ['exec', 'jest', '--config', './jest.config.cjs', ...forwardedArgs];

const child = spawn('pnpm', jestArgs, {
  stdio: 'inherit',
  shell: false,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
