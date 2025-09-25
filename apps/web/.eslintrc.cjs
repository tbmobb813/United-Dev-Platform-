module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    worker: true,
  },
  globals: {
    TextDecoder: 'readonly',
    TextEncoder: 'readonly',
    WebAssembly: 'readonly',
    alert: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    HTMLDivElement: 'readonly',
  HTMLStyleElement: 'readonly',
  HTMLElement: 'readonly',
  },
  extends: ['@udp/eslint-config/react'],
  rules: {
    // allow DOM/worker globals in web app source
    'no-undef': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      env: {
        browser: true,
        worker: true,
      },
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
