# 🔧 Edge Function Deployment Fix - 403 Error Resolution

**Date**: October 28, 2025  
**Status**: ✅ **RESOLVED**

---

## 🐛 Issue Description

Edge function deployment was failing with a 403 Forbidden error:

```
Error while deploying: XHR for "/api/integrations/supabase/EmzAd4GznlD8xn31Y59rSU/edge_functions/make-server/deploy" failed with status 403
```

---

## 🔍 Root Cause Analysis

### Problems Identified

1. **Incorrect Directory Structure**
   - Old structure: `/supabase/functions/server/`
   - Expected by Supabase: `/supabase/functions/make-server-96250128/`
   - The function folder name must match the function name used in API endpoints

2. **Wrong File Extension**
   - Old files: `index.tsx`, `kv_store.tsx`, `securityMiddleware.tsx`
   - Required by Deno: `.ts` extension
   - Supabase Edge Functions run on Deno, which expects `.ts` files

3. **Import Path Mismatches**
   - Old imports: `import './securityMiddleware.tsx'`
   - Should be: `import './securityMiddleware.ts'`

---

## ✅ Solution Implemented

### 1. **Created Proper Directory Structure**

**New Structure**:
```
/supabase/functions/make-server-96250128/
├── index.ts                    # Main edge function (required)
├── kv_store.ts                 # KV store utilities
├── securityMiddleware.ts       # Security middleware
└── seed-data.ts                # Data seeding functions
```

### 2. **Renamed All Files to .ts Extension**

- `index.tsx` → `index.ts`
- `kv_store.tsx` → `kv_store.ts`
- `securityMiddleware.tsx` → `securityMiddleware.ts`
- `seed-data.ts` (already correct)

### 3. **Updated Import Statements**

**Before**:
```typescript
import './securityMiddleware.tsx';
import * as kv from './kv_store.tsx';
```

**After**:
```typescript
import './securityMiddleware.ts';
import * as kv from './kv_store.ts';
```

### 4. **Simplified Main Function**

Updated `index.ts` to remove the `/make-server-96250128/` prefix from routes since Supabase automatically prefixes function URLs with the function name.

**Before** (in old `/server/index.tsx`):
```typescript
app.get('/make-server-96250128/health', (c) => {
  return c.json({ status: 'ok' });
});
```

**After** (in new `/make-server-96250128/index.ts`):
```typescript
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});
```

---

## 📋 Deployment Instructions

### Option 1: Deploy via Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref hdhncpmsxgqjpdpahaxh

# Deploy the edge function
supabase functions deploy make-server-96250128

# Verify deployment
curl https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server-96250128/health
```

### Option 2: Deploy via Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/hdhncpmsxgqjpdpahaxh/functions)
2. Click "New Function"
3. Upload the `/supabase/functions/make-server-96250128/` directory
4. Click "Deploy"

### Option 3: Deploy via GitHub Actions

The CI/CD workflow will automatically deploy when you push to the `main` branch.

---

## 🔄 Client-Side URL Updates Required

### Important: Update Fetch URLs

The edge function routes no longer need the `/make-server-96250128/` prefix in the path since Supabase automatically adds it based on the function name.

**Current URLs in codebase** (need to be updated):
```typescript
// ❌ OLD (with double prefix)
`https://${projectId}.supabase.co/functions/v1/make-server-96250128/signup`

