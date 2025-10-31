# ⚡ Deployment Commands - Quick Reference

## 🎯 Project: ttsasgbrmswtjtenmksw

---

## 1️⃣ Set Service Role Key (FIRST!)

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref ttsasgbrmswtjtenmksw

# Get your service role key from dashboard:
# https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/api

# Set the secret (replace YOUR_KEY with actual key)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Verify it was set
supabase secrets list
```

---

## 2️⃣ Deploy Edge Functions

```bash
# Deploy server function
supabase functions deploy server --project-ref ttsasgbrmswtjtenmksw

# Deploy make-server function (optional)
supabase functions deploy make-server --project-ref ttsasgbrmswtjtenmksw
```

---

## 3️⃣ Test Endpoints

```bash
# Test server health
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/server/make-server-96250128/health

# Test make-server health
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health
```

---

## 4️⃣ Database Setup

```sql
-- Run this SQL in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new

-- Copy contents from: /supabase/functions/server/database-setup-fixed.sql
-- Paste and run in SQL Editor
```

---

## 5️⃣ Monitor Logs

```bash
# View edge function logs
supabase functions logs server --project-ref ttsasgbrmswtjtenmksw

# Or view in dashboard:
# https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/logs/edge-functions
```

---

## 🔗 Quick Dashboard Links

| Action | Link |
|--------|------|
| **Get API Keys** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/api |
| **Manage Secrets** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/functions |
| **SQL Editor** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new |
| **Function Logs** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/logs/edge-functions |
| **Database Tables** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/editor |

---

## 📋 Pre-Deployment Checklist

- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Logged in to Supabase (`supabase login`)
- [ ] Project linked (`supabase link`)
- [ ] Service role key copied from dashboard
- [ ] Secret set (`supabase secrets set`)
- [ ] Ready to deploy!

---

**Save this file for quick reference!**
