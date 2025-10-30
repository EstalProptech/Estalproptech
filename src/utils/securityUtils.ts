/**
 * Security Utilities
 * Input validation, sanitization, and security helpers
 */

import { errorMonitor } from './errorMonitoring';
import { criticalEventLogger } from './criticalEventLogger';

/**
 * Input validation schemas
 */
export const ValidationRules = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^.{8,}$/, // At least 8 characters
  phoneNumber: /^[\d\s\-+()]{10,}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  url: /^https?:\/\/.+/,
  safeString: /^[a-zA-Z0-9\s\-_.,!?'"()@#$%&*+=[\]{}|\\:;<>/]+$/,
};

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return ValidationRules.email.test(email.trim());
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'] };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized;
}

/**
 * Validate UUID format
 */
export function validateUuid(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false;
  return ValidationRules.uuid.test(uuid);
}

/**
 * Sanitize object for logging (remove sensitive data)
 */
export function sanitizeForLogging(data: any): any {
  if (!data) return data;

  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apikey',
    'api_key',
    'authorization',
    'creditcard',
    'credit_card',
    'ssn',
    'social_security',
    'bankaccount',
    'bank_account',
    'cvv',
    'pin',
    'privatekey',
    'private_key',
  ];

  const sanitize = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;

    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();

      // Redact sensitive keys
      if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
        sanitized[key] = '[REDACTED]';
        continue;
      }

      // Partially mask email addresses
      if (lowerKey.includes('email') && typeof value === 'string' && value.includes('@')) {
        const [local, domain] = value.split('@');
        sanitized[key] = `${local.substring(0, 2)}***@${domain}`;
        continue;
      }

      // Partially mask IDs (show first 4 chars only)
      if (
        (lowerKey.includes('id') || lowerKey.includes('uuid')) &&
        typeof value === 'string' &&
        value.length > 8
      ) {
        sanitized[key] = `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
        continue;
      }

      // Recursively sanitize nested objects
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  };

  return sanitize(data);
}

/**
 * Validate request parameters against schema
 */
export function validateRequestParams(
  params: Record<string, any>,
  schema: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'email' | 'uuid' | 'url';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
  }>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  for (const [key, rules] of Object.entries(schema)) {
    if (rules.required && (params[key] === undefined || params[key] === null || params[key] === '')) {
      errors.push(`${key} is required`);
      continue;
    }

    // Skip validation if field is not required and not provided
    if (!rules.required && (params[key] === undefined || params[key] === null)) {
      continue;
    }

    const value = params[key];

    // Type validation
    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`${key} must be a string`);
          break;
        }
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${key} must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${key} must be at most ${rules.maxLength} characters`);
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${key} has invalid format`);
        }
        break;

      case 'number':
        if (typeof value !== 'number' && isNaN(Number(value))) {
          errors.push(`${key} must be a number`);
          break;
        }
        const numValue = Number(value);
        if (rules.min !== undefined && numValue < rules.min) {
          errors.push(`${key} must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && numValue > rules.max) {
          errors.push(`${key} must be at most ${rules.max}`);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
          errors.push(`${key} must be a boolean`);
        }
        break;

      case 'email':
        if (!validateEmail(value)) {
          errors.push(`${key} must be a valid email address`);
        }
        break;

      case 'uuid':
        if (!validateUuid(value)) {
          errors.push(`${key} must be a valid UUID`);
        }
        break;

      case 'url':
        if (!ValidationRules.url.test(value)) {
          errors.push(`${key} must be a valid URL`);
        }
        break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Rate limiter for client-side operations
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxAttempts: number;

  constructor(windowMs: number = 60000, maxAttempts: number = 5) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  /**
   * Check if action is allowed
   */
  check(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter((time) => now - time < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      // Log rate limit event
      errorMonitor.captureError(
        new Error(`Rate limit exceeded for ${key}`),
        {
          action: 'rate_limit_exceeded',
          metadata: {
            key: this.sanitizeKey(key),
            attempts: recentAttempts.length,
            maxAttempts: this.maxAttempts,
          },
        },
        'warning'
      );

      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return true;
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Sanitize key for logging
   */
  private sanitizeKey(key: string): string {
    // If key contains email or sensitive info, redact it
    if (key.includes('@')) {
      return key.replace(/^(.{2}).*(@.*)$/, '$1***$2');
    }
    return key.substring(0, 8) + '...';
  }
}

/**
 * Global rate limiters
 */
export const rateLimiters = {
  login: new RateLimiter(60000, 5), // 5 attempts per minute
  register: new RateLimiter(300000, 3), // 3 attempts per 5 minutes
  passwordReset: new RateLimiter(300000, 3), // 3 attempts per 5 minutes
  api: new RateLimiter(60000, 30), // 30 requests per minute
};

/**
 * Check for SQL injection patterns
 */
export function detectSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(;|\-\-|\/\*|\*\/|xp_|sp_)/i,
    /(UNION.*SELECT)/i,
    /(OR.*=.*)/i,
    /('|";|")/,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Check for XSS patterns
 */
export function detectXss(input: string): boolean {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Secure string comparison (constant time to prevent timing attacks)
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Generate secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars[array[i] % chars.length];
  }

  return token;
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`,
    };
  }

  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension ${extension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`,
    };
  }

  // Additional security: Check for double extensions
  const parts = file.name.toLowerCase().split('.');
  if (parts.length > 2) {
    return {
      valid: false,
      error: 'Files with multiple extensions are not allowed',
    };
  }

  return { valid: true };
}

