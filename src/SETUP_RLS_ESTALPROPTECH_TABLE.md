# 🔒 Setup RLS for EstalProptech Table

## 📋 Overview

This guide sets up **Row Level Security (RLS)** for the `estalproptech` table, ensuring users can only access their own data based on `user_id`.

---

## 🎯 What This Does

**Row Level Security (RLS)** ensures:
- ✅ Users can only **read** their own rows
- ✅ Users can only **insert** rows with their own `user_id`
- ✅ Users can only **update/delete** their own rows
- ✅ Admins can bypass these restrictions (optional)

---

## 📊 Table Structure

First, let's understand what the `estalproptech` table should contain:

```sql
-- EstalProptech Main Data Table
CREATE TABLE IF NOT EXISTS public.estalproptech (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,  -- References auth.users(id)
  
  -- Add your columns here
  property_data JSONB,
  financial_data JSONB,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_estalproptech_user_id ON public.estalproptech(user_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_estalproptech_updated_at ON public.estalproptech;
CREATE TRIGGER update_estalproptech_updated_at
  BEFORE UPDATE ON public.estalproptech
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Note:** Modify the columns based on your actual needs.

---

## 🔐 Apply RLS Policies

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy & Paste This SQL

```sql
-- ============================================
-- ESTALPROPTECH TABLE RLS SETUP
-- ============================================

-- 1. ENABLE RLS
ALTER TABLE public.estalproptech ENABLE ROW LEVEL SECURITY;

-- 2. DROP EXISTING POLICIES (if any)
DROP POLICY IF EXISTS "estalproptech_select_owners" ON public.estalproptech;
DROP POLICY IF EXISTS "estalproptech_insert_owners" ON public.estalproptech;
DROP POLICY IF EXISTS "estalproptech_update_owners" ON public.estalproptech;
DROP POLICY IF EXISTS "estalproptech_delete_owners" ON public.estalproptech;
DROP POLICY IF EXISTS "estalproptech_admin_all" ON public.estalproptech;

-- 3. CREATE POLICIES FOR OWNERS

-- Allow owners to read their rows
CREATE POLICY "estalproptech_select_owners"
  ON public.estalproptech
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow owners to insert rows assigned to themselves
CREATE POLICY "estalproptech_insert_owners"
  ON public.estalproptech
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow owners to update their rows
CREATE POLICY "estalproptech_update_owners"
  ON public.estalproptech
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow owners to delete their rows
CREATE POLICY "estalproptech_delete_owners"
  ON public.estalproptech
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. CREATE ADMIN BYPASS POLICY (Optional)
-- Admins can access all rows regardless of user_id
CREATE POLICY "estalproptech_admin_all"
  ON public.estalproptech
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- VERIFICATION
-- ============================================

-- List all policies on the table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'estalproptech'
ORDER BY policyname;

