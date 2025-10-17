// Core user and authentication types
export interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  roles: Role[];
  permissions: Permission[];
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  conditions?: Record<string, unknown>;
}

// Authentication session and token types
export interface AuthSession {
  id: string;
  userId: string;
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  issuedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  lastActivityAt: Date;
}

export interface TokenPayload {
  sub: string; // Subject (user ID)
  email: string;
  roles: string[];
  permissions: string[];
  iat: number; // Issued at
  exp: number; // Expires at
  jti?: string; // JWT ID
  iss?: string; // Issuer
  aud?: string | string[]; // Audience
}

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
  iat: number;
  exp: number;
  jti?: string;
}

// Authentication credentials and login types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
  inviteCode?: string;
}

export interface ResetPasswordRequest {
  email: string;
  captcha?: string;
}

export interface ResetPasswordConfirm {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// OAuth and external provider types
export interface OAuthProvider {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
  enabled: boolean;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

export interface OAuthUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  verified_email?: boolean;
  [key: string]: unknown;
}

export interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oidc';
  config: Record<string, unknown>;
  enabled: boolean;
}

// Authentication events and state
export type AuthEventType =
  | 'login'
  | 'logout'
  | 'register'
  | 'password_reset'
  | 'password_change'
  | 'email_verify'
  | 'session_refresh'
  | 'session_expire'
  | 'account_lock'
  | 'account_unlock';

export interface AuthEvent {
  type: AuthEventType;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  error: AuthError | null;
}

// Error types
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'USER_ALREADY_EXISTS'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_DISABLED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'SESSION_EXPIRED'
  | 'SESSION_INVALID'
  | 'PERMISSION_DENIED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'WEAK_PASSWORD'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// Configuration types
export interface AuthConfig {
  jwt: {
    secret: string;
    algorithm: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
    issuer?: string;
    audience?: string | string[];
  };
  session: {
    cookieName: string;
    cookieSecure: boolean;
    cookieHttpOnly: boolean;
    cookieSameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
    rolling: boolean;
  };
  password: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    saltRounds: number;
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    maxAttempts: number;
    blockDuration: number;
  };
  oauth: {
    providers: OAuthProvider[];
    redirectUri: string;
    stateSecret: string;
  };
  sso: {
    providers: SSOProvider[];
    defaultProvider?: string;
  };
  email: {
    verification: {
      required: boolean;
      tokenExpiry: string;
    };
    passwordReset: {
      tokenExpiry: string;
    };
  };
  features: {
    registration: boolean;
    passwordReset: boolean;
    emailChange: boolean;
    multipleDevices: boolean;
    socialLogin: boolean;
    ssoLogin: boolean;
  };
}

// Service interfaces
export interface AuthProvider {
  readonly name: string;
  authenticate(credentials: LoginCredentials): Promise<AuthResult>;
  register(credentials: RegisterCredentials): Promise<AuthResult>;
  refreshToken(refreshToken: string): Promise<AuthResult>;
  logout(sessionId: string): Promise<void>;
  verifyToken(token: string): Promise<TokenPayload>;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: AuthSession;
  accessToken?: string;
  refreshToken?: string;
  error?: AuthError;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  setPassword(id: string, hashedPassword: string): Promise<void>;
  verifyPassword(id: string, password: string): Promise<boolean>;
}

export interface SessionRepository {
  findById(id: string): Promise<AuthSession | null>;
  findByUserId(userId: string): Promise<AuthSession[]>;
  create(sessionData: Partial<AuthSession>): Promise<AuthSession>;
  update(id: string, sessionData: Partial<AuthSession>): Promise<AuthSession>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  cleanup(): Promise<void>;
}

export interface TokenManager {
  generateAccessToken(payload: TokenPayload): Promise<string>;
  generateRefreshToken(payload: RefreshTokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  verifyRefreshToken(token: string): Promise<RefreshTokenPayload>;
  revokeToken(token: string): Promise<void>;
  isTokenRevoked(token: string): Promise<boolean>;
}

export interface PasswordManager {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
  validate(password: string): ValidationResult;
  generateResetToken(): Promise<string>;
  verifyResetToken(token: string): Promise<boolean>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  score?: number;
}

// Authorization types
export interface AuthorizationContext {
  user: User;
  resource: string;
  action: string;
  environment?: Record<string, unknown>;
}

export interface AccessControlRule {
  id: string;
  resource: string;
  action: string;
  effect: 'allow' | 'deny';
  conditions?: Record<string, unknown>;
  priority: number;
}

export interface AuthGuard {
  canActivate(context: AuthorizationContext): Promise<boolean>;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

// Storage interfaces
export interface SecureStorage {
  set(key: string, value: string, options?: StorageOptions): Promise<void>;
  get(key: string): Promise<string | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface StorageOptions {
  encrypt?: boolean;
  expiry?: Date;
  tags?: string[];
}

// Event system
export interface AuthEventEmitter {
  on(event: AuthEventType, listener: (event: AuthEvent) => void): void;
  off(event: AuthEventType, listener: (event: AuthEvent) => void): void;
  emit(event: AuthEventType, data: Omit<AuthEvent, 'type' | 'timestamp'>): void;
}

// Middleware types
export interface AuthRequest {
  user?: User;
  session?: AuthSession;
  headers: Record<string, string>;
  ip?: string;
  userAgent?: string;
}

export interface AuthResponse {
  status: (code: number) => AuthResponse;
  json: (data: unknown) => void;
  send: (data: unknown) => void;
  redirect: (url: string) => void;
}

export interface AuthNext {
  (error?: Error): void;
}

export interface AuthMiddleware {
  (req: AuthRequest, res: AuthResponse, next: AuthNext): Promise<void>;
}

export interface AuthMiddlewareOptions {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  allowAnonymous?: boolean;
  rateLimitKey?: string;
}

// React hook types
export interface UseAuthOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
  suspense?: boolean;
}

export interface UseAuthResult {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<AuthResult>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

// Default values and constants
export const DEFAULT_AUTH_CONFIG: Partial<AuthConfig> = {
  jwt: {
    secret: '', // Will be set from environment
    algorithm: 'HS256',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
  },
  session: {
    cookieName: 'udp-session',
    cookieSecure: true,
    cookieHttpOnly: true,
    cookieSameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    rolling: true,
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    saltRounds: 12,
  },
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    blockDuration: 15 * 60 * 1000, // 15 minutes
  },
  features: {
    registration: true,
    passwordReset: true,
    emailChange: true,
    multipleDevices: true,
    socialLogin: true,
    ssoLogin: false,
  },
};

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest',
} as const;

export const SYSTEM_PERMISSIONS = {
  // User management
  'users:create': 'users:create',
  'users:read': 'users:read',
  'users:update': 'users:update',
  'users:delete': 'users:delete',

  // Role management
  'roles:create': 'roles:create',
  'roles:read': 'roles:read',
  'roles:update': 'roles:update',
  'roles:delete': 'roles:delete',

  // System management
  'system:admin': 'system:admin',
  'system:config': 'system:config',
  'system:logs': 'system:logs',

  // Content management
  'content:create': 'content:create',
  'content:read': 'content:read',
  'content:update': 'content:update',
  'content:delete': 'content:delete',
  'content:publish': 'content:publish',
} as const;
