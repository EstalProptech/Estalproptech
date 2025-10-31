# 🔧 Fix Edge Function Deployment Error - Quick Guide

## ❌ Error You're Seeing

```
Module not found "file:///tmp/.../source/securityMiddleware.tsx"
```

## 🎯 Root Cause

When deploying edge functions through the **Supabase Dashboard**, it expects a **single file** or all dependencies to be uploaded together. The error occurs because:

1. You're uploading `index.ts` 
2. But `securityMiddleware.ts` is not being uploaded with it
3. Supabase can't find the dependency

---

## ✅ Solution: Use Single-File Edge Function

I've created a **single-file version** that includes all the code in one file, ready for dashboard deployment.

**File:** [edge-function-single-file.ts](edge-function-single-file.ts)

---

## 🚀 Quick Fix (2 Minutes)

### Step 1: Copy the Single-File Version

1. Open: [edge-function-single-file.ts](edge-function-single-file.ts)
2. **Copy all the content** (Ctrl+A, Ctrl+C)

### Step 2: Deploy to Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/functions
2. Click **"Create Function"** or select existing function
3. **Function name:** `make-server`
4. **Paste** the copied code
5. Click **"Deploy"**

### Step 3: Verify Deployment

```bash
# Test the health endpoint
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-30T..."
}
```

---

## 🎯 Alternative: Deploy via Supabase CLI

If you want to keep the multi-file structure, use the Supabase CLI:

### Step 1: Install Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# npm (all platforms)
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
npx supabase login
```

### Step 3: Link Your Project

```bash
npx supabase link --project-ref ttsasgbrmswtjtenmksw
```

### Step 4: Deploy Function

```bash
# Deploy from your project root
npx supabase functions deploy make-server

# Or specify path
npx supabase functions deploy make-server --project-ref ttsasgbrmswtjtenmksw
```

### Step 5: Set Environment Variables

```bash
# These are usually set automatically, but verify:
npx supabase secrets list

# If needed, set them:
npx supabase secrets set SUPABASE_URL=https://ttsasgbrmswtjtenmksw.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 📋 File Structure Requirements

### ❌ What Doesn't Work (Dashboard)

```
supabase/functions/make-server/
├── index.ts                    ← Uploads this
├── securityMiddleware.ts       ← Dashboard doesn't upload this
└── kv_store.ts                 ← Dashboard doesn't upload this
```

**Result:** "Module not found" error

### ✅ What Works (Dashboard)

```
Single file deployment:
edge-function-single-file.ts    ← All code in one file
```

### ✅ What Works (CLI)

```
supabase/functions/make-server/
├── index.ts                    ← CLI bundles all files
├── securityMiddleware.ts       ← CLI includes this
└── kv_store.ts                 ← CLI includes this
```

**Result:** Successful deployment ✅

---

## 🔍 Troubleshooting

### Error: "Module not found"

**Cause:** Dashboard deployment with multiple files

**Fix:** Use single-file version or deploy via CLI

### Error: "Invalid function name"

**Cause:** Function name contains invalid characters

**Fix:** Use only lowercase letters, numbers, and hyphens
```bash
# ✅ Good
make-server
my-function
api-v1

# ❌ Bad
Make-Server
my_function
api.v1
```

### Error: "SUPABASE_URL is not defined"

**Cause:** Environment variables not set

**Fix:**
```bash
npx supabase secrets set SUPABASE_URL=https://ttsasgbrmswtjtenmksw.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
```

### Error: "Project not linked"

**Cause:** CLI not connected to your project

**Fix:**
```bash
npx supabase link --project-ref ttsasgbrmswtjtenmksw
```

---

## 📊 Deployment Methods Comparison

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Dashboard (Single File)** | ✅ Quick<br>✅ No CLI needed<br>✅ Visual | ❌ Can't use multiple files<br>❌ Manual updates | Quick tests, simple functions |
| **Dashboard (Multi File)** | - | ❌ Doesn't work | Don't use |
| **Supabase CLI** | ✅ Multi-file support<br>✅ Automated<br>✅ Version control<br>✅ CI/CD friendly | ❌ Requires CLI setup<br>❌ Learning curve | Production, team projects |

---

## ✅ Recommended Approach

### For Quick Testing (Now)
1. Use **single-file version**: [edge-function-single-file.ts](edge-function-single-file.ts)
2. Deploy via **Supabase Dashboard**
3. Test and verify

### For Production (Later)
1. Install **Supabase CLI**
2. Use **multi-file structure** (cleaner, more maintainable)
3. Setup **CI/CD** for automated deployments

---

## 🎯 Quick Decision Matrix

**I want to...**

| Goal | Method | File |
|------|--------|------|
| **Deploy now (fastest)** | Dashboard | edge-function-single-file.ts |
| **Deploy now (proper)** | CLI | supabase/functions/make-server/ |
| **Test quickly** | Dashboard | edge-function-single-file.ts |
| **Production deployment** | CLI | supabase/functions/make-server/ |
| **CI/CD pipeline** | CLI | supabase/functions/make-server/ |

---

## 📚 Next Steps

### After Successful Deployment

1. **Test the function:**
   ```bash
   curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health
   ```

2. **Check logs:**
   - Go to: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/functions
   - Click on `make-server`
   - View **Logs** tab

3. **Test from frontend:**
   ```typescript
   const response = await fetch(
     `https://${projectId}.supabase.co/functions/v1/make-server/health`,
     {
       headers: {
         Authorization: `Bearer ${publicAnonKey}`
       }
     }
   );
   const data = await response.json();
   console.log('Function response:', data);
   ```

4. **Setup database:**
   - Follow: [DEPLOY_DATABASE_NOW.md](DEPLOY_DATABASE_NOW.md)

5. **Apply RLS:**
   - Follow: [RLS_QUICK_REFERENCE.md](RLS_QUICK_REFERENCE.md)

---

## 🆘 Still Having Issues?

### Check Edge Function Logs

1. Go to: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/functions
2. Click on `make-server`
3. Click **"Logs"** tab
4. Look for error messages

### Common Log Errors

**"Cannot find module"**
- Use single-file version or CLI

**"SUPABASE_URL is not defined"**
- Set environment variables in Supabase dashboard

**"fetch failed"**
- Check CORS settings
- Verify Authorization header

**"Internal server error"**
- Check function code syntax
- View detailed logs

---

## ✅ Success Checklist

- [ ] Copied single-file version OR installed Supabase CLI
- [ ] Deployed function successfully
- [ ] Function shows as "Active" in dashboard
- [ ] Health endpoint responds correctly
- [ ] Logs show no errors
- [ ] Can call function from frontend

---

**Quick Fix:** Use [edge-function-single-file.ts](edge-function-single-file.ts) + Dashboard  
**Proper Fix:** Install Supabase CLI + Deploy multi-file structure  
**Time:** 2 minutes (quick) or 10 minutes (proper)  
**Status:** Ready to deploy! 🚀
