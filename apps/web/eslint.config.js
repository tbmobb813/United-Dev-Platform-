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
];

export default config;
