import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  securityHeaders,
  rateLimit,
  validateInput,
  sanitizeRequest,
  ipBlocking,
  requireAuth,
  requireRole,
  trackFailedAuth,
  clearFailedAuth,
  secureLogger,
} from './securityMiddleware.ts';

const app = new Hono();

// Global security middleware
app.use('*', securityHeaders());
app.use('*', ipBlocking());
app.use('*', secureLogger());

// CORS with strict configuration
app.use('*', cors({
  origin: (origin) => {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      /https:\/\/.*\.vercel\.app$/,
      /https:\/\/.*\.estal\.com$/,
      /https:\/\/.*estalproptech\.com$/,
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

// Global rate limiting (100 requests per minute)
app.use('*', rateLimit({
  windowMs: 60000,
  max: 100,
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', message: 'Estal PropTech Server', timestamp: new Date().toISOString() });
});

// Import KV store utilities
import * as kv from './kv_store.ts';

// Signup endpoint with auto email confirmation
app.post(
  '/signup',
  rateLimit({ windowMs: 3600000, max: 3 }), // 3 signups per hour
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

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create user with admin API and auto-confirm email
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
});

// Confirm existing user's email
app.post(
  '/confirm-user',
  rateLimit({ windowMs: 900000, max: 5 }),
  validateInput({
    email: { type: 'email', required: true },
  }),
  sanitizeRequest(),
  async (c) => {
    try {
      const { email } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: userData, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error listing users:', getUserError);
      return c.json({ error: 'Failed to find user' }, 500);
    }

    const user = userData.users.find(u => u.email === email);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('Error confirming user email:', updateError);
      return c.json({ error: 'Failed to confirm email' }, 500);
    }

    return c.json({
      success: true,
      message: 'Email confirmed successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Confirm user exception:', { message: 'Failed to confirm email' });
    return c.json({ error: 'Email confirmation failed' }, 500);
  }
});

// User profile endpoints
app.get('/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (userId.startsWith('demo-')) {
      return c.json({ error: 'Demo profiles not stored' }, 404);
    }
    
    const profile = await kv.get(`user_profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json({ profile });
  } catch (error: any) {
    console.error('Error fetching profile:', { message: 'Profile fetch failed' });
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.post('/profile/:userId', sanitizeRequest(), async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (userId.startsWith('demo-')) {
      return c.json({ success: true, message: 'Demo profiles not stored' });
    }
    
    const profile = await c.req.json();
    await kv.set(`user_profile:${userId}`, profile);
    
    return c.json({ success: true, profile });
  } catch (error: any) {
    console.error('Error saving profile:', { message: 'Profile save failed' });
    return c.json({ error: 'Failed to save profile' }, 500);
  }
});

app.get('/profiles', requireAuth(), requireRole(['admin']), async (c) => {
  try {
    const profiles = await kv.getByPrefix('user_profile:');
    return c.json({ profiles });
  } catch (error: any) {
    console.error('Error fetching profiles:', { message: 'Profiles fetch failed' });
    return c.json({ error: 'Failed to fetch profiles' }, 500);
  }
});

// Data seeding endpoint
import { seedAllData } from './seed-data.ts';

app.post('/seed-data', requireAuth(), requireRole(['admin']), async (c) => {
  try {
    console.log('🌱 Starting data seeding...');
    const summary = await seedAllData();
    return c.json({ success: true, message: 'Data seeded successfully', summary });
  } catch (error: any) {
    console.error('❌ Seeding error:', error);
    return c.json({ error: error?.message || 'Failed to seed data' }, 500);
  }
});

// Deployment tracking
app.post('/deployments', async (c) => {
  try {
    const deployment = await c.req.json();
    const timestamp = Date.now();
    
    await kv.set(`deployment:${timestamp}`, {
      ...deployment,
      id: timestamp,
      recorded_at: new Date().toISOString(),
    });
    
    const deploymentsList = await kv.get('deployments:list') || [];
    deploymentsList.unshift(timestamp);
    
    if (deploymentsList.length > 100) {
      deploymentsList.splice(100);
    }
    
    await kv.set('deployments:list', deploymentsList);
    return c.json({ success: true, deployment });
  } catch (error: any) {
    return c.json({ error: 'Failed to record deployment' }, 500);
  }
});

app.get('/deployments', requireAuth(), requireRole(['admin']), async (c) => {
  try {
    const deploymentsList = await kv.get('deployments:list') || [];
    const limit = parseInt(c.req.query('limit') || '20');
    
    const deployments = await Promise.all(
      deploymentsList.slice(0, limit).map(async (id: number) => await kv.get(`deployment:${id}`))
    );
    
    return c.json({ deployments: deployments.filter(Boolean) });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch deployments' }, 500);
  }
});

app.get('/metrics/error-rate', async (c) => {
  try {
    const errorCount = await kv.get('metrics:errors:last5min') || 0;
    const requestCount = await kv.get('metrics:requests:last5min') || 1;
    const errorRate = errorCount / requestCount;
    
    return c.json({ rate: errorRate, errors: errorCount, requests: requestCount });
  } catch (error: any) {
    return c.json({ rate: 0, errors: 0, requests: 0 });
  }
});

// Beta launch endpoints
app.post('/beta-access', sanitizeRequest(), async (c) => {
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
    
    await kv.set(`beta_request:${email}`, betaRequest);
    
    const betaList = await kv.get('beta_requests:list') || [];
    betaList.unshift(email);
    await kv.set('beta_requests:list', betaList);
    
    const count = await kv.get('beta_requests:count') || 0;
    await kv.set('beta_requests:count', count + 1);
    
    return c.json({ success: true, message: 'Beta request received' });
  } catch (error: any) {
    return c.json({ error: 'Failed to process request' }, 500);
  }
});

app.post('/contact', sanitizeRequest(), async (c) => {
  try {
    const contact = await c.req.json();
    const timestamp = Date.now();
    
    await kv.set(`contact:${timestamp}`, {
      ...contact,
      id: timestamp,
      submitted_at: new Date().toISOString(),
    });
    
    const contactsList = await kv.get('contacts:list') || [];
    contactsList.unshift(timestamp);
    await kv.set('contacts:list', contactsList);
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: 'Failed to process contact' }, 500);
  }
});

app.post('/feedback', sanitizeRequest(), async (c) => {
  try {
    const feedback = await c.req.json();
    const timestamp = Date.now();
    
    await kv.set(`feedback:${timestamp}`, { ...feedback, id: timestamp });
    
    const feedbackList = await kv.get('feedback:list') || [];
    feedbackList.unshift(timestamp);
    await kv.set('feedback:list', feedbackList);
    
    const count = await kv.get('feedback:count') || 0;
    await kv.set('feedback:count', count + 1);
    
    if (feedback.nps) {
      const npsScores = await kv.get('nps:scores') || [];
      npsScores.push(feedback.nps);
      await kv.set('nps:scores', npsScores);
    }
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: 'Failed to submit feedback' }, 500);
  }
});

// Serve the Hono app
serve(app.fetch);
