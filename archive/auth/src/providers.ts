import type {
  AuthProvider,
  AuthResult,
  LoginCredentials,
  OAuthProvider as OAuthProviderConfig,
  OAuthTokenResponse,
  OAuthUserInfo,
  RegisterCredentials,
  Role,
  TokenPayload,
  User,
} from './types';

/**
 * Local username/password authentication provider
 */
export class LocalAuthProvider implements AuthProvider {
  readonly name = 'local';
  private userStore: Map<string, User & { password: string }> = new Map();

  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    const user = this.userStore.get(credentials.email);

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          timestamp: new Date(),
        },
      };
    }

    // Password verification would be handled by PasswordManager
    // This is a simplified implementation
    const isValidPassword = await this.verifyPassword(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid password',
          timestamp: new Date(),
        },
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        roles: user.roles,
        permissions: user.permissions,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        metadata: user.metadata,
      },
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResult> {
    if (this.userStore.has(credentials.email)) {
      return {
        success: false,
        error: {
          code: 'USER_ALREADY_EXISTS',
          message: 'User already exists',
          timestamp: new Date(),
        },
      };
    }

    const hashedPassword = await this.hashPassword(credentials.password);
    const defaultRole: Role = {
      id: 'user-role',
      name: 'user',
      description: 'Default user role',
      permissions: [],
      isSystem: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user: User & { password: string } = {
      id: this.generateId(),
      email: credentials.email,
      password: hashedPassword,
      username: credentials.username,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      displayName:
        credentials.firstName && credentials.lastName
          ? `${credentials.firstName} ${credentials.lastName}`
          : credentials.username,
      roles: [defaultRole],
      permissions: [],
      isEmailVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.userStore.set(credentials.email, user);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        roles: user.roles,
        permissions: user.permissions,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        metadata: user.metadata,
      },
    };
  }

  async refreshToken(_refreshToken: string): Promise<AuthResult> {
    // Simplified implementation
    return {
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Refresh token not implemented for local provider',
        timestamp: new Date(),
      },
    };
  }

  async logout(_sessionId: string): Promise<void> {
    // Simplified implementation - would clear session
  }

  async verifyToken(_token: string): Promise<TokenPayload> {
    // Simplified implementation - would verify JWT token
    throw new Error('Token verification not implemented for local provider');
  }

  private async verifyPassword(
    plaintext: string,
    hashed: string
  ): Promise<boolean> {
    // Simplified - would use PasswordManager in real implementation
    return plaintext === hashed; // Placeholder
  }

  private async hashPassword(password: string): Promise<string> {
    // Simplified - would use PasswordManager in real implementation
    return password; // Placeholder
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

/**
 * OAuth authentication provider for external services
 */
export class OAuthAuthProvider implements AuthProvider {
  readonly name: string;
  private config: OAuthProviderConfig;

  constructor(providerName: string, config: OAuthProviderConfig) {
    this.name = providerName;
    this.config = config;
  }

  async authenticate(_credentials: LoginCredentials): Promise<AuthResult> {
    // For OAuth, credentials would typically contain an authorization code
    // This is a simplified implementation
    return {
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'OAuth authentication requires authorization code flow',
        timestamp: new Date(),
      },
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResult> {
    // OAuth typically doesn't have separate registration
    return this.authenticate(credentials as LoginCredentials);
  }

  /**
   * Authenticate with OAuth authorization code
   */
  async authenticateWithCode(
    code: string,
    _state?: string
  ): Promise<AuthResult> {
    try {
      // Exchange authorization code for access token
      const tokenResponse = await this.exchangeCodeForToken(code);

      // Get user info from OAuth provider
      const userInfo = await this.getUserInfo(tokenResponse.access_token);

      // Create or update user
      const user = await this.createOrUpdateUser(userInfo);

      return {
        success: true,
        user,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'OAuth authentication failed',
          timestamp: new Date(),
        },
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const tokenData: OAuthTokenResponse = await response.json();

      return {
        success: true,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message:
            error instanceof Error ? error.message : 'Token refresh failed',
          timestamp: new Date(),
        },
      };
    }
  }

  async logout(_sessionId: string): Promise<void> {
    // OAuth logout would typically revoke tokens
    // Implementation depends on provider
  }

  async verifyToken(_token: string): Promise<TokenPayload> {
    // Verify token with OAuth provider
    // This is a simplified implementation
    throw new Error('Token verification not implemented for OAuth provider');
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      scope: this.config.scopes.join(' '),
      ...(state && { state }),
    });

    return `${this.config.authUrl}?${params.toString()}`;
  }

  private async exchangeCodeForToken(
    code: string
  ): Promise<OAuthTokenResponse> {
    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return response.json();
  }

  private async getUserInfo(accessToken: string): Promise<OAuthUserInfo> {
    const response = await fetch(this.config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`User info fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  private async createOrUpdateUser(oauthUser: OAuthUserInfo): Promise<User> {
    const defaultRole: Role = {
      id: 'user-role',
      name: 'user',
      description: 'Default user role',
      permissions: [],
      isSystem: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // This would typically interact with a user repository
    return {
      id: oauthUser.id || this.generateId(),
      email: oauthUser.email,
      displayName: oauthUser.name,
      avatar: oauthUser.picture,
      roles: [defaultRole],
      permissions: [],
      isEmailVerified: oauthUser.verified_email || false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

/**
 * Provider factory for creating authentication providers
 */
export class AuthProviderFactory {
  static createLocalProvider(): LocalAuthProvider {
    return new LocalAuthProvider();
  }

  static createOAuthProvider(
    name: string,
    config: OAuthProviderConfig
  ): OAuthAuthProvider {
    return new OAuthAuthProvider(name, config);
  }

  /**
   * Create Google OAuth provider
   */
  static createGoogleProvider(config: {
    clientId: string;
    clientSecret: string;
  }): OAuthAuthProvider {
    return new OAuthAuthProvider('google', {
      id: 'google',
      name: 'Google',
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      scopes: ['openid', 'email', 'profile'],
      enabled: true,
    });
  }

  /**
   * Create GitHub OAuth provider
   */
  static createGitHubProvider(config: {
    clientId: string;
    clientSecret: string;
  }): OAuthAuthProvider {
    return new OAuthAuthProvider('github', {
      id: 'github',
      name: 'GitHub',
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user',
      scopes: ['user:email', 'read:user'],
      enabled: true,
    });
  }

  /**
   * Create Microsoft OAuth provider
   */
  static createMicrosoftProvider(config: {
    clientId: string;
    clientSecret: string;
    tenantId?: string;
  }): OAuthAuthProvider {
    const tenantId = config.tenantId || 'common';

    return new OAuthAuthProvider('microsoft', {
      id: 'microsoft',
      name: 'Microsoft',
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
      tokenUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
      scopes: ['openid', 'email', 'profile'],
      enabled: true,
    });
  }
}
