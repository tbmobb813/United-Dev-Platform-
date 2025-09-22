module.exports = {
  // Printing
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,

  // Syntax
  semi: true,
  singleQuote: false,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // Language-specific overrides
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
        singleQuote: true,
      },
    },
  ],
};
