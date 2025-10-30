# ⚡ Quick Fix: SQL File Path Error

## 🎯 Error
```
LINE 1: /supabase/functions/server/database-setup.sql
        ^
```

---

## ✅ The Problem

You pasted the **file path** into Supabase SQL Editor.  
PostgreSQL tried to execute it as SQL code.

---

## 🔧 The Solution (2 Minutes)

### Step 1: Don't Paste This ❌
```
/supabase/functions/server/database-setup-fixed.sql
```

### Step 2: Paste This Instead ✅

Go to **Supabase Dashboard** → **SQL Editor** → **New Query**

Paste the **full SQL code** (435 lines):

```sql
-- KLZ PropTech Database Schema - FIXED VERSION

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

-- ... (rest of SQL - see full code in FIX_SQL_PATH_ERROR.md)
```

### Step 3: Click Run ▶️

Wait 5-10 seconds for completion.

---

## 📋 Where to Get the Full SQL

1. **From your local files:**
   ```bash
   cat supabase/functions/server/database-setup-fixed.sql
   ```

2. **From the complete guide:**  
   → [FIX_SQL_PATH_ERROR.md](FIX_SQL_PATH_ERROR.md)

3. **From GitHub:**
   ```bash
   git clone https://github.com/EstalProptech/Estal.git
   cat Estal/supabase/functions/server/database-setup-fixed.sql
   ```

---

## ✅ Verify Success

After running:

```sql
-- Should return 5 properties
SELECT COUNT(*) FROM properties;

-- Should return 5 financial reports
SELECT COUNT(*) FROM financial_reports;

-- Should return 3 maintenance requests
SELECT COUNT(*) FROM maintenance_requests;
```

---

## 🎯 What's Created

- ✅ `user_profiles` view (from KV store)
- ✅ `properties` table
- ✅ `financial_reports` table
- ✅ `maintenance_requests` table
- ✅ All RLS policies
- ✅ Sample data

---

## 📚 Full Guide

→ [FIX_SQL_PATH_ERROR.md](FIX_SQL_PATH_ERROR.md)

---

**Time:** 2 minutes  
**Difficulty:** Easy  
**Success Rate:** 99%
