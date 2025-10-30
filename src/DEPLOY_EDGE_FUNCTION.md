# 🚀 Quick Edge Function Deployment Guide

This guide will help you deploy the Estal edge function to Supabase.

---

## Prerequisites

1. ✅ Supabase account with project `ttsasgbrmswtjtenmksw`
2. ✅ Supabase CLI installed
3. ✅ Project credentials ready

---

## Step-by-Step Deployment

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

This will open a browser window for authentication.

### 3. Link Your Project

```bash
supabase link --project-ref hdhncpmsxgqjpdpahaxh
```

You'll be prompted for your database password. Get it from:
**Supabase Dashboard → Settings → Database → Database password**

### 4. Deploy the Edge Function

```bash
cd /path/to/Estal
supabase functions deploy make-server
```

### 5. Verify Deployment

Test the health endpoint:

```bash
curl https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server-96250128/health
```

**Expected response**:
```json
{
  "status": "ok",
  "message": "Estal PropTech Server",
  "timestamp": "2025-10-28T..."
}
```

---

## Alternative: Deploy via Supabase Dashboard

If CLI doesn't work, use the dashboard:

1. Go to [Supabase Functions](https://supabase.com/dashboard/project/hdhncpmsxgqjpdpahaxh/functions)
2. Click **"New Function"**
3. Enter function name: `make-server-96250128`
4. Upload files from `/supabase/functions/make-server-96250128/`
5. Click **"Deploy"**

---

## Verify Environment Variables

The following variables should be automatically available in your edge function:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`  
- `SUPABASE_ANON_KEY`

Check them in: **Project Settings → API**

---

## Test All Endpoints

### Health Check
```bash
curl https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server-96250128/health
```

### Signup (will return validation error without data - that's expected)
```bash
curl -X POST https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server-96250128/signup \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Beta Access
```bash
curl -X POST https://hdhncpmsxgqjpdpahaxh.supabase.co/functions/v1/make-server-96250128/beta-access \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## Clean Up Old Files

After successful deployment, you can remove the old directory:

```bash
rm -rf supabase/functions/server/
```

**Note**: Keep the `make-server-96250128` directory - that's your active function!

---

## Troubleshooting

### "supabase: command not found"

```bash
npm install -g supabase
# OR
brew install supabase/tap/supabase
```

### "Project not linked"

```bash
supabase link --project-ref hdhncpmsxgqjpdpahaxh
```

### "Permission denied"

Make sure you're logged in:
```bash
supabase login
```

### "Function deployment failed"

Check the logs:
```bash
supabase functions logs make-server-96250128
```

---

## Success Indicators

- ✅ CLI shows "Deployed function make-server-96250128"
- ✅ Health check returns 200 OK
- ✅ Function appears in Supabase dashboard
- ✅ Logs show no errors
- ✅ Client app can authenticate successfully

---

## Next Steps

After deployment:

1. Test login/registration from the web app
2. Monitor function logs for errors
3. Push changes to GitHub
4. Update CI/CD if needed

---

**Need help?** See [Full Deployment Guide](/docs/EDGE_FUNCTION_DEPLOYMENT_FIX.md)
