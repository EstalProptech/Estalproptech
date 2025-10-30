# 🔧 Database Error Quick Reference Card
## "Column user_id does not exist" Error

---

## ⚡ QUICK FIX (3 minutes)

### 1️⃣ Open Supabase SQL Editor
```
URL: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw
Click: SQL Editor → New Query
```

### 2️⃣ Copy & Paste This SQL
```
File: /supabase/functions/server/database-setup-fixed.sql
Copy: ALL the content
Paste: Into SQL Editor
```

### 3️⃣ Run & Verify
```
Click: Run button
Test: SELECT * FROM user_profiles;
```

**Done! ✅**

---

## 🎯 What This Does

Creates a **VIEW** called `user_profiles` that reads from your KV store:

```
KV Store (kv_store_96250128)
    ↓
VIEW (user_profiles)
    ↓
Properties, RLS Policies, Dashboard → All work!
```

---

## ❓ Why This Error Happens

```
❌ PROBLEM:
Users stored in KV store
BUT
Properties/RLS policies expect user_profiles table
Result: "user_id does not exist" error

✅ SOLUTION:
Create VIEW that makes KV store queryable as table
NOW
Everything works!
```

---

## 🧪 Verification Queries

### Check VIEW exists:
```sql
SELECT * FROM user_profiles;
```
**Expected:** Table structure (even if empty)

### Check properties work:
```sql
SELECT * FROM properties;
```
**Expected:** Sample properties or empty table

### Check RLS policies:
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'properties';
```
**Expected:** Multiple policies listed

---

## 🚨 Troubleshooting

### Error: "relation kv_store_96250128 does not exist"
```sql
-- Find correct table name:
SELECT tablename FROM pg_tables WHERE tablename LIKE 'kv_store_%';
-- Update line 22 in SQL file
```

### Error: "permission denied"
```sql
GRANT SELECT ON user_profiles TO authenticated, anon;
```

### Still failing?
```sql
-- Check if VIEW was created:
SELECT viewname FROM pg_views WHERE viewname = 'user_profiles';
```

---

## 📚 Full Documentation

- **Quick Fix**: [FIX_USER_ID_ERROR_NOW.md](FIX_USER_ID_ERROR_NOW.md)
- **Complete Guide**: [DATABASE_FIX_USER_ID_ERROR.md](DATABASE_FIX_USER_ID_ERROR.md)
- **File Comparison**: [SQL_FILE_COMPARISON.md](SQL_FILE_COMPARISON.md)
- **Architecture**: [DATABASE_ARCHITECTURE_DIAGRAM.md](DATABASE_ARCHITECTURE_DIAGRAM.md)
- **Full Summary**: [ERROR_RESOLUTION_SUMMARY.md](ERROR_RESOLUTION_SUMMARY.md)
- **Index**: [DATABASE_ERROR_FIXES_INDEX.md](DATABASE_ERROR_FIXES_INDEX.md)

---

## ✅ Success Checklist

After fix, you should have:
- [ ] VIEW user_profiles exists
- [ ] Can query user_profiles without errors
- [ ] Can query properties without errors
- [ ] Dashboard loads successfully
- [ ] No "user_id" or "user_profiles" errors

---

## 🔑 Key Files

### ✅ USE THIS:
`/supabase/functions/server/database-setup-fixed.sql`

### ❌ DON'T USE:
`/supabase/functions/server/database-setup.sql`

---

## 💡 Remember

- **KV Store** = Where users are stored (flexible JSON)
- **VIEW** = Makes KV Store queryable (SQL compatibility)
- **RLS Policies** = Query the VIEW (security rules)
- **Properties** = Reference the VIEW (relationships)

**The VIEW is the bridge between KV Store and SQL!**

---

## 🚀 Next Steps

1. ✅ Fix database (you're here)
2. 📤 Deploy edge function → [DEPLOY_EDGE_FUNCTION.md](DEPLOY_EDGE_FUNCTION.md)
3. 🌐 Deploy to Vercel → [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)
4. 🎉 Go live!

---

**Time to fix:** 3 minutes  
**Difficulty:** Copy + Paste  
**Risk:** None (safe)  
**Status:** Production Ready ✅

---

**Last Updated:** October 30, 2025  
**Project:** Estal PropTech  
**Supabase ID:** ttsasgbrmswtjtenmksw
