/* global jest */
// Setup file to mock Dimensions before any other code runs

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
