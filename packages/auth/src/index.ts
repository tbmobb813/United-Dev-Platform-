// Core authentication services
export { AuthService } from './AuthService';
export { PasswordManager } from './PasswordManager';
export { SessionRepository } from './SessionRepository';
export { TokenManager } from './TokenManager';

// Authorization and access control
export {
  Permissions,
  RBACManager,
  RequirePermission,
  RequireRole,
  Roles,
  createAuthorizationMiddleware,
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

// UI Components
export { LoginForm } from './components/LoginForm';
export type { LoginFormProps } from './components/LoginForm';

export { SignupForm } from './components/SignupForm';
export type { SignupFormProps } from './components/SignupForm';

export { PasswordResetForm } from './components/PasswordResetForm';
export type { PasswordResetFormProps } from './components/PasswordResetForm';

export {
  SocialButton,
  SocialLoginButtons,
  socialProviders,
} from './components/SocialLoginButtons';
export type {
  SocialButtonProps,
  SocialLoginButtonsProps,
  SocialProvider,
} from './components/SocialLoginButtons';

export {
  AuthGuard,
  PermissionGuard,
  RoleGuard,
  withAuthGuard,
} from './components/AuthGuard';
export type {
  AuthGuardProps,
  PermissionGuardProps,
  RoleGuardProps,
  WithAuthGuardProps,
} from './components/AuthGuard';

// Types and interfaces
export * from './types';
