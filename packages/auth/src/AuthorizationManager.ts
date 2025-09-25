import type { AuthorizationContext, Permission, User } from './types';

/**
 * Extended authorization context with helper methods
 */
export interface ExtendedAuthorizationContext extends AuthorizationContext {
  roles: Role[];
  permissions: Permission[];
  hasPermission: (permission: string, resource?: string) => boolean;
  hasRole: (roleName: string) => boolean;
  hasAnyPermission: (permissions: string[], resource?: string) => boolean;
  hasAllPermissions: (permissions: string[], resource?: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
}

/**
 * Role interface (local definition to avoid unused import warning)
 */
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
}

/**
 * Role-Based Access Control (RBAC) utility class
 * Provides methods for checking user permissions and roles
 */
export class RBACManager {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(
    user: User,
    permission: string,
    resource?: string
  ): boolean {
    if (!user.roles || user.roles.length === 0) {
      return false;
    }

    return user.roles.some(role =>
      role.permissions?.some(perm => {
        if (perm.name !== permission) {
          return false;
        }

        // If resource is specified, check if permission applies to this resource
        if (resource && perm.resource && perm.resource !== resource) {
          return false;
        }

        return true;
      })
    );
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(
    user: User,
    permissions: string[],
    resource?: string
  ): boolean {
    return permissions.some(permission =>
      this.hasPermission(user, permission, resource)
    );
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(
    user: User,
    permissions: string[],
    resource?: string
  ): boolean {
    return permissions.every(permission =>
      this.hasPermission(user, permission, resource)
    );
  }

  /**
   * Check if a user has a specific role
   */
  static hasRole(user: User, roleName: string): boolean {
    if (!user.roles || user.roles.length === 0) {
      return false;
    }

    return user.roles.some(role => role.name === roleName);
  }

  /**
   * Check if a user has any of the specified roles
   */
  static hasAnyRole(user: User, roleNames: string[]): boolean {
    return roleNames.some(roleName => this.hasRole(user, roleName));
  }

  /**
   * Get all permissions for a user across all roles
   */
  static getUserPermissions(user: User): Permission[] {
    if (!user.roles || user.roles.length === 0) {
      return [];
    }

    const permissions: Permission[] = [];
    const permissionSet = new Set<string>();

    user.roles.forEach(role => {
      role.permissions?.forEach(permission => {
        const permKey = `${permission.name}:${permission.resource || '*'}`;
        if (!permissionSet.has(permKey)) {
          permissionSet.add(permKey);
          permissions.push(permission);
        }
      });
    });

    return permissions;
  }

  /**
   * Create an extended authorization context for the user
   */
  static createExtendedContext(
    user: User,
    resource = '*',
    action = 'access'
  ): ExtendedAuthorizationContext {
    const permissions = this.getUserPermissions(user);
    const roles = user.roles || [];

    return {
      user,
      resource,
      action,
      roles,
      permissions,
      hasPermission: (permission: string, res?: string) =>
        this.hasPermission(user, permission, res || resource),
      hasRole: (roleName: string) => this.hasRole(user, roleName),
      hasAnyPermission: (perms: string[], res?: string) =>
        this.hasAnyPermission(user, perms, res || resource),
      hasAllPermissions: (perms: string[], res?: string) =>
        this.hasAllPermissions(user, perms, res || resource),
      hasAnyRole: (roleNames: string[]) => this.hasAnyRole(user, roleNames),
    };
  }
}

/**
 * Middleware function type for authorization checks
 */
export type AuthorizationMiddleware = (
  context: ExtendedAuthorizationContext,
  next: () => void | Promise<void>
) => void | Promise<void>;

/**
 * Authorization decorator for protecting methods
 */
export function RequirePermission(permission: string, resource?: string) {
  return function (
    target: unknown,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      // First argument should be the authorization context
      const context = args[0] as ExtendedAuthorizationContext;

      if (!context || !context.hasPermission(permission, resource)) {
        throw new Error(
          `Access denied. Required permission: ${permission}${
            resource ? ` on ${resource}` : ''
          }`
        );
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Authorization decorator for protecting methods with role checks
 */
export function RequireRole(role: string) {
  return function (
    target: unknown,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      // First argument should be the authorization context
      const context = args[0] as ExtendedAuthorizationContext;

      if (!context || !context.hasRole(role)) {
        throw new Error(`Access denied. Required role: ${role}`);
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Create middleware for route/endpoint protection
 */
export function createAuthorizationMiddleware(requirements: {
  permissions?: string[];
  roles?: string[];
  resource?: string;
  requireAll?: boolean; // true = all permissions/roles, false = any (default)
}): AuthorizationMiddleware {
  return (
    context: ExtendedAuthorizationContext,
    next: () => void | Promise<void>
  ) => {
    const { permissions, roles, resource, requireAll = false } = requirements;

    // Check role requirements
    if (roles && roles.length > 0) {
      const hasRequiredRoles = requireAll
        ? roles.every(roleName => context.hasRole(roleName))
        : context.hasAnyRole(roles);

      if (!hasRequiredRoles) {
        throw new Error(`Access denied. Required roles: ${roles.join(', ')}`);
      }
    }

    // Check permission requirements
    if (permissions && permissions.length > 0) {
      const hasRequiredPermissions = requireAll
        ? context.hasAllPermissions(permissions, resource)
        : context.hasAnyPermission(permissions, resource);

      if (!hasRequiredPermissions) {
        throw new Error(
          `Access denied. Required permissions: ${permissions.join(', ')}`
        );
      }
    }

    return next();
  };
}

/**
 * Pre-defined permission constants
 */
export const Permissions = {
  // User management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_LIST: 'user:list',

  // Role management
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  ROLE_LIST: 'role:list',
  ROLE_ASSIGN: 'role:assign',

  // System administration
  SYSTEM_ADMIN: 'system:admin',
  SYSTEM_READ: 'system:read',
  SYSTEM_CONFIG: 'system:config',

  // Data access
  DATA_READ: 'data:read',
  DATA_WRITE: 'data:write',
  DATA_DELETE: 'data:delete',
  DATA_EXPORT: 'data:export',

  // API access
  API_ACCESS: 'api:access',
  API_ADMIN: 'api:admin',
} as const;

/**
 * Pre-defined role constants
 */
export const Roles = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
  VIEWER: 'viewer',
  GUEST: 'guest',
} as const;
