import { getConfig, getClientConfig, validateConfig } from '../../index';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';

describe('packages/config - API', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = { ...OLD_ENV };
  });

  it('returns defaults when environment variables are not set', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (process.env as any).NODE_ENV = undefined;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const cfg = getConfig();
    expect(cfg.appName).toBeDefined();
    expect(cfg.nodeEnv).toBe('development');
  });

  it('client config only includes NEXT_PUBLIC values', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (process.env as any).NEXT_PUBLIC_APP_NAME = 'MyApp';
    (process.env as any).OPENAI_API_KEY = 'secret';
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const client = getClientConfig();
    expect(client.appName).toBe('MyApp');
    // server-only secret should not be present on client config
    expect(client.openaiApiKey).toBeUndefined();
  });

  it('validateConfig returns errors for missing production requirements and AI providers', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (process.env as any).NODE_ENV = 'production';
    (process.env as any).NEXTAUTH_SECRET = undefined;
    (process.env as any).DATABASE_URL = undefined;
    (process.env as any).OPENAI_API_KEY = undefined;
    (process.env as any).ANTHROPIC_API_KEY = undefined;
    (process.env as any).ALLOW_LOCAL_MODELS = 'false';
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const res = validateConfig();
    expect(res.isValid).toBe(false);
    expect(res.errors.some(e => /NEXTAUTH_SECRET/.test(e))).toBe(true);
    expect(res.errors.some(e => /DATABASE_URL/.test(e))).toBe(true);
    expect(
      res.errors.some(e => /AI provider|At least one AI provider/.test(e))
    ).toBe(true);
  });

  it('validateConfig succeeds when required production vars are present', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (process.env as any).NODE_ENV = 'production';
    (process.env as any).NEXTAUTH_SECRET = 's';
    (process.env as any).DATABASE_URL = 'postgres://x';
    (process.env as any).OPENAI_API_KEY = 'ok';
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const res = validateConfig();
    expect(res.isValid).toBe(true);
    expect(res.errors.length).toBe(0);
  });
});
