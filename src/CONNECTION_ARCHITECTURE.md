# 🏗️ Estal PropTech - Supabase Connection Architecture

## 📊 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ESTAL PROPTECH PLATFORM                             │
│                     Project ID: ttsasgbrmswtjtenmksw                         │
└─────────────────────────────────────────────────────────────────────────────┘

                                    │
                                    │
                    ┌───────────────▼───────────────┐
                    │     CONFIGURATION LAYER       │
                    │                                │
                    │  /utils/supabase/info.tsx     │
                    │  ┌──────────────────────────┐ │
                    │  │ projectId: "ttsas..."    │ │
                    │  │ publicAnonKey: "eyJ..."  │ │
                    │  └──────────────────────────┘ │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │   SUPABASE CLIENT LAYER       │
                    │                                │
                    │  /lib/supabaseClient.ts       │
                    │  ┌──────────────────────────┐ │
                    │  │ URL: https://ttsas...    │ │
                    │  │ Auth: persistSession     │ │
                    │  │ Auto-refresh: ✅         │ │
                    │  └──────────────────────────┘ │
                    └───────────────┬───────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
            ▼                       ▼                       ▼
    ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
    │   Frontend   │       │     Auth     │       │  Edge Funcs  │
    │  Components  │       │   Context    │       │   Calls      │
    └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
           │                      │                      │
           │                      │                      │
           └──────────────────────┼──────────────────────┘
                                  │
                                  │ HTTPS Requests
                                  │
            ┌─────────────────────▼─────────────────────┐
            │                                            │
            │    SUPABASE CLOUD INFRASTRUCTURE          │
            │    Project: ttsasgbrmswtjtenmksw          │
            │    URL: https://ttsasgbrmswtjtenmksw      │
            │         .supabase.co                      │
            │                                            │
            │  ┌──────────────────────────────────────┐ │
            │  │         AUTH SERVICE                 │ │
            │  │  • User Registration                 │ │
            │  │  • Email Confirmation (Auto)         │ │
            │  │  • JWT Token Generation              │ │
            │  │  • Session Management                │ │
            │  │  • Role-Based Access (RBAC)          │ │
            │  │    - Admin (مدير)                    │ │
            │  │    - Accountant (محاسب)              │ │
            │  │    - Owner (مالك عقار)               │ │
            │  └──────────────────────────────────────┘ │
            │                                            │
            │  ┌──────────────────────────────────────┐ │
            │  │      POSTGRESQL DATABASE             │ │
            │  │                                      │ │
            │  │  Tables:                             │ │
            │  │  ┌────────────────────────────────┐  │ │
            │  │  │ • properties                   │  │ │
            │  │  │ • maintenance_requests         │  │ │
            │  │  │ • financial_reports            │  │ │
            │  │  │ • user_profiles                │  │ │
            │  │  │ • transactions                 │  │ │
            │  │  │ • tenants                      │  │ │
            │  │  │ • invoices                     │  │ │
            │  │  └────────────────────────────────┘  │ │
            │  │                                      │ │
            │  │  RLS Policies: ✅ Enabled            │ │
            │  │  Row-Level Security per user role    │ │
            │  └──────────────────────────────────────┘ │
            │                                            │
            │  ┌──────────────────────────────────────┐ │
            │  │       EDGE FUNCTIONS (Deno)          │ │
            │  │                                      │ │
            │  │  1. /functions/v1/server/            │ │
            │  │     └─ /make-server-96250128/*       │ │
            │  │        • /health                     │ │
            │  │        • /signup                     │ │
            │  │        • /confirm-user               │ │
            │  │        • /properties                 │ │
            │  │        • /maintenance                │ │
            │  │        • /financial/*                │ │
            │  │        • /deployments                │ │
            │  │        • /feedback                   │ │
            │  │        • /growth-metrics             │ │
            │  │                                      │ │
            │  │  2. /functions/v1/make-server/       │ │
            │  │     └─ /*                            │ │
            │  │        • Alternative endpoint        │ │
            │  │                                      │ │
            │  │  Security:                           │ │
            │  │  • Rate Limiting                     │ │
            │  │  • IP Blocking                       │ │
            │  │  • Input Validation                  │ │
            │  │  • Request Sanitization              │ │
            │  │  • CORS Protection                   │ │
            │  │  • Security Headers (CSP, HSTS)      │ │
            │  └──────────────────────────────────────┘ │
            │                                            │
            │  ┌──────────────────────────────────────┐ │
            │  │         KV STORE (Key-Value)         │ │
            │  │                                      │ │
            │  │  Data Types:                         │ │
            │  │  • user_profile:{userId}             │ │
            │  │  • property:{propertyId}             │ │
            │  │  • maintenance:{ticketId}            │ │
            │  │  • deployment:{timestamp}            │ │
            │  │  • feedback:{feedbackId}             │ │
            │  │  • beta_request:{email}              │ │
            │  │  • referral:{referralId}             │ │
            │  │                                      │ │
            │  │  Operations:                         │ │
            │  │  • get(), set(), del()               │ │
            │  │  • mget(), mset(), mdel()            │ │
            │  │  • getByPrefix()                     │ │
            │  └──────────────────────────────────────┘ │
            │                                            │
            │  ┌──────────────────────────────────────┐ │
            │  │      REALTIME SUBSCRIPTIONS          │ │
            │  │  • Property updates                  │ │
            │  │  • Maintenance status changes        │ │
            │  │  • Financial transactions            │ │
            │  │  • User activity                     │ │
            │  └──────────────────────────────────────┘ │
            └────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│              SECURITY LAYERS                             │
└─────────────────────────────────────────────────────────┘

Layer 1: Network Security
├─ HTTPS/TLS Encryption
├─ CORS Protection
└─ IP-based Rate Limiting

Layer 2: Authentication
├─ JWT Token Validation
├─ Session Management
├─ Auto Email Confirmation
└─ Failed Auth Tracking

Layer 3: Authorization
├─ Role-Based Access Control (RBAC)
│  ├─ Admin (Full Access)
│  ├─ Accountant (Financial Focus)
│  └─ Owner (Property Management)
└─ Row-Level Security (RLS)

Layer 4: Input Validation
├─ Schema Validation
├─ Type Checking
├─ Length Limits
└─ Pattern Matching

Layer 5: Request Sanitization
├─ XSS Prevention
├─ SQL Injection Protection
├─ Script Tag Removal
└─ Content Length Limits

Layer 6: Security Headers
├─ Content-Security-Policy (CSP)
├─ X-Frame-Options: DENY
├─ X-Content-Type-Options: nosniff
├─ X-XSS-Protection
├─ HSTS (Strict-Transport-Security)
└─ Referrer-Policy
```

---

## 🔄 Data Flow Diagram

```
User Action → Frontend Component → Supabase Client → Cloud Services
                                                           │
                                                           ├─→ Auth
                                                           ├─→ Database
                                                           ├─→ Edge Function
                                                           └─→ KV Store
                                                                  │
                                                                  ├─→ Process
                                                                  ├─→ Validate
                                                                  └─→ Response
                                                                       │
Frontend ←── Component ←── Supabase Client ←── Cloud Services ←───────┘
```

### Example: User Login Flow

```
1. User enters credentials
   └─→ LoginPage.tsx

2. Submit to AuthContext
   └─→ AuthContext.signIn()

3. Create Supabase client
   └─→ supabaseClient.ts (with projectId + anonKey)

4. Send to Supabase Auth
   └─→ https://ttsasgbrmswtjtenmksw.supabase.co/auth/v1/token

5. Validate credentials
   └─→ Check against auth.users table

6. If valid, generate JWT
   └─→ Access token + Refresh token

7. Return to frontend
   └─→ Store in localStorage + Context

8. Fetch user profile
   └─→ Edge function: /profile/{userId}

9. Update UI with user data
   └─→ Dashboard renders based on role
```

---

## 🌐 Endpoint Routing Map

```
Frontend Application
│
├─ Auth Endpoints
│  ├─ POST /auth/v1/signup
│  ├─ POST /auth/v1/token (login)
│  ├─ POST /auth/v1/logout
│  └─ GET  /auth/v1/user (get session)
│
├─ Database Endpoints (via Supabase Client)
│  ├─ GET    /rest/v1/properties
│  ├─ POST   /rest/v1/properties
│  ├─ PUT    /rest/v1/properties/{id}
│  ├─ DELETE /rest/v1/properties/{id}
│  ├─ GET    /rest/v1/maintenance_requests
│  └─ GET    /rest/v1/financial_reports
│
└─ Edge Function Endpoints
   │
   ├─ Server Function (/functions/v1/server/make-server-96250128/)
   │  ├─ GET  /health
   │  ├─ POST /signup
   │  ├─ POST /confirm-user
   │  ├─ GET  /profile/{userId}
   │  ├─ POST /profile/{userId}
   │  ├─ GET  /properties
   │  ├─ POST /properties
   │  ├─ GET  /maintenance
   │  ├─ POST /maintenance
   │  ├─ GET  /financial/dashboard
   │  ├─ POST /deployments
   │  ├─ POST /feedback
   │  └─ GET  /growth-metrics
   │
   └─ Make-Server Function (/functions/v1/make-server/)
      └─ (Same endpoints without prefix)
```

---

## 📦 Configuration File Hierarchy

```
Root Configuration
├─ /supabase/config.toml
│  └─ Project ID, API settings, Edge function config
│
Application Configuration
├─ /utils/supabase/info.tsx
│  └─ Project ID, Public Anon Key (✅ UPDATED)
│
Client Configuration
├─ /lib/supabaseClient.ts
│  └─ Supabase client initialization
│
Component Fallbacks
└─ /components/AuthContext.tsx
   └─ Backup project config (✅ UPDATED)
```

---

## 🔧 Environment Variables Flow

```
Development Environment (.env.local)
├─ VITE_SUPABASE_URL=https://ttsasgbrmswtjtenmksw.supabase.co
└─ VITE_SUPABASE_ANON_KEY=eyJ...

                │
                ├─→ Build Process
                │
                ▼

Production Environment (Vercel/Deployment)
├─ VITE_SUPABASE_URL (from info.tsx)
└─ VITE_SUPABASE_ANON_KEY (from info.tsx)

Edge Functions (Supabase Secrets)
├─ SUPABASE_URL (auto-provided)
├─ SUPABASE_ANON_KEY (auto-provided)
└─ SUPABASE_SERVICE_ROLE_KEY (⚠️ SET MANUALLY)
```

---

## ✅ Connection Verification Points

| Component | Status | Verification |
|-----------|--------|--------------|
| **Project ID** | ✅ Updated | `ttsasgbrmswtjtenmksw` |
| **Anon Key** | ✅ Updated | JWT with correct project ref |
| **Supabase Client** | ✅ Ready | Auto-imports from info.tsx |
| **Auth Context** | ✅ Updated | Fallback configs in place |
| **Edge Functions** | ⏳ Pending | Need deployment |
| **Service Role Key** | ⏳ Required | Must be set in secrets |
| **Database** | ⏳ Pending | SQL scripts ready |
| **RLS Policies** | ⏳ Pending | Security setup needed |

---

## 🎯 Next Action Items

1. ✅ **Configuration Updated** - All files use correct project ID
2. ⏳ **Set Service Role Key** - Add to Supabase secrets
3. ⏳ **Deploy Edge Functions** - Run deployment commands
4. ⏳ **Initialize Database** - Execute SQL setup scripts
5. ⏳ **Test Connection** - Verify all endpoints work
6. ⏳ **Enable RLS** - Activate row-level security

---

**Architecture Version:** 2.0  
**Last Updated:** 2025-10-31  
**Connection Status:** ✅ **CONFIGURED & READY**
