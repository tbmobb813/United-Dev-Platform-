// --- CRITICAL: Mock Dimensions before any imports or other mocks ---
jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
	const dims = {
		window: { width: 375, height: 667, scale: 2, fontScale: 2 },
		screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
	};
	return {
		get: jest.fn((dim) => dims[dim] || dims.window),
		set: jest.fn((updates) => Object.assign(dims, updates)),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		_update: jest.fn(),
		_dims: dims,
	};
});
jest.mock('react-native', () => {
	const RN = jest.requireActual('react-native');
	const dims = {
		window: { width: 375, height: 667, scale: 2, fontScale: 2 },
		screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
	};
	const dimensionsMock = {
		get: jest.fn((dim) => dims[dim] || dims.window),
		set: jest.fn((updates) => Object.assign(dims, updates)),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		_update: jest.fn(),
		_dims: dims,
	};
	return {
		...RN,
		Dimensions: dimensionsMock,
	};
});
// Mock global NativeModule to provide getConstants for CollaborativeEditor tests
global.NativeModule = {
	getConstants: () => ({
		brand: 'test',
		manufacturer: 'test',
		model: 'test',
		systemName: 'test',
		systemVersion: 'test',
		isTesting: true,
	}),
};
// Mock NativeModules.DeviceInfo to provide getConstants for CollaborativeEditor tests
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { NativeModules } = require('react-native');
NativeModules.DeviceInfo = {
  getConstants: () => ({
    brand: 'test',
    manufacturer: 'test',
    model: 'test',
    systemName: 'test',
    systemVersion: 'test',
    isTesting: true,
  }),
};
// Ensure jest is available in setup files
// @ts-ignore
import { jest } from '@jest/globals';
// Mock @rivascva/react-native-code-editor with CodeEditorSyntaxStyles
jest.mock('@rivascva/react-native-code-editor', () => ({
	__esModule: true,
	default: () => null,
	CodeEditorSyntaxStyles: {
		atomOneDark: {},
		// Add more styles if needed
	},
}));

// Polyfill __fbBatchedBridgeConfig for React Native
global.__fbBatchedBridgeConfig = global.__fbBatchedBridgeConfig || {};
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
	// Create a mock function component
	const CameraView = jest.fn(() => null);
	// Attach the static method
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

// Mock react-native Alert
jest.mock('react-native', () => {
	const RN = jest.requireActual('react-native');
	return {
		...RN,
		Alert: {
			alert: jest.fn(),
		},
	};
});


// Mock NativeSettingsManager to prevent TurboModuleRegistry errors
jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => ({
	__esModule: true,
	default: {
		settings: {},
		setValues: jest.fn(),
		getConstants: jest.fn(() => ({})),
	},
}));



// --- Ensure PlatformConstants is available globally for TurboModuleRegistry ---
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { NativeModules } = require('react-native');
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (!(globalThis as any).__turboModuleProxy) {
		// Mock as a function for TurboModuleRegistry
		const platformConstants = {
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
		(globalThis as any).__turboModuleProxy = (name) => {
			if (name === 'PlatformConstants') {
				return platformConstants;
			}
			if (name === 'DeviceInfo') {
				return {
					getConstants: () => ({
						brand: 'test',
						manufacturer: 'test',
						model: 'test',
						systemName: 'test',
						systemVersion: 'test',
						isTesting: true,
					}),
				};
			}
			return {};
		};
		NativeModules.PlatformConstants = platformConstants;
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(globalThis as any).PlatformConstants = platformConstants;
	}
} catch (e) {
	// ignore if react-native is not available
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
