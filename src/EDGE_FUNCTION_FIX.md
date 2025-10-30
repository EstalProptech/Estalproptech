# 🔧 Edge Function Deployment Error Fix

## ❌ Error Encountered

```
Error while deploying: XHR for "/api/integrations/supabase/EmzAd4GznlD8xn31Y59rSU/edge_functions/make-server/deploy" failed with status 403
```

---

## 🔍 Root Cause

The deployment system is trying to deploy a function named **`make-server`** but your actual function directory is **`make-server-96250128`**. This mismatch causes a 403 Forbidden error.

**Why this happened:**
- The edge function was renamed to `make-server-96250128` to avoid conflicts
- The deployment configuration still references the old `make-server` name
- The deployment system cannot find a function with the expected name

---

## ✅ Solution Options

### Option 1: Rename Function Directory (Recommended)

Rename your edge function to match what the deployment expects:

```bash
# Navigate to your project
cd /path/to/Estal

# Rename the function directory
mv supabase/functions/make-server-96250128 supabase/functions/make-server
```

Then deploy:

```bash
# Deploy using Supabase CLI
supabase functions deploy make-server
```

---

### Option 2: Use Supabase CLI Directly

Deploy the function with its current name:

```bash
# Make sure you're logged in
supabase login

# Link your project
supabase link --project-ref hdhncpmsxgqjpdpahaxh

# Deploy with the actual function name
supabase functions deploy make-server-96250128
```

**Note:** This keeps the unique name but requires CLI deployment instead of dashboard deployment.

---

### Option 3: Create Standard Function Name

Create a symlink or copy to maintain both:

```bash
cd supabase/functions

# Create a copy with standard name
cp -r make-server-96250128 make-server
```

Then deploy the standard name:

```bash
supabase functions deploy make-server
```

---

## 🚀 Recommended Deployment Steps

### Step 1: Rename to Standard Name

```bash
cd /path/to/Estal
mv supabase/functions/make-server-96250128 supabase/functions/make-server
```

### Step 2: Update Documentation References

Update these files to reference `make-server`:
- `/DEPLOY_EDGE_FUNCTION.md`
- `/docs/EDGE_FUNCTION_DEPLOYMENT_FIX.md`
- Any other docs mentioning the function name

### Step 3: Deploy via CLI

```bash
# Login to Supabase (if not already)
supabase login

# Link project
supabase link --project-ref hdhncpmsxgqjpdpahaxh

# Deploy function
supabase functions deploy make-server

# Verify deployment
curl https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server/health
```

### Step 4: Test from Dashboard

The deployment interface should now work correctly since the function name matches.

---

## 🔒 Security Note

The 403 error can also occur due to:
1. **Insufficient permissions** - Make sure you're logged into the correct Supabase account
2. **Project access** - Verify you have admin/owner role on the project
3. **API credentials** - Check that your access token is valid

To verify permissions:
```bash
supabase projects list
```

You should see `hdhncpmsxgqjpdpahaxh` in the list.

---

## 🧪 Test After Deployment

### Health Check
```bash
curl https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server/health
```

**Expected:**
```json
{
  "status": "ok",
  "message": "Estal PropTech Server",
  "timestamp": "2025-10-28T..."
}
```

### Beta Access
```bash
curl -X POST https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server/beta-access \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "company": "Test Co"}'
```

---

## 📝 After Successful Deployment

1. ✅ Remove old `/supabase/functions/server/` directory (with .tsx files)
2. ✅ Update frontend code to use the correct endpoint
3. ✅ Test authentication flow end-to-end
4. ✅ Monitor function logs for errors
5. ✅ Update `.gitignore` and push to GitHub

---

## 🆘 Still Having Issues?

### Check Function Logs
```bash
supabase functions logs make-server
```

### Verify Function Exists
Visit: https://supabase.com/dashboard/project/hdhncpmsxgqjpdpahaxh/functions

### Check Supabase Status
Visit: https://status.supabase.com/

---

## 📞 Need More Help?

- **Supabase CLI Docs**: https://supabase.com/docs/reference/cli/introduction
- **Edge Functions Guide**: https://supabase.com/docs/guides/functions
- **Deployment Troubleshooting**: `/docs/TROUBLESHOOTING.md`

---

<div align="center">

**🎯 Quick Fix:** Rename `make-server-96250128` → `make-server` and deploy again

</div>
