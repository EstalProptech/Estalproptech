/**
 * ESTAL PROPTECH - SERVER EDGE FUNCTION (Single File Version)
 * Complete edge function with all dependencies included
 * Deploy this file directly to Supabase Dashboard as "server"
 * 
 * Routes prefix: /make-server-96250128/
 */

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import type { Context, Next } from 'npm:hono';

// ============================================================================
// SECURITY MIDDLEWARE (Inline)
// ============================================================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const blockedIPs = new Set<string>();
const failedAuthAttempts = new Map<string, { count: number; resetTime: number }>();

function securityHeaders() {
  return async (c: Context, next: Next) => {
    c.header('X-Frame-Options', 'DENY');
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-XSS-Protection', '1; mode=block');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    if (c.req.url.startsWith('https://')) {
      c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

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

function rateLimit(options: {
  windowMs: number;
  max: number;
  keyGenerator?: (c: Context) => string;
  skipSuccessfulRequests?: boolean;
}) {
  const { windowMs, max, keyGenerator, skipSuccessfulRequests = false } = options;

  return async (c: Context, next: Next) => {
    const key = keyGenerator ? keyGenerator(c) : getClientIP(c);
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

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

    c.header('X-RateLimit-Limit', max.toString());
    c.header('X-RateLimit-Remaining', (max - entry.count).toString());
    c.header('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000).toString());

    await next();

    if (skipSuccessfulRequests && c.res.status < 400) {
      entry.count--;
    }
  };
}

function validateInput(schema: Record<string, {
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

      for (const [field, rules] of Object.entries(schema)) {
        const value = body[field];

        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          continue;
        }

        if (!rules.required && (value === undefined || value === null)) {
          continue;
        }

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

function sanitizeRequest() {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const sanitized = sanitizeObject(body);
      c.req.bodyCache = { json: sanitized };
      await next();
    } catch (error) {
      await next();
    }
  };
}

function ipBlocking() {
  return async (c: Context, next: Next) => {
    const ip = getClientIP(c);

    if (blockedIPs.has(ip)) {
      console.warn(`Blocked request from ${sanitizeIP(ip)}`);
      return c.json({ error: 'Access denied' }, 403);
    }

    await next();
  };
}

function requireAuth() {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const token = authHeader.substring(7);

    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      );

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return c.json({ error: 'Invalid or expired token' }, 401);
      }

      c.set('user', user);
      c.set('userId', user.id);

      await next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return c.json({ error: 'Authentication failed' }, 401);
    }
  };
}

function requireRole(allowedRoles: string[]) {
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

function trackFailedAuth(identifier: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  let entry = failedAuthAttempts.get(identifier);

  if (!entry || now > entry.resetTime) {
    entry = { count: 1, resetTime: now + windowMs };
    failedAuthAttempts.set(identifier, entry);
    return true;
  }

  entry.count++;

  if (entry.count > 5) {
    blockedIPs.add(identifier);
    console.warn(`Blocking ${sanitizeIP(identifier)} due to failed auth attempts`);
    return false;
  }

  return true;
}

function clearFailedAuth(identifier: string) {
  failedAuthAttempts.delete(identifier);
}

function secureLogger() {
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

  let sanitized = str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

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

// ============================================================================
// KV STORE (Inline)
// ============================================================================

const KV_TABLE = "kv_store_96250128";

const kvClient = () => createClient(
  Deno.env.get("SUPABASE_URL") ?? '',
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? '',
);

const kvSet = async (key: string, value: any): Promise<void> => {
  const supabase = kvClient();
  const { error } = await supabase.from(KV_TABLE).upsert({ key, value });
  if (error) throw new Error(error.message);
};

const kvGet = async (key: string): Promise<any> => {
  const supabase = kvClient();
  const { data, error } = await supabase.from(KV_TABLE).select("value").eq("key", key).maybeSingle();
  if (error) throw new Error(error.message);
  return data?.value;
};

const kvDel = async (key: string): Promise<void> => {
  const supabase = kvClient();
  const { error } = await supabase.from(KV_TABLE).delete().eq("key", key);
  if (error) throw new Error(error.message);
};

const kvGetByPrefix = async (prefix: string): Promise<any[]> => {
  const supabase = kvClient();
  const { data, error } = await supabase.from(KV_TABLE).select("key, value").like("key", prefix + "%");
  if (error) throw new Error(error.message);
  return data?.map((d) => d.value) ?? [];
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================

const app = new Hono();

// Global security middleware
app.use('*', securityHeaders());
app.use('*', ipBlocking());
app.use('*', secureLogger());

// CORS configuration
app.use('*', cors({
  origin: (origin) => {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      /https:\/\/.*\.vercel\.app$/,
      /https:\/\/.*\.estal\.com$/,
    ];
    
    if (!origin) return null;
    
    return allowed.some((pattern) => {
      if (typeof pattern === 'string') {
        return origin === pattern;
      }
      return pattern.test(origin);
    }) ? origin : null;
  },
  credentials: true,
  maxAge: 86400,
}));

// Global rate limiting
app.use('*', rateLimit({
  windowMs: 60000,
  max: 100,
}));

// Health check
app.get('/make-server-96250128/health', (c) => {
  return c.json({ 
    status: 'ok', 
    message: 'Estal PropTech Server',
    timestamp: new Date().toISOString()
  });
});

// Signup endpoint
app.post(
  '/make-server-96250128/signup',
  rateLimit({ windowMs: 3600000, max: 3 }),
  validateInput({
    email: { type: 'email', required: true },
    password: { type: 'string', required: true, minLength: 8, maxLength: 128 },
    name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
    role: { type: 'string', required: true, pattern: /^(admin|accountant|owner)$/ },
  }),
  sanitizeRequest(),
  async (c) => {
    const ip = c.req.header('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    try {
      const { email, password, name, role } = await c.req.json();

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { name, role },
        email_confirm: true,
      });

      if (error) {
        console.error('Signup error (sanitized):', { code: error.code, status: error.status });
        trackFailedAuth(ip);
        
        if (error.message?.includes('already been registered') || error.code === 'email_exists') {
          return c.json({ 
            error: 'An account with this email already exists',
            code: 'user_exists'
          }, 409);
        }
        
        return c.json({ error: 'Registration failed. Please check your input.' }, 400);
      }

      if (!data.user) {
        return c.json({ error: 'User creation failed' }, 500);
      }

      clearFailedAuth(ip);
      console.log('✅ User created (sanitized ID):', data.user.id.substring(0, 8) + '...');

      return c.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name,
          role,
        },
      });
    } catch (error: any) {
      console.error('Signup exception:', { message: 'Registration failed' });
      trackFailedAuth(ip);
      return c.json({ error: 'Registration failed. Please try again later.' }, 500);
    }
  }
);

