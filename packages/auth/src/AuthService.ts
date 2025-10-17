import type {
  AuthConfig,
  AuthError,
  AuthEvent,
  AuthEventType,
  AuthProvider,
  AuthResult,
  AuthSession,
  LoginCredentials,
  PasswordManager,
  RegisterCredentials,
  SessionRepository,
  TokenManager,
  User,
  UserRepository,
} from './types';

// Default configuration
const DEFAULT_AUTH_CONFIG: AuthConfig = {
  jwt: {
    secret: 'your-super-secret-jwt-key-change-this',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    algorithm: 'HS256',
  },
  session: {
    cookieName: 'auth-session',
    cookieSecure: true,
    cookieHttpOnly: true,
    cookieSameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    rolling: false,
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    saltRounds: 12,
  },
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    blockDuration: 60 * 60 * 1000, // 1 hour
  },
  features: {
    registration: true,
    passwordReset: true,
    emailChange: true,
    multipleDevices: true,
    socialLogin: false,
    ssoLogin: false,
  },
  oauth: {
    providers: [],
    redirectUri: '/auth/callback',
    stateSecret: 'your-oauth-state-secret',
  },
  sso: {
    providers: [],
    defaultProvider: undefined,
  },
  email: {
    verification: {
      required: false,
      tokenExpiry: '24h',
    },
    passwordReset: {
      tokenExpiry: '1h',
    },
  },
};

// Simple event emitter implementation
class SimpleEventEmitter {
  private listeners: Map<string, Array<(...args: unknown[]) => void>> =
    new Map();

  emit(eventName: string, ...args: unknown[]): boolean {
    const listeners = this.listeners.get(eventName);
    if (!listeners) {
      return false;
    }

    listeners.forEach(listener => listener(...args));
    return true;
  }

  on(eventName: string, listener: (...args: unknown[]) => void): this {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listener);
    return this;
  }

  off(eventName: string, listener: (...args: unknown[]) => void): this {
    const listeners = this.listeners.get(eventName);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  removeAllListeners(eventName?: string): this {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
    return this;
  }
}

/**
 * Core authentication service that orchestrates all auth operations
 */
export class AuthService extends SimpleEventEmitter {
  private config: AuthConfig;
  private tokenManager: TokenManager;
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;
  private passwordManager: PasswordManager;
  private providers: Map<string, AuthProvider> = new Map();

  constructor(
    config: Partial<AuthConfig>,
    tokenManager: TokenManager,
    userRepository: UserRepository,
    sessionRepository: SessionRepository,
    passwordManager: PasswordManager
  ) {
    super();
    this.config = this.mergeConfig(config);
    this.tokenManager = tokenManager;
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
    this.passwordManager = passwordManager;
  }

  /**
   * Register a new authentication provider
   */
  public registerProvider(name: string, provider: AuthProvider): void {
    this.providers.set(name, provider);
  }

  /**
   * Get an authentication provider by name
   */
  public getProvider(name: string): AuthProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Authenticate user with credentials
   */
  public async login(
    credentials: LoginCredentials,
    provider = 'local'
  ): Promise<AuthResult> {
    try {
      this.emitEvent('login', {
        metadata: { provider, email: credentials.email },
      });

      const authProvider = this.providers.get(provider);
      if (!authProvider) {
        throw this.createError(
          'SERVER_ERROR',
          `Provider '${provider}' not found`
        );
      }

      const result = await authProvider.authenticate(credentials);

      if (result.success && result.user && result.session) {
        this.emitEvent('login', {
          userId: result.user.id,
          sessionId: result.session.id,
          metadata: { provider, success: true },
        });
      }

      return result;
    } catch (error) {
      const authError = this.normalizeError(error);
      this.emitEvent('login', {
        metadata: { provider, email: credentials.email, error: authError.code },
      });
      return { success: false, error: authError };
    }
  }

