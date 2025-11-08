#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';

async function run() {
  const modPath = path.resolve(process.cwd(), 'dist/errors.js');
  const mod = await import(modPath);
  const { getErrorMessage, isPrismaError } = mod;

  // Test getErrorMessage
  assert.equal(getErrorMessage(new Error('boom')), 'boom');
  assert.equal(getErrorMessage('simple'), 'simple');
  assert.equal(getErrorMessage({ foo: 'bar' }), JSON.stringify({ foo: 'bar' }));

  // Test isPrismaError
  const fake = { code: 'P2002', meta: { target: ['email'] } };
  assert.equal(isPrismaError(fake), true);
  assert.equal(isPrismaError('not an error'), false);
  assert.equal(isPrismaError(null), false);

  console.log('All server-utils runtime checks passed');
}

run().catch((err) => {
  console.error('Runtime checks failed:', err);
  process.exit(1);
});
