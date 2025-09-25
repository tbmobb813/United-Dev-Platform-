import React from 'react';
import type { User } from '../types';

export interface AuthGuardProps {
  children: React.ReactNode;
  user: User | null;
  isLoading?: boolean;
  isAuthenticated?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
  onUnauthorized?: () => void;
  onLogin?: () => void;
  showLoginPrompt?: boolean;
  loginPromptText?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  user,
  isLoading = false,
  isAuthenticated = false,
  requiredRoles = [],
  requiredPermissions = [],
  fallback,
  redirectTo,
  onUnauthorized,
  onLogin,
  showLoginPrompt = true,
  loginPromptText = 'Please sign in to access this content',
}) => {
  const hasRequiredRoles = (
    userRoles: string[],
    requiredRoles: string[]
  ): boolean => {
    if (requiredRoles.length === 0) {
      return true;
    }
    return requiredRoles.some(role => userRoles.includes(role));
  };

  const hasRequiredPermissions = (
    userPermissions: string[],
    requiredPermissions: string[]
  ): boolean => {
    if (requiredPermissions.length === 0) {
      return true;
    }
    return requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );
  };

  const checkAccess = (): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }

    const userRoles = user.roles?.map(role => role.name) || [];
    const userPermissions =
      user.permissions?.map(
        permission => `${permission.resource}:${permission.action}`
      ) || [];

    const hasRoles = hasRequiredRoles(userRoles, requiredRoles);
    const hasPermissions = hasRequiredPermissions(
      userPermissions,
      requiredPermissions
    );

    return hasRoles && hasPermissions;
  };

  const handleUnauthorized = () => {
    if (onUnauthorized) {
      onUnauthorized();
    } else if (redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="auth-guard auth-guard--loading">
        <div className="auth-guard__spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showLoginPrompt) {
      return (
        <div className="auth-guard auth-guard--unauthenticated">
          <div className="auth-guard__content">
            <div className="auth-guard__icon">🔒</div>
            <h3 className="auth-guard__title">Authentication Required</h3>
            <p className="auth-guard__message">{loginPromptText}</p>
            {onLogin && (
              <button
                type="button"
                onClick={onLogin}
                className="auth-guard__login-button"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      );
    }

    handleUnauthorized();
    return null;
  }

  // Check if user has required access
  if (!checkAccess()) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="auth-guard auth-guard--unauthorized">
        <div className="auth-guard__content">
          <div className="auth-guard__icon">⚠️</div>
          <h3 className="auth-guard__title">Access Denied</h3>
          <p className="auth-guard__message">
            You don't have permission to access this content.
          </p>
          {requiredRoles.length > 0 && (
            <div className="auth-guard__requirements">
              <p>
                <strong>Required roles:</strong> {requiredRoles.join(', ')}
              </p>
            </div>
          )}
          {requiredPermissions.length > 0 && (
            <div className="auth-guard__requirements">
              <p>
                <strong>Required permissions:</strong>{' '}
                {requiredPermissions.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

// Higher-order component version
export interface WithAuthGuardProps {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: React.ComponentType;
  redirectTo?: string;
}

export const withAuthGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthGuardProps = {}
) => {
  const WithAuthGuardComponent: React.FC<
    P & {
      user?: User | null;
      isLoading?: boolean;
      isAuthenticated?: boolean;
    }
  > = props => {
    const { user, isLoading, isAuthenticated, ...componentProps } = props;

    return (
      <AuthGuard
        user={user || null}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        requiredRoles={options.requiredRoles}
        requiredPermissions={options.requiredPermissions}
        fallback={options.fallback ? <options.fallback /> : undefined}
        redirectTo={options.redirectTo}
      >
        <WrappedComponent {...(componentProps as P)} />
      </AuthGuard>
    );
  };

  WithAuthGuardComponent.displayName = `withAuthGuard(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithAuthGuardComponent;
};

// Role-based guards
export interface RoleGuardProps {
  children: React.ReactNode;
  user: User | null;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  user,
  allowedRoles,
  fallback,
}) => {
  const userRoles = user?.roles?.map(role => role.name) || [];
  const hasAccess = allowedRoles.some(role => userRoles.includes(role));

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

// Permission-based guards
export interface PermissionGuardProps {
  children: React.ReactNode;
  user: User | null;
  requiredPermissions: string[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // true = all permissions required, false = any permission required
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  user,
  requiredPermissions,
  fallback,
  requireAll = true,
}) => {
  const userPermissions =
    user?.permissions?.map(
      permission => `${permission.resource}:${permission.action}`
    ) || [];

  const hasAccess = requireAll
    ? requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      )
    : requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default AuthGuard;
