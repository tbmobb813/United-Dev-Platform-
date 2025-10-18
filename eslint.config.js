import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = [
  {
    ignores: [
      'dist/**',
      '.next/**',
      'node_modules/**',
      'apps/*/dist/**',
      'apps/*/.next/**',
      'packages/*/dist/**',
      '.turbo/**',
      'coverage/**',
      '*.tsbuildinfo',
    ],
  },
  ...compat.extends('eslint:recommended'),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',

      // General rules
      // Treat runtime console usage in application/library code as errors so
      // the CI / console-check tooling can enforce replacement with the
      // shared logger. CLI scripts and the logger's browser entrypoint are
      // explicitly exempted via overrides below.
      'no-console': 'error',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Handled by TypeScript
      'prefer-const': 'error',
      'no-var': 'error',

      // React/JSX rules (when applicable)
      'jsx-quotes': ['error', 'prefer-single'],

      // Best practices
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
  },
  // Allow console in CLI scripts and in the logger browser entrypoint which
  // intentionally delegates to the platform console for small bundles.
  {
    files: [
      'scripts/**/*',
      'bin/**/*',
      '**/*.cjs',
      'packages/logger/browser.*',
    ],
    rules: {
      'no-console': 'off',
    },
  },
  // React-specific config for .tsx files
  {
    files: ['**/*.{tsx,jsx}'],
    rules: {
      'react/prop-types': 'off', // Not needed with TypeScript
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
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
