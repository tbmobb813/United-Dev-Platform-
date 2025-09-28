module.exports = {
  // Basic formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',

  // Language-specific overrides
  overrides: [
    // Markdown files
    {
      files: ['*.md', '*.mdx'],
      options: {
        printWidth: 100,
        proseWrap: 'always',
        singleQuote: false,
      },
    },
    // JSON files
    {
      files: ['*.json', '*.jsonc'],
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
    // YAML files
    {
      files: ['*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
        singleQuote: true,
      },
    },
    // HTML files
    {
      files: ['*.html'],
      options: {
        printWidth: 120,
        htmlWhitespaceSensitivity: 'ignore',
      },
    },
    // CSS/SCSS/Less files
    {
      files: ['*.css', '*.scss', '*.less'],
      options: {
        singleQuote: false,
      },
    },
    // GraphQL files
    {
      files: ['*.graphql', '*.gql'],
      options: {
        printWidth: 100,
      },
    },
    // Package.json files - special formatting
    {
      files: ['package.json'],
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
  ],
};
