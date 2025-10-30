# 🚀 DATABASE DEPLOYMENT - START HERE

**Your Supabase credentials are configured and ready!**

Project URL: `https://ttsasgbrmswtjtenmksw.supabase.co`  
API Key: ✅ Configured in `/utils/supabase/info.tsx`

---

## 🎯 STEP 1: Deploy Database Schema (5 minutes)

### Option A: Supabase SQL Editor (Recommended - Easiest!)

1. **Open SQL Editor**:  
   👉 https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new

2. **Copy the Database Setup SQL**:
   - Open the file: `/supabase/functions/server/database-setup-fixed.sql`
   - Select ALL content (435 lines)
   - Copy it (Cmd/Ctrl + C)

3. **Paste and Run**:
   - Paste into the SQL Editor
   - Click the **"Run"** button (bottom right)
   - Wait ~5 seconds for completion

4. **Verify Success**:
   - Go to Table Editor: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/editor
   - You should see these tables:
     - ✅ `properties` (5 sample properties)
     - ✅ `financial_reports` (5 sample reports)
     - ✅ `maintenance_requests` (3 sample requests)
     - ✅ `user_profiles` (view - will show 0 users until registration)

### Option B: Command Line (psql)

```bash
# Connect to database
psql -h db.ttsasgbrmswtjtenmksw.supabase.co -p 5432 -d postgres -U postgres

# You'll be prompted for password - get it from:
# https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/database

# Once connected, paste the entire contents of database-setup-fixed.sql
```

---

## 🧪 STEP 2: Test Database Connection (2 minutes)

After running the SQL, verify everything works:

### Test in SQL Editor:

```sql
-- Test 1: Count all records
SELECT 
  (SELECT COUNT(*) FROM properties) as properties,
  (SELECT COUNT(*) FROM financial_reports) as reports,
  (SELECT COUNT(*) FROM maintenance_requests) as maintenance,
  (SELECT COUNT(*) FROM user_profiles) as users;
```

**Expected output:**
```
 properties | reports | maintenance | users
------------+---------+-------------+-------
     5      |    5    |      3      |   0
```

### Test 2: Verify Tables Created

```sql
-- List all tables
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**Expected tables:**
- `financial_reports`
- `maintenance_requests`
- `properties`

**Expected views:**
- `user_profiles`

### Test 3: Check Sample Data

```sql
-- View sample properties
SELECT name, location, status, rent FROM properties LIMIT 3;
```

**Expected output:**
```
       name        |   location    |      status       |  rent  
-------------------+---------------+-------------------+--------
 Skyline Tower     | North Riyadh  | Rented            | 85000
 Garden Villa 12   | West Riyadh   | Rented            | 48000
 Downtown Loft     | Central Riyadh| Under Maintenance | 32000
```

---

## 🔧 STEP 3: Deploy Edge Function (3 minutes)

After the database is set up, deploy the edge function:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ttsasgbrmswtjtenmksw

# Deploy the function
supabase functions deploy make-server
```

### Test Edge Function

```bash
# Test health endpoint
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Estal PropTech Server",
  "timestamp": "2025-10-29T..."
}
```

---

## 👤 STEP 4: Create Test User (2 minutes)

### Option A: Via Edge Function (After deployment)

```bash
curl -X POST https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@estal.com",
    "password": "SecurePass123!",
    "name": "Admin User",
    "role": "admin"
  }'
```

### Option B: Via Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/auth/users
2. Click **"Add user"**
3. Fill in:
   - Email: `admin@estal.com`
   - Password: `SecurePass123!`
   - Auto Confirm Email: ✅ Yes
   - User Metadata:
     ```json
     {
       "name": "Admin User",
       "role": "admin"
     }
     ```
4. Click **"Create user"**

---

## ✅ STEP 5: Test Application Locally (2 minutes)

