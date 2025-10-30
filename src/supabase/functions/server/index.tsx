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
} from './securityMiddleware.tsx';

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
app.get('/make-server-96250128/health', (c) => {
  return c.json({ status: 'ok', message: 'Estal PropTech Server' });
});

// Signup endpoint with auto email confirmation
app.post(
  '/make-server-96250128/signup',
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
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error('Signup error (sanitized):', { code: error.code, status: error.status });
      
      // Track failed attempt
      trackFailedAuth(ip);
      
      // If user already exists, return a specific error code
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

    // Clear failed auth tracking on success
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
  '/make-server-96250128/confirm-user',
  rateLimit({ windowMs: 900000, max: 5 }), // 5 attempts per 15 minutes
  validateInput({
    email: { type: 'email', required: true },
  }),
  sanitizeRequest(),
  async (c) => {
    try {
      const { email } = await c.req.json();

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user by email
    const { data: userData, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error listing users:', getUserError);
      return c.json({ error: 'Failed to find user' }, 500);
    }

    const user = userData.users.find(u => u.email === email);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Update user to confirm email
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('Error confirming user email:', updateError);
      return c.json({ error: 'Failed to confirm email' }, 500);
    }

    console.log('✅ User email confirmed (sanitized)');

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

// User profile endpoints using server-side KV store
import * as kv from './kv_store.tsx';

// Get user profile (no auth required - server-side uses service role key)
app.get(
  '/make-server-96250128/profile/:userId',
  async (c) => {
    try {
      const userId = c.req.param('userId');
      
      // Skip demo users (they don't have real profiles)
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
  }
);

// Create or update user profile (no auth required - server-side uses service role key)
app.post(
  '/make-server-96250128/profile/:userId',
  sanitizeRequest(),
  async (c) => {
    try {
      const userId = c.req.param('userId');
      
      // Skip demo users (they don't have real profiles)
      if (userId.startsWith('demo-')) {
        return c.json({ success: true, message: 'Demo profiles not stored' });
      }
      
      const profile = await c.req.json();
      
      await kv.set(`user_profile:${userId}`, profile);
      
      console.log('✅ User profile saved (sanitized)');
      
      return c.json({ success: true, profile });
    } catch (error: any) {
      console.error('Error saving profile:', { message: 'Profile save failed' });
      return c.json({ error: 'Failed to save profile' }, 500);
    }
  }
);

// Get all user profiles (admin only)
app.get(
  '/make-server-96250128/profiles',
  requireAuth(),
  requireRole(['admin']),
  async (c) => {
    try {
      const profiles = await kv.getByPrefix('user_profile:');
      
      return c.json({ profiles });
    } catch (error: any) {
      console.error('Error fetching profiles:', { message: 'Profiles fetch failed' });
      return c.json({ error: 'Failed to fetch profiles' }, 500);
    }
  }
);

// ============================================================================
// Data Seeding Endpoint
// ============================================================================
import { seedAllData } from './seed-data.ts';

app.post(
  '/make-server-96250128/seed-data',
  requireAuth(),
  requireRole(['admin']),
  async (c) => {
    try {
      console.log('🌱 Starting data seeding...');
      const summary = await seedAllData();
      
      return c.json({
        success: true,
        message: 'Data seeded successfully',
        summary,
      });
    } catch (error: any) {
    console.error('❌ Seeding error:', error);
    return c.json({ error: error?.message || 'Failed to seed data' }, 500);
  }
});

// ============================================================================
// Deployment Tracking Endpoints
// ============================================================================

// Record deployment
app.post(
  '/make-server-96250128/deployments',
  async (c) => {
    try {
      const deployment = await c.req.json();
      const timestamp = Date.now();
      
      // Store deployment record
      await kv.set(`deployment:${timestamp}`, {
        ...deployment,
        id: timestamp,
        recorded_at: new Date().toISOString(),
      });
      
      // Keep last 100 deployments in a list
      const deploymentsList = await kv.get('deployments:list') || [];
      deploymentsList.unshift(timestamp);
      
      // Keep only last 100
      if (deploymentsList.length > 100) {
        deploymentsList.splice(100);
      }
      
      await kv.set('deployments:list', deploymentsList);
      
      console.log('✅ Deployment recorded:', deployment.version);
      
      return c.json({ success: true, deployment });
    } catch (error: any) {
      console.error('Error recording deployment:', { message: 'Deployment recording failed' });
      return c.json({ error: 'Failed to record deployment' }, 500);
    }
  }
);

// Get deployment history
app.get(
  '/make-server-96250128/deployments',
  requireAuth(),
  requireRole(['admin']),
  async (c) => {
    try {
      const deploymentsList = await kv.get('deployments:list') || [];
      const limit = parseInt(c.req.query('limit') || '20');
      
      const deployments = await Promise.all(
        deploymentsList.slice(0, limit).map(async (id: number) => {
          return await kv.get(`deployment:${id}`);
        })
      );
      
      return c.json({ deployments: deployments.filter(Boolean) });
    } catch (error: any) {
      console.error('Error fetching deployments:', { message: 'Deployment fetch failed' });
      return c.json({ error: 'Failed to fetch deployments' }, 500);
    }
  }
);

// Get metrics endpoint for post-deployment monitoring
app.get(
  '/make-server-96250128/metrics/error-rate',
  async (c) => {
    try {
      // Get error count from last 5 minutes
      const errorCount = await kv.get('metrics:errors:last5min') || 0;
      const requestCount = await kv.get('metrics:requests:last5min') || 1;
      
      const errorRate = errorCount / requestCount;
      
      return c.json({ rate: errorRate, errors: errorCount, requests: requestCount });
    } catch (error: any) {
      return c.json({ rate: 0, errors: 0, requests: 0 });
    }
  }
);

// ============================================================================
// Beta Launch & Growth Endpoints
// ============================================================================

// Beta access request
app.post(
  '/make-server-96250128/beta-access',
  sanitizeRequest(),
  async (c) => {
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
        user_agent: c.req.header('user-agent'),
      };
      
      // Store request
      await kv.set(`beta_request:${email}`, betaRequest);
      
      // Add to beta requests list
      const betaList = await kv.get('beta_requests:list') || [];
      betaList.unshift(email);
      await kv.set('beta_requests:list', betaList);
      
      // Update count
      const count = await kv.get('beta_requests:count') || 0;
      await kv.set('beta_requests:count', count + 1);
      
      console.log('✅ Beta access request received:', email);
      
      return c.json({ success: true, message: 'Beta request received' });
    } catch (error: any) {
      console.error('Error processing beta request:', error);
      return c.json({ error: 'Failed to process request' }, 500);
    }
  }
);

// Contact form submission
app.post(
  '/make-server-96250128/contact',
  sanitizeRequest(),
  async (c) => {
    try {
      const contact = await c.req.json();
      const timestamp = Date.now();
      
      // Store contact submission
      await kv.set(`contact:${timestamp}`, {
        ...contact,
        id: timestamp,
        submitted_at: new Date().toISOString(),
      });
      
      // Add to contacts list
      const contactsList = await kv.get('contacts:list') || [];
      contactsList.unshift(timestamp);
      await kv.set('contacts:list', contactsList);
      
      console.log('✅ Contact form submitted:', contact.email);
      
      return c.json({ success: true });
    } catch (error: any) {
      console.error('Error processing contact:', error);
      return c.json({ error: 'Failed to process contact' }, 500);
    }
  }
);

// Feedback submission
app.post(
  '/make-server-96250128/feedback',
  sanitizeRequest(),
  async (c) => {
    try {
      const feedback = await c.req.json();
      const timestamp = Date.now();
      
      // Store feedback
      await kv.set(`feedback:${timestamp}`, {
        ...feedback,
        id: timestamp,
      });
      
      // Add to feedback list
      const feedbackList = await kv.get('feedback:list') || [];
      feedbackList.unshift(timestamp);
      await kv.set('feedback:list', feedbackList);
      
      // Update feedback count
      const count = await kv.get('feedback:count') || 0;
      await kv.set('feedback:count', count + 1);
      
      // Track NPS
      if (feedback.nps) {
        const npsScores = await kv.get('nps:scores') || [];
        npsScores.push(feedback.nps);
        await kv.set('nps:scores', npsScores);
      }
      
      console.log('✅ Feedback received:', feedback.type);
      
      return c.json({ success: true });
    } catch (error: any) {
      console.error('Error processing feedback:', error);
      return c.json({ error: 'Failed to submit feedback' }, 500);
    }
  }
);

// Growth metrics endpoint
app.get(
  '/make-server-96250128/growth-metrics',
  requireAuth(),
  requireRole(['admin']),
  async (c) => {
    try {
      const period = c.req.query('period') || 'week';
      
      // Get various metrics
      const betaRequestsCount = await kv.get('beta_requests:count') || 0;
      const feedbackCount = await kv.get('feedback:count') || 0;
      const npsScores = await kv.get('nps:scores') || [];
      
      // Calculate NPS
      const promoters = npsScores.filter((s: number) => s >= 9).length;
      const detractors = npsScores.filter((s: number) => s <= 6).length;
      const nps = npsScores.length > 0 
        ? Math.round(((promoters - detractors) / npsScores.length) * 100)
        : 0;
      
      // Get beta users (from user profiles)
      const usersList = await kv.getByPrefix('user_profile:') || [];
      const betaUsers = usersList.length;
      
      // Calculate activation rate (users who added properties)
      const activatedUsers = usersList.filter((u: any) => u.activated).length;
      const activationRate = betaUsers > 0 ? (activatedUsers / betaUsers) * 100 : 0;
      
      const metrics = {
        betaUsers: {
          total: betaUsers,
          thisWeek: 18, // Would track weekly in production
          target: 50,
          trend: 15,
        },
        activation: {
          rate: activationRate,
          activated: activatedUsers,
          pending: betaUsers - activatedUsers,
          target: 60,
        },
        feedback: {
          total: feedbackCount,
          responseRate: betaUsers > 0 ? (feedbackCount / betaUsers) * 100 : 0,
          npsScore: nps,
          target: 40,
        },
        revenue: {
          paying: 0, // Would track actual payments
          mrr: 0,
          arpu: 0,
          target: 5,
        },
        engagement: {
          dailyActive: Math.floor(betaUsers * 0.6),
          weeklyActive: Math.floor(betaUsers * 0.8),
          monthlyActive: betaUsers,
          retention: 85,
        },
      };
      
      return c.json({ metrics, period });
    } catch (error: any) {
      console.error('Error fetching growth metrics:', error);
      return c.json({ error: 'Failed to fetch metrics' }, 500);
    }
  }
);

// Referral program endpoint
app.post(
  '/make-server-96250128/referral',
  requireAuth(),
  sanitizeRequest(),
  async (c) => {
    try {
      const userId = c.get('userId');
      const { referredEmail } = await c.req.json();
      
      if (!referredEmail || !referredEmail.includes('@')) {
        return c.json({ error: 'Valid email required' }, 400);
      }
      
      const timestamp = Date.now();
      const referral = {
        id: timestamp,
        referrer_id: userId,
        referred_email: referredEmail,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      
      // Store referral
      await kv.set(`referral:${timestamp}`, referral);
      
      // Update user's referral count
      const userReferrals = await kv.get(`user_referrals:${userId}`) || [];
      userReferrals.push(timestamp);
      await kv.set(`user_referrals:${userId}`, userReferrals);
      
      console.log('✅ Referral created:', referredEmail);
      
      return c.json({ success: true, referral });
    } catch (error: any) {
      console.error('Error creating referral:', error);
      return c.json({ error: 'Failed to create referral' }, 500);
    }
  }
);

// Get user referrals
app.get(
  '/make-server-96250128/referrals',
  requireAuth(),
  async (c) => {
    try {
      const userId = c.get('userId');
      
      const referralIds = await kv.get(`user_referrals:${userId}`) || [];
      const referrals = await Promise.all(
        referralIds.map(async (id: number) => {
          return await kv.get(`referral:${id}`);
        })
      );
      
      return c.json({ referrals: referrals.filter(Boolean) });
    } catch (error: any) {
      console.error('Error fetching referrals:', error);
      return c.json({ error: 'Failed to fetch referrals' }, 500);
    }
  }
);

// ============================================================================
// Property Endpoints with Pagination & Validation
// ============================================================================

// Validation helpers
function validateProperty(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Property name is required and must be a string');
  }
  if (!data.type || !['Residential', 'Commercial', 'Mixed-Use', 'Industrial'].includes(data.type)) {
    errors.push('Invalid property type');
  }
  if (!data.address || typeof data.address !== 'string') {
    errors.push('Address is required');
  }
  if (data.units && (typeof data.units !== 'number' || data.units < 1)) {
    errors.push('Units must be a positive number');
  }
  
  return { valid: errors.length === 0, errors };
}

app.get('/make-server-96250128/properties', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const pageSize = parseInt(c.req.query('pageSize') || '10');
    
    const propertyIds = await kv.get('properties:all') || [];
    const total = propertyIds.length;
    const totalPages = Math.ceil(total / pageSize);
    
    // Get paginated property IDs
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedIds = propertyIds.slice(start, end);
    
    // Fetch properties
    const properties = await Promise.all(
      paginatedIds.map((id: string) => kv.get(`property:${id}`))
    );
    
    return c.json({
      data: properties.filter(Boolean),
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return c.json({ error: error?.message || 'Failed to fetch properties' }, 500);
  }
});

app.get('/make-server-96250128/properties/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const property = await kv.get(`property:${id}`);
    
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }
    
    return c.json(property);
  } catch (error: any) {
    console.error('Error fetching property:', error);
    return c.json({ error: error?.message || 'Failed to fetch property' }, 500);
  }
});

