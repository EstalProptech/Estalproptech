# 🗄️ Supabase Database Setup Guide

Complete guide to connect to your Supabase database and set up the Estal PropTech schema.

---

## 📋 Prerequisites

- Supabase project: `ttsasgbrmswtjtenmksw`
- Database host: `db.ttsasgbrmswtjtenmksw.supabase.co`
- PostgreSQL client (`psql`) installed
- Database password from Supabase Dashboard

---

## 🔐 Get Your Database Password

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/database)
2. Navigate to: **Settings → Database**
3. Find the **Database Password** section
4. Copy your password (or reset if forgotten)

---

## 🚀 Method 1: Connect via psql (Command Line)

### Step 1: Install psql

**macOS:**
```bash
brew install postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-client
```

**Windows:**
Download from: https://www.postgresql.org/download/windows/

### Step 2: Connect to Database

```bash
psql -h db.ttsasgbrmswtjtenmksw.supabase.co -p 5432 -d postgres -U postgres
```

When prompted, enter your database password.

### Step 3: Run Database Setup

Once connected, you have two options:

**Option A: Use the FIXED version (Recommended)**
```sql
\i /path/to/supabase/functions/server/database-setup-fixed.sql
```

**Option B: Paste the SQL directly**
Copy the entire contents of `database-setup-fixed.sql` and paste into the psql terminal.

### Step 4: Verify Setup

```sql
-- Check tables created
\dt

-- View user profiles view
SELECT * FROM user_profiles;

-- View properties
SELECT * FROM properties;

-- Test KPIs function
SELECT get_dashboard_kpis();
```

---

## 🌐 Method 2: Use Supabase SQL Editor (Easier!)

### Step 1: Access SQL Editor

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/sql/new)
2. You'll see a blank SQL editor

### Step 2: Copy SQL Setup

Open `/supabase/functions/server/database-setup-fixed.sql` and copy the **entire contents** (all 435 lines)

### Step 3: Run Setup

1. Paste the SQL into the editor
2. Click **"Run"** button (bottom right)
3. Wait for confirmation (should take ~5 seconds)

### Step 4: Verify in Table Editor

1. Go to [Table Editor](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/editor)
2. You should see:
   - ✅ `properties` (5 sample properties)
   - ✅ `financial_reports` (5 sample reports)
   - ✅ `maintenance_requests` (3 sample requests)
   - ✅ `user_profiles` (view over KV store)

---

## 🔍 What Gets Created

### Tables

1. **`properties`** - Property management
   - Stores property details, rent, status, occupancy
   - Links to owners via `owner_id`
   - 5 sample properties included

2. **`financial_reports`** - Financial tracking
   - Monthly revenue, expenses, profit, ROI
   - 5 months of sample data
   - Auto-calculates profit

3. **`maintenance_requests`** - Maintenance tracking
   - Request details, priority, status, cost
   - Links to properties
   - 3 sample requests included

4. **`user_profiles` (VIEW)** - User data
   - Virtual view over KV store (`kv_store_96250128`)
   - Makes KV store data queryable like a table
   - Auto-populated when users register

### Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Role-based access policies (Admin, Accountant, Owner)
- ✅ Secure authentication via Supabase Auth
- ✅ Encrypted connections (SSL/TLS)

### Functions

- ✅ `get_dashboard_kpis()` - Role-aware KPI calculator
- ✅ `update_updated_at_column()` - Auto-update timestamps

### Indexes

- ✅ Performance indexes on frequently queried columns
- ✅ Composite indexes for complex queries

---

## 🧪 Test Your Setup

### 1. Test Database Connection

```sql
SELECT current_database(), current_user, version();
```

**Expected output:**
```
 current_database | current_user |          version
------------------+--------------+---------------------------
 postgres         | postgres     | PostgreSQL 15.x on x86_64
```

### 2. Test Tables

```sql
-- Count records
SELECT 
  (SELECT COUNT(*) FROM properties) as properties,
  (SELECT COUNT(*) FROM financial_reports) as reports,
  (SELECT COUNT(*) FROM maintenance_requests) as maintenance;
```

**Expected output:**
```
 properties | reports | maintenance
------------+---------+-------------
     5      |    5    |      3
```

