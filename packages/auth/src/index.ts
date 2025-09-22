// Core authentication services
export { AuthService } from './AuthService';
export { PasswordManager } from './PasswordManager';
export { SessionRepository } from './SessionRepository';
export { TokenManager } from './TokenManager';

// Authorization and access control
export {
  createAuthorizationMiddleware,
  Permissions,
  RBACManager,
  RequirePermission,
  RequireRole,
  Roles,
} from './AuthorizationManager';
export type {
  AuthorizationMiddleware,
  ExtendedAuthorizationContext,
} from './AuthorizationManager';

// Authentication providers
export {
  AuthProviderFactory,
  LocalAuthProvider,
  OAuthAuthProvider,
} from './providers';

// Types and interfaces
export * from './types';
