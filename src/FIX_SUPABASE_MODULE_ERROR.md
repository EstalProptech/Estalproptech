# 🔧 Fix: Supabase Edge Function Module Not Found Error

## 🎯 Error Description

**Error:** "Module not found" for `securityMiddleware.ts` when deploying edge function  
**Location:** `/supabase/functions/make-server/index.ts`  
**Cause:** Deno module resolution issues during Supabase deployment

---

## ✅ Solution: Multiple Fix Approaches

### 🚀 Quick Fix #1: Verify File Exists (30 seconds)

```bash
# Check if the file exists
ls -la supabase/functions/make-server/securityMiddleware.ts

# Expected output: File should be listed
# -rw-r--r-- 1 user user 12345 Oct 30 12:00 securityMiddleware.ts
```

**If file is missing:** File was accidentally deleted. Restore from git or recreate it.

---

### 🚀 Quick Fix #2: Redeploy with Fresh Cache (2 minutes)

```bash
# Deploy with no import cache
supabase functions deploy make-server --no-verify-jwt

# Or deploy all functions
supabase functions deploy
```

**Why this works:** Clears Deno's module cache that might be corrupted.

---

### 🚀 Quick Fix #3: Use Supabase Dashboard (5 minutes)

If CLI deployment fails, use the dashboard:

1. **Go to Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/functions
   ```

2. **Create New Function**
   - Click "Deploy a new function"
   - Name: `make-server`
   - Upload folder: `/supabase/functions/make-server/`

3. **Upload Files**
   - `index.ts` ✅
   - `securityMiddleware.ts` ✅
   - `kv_store.ts` ✅
   - `seed-data.ts` ✅

4. **Deploy**
   - Click "Deploy function"
   - Wait for success message

---

## 🔍 Detailed Diagnosis

### Check 1: Verify Import Statement

Open `/supabase/functions/make-server/index.ts` line 5-16:

```typescript
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
} from './securityMiddleware.ts';  // ← Check this line
```

**✅ Correct:** `'./securityMiddleware.ts'` (with `.ts` extension)  
**❌ Wrong:** `'./securityMiddleware.tsx'` or `'./securityMiddleware'`

---

### Check 2: Verify File Extension

The file MUST be `.ts`, not `.tsx`:

```bash
# Check current extension
ls supabase/functions/make-server/ | grep security

# Expected output:
# securityMiddleware.ts  ← Correct
```

**If you see `.tsx`:** Rename it to `.ts`:

```bash
cd supabase/functions/make-server/
mv securityMiddleware.tsx securityMiddleware.ts
```

---

### Check 3: Verify File Permissions

```bash
# Check file permissions
ls -l supabase/functions/make-server/securityMiddleware.ts

# Should be readable (r-- or rw-)
# If not, fix permissions:
chmod 644 supabase/functions/make-server/securityMiddleware.ts
```

---

### Check 4: Verify Deno Configuration

I've created a `deno.json` file at `/supabase/functions/deno.json`.

Verify it exists:
```bash
cat supabase/functions/deno.json
```

Expected output:
```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  }
}
```

---

## 🛠️ Complete Fix Procedure

### Step 1: Clean Local Cache
```bash
# Clear Deno cache
rm -rf ~/.cache/deno

# Or on macOS:
rm -rf ~/Library/Caches/deno
```

### Step 2: Verify All Files
```bash
cd supabase/functions/make-server/

# List all files
ls -la

# You should see:
# index.ts
# securityMiddleware.ts
# kv_store.ts
# seed-data.ts
```

### Step 3: Test Locally (Optional)
```bash
# Start Supabase locally
supabase start

# Deploy function locally
supabase functions serve make-server

# Test health endpoint
curl http://localhost:54321/functions/v1/make-server/health
```

### Step 4: Deploy to Supabase
```bash
# Login to Supabase (if not already)
supabase login

# Link to your project
supabase link --project-ref ttsasgbrmswtjtenmksw

# Deploy the function
supabase functions deploy make-server

# Expected output:
# Deploying function make-server...
# Deployed function make-server (version: xxx)
# Function URL: https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server
```

### Step 5: Verify Deployment
```bash
# Test the deployed function
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health

# Expected output:
# {"status":"ok","message":"Estal PropTech Server","timestamp":"..."}
```

---

## 🔧 Alternative: Manual File Upload

If CLI continues to fail, use manual upload:

### Via Supabase Dashboard

1. **Navigate to Functions**
   ```
   Dashboard → Edge Functions → make-server
   ```

2. **Edit Function**
   - Click on `make-server` function
   - Click "Edit function"

3. **Upload securityMiddleware.ts**
   - Click "Add file"
   - Name: `securityMiddleware.ts`
   - Paste content from your local file
   - Save

4. **Repeat for other files**
   - `kv_store.ts`
   - `seed-data.ts`

5. **Deploy**
   - Click "Deploy function"

---

## 📋 Verification Checklist

After applying fixes, verify:

### ✅ File Structure
```bash
supabase/functions/make-server/
├── index.ts                    # Main entry point
├── securityMiddleware.ts       # Security functions ← Must exist
├── kv_store.ts                 # KV store utilities
└── seed-data.ts                # Data seeding
```

### ✅ Import Statements in index.ts
```typescript
// Line 5-16
import { ... } from './securityMiddleware.ts';  // ✅ Correct

// Line 61
import * as kv from './kv_store.ts';           // ✅ Correct