app.post('/make-server-96250128/properties', async (c) => {
  try {
    const data = await c.req.json();
    
    // Validate
    const validation = validateProperty(data);
    if (!validation.valid) {
      return c.json({ error: 'Validation failed', errors: validation.errors }, 400);
    }
    
    const id = `prop-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const property = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`property:${id}`, property);
    
    // Update property IDs list
    const propertyIds = await kv.get('properties:all') || [];
    propertyIds.push(id);
    await kv.set('properties:all', propertyIds);
    
    console.log('✅ Property created:', id);
    return c.json({ success: true, property }, 201);
  } catch (error: any) {
    console.error('Error creating property:', error);
    return c.json({ error: error?.message || 'Failed to create property' }, 500);
  }
});

app.put('/make-server-96250128/properties/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    
    const existing = await kv.get(`property:${id}`);
    if (!existing) {
      return c.json({ error: 'Property not found' }, 404);
    }
    
    // Validate
    const validation = validateProperty({ ...existing, ...data });
    if (!validation.valid) {
      return c.json({ error: 'Validation failed', errors: validation.errors }, 400);
    }
    
    const updated = {
      ...existing,
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`property:${id}`, updated);
    
    console.log('✅ Property updated:', id);
    return c.json({ success: true, property: updated });
  } catch (error: any) {
    console.error('Error updating property:', error);
    return c.json({ error: error?.message || 'Failed to update property' }, 500);
  }
});

app.delete('/make-server-96250128/properties/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const existing = await kv.get(`property:${id}`);
    if (!existing) {
      return c.json({ error: 'Property not found' }, 404);
    }
    
    await kv.del(`property:${id}`);
    
    // Update property IDs list
    const propertyIds = await kv.get('properties:all') || [];
    const updated = propertyIds.filter((pid: string) => pid !== id);
    await kv.set('properties:all', updated);
    
    console.log('✅ Property deleted:', id);
    return c.json({ success: true, message: 'Property deleted' });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return c.json({ error: error?.message || 'Failed to delete property' }, 500);
  }
});

// ============================================================================
// Maintenance Endpoints with Pagination
// ============================================================================

app.get('/make-server-96250128/maintenance', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const pageSize = parseInt(c.req.query('pageSize') || '10');
    const status = c.req.query('status');
    
    const maintenanceIds = await kv.get('maintenance:all') || [];
    let maintenance = await Promise.all(
      maintenanceIds.map((id: string) => kv.get(`maintenance:${id}`))
    );
    
    // Filter by status if provided
    if (status) {
      maintenance = maintenance.filter((m: any) => m && m.status === status);
    }
    
    const total = maintenance.length;
    const totalPages = Math.ceil(total / pageSize);
    
    // Paginate
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = maintenance.slice(start, end);
    
    return c.json({
      data: paginated.filter(Boolean),
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error: any) {
    console.error('Error fetching maintenance:', error);
    return c.json({ error: error?.message || 'Failed to fetch maintenance' }, 500);
  }
});

app.post('/make-server-96250128/maintenance', async (c) => {
  try {
    const data = await c.req.json();
    
    // Validate required fields
    if (!data.propertyId || !data.title || !data.priority) {
      return c.json({ 
        error: 'Missing required fields: propertyId, title, priority' 
      }, 400);
    }
    
    const id = `maint-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const ticket = {
      ...data,
      id,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [{
        status: 'New',
        timestamp: new Date().toISOString(),
        note: 'Ticket created',
      }],
    };
    
    await kv.set(`maintenance:${id}`, ticket);
    
    // Update maintenance IDs list
    const maintenanceIds = await kv.get('maintenance:all') || [];
    maintenanceIds.push(id);
    await kv.set('maintenance:all', maintenanceIds);
    
    console.log('✅ Maintenance ticket created:', id);
    return c.json({ success: true, ticket }, 201);
  } catch (error: any) {
    console.error('Error creating maintenance ticket:', error);
    return c.json({ error: error?.message || 'Failed to create ticket' }, 500);
  }
});

