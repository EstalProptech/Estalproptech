# 🏗️ Estal Database Architecture: Understanding User Profiles

## 📊 Visual Explanation of the "user_id" Error

---

## ❌ PROBLEM: What Was Happening

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                         │
├─────────────────────────────────────────────────────────────┤
│  User registers → Saved to KV Store (kv_store_96250128)   │
│  Key: "user_profile:123e4567-..."                          │
│  Value: {"id": "123...", "name": "Ali", "role": "admin"}   │
└─────────────────────────────────────────────────────────────┘
                            ⬇
                            
┌─────────────────────────────────────────────────────────────┐
│                  POSTGRES DATABASE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐        ┌──────────────┐                  │
│  │ properties   │        │ user_profiles│                   │
│  │              │   ╱─→  │   ❌ MISSING!│                   │
│  │ id           │  ╱     │              │                   │
│  │ name         │ ╱      └──────────────┘                   │
│  │ owner_id ────╱                                           │
│  │              │   ← "Column user_id does not exist!"     │
│  └──────────────┘                                           │
│                                                              │
│  RLS Policies try to query user_profiles → ❌ ERROR!        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Why this fails:**
- ✅ Users ARE stored (in KV store)
- ❌ `user_profiles` table DOESN'T exist in Postgres
- ❌ Properties table references non-existent table
- ❌ RLS policies can't query user data
- ❌ Everything breaks! 💥

---

## ✅ SOLUTION: How We Fix It

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                         │
├─────────────────────────────────────────────────────────────┤
│  User registers → Saved to KV Store (kv_store_96250128)   │
│  Key: "user_profile:123e4567-..."                          │
│  Value: {"id": "123...", "name": "Ali", "role": "admin"}   │
└─────────────────────────────────────────────────────────────┘
                            ⬇
                            
┌─────────────────────────────────────────────────────────────┐
│                  POSTGRES DATABASE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │ kv_store_96250128 (table)                     │         │
│  │ ┌────────────────────────┬─────────────────┐  │         │
│  │ │ key                    │ value           │  │         │
│  │ ├────────────────────────┼─────────────────┤  │         │
│  │ │ user_profile:123...   │ {"id":"123"...} │  │         │
│  │ │ user_profile:456...   │ {"id":"456"...} │  │         │
│  │ └────────────────────────┴─────────────────┘  │         │
│  └────────────────────────────────────────────────┘         │
│                       ⬇                                     │
│            ┌─────────────────────┐                          │
│            │ user_profiles (VIEW)│ ← ✅ We create this!     │
│            │ ┌────┬──────┬──────┐│                          │
│            │ │ id │ name │ role ││                          │
│            │ ├────┼──────┼──────┤│                          │
│            │ │123 │ Ali  │admin││                          │
│            │ │456 │Sara │owner││                          │
│            │ └────┴──────┴──────┘│                          │
│            └─────────────────────┘                          │
│                       ⬆                                     │
│  ┌──────────────┐     │                                     │
│  │ properties   │     │                                     │
│  │              │     │                                     │
│  │ id           │     │                                     │
│  │ name         │     │                                     │
│  │ owner_id ────┼─────┘  ✅ Can query user_profiles!       │
│  │              │                                           │
│  └──────────────┘                                           │
│                                                              │
│  RLS Policies query user_profiles VIEW → ✅ WORKS!          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Why this works:**
- ✅ View makes KV store queryable as SQL table
- ✅ Properties can reference owner_id
- ✅ RLS policies can check user roles
- ✅ Dashboard KPIs can aggregate data
- ✅ Everything works! 🎉

---

## 🔍 Deep Dive: What is a VIEW?

### Traditional Table (What you might expect)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT
);

-- Data stored physically in this table
INSERT INTO user_profiles VALUES 
  ('123...', 'Ali', 'ali@example.com', 'admin');
```

### VIEW (What we actually use)
```sql
CREATE VIEW user_profiles AS
SELECT 
  (value->>'id')::uuid as id,
  value->>'name' as name,
  value->>'email' as email,
  value->>'role' as role
FROM kv_store_96250128
WHERE key LIKE 'user_profile:%';

-- No data stored here!
-- It's a "live query" that runs every time you SELECT
-- Data comes from kv_store_96250128
```

### Comparison

| Feature | Table | View |
|---------|-------|------|
| **Stores data** | ✅ Yes, physically | ❌ No, virtual |
| **Can SELECT** | ✅ Yes | ✅ Yes |
| **Can INSERT** | ✅ Yes | ❌ No (mostly) |
| **Performance** | ⚡ Fast | ⚡ Fast (if indexed) |
| **Storage** | Uses disk space | No extra space |
| **Updates** | Manual | Auto-reflects source |

---

## 🎯 Data Flow: Registration to Query

### 1️⃣ User Registers
```
Frontend                     Backend                    Database
   │                           │                           │
   │─── POST /register ───────→│                           │
   │                           │                           │
   │                           │─── Save to KV store ─────→│
   │                           │    Key: user_profile:123  │
   │                           │    Value: {user data}     │
   │                           │                           │
   │←─── Success ──────────────│←─── Saved ───────────────│
```

### 2️⃣ App Queries User Info
```
Frontend                     Backend                    Database
   │                           │                           │
   │─── GET /properties ──────→│                           │
   │                           │                           │
   │                           │─── SELECT * FROM properties
   │                           │     WHERE owner_id = ?    │
   │                           │                           │
   │                           │     (RLS policy checks)   │
   │                           │     SELECT role FROM      │
   │                           │     user_profiles ────────→│
   │                           │                           │
   │                           │     (VIEW queries KV)     │
   │                           │←─── Ali, admin ───────────│
   │                           │                           │
   │←─── Properties ───────────│←─── [property data] ──────│
