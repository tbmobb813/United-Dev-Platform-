/* global jest */
/* eslint-disable @typescript-eslint/no-var-requires */
// Mock TurboModuleRegistry to provide PlatformConstants TurboModule
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const uiManager = {
    getConstants: () => ({}),
    getConstantsForViewManager: () => ({}),
    createView: () => {},
    updateView: () => {},
    dispatchViewManagerCommand: () => {},
    measure: () => {},
    measureInWindow: () => {},
    measureLayout: () => {},
    setChildren: () => {},
    manageChildren: () => {},
    setJSResponder: () => {},
    clearJSResponder: () => {},
    configureNextLayoutAnimation: () => {},
    removeSubviewsFromContainerWithID: () => {},
  };
  const platformConstants = {
    forceTouchAvailable: false,
    osVersion: 'test',
    interfaceIdiom: 'phone',
    isTesting: true,
    reactNativeVersion: { major: 0, minor: 74, patch: 0 },
    getConstants() {
      return {
        forceTouchAvailable: false,
        osVersion: 'test',
        interfaceIdiom: 'phone',
        isTesting: true,
        reactNativeVersion: { major: 0, minor: 74, patch: 0 },
      };
    },
  };
  return {
    getEnforcing: (name) => {
      if (name === 'UIManager') {return uiManager;}
      if (name === 'PlatformConstants') {return platformConstants;}
      if (name === 'SourceCode') {
        return {
          getConstants: () => ({
            scriptURL: 'http://localhost/index.bundle?platform=ios',
          }),
        };
      }
      return null;
    },
    get: (name) => {
      if (name === 'UIManager') {return uiManager;}
      if (name === 'PlatformConstants') {return platformConstants;}
      if (name === 'SourceCode') {
        return {
          getConstants: () => ({
            scriptURL: 'http://localhost/index.bundle?platform=ios',
          }),
        };
      }
      return null;
    },
  };
});
// Mock TurboModuleRegistry.getEnforcing for PlatformConstants
try {
  const TurboModuleRegistry = require('react-native/Libraries/TurboModule/TurboModuleRegistry');
  if (TurboModuleRegistry && typeof TurboModuleRegistry.getEnforcing === 'function') {
    jest.spyOn(TurboModuleRegistry, 'getEnforcing').mockImplementation((name) => {
      if (name === 'UIManager') {
        return {
          getConstants: () => ({}),
          getConstantsForViewManager: () => ({}),
          createView: () => {},
          updateView: () => {},
          dispatchViewManagerCommand: () => {},
          measure: () => {},
          measureInWindow: () => {},
          measureLayout: () => {},
          setChildren: () => {},
          manageChildren: () => {},
          setJSResponder: () => {},
          clearJSResponder: () => {},
          configureNextLayoutAnimation: () => {},
          removeSubviewsFromContainerWithID: () => {},
        };
      }
      if (name === 'PlatformConstants') {
        return {
          forceTouchAvailable: false,
          osVersion: 'test',
          interfaceIdiom: 'phone',
          isTesting: true,
          reactNativeVersion: { major: 0, minor: 74, patch: 0 },
          getConstants: () => ({
            forceTouchAvailable: false,
            osVersion: 'test',
            interfaceIdiom: 'phone',
            isTesting: true,
            reactNativeVersion: { major: 0, minor: 74, patch: 0 },
          }),
        };
      }
      if (name === 'SourceCode') {
        return {
          getConstants: () => ({
            scriptURL: 'http://localhost/index.bundle?platform=ios',
          }),
        };
      }
      return null;
    });
  }
} catch {
  // ignore if TurboModuleRegistry is not available
}
// Mock React Native bridge config
if (!global.__fbBatchedBridgeConfig) {
  global.__fbBatchedBridgeConfig = {};
}
// Global Jest setup for React Native/Expo

// Provide React Native global __DEV__
global.__DEV__ = false;


// Mock AsyncStorage if used
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// Mock expo-modules-core if used
jest.mock('expo-modules-core', () => ({
  NativeModulesProxy: {},
  requireNativeViewManager: jest.fn(),
}));

// Polyfill requestAnimationFrame
if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
}

// Polyfill crypto if needed
if (!global.crypto) {
  global.crypto = { getRandomValues: (arr) => require('crypto').randomFillSync(arr) };
}

// Add more global mocks as needed