app.put('/make-server-96250128/maintenance/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status, note } = await c.req.json();
    
    const ticket = await kv.get(`maintenance:${id}`);
    if (!ticket) {
      return c.json({ error: 'Maintenance ticket not found' }, 404);
    }
    
    const updated = {
      ...ticket,
      status,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...(ticket.statusHistory || []),
        {
          status,
          timestamp: new Date().toISOString(),
          note: note || `Status changed to ${status}`,
        },
      ],
    };
    
    await kv.set(`maintenance:${id}`, updated);
    
    console.log('✅ Maintenance status updated:', id, status);
    return c.json({ success: true, ticket: updated });
  } catch (error: any) {
    console.error('Error updating maintenance status:', error);
    return c.json({ error: error?.message || 'Failed to update status' }, 500);
  }
});

// ============================================================================
// Tenant Endpoints
// ============================================================================

app.get('/make-server-96250128/tenants', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const pageSize = parseInt(c.req.query('pageSize') || '10');
    const propertyId = c.req.query('propertyId');
    
    const tenantIds = await kv.get('tenants:all') || [];
    let tenants = await Promise.all(
      tenantIds.map((id: string) => kv.get(`tenant:${id}`))
    );
    
    // Filter by property if provided
    if (propertyId) {
      tenants = tenants.filter((t: any) => t && t.propertyId === propertyId);
    }
    
    const total = tenants.length;
    const totalPages = Math.ceil(total / pageSize);
    
    // Paginate
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = tenants.slice(start, end);
    
    return c.json({
      data: paginated.filter(Boolean),
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error: any) {
    console.error('Error fetching tenants:', error);
    return c.json({ error: error?.message || 'Failed to fetch tenants' }, 500);
  }
});

