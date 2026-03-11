module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^react-native$': '<rootDir>/../../jest-mocks/react-native-lite.cjs',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:\\.pnpm/)?(?:react-native|@react-native(?:\\+|/)|@react-native-async-storage(?:\\+|/)|@testing-library\\+react-native|@testing-library/react-native|expo(?:$|/|-)|@expo(?:\\+|/)))',
  ],
  moduleFileExtensions: ['ios.js', 'js', 'ts', 'tsx', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  haste: {
    defaultPlatform: 'ios',
    platforms: ['ios', 'android'],
  },
};
