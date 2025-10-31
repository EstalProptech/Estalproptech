# ✅ Connection Verification Checklist

## 🎯 Project: ttsasgbrmswtjtenmksw

Use this checklist to verify all Supabase connections are properly configured.

---

## 📋 Configuration Verification

### ✅ Layer 1: Frontend Configuration

- [x] **File: `/utils/supabase/info.tsx`**
  - [x] `projectId = "ttsasgbrmswtjtenmksw"`
  - [x] `publicAnonKey = "eyJhbGci...MjU="` (Updated JWT)
  - [x] No syntax errors
  - [x] Exports are correct

- [x] **File: `/components/AuthContext.tsx`**
  - [x] Line 255: Fallback projectId updated
  - [x] Line 256: Fallback publicAnonKey updated
  - [x] Line 375: Signup projectId updated
  - [x] Line 376: Signup publicAnonKey updated

- [x] **File: `/.env.local`**
  - [x] `VITE_SUPABASE_URL=https://ttsasgbrmswtjtenmksw.supabase.co`
  - [x] `VITE_SUPABASE_ANON_KEY=eyJhbGci...MjU=`
  - [x] File exists and not committed to Git
  - [x] All required variables present

- [x] **File: `/.env.local.example`**
  - [x] Template created
  - [x] Contains updated project details
  - [x] Safe to commit (no real keys)

- [x] **File: `/lib/supabaseClient.ts`**
  - [x] Imports from `/utils/supabase/info.tsx`
  - [x] No hardcoded URLs
  - [x] Dynamic URL construction

### ✅ Layer 2: Backend Configuration

- [x] **File: `/supabase/config.toml`**
  - [x] `project_id = "ttsasgbrmswtjtenmksw"`
  - [x] Edge function settings correct
  - [x] Auth settings configured

- [x] **Files: Edge Functions**
  - [x] `/supabase/functions/server/index.tsx` uses env vars
  - [x] `/supabase/functions/make-server/index.ts` uses env vars
  - [x] No hardcoded project IDs
  - [x] CORS includes correct origins

- [x] **Files: KV Store**
  - [x] `/supabase/functions/server/kv_store.tsx` uses env
  - [x] `/supabase/functions/make-server/kv_store.ts` uses env
  - [x] `/utils/supabase/kv.ts` configured correctly

### ✅ Layer 3: Data Services

- [x] **File: `/lib/DataService.ts`**
  - [x] Uses supabase client from lib
  - [x] No direct config needed
  - [x] Inherits updated settings

---

## 🧪 Functional Testing

### Test 1: Environment Variables ⏳

```bash
# Check if .env.local exists
[ ] File exists: .env.local
[ ] Contains VITE_SUPABASE_URL
[ ] Contains VITE_SUPABASE_ANON_KEY
[ ] Values match project ttsasgbrmswtjtenmksw
```

### Test 2: Frontend Build ⏳

```bash
# Build the application
npm run build

[ ] Build succeeds without errors
[ ] No Supabase connection warnings
[ ] Environment variables loaded correctly
```

### Test 3: Development Server ⏳

```bash
# Start dev server
npm run dev

[ ] Server starts on http://localhost:5173
[ ] No console errors
[ ] Can access login page
[ ] Supabase client initializes
```

### Test 4: Supabase Connection ⏳

```typescript
// In browser console
import { supabase } from './lib/supabaseClient';
const { data, error } = await supabase.auth.getSession();

[ ] No connection errors
[ ] Returns session data (or null if not logged in)
[ ] projectId is ttsasgbrmswtjtenmksw
```

### Test 5: Edge Function Health ⏳

```bash
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/server/make-server-96250128/health

[ ] Returns 200 status
[ ] Response: {"status":"ok","message":"Estal PropTech Server"}
[ ] No CORS errors
```

### Test 6: Database Connection ⏳

```typescript
// Test database query
const { data, error } = await supabase
  .from('properties')
  .select('count');

[ ] Query executes
[ ] Returns data or proper error
[ ] No authentication issues
```

### Test 7: Authentication Flow ⏳

```typescript
// Test login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@estal.com',
  password: 'admin123'
});

[ ] Login request sent
[ ] Calls correct project endpoint
[ ] Returns success or proper error
```

---

## 🔍 Manual Verification Steps

### Step 1: Check File Contents

```bash
# Verify primary config
cat /utils/supabase/info.tsx | grep "ttsasgbrmswtjtenmksw"
[ ] Project ID found in file

# Verify environment
cat .env.local | grep "ttsasgbrmswtjtenmksw"
[ ] Project ID found in env file

# Verify AuthContext
grep -n "ttsasgbrmswtjtenmksw" /components/AuthContext.tsx
[ ] Found on line 255 (or near)
[ ] Found on line 375 (or near)
```

### Step 2: Check Supabase Dashboard

Visit: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw

