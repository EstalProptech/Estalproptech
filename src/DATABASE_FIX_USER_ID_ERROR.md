# 🔧 Database Fix: "Column user_id does not exist" Error

## 🎯 Problem Diagnosis

You're encountering the error: **"column 'user_id' does not exist"**

This happens because your database is missing the proper setup for user profiles. Your Estal PropTech platform stores user profiles in the **KV Store**, not in a traditional `user_profiles` table.

---

## ✅ Solution: Use the FIXED Database Setup

### Step 1: Use the Correct SQL File

You have TWO database setup files:
- ❌ `/supabase/functions/server/database-setup.sql` (OLD - Don't use)
- ✅ `/supabase/functions/server/database-setup-fixed.sql` (NEW - Use this!)

---

## 🚀 Quick Fix (5 minutes)

### 1. Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select project: **ttsasgbrmswtjtenmksw**
3. Click **SQL Editor** (left sidebar)

### 2. Run the Fixed Database Setup

1. Open the file: `/supabase/functions/server/database-setup-fixed.sql`
2. Copy **ALL** the SQL code
3. Paste it into Supabase SQL Editor
4. Click **Run** (or press `Ctrl/Cmd + Enter`)

### 3. Verify the Fix

Run this query to confirm the view was created:

```sql
SELECT * FROM user_profiles;
```

Expected result: Empty table (or existing user profiles if you have any)

---

## 📊 What the Fix Does

The fixed SQL file creates a **VIEW** called `user_profiles` that reads from your KV store:

```sql
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  (value->>'id')::uuid as id,
  value->>'name' as name,
  value->>'email' as email,
  value->>'role' as role,
  COALESCE(value->>'status', 'active') as status,
  value->>'avatar_url' as avatar_url,
  (value->>'created_at')::timestamp with time zone as created_at,
  (value->>'last_login')::timestamp with time zone as last_login,
  (value->>'last_login')::timestamp with time zone as updated_at
FROM kv_store_96250128
WHERE key LIKE 'user_profile:%';
```

This allows:
- ✅ All RLS policies to work (they reference `user_profiles`)
- ✅ Properties to reference `owner_id` (links to `user_profiles.id`)
- ✅ All role-based access controls to function
- ✅ Dashboard KPIs to calculate correctly

---

## 🔍 Detailed Explanation: Why This Happens

### Your Architecture
Your platform uses a **KV Store** (key-value store) to store user profiles instead of a traditional SQL table. This is stored in the table: `kv_store_96250128`

### The Problem
Your other tables (properties, maintenance_requests, etc.) reference `user_profiles` in their RLS policies and foreign keys, but `user_profiles` doesn't exist as a real table.

### The Solution
Create a **VIEW** that makes the KV store queryable as if it were a table. This view:
- Extracts user data from JSON in the KV store
- Presents it as columns (id, name, email, role, etc.)
- Allows SQL queries to work normally
- Enables RLS policies to function

---

## 🧪 Testing the Fix

After running the fixed SQL, test with these queries:

### 1. Check if view exists
```sql
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'user_profiles';
```
Expected: Shows `user_profiles` with type `VIEW`

### 2. Check all tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```
Expected: Shows `properties`, `financial_reports`, `maintenance_requests`, `user_profiles`

### 3. Verify RLS policies work
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('properties', 'financial_reports', 'maintenance_requests')
ORDER BY tablename, policyname;
```
Expected: Shows all your RLS policies

### 4. Test a property query (as admin)
```sql
-- This should work without errors if RLS is working
SELECT * FROM properties LIMIT 5;
```

---

## 🆘 Troubleshooting

### Error: "relation kv_store_96250128 does not exist"

**Cause:** The KV store table hasn't been created yet.

**Fix:** The table name might be different. Find the correct KV store table:

```sql
SELECT tablename 
FROM pg_tables 
WHERE tablename LIKE 'kv_store_%';
```

Then update line 22 in the SQL file to use the correct table name.

---

### Error: "permission denied for table user_profiles"

**Cause:** Permissions not granted.

**Fix:** Run this:

```sql
GRANT SELECT ON user_profiles TO authenticated, anon;
```

---

### Error: Still can't query properties

**Cause:** RLS policies might be too restrictive or auth.uid() is NULL.

**Fix:** Temporarily disable RLS for testing:

```sql
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
SELECT * FROM properties;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
```

If this works, the issue is with your authentication context, not the database structure.

---

## 📋 Post-Fix Checklist

After running the fixed SQL:

- [ ] `user_profiles` view exists
- [ ] Can query: `SELECT * FROM user_profiles;`
- [ ] Can query: `SELECT * FROM properties;`
- [ ] Can query: `SELECT * FROM maintenance_requests;`
- [ ] Can query: `SELECT * FROM financial_reports;`
- [ ] No "column user_id does not exist" errors
- [ ] Application loads without database errors
- [ ] Login/register flows work
- [ ] Dashboard displays data correctly

---

## 🔄 What Changed Between SQL Files

### OLD File (`database-setup.sql`)
```sql
-- Line 28: References user_profiles as if it's a table
owner_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,

-- Line 85-106: Creates policies assuming user_profiles table exists
CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles  -- ❌ This fails
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### NEW File (`database-setup-fixed.sql`)
```sql
-- Lines 11-23: Creates VIEW first
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  (value->>'id')::uuid as id,
  ...
FROM kv_store_96250128
WHERE key LIKE 'user_profile:%';

-- Line 41: No foreign key constraint (enforced by app)
owner_id UUID,  -- Note: No foreign key to view

-- Lines 104-112: Same policies, but now user_profiles exists
CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles  -- ✅ This works
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 💡 Best Practices Going Forward

1. **Always use `database-setup-fixed.sql`** for new deployments
2. **Don't modify the KV store table name** - it's hardcoded in the view
3. **Test locally first** using Supabase local development
4. **Backup before running** any SQL in production
5. **Keep the view in sync** if you change user profile structure

---

## 📚 Related Documentation

- **Database Deployment Guide**: `/DATABASE_DEPLOYMENT_NOW.md`
- **Deployment Summary**: `/DEPLOYMENT_SUMMARY.md`
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md`
- **KV Store Guide**: `/docs/KV_STORE_OPTIMIZATION_GUIDE.md`

---

## ✅ Success Indicators

You'll know the fix worked when:

1. ✅ No more "column user_id does not exist" errors
2. ✅ No more "relation user_profiles does not exist" errors
3. ✅ Dashboard loads and displays KPIs
4. ✅ Properties list shows data
5. ✅ Users can log in successfully
6. ✅ Role-based access control works (admin sees all, owner sees theirs)

---

## 🎯 Next Steps After Fix

Once the database is fixed:

1. **Deploy Edge Function**: Follow `/DEPLOY_EDGE_FUNCTION.md`
2. **Test Authentication**: Try registering a new user
3. **Add Sample Data**: Use the seed data in the SQL file
4. **Test All Roles**: Create admin, owner, and accountant users
5. **Go Live**: Deploy to production via Vercel

---

**Last Updated:** October 30, 2025  
**Platform:** Estal PropTech  
**Issue:** Column user_id does not exist  
**Resolution:** Use database-setup-fixed.sql instead of database-setup.sql
