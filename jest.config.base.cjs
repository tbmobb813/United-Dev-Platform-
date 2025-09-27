/** Shared base Jest config for UDP monorepo */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest'],
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
};
