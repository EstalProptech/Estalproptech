# ⚡ QUICK DEPLOY - 20 MINUTES TO PRODUCTION

**Status**: ✅ Credentials Configured | ⏳ Database Pending

---

## 🚀 Deploy in 5 Steps (20 min total)

### ✅ Step 0: Prerequisites (DONE!)
- [x] Supabase project: `ttsasgbrmswtjtenmksw`
- [x] API key configured
- [x] Environment files set up

---

### 📝 Step 1: Deploy Database (5 min)

**Quick Method:**

1. Open: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new

2. Copy/Paste file: `/supabase/functions/server/database-setup-fixed.sql`

3. Click **RUN**

4. Verify: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/editor

✅ **Done when you see**: `properties`, `financial_reports`, `maintenance_requests` tables

---

### 🔧 Step 2: Deploy Edge Function (3 min)

```bash
npm install -g supabase
supabase login
supabase link --project-ref ttsasgbrmswtjtenmksw
supabase functions deploy make-server
```

**Test it:**
```bash
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health
```

✅ **Done when you see**: `{"status":"ok"}`

---

### 👤 Step 3: Create Admin User (2 min)

**Dashboard method:**

1. Open: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/auth/users

2. Click **"Add user"**

3. Fill in:
   - Email: `admin@estal.com`
   - Password: `SecurePass123!`
   - Confirm email: ✅
   - Metadata: `{"name":"Admin User","role":"admin"}`

✅ **Done when**: User appears in Auth → Users

---

### 📦 Step 4: Push to GitHub (5 min)

```bash
git init
git add .
git commit -m "Initial commit: Estal PropTech Platform v1.0"
git remote add origin https://github.com/EstalProptech/Estal.git
git branch -M main
git push -u origin main
```

✅ **Done when**: Code visible at https://github.com/EstalProptech/Estal

---

### 🌐 Step 5: Deploy to Vercel (5 min)

**Dashboard method:**

1. Go to: https://vercel.com/new

2. Import: `EstalProptech/Estal`

3. Add environment variables:
   ```env
   VITE_SUPABASE_URL = https://ttsasgbrmswtjtenmksw.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2FzZ2JybXN3dGp0ZW5ta3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzExMjUsImV4cCI6MjA3NzI0NzEyNX0.ubkbkAv5YPgABtAZi0s3VgISVNX7uUh11porsHPmMnc
   NODE_ENV = production
   ```

4. Deploy!

✅ **Done when**: Live URL works (e.g., `estal.vercel.app`)

---

## 🎯 Current Progress

- [x] **Step 0**: Environment configured ✅
- [ ] **Step 1**: Database deployed
- [ ] **Step 2**: Edge function deployed
- [ ] **Step 3**: Admin user created
- [ ] **Step 4**: Code on GitHub
- [ ] **Step 5**: Live on Vercel

**Next action**: Deploy database (Step 1)  
**Time remaining**: ~20 minutes

---

## 🔗 Essential Links

| Resource | URL |
|----------|-----|
| SQL Editor | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new |
| Table Editor | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/editor |
| Auth Users | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/auth/users |
| Edge Functions | https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/functions |
| GitHub Repo | https://github.com/EstalProptech/Estal |
| Vercel Deploy | https://vercel.com/new |

---

## 🆘 Having Issues?

- **Database**: See `/DATABASE_DEPLOYMENT_NOW.md`
- **Edge Function**: See `/DEPLOY_EDGE_FUNCTION.md`
- **Full Guide**: See `/FINAL_DEPLOYMENT_CHECKLIST.md`

---

<div align="center">

**⚡ Ready to Deploy!**

Start with Step 1: [Open SQL Editor](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new)

</div>