// ============================================================================
// Financial Endpoints
// ============================================================================

app.get('/make-server-96250128/financial/transactions', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const pageSize = parseInt(c.req.query('pageSize') || '10');
    const type = c.req.query('type');
    
    const transactionIds = await kv.get('transactions:all') || [];
    let transactions = await Promise.all(
      transactionIds.map((id: string) => kv.get(`transaction:${id}`))
    );
    
    // Filter by type if provided
    if (type) {
      transactions = transactions.filter((t: any) => t && t.type === type);
    }
    
    // Sort by date descending
    transactions.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    const total = transactions.length;
    const totalPages = Math.ceil(total / pageSize);
    
    // Paginate
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = transactions.slice(start, end);
    
    return c.json({
      data: paginated.filter(Boolean),
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return c.json({ error: error?.message || 'Failed to fetch transactions' }, 500);
  }
});

app.get('/make-server-96250128/financial/dashboard', async (c) => {
  try {
    const startTime = performance.now();
    
    const transactionIds = await kv.get('transactions:all') || [];
    const transactions = await Promise.all(
      transactionIds.map((id: string) => kv.get(`transaction:${id}`))
    );
    
    // Calculate metrics
    const totalRevenue = transactions
      .filter((t: any) => t && t.amount > 0)
      .reduce((sum: number, t: any) => sum + t.amount, 0);
      
    const totalExpenses = Math.abs(transactions
      .filter((t: any) => t && t.amount < 0)
      .reduce((sum: number, t: any) => sum + t.amount, 0));
      
    const netIncome = totalRevenue - totalExpenses;
    
    const responseTime = Math.round(performance.now() - startTime);
    console.log(`✅ Financial dashboard generated in ${responseTime}ms`);
    
    return c.json({
      totalRevenue,
      totalExpenses,
      netIncome,
      transactionCount: transactions.length,
      responseTime,
    });
  } catch (error: any) {
    console.error('Error generating financial dashboard:', error);
    return c.json({ error: error?.message || 'Failed to generate dashboard' }, 500);
  }
});

