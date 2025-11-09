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
    (process as unknown as { env: Record<string, string | undefined> }).env.NODE_ENV = undefined;
    const cfg = getConfig();
    expect(cfg.appName).toBeDefined();
    expect(cfg.nodeEnv).toBe('development');
  });

  it('client config only includes NEXT_PUBLIC values', () => {
    (process as unknown as { env: Record<string, string | undefined> }).env.NEXT_PUBLIC_APP_NAME = 'MyApp';
    (process as unknown as { env: Record<string, string | undefined> }).env.OPENAI_API_KEY = 'secret';
    const client = getClientConfig();
    expect(client.appName).toBe('MyApp');
    // server-only secret should not be present on client config
    expect(client.openaiApiKey).toBeUndefined();
  });

  it('validateConfig returns errors for missing production requirements and AI providers', () => {
    (process as unknown as { env: Record<string, string | undefined> }).env.NODE_ENV = 'production';
    (process as unknown as { env: Record<string, string | undefined> }).env.NEXTAUTH_SECRET = undefined;
    (process as unknown as { env: Record<string, string | undefined> }).env.DATABASE_URL = undefined;
    (process as unknown as { env: Record<string, string | undefined> }).env.OPENAI_API_KEY = undefined;
    (process as unknown as { env: Record<string, string | undefined> }).env.ANTHROPIC_API_KEY = undefined;
    (process as unknown as { env: Record<string, string | undefined> }).env.ALLOW_LOCAL_MODELS = 'false';

    const res = validateConfig();
    expect(res.isValid).toBe(false);
    expect(res.errors.some(e => /NEXTAUTH_SECRET/.test(e))).toBe(true);
    expect(res.errors.some(e => /DATABASE_URL/.test(e))).toBe(true);
    expect(
      res.errors.some(e => /AI provider|At least one AI provider/.test(e))
    ).toBe(true);
  });

  it('validateConfig succeeds when required production vars are present', () => {
    (process as unknown as { env: Record<string, string | undefined> }).env.NODE_ENV = 'production';
    (process as unknown as { env: Record<string, string | undefined> }).env.NEXTAUTH_SECRET = 's';
    (process as unknown as { env: Record<string, string | undefined> }).env.DATABASE_URL = 'postgres://x';
    (process as unknown as { env: Record<string, string | undefined> }).env.OPENAI_API_KEY = 'ok';

    const res = validateConfig();
    expect(res.isValid).toBe(true);
    expect(res.errors.length).toBe(0);
  });
});
