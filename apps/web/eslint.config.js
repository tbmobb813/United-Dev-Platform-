import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

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
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['next-env.d.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
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
