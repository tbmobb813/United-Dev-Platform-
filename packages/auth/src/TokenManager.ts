import type {
  AuthConfig,
  TokenManager as ITokenManager,
  RefreshTokenPayload,
  TokenPayload,
} from './types';

/**
 * JWT token management service
 */
export class TokenManager implements ITokenManager {
  private config: AuthConfig['jwt'];

  constructor(config: AuthConfig['jwt']) {
    this.config = config;
  }

  /**
   * Generate access token from payload
   */
  async generateAccessToken(payload: TokenPayload): Promise<string> {
    const header = {
      alg: this.config.algorithm,
      typ: 'JWT',
    };

    const headerEncoded = this.base64Encode(JSON.stringify(header));
    const payloadEncoded = this.base64Encode(JSON.stringify(payload));
    const signature = await this.createSignature(
      `${headerEncoded}.${payloadEncoded}`
    );

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  /**
   * Generate refresh token from payload
   */
  async generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    const header = {
      alg: this.config.algorithm,
      typ: 'JWT',
    };

    const headerEncoded = this.base64Encode(JSON.stringify(header));
    const payloadEncoded = this.base64Encode(JSON.stringify(payload));
    const signature = await this.createSignature(
      `${headerEncoded}.${payloadEncoded}`
    );

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  /**
   * Verify and decode access token
   */
  async verifyAccessToken(token: string): Promise<TokenPayload> {
    const isValid = await this.verifySignature(token);
    if (!isValid) {
      throw new Error('TOKEN_INVALID');
    }

    const payload = this.decodePayload(token) as TokenPayload;

    if (this.isExpired(payload.exp)) {
      throw new Error('TOKEN_EXPIRED');
    }

    return payload;
  }

  /**
   * Verify and decode refresh token
   */
  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const isValid = await this.verifySignature(token);
    if (!isValid) {
      throw new Error('REFRESH_TOKEN_INVALID');
    }

    const payload = this.decodePayload(token) as RefreshTokenPayload;

    if (this.isExpired(payload.exp)) {
      throw new Error('REFRESH_TOKEN_EXPIRED');
    }

    return payload;
  }

  /**
   * Revoke token (placeholder implementation)
   */
  async revokeToken(_token: string): Promise<void> {
    // Implementation would depend on blacklist storage strategy
    // For now, this is a placeholder
  }

  /**
   * Check if token is revoked
   */
  async isTokenRevoked(_token: string): Promise<boolean> {
    // Implementation would check blacklist
    // For now, always return false
    return false;
  }

