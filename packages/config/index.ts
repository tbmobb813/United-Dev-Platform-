/**
 * Environment Configuration Module
 * Provides type-safe access to environment variables with defaults
 */

export interface AppConfig {
  // Application
  appName: string;
  appVersion: string;
  appUrl: string;
  nodeEnv: 'development' | 'production' | 'test';

  // WebSocket
  wsUrl: string;
  wsPort: number;

  // API
  apiUrl: string;

  // AI Services
  openaiApiKey?: string;
  anthropicApiKey?: string;
  allowLocalModels: boolean;
  localOpenaiBaseUrl?: string;

  // Authentication
  nextauthSecret?: string;
  nextauthUrl: string;
  githubClientId?: string;
  githubClientSecret?: string;

  // Database
  databaseUrl?: string;

  // Features
  debug: boolean;
  enableTelemetry: boolean;
  enableAnalytics: boolean;

  // Mobile
  mobileScheme: string;
  deeplinkBase: string;

  // Collaboration
  maxCollaborators: number;
  syncInterval: number;

  // Performance
  editorDebounce: number;
  presenceUpdateInterval: number;
}

/**
 * Get environment variable with optional default value
 */
function getEnvVar(key: string, defaultValue?: string): string | undefined {
  if (typeof window !== 'undefined') {
    // Client-side: only access NEXT_PUBLIC_ variables
    if (key.startsWith('NEXT_PUBLIC_')) {
      return process.env[key] || defaultValue;
    }
    return defaultValue;
  }
  // Server-side: access all environment variables
  return process.env[key] || defaultValue;
}

/**
 * Get environment variable as boolean
 */
function getEnvBool(key: string, defaultValue = false): boolean {
  const value = getEnvVar(key);
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get environment variable as number
 */
function getEnvNumber(key: string, defaultValue = 0): number {
  const value = getEnvVar(key);
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get the current application configuration
 */
export function getConfig(): AppConfig {
  const nodeEnv = getEnvVar('NODE_ENV', 'development') as AppConfig['nodeEnv'];
  const isDev = nodeEnv === 'development';

  return {
    // Application
    appName: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Unified Dev Platform')!,
    appVersion: getEnvVar('NEXT_PUBLIC_APP_VERSION', '0.0.2')!,
    appUrl: getEnvVar(
      'NEXT_PUBLIC_APP_URL',
      isDev ? 'http://localhost:3000' : 'https://your-domain.com'
    )!,
    nodeEnv,

    // WebSocket
    wsUrl: getEnvVar(
      'NEXT_PUBLIC_WS_URL',
      isDev ? 'ws://localhost:3030' : 'wss://your-ws-domain.com'
    )!,
    wsPort: getEnvNumber('WS_PORT', isDev ? 3030 : 443),

    // API
    apiUrl: getEnvVar(
      'NEXT_PUBLIC_API_URL',
      isDev ? 'http://localhost:3000/api' : 'https://your-domain.com/api'
    )!,

    // AI Services
    openaiApiKey: getEnvVar('OPENAI_API_KEY'),
    anthropicApiKey: getEnvVar('ANTHROPIC_API_KEY'),
    allowLocalModels: getEnvBool('ALLOW_LOCAL_MODELS', isDev),
    localOpenaiBaseUrl: getEnvVar(
      'LOCAL_OPENAI_BASE_URL',
      'http://localhost:11434/v1'
    ),

    // Authentication
    nextauthSecret: getEnvVar('NEXTAUTH_SECRET'),
    nextauthUrl: getEnvVar(
      'NEXTAUTH_URL',
      isDev ? 'http://localhost:3000' : 'https://your-domain.com'
    )!,
    githubClientId: getEnvVar('GITHUB_CLIENT_ID'),
    githubClientSecret: getEnvVar('GITHUB_CLIENT_SECRET'),

    // Database
    databaseUrl: getEnvVar('DATABASE_URL'),

    // Features
    debug: getEnvBool('DEBUG', isDev),
    enableTelemetry: getEnvBool('ENABLE_TELEMETRY', !isDev),
    enableAnalytics: getEnvBool('ENABLE_ANALYTICS', !isDev),

    // Mobile
    mobileScheme: getEnvVar('NEXT_PUBLIC_MOBILE_SCHEME', 'udp')!,
    deeplinkBase: getEnvVar('NEXT_PUBLIC_DEEPLINK_BASE', 'udp://open')!,

    // Collaboration
    maxCollaborators: getEnvNumber(
      'NEXT_PUBLIC_MAX_COLLABORATORS',
      isDev ? 10 : 50
    ),
    syncInterval: getEnvNumber('NEXT_PUBLIC_SYNC_INTERVAL', 100),

    // Performance
    editorDebounce: getEnvNumber('NEXT_PUBLIC_EDITOR_DEBOUNCE', 300),
    presenceUpdateInterval: getEnvNumber(
      'NEXT_PUBLIC_PRESENCE_UPDATE_INTERVAL',
      1000
    ),
  };
}

/**
 * Validate that required environment variables are set
 */
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const config = getConfig();
  const errors: string[] = [];

  // Required for production
  if (config.nodeEnv === 'production') {
    if (!config.nextauthSecret) {
      errors.push('NEXTAUTH_SECRET is required in production');
    }
    if (!config.databaseUrl) {
      errors.push('DATABASE_URL is required in production');
    }
  }

  // AI configuration warnings
  if (
    !config.openaiApiKey &&
    !config.anthropicApiKey &&
    !config.allowLocalModels
  ) {
    errors.push(
      'At least one AI provider must be configured (OpenAI, Anthropic, or local models)'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Client-safe configuration (only includes NEXT_PUBLIC_ variables)
 */
export function getClientConfig(): Partial<AppConfig> {
  const config = getConfig();
  return {
    appName: config.appName,
    appVersion: config.appVersion,
    appUrl: config.appUrl,
    wsUrl: config.wsUrl,
    apiUrl: config.apiUrl,
    mobileScheme: config.mobileScheme,
    deeplinkBase: config.deeplinkBase,
    maxCollaborators: config.maxCollaborators,
    syncInterval: config.syncInterval,
    editorDebounce: config.editorDebounce,
    presenceUpdateInterval: config.presenceUpdateInterval,
  };
}

// Default export
export default { getConfig, validateConfig, getClientConfig };
