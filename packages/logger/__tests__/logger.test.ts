import {
  describe,
  beforeEach,
  afterAll,
  it,
  expect,
  jest,
} from '@jest/globals';

describe('logger', () => {
  const ORIGINAL_ENV = process.env.NODE_ENV;

  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (process as any).env.NODE_ENV = ORIGINAL_ENV;
    /* eslint-enable @typescript-eslint/no-explicit-any */
  });

  it('calls console.log for info when not in production', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (process as any).env.NODE_ENV = 'development';
    /* eslint-enable @typescript-eslint/no-explicit-any */
    jest.resetModules();
    const { default: logger } = await import('../index');

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.info('hello', { a: 1 });
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toBe('[info]');
    // second argument should contain the JSON representation of the object
    expect(spy.mock.calls[0][1]).toEqual(expect.stringContaining('"a":1'));
    spy.mockRestore();
  });

  it('always calls console.warn for warn', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (process as any).env.NODE_ENV = 'production';
    /* eslint-enable @typescript-eslint/no-explicit-any */
    jest.resetModules();
    const { default: logger } = await import('../index');

    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('something', 42);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toBe('[warn]');
    spy.mockRestore();
  });

  it('always calls console.error for error', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (process as any).env.NODE_ENV = 'production';
    /* eslint-enable @typescript-eslint/no-explicit-any */
    jest.resetModules();
    const { default: logger } = await import('../index');

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error(new Error('boom'));
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toBe('[error]');
    spy.mockRestore();
  });
});
