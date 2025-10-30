/**
 * Security Configuration
 * Central configuration for all security settings
 */

export const SecurityConfig = {
  /**
   * Content Security Policy
   */
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for React and Vite in development
        "'unsafe-eval'", // Required for Vite HMR in development
        'https://cdn.jsdelivr.net',
        'https://*.supabase.co',
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for styled components
        'https://fonts.googleapis.com',
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'data:',
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https:',
        'https://*.unsplash.com',
        'https://*.supabase.co',
      ],
      'connect-src': [
        "'self'",
        'https://*.supabase.co',
        'wss://*.supabase.co',
        'https://api.unsplash.com',
      ],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'upgrade-insecure-requests': [],
    },
    reportOnly: false, // Set to true for testing, false for enforcement
  },

  /**
   * Cookie settings
   */
  cookies: {
    secure: true, // HTTPS only
    httpOnly: true, // Not accessible via JavaScript
    sameSite: 'strict' as const, // CSRF protection
    maxAge: 86400, // 24 hours
    path: '/',
  },

  /**
   * CORS settings
   */
  cors: {
    allowedOrigins: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://*.vercel.app',
      'https://*.estal.com',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  /**
   * Rate limiting settings
   */
  rateLimit: {
    // Global API rate limit
    global: {
      windowMs: 60000, // 1 minute
      max: 100, // 100 requests per minute
    },
    // Auth endpoints
    auth: {
      windowMs: 900000, // 15 minutes
      max: 5, // 5 attempts
    },
    // Login specific
    login: {
      windowMs: 900000, // 15 minutes
      max: 5,
    },
    // Registration
    register: {
      windowMs: 3600000, // 1 hour
      max: 3,
    },
    // Password reset
    passwordReset: {
      windowMs: 3600000, // 1 hour
      max: 3,
    },
    // File upload
    upload: {
      windowMs: 60000, // 1 minute
      max: 10,
    },
  },

  /**
   * Password requirements
   */
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLength: 128,
  },

  /**
   * File upload restrictions
   */
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx'],
    virusScanEnabled: false, // Would require external service
  },

  /**
   * Session settings
   */
  session: {
    timeout: 3600000, // 1 hour
    refreshThreshold: 300000, // 5 minutes before expiry
    maxConcurrentSessions: 3,
  },

  /**
   * Encryption settings
   */
  encryption: {
    algorithm: 'AES-256-GCM',
    keyDerivation: 'PBKDF2',
    iterations: 100000,
  },

  /**
   * Audit logging
   */
  audit: {
    enabled: true,
    sensitiveActions: [
      'user.create',
      'user.delete',
      'user.role.change',
      'payment.process',
      'data.export',
      'settings.security.change',
    ],
    retentionDays: 90,
  },

  /**
   * IP blocking
   */
  ipBlocking: {
    enabled: true,
    maxFailedAttempts: 10,
    blockDurationMs: 3600000, // 1 hour
  },

  /**
   * Data sanitization rules
   */
  sanitization: {
    stripHtml: true,
    escapeSpecialChars: true,
    maxStringLength: 10000,
    allowedHtmlTags: [], // Empty = no HTML allowed
  },

  /**
   * Security headers
   */
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  },

  /**
   * RBAC (Role-Based Access Control) Rules
   */
  rbac: {
    admin: {
      allowedViews: ['*'], // Full access
      allowedActions: ['*'],
    },
    accountant: {
      allowedViews: [
        'dashboard',
        'financial-reports',
        'clients',
        'settings',
        'help',
      ],
      allowedActions: [
        'view.financial',
        'export.financial',
        'view.clients',
        'edit.invoices',
      ],
    },
    owner: {
      allowedViews: [
        'dashboard',
        'properties',
        'maintenance',
        'financial-reports',
        'settings',
        'help',
      ],
      allowedActions: [
        'view.properties',
        'view.maintenance',
        'create.maintenance',
        'view.financial',
      ],
    },
  },

  /**
   * Compliance settings
   */
  compliance: {
    gdpr: {
      enabled: true,
      dataRetentionDays: 730, // 2 years
      rightToErasure: true,
      dataPortability: true,
    },
    pci: {
      enabled: false, // Set to true if handling credit card data
      tokenizationRequired: true,
    },
    hipaa: {
      enabled: false, // Set to true if handling health data
    },
  },

  /**
   * Incident response thresholds
   */
  incidentResponse: {
    criticalThresholds: {
      authFailureRate: 0.2, // 20% failure rate
      errorRate: 0.05, // 5% error rate
      unusualActivity: 10, // 10 suspicious events per hour
    },
    alertingChannels: {
      email: 'security@estal.com',
      slack: false, // Would require webhook URL
      sms: false, // Would require SMS service
    },
  },
};

/**
 * Get CSP header value
 */
export function getCspHeader(): string {
  const { directives } = SecurityConfig.csp;
  const policies: string[] = [];

  for (const [directive, values] of Object.entries(directives)) {
    if (Array.isArray(values) && values.length > 0) {
      policies.push(`${directive} ${values.join(' ')}`);
    } else if (Array.isArray(values) && values.length === 0) {
      policies.push(directive);
    }
  }

  return policies.join('; ');
}

/**
 * Get all security headers
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    ...SecurityConfig.headers,
    'Content-Security-Policy': SecurityConfig.csp.reportOnly
      ? undefined!
      : getCspHeader(),
    'Content-Security-Policy-Report-Only': SecurityConfig.csp.reportOnly
      ? getCspHeader()
      : undefined!,
  };
}

/**
 * Check if user has permission for action
 */
export function hasPermission(
  role: 'admin' | 'accountant' | 'owner',
  action: string
): boolean {
  const permissions = SecurityConfig.rbac[role];

  // Admin has all permissions
  if (permissions.allowedActions.includes('*')) return true;

  // Check specific permission
  return permissions.allowedActions.includes(action);
}

/**
 * Check if user can access view
 */
export function canAccessView(
  role: 'admin' | 'accountant' | 'owner',
  view: string
): boolean {
  const permissions = SecurityConfig.rbac[role];

  // Admin has all access
  if (permissions.allowedViews.includes('*')) return true;

  // Check specific view
  return permissions.allowedViews.includes(view);
}
