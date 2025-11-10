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
    (
      process as unknown as { env: Record<string, string | undefined> }
    ).env.NODE_ENV = ORIGINAL_ENV;
  });

  it('calls console.log for info when not in production', async () => {
    (
      process as unknown as { env: Record<string, string | undefined> }
    ).env.NODE_ENV = 'development';
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
    (
      process as unknown as { env: Record<string, string | undefined> }
    ).env.NODE_ENV = 'production';
    jest.resetModules();
    const { default: logger } = await import('../index');

    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('something', 42);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toBe('[warn]');
    spy.mockRestore();
  });

  it('always calls console.error for error', async () => {
    (
      process as unknown as { env: Record<string, string | undefined> }
    ).env.NODE_ENV = 'production';
    jest.resetModules();
    const { default: logger } = await import('../index');

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error(new Error('boom'));
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toBe('[error]');
    spy.mockRestore();
  });
});
