module.exports = {
  preset: 'react-native',
  testEnvironment: 'react-native/jest/react-native-env.js',
  setupFiles: ['<rootDir>/jest.setup.dimensions.js', '<rootDir>/jest.setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.env-setup.ts'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:\\.pnpm/)?(?:react-native|@react-native(?:\\+|/)|@react-native-async-storage(?:\\+|/)|expo(?:$|/|-)|@expo(?:\\+|/)|expo-camera|expo-crypto|expo-linking|expo-secure-store|@testing-library\\+react-native|@testing-library/react-native|@udp\\+ui-native|@udp/ui-native|yjs|y-websocket|y-monaco|y-protocols|y-indexeddb))',
  ],
  moduleNameMapper: {
    '^@rivascva/react-native-code-editor$': '<rootDir>/../../jest-mocks/react-native-code-editor.cjs',
    '^@udp/editor-core$': '<rootDir>/../../jest-mocks/editor-core-mobile.cjs',
    '^yjs$': '<rootDir>/../../jest-mocks/yjs.cjs',
    '^y-websocket$': '<rootDir>/../../jest-mocks/y-websocket.cjs',
    '^.*/app/\\(tabs\\)/collaborate$': '<rootDir>/app/(tabs)/collaborate.tsx',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', 'jest\\.setup\\.[jt]s$'],
  haste: {
    defaultPlatform: 'ios',
    platforms: ['ios', 'android'],
  },
};