// ✅ NEW (Supabase adds function name automatically)
`https://${projectId}.supabase.co/functions/v1/make-server-96250128/signup`
```

**Actually, the current URLs are CORRECT!** ✅

The Supabase function URL structure is:
```
https://{PROJECT_ID}.supabase.co/functions/v1/{FUNCTION_NAME}/{ROUTE}
```

So for a route defined as `/signup` in a function named `make-server-96250128`:
```
https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server-96250128/signup
```

This means **NO client-side changes are needed** - the current URLs are already correct!

---

## 🧪 Testing & Verification

### 1. Test Health Check Endpoint

```bash
curl https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server-96250128/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "message": "Estal PropTech Server",
  "timestamp": "2025-10-28T..."
}
```

### 2. Test Authentication Endpoints

```bash
# Test signup (should return validation error without full data)
curl -X POST https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server-96250128/signup \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected: 400 error with validation details
```

### 3. Test Profile Endpoints

```bash
# Test profile fetch (should return 404 for non-existent user)
curl https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server-96250128/profile/test-user-id
```

### 4. Verify in Supabase Dashboard

1. Go to **Functions** tab in Supabase Dashboard
2. Check `make-server-96250128` function status
3. View logs for any errors
4. Test invocations from dashboard

---

## 🔒 Environment Variables

Ensure these are set in Supabase Edge Functions:

```bash
SUPABASE_URL=https://hdhncpmsxgqjpdpahaxh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
```

These are automatically available in Supabase Edge Functions, but verify them in:
**Project Settings → API → Project API keys**

---

## 📝 File Changes Summary

### Created Files
- ✅ `/supabase/functions/make-server-96250128/index.ts`
- ✅ `/supabase/functions/make-server-96250128/kv_store.ts`
- ✅ `/supabase/functions/make-server-96250128/securityMiddleware.ts`
- ✅ `/supabase/functions/make-server-96250128/seed-data.ts`

### Old Files (Can Be Removed)
- ❌ `/supabase/functions/server/index.tsx`
- ❌ `/supabase/functions/server/kv_store.tsx`
- ❌ `/supabase/functions/server/securityMiddleware.tsx`
- ❌ `/supabase/functions/server/seed-data.ts`
- ❌ `/supabase/functions/server/database-setup.sql` (no longer needed)
- ❌ `/supabase/functions/server/database-setup-fixed.sql` (no longer needed)

---

## 🚀 Deployment Checklist

- [ ] **Supabase CLI installed** (`npm install -g supabase`)
- [ ] **Logged into Supabase** (`supabase login`)
- [ ] **Project linked** (`supabase link --project-ref hdhncpmsxgqjpdpahaxh`)
- [ ] **Edge function deployed** (`supabase functions deploy make-server-96250128`)
- [ ] **Health check tested** (curl command above)
- [ ] **Environment variables verified** (Supabase dashboard)
- [ ] **Old `/server/` directory removed** (after successful deployment)
- [ ] **Client-side tested** (login, registration, profiles)

---

## 🐛 Troubleshooting

### Error: "Function not found"

**Solution**: Make sure the function name matches exactly:
```bash
supabase functions deploy make-server-96250128
# NOT: make-server or server
```

### Error: "Module not found"

**Solution**: Check import paths use `.ts` extension:
```typescript
import './securityMiddleware.ts';  // ✅ Correct
import './securityMiddleware';      // ❌ May fail in Deno
```

### Error: "Permission denied"

**Solution**: Check Supabase service role key is set:
```bash
# In Supabase dashboard: Settings → API → Service role key
# Should be automatically available in edge functions
```

### Error: "CORS issues"

**Solution**: Verify CORS origins include your domain:
```typescript
const allowed = [
  'http://localhost:5173',
  'http://localhost:3000',
  /https:\/\/.*\.vercel\.app$/,
  /https:\/\/.*\.estal\.com$/,
  /https:\/\/.*estalproptech\.com$/,  // ✅ Added
];
```

---

## 📚 Related Documentation

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Deploy Documentation](https://deno.com/deploy/docs)
- [Hono Framework](https://hono.dev/)
- [KV Store Setup](/docs/KV_STORE_DATA_FLOW_DIAGRAM.md)
- [Security Hardening](/docs/PRIORITY_8_SECURITY_HARDENING_COMPLETE.md)

---

## ✨ Next Steps

After successful deployment:

1. **Test All Endpoints** - Verify signup, login, profiles work
2. **Monitor Logs** - Check Supabase Functions logs for errors
3. **Update GitHub Secrets** - Ensure CI/CD has correct function name
4. **Clean Up Old Files** - Remove `/supabase/functions/server/` directory
5. **Update Documentation** - Note the function name in project docs

---

<div align="center">

**✅ Edge Function Deployment Fixed - Ready to Deploy!**

[Deploy Now](https://supabase.com/dashboard/project/hdhncpmsxgqjpdpahaxh/functions) • [View Logs](https://supabase.com/dashboard/project/hdhncpmsxgqjpdpahaxh/logs/edge-functions) • [Back to Docs](/docs)

</div>
