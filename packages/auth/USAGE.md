# Authentication Package Usage Examples

## Overview

The `@udp/auth` package provides a comprehensive authentication and authorization system with:

- JWT token management
- Local and OAuth authentication providers
- Role-based access control (RBAC)
- Session management
- Cross-platform compatibility

## Basic Setup

```typescript
import {
  AuthService,
  LocalAuthProvider,
  OAuthAuthProvider,
  AuthProviderFactory,
  RBACManager,
  createAuthorizationMiddleware,
  Permissions,
  Roles,
} from "@udp/auth";

// Create authentication providers
const localProvider = new LocalAuthProvider();
const googleProvider = AuthProviderFactory.createGoogleProvider({
  clientId: "your-google-client-id",
  clientSecret: "your-google-client-secret",
});

// Initialize auth service with multiple providers
const authService = new AuthService([localProvider, googleProvider]);
```

## User Registration and Login

```typescript
// Register a new user
const registerResult = await authService.register({
  email: "user@example.com",
  password: "securepassword",
  name: "John Doe",
});

if (registerResult.success) {
  console.log("User registered:", registerResult.user);
  console.log("Access token:", registerResult.tokens?.accessToken);
}

// Login with email/password
const loginResult = await authService.login({
  email: "user@example.com",
  password: "securepassword",
});

if (loginResult.success) {
  console.log("User logged in:", loginResult.user);
  console.log("Session ID:", loginResult.sessionId);
}
```

## OAuth Authentication

```typescript
// Get OAuth authorization URL
const oauthProvider = AuthProviderFactory.createGoogleProvider({
  clientId: "your-google-client-id",
  clientSecret: "your-google-client-secret",
});

const authUrl = await oauthProvider.getAuthorizationUrl("http://localhost:3000/callback");
console.log("Redirect user to:", authUrl);

// After user returns from OAuth provider with authorization code
const oauthResult = await oauthProvider.handleCallback("authorization_code_from_oauth");

if (oauthResult.success) {
  console.log("OAuth login successful:", oauthResult.user);
}
```

## Role-Based Access Control (RBAC)

```typescript
import type { User } from "@udp/auth";

// Example user with roles and permissions
const user: User = {
  id: "123",
  email: "admin@example.com",
  name: "Admin User",
  roles: [
    {
      id: "admin-role",
      name: "admin",
      permissions: [
        { name: "user:create", resource: "*" },
        { name: "user:read", resource: "*" },
        { name: "user:update", resource: "*" },
        { name: "user:delete", resource: "*" },
        { name: "system:admin", resource: "*" },
      ],
    },
  ],
};

// Check permissions
const canCreateUser = RBACManager.hasPermission(user, Permissions.USER_CREATE);
const canDeleteUser = RBACManager.hasPermission(user, Permissions.USER_DELETE);
const hasAdminRole = RBACManager.hasRole(user, Roles.ADMIN);

console.log("Can create user:", canCreateUser); // true
console.log("Can delete user:", canDeleteUser); // true
console.log("Has admin role:", hasAdminRole); // true

// Create extended authorization context
const authContext = RBACManager.createExtendedContext(user, "users", "manage");

// Use context methods
console.log("Has admin permission:", authContext.hasPermission("system:admin"));
console.log("User permissions:", authContext.permissions);
```

## Middleware for Route Protection

```typescript
// Create authorization middleware
const adminMiddleware = createAuthorizationMiddleware({
  roles: [Roles.ADMIN],
  permissions: [Permissions.SYSTEM_ADMIN],
  requireAll: true, // User must have both role AND permission
});

// Use middleware (example with Express.js style)
function protectedRoute(req: any, res: any, next: any) {
  const user = req.user; // Assume user is attached to request
  const context = RBACManager.createExtendedContext(user, "admin", "access");

  adminMiddleware(context, () => {
    // User has required permissions, continue with route handler
    res.json({ message: "Admin access granted" });
  });
}
```

## Method Decorators

```typescript
class UserService {
  @RequirePermission(Permissions.USER_CREATE)
  async createUser(context: ExtendedAuthorizationContext, userData: any) {
    // This method requires user:create permission
    console.log("Creating user for:", context.user.email);
    // Implementation here
  }

  @RequireRole(Roles.ADMIN)
  async deleteUser(context: ExtendedAuthorizationContext, userId: string) {
    // This method requires admin role
    console.log("Admin deleting user:", userId);
    // Implementation here
  }
}

// Usage
const userService = new UserService();
const adminContext = RBACManager.createExtendedContext(adminUser);

try {
  await userService.createUser(adminContext, { name: "New User" });
  await userService.deleteUser(adminContext, "user-123");
} catch (error) {
  console.error("Access denied:", error.message);
}
```

## Token Management

```typescript
import { TokenManager } from "@udp/auth";

// Generate tokens
const tokenManager = new TokenManager();
const payload = { userId: "123", email: "user@example.com" };

const accessToken = await tokenManager.generateAccessToken(payload);
const refreshToken = await tokenManager.generateRefreshToken(payload);

console.log("Access token:", accessToken);
console.log("Refresh token:", refreshToken);

// Verify tokens
try {
  const decoded = await tokenManager.verifyToken(accessToken);
  console.log("Token payload:", decoded);
} catch (error) {
  console.error("Token verification failed:", error.message);
}
```

## Session Management

```typescript
import { SessionRepository } from "@udp/auth";

const sessionRepo = new SessionRepository();

// Create session
const session = await sessionRepo.create({
  userId: "123",
  expiresAt: new Date(Date.now() + 86400000), // 24 hours
  metadata: { userAgent: "Mozilla/5.0..." },
});

console.log("Session created:", session.id);

// Get session
const retrievedSession = await sessionRepo.get(session.id);
if (retrievedSession) {
  console.log("Session found:", retrievedSession.userId);
}

// Update session activity
await sessionRepo.updateLastActivity(session.id);

// Delete session (logout)
await sessionRepo.delete(session.id);
```

## Error Handling

```typescript
import { AuthError } from "@udp/auth";

try {
  const result = await authService.login({
    email: "invalid@example.com",
    password: "wrongpassword",
  });

  if (!result.success) {
    console.error("Login failed:", result.error?.message);
    console.error("Error code:", result.error?.code);
  }
} catch (error) {
  if (error instanceof AuthError) {
    console.error("Auth error:", error.code, error.message);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Pre-defined Constants

The package includes pre-defined permissions and roles:

### Permissions

- `USER_CREATE`, `USER_READ`, `USER_UPDATE`, `USER_DELETE`, `USER_LIST`
- `ROLE_CREATE`, `ROLE_READ`, `ROLE_UPDATE`, `ROLE_DELETE`, `ROLE_LIST`, `ROLE_ASSIGN`
- `SYSTEM_ADMIN`, `SYSTEM_READ`, `SYSTEM_CONFIG`
- `DATA_READ`, `DATA_WRITE`, `DATA_DELETE`, `DATA_EXPORT`
- `API_ACCESS`, `API_ADMIN`

### Roles

- `ADMIN`, `USER`, `MODERATOR`, `VIEWER`, `GUEST`

These can be used directly or as a reference for creating custom permissions and roles.