  /**
   * Helper: Create signature for token
   */
  private async createSignature(data: string): Promise<string> {
    // Try Web Crypto API first (modern browsers/Node.js)
    try {
      let crypto: Crypto;
      let encoder: TextEncoder;

      if (typeof globalThis !== 'undefined' && globalThis.crypto) {
        crypto = globalThis.crypto;
        encoder = new globalThis.TextEncoder();
      } else if (typeof window !== 'undefined' && window.crypto) {
        crypto = window.crypto;
        encoder = new window.TextEncoder();
      } else {
        throw new Error('Web Crypto API not available');
      }

      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.config.secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(data)
      );

      return this.base64Encode(
        String.fromCharCode(...new Uint8Array(signature))
      );
    } catch {
      // Fallback to simple signature (not cryptographically secure)
      // In production, use proper HMAC implementation
      return this.base64Encode(this.simpleHash(data + this.config.secret));
    }
  }

  /**
   * Simple hash function for fallback (not cryptographically secure)
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Helper: Verify token signature
   */
  private async verifySignature(token: string): Promise<boolean> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const [header, payload, signature] = parts;
    const expectedSignature = await this.createSignature(
      `${header}.${payload}`
    );

    return signature === expectedSignature;
  }

  /**
   * Helper: Decode token payload without verification
   */
  private decodePayload(token: string): TokenPayload | RefreshTokenPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payloadPart = parts[1];
    if (!payloadPart) {
      throw new Error('Invalid token payload');
    }

    try {
      const payload = JSON.parse(this.base64Decode(payloadPart));
      return payload;
    } catch {
      throw new Error('Invalid token payload');
    }
  }

  /**
   * Helper: Check if timestamp is expired
   */
  private isExpired(exp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  }

  /**
   * Helper: Create token payload with expiration
   */
  createTokenPayload(
    userId: string,
    email: string,
    roles: string[],
    permissions: string[],
    expiryTime: string
  ): TokenPayload {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + this.parseExpiryToSeconds(expiryTime);

    return {
      sub: userId,
      email,
      roles,
      permissions,
      iat: now,
      exp,
      iss: this.config.issuer,
      aud: this.config.audience,
    };
  }

  /**
   * Helper: Create refresh token payload
   */
  createRefreshTokenPayload(
    userId: string,
    sessionId: string,
    expiryTime: string
  ): RefreshTokenPayload {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + this.parseExpiryToSeconds(expiryTime);

    return {
      sub: userId,
      sessionId,
      iat: now,
      exp,
    };
  }

  /**
   * Cross-platform base64 encoding
   */
  private base64Encode(str: string): string {
    try {
      // Try browser btoa first
      if (typeof window !== 'undefined' && window.btoa) {
        return window.btoa(str);
      }
      // Try global btoa
      if (typeof globalThis !== 'undefined' && globalThis.btoa) {
        return globalThis.btoa(str);
      }
      // Try global Buffer (Node.js)
      if (typeof global !== 'undefined' && global.Buffer) {
        return global.Buffer.from(str).toString('base64');
      }
      // Manual base64 encoding as last resort
      const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      let result = '';
      let i = 0;
      while (i < str.length) {
        const byte1 = str.charCodeAt(i++);
        const byte2 = i < str.length ? str.charCodeAt(i++) : 0;
        const byte3 = i < str.length ? str.charCodeAt(i++) : 0;

        const bitmap = (byte1 << 16) | (byte2 << 8) | byte3;

        result += chars.charAt((bitmap >> 18) & 63);
        result += chars.charAt((bitmap >> 12) & 63);
        result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : '=';
        result += i - 1 < str.length ? chars.charAt(bitmap & 63) : '=';
      }
      return result;
    } catch {
      throw new Error('Base64 encoding failed');
    }
  }

  /**
   * Cross-platform base64 decoding
   */
  private base64Decode(str: string): string {
    try {
      // Try browser atob first
      if (typeof window !== 'undefined' && window.atob) {
        return window.atob(str);
      }
      // Try global atob
      if (typeof globalThis !== 'undefined' && globalThis.atob) {
        return globalThis.atob(str);
      }
      // Try global Buffer (Node.js)
      if (typeof global !== 'undefined' && global.Buffer) {
        return global.Buffer.from(str, 'base64').toString();
      }
      // Manual base64 decoding as last resort
      const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      let result = '';
      let i = 0;

      str = str.replace(/[^A-Za-z0-9+/]/g, '');

      while (i < str.length) {
        const encoded1 = chars.indexOf(str.charAt(i++));
        const encoded2 = chars.indexOf(str.charAt(i++));
        const encoded3 = chars.indexOf(str.charAt(i++));
        const encoded4 = chars.indexOf(str.charAt(i++));

        const bitmap =
          (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

        result += String.fromCharCode((bitmap >> 16) & 255);
        if (encoded3 !== 64) {
          result += String.fromCharCode((bitmap >> 8) & 255);
        }
        if (encoded4 !== 64) {
          result += String.fromCharCode(bitmap & 255);
        }
      }

      return result;
    } catch {
      throw new Error('Base64 decoding failed');
    }
  }

  /**
   * Parse expiry string to seconds
   */
  private parseExpiryToSeconds(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd]?)$/);
    if (!match || !match[1]) {
      throw new Error(`Invalid expiry format: ${expiry}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2] || 's';

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error(`Unknown time unit: ${unit}`);
    }
  }
}