-- Test RLS (should return only current user's rows)
-- SELECT * FROM public.estalproptech;
```

### Step 3: Click Run ▶️

Wait for completion. You should see:
```
Success. No rows returned
```

---

## ✅ Verify RLS is Working

### Test 1: Check Policies Exist

```sql
SELECT policyname, cmd, permissive
FROM pg_policies
WHERE tablename = 'estalproptech';
```

**Expected output:**
```
policyname                      | cmd    | permissive
--------------------------------|--------|------------
estalproptech_admin_all         | ALL    | PERMISSIVE
estalproptech_delete_owners     | DELETE | PERMISSIVE
estalproptech_insert_owners     | INSERT | PERMISSIVE
estalproptech_select_owners     | SELECT | PERMISSIVE
estalproptech_update_owners     | UPDATE | PERMISSIVE
```

### Test 2: Insert Test Data (as authenticated user)

```sql
-- This should work (inserting with your own user_id)
INSERT INTO public.estalproptech (user_id, property_data)
VALUES (auth.uid(), '{"test": "data"}'::jsonb);

-- This should FAIL (inserting with different user_id)
INSERT INTO public.estalproptech (user_id, property_data)
VALUES ('00000000-0000-0000-0000-000000000000'::uuid, '{"test": "data"}'::jsonb);
-- ERROR: new row violates row-level security policy
```

### Test 3: Query Test Data

```sql
-- Should only return rows where user_id = your auth.uid()
SELECT id, user_id, created_at
FROM public.estalproptech;
```

---

## 🔍 Understanding the Policies

### Policy Breakdown

#### 1. SELECT Policy (Read)
```sql
USING (auth.uid() = user_id)
```
- **Meaning:** Users can only see rows where their `user_id` matches `auth.uid()`
- **Effect:** Each user sees only their own data

#### 2. INSERT Policy (Create)
```sql
WITH CHECK (auth.uid() = user_id)
```
- **Meaning:** Users can only insert rows where `user_id` = their own ID
- **Effect:** Users cannot create rows for other users

#### 3. UPDATE Policy (Modify)
```sql
USING (auth.uid() = user_id)    -- Can only update own rows
WITH CHECK (auth.uid() = user_id)  -- Cannot change user_id to someone else
```
- **Meaning:** Users can only modify their own rows and cannot transfer ownership
- **Effect:** Row ownership is immutable

#### 4. DELETE Policy (Remove)
```sql
USING (auth.uid() = user_id)
```
- **Meaning:** Users can only delete their own rows
- **Effect:** Users cannot delete other users' data

#### 5. Admin Bypass Policy
```sql
EXISTS (
  SELECT 1 FROM user_profiles
  WHERE id = auth.uid() AND role = 'admin'
)
```
- **Meaning:** Admins can access all rows
- **Effect:** Admin users have full access

---

## 🔧 Integration with Your App

### Frontend Usage (React)

```typescript
import { supabase } from './lib/supabaseClient';

// ✅ This works - user_id automatically enforced by RLS
const { data, error } = await supabase
  .from('estalproptech')
  .select('*');
// Returns only current user's rows

// ✅ This works - inserting with current user's ID
const { data, error } = await supabase
  .from('estalproptech')
  .insert({
    user_id: (await supabase.auth.getUser()).data.user?.id,
    property_data: { ... }
  });

// ❌ This fails - trying to insert for different user
const { data, error } = await supabase
  .from('estalproptech')
  .insert({
    user_id: 'some-other-user-id',
    property_data: { ... }
  });
// Error: new row violates row-level security policy
```

### Backend Usage (Edge Function)

```typescript
// In your edge function
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Service role key BYPASSES RLS
// Use with caution!
const { data } = await supabase
  .from('estalproptech')
  .select('*');
// Returns ALL rows from ALL users

// To respect RLS in edge function, use the user's token
const accessToken = request.headers.get('Authorization')?.split(' ')[1];
const userSupabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  }
);

// Now RLS is enforced
const { data } = await userSupabase
  .from('estalproptech')
  .select('*');
// Returns only that user's rows
```

---

## 🎓 Advanced: Role-Based Policies

### Allow Accountants to View All Data

```sql
-- Accountants can view all rows (read-only)
CREATE POLICY "estalproptech_accountant_view"
  ON public.estalproptech
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'accountant')
    )
    OR auth.uid() = user_id  -- Owners can still see their own
  );
```

### Allow Property Managers to Edit Specific Properties

```sql
-- Property managers can edit properties they manage
CREATE POLICY "estalproptech_manager_edit"
  ON public.estalproptech
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN property_managers pm ON pm.manager_id = up.id
      WHERE up.id = auth.uid()
      AND pm.property_id = estalproptech.id
    )
  );
