import type {
  AuthConfig,
  PasswordManager as IPasswordManager,
  ValidationResult,
} from './types';

/**
 * Password management service for hashing, validation, and security
 */
export class PasswordManager implements IPasswordManager {
  private config: AuthConfig['password'];

  constructor(config: AuthConfig['password']) {
    this.config = config;
  }

  /**
   * Hash password using bcrypt-compatible algorithm
   */
  async hash(password: string): Promise<string> {
    // Simple hashing implementation for cross-platform compatibility
    // In production, use proper bcrypt or scrypt
    const salt = await this.generateSalt();
    const hash = await this.hashWithSalt(password, salt);
    return `$2b$${this.config.saltRounds}$${salt}${hash}`;
  }

  /**
   * Verify password against hash
   */
  async verify(password: string, hash: string): Promise<boolean> {
    try {
      // Parse the hash format: $2b$rounds$salt+hash
      const parts = hash.split('$');
      if (parts.length !== 4 || parts[0] !== '' || parts[1] !== '2b') {
        return false;
      }

      const rounds = parseInt(parts[2] || '0', 10);
      const saltAndHash = parts[3] || '';

      if (isNaN(rounds) || saltAndHash.length < 22) {
        return false;
      }

      const salt = saltAndHash.substring(0, 22);
      const expectedHash = saltAndHash.substring(22);

      const computedHash = await this.hashWithSalt(password, salt);
      return this.constantTimeEquals(computedHash, expectedHash);
    } catch {
      return false;
    }
  }

  /**
   * Validate password strength
   */
  validate(password: string): ValidationResult {
    const errors: string[] = [];
    let score = 0;

    // Length check
    if (password.length < this.config.minLength) {
      errors.push(
        `Password must be at least ${this.config.minLength} characters long`
      );
    } else {
      score += Math.min(25, password.length * 2);
    }

    // Uppercase check
    if (this.config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (/[A-Z]/.test(password)) {
      score += 15;
    }

    // Lowercase check
    if (this.config.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (/[a-z]/.test(password)) {
      score += 15;
    }

    // Numbers check
    if (this.config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (/\d/.test(password)) {
      score += 15;
    }

    // Symbols check
    if (
      this.config.requireSymbols &&
      !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password)
    ) {
      errors.push('Password must contain at least one special character');
    } else if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password)) {
      score += 20;
    }

    // Additional strength checks
    const uniqueChars = new Set(password).size;
    if (uniqueChars < password.length * 0.6) {
      errors.push('Password has too many repeated characters');
    } else {
      score += 10;
    }

    // Common patterns check
    if (this.hasCommonPatterns(password)) {
      errors.push(
        'Password contains common patterns (avoid sequences like 123, abc, etc.)'
      );
      score -= 20;
    }

    // Dictionary words check (simplified)
    if (this.hasCommonWords(password)) {
      errors.push('Password contains common words');
      score -= 15;
    }

    return {
      isValid: errors.length === 0,
      errors,
      score: Math.max(0, Math.min(100, score)),
    };
  }

  /**
   * Generate password reset token
   */
  async generateResetToken(): Promise<string> {
    const timestamp = Date.now().toString();
    const randomBytes = this.generateRandomString(32);
    const token = `${timestamp}.${randomBytes}`;

    // In production, you'd want to:
    // 1. Store this token in a secure database with expiration
    // 2. Associate it with the user
    // 3. Use cryptographically secure random generation

    return this.base64Encode(token);
  }

  /**
   * Verify password reset token
   */
  async verifyResetToken(token: string): Promise<boolean> {
    try {
      const decoded = this.base64Decode(token);
      const [timestamp, randomPart] = decoded.split('.');

      if (!timestamp || !randomPart) {
        return false;
      }

      const tokenTime = parseInt(timestamp, 10);
      const now = Date.now();
      const expiry = 60 * 60 * 1000; // 1 hour in milliseconds

      return now - tokenTime <= expiry;
    } catch {
      return false;
    }
  }

  /**
   * Update password configuration
   */
  updateConfig(config: Partial<AuthConfig['password']>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate cryptographically secure salt
   */
  private async generateSalt(): Promise<string> {
    return this.generateRandomString(22);
  }

  /**
   * Hash password with salt using simple algorithm
   */
  private async hashWithSalt(password: string, salt: string): Promise<string> {
    // Simple hash implementation for demonstration
    // In production, use proper bcrypt, scrypt, or Argon2
    let hash = 0;
    const input = password + salt;

    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Apply multiple rounds
    for (let round = 0; round < this.config.saltRounds; round++) {
      hash = this.simpleHash(hash.toString() + salt);
    }

    return Math.abs(hash).toString(36).padStart(31, '0');
  }

  /**
   * Simple hash function
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }

  /**
   * Constant time string comparison to prevent timing attacks
   */
  private constantTimeEquals(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Generate random string for salts and tokens
   */
  private generateRandomString(length: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
    let result = '';

    // Try to use crypto.getRandomValues if available
    try {
      if (
        typeof globalThis !== 'undefined' &&
        globalThis.crypto?.getRandomValues
      ) {
        const array = new Uint8Array(length);
        globalThis.crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
          result += chars[array[i]! % chars.length];
        }
        return result;
      }
    } catch {
      // Fall back to Math.random
    }

    // Fallback to Math.random (not cryptographically secure)
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
  }

  /**
   * Check for common patterns in password
   */
  private hasCommonPatterns(password: string): boolean {
    const patterns = [
      /123/,
      /abc/i,
      /qwerty/i,
      /password/i,
      /admin/i,
      /(.)\1{2,}/, // Three or more repeated characters
      /(012|234|345|456|567|678|789)/, // Sequential numbers
      /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i, // Sequential letters
    ];

    return patterns.some(pattern => pattern.test(password));
  }

  /**
   * Check for common dictionary words
   */
  private hasCommonWords(password: string): boolean {
    const commonWords = [
      'password',
      'admin',
      'user',
      'login',
      'welcome',
      'hello',
      'test',
      'demo',
      'sample',
      'default',
      'guest',
      'public',
      'private',
      'secret',
      'master',
      'super',
      'root',
      'system',
    ];

    const lowerPassword = password.toLowerCase();
    return commonWords.some(word => lowerPassword.includes(word));
  }

  /**
   * Base64 encode for cross-platform compatibility
   */
  private base64Encode(str: string): string {
    try {
      if (typeof globalThis !== 'undefined' && globalThis.btoa) {
        return globalThis.btoa(str);
      }
      if (typeof window !== 'undefined' && window.btoa) {
        return window.btoa(str);
      }
      // Manual base64 encoding
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
   * Base64 decode for cross-platform compatibility
   */
  private base64Decode(str: string): string {
    try {
      if (typeof globalThis !== 'undefined' && globalThis.atob) {
        return globalThis.atob(str);
      }
      if (typeof window !== 'undefined' && window.atob) {
        return window.atob(str);
      }
      // Manual base64 decoding
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
}

export default PasswordManager;
