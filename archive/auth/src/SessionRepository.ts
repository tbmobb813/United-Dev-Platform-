import type {
  AuthConfig,
  AuthSession,
  SessionRepository as ISessionRepository,
} from './types';

/**
 * In-memory session repository for managing user sessions
 */
export class SessionRepository implements ISessionRepository {
  private sessions: Map<string, AuthSession> = new Map();
  private userSessions: Map<string, Set<string>> = new Map();
  private config: AuthConfig['session'];
  private cleanupInterval?: unknown;

  constructor(config: AuthConfig['session']) {
    this.config = config;
    this.startCleanup();
  }

  /**
   * Create a new session
   */
  async create(sessionData: Partial<AuthSession>): Promise<AuthSession> {
    const id = this.generateSessionId();
    const now = new Date();

    // Create session with required fields and defaults
    const newSession: AuthSession = {
      id,
      userId: sessionData.userId || '',
      user: sessionData.user || {
        id: '',
        email: '',
        username: '',
        roles: [],
        permissions: [],
        isEmailVerified: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, // Will be populated by the auth service
      accessToken: sessionData.accessToken || '',
      refreshToken: sessionData.refreshToken,
      expiresAt:
        sessionData.expiresAt || new Date(now.getTime() + this.config.maxAge),
      issuedAt: sessionData.issuedAt || now,
      ipAddress: sessionData.ipAddress,
      userAgent: sessionData.userAgent,
      isActive: sessionData.isActive ?? true,
      lastActivityAt: sessionData.lastActivityAt || now,
      ...sessionData,
    };

    this.sessions.set(id, newSession);

    // Track user sessions
    if (!this.userSessions.has(newSession.userId)) {
      this.userSessions.set(newSession.userId, new Set());
    }
    this.userSessions.get(newSession.userId)!.add(id);

    return newSession;
  }

  /**
   * Find session by ID
   */
  async findById(sessionId: string): Promise<AuthSession | null> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (this.isExpired(session)) {
      await this.delete(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Find all sessions for a user
   */
  async findByUserId(userId: string): Promise<AuthSession[]> {
    const sessionIds = this.userSessions.get(userId);
    if (!sessionIds) {
      return [];
    }

    const sessions: AuthSession[] = [];
    for (const sessionId of sessionIds) {
      const session = await this.findById(sessionId);
      if (session) {
        sessions.push(session);
      }
    }

    return sessions;
  }

  /**
   * Find session by refresh token
   */
  async findByRefreshToken(refreshToken: string): Promise<AuthSession | null> {
    for (const session of this.sessions.values()) {
      if (session.refreshToken === refreshToken) {
        if (this.isExpired(session)) {
          await this.delete(session.id);
          return null;
        }
        return session;
      }
    }
    return null;
  }

  /**
   * Update session
   */
  async update(
    sessionId: string,
    sessionData: Partial<AuthSession>
  ): Promise<AuthSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const updatedSession: AuthSession = {
      ...session,
      ...sessionData,
      id: sessionId, // Prevent ID changes
      lastActivityAt: new Date(),
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  /**
   * Delete session by ID
   */
  async delete(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    this.sessions.delete(sessionId);

    // Remove from user sessions tracking
    const userSessionIds = this.userSessions.get(session.userId);
    if (userSessionIds) {
      userSessionIds.delete(sessionId);
      if (userSessionIds.size === 0) {
        this.userSessions.delete(session.userId);
      }
    }
  }

  /**
   * Delete all sessions for a user
   */
  async deleteByUserId(userId: string): Promise<void> {
    const sessionIds = this.userSessions.get(userId);
    if (!sessionIds) {
      return;
    }

    for (const sessionId of Array.from(sessionIds)) {
      await this.delete(sessionId);
    }
  }

  /**
   * Update session last activity
   */
  async touch(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    session.lastActivityAt = new Date();

    return true;
  }

  /**
   * Check if session is valid and not expired
   */
  async isValid(sessionId: string): Promise<boolean> {
    const session = await this.findById(sessionId);
    return session !== null;
  }

  /**
   * Get all active sessions (for admin purposes)
   */
  async getActiveSessions(): Promise<AuthSession[]> {
    const activeSessions: AuthSession[] = [];

    for (const session of this.sessions.values()) {
      if (!this.isExpired(session)) {
        activeSessions.push(session);
      }
    }

    return activeSessions;
  }

  /**
   * Clean up expired sessions
   */
  async cleanup(): Promise<void> {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (this.isExpired(session)) {
        await this.delete(sessionId);
      }
    }
  }

  /**
   * Get session statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    users: number;
  }> {
    let active = 0;
    let expired = 0;

    for (const session of this.sessions.values()) {
      if (this.isExpired(session)) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.sessions.size,
      active,
      expired,
      users: this.userSessions.size,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AuthConfig['session']>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Destroy the repository and cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      if (typeof window !== 'undefined' && window.clearInterval) {
        window.clearInterval(this.cleanupInterval as number);
      } else if (
        typeof globalThis !== 'undefined' &&
        globalThis.clearInterval
      ) {
        globalThis.clearInterval(this.cleanupInterval as number);
      }
    }
    this.sessions.clear();
    this.userSessions.clear();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = this.generateRandomString(16);
    return `${timestamp}_${randomPart}`;
  }

  /**
   * Generate random string
   */
  private generateRandomString(length: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
  }

  /**
   * Check if session is expired
   */
  private isExpired(session: AuthSession): boolean {
    const now = new Date();

    // Check absolute expiry
    if (session.expiresAt && now > session.expiresAt) {
      return true;
    }

    // Check inactivity timeout
    if (session.lastActivityAt) {
      const inactiveTime = now.getTime() - session.lastActivityAt.getTime();
      if (inactiveTime > this.config.maxAge) {
        return true;
      }
    }

    return false;
  }

  /**
   * Start automatic cleanup of expired sessions
   */
  private startCleanup(): void {
    // Clean up every hour
    const cleanupIntervalMs = 60 * 60 * 1000; // 1 hour

    try {
      if (typeof window !== 'undefined' && window.setInterval) {
        this.cleanupInterval = window.setInterval(async () => {
          await this.cleanup();
        }, cleanupIntervalMs) as unknown;
      } else if (typeof globalThis !== 'undefined' && globalThis.setInterval) {
        this.cleanupInterval = globalThis.setInterval(async () => {
          await this.cleanup();
        }, cleanupIntervalMs) as unknown;
      }
    } catch {
      // Silently fail if setInterval is not available
    }
  }
}

export default SessionRepository;