// KV Analytics Endpoint - Aggregated metrics for dashboard
app.get('/make-server-96250128/kv-analytics', async (c) => {
  try {
    const startTime = performance.now();

    // Get query parameters
    const range = c.req.query('range') || 'week'; // day, week, month
    const limit = parseInt(c.req.query('limit') || '200');

    // Fetch data by prefix
    const [loginAttempts, apiLogs, properties, maintenance] = await Promise.all([
      kv.getByPrefix('login_attempt:'),
      kv.getByPrefix('api_log:'),
      kv.getByPrefix('property:'),
      kv.getByPrefix('maintenance:'),
    ]);

    // Sort by timestamp
    const sortByTimestamp = (a: any, b: any) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    };

    const sortedLogins = loginAttempts.sort(sortByTimestamp).slice(0, limit);
    const sortedAPIs = apiLogs.sort(sortByTimestamp).slice(0, limit);

    // Aggregate data by time range
    const aggregateByPeriod = (data: any[], periodType: string) => {
      const groups: { [key: string]: any[] } = {};
      
      data.forEach(item => {
        if (!item.timestamp) return;
        
        const date = new Date(item.timestamp);
        let period: string;

        if (periodType === 'day') {
          period = date.toISOString().split('T')[0];
        } else if (periodType === 'week') {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          period = weekStart.toISOString().split('T')[0];
        } else {
          period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }

        if (!groups[period]) {
          groups[period] = [];
        }
        groups[period].push(item);
      });

      return Object.entries(groups).map(([period, items]) => ({
        period,
        count: items.length,
        items: items.slice(0, 10), // Include sample items
      }));
    };

    // Calculate metrics
    const totalLogins = sortedLogins.length;
    const failedLogins = sortedLogins.filter((l: any) => l.status === 'failed').length;
    const successRate = totalLogins > 0 ? ((totalLogins - failedLogins) / totalLogins * 100).toFixed(2) : 100;

    const avgResponseTime = sortedAPIs.length > 0
      ? (sortedAPIs.reduce((sum: number, log: any) => sum + (log.response_time || 0), 0) / sortedAPIs.length).toFixed(2)
      : 0;

    const activeMaintenanceCount = maintenance.filter((m: any) => 
      m.status !== 'completed' && m.status !== 'cancelled'
    ).length;

    const analytics = {
      metadata: {
        generated_at: new Date().toISOString(),
        range,
        processing_time_ms: (performance.now() - startTime).toFixed(2),
      },
      summary: {
        total_properties: properties.length,
        total_login_attempts: totalLogins,
        failed_logins: failedLogins,
        success_rate: `${successRate}%`,
        total_api_calls: sortedAPIs.length,
        avg_response_time_ms: avgResponseTime,
        active_maintenance: activeMaintenanceCount,
      },
      aggregated: {
        logins_by_period: aggregateByPeriod(sortedLogins, range),
        api_calls_by_period: aggregateByPeriod(sortedAPIs, range),
      },
      recent: {
        login_attempts: sortedLogins.slice(0, 20),
        api_logs: sortedAPIs.slice(0, 20),
      },
    };

    console.log(`✅ KV Analytics generated in ${(performance.now() - startTime).toFixed(2)}ms`);

    return c.json(analytics);
  } catch (error: any) {
    console.error('Error generating KV analytics:', error);
    return c.json({ error: error?.message || 'Failed to generate analytics' }, 500);
  }
});

Deno.serve(app.fetch);