```

---

## 🐛 Troubleshooting

### Error: "new row violates row-level security policy"

**Cause:** You're trying to insert/update a row that doesn't match the policy.

**Solutions:**
1. **Check user_id:**
   ```typescript
   const userId = (await supabase.auth.getUser()).data.user?.id;
   console.log('Current user ID:', userId);
   ```

2. **Verify you're authenticated:**
   ```typescript
   const { data: { session } } = await supabase.auth.getSession();
   if (!session) {
     console.error('Not authenticated!');
   }
   ```

3. **Check the policy:**
   ```sql
   -- Make sure your policy allows the operation
   SELECT * FROM pg_policies WHERE tablename = 'estalproptech';
   ```

### Error: "permission denied for table estalproptech"

**Cause:** Table doesn't have proper grants.

**Solution:**
```sql
-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.estalproptech TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
```

### No Rows Returned (but you know data exists)

**Cause:** RLS is filtering out rows because `user_id` doesn't match.

**Solutions:**
1. **Check auth:**
   ```typescript
   const { data: { user } } = await supabase.auth.getUser();
   console.log('Logged in as:', user?.id);
   ```

2. **Check data:**
   ```sql
   -- As admin or with service role key
   SELECT id, user_id FROM estalproptech;
   ```

3. **Verify user_id in rows matches auth.uid()**

---

## 📊 Performance Optimization

### Indexes for RLS

```sql
-- Essential: Index on user_id
CREATE INDEX IF NOT EXISTS idx_estalproptech_user_id 
  ON public.estalproptech(user_id);

-- For admin role checks
CREATE INDEX IF NOT EXISTS idx_user_profiles_id_role 
  ON user_profiles(id, role);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_estalproptech_user_created 
  ON public.estalproptech(user_id, created_at DESC);
```

### Query Performance

```sql
-- Check if indexes are being used
EXPLAIN ANALYZE
SELECT * FROM public.estalproptech
WHERE user_id = auth.uid();

-- Should show "Index Scan using idx_estalproptech_user_id"
```

---

## 🔄 Migration from Non-RLS Setup

If you already have data without RLS:

### Step 1: Backup Data

```sql
-- Export to backup table
CREATE TABLE estalproptech_backup AS
SELECT * FROM estalproptech;
```

### Step 2: Add user_id Column (if missing)

```sql
-- Add column
ALTER TABLE estalproptech 
  ADD COLUMN IF NOT EXISTS user_id UUID;

-- Set default user_id for existing rows
-- (You'll need to determine the appropriate user_id for each row)
UPDATE estalproptech
SET user_id = 'some-default-user-id'::uuid
WHERE user_id IS NULL;

-- Make column required
ALTER TABLE estalproptech
  ALTER COLUMN user_id SET NOT NULL;
```

### Step 3: Enable RLS

```sql
-- Enable RLS (will block all access initially)
ALTER TABLE estalproptech ENABLE ROW LEVEL SECURITY;

-- Add policies (use the SQL from above)
-- ...

-- Verify access works
SELECT * FROM estalproptech;
```

---

## ✅ Complete Setup Checklist

- [ ] **Table exists** with `user_id` column
- [ ] **RLS enabled** on table
- [ ] **Policies created** for SELECT, INSERT, UPDATE, DELETE
- [ ] **Admin bypass** policy created (optional)
- [ ] **Indexes created** on `user_id`
- [ ] **Grants applied** to authenticated role
- [ ] **Verified** with test queries
- [ ] **Frontend tested** - users see only their data
- [ ] **Backend tested** - RLS respected in edge functions
- [ ] **Performance checked** - indexes being used

---

## 📚 Related Documentation

- **Database Setup:** [DATABASE_DEPLOYMENT_NOW.md](DATABASE_DEPLOYMENT_NOW.md)
- **User Profiles:** [DATABASE_FIX_USER_ID_ERROR.md](DATABASE_FIX_USER_ID_ERROR.md)
- **Authentication:** [docs/AUTHENTICATION_GUIDE.md](docs/AUTHENTICATION_GUIDE.md)
- **Supabase RLS Docs:** https://supabase.com/docs/guides/auth/row-level-security

---

## 🎯 Next Steps

After setting up RLS:

1. **Test in your app** - Register users and verify data isolation
2. **Monitor performance** - Check query execution plans
3. **Review policies** - Ensure they match your business logic
4. **Document usage** - Add RLS info to your API documentation
5. **Deploy to production** - Follow deployment guide

---

**Created:** October 30, 2025  
**Status:** ✅ Production-ready  
**Security Level:** High  
**Estimated Setup Time:** 10 minutes
