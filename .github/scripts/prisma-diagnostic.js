/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

try {
  const prismaPkg = require('prisma/package.json');
  console.log('prisma:', prismaPkg.version);
} catch (e) {
  console.log('prisma: not found -', e.message);
}

try {
  const clientPkg = require('@prisma/client/package.json');
  console.log('@prisma/client:', clientPkg.version);
} catch (e) {
  console.log('@prisma/client: not found -', e.message);
}

try {
  const p = require.resolve('@prisma/client');
  console.log('@prisma/client resolved:', p);
  const dir = path.dirname(p);
  console.log('dir listing:\n' + fs.readdirSync(dir).join('\n'));
} catch (e) {
  console.log('resolve failed:', e.message);
}

// Exit 0 to make this diagnostic step non-fatal
process.exit(0);
