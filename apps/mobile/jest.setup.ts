// @ts-nocheck
import { jest } from '@jest/globals';

global.__fbBatchedBridgeConfig = global.__fbBatchedBridgeConfig || {};

if (typeof global.setImmediate !== 'function') {
	global.setImmediate = (callback, ...args) => setTimeout(() => callback(...args), 0);
}

if (typeof global.clearImmediate !== 'function') {
	global.clearImmediate = (id) => clearTimeout(id);
}

global.ErrorUtils =
	global.ErrorUtils || {
		setGlobalHandler: jest.fn(),
		getGlobalHandler: jest.fn(() => () => {}),
		reportError: jest.fn(),
		reportFatalError: jest.fn(),
	};

if (!global.__turboModuleProxy) {
	global.__turboModuleProxy = (name) => {
		if (name === 'PlatformConstants') {
			return {
				forceTouchAvailable: false,
				interfaceIdiom: 'phone',
				isTesting: true,
				osVersion: 'test',
				reactNativeVersion: { major: 0, minor: 74, patch: 0 },
				getConstants: () => ({
					forceTouchAvailable: false,
					interfaceIdiom: 'phone',
					isTesting: true,
					osVersion: 'test',
					reactNativeVersion: { major: 0, minor: 74, patch: 0 },
				}),
			};
		}

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
			};
		}

		if (name === 'SourceCode') {
			return {
				getConstants: () => ({ scriptURL: 'http://localhost/index.bundle?platform=ios' }),
			};
		}

		if (name === 'DeviceInfo') {
			return {
				getConstants: () => ({
					Dimensions: {
						window: { width: 375, height: 667, scale: 2, fontScale: 2 },
						screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
					},
				}),
			};
		}

		return null;
	};
}

jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
	const dimensionState = {
		window: { width: 375, height: 667, scale: 2, fontScale: 2 },
		screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
	};

	const dimensions = {
		get: jest.fn((name) => dimensionState[name] || dimensionState.window),
		set: jest.fn((next) => Object.assign(dimensionState, next)),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
	};

	return {
		__esModule: true,
		default: dimensions,
		...dimensions,
	};
});

jest.mock('react-native/src/private/specs/modules/NativeDeviceInfo', () => ({
	getConstants: jest.fn(() => ({
		Dimensions: {
			window: { width: 375, height: 667, scale: 2, fontScale: 2 },
			screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
		},
		isIPhoneX_deprecated: false,
	})),
}));

jest.mock('react-native/src/private/specs/modules/NativeDeviceInfo.js', () => ({
	getConstants: jest.fn(() => ({
		Dimensions: {
			window: { width: 375, height: 667, scale: 2, fontScale: 2 },
			screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
		},
		isIPhoneX_deprecated: false,
	})),
}));

jest.mock('react-native/src/private/specs/modules/NativePlatformConstantsIOS', () => ({
	getConstants: jest.fn(() => ({
		forceTouchAvailable: false,
		interfaceIdiom: 'phone',
		isTesting: true,
		osVersion: 'test',
		reactNativeVersion: { major: 0, minor: 74, patch: 0 },
	})),
}));

jest.mock('react-native/src/private/specs/modules/NativePlatformConstantsIOS.js', () => ({
	getConstants: jest.fn(() => ({
		forceTouchAvailable: false,
		interfaceIdiom: 'phone',
		isTesting: true,
		osVersion: 'test',
		reactNativeVersion: { major: 0, minor: 74, patch: 0 },
	})),
}));

jest.mock('react-native/Libraries/Components/Keyboard/NativeKeyboardObserver', () => ({
	addListener: jest.fn(),
	removeListeners: jest.fn(),
}));

jest.mock('react-native/Libraries/Components/Keyboard/NativeKeyboardObserver.js', () => ({
	addListener: jest.fn(),
	removeListeners: jest.fn(),
}));

jest.mock('react-native/Libraries/Core/setUpDeveloperTools', () => ({}));

jest.mock('react-native/Libraries/Core/setUpDeveloperTools.js', () => ({}));

jest.mock('react-native/Libraries/Core/Timers/NativeTiming', () => ({
	createTimer: jest.fn(),
	deleteTimer: jest.fn(),
	setSendIdleEvents: jest.fn(),
}));

jest.mock('react-native/Libraries/Core/Timers/NativeTiming.js', () => ({
	createTimer: jest.fn(),
	deleteTimer: jest.fn(),
	setSendIdleEvents: jest.fn(),
}));

jest.mock('react-native/Libraries/WebSocket/WebSocket', () => {
	return class MockWebSocket {
		close() {}
		send() {}
		addEventListener() {}
		removeEventListener() {}
	};
});

jest.mock('react-native/Libraries/WebSocket/WebSocket.js', () => {
	return class MockWebSocket {
		close() {}
		send() {}
		addEventListener() {}
		removeEventListener() {}
	};
});

jest.mock('@rivascva/react-native-code-editor', () => ({
	__esModule: true,
	default: () => null,
	CodeEditorSyntaxStyles: {
		atomOneDark: {},
	},
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
	__esModule: true,
	default: {
		clear: jest.fn(),
		getItem: jest.fn(async () => null),
		removeItem: jest.fn(async () => undefined),
		setItem: jest.fn(async () => undefined),
	},
}));

jest.mock('expo-camera', () => {
	const CameraView = jest.fn(() => null);
	CameraView.requestCameraPermissionsAsync = jest.fn(() => Promise.resolve({ status: 'granted' }));
	return {
		__esModule: true,
		CameraView,
		useCameraPermissions: jest.fn(() => [{ granted: true }, jest.fn()]),
	};
});

jest.mock('expo-crypto', () => ({
	CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
	digestStringAsync: jest.fn(async () => 'mock-digest'),
	randomUUID: jest.fn(() => '00000000-0000-4000-8000-000000000000'),
}));

jest.mock('expo-linking', () => ({
	createURL: jest.fn((path = '') => `udp:///${path}`),
	openURL: jest.fn(async () => true),
}));

jest.mock('expo-secure-store', () => ({
	deleteItemAsync: jest.fn(async () => undefined),
	getItemAsync: jest.fn(async () => null),
	setItemAsync: jest.fn(async () => undefined),
}));

jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => ({
	__esModule: true,
	default: {
		settings: {},
		setValues: jest.fn(),
		getConstants: jest.fn(() => ({})),
	},
}));

try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const RN = require('react-native');
	if (RN?.StyleSheet && typeof RN.StyleSheet.flatten !== 'function') {
		RN.StyleSheet.flatten = (style) => {
			if (Array.isArray(style)) {
				return style.filter(Boolean).reduce((acc, entry) => ({ ...acc, ...entry }), {});
			}
			return style || {};
		};
	}

	if (!RN?.RefreshControl && RN?.View) {
		RN.RefreshControl = RN.View;
	}

	if (RN?.View) {
		RN.FlatList = RN.View;
		RN.SectionList = RN.View;
		RN.VirtualizedList = RN.View;
		RN.ScrollView = RN.View;
	}
} catch {
	// ignore in non-RN test contexts
}

// Silence act warnings for state updates
// (Moved to jest.env-setup.ts for proper Jest lifecycle context)
// const originalError = console.error;
// beforeAll(() => {
//   jest.spyOn(console, 'error').mockImplementation((...args) => {
//     if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
//     originalError.call(console, ...args);
//   });
// });
// afterAll(() => {
//   (console.error as jest.Mock).mockRestore?.();
// });
