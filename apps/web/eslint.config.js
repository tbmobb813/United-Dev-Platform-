import js from '@eslint/js';
import tsplugin from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
// Avoid depending on the 'globals' package during local checks; define a minimal
// set of known globals used across the app to keep the config portable.
const globals = {
  browser: {
    window: true,
    document: true,
    navigator: true,
    localStorage: true,
    sessionStorage: true,
  },
  node: {
    process: true,
    __dirname: true,
    __filename: true,
    module: true,
    require: true,
  },
  es2021: {
    Promise: true,
    Set: true,
    Map: true,
    WeakMap: true,
  },
};

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
  js.configs.recommended,
  tsplugin.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['next-env.d.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/triple-slash-reference': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
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
