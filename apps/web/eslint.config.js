import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    // Ignore build and generated artifacts to avoid linting compiled files
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'next-env.d.ts',
      'next.config.mjs',
      'next.config.*',
      'generated/**',
      'generated/prisma/**',
      'generated/prisma/runtime/**',
      'generated/prisma/**/wasm-*.js',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['next-env.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Disable crashing Next.js rule locally
      '@next/next/no-duplicate-head': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  // Node/config files (jest.config.*, *.cjs) should be linted as Node scripts
  {
    files: ['**/jest.config.*', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      // Allow require-style imports and var requires in config files
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      // Node config files may reference globals like __dirname
      'no-undef': 'off',
    },
  },
];

export default config;