// User profile endpoints
app.get('/make-server-96250128/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (userId.startsWith('demo-')) {
      return c.json({ error: 'Demo profiles not stored' }, 404);
    }
    
    const profile = await kvGet(`user_profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json({ profile });
  } catch (error: any) {
    console.error('Error fetching profile:', { message: 'Profile fetch failed' });
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.post('/make-server-96250128/profile/:userId', sanitizeRequest(), async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (userId.startsWith('demo-')) {
      return c.json({ success: true, message: 'Demo profiles not stored' });
    }
    
    const profile = await c.req.json();
    await kvSet(`user_profile:${userId}`, profile);
    
    console.log('✅ User profile saved (sanitized)');
    
    return c.json({ success: true, profile });
  } catch (error: any) {
    console.error('Error saving profile:', { message: 'Profile save failed' });
    return c.json({ error: 'Failed to save profile' }, 500);
  }
});

app.get('/make-server-96250128/profiles', requireAuth(), requireRole(['admin']), async (c) => {
  try {
    const profiles = await kvGetByPrefix('user_profile:');
    return c.json({ profiles });
  } catch (error: any) {
    console.error('Error fetching profiles:', { message: 'Profiles fetch failed' });
    return c.json({ error: 'Failed to fetch profiles' }, 500);
  }
});

// Beta access endpoint
app.post('/make-server-96250128/beta-access', sanitizeRequest(), async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email || !email.includes('@')) {
      return c.json({ error: 'Valid email required' }, 400);
    }
    
    const timestamp = Date.now();
    const betaRequest = {
      id: timestamp,
      email,
      status: 'pending',
      requested_at: new Date().toISOString(),
    };
    
    await kvSet(`beta_request:${email}`, betaRequest);
    
    const betaList = await kvGet('beta_requests:list') || [];
    betaList.unshift(email);
    await kvSet('beta_requests:list', betaList);
    
    const count = await kvGet('beta_requests:count') || 0;
    await kvSet('beta_requests:count', count + 1);
    
    console.log('✅ Beta access request received:', email);
    
    return c.json({ success: true, message: 'Beta request received' });
  } catch (error: any) {
    console.error('Error processing beta request:', error);
    return c.json({ error: 'Failed to process request' }, 500);
  }
});

// Contact form submission
app.post('/make-server-96250128/contact', sanitizeRequest(), async (c) => {
  try {
    const contact = await c.req.json();
    const timestamp = Date.now();
    
    await kvSet(`contact:${timestamp}`, {
      ...contact,
      id: timestamp,
      submitted_at: new Date().toISOString(),
    });
    
    const contactsList = await kvGet('contacts:list') || [];
    contactsList.unshift(timestamp);
    await kvSet('contacts:list', contactsList);
    
    console.log('✅ Contact form submitted:', contact.email);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error processing contact:', error);
    return c.json({ error: 'Failed to process contact' }, 500);
  }
});

// Feedback submission
app.post('/make-server-96250128/feedback', sanitizeRequest(), async (c) => {
  try {
    const feedback = await c.req.json();
    const timestamp = Date.now();
    
    await kvSet(`feedback:${timestamp}`, {
      ...feedback,
      id: timestamp,
    });
    
    const feedbackList = await kvGet('feedback:list') || [];
    feedbackList.unshift(timestamp);
    await kvSet('feedback:list', feedbackList);
    
    const count = await kvGet('feedback:count') || 0;
    await kvSet('feedback:count', count + 1);
    
    if (feedback.nps) {
      const npsScores = await kvGet('nps:scores') || [];
      npsScores.push(feedback.nps);
      await kvSet('nps:scores', npsScores);
    }
    
    console.log('✅ Feedback received:', feedback.type);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error processing feedback:', error);
    return c.json({ error: 'Failed to submit feedback' }, 500);
  }
});

// Error rate metrics
app.get('/make-server-96250128/metrics/error-rate', async (c) => {
  try {
    const errorCount = await kvGet('metrics:errors:last5min') || 0;
    const requestCount = await kvGet('metrics:requests:last5min') || 1;
    const errorRate = errorCount / requestCount;
    
    return c.json({ rate: errorRate, errors: errorCount, requests: requestCount });
  } catch (error: any) {
    return c.json({ rate: 0, errors: 0, requests: 0 });
  }
});

// Serve the Hono app
Deno.serve(app.fetch);

console.log('🚀 Estal PropTech Server Edge Function - Running');
console.log('📦 Routes prefix: /make-server-96250128/');