```
[ ] Project exists and is active
[ ] Project name: EstalProptech's Project
[ ] Can access all sections (Database, Auth, Functions, etc.)
[ ] API keys match configuration
```

### Step 3: Verify API Keys

Dashboard → Settings → API:

```
[ ] Project URL: https://ttsasgbrmswtjtenmksw.supabase.co
[ ] anon public key matches /utils/supabase/info.tsx
[ ] service_role key available (for edge functions)
```

### Step 4: Check Edge Function Logs

Dashboard → Edge Functions → Logs:

```
[ ] No deployment errors
[ ] Server function is deployed (if applicable)
[ ] Health check returns OK
[ ] No runtime errors
```

---

## ⚙️ Deployment Prerequisites

### Before Deploying Edge Functions:

- [ ] Service role key obtained from dashboard
- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] Logged in: `supabase login`
- [ ] Project linked: `supabase link --project-ref ttsasgbrmswtjtenmksw`
- [ ] Secrets set: `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...`

### Edge Function Deployment:

```bash
# Deploy server function
supabase functions deploy server --project-ref ttsasgbrmswtjtenmksw

[ ] Deployment succeeds
[ ] No build errors
[ ] Function shows in dashboard
[ ] Health check passes
```

### Database Setup:

```sql
-- Run in SQL Editor: 
-- https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new

[ ] SQL script from /supabase/functions/server/database-setup-fixed.sql
[ ] All tables created
[ ] No SQL errors
[ ] RLS policies applied
```

---

## 🎯 Final Verification Matrix

| Component | Config ✅ | Test ✅ | Deploy ✅ | Notes |
|-----------|-----------|---------|-----------|-------|
| Project ID | ✅ | ⏳ | ⏳ | ttsasgbrmswtjtenmksw |
| Anon Key | ✅ | ⏳ | ⏳ | Updated JWT |
| Frontend Config | ✅ | ⏳ | ⏳ | info.tsx + .env |
| Auth Context | ✅ | ⏳ | ⏳ | Fallbacks updated |
| Edge Functions | ✅ | ⏳ | ⏳ | Use env vars |
| KV Store | ✅ | ⏳ | ⏳ | Environment-based |
| Database | ✅ | ⏳ | ⏳ | SQL ready |
| Service Role Key | ⏳ | ⏳ | ⏳ | Must set manually |

**Legend:**
- ✅ Complete
- ⏳ Pending
- ❌ Failed
- ⚠️ Warning

---

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid API key"
- **Cause:** Old anon key still in use
- **Solution:** Clear browser cache, rebuild app
- **Verify:** Check `/utils/supabase/info.tsx` has new key

### Issue 2: "Project not found"
- **Cause:** Wrong project ID
- **Solution:** Verify `ttsasgbrmswtjtenmksw` everywhere
- **Verify:** Check all config files

### Issue 3: "CORS error"
- **Cause:** Origin not allowed in edge function
- **Solution:** Update CORS in edge function
- **Verify:** Check `/supabase/functions/server/index.tsx`

### Issue 4: "Unauthorized" in edge functions
- **Cause:** Service role key not set
- **Solution:** `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...`
- **Verify:** `supabase secrets list`

### Issue 5: "Table does not exist"
- **Cause:** Database not initialized
- **Solution:** Run SQL setup script
- **Verify:** Check tables in Database Editor

---

## 📊 Health Check Dashboard

Run all these commands to get a complete health check:

```bash
# 1. Check environment
echo "Project ID from env:"
grep VITE_SUPABASE_URL .env.local

# 2. Check edge function
echo "Edge function health:"
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/server/make-server-96250128/health

# 3. Check build
echo "Building application:"
npm run build

# 4. Check secrets (if CLI configured)
echo "Supabase secrets:"
supabase secrets list --project-ref ttsasgbrmswtjtenmksw

# 5. Check functions (if CLI configured)
echo "Deployed functions:"
supabase functions list --project-ref ttsasgbrmswtjtenmksw
```

---

## ✅ Sign-Off

### Configuration Complete
- [ ] All files updated with correct project ID
- [ ] All anon keys updated
- [ ] Environment files created
- [ ] No hardcoded values
- [ ] Documentation updated

### Testing Complete
- [ ] Frontend connects successfully
- [ ] Edge functions respond
- [ ] Database queries work
- [ ] Auth flow functional
- [ ] No console errors

### Deployment Ready
- [ ] Service role key set
- [ ] Edge functions deployed
- [ ] Database initialized
- [ ] RLS policies enabled
- [ ] Production tested

---

**Verification Completed By:** _________________  
**Date:** _________________  
**Status:** [ ] PASS  [ ] FAIL  [ ] PENDING

**Notes:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

---

**Last Updated:** 2025-10-31  
**Project:** Estal PropTech v2.0  
**Project ID:** ttsasgbrmswtjtenmksw
