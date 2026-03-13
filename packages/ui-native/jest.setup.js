'use strict';

// Resolve react-native's jest setup using absolute path to avoid pnpm virtual store issues
const path = require('path');
const rnDir = path.dirname(require.resolve('react-native/package.json'));

const MockNativeMethods = jest.requireActual(
  path.join(rnDir, 'jest/MockNativeMethods')
);
const mockComponent = jest.requireActual(
  path.join(rnDir, 'jest/mockComponent')
);

Object.defineProperties(global, {
  __fbBatchedBridgeConfig: {
    configurable: true,
    enumerable: true,
    value: { remoteModuleConfig: [] },
    writable: true,
  },
  __DEV__: {
    configurable: true,
    enumerable: true,
    value: true,
    writable: true,
  },
  cancelAnimationFrame: {
    configurable: true,
    enumerable: true,
    value: id => clearTimeout(id),
    writable: true,
  },
  nativeFabricUIManager: {
    configurable: true,
    enumerable: true,
    value: {},
    writable: true,
  },
  performance: {
    configurable: true,
    enumerable: true,
    value: { now: jest.fn(Date.now) },
    writable: true,
  },
  requestAnimationFrame: {
    configurable: true,
    enumerable: true,
    value: cb => setTimeout(() => cb(jest.now()), 0),
    writable: true,
  },
  window: {
    configurable: true,
    enumerable: true,
    value: global,
    writable: true,
  },
});

jest
  .mock(path.join(rnDir, 'Libraries/Core/InitializeCore'), () => {})
  .mock(path.join(rnDir, 'Libraries/Core/NativeExceptionsManager'))
  .mock(path.join(rnDir, 'Libraries/TurboModule/TurboModuleRegistry'), () => ({
    get: jest.fn(() => ({ getConstants: () => ({}) })),
    getEnforcing: jest.fn(() => ({
      getConstants: () => ({
        forceTouchAvailable: false,
        interfaceIdiom: 'phone',
        isTesting: true,
        osVersion: '17.0',
        reactNativeVersion: { major: 0, minor: 74, patch: 0 },
      }),
    })),
  }))
  .mock(
    path.join(rnDir, 'src/private/specs/modules/NativePlatformConstantsIOS'),
    () => ({
      __esModule: true,
      default: {
        getConstants: () => ({
          forceTouchAvailable: false,
          interfaceIdiom: 'phone',
          isTesting: true,
          osVersion: '17.0',
          reactNativeVersion: { major: 0, minor: 74, patch: 0 },
        }),
      },
    })
  )
  .mock(
    path.join(rnDir, 'Libraries/Utilities/NativePlatformConstantsIOS'),
    () => ({
      __esModule: true,
      default: {
        getConstants: () => ({
          forceTouchAvailable: false,
          interfaceIdiom: 'phone',
          isTesting: true,
          osVersion: '17.0',
          reactNativeVersion: { major: 0, minor: 74, patch: 0 },
        }),
      },
    })
  )
  .mock(path.join(rnDir, 'Libraries/Utilities/Dimensions'), () => ({
    __esModule: true,
    default: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      get: jest.fn(key => ({
        fontScale: 2,
        height: 1334,
        scale: 2,
        width: 750,
        ...(key === 'screen' ? { width: 750, height: 1334 } : {}),
      })),
      set: jest.fn(),
    },
  }))
  .mock(path.join(rnDir, 'Libraries/ReactNative/UIManager'), () => ({
    blur: jest.fn(),
    createView: jest.fn(),
    customBubblingEventTypes: {},
    customDirectEventTypes: {},
    dispatchViewManagerCommand: jest.fn(),
    focus: jest.fn(),
    getViewManagerConfig: jest.fn(() => {}),
    hasViewManagerConfig: jest.fn(() => false),
    measure: jest.fn(),
    manageChildren: jest.fn(),
    setChildren: jest.fn(),
    updateView: jest.fn(),
  }))
  .mock(path.join(rnDir, 'Libraries/BatchedBridge/NativeModules'), () => ({
    DeviceInfo: {
      getConstants() {
        return {
          Dimensions: {
            window: { fontScale: 2, height: 1334, scale: 2, width: 750 },
            screen: { fontScale: 2, height: 1334, scale: 2, width: 750 },
          },
        };
      },
    },
    PlatformConstants: {
      getConstants() {
        return {};
      },
    },
    StatusBarManager: { getConstants: () => ({ HEIGHT: 42 }) },
    Timing: { createTimer: jest.fn(), deleteTimer: jest.fn() },
    UIManager: {},
    I18nManager: {
      allowRTL: jest.fn(),
      forceRTL: jest.fn(),
      swapLeftAndRightInRTL: jest.fn(),
      getConstants: () => ({ isRTL: false, doLeftAndRightSwapInRTL: true }),
    },
  }))
  .mock(path.join(rnDir, 'Libraries/Components/View/View'), () =>
    mockComponent(
      path.join(rnDir, 'Libraries/Components/View/View'),
      MockNativeMethods
    )
  )
  .mock(
    path.join(rnDir, 'Libraries/Components/View/ViewNativeComponent'),
    () => {
      const React = require('react');
      const Component = class extends React.Component {
        render() {
          return React.createElement('View', this.props, this.props.children);
        }
      };
      Component.displayName = 'View';
      return { __esModule: true, default: Component };
    }
  )
  .mock(path.join(rnDir, 'Libraries/Text/Text'), () =>
    mockComponent(path.join(rnDir, 'Libraries/Text/Text'), MockNativeMethods)
  )
  .mock(path.join(rnDir, 'Libraries/Components/TextInput/TextInput'), () =>
    mockComponent(
      path.join(rnDir, 'Libraries/Components/TextInput/TextInput'),
      {
        ...MockNativeMethods,
        isFocused: jest.fn(),
        clear: jest.fn(),
        getNativeRef: jest.fn(),
      }
    )
  )
  .mock(path.join(rnDir, 'Libraries/Image/Image'), () => {
    const Image = mockComponent(path.join(rnDir, 'Libraries/Image/Image'));
    Image.getSize = jest.fn();
    Image.resolveAssetSource = jest.fn();
    return Image;
  })
  .mock(
    path.join(
      rnDir,
      'Libraries/Components/ActivityIndicator/ActivityIndicator'
    ),
    () => ({
      __esModule: true,
      default: mockComponent(
        path.join(
          rnDir,
          'Libraries/Components/ActivityIndicator/ActivityIndicator'
        ),
        null,
        true
      ),
    })
  )
  .mock(
    path.join(rnDir, 'Libraries/NativeComponent/NativeComponentRegistry'),
    () => ({
      get: jest.fn(name =>
        jest
          .requireActual(path.join(rnDir, 'jest/mockNativeComponent'))
          .default(name)
      ),
      getWithFallback_DEPRECATED: jest.fn(name =>
        jest
          .requireActual(path.join(rnDir, 'jest/mockNativeComponent'))
          .default(name)
      ),
      setRuntimeConfigProvider: jest.fn(),
    })
  )
  .mock(path.join(rnDir, 'Libraries/ReactNative/requireNativeComponent'), () =>
    jest.requireActual(path.join(rnDir, 'jest/mockNativeComponent'))
  )
  .mock(
    path.join(rnDir, 'Libraries/Utilities/verifyComponentAttributeEquivalence'),
    () => function () {}
  )
  .mock(path.join(rnDir, 'Libraries/ReactNative/RendererProxy'), () =>
    jest.requireActual(
      path.join(rnDir, 'Libraries/ReactNative/RendererImplementation')
    )
  );