/**
 * Check CORS origin
 */
export function isAllowedOrigin(origin: string, allowedOrigins: string[]): boolean {
  if (!origin) return false;

  // Exact match
  if (allowedOrigins.includes(origin)) return true;

  // Wildcard match
  return allowedOrigins.some((allowed) => {
    if (allowed.includes('*')) {
      const pattern = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$');
      return pattern.test(origin);
    }
    return false;
  });
}

/**
 * Detect suspicious activity patterns
 */
export class SecurityMonitor {
  private suspiciousPatterns = {
    rapidRequests: new Map<string, number[]>(),
    failedAuth: new Map<string, number>(),
    suspiciousIps: new Set<string>(),
  };

  /**
   * Track request pattern
   */
  trackRequest(userId: string, endpoint: string) {
    const key = `${userId}:${endpoint}`;
    const now = Date.now();
    const requests = this.suspiciousPatterns.rapidRequests.get(key) || [];

    // Keep only requests from last 10 seconds
    const recentRequests = requests.filter((time) => now - time < 10000);
    recentRequests.push(now);

    this.suspiciousPatterns.rapidRequests.set(key, recentRequests);

    // Alert if more than 20 requests in 10 seconds
    if (recentRequests.length > 20) {
      criticalEventLogger.logRBAC.accessDenied(
        endpoint,
        'rate_limit',
        'rapid_requests'
      );
      return false;
    }

    return true;
  }

  /**
   * Track failed authentication
   */
  trackFailedAuth(identifier: string): boolean {
    const count = this.suspiciousPatterns.failedAuth.get(identifier) || 0;
    this.suspiciousPatterns.failedAuth.set(identifier, count + 1);

    // Alert if more than 5 failures
    if (count + 1 > 5) {
      criticalEventLogger.logAuth.loginFailure('Too many failed attempts', {
        identifier: identifier.substring(0, 4) + '***',
        attempts: count + 1,
      });
      return false;
    }

    return true;
  }

  /**
   * Clear failed auth tracking
   */
  clearFailedAuth(identifier: string) {
    this.suspiciousPatterns.failedAuth.delete(identifier);
  }

  /**
   * Mark IP as suspicious
   */
  markSuspiciousIp(ip: string) {
    this.suspiciousPatterns.suspiciousIps.add(ip);
  }

  /**
   * Check if IP is suspicious
   */
  isSuspiciousIp(ip: string): boolean {
    return this.suspiciousPatterns.suspiciousIps.has(ip);
  }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor();
