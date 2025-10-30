/**
 * Security Middleware for Hono Server
 * Implements rate limiting, input validation, CSP headers, and request sanitization
 */

import type { Context, Next } from 'npm:hono';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// IP blocking store
const blockedIPs = new Set<string>();

// Failed auth attempts tracker
const failedAuthAttempts = new Map<string, { count: number; resetTime: number }>();

/**
 * Security headers middleware
 */
export function securityHeaders() {
  return async (c: Context, next: Next) => {
    // Set security headers
    c.header('X-Frame-Options', 'DENY');
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-XSS-Protection', '1; mode=block');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // HSTS (only on HTTPS)
    if (c.req.url.startsWith('https://')) {
      c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // Content Security Policy
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ];
    c.header('Content-Security-Policy', cspDirectives.join('; '));

    await next();
  };
}

/**
 * Rate limiting middleware
 */
export function rateLimit(options: {
  windowMs: number;
  max: number;
  keyGenerator?: (c: Context) => string;
  skipSuccessfulRequests?: boolean;
}) {
  const { windowMs, max, keyGenerator, skipSuccessfulRequests = false } = options;

  return async (c: Context, next: Next) => {
    const key = keyGenerator ? keyGenerator(c) : getClientIP(c);
    const now = Date.now();

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
      rateLimitStore.set(key, entry);
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > max) {
      console.warn(`Rate limit exceeded for ${sanitizeIP(key)}`);
      return c.json(
        {
          error: 'Too many requests',
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        },
        429
      );
    }

    // Add rate limit headers
    c.header('X-RateLimit-Limit', max.toString());
    c.header('X-RateLimit-Remaining', (max - entry.count).toString());
    c.header('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000).toString());

    await next();

    // Reset counter if request was successful and skipSuccessfulRequests is true
    if (skipSuccessfulRequests && c.res.status < 400) {
      entry.count--;
    }
  };
}

/**
 * Input validation middleware
 */
export function validateInput(schema: Record<string, {
  type: 'string' | 'number' | 'boolean' | 'email' | 'uuid';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}>) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const errors: string[] = [];

      // Validate each field
      for (const [field, rules] of Object.entries(schema)) {
        const value = body[field];

        // Check required
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          continue;
        }

        // Skip if not required and not provided
        if (!rules.required && (value === undefined || value === null)) {
          continue;
        }

        // Type validation
        switch (rules.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`${field} must be a string`);
              break;
            }
            if (rules.minLength && value.length < rules.minLength) {
              errors.push(`${field} must be at least ${rules.minLength} characters`);
            }
            if (rules.maxLength && value.length > rules.maxLength) {
              errors.push(`${field} must be at most ${rules.maxLength} characters`);
            }
            if (rules.pattern && !rules.pattern.test(value)) {
              errors.push(`${field} has invalid format`);
            }
            break;

          case 'email':
            if (typeof value !== 'string' || !isValidEmail(value)) {
              errors.push(`${field} must be a valid email`);
            }
            break;

          case 'uuid':
            if (typeof value !== 'string' || !isValidUUID(value)) {
              errors.push(`${field} must be a valid UUID`);
            }
            break;

          case 'number':
            if (typeof value !== 'number' && isNaN(Number(value))) {
              errors.push(`${field} must be a number`);
            }
            break;

          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`${field} must be a boolean`);
            }
            break;
        }
      }

      if (errors.length > 0) {
        return c.json({ error: 'Validation failed', details: errors }, 400);
      }

      await next();
    } catch (error) {
      return c.json({ error: 'Invalid JSON body' }, 400);
    }
  };
}

/**
 * Request sanitization middleware
 */
export function sanitizeRequest() {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      
      // Sanitize all string values
      const sanitized = sanitizeObject(body);
      
      // Replace request body with sanitized version
      c.req.bodyCache = {
        json: sanitized,
      };

      await next();
    } catch (error) {
      // If JSON parsing fails, continue (will be handled by validation)
      await next();
    }
  };
}

/**
 * IP blocking middleware
 */
export function ipBlocking() {
  return async (c: Context, next: Next) => {
    const ip = getClientIP(c);

    if (blockedIPs.has(ip)) {
      console.warn(`Blocked request from ${sanitizeIP(ip)}`);
      return c.json({ error: 'Access denied' }, 403);
    }

    await next();
  };
}

/**
 * Authentication middleware
 */
export function requireAuth() {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const token = authHeader.substring(7);

    try {
      // Verify token with Supabase
      const { createClient } = await import('jsr:@supabase/supabase-js@2');
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      );

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return c.json({ error: 'Invalid or expired token' }, 401);
      }

      // Attach user to context
      c.set('user', user);
      c.set('userId', user.id);

      await next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return c.json({ error: 'Authentication failed' }, 401);
    }
  };
}

/**
 * Role-based access control middleware
 */
export function requireRole(allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const userRole = user.user_metadata?.role || 'owner';

    if (!allowedRoles.includes(userRole) && !allowedRoles.includes('*')) {
      console.warn(`Access denied for role ${userRole} to ${c.req.path}`);
      return c.json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: userRole,
      }, 403);
    }

    await next();
  };
}

/**
 * Track failed authentication attempts
 */
export function trackFailedAuth(identifier: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  let entry = failedAuthAttempts.get(identifier);

  if (!entry || now > entry.resetTime) {
    entry = { count: 1, resetTime: now + windowMs };
    failedAuthAttempts.set(identifier, entry);
    return true;
  }

  entry.count++;

  // Block if more than 5 failed attempts
  if (entry.count > 5) {
    blockedIPs.add(identifier);
    console.warn(`Blocking ${sanitizeIP(identifier)} due to failed auth attempts`);
    return false;
  }

  return true;
}

/**
 * Clear failed auth attempts
 */
export function clearFailedAuth(identifier: string) {
  failedAuthAttempts.delete(identifier);
}

// Helper functions

function getClientIP(c: Context): string {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
    c.req.header('x-real-ip') ||
    'unknown'
  );
}

function sanitizeIP(ip: string): string {
  if (ip === 'unknown') return ip;
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***. ***`;
  }
  return ip.substring(0, 8) + '***';
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function sanitizeString(str: string): string {
  if (typeof str !== 'string') return str;

  // Remove potential XSS patterns
  let sanitized = str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  // Limit length
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized.trim();
}

function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }

  return sanitized;
}

/**
 * Request logging with sanitization
 */
export function secureLogger() {
  return async (c: Context, next: Next) => {
    const start = Date.now();
    const method = c.req.method;
    const path = c.req.path;
    const ip = sanitizeIP(getClientIP(c));

    await next();

    const duration = Date.now() - start;
    const status = c.res.status;

    console.log(`[${new Date().toISOString()}] ${method} ${path} ${status} ${duration}ms (IP: ${ip})`);
  };
}
