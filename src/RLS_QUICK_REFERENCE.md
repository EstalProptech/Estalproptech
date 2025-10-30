# ⚡ RLS Quick Reference - EstalProptech Table

## 🎯 What is RLS?

**Row Level Security (RLS)** = Users can only access their own rows in the database.

---

## 📋 Quick Setup (5 Minutes)

### Step 1: Open Supabase SQL Editor
```
Dashboard → SQL Editor → New Query
```

### Step 2: Run This SQL

```sql
-- Enable RLS
ALTER TABLE public.estalproptech ENABLE ROW LEVEL SECURITY;

-- Owner policies
CREATE POLICY "estalproptech_select_owners"
  ON public.estalproptech FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "estalproptech_insert_owners"
  ON public.estalproptech FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "estalproptech_update_owners"
  ON public.estalproptech FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "estalproptech_delete_owners"
  ON public.estalproptech FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Admin bypass (optional)
CREATE POLICY "estalproptech_admin_all"
  ON public.estalproptech FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Step 3: Verify

```sql
-- Check policies
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'estalproptech';

-- Test access (should return only your rows)
SELECT * FROM estalproptech;
```

---

## ✅ What Each Policy Does

| Policy | What It Does |
|--------|--------------|
| **SELECT** | Users see only their own rows |
| **INSERT** | Users can only create rows for themselves |
| **UPDATE** | Users can only modify their own rows |
| **DELETE** | Users can only delete their own rows |
| **ADMIN** | Admins bypass all restrictions |

---

## 🔍 Testing

### ✅ Should Work
```typescript
// Insert with your user_id
const { data } = await supabase
  .from('estalproptech')
  .insert({ user_id: myUserId, data: {...} });

// Query (returns only your rows)
const { data } = await supabase
  .from('estalproptech')
  .select('*');
```

### ❌ Should Fail
```typescript
// Try to insert for another user
const { error } = await supabase
  .from('estalproptech')
  .insert({ user_id: 'someone-elses-id', data: {...} });
// Error: row-level security policy violation
```

---

## 🐛 Common Issues

### Issue: "new row violates row-level security"
**Fix:** Make sure `user_id` matches your `auth.uid()`

### Issue: "permission denied"
**Fix:** Grant table access:
```sql
GRANT ALL ON estalproptech TO authenticated;
```

### Issue: No rows returned
**Fix:** Check you're authenticated:
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('User ID:', user?.id);
```

---

## 📚 Full Guide

→ [SETUP_RLS_ESTALPROPTECH_TABLE.md](SETUP_RLS_ESTALPROPTECH_TABLE.md)

---

**Time:** 5 minutes  
**Difficulty:** Easy  
**Security:** High