// Line 236
import { seedAllData } from './seed-data.ts';  // ✅ Correct
```

### ✅ File Extensions
- All files use `.ts` extension ✅
- NO files use `.tsx` extension ❌

### ✅ Deno Configuration
- `deno.json` exists in `/supabase/functions/` ✅

### ✅ Deployment Success
```bash
# Should return 200 OK
curl -I https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health
```

---

## 🆘 Common Errors & Solutions

### Error 1: "Cannot find module"
```
Error: Cannot find module './securityMiddleware.ts'
```

**Solution:**
```bash
# Verify file exists
ls supabase/functions/make-server/securityMiddleware.ts

# If missing, restore from git
git checkout supabase/functions/make-server/securityMiddleware.ts

# Or recreate it from backup
```

---

### Error 2: "Syntax error in module"
```
Error: Unexpected token in securityMiddleware.ts
```

**Solution:**
```bash
# Check for syntax errors
deno check supabase/functions/make-server/securityMiddleware.ts

# Fix any TypeScript errors
```

---

### Error 3: "Permission denied"
```
Error: EACCES: permission denied
```

**Solution:**
```bash
# Fix file permissions
chmod -R 755 supabase/functions/make-server/
chmod 644 supabase/functions/make-server/*.ts
```

---

### Error 4: "Import map not found"
```
Error: Unable to load import map
```

**Solution:**
```bash
# Create deno.json if missing
cat > supabase/functions/deno.json << 'EOF'
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  }
}
EOF
```

---

## 🔍 Debugging Steps

### 1. Check Supabase CLI Version
```bash
supabase --version

# Should be v1.100.0 or higher
# If outdated, update:
brew upgrade supabase  # macOS
# or
npm update -g supabase  # npm
```

### 2. Check Logs
```bash
# View function logs in dashboard
# Dashboard → Edge Functions → make-server → Logs

# Or via CLI:
supabase functions logs make-server --tail
```

### 3. Test Individual Imports
```bash
# Create test file
cat > test-import.ts << 'EOF'
import { securityHeaders } from './supabase/functions/make-server/securityMiddleware.ts';
console.log('Import successful!');
EOF

# Run test
deno run test-import.ts

# Clean up
rm test-import.ts
```

---

## 📊 File Content Verification

### securityMiddleware.ts should export:
```typescript
export function securityHeaders() { ... }
export function rateLimit(options) { ... }
export function validateInput(schema) { ... }
export function sanitizeRequest() { ... }
export function ipBlocking() { ... }
export function requireAuth() { ... }
export function requireRole(allowedRoles) { ... }
export function trackFailedAuth(identifier) { ... }
export function clearFailedAuth(identifier) { ... }
export function secureLogger() { ... }
```

Verify all exports exist:
```bash
grep "^export function" supabase/functions/make-server/securityMiddleware.ts

# Should show 10 functions
```

---

## 🎯 Root Cause Analysis

### Why does this error happen?

1. **Deno Module Cache Corruption**
   - Deno caches imports
   - Cache can become stale or corrupted
   - Solution: Clear cache and redeploy

2. **File Extension Mismatch**
   - Import expects `.ts`
   - File is `.tsx` or missing extension
   - Solution: Ensure all files use `.ts`

3. **Network Issues During Deploy**
   - Supabase CLI upload fails mid-transfer
   - File is partially uploaded
   - Solution: Retry deployment

4. **Path Resolution Issues**
   - Relative path is incorrect
   - Working directory is wrong
   - Solution: Use explicit `./` prefix

---

## ✅ Success Indicators

You'll know it's fixed when:

1. ✅ Deployment completes without errors
```bash
supabase functions deploy make-server
# ✅ Deployed function make-server
```

2. ✅ Health check returns OK
```bash
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health
# {"status":"ok","message":"Estal PropTech Server","timestamp":"..."}
```

3. ✅ No module errors in logs
```bash
supabase functions logs make-server
# No "Cannot find module" errors
```

4. ✅ All endpoints work
```bash
# Test signup endpoint
curl -X POST https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test","role":"owner"}'
```

---

## 🚀 Quick Reference Commands

```bash
# 1. Verify files exist
ls -la supabase/functions/make-server/

# 2. Clear Deno cache
rm -rf ~/.cache/deno

# 3. Deploy function
supabase functions deploy make-server

# 4. Test deployment
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health

# 5. View logs (if needed)
supabase functions logs make-server --tail

# 6. Redeploy if needed
supabase functions deploy make-server --no-verify-jwt
```

---

## 📚 Related Documentation

- **Edge Function Deployment**: [DEPLOY_EDGE_FUNCTION.md](DEPLOY_EDGE_FUNCTION.md)
- **Complete Deployment**: [DEPLOYMENT_INDEX.md](DEPLOYMENT_INDEX.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 💡 Prevention Tips

### 1. Always use `.ts` extension
```typescript
// ✅ Good
import { foo } from './module.ts';

// ❌ Bad
import { foo } from './module.tsx';
import { foo } from './module';
```

### 2. Keep deno.json updated
```bash
# Always have this file:
supabase/functions/deno.json
```

### 3. Test locally before deploying
```bash
supabase functions serve make-server
# Test locally first
# Then deploy to production
```

### 4. Use version control
```bash
# Commit before making changes
git add supabase/functions/
git commit -m "Update edge functions"

# Easy to rollback if needed
git checkout HEAD~1 -- supabase/functions/
```

---

**Last Updated:** October 30, 2025  
**Project:** Estal PropTech  
**Supabase Project:** ttsasgbrmswtjtenmksw  
**Status:** ✅ Files verified, fix documented
