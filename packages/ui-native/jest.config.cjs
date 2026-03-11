module.exports = {
  testEnvironment: 'react-native/jest/react-native-env.js',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@testing-library/react-native))',
  ],
  moduleFileExtensions: ['ios.js', 'js', 'ts', 'tsx', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  haste: {
    defaultPlatform: 'ios',
    platforms: ['ios', 'android'],
  },
};
