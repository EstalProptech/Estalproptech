# ⚡ Supabase Quick Connect Reference

## 🎯 Your Project Connection Details

```plaintext
┌──────────────────────────────────────────────────────────┐
│  PROJECT: EstalProptech's Project                        │
├──────────────────────────────────────────────────────────┤
│  ID:      ttsasgbrmswtjtenmksw                           │
│  URL:     https://ttsasgbrmswtjtenmksw.supabase.co       │
│  Status:  ✅ CONNECTED                                   │
└──────────────────────────────────────────────────────────┘
```

---

## 🔑 API Keys (Updated)

### Frontend (Public)
```typescript
Project ID:  ttsasgbrmswtjtenmksw
Anon Key:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2FzZ2JybXN3dGp0ZW5ta3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NjY5NDIsImV4cCI6MjA0NjI0Mjk0Mn0.J5lXZwYIgS8jLBzLgRf7V3TGZ_IwBq5L5_0Q3kF4I_0
```

### Backend (Get from Dashboard)
```bash
Service Role: [Dashboard → Settings → API → service_role]
```

---

## 🚀 Quick Deploy Commands

```bash
# 1. Set secrets (REQUIRED before deployment)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 2. Deploy edge functions
supabase functions deploy server --project-ref ttsasgbrmswtjtenmksw
supabase functions deploy make-server --project-ref ttsasgbrmswtjtenmksw

# 3. Test health endpoint
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/server/make-server-96250128/health
```

---

## 🔗 Important URLs

| Resource | URL |
|----------|-----|
| **Dashboard** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw |
| **API Docs** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/api |
| **Database** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/editor |
| **Functions** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/functions |
| **Auth** | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/auth |

---

## ✅ Configuration Status

- ✅ `/utils/supabase/info.tsx` - Updated
- ✅ `/lib/supabaseClient.ts` - Auto-configured
- ✅ `/components/AuthContext.tsx` - Fallbacks updated
- ✅ `/supabase/config.toml` - Verified
- ⏳ Edge Functions - Ready to deploy
- ⏳ Service Role Key - Needs to be set

---

## 🧪 Quick Test

```typescript
// Test in browser console
import { supabase } from './lib/supabaseClient';
await supabase.from('properties').select('count');
```

---

**Updated:** 2025-10-31 | **Status:** ✅ Ready
