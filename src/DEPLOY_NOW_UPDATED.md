# 🚀 Deploy Estal PropTech - Updated Configuration

**Project:** ttsasgbrmswtjtenmksw  
**Status:** ✅ Configuration Updated - Ready to Deploy

---

## ⚡ Quick Deploy (3 Steps)

### Step 1: Set Service Role Key (REQUIRED)

```bash
# 1. Get your service role key from:
# https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/api

# 2. Set the secret (replace YOUR_KEY with actual key)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE \
  --project-ref ttsasgbrmswtjtenmksw
```

### Step 2: Deploy Edge Functions

```bash
# Deploy server function
supabase functions deploy server --project-ref ttsasgbrmswtjtenmksw

# Test deployment
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/server/make-server-96250128/health
```

**Expected response:**
```json
{"status":"ok","message":"Estal PropTech Server"}
```

### Step 3: Initialize Database

**Option A: Via Dashboard (Recommended)**
1. Go to: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new
2. Copy contents from: `/supabase/functions/server/database-setup-fixed.sql`
3. Paste and click **"Run"**

**Option B: Via CLI**
```bash
supabase db push --project-ref ttsasgbrmswtjtenmksw
```

---

## ✅ Verify Deployment

### Test 1: Edge Function Health
```bash
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/server/make-server-96250128/health
```

### Test 2: Frontend Connection
```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
# Try to log in with: admin@estal.com / admin123
```

### Test 3: Database Connection
```typescript
// In browser console
import { supabase } from './lib/supabaseClient';
await supabase.from('properties').select('count');
```

---

## 🔧 Updated Configuration Summary

✅ **Project ID:** `ttsasgbrmswtjtenmksw`  
✅ **Supabase URL:** `https://ttsasgbrmswtjtenmksw.supabase.co`  
✅ **Frontend Config:** `/utils/supabase/info.tsx` - Updated  
✅ **Auth Fallbacks:** `/components/AuthContext.tsx` - Updated  
✅ **Environment:** `.env.local` - Created  
✅ **Edge Functions:** Ready (use env variables)

---

## 📋 Pre-Deployment Checklist

- [x] Updated project ID in all files
- [x] Updated anon key in all files
- [x] Created environment files
- [x] Verified edge function configuration
- [ ] Set service role key (DO THIS NOW)
- [ ] Deploy edge functions
- [ ] Initialize database

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| **Dashboard** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw |
| **Get API Keys** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/api |
| **SQL Editor** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new |
| **Function Logs** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/logs/edge-functions |

---

## ⚠️ Important Notes

1. **Service Role Key is CRITICAL** - Edge functions won't work without it
2. **Get it from Settings → API** - Copy the `service_role` (secret) key
3. **Set it BEFORE deploying** - Use the `supabase secrets set` command
4. **Never commit it to Git** - It's already in .gitignore

---

## 🆘 Troubleshooting

### Issue: "Unauthorized" errors
**Solution:** Service role key not set or incorrect
```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
```

### Issue: "Function not found"
**Solution:** Edge function not deployed
```bash
supabase functions deploy server --project-ref ttsasgbrmswtjtenmksw
```

### Issue: "Table does not exist"
**Solution:** Database not initialized
- Run SQL from `/supabase/functions/server/database-setup-fixed.sql`

---

**Ready to deploy? Start with Step 1! 🚀**
