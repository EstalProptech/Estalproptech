# 🚀 ESTAL Platform - Production Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

- [x] GitHub account with repository access
- [x] Vercel account (free tier works)
- [x] Supabase project created
- [x] Environment variables ready
- [x] Production build tested locally

---

## 🎯 Quick Deployment (5 Minutes)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Select "ESTAL" repository
   - Click "Import"

3. **Configure Environment Variables**
   Add these in Vercel dashboard:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_DB_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Done! Your app is live

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to configure environment variables
```

---

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | Public anonymous key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (keep secret!) | Supabase Dashboard → Settings → API |
| `SUPABASE_DB_URL` | PostgreSQL connection string | Supabase Dashboard → Settings → Database |

### Setting Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `SUPABASE_URL`
   - **Value**: Your Supabase URL
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. Repeat for all variables

---

## 📦 Build Configuration

### vercel.json

Already configured in the project:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Build Optimizations

- ✅ Code splitting enabled
- ✅ Tree shaking for smaller bundles
- ✅ Production minification
- ✅ Source maps for debugging
- ✅ Asset compression (gzip, brotli)

---

## 🗄️ Database Setup

### 1. Create KV Store Table

Run this SQL in Supabase SQL Editor:

```sql
-- Create KV Store table
CREATE TABLE IF NOT EXISTS kv_store_96250128 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE kv_store_96250128 ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (allow all)
CREATE POLICY "Service role can do anything"
  ON kv_store_96250128
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_kv_store_key 
  ON kv_store_96250128(key);

-- Create index for prefix queries
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
  ON kv_store_96250128(key text_pattern_ops);
```

### 2. Deploy Edge Functions

Your Supabase edge functions in `/supabase/functions/server/` will auto-deploy when you push to GitHub (if CI/CD is configured) or deploy manually:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy make-server-96250128
```

---

## 🔒 Security Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Service role key is NOT exposed to frontend
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS configured properly
- [ ] Rate limiting on auth endpoints
- [ ] Row Level Security enabled on database
- [ ] Demo credentials documented for testers
- [ ] Error tracking configured (Sentry/LogRocket)

---

## 🧪 Pre-Deployment Testing

### Local Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Open http://localhost:4173
```

### Test Checklist

- [ ] All pages load without errors
- [ ] Authentication works (demo + real accounts)
- [ ] Role-based access control functions
- [ ] API calls succeed
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance acceptable (Lighthouse > 80)

---

## 🚦 Deployment Workflow

### GitHub Actions (CI/CD)

If you set up GitHub Actions (see `/workflows/deploy.yml`):

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Setup:**
1. Get Vercel token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Add GitHub secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Push to `main` branch → auto-deploy!

---

## 📊 Post-Deployment Validation

### 1. Verify Deployment

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]
```

### 2. Test Live Application

Visit your deployment URL and test:

- [ ] Homepage loads
- [ ] Login with demo account works
- [ ] Dashboard renders correctly
- [ ] API calls to Supabase succeed
- [ ] No console errors
- [ ] Mobile view works

### 3. Monitor Performance

- **Vercel Analytics**: Auto-enabled, view in dashboard
- **Supabase Logs**: Check for database errors
- **Browser DevTools**: Network tab, console, Lighthouse

---

## 🔄 Rollback Procedure

If deployment fails:

1. **Via Vercel Dashboard**:
   - Go to Deployments tab
   - Find previous working deployment
   - Click "Promote to Production"

2. **Via CLI**:
   ```bash
   vercel rollback [deployment-url]
   ```

3. **Via Git**:
   ```bash
   git revert HEAD
   git push origin main
   # Vercel will auto-deploy previous version
   ```

---

## 🆘 Troubleshooting

### Build Fails

**Error**: TypeScript errors during build

**Solution**:
```bash
npm run build
# Fix any TypeScript errors shown
# Commit and redeploy
```

---

### Environment Variables Not Working

**Error**: `Cannot read property 'X' of undefined`

**Solution**:
1. Verify all env vars are set in Vercel
2. Redeploy after adding variables
3. Check spelling and formatting

---

### Supabase Connection Fails

**Error**: `Failed to fetch` or `Network error`

**Solution**:
1. Verify Supabase URL is correct
2. Check Supabase project is not paused
3. Verify API keys are valid
4. Check CORS settings in Supabase

---

### 404 on Routes

**Error**: Refresh causes 404 on `/properties`

**Solution**: Already configured in `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

If still failing, verify `vercel.json` is committed to repo.

---

## 📈 Performance Optimization

### Vercel Edge Network

- ✅ Auto-enabled global CDN
- ✅ Edge caching for static assets
- ✅ Gzip/Brotli compression
- ✅ HTTP/2 and HTTP/3 support

### Further Optimizations

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Look for large dependencies to optimize
```

**Target Metrics:**
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Total Bundle Size: < 500KB
- Lighthouse Score: > 90

---

## 🌍 Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel project → Settings → Domains
2. Enter your domain: `estal.app`
3. Add DNS records (Vercel provides instructions)
4. Wait for DNS propagation (5-30 minutes)
5. SSL certificate auto-provisioned

### DNS Configuration

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📞 Support

**Deployment Issues?**

1. Check Vercel deployment logs
2. Review [Vercel Docs](https://vercel.com/docs)
3. Check [Supabase Docs](https://supabase.com/docs)
4. Submit GitHub issue with error details

**Need Help?**
- Vercel Support: help@vercel.com
- Supabase Support: support@supabase.com

---

## 🎉 Success Checklist

- [ ] Application deployed and accessible
- [ ] All pages load correctly
- [ ] Authentication working
- [ ] Database connected
- [ ] Environment variables configured
- [ ] No critical console errors
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Domain configured (if applicable)
- [ ] Monitoring enabled

---

**Congratulations! Your ESTAL platform is now live! 🚀**

---

**Last Updated**: October 26, 2025
**Next Steps**: [Post-Deployment Validation](./POST_DEPLOYMENT_CHECKLIST.md)
