# 📊 SQL Files Comparison: Which One to Use?

## 🎯 Quick Answer

**USE THIS FILE:** `/supabase/functions/server/database-setup-fixed.sql` ✅

**DON'T USE:** `/supabase/functions/server/database-setup.sql` ❌

---

## 📋 Side-by-Side Comparison

| Feature | ❌ database-setup.sql (OLD) | ✅ database-setup-fixed.sql (NEW) |
|---------|--------------------------|--------------------------------|
| **User Profiles** | Assumes `user_profiles` table exists | Creates `user_profiles` VIEW over KV store |
| **Foreign Keys** | `owner_id UUID REFERENCES user_profiles(id)` | `owner_id UUID` (no FK, app-enforced) |
| **RLS Policies** | ❌ Will fail - no user_profiles table | ✅ Works - queries the view |
| **KV Store Integration** | ❌ Not integrated | ✅ Fully integrated |
| **Will it work?** | ❌ NO - Missing user_profiles | ✅ YES - Creates everything needed |
| **Error Messages** | "relation user_profiles does not exist" | No errors |
| **Maintenance** | Outdated | Current and maintained |

---

## 🔍 Key Differences

### 1. User Profiles Approach

#### ❌ OLD FILE (Line 28)
```sql
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,  -- ❌ Fails
  ...
);
```

#### ✅ NEW FILE (Lines 11-23, 41)
```sql
-- First, create the VIEW
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  (value->>'id')::uuid as id,
  value->>'name' as name,
  value->>'email' as email,
  value->>'role' as role,
  ...
FROM kv_store_96250128
WHERE key LIKE 'user_profile:%';

-- Then, create properties WITHOUT foreign key constraint
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID,  -- ✅ No FK, enforced by app logic
  ...
);

COMMENT ON COLUMN properties.owner_id IS 
  'References user_profiles.id (view over KV store). Enforced by application logic.';
```

---

### 2. RLS Policies

#### Both files use similar policies, but:

**❌ OLD FILE** - Policies reference non-existent table:
```sql
CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles  -- ❌ Table doesn't exist = ERROR
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**✅ NEW FILE** - Policies reference the VIEW:
```sql
CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles  -- ✅ View exists = WORKS
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

### 3. Dashboard KPI Function

Both files have the same function, but:

**❌ OLD FILE** - Function queries non-existent table
**✅ NEW FILE** - Function queries the view

```sql
CREATE OR REPLACE FUNCTION get_dashboard_kpis()
RETURNS JSON AS $$
DECLARE
  user_role TEXT;
  user_id UUID;
BEGIN
  user_id := auth.uid();
  
  SELECT role INTO user_role
  FROM user_profiles  -- ✅ Works in NEW file, ❌ Fails in OLD file
  WHERE id = user_id;
  ...
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🚨 Symptoms of Using the Wrong File

If you used the **OLD file**, you'll see these errors:

### Error 1: During SQL Execution
```
ERROR: relation "user_profiles" does not exist
LINE 28:   owner_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
```

### Error 2: When Querying Properties
```
ERROR: column "user_id" does not exist
```

### Error 3: When Testing RLS Policies
```
ERROR: relation "user_profiles" does not exist
CONTEXT: SQL statement "SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'"
```

### Error 4: In Application Logs
```
Error fetching properties: relation "user_profiles" does not exist
```

---

## ✅ Benefits of the NEW File

1. **KV Store Integration** ✨
   - Reads user profiles from KV store
   - No separate user_profiles table needed
   - Consistent with app architecture

2. **No Schema Conflicts** 🛡️
   - Can't create foreign keys to views
   - Prevents database constraint violations
   - Application enforces referential integrity

3. **Flexibility** 🔄
   - Easy to modify user profile structure
   - Just update JSON in KV store
   - View automatically reflects changes

4. **Performance** ⚡
   - Indexed KV store lookups
   - Efficient JSON parsing
   - Optimized for read-heavy workloads

5. **Compatibility** 🔗
   - Works with existing authentication
   - Compatible with Supabase Auth
   - Integrates with RLS policies

---

## 🔄 Migration Path

### If You Already Ran the OLD File

Don't panic! Here's how to fix it:

#### Step 1: Drop existing constraints
```sql
-- Drop foreign key constraints
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_owner_id_fkey;

-- Modify column
ALTER TABLE properties ALTER COLUMN owner_id DROP NOT NULL;
```

#### Step 2: Create the user_profiles view
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

GRANT SELECT ON user_profiles TO authenticated, anon;
```

#### Step 3: Add comment
```sql
COMMENT ON COLUMN properties.owner_id IS 
  'References user_profiles.id (view over KV store). Enforced by application logic.';
```

#### Step 4: Test
```sql
SELECT * FROM user_profiles;
SELECT * FROM properties;
```

---

## 📝 Verification Checklist

After running the **NEW** file, verify:

```sql
-- ✅ Check 1: View exists
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'user_profiles';
-- Expected: user_profiles | VIEW

-- ✅ Check 2: No foreign key on owner_id
SELECT
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'properties' 
  AND tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name = 'owner_id';
-- Expected: No rows (empty result)

-- ✅ Check 3: RLS policies exist
SELECT policyname, tablename, cmd 
FROM pg_policies 
WHERE tablename IN ('properties', 'financial_reports', 'maintenance_requests')
ORDER BY tablename, policyname;
-- Expected: Multiple policies listed

-- ✅ Check 4: Function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'get_dashboard_kpis';
-- Expected: Function definition shown

-- ✅ Check 5: Can query everything
SELECT COUNT(*) as property_count FROM properties;
SELECT COUNT(*) as maintenance_count FROM maintenance_requests;
SELECT COUNT(*) as report_count FROM financial_reports;
SELECT COUNT(*) as user_count FROM user_profiles;
-- Expected: Numbers (even if 0)
```

---

## 🎯 Final Recommendation

### For New Deployments
```bash
# Copy the FIXED file
cp /supabase/functions/server/database-setup-fixed.sql ./deploy.sql

# Run in Supabase SQL Editor
# Paste contents of deploy.sql
# Click Run
```

### For Existing Deployments
```bash
# If you used the OLD file, run the migration queries above
# Then verify with the checklist
# Then test your application
```

---

## 📚 Additional Resources

- **Fix Guide**: `/DATABASE_FIX_USER_ID_ERROR.md` ← Start here if you have errors
- **Deployment Guide**: `/DATABASE_DEPLOYMENT_NOW.md` ← Full deployment instructions
- **KV Store Guide**: `/docs/KV_STORE_OPTIMIZATION_GUIDE.md` ← Understand the architecture
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md` ← Common issues and solutions

---

## 💡 Pro Tips

1. **Always backup** before running SQL
2. **Test in development** first (use Supabase local development)
3. **Read the comments** in the SQL file - they explain what each section does
4. **Check the logs** in Supabase Dashboard → Database → Logs
5. **Use transactions** for complex migrations:
   ```sql
   BEGIN;
   -- Your SQL here
   COMMIT;  -- Or ROLLBACK if something fails
   ```

---

**TL;DR:** Use `database-setup-fixed.sql`, not `database-setup.sql`. The FIXED version creates a VIEW for user_profiles that reads from the KV store, which is how your app stores user data. The OLD version assumes a user_profiles table exists, which it doesn't, causing "column user_id does not exist" errors. 🎯

---

**Last Updated:** October 30, 2025  
**File Status:**  
- ❌ `database-setup.sql` - Deprecated  
- ✅ `database-setup-fixed.sql` - Current and recommended