  /**
   * Register a new user
   */
  public async register(
    credentials: RegisterCredentials,
    provider = 'local'
  ): Promise<AuthResult> {
    try {
      if (!this.config.features.registration) {
        throw this.createError('PERMISSION_DENIED', 'Registration is disabled');
      }

      this.emitEvent('register', {
        metadata: { provider, email: credentials.email },
      });

      // Validate password
      const passwordValidation = this.passwordManager.validate(
        credentials.password
      );
      if (!passwordValidation.isValid) {
        throw this.createError(
          'WEAK_PASSWORD',
          passwordValidation.errors.join(', ')
        );
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(
        credentials.email
      );
      if (existingUser) {
        throw this.createError(
          'USER_ALREADY_EXISTS',
          'User with this email already exists'
        );
      }

      const authProvider = this.providers.get(provider);
      if (!authProvider) {
        throw this.createError(
          'SERVER_ERROR',
          `Provider '${provider}' not found`
        );
      }

      const result = await authProvider.register(credentials);

      if (result.success && result.user) {
        this.emitEvent('register', {
          userId: result.user.id,
          metadata: { provider, success: true },
        });
      }

      return result;
    } catch (error) {
      const authError = this.normalizeError(error);
      this.emitEvent('register', {
        metadata: { provider, email: credentials.email, error: authError.code },
      });
      return { success: false, error: authError };
    }
  }

  /**
   * Refresh authentication session
   */
  public async refreshSession(
    refreshToken: string,
    provider = 'local'
  ): Promise<AuthResult> {
    try {
      this.emitEvent('session_refresh', { metadata: { provider } });

      const authProvider = this.providers.get(provider);
      if (!authProvider) {
        throw this.createError(
          'SERVER_ERROR',
          `Provider '${provider}' not found`
        );
      }

      const result = await authProvider.refreshToken(refreshToken);

      if (result.success && result.session) {
        this.emitEvent('session_refresh', {
          userId: result.session.userId,
          sessionId: result.session.id,
          metadata: { provider, success: true },
        });
      }

      return result;
    } catch (error) {
      const authError = this.normalizeError(error);
      this.emitEvent('session_refresh', {
        metadata: { provider, error: authError.code },
      });
      return { success: false, error: authError };
    }
  }

  /**
   * Logout user and invalidate session
   */
  public async logout(sessionId: string, provider = 'local'): Promise<void> {
    try {
      this.emitEvent('logout', { sessionId, metadata: { provider } });

      const session = await this.sessionRepository.findById(sessionId);
      if (session) {
        const authProvider = this.providers.get(provider);
        if (authProvider) {
          await authProvider.logout(sessionId);
        }

        this.emitEvent('logout', {
          userId: session.userId,
          sessionId,
          metadata: { provider, success: true },
        });
      }
    } catch (error) {
      this.emitEvent('logout', {
        sessionId,
        metadata: { provider, error: this.normalizeError(error).code },
      });
      throw error;
    }
  }

  /**
   * Verify an access token
   */
  public async verifyToken(token: string): Promise<User | null> {
    try {
      const payload = await this.tokenManager.verifyAccessToken(token);
      const user = await this.userRepository.findById(payload.sub);
      return user;
    } catch {
      return null;
    }
  }

  /**
   * Get user by ID
   */
  public async getUser(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  /**
   * Get active sessions for user
   */
  public async getUserSessions(userId: string): Promise<AuthSession[]> {
    return this.sessionRepository.findByUserId(userId);
  }

  /**
   * Revoke specific session
   */
  public async revokeSession(sessionId: string): Promise<void> {
    await this.sessionRepository.delete(sessionId);
    this.emitEvent('session_expire', { sessionId });
  }

  /**
   * Revoke all sessions for user
   */
  public async revokeAllSessions(userId: string): Promise<void> {
    await this.sessionRepository.deleteByUserId(userId);
    this.emitEvent('session_expire', { userId, metadata: { all: true } });
  }

  /**
   * Change user password
   */
  public async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw this.createError('USER_NOT_FOUND', 'User not found');
    }

    // Verify current password
    const isCurrentValid = await this.userRepository.verifyPassword(
      userId,
      currentPassword
    );
    if (!isCurrentValid) {
      throw this.createError(
        'INVALID_CREDENTIALS',
        'Current password is incorrect'
      );
    }

    // Validate new password
    const passwordValidation = this.passwordManager.validate(newPassword);
    if (!passwordValidation.isValid) {
      throw this.createError(
        'WEAK_PASSWORD',
        passwordValidation.errors.join(', ')
      );
    }

    // Hash and set new password
    const hashedPassword = await this.passwordManager.hash(newPassword);
    await this.userRepository.setPassword(userId, hashedPassword);

    // Revoke all existing sessions to force re-authentication
    await this.revokeAllSessions(userId);

    this.emitEvent('password_change', { userId });
  }