### 3. Test User Profiles View

```sql
-- Should be empty initially (no users registered yet)
SELECT COUNT(*) FROM user_profiles;
```

**Expected output:** `0` (until you register users)

### 4. Test KPIs Function

```sql
SELECT get_dashboard_kpis();
```

**Expected output:** JSON with dashboard metrics

---

## 👤 Create Test Users

### Via Edge Function (Recommended)

Use your deployed edge function to create users:

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

### Via Supabase Dashboard

1. Go to [Authentication → Users](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/auth/users)
2. Click **"Add user"**
3. Enter:
   - Email: `admin@estal.com`
   - Password: `SecurePass123!`
   - Email confirmed: ✅ Yes
   - User metadata:
     ```json
     {
       "name": "Admin User",
       "role": "admin"
     }
     ```

### Via SQL (Advanced)

```sql
-- Note: This creates auth user, but you'll need to create profile separately via app
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'admin@estal.com',
  crypt('SecurePass123!', gen_salt('bf')),
  NOW()
);
```

---

## 🔐 Connection String Format

### For psql
```
psql -h db.ttsasgbrmswtjtenmksw.supabase.co -p 5432 -d postgres -U postgres
```

### For .env file
```env
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.ttsasgbrmswtjtenmksw.supabase.co:5432/postgres
```

### For Connection Pooler (Recommended for Production)
```
postgresql://postgres:[YOUR_PASSWORD]@db.ttsasgbrmswtjtenmksw.supabase.co:6543/postgres
```
*Note: Port 6543 for connection pooling (better for serverless)*

---

## 🧹 Clean Up Old Functions

After successful database setup, you can remove duplicate directories:

```bash
# Keep: /supabase/functions/make-server/ (active)
# Remove:
rm -rf /supabase/functions/make-server-96250128/
rm -rf /supabase/functions/server/
```

---

## 🆘 Troubleshooting

### ❌ "Connection refused"
- Check if you're using correct host: `db.ttsasgbrmswtjtenmksw.supabase.co`
- Verify port: `5432` (direct) or `6543` (pooler)
- Ensure your IP is not blocked by firewall

### ❌ "Password authentication failed"
- Reset password in Supabase Dashboard → Settings → Database
- Make sure you're using the **database password**, not your account password

### ❌ "SSL required"
Add `sslmode=require` to connection:
```bash
psql "postgresql://postgres:[PASSWORD]@db.ttsasgbrmswtjtenmksw.supabase.co:5432/postgres?sslmode=require"
```

### ❌ "Permission denied"
- Make sure you're using user `postgres` (not `supabase_admin`)
- Check RLS policies if queries fail after authentication

### ❌ "Table already exists"
The SQL uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times. Existing data won't be lost.

---

## ✅ Success Checklist

After setup, verify:

- [ ] Connected to database successfully
- [ ] `properties` table created with 5 sample rows
- [ ] `financial_reports` table created with 5 sample rows  
- [ ] `maintenance_requests` table created with 3 sample rows
- [ ] `user_profiles` view created (queryable)
- [ ] RLS policies active on all tables
- [ ] `get_dashboard_kpis()` function works
- [ ] Can register new users via app
- [ ] User profiles appear in `user_profiles` view after registration

---

## 🚀 Next Steps

1. ✅ Run database setup SQL
2. ✅ Deploy edge function: `make-server`
3. ✅ Test user registration
4. ✅ Verify user profiles in database
5. ✅ Test login with demo accounts
6. ✅ Push code to GitHub
7. ✅ Deploy to Vercel

---

## 📚 Related Documentation

- [Edge Function Setup](/DEPLOY_EDGE_FUNCTION.md)
- [Authentication Guide](/docs/AUTHENTICATION_GUIDE.md)
- [Deployment Guide](/docs/DEPLOYMENT_GUIDE.md)
- [Troubleshooting](/docs/TROUBLESHOOTING.md)

---

<div align="center">

**🎯 Quick Command:**

```bash
psql -h db.ttsasgbrmswtjtenmksw.supabase.co -p 5432 -d postgres -U postgres
```

Then paste contents of `/supabase/functions/server/database-setup-fixed.sql`

</div>
