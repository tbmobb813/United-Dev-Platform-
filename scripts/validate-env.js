#!/usr/bin/env node

/**
 * Environment Configuration Validator
 * Validates that all required environment variables are set
 *
 * ESLint disable console statements as this is a CLI utility
 */

/* eslint-disable no-console */

import { config } from 'dotenv';

const requiredVars = {
  development: [
    'NODE_ENV',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_VERSION',
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_WS_URL',
    'NEXT_PUBLIC_API_URL',
  ],
  production: [
    'NODE_ENV',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_VERSION',
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_WS_URL',
    'NEXT_PUBLIC_API_URL',
    'NEXTAUTH_SECRET',
    'DATABASE_URL',
  ],
};

const optionalVars = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'ALLOW_LOCAL_MODELS',
  'LOCAL_OPENAI_BASE_URL',
  'DEBUG',
  'ENABLE_TELEMETRY',
  'ENABLE_ANALYTICS',
];

function validateEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredVars[env] || requiredVars.development;

  console.log(`🔍 Validating ${env} environment configuration...`);

  const missing = [];
  const warnings = [];

  // Check required variables
  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check optional but recommended variables
  optionalVars.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  });

  // Report results
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error(
      '\nPlease set these variables in your .env file or environment.\n'
    );
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Optional environment variables not set:');
    warnings.forEach(varName => console.warn(`   - ${varName}`));
    console.warn('\nConsider setting these for full functionality.\n');
  }

  console.log('✅ Environment validation passed!');

  // Show current configuration (safe values only)
  console.log('\n📋 Current configuration:');
  console.log(`   Environment: ${env}`);
  console.log(`   App Name: ${process.env.NEXT_PUBLIC_APP_NAME}`);
  console.log(`   Version: ${process.env.NEXT_PUBLIC_APP_VERSION}`);
  console.log(`   App URL: ${process.env.NEXT_PUBLIC_APP_URL}`);
  console.log(`   WebSocket URL: ${process.env.NEXT_PUBLIC_WS_URL}`);
  console.log(`   API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
  console.log(
    `   AI Models: ${
      process.env.ALLOW_LOCAL_MODELS === 'true' ? 'Local + API' : 'API only'
    }`
  );
  console.log(
    `   Debug Mode: ${process.env.DEBUG === 'true' ? 'Enabled' : 'Disabled'}`
  );
  console.log('');
}

// Run validation if called directly
import { fileURLToPath } from 'url';

// Normalize check so it works on Windows and Unix-like systems.
// When the script is executed directly (e.g. `node scripts/validate-env.js`),
// process.argv[1] contains the path to the script. Convert import.meta.url to
// a file path and compare the two.
const __filename = fileURLToPath(import.meta.url);

if (__filename === process.argv[1]) {
  // Load generic .env first, then environment-specific file (e.g. .env.development)
  // so values in .env.development override generic .env values when present.
  const env = process.env.NODE_ENV || 'development';
  try {
    config();
  } catch {
    // ignore
  }
  try {
    config({ path: `.env.${env}` });
  } catch {
    // ignore
  }

  validateEnvironment();
}

export { validateEnvironment };
