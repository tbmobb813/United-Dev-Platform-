module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo|@udp/ui-native|yjs|y-websocket|y-monaco|y-protocols|y-indexeddb|node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill|chalk|ora|qrcode-terminal|pino|commander)/',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