```

### 3️⃣ Behind the Scenes: How VIEW Works
```sql
-- User queries:
SELECT * FROM user_profiles WHERE id = '123...';

-- Postgres actually executes:
SELECT 
  (value->>'id')::uuid as id,
  value->>'name' as name,
  value->>'email' as email,
  value->>'role' as role
FROM kv_store_96250128
WHERE key LIKE 'user_profile:%'
  AND (value->>'id')::uuid = '123...';

-- Result:
┌──────┬──────┬──────────────────┬───────┐
│  id  │ name │      email       │ role  │
├──────┼──────┼──────────────────┼───────┤
│ 123  │ Ali  │ ali@example.com  │ admin │
└──────┴──────┴──────────────────┴───────┘
```

---

## 🔧 Architecture Decisions: Why KV Store?

### ❓ Why not use a regular `user_profiles` table?

**Original Design Decision:**
```
✅ Pros of KV Store:
• Fast reads/writes
• Schema flexibility (JSON)
• Easy to add new fields
• Integrated with Supabase Auth
• Built-in caching
• No migrations needed

❌ Cons of Regular Table:
• Rigid schema
• Requires migrations for changes
• More complex setup
• Duplicate auth data
```

### 🤔 Why add a VIEW then?

**Best of Both Worlds:**
```
KV Store (source)     +     VIEW (interface)
      ↓                            ↓
Fast, flexible              SQL queries work
JSON storage                RLS policies work
Easy updates                Joins work
                            Dashboard KPIs work
```

---

## 📋 Complete Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────┐             │
│  │ Dashboard  │  │ Properties   │  │ User Mgmt   │             │
│  └────────────┘  └──────────────┘  └─────────────┘             │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓ Supabase Client
┌──────────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  EDGE FUNCTIONS                         │   │
│  │  /make-server/register → Saves to KV store             │   │
│  │  /make-server/users → Reads from user_profiles VIEW    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         │                                       │
│                         ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  POSTGRES DATABASE                      │   │
│  │                                                         │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │ kv_store_96250128 (Physical Table)            │    │   │
│  │  │  • Stores user profiles as JSON               │    │   │
│  │  │  • Key: "user_profile:{uuid}"                 │    │   │
│  │  │  • Value: {"id", "name", "email", "role"...}  │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  │                         ↓                               │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │ user_profiles (VIEW)                          │    │   │
│  │  │  • Virtual table over KV store                │    │   │
│  │  │  • Columns: id, name, email, role, status...  │    │   │
│  │  │  • No physical storage                        │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  │            ↓              ↓              ↓              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │ properties   │  │ maintenance_ │  │ financial_   │ │   │
│  │  │              │  │ requests     │  │ reports      │ │   │
│  │  │ owner_id ────┤  │              │  │              │ │   │
│  │  │  (references │  │              │  │              │ │   │
│  │  │   user_      │  │              │  │              │ │   │
│  │  │   profiles.  │  │              │  │              │ │   │
│  │  │   id)        │  │              │  │              │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  │                                                         │   │
│  │  All tables have RLS policies that query user_profiles │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  AUTHENTICATION                         │   │
│  │  • Supabase Auth manages login/logout                  │   │
│  │  • auth.uid() provides current user ID                 │   │
│  │  • RLS policies use auth.uid() for access control      │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎓 Understanding RLS with VIEWs

### Example: Admin checking properties

```sql
-- Policy:
CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- When admin queries properties:
SELECT * FROM properties;

-- Postgres executes:
1. Get current user ID: auth.uid() → '123...'

2. Check policy - Query the VIEW:
   SELECT 1 FROM user_profiles
   WHERE id = '123...' AND role = 'admin'
   
3. VIEW expands to:
   SELECT 1 FROM (
     SELECT (value->>'id')::uuid as id,
            value->>'role' as role
     FROM kv_store_96250128
     WHERE key LIKE 'user_profile:%'
   ) AS user_profiles
   WHERE id = '123...' AND role = 'admin'
   
4. If match found → Allow query
   If no match → Deny query

-- Result: Only admins see properties!
```

---

## 💡 Key Takeaways

1. **Users stored in KV store** (kv_store_96250128 table)
2. **VIEW makes them queryable** (user_profiles view)
3. **Other tables reference the view** (properties.owner_id)
4. **RLS policies query the view** (role checks)
5. **Everything works seamlessly** ✨

---

## 🔗 Related Documentation

- **Fix Guide**: [DATABASE_FIX_USER_ID_ERROR.md](DATABASE_FIX_USER_ID_ERROR.md)
- **Quick Fix**: [FIX_USER_ID_ERROR_NOW.md](FIX_USER_ID_ERROR_NOW.md)
- **SQL Comparison**: [SQL_FILE_COMPARISON.md](SQL_FILE_COMPARISON.md)
- **KV Store Guide**: [docs/KV_STORE_OPTIMIZATION_GUIDE.md](docs/KV_STORE_OPTIMIZATION_GUIDE.md)

---

**Last Updated:** October 30, 2025  
**Architecture:** Supabase + KV Store + PostgreSQL VIEWs  
**Pattern:** Virtual Tables for Flexible Data Storage
