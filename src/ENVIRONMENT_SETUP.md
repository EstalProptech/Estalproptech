# 🔐 Environment Variables Setup Guide

Complete guide to configure environment variables for the Estal PropTech Platform.

---

## 📋 Quick Start (2 Minutes)

### Step 1: Get Your Supabase Keys

1. Go to [Supabase Dashboard → API Settings](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/api)

2. Copy these values:
   - **Project URL**: `https://ttsasgbrmswtjtenmksw.supabase.co`
   - **anon/public key**: Copy the long JWT token under "Project API keys" → "anon" → "public"
   - **service_role key**: Copy the token under "service_role" (keep this secret!)

### Step 2: Create Local Environment File

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your actual keys
# Replace 'your_anon_key_here' with your actual anon key
```

### Step 3: Update .env.local

```env
VITE_SUPABASE_URL=https://ttsasgbrmswtjtenmksw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2FzZ2JybXN3dGp0ZW5ta3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNjU5MjYsImV4cCI6MjA0NTY0MTkyNn0.aFqN_qRfRO9pnE5m6LCfLxNhMmN_BZn7sB7R3qX5tZA

# Optional: Only if testing edge functions locally
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 🔑 Understanding Supabase Keys

### Anon Key (Public Key)
- ✅ **Safe to use in**: Web apps, mobile apps, desktop apps
- ✅ **Purpose**: Client-side authentication and queries
- ✅ **Security**: Respects Row Level Security (RLS) policies
- ✅ **Exposure**: Can be publicly exposed (it's in your frontend code)

**Note**: The "anon key" IS the "publishable key" - Supabase uses the term "anon" but it serves the same purpose as other platforms' publishable keys.

### Service Role Key (Secret Key)
- ❌ **Never use in**: Frontend code, mobile apps, desktop apps
- ✅ **Use only in**: Backend servers, edge functions, CI/CD
- ⚠️ **Security**: Bypasses ALL Row Level Security (RLS) policies
- ❌ **Exposure**: Must be kept secret (server-side only)

---

## 📁 File Structure

Your project uses these environment files:

```
.env.example          # Template with placeholders (committed to Git)
.env.local.example    # Quick-start template (committed to Git)
.env.local            # Your actual keys (NEVER committed - in .gitignore)
```

---

## 🛠️ Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Create your local env file
cp .env.example .env.local

# Edit .env.local with your favorite editor
nano .env.local
# or
code .env.local
```

### 3. Start Development Server

```bash
npm run dev
```

Your app should now be running at: http://localhost:5173

---

## 🚀 Production Deployment (Vercel)

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or import from GitHub)
3. Go to **Settings → Environment Variables**
4. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://ttsasgbrmswtjtenmksw.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your anon key from Supabase | Production, Preview, Development |
| `NODE_ENV` | `production` | Production only |

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Enter: https://ttsasgbrmswtjtenmksw.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your anon key

# Deploy
vercel --prod
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Store sensitive keys in `.env.local` (never committed)
- Use anon key for all client-side code
- Set environment variables in Vercel Dashboard for production
- Keep service role key only in backend/edge functions
- Use `.env.example` as a template for team members

### ❌ DON'T:
- Commit `.env.local` to Git
- Use service role key in frontend code
- Hardcode API keys in your code
- Share service role key in Slack/Discord/etc.
- Expose service role key in client-side JavaScript

---

## 🧪 Testing Your Configuration

### Test 1: Verify Environment Variables Loaded

Add this to your browser console:
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
// Should show: https://ttsasgbrmswtjtenmksw.supabase.co
```

### Test 2: Test Supabase Connection

The app will show connection status in the browser console:
```
✅ Supabase client initialized: https://ttsasgbrmswtjtenmksw.supabase.co
💡 Demo accounts available: admin@estal.com, accountant@estal.com, owner@estal.com
```

### Test 3: Test Authentication

Try logging in with demo credentials:
- **Admin**: `admin@estal.com` / `DemoPass123!`
- **Accountant**: `accountant@estal.com` / `DemoPass123!`
- **Owner**: `owner@estal.com` / `DemoPass123!`

---

## 🗄️ Database Connection Strings

For direct database access (psql, database tools, etc.):

### Direct Connection (Port 5432)
```
postgresql://postgres:[YOUR_DB_PASSWORD]@db.ttsasgbrmswtjtenmksw.supabase.co:5432/postgres
```

### Connection Pooler (Port 6543 - Recommended for Serverless)
```
postgresql://postgres:[YOUR_DB_PASSWORD]@db.ttsasgbrmswtjtenmksw.supabase.co:6543/postgres
```

**Get your database password from:**
[Supabase Dashboard → Settings → Database](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/database)

---

## 🔧 Edge Function Configuration

Edge functions automatically have access to these environment variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

No additional configuration needed!

---

## 📱 Mobile & Desktop Apps

For mobile (React Native, Expo) or desktop (Electron) apps:

```javascript
// Use the same anon key - it's safe!
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ttsasgbrmswtjtenmksw.supabase.co',
  'your_anon_key_here'  // This is the "publishable key"
)
```

The anon key is designed to be publicly exposed in client applications.

---

## 🆘 Troubleshooting

### ❌ "Cannot connect to Supabase"
**Check:**
1. Is `.env.local` created?
2. Are the variables prefixed with `VITE_`?
3. Did you restart the dev server after creating `.env.local`?

**Solution:**
```bash
# Restart dev server
npm run dev
```

### ❌ "Invalid API key"
**Check:**
1. Did you copy the full JWT token (very long string)?
2. Are there any extra spaces or line breaks?
3. Is it the anon key, not service role key?

**Solution:**
Get fresh keys from [Supabase Dashboard → API](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/api)

### ❌ "Row Level Security Policy Violation"
**Check:**
1. Is your user authenticated?
2. Does the user have the correct role?
3. Are RLS policies set up in the database?

**Solution:**
Run the database setup SQL from `/SUPABASE_DATABASE_SETUP.md`

---

## ✅ Final Checklist

Before deploying to production:

- [ ] `.env.local` created with correct keys
- [ ] `.env.local` is in `.gitignore` (protected)
- [ ] App runs locally without errors
- [ ] Authentication works with demo accounts
- [ ] Environment variables set in Vercel Dashboard
- [ ] Database schema deployed to Supabase
- [ ] Edge function deployed successfully
- [ ] Production URL tested and working

---

## 📞 Get Your Keys

**Supabase Dashboard URLs:**
- [API Settings](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/api) - Get your keys here
- [Database Settings](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/settings/database) - Get database password
- [Edge Functions](https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/functions) - Deploy functions

---

<div align="center">

**🎯 Quick Setup Command:**

```bash
cp .env.example .env.local && nano .env.local
```

Then update with your keys from Supabase Dashboard!

</div>
