jest.mock('@react-native-async-storage/async-storage', () => ({
	__esModule: true,
	default: {
		clear: jest.fn(),
		getItem: jest.fn(async () => null),
		removeItem: jest.fn(async () => undefined),
		setItem: jest.fn(async () => undefined),
	},
}));

jest.mock('expo-camera', () => ({
	CameraView: 'CameraView',
	useCameraPermissions: jest.fn(() => [{ granted: true }, jest.fn()]),
}));

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