  /**
   * Request password reset
   */
  public async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    const resetToken = await this.passwordManager.generateResetToken();

    // Store reset token (implementation depends on your storage strategy)
    // This would typically be stored in a separate reset tokens table

    this.emitEvent('password_reset', {
      userId: user.id,
      metadata: { email, token: resetToken },
    });
  }

  /**
   * Confirm password reset with token
   */
  public async confirmPasswordReset(
    token: string,
    newPassword: string
  ): Promise<void> {
    const isValidToken = await this.passwordManager.verifyResetToken(token);
    if (!isValidToken) {
      throw this.createError('TOKEN_INVALID', 'Invalid or expired reset token');
    }

    // Validate new password
    const passwordValidation = this.passwordManager.validate(newPassword);
    if (!passwordValidation.isValid) {
      throw this.createError(
        'WEAK_PASSWORD',
        passwordValidation.errors.join(', ')
      );
    }

    // Implementation would need to extract user ID from token
    // and update password - this is simplified

    this.emitEvent('password_reset', { metadata: { confirmed: true } });
  }

  /**
   * Clean up expired sessions and tokens
   */
  public async cleanup(): Promise<void> {
    await this.sessionRepository.cleanup();
  }

  /**
   * Get authentication configuration
   */
  public getConfig(): AuthConfig {
    return this.config;
  }

  /**
   * Update authentication configuration
   */
  public updateConfig(updates: Partial<AuthConfig>): void {
    this.config = this.mergeConfig(updates);
  }

  private mergeConfig(config: Partial<AuthConfig>): AuthConfig {
    return {
      ...DEFAULT_AUTH_CONFIG,
      ...config,
      jwt: {
        ...DEFAULT_AUTH_CONFIG.jwt,
        ...config.jwt,
      },
      session: {
        ...DEFAULT_AUTH_CONFIG.session,
        ...config.session,
      },
      password: {
        ...DEFAULT_AUTH_CONFIG.password,
        ...config.password,
      },
      rateLimit: {
        ...DEFAULT_AUTH_CONFIG.rateLimit,
        ...config.rateLimit,
      },
      features: {
        ...DEFAULT_AUTH_CONFIG.features,
        ...config.features,
      },
    } as AuthConfig;
  }

  private createError(code: AuthError['code'], message: string): AuthError {
    return {
      code,
      message,
      timestamp: new Date(),
    };
  }

  private normalizeError(error: unknown): AuthError {
    if (error && typeof error === 'object' && 'code' in error) {
      return error as AuthError;
    }

    return this.createError(
      'UNKNOWN_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

  private emitEvent(
    type: AuthEventType,
    data: Omit<AuthEvent, 'type' | 'timestamp'>
  ): void {
    const event: AuthEvent = {
      type,
      timestamp: new Date(),
      ...data,
    };

    this.emit(type, event);
    this.emit('auth_event', event);
  }
}

export default AuthService;
