/* eslint-env jest */
/* eslint-disable no-console */
// Silence act warnings for state updates in tests
const originalError = console.error;
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {return;}
    originalError.call(console, ...args);
  });
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore?.();
});