```bash
# Make sure you're in the project directory
cd /path/to/Estal

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Your app should now be running at: http://localhost:5173

### Test Login

Try logging in with:
- **Email**: `admin@estal.com`
- **Password**: `SecurePass123!`

---

## 🚀 STEP 6: Push to GitHub (3 minutes)

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Verify .env files are NOT included (should be empty)
git status | grep "\.env"
# Should return nothing

# Create initial commit
git commit -m "Initial commit: Estal PropTech Platform v1.0

- Complete dashboard with 3 role-based views
- 7 main pages with AI-driven insights
- Supabase backend integration
- Edge function for authentication
- Production-ready with security hardening
- Comprehensive documentation"

# Add GitHub remote
git remote add origin https://github.com/EstalProptech/Estal.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 STEP 7: Deploy to Vercel (5 minutes)

### Option A: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..." → "Project"**
3. Select **"Import Git Repository"**
4. Choose: `EstalProptech/Estal`
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_SUPABASE_URL = https://ttsasgbrmswtjtenmksw.supabase.co
     VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2FzZ2JybXN3dGp0ZW5ta3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzExMjUsImV4cCI6MjA3NzI0NzEyNX0.ubkbkAv5YPgABtAZi0s3VgISVNX7uUh11porsHPmMnc
     NODE_ENV = production
     ```
6. Click **"Deploy"**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 📊 Success Checklist

After completing all steps, verify:

- [ ] Database tables created in Supabase
- [ ] Sample data visible in Table Editor
- [ ] Edge function deployed and responding
- [ ] Test user created (admin@estal.com)
- [ ] App runs locally (http://localhost:5173)
- [ ] Can login with test credentials
- [ ] Dashboard displays correctly
- [ ] Code pushed to GitHub
- [ ] Production deployed to Vercel
- [ ] Production URL accessible

---

## 🆘 Troubleshooting

### ❌ "Cannot connect to database"

**Check:**
1. Database password correct?
2. Using correct host: `db.ttsasgbrmswtjtenmksw.supabase.co`
3. Port 5432 for direct connection

**Solution:**
Get password from: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/database

---

### ❌ "Table already exists" error

**This is OK!** The SQL uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times.

---

### ❌ Edge function deployment fails

**Check:**
1. Supabase CLI installed: `supabase --version`
2. Logged in: `supabase login`
3. Project linked: `supabase link --project-ref ttsasgbrmswtjtenmksw`

**Documentation:** `/DEPLOY_EDGE_FUNCTION.md`

---

### ❌ "Cannot login to app"

**Check:**
1. User created in Supabase Auth?
2. Email confirmed?
3. User metadata includes "role" field?

**Solution:**
Create user via Dashboard: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/auth/users

---

## 🔗 Quick Links

**Supabase Dashboard:**
- [SQL Editor](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new) - Run database setup
- [Table Editor](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/editor) - View tables
- [Authentication](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/auth/users) - Manage users
- [Edge Functions](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/functions) - Deploy functions
- [API Settings](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/api) - Get credentials

**Documentation:**
- [Database Setup Guide](/SUPABASE_DATABASE_SETUP.md)
- [Edge Function Deployment](/DEPLOY_EDGE_FUNCTION.md)
- [Environment Setup](/ENVIRONMENT_SETUP.md)
- [Git Setup](/GIT_SETUP_GUIDE.md)
- [Final Checklist](/FINAL_DEPLOYMENT_CHECKLIST.md)

---

## ⚡ Quick Commands Reference

```bash
# Database connection
psql -h db.ttsasgbrmswtjtenmksw.supabase.co -p 5432 -d postgres -U postgres

# Deploy edge function
supabase functions deploy make-server

# Test edge function
curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health

# Start local dev
npm run dev

# Git push
git push origin main

# Vercel deploy
vercel --prod
```

---

## 📞 Current Status

✅ **Environment configured**  
✅ **Supabase credentials set**  
✅ **API key updated**  
⏳ **Database schema pending**  
⏳ **Edge function pending**  
⏳ **GitHub push pending**  
⏳ **Vercel deployment pending**

---

<div align="center">

## 🎯 START HERE: Deploy Database

**Next Action:**  
👉 Open [Supabase SQL Editor](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new)

Copy `/supabase/functions/server/database-setup-fixed.sql` and paste it in!

**Time to complete all steps: ~20 minutes**

</div>
