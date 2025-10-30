# CI/CD Setup Instructions

Quick start guide for setting up the CI/CD pipeline for the Estal platform.

---

## Prerequisites

- GitHub repository access
- Vercel account
- Supabase project
- SMTP account (for emails) or Slack webhook (for Slack)

---

## Step 1: Configure GitHub Secrets

Navigate to your GitHub repository:
```
Settings → Secrets and variables → Actions → New repository secret
```

### Required Secrets

Add the following secrets:

#### Vercel Configuration
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

**How to get these:**
1. Go to https://vercel.com/account/tokens
2. Create new token → Copy `VERCEL_TOKEN`
3. Go to your project settings
4. Copy `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from project settings

#### Supabase Configuration
```
SUPABASE_PROJECT_ID
SUPABASE_DB_URL
SUPABASE_DB_URL_STAGING
VITE_SUPABASE_URL
VITE_SUPABASE_URL_STAGING
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_ANON_KEY_STAGING
SUPABASE_SERVICE_ROLE_KEY
```

**How to get these:**
1. Go to https://app.supabase.com/project/YOUR_PROJECT/settings/api
2. Copy Project ID → `SUPABASE_PROJECT_ID`
3. Copy Project URL → `VITE_SUPABASE_URL`
4. Copy anon public key → `VITE_SUPABASE_ANON_KEY`
5. Copy service_role key → `SUPABASE_SERVICE_ROLE_KEY`
6. Get database URL from Settings → Database → Connection string (URI)
7. Repeat for staging project

#### Notification Configuration
```
EMAIL_USERNAME          # e.g., your-email@gmail.com
EMAIL_PASSWORD          # App password for Gmail
NOTIFICATION_EMAIL      # Where to send notifications
SLACK_WEBHOOK_URL       # (Optional) Slack webhook URL
```

**Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate app password
3. Use as `EMAIL_PASSWORD`

**Slack Webhook:**
1. Go to https://api.slack.com/messaging/webhooks
2. Create webhook for your channel
3. Copy webhook URL

#### Security (Optional)
```
SNYK_TOKEN             # From https://app.snyk.io/account
```

---

## Step 2: Create Staging Environment

### Option A: Separate Supabase Project (Recommended)

1. **Create New Supabase Project**
   - Go to https://app.supabase.com
   - Click "New project"
   - Name: "estal-staging"
   - Use same region as production

2. **Run Database Setup**
   ```bash
   psql YOUR_STAGING_DB_URL < supabase/functions/server/database-setup.sql
   ```

3. **Configure Environment Variables**
   - Add staging URLs to GitHub secrets
   - Update Vercel project with staging environment variables

### Option B: Same Project, Different Schema

1. **Create staging schema**
   ```sql
   CREATE SCHEMA staging;
   ```

2. **Duplicate tables in staging schema**
   ```bash
   # Copy setup script to use staging schema
   sed 's/public\./staging\./g' database-setup.sql > database-setup-staging.sql
   psql YOUR_DB_URL < database-setup-staging.sql
   ```

---

## Step 3: Configure Vercel

### Link Project to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Set production environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Set preview (staging) environment variables
vercel env add VITE_SUPABASE_URL_STAGING preview
vercel env add VITE_SUPABASE_ANON_KEY_STAGING preview
```

### Disable Auto Deployments (Important!)

We want GitHub Actions to control deployments:

1. Go to Vercel project settings
2. Git → Deployment Protection
3. **Uncheck** "Automatically deploy from Git"
4. Save changes

This prevents double deployments (Vercel auto + GitHub Actions).

---

## Step 4: Enable GitHub Actions

### Create Branch Protection Rules

```
Settings → Branches → Add rule
```

**For `main` branch:**
- ☑ Require status checks to pass before merging
- Select: `quality-checks`, `security-scan`
- ☑ Require branches to be up to date before merging
- ☑ Require linear history

**For `staging` branch:**
- ☑ Require status checks to pass before merging
- Select: `quality-checks`

### Enable Workflows

Workflows are located in `.github/workflows/`:
- ✅ `ci-cd.yml` - Main pipeline (auto-enabled)
- ✅ `rollback.yml` - Rollback workflow (manual)
- ✅ `release.yml` - Release management (auto on tags)

No additional setup needed - they activate on push.

---

## Step 5: Test the Pipeline

### Test Staging Deployment

1. **Create test branch**
   ```bash
   git checkout -b test/ci-cd-setup
   ```

2. **Make a small change**
   ```bash
   echo "# Test CI/CD" >> README.md
   git add README.md
   git commit -m "test: verify CI/CD pipeline"
   ```

3. **Push to staging**
   ```bash
   git push origin test/ci-cd-setup:staging
   ```

4. **Monitor GitHub Actions**
   - Go to Actions tab
   - Watch "CI/CD Pipeline" workflow
   - Verify all jobs pass
   - Check for preview URL in logs

5. **Verify deployment**
   - Click preview URL
   - Verify app loads
   - Check console for errors

### Test Production Deployment

⚠️ **Only after staging is verified!**

1. **Merge to main**
   ```bash
   git checkout main
   git merge staging
   git push origin main
   ```

2. **Monitor deployment**
   - Watch GitHub Actions
   - Verify database backup created
   - Check deployment succeeds
   - Verify notifications sent

3. **Verify production**
   - Visit https://estal.vercel.app
   - Run smoke tests
   - Check error monitoring

### Test Rollback

1. **Navigate to GitHub Actions**
2. **Click "Rollback Deployment"**
3. **Click "Run workflow"**
4. **Fill in:**
   - Environment: `staging`
   - Target version: (leave empty)
   - Reason: `Testing rollback procedure`
5. **Click "Run workflow"**
6. **Monitor progress**
7. **Verify rollback succeeded**

---

## Step 6: Configure Notifications

### Email Setup

Already configured via secrets, test by pushing to main.

### Slack Setup

1. **Add webhook to secrets**
   ```bash
   # In GitHub settings
   SLACK_WEBHOOK_URL = https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

2. **Test notification**
   ```bash
   # Push to main to trigger notification
   git push origin main
   ```

3. **Verify message appears in Slack**

---

## Step 7: Team Training

### For Developers

**Share this workflow:**

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to origin
git push origin feature/my-feature

# 4. Create PR to staging
# GitHub UI: Create Pull Request → base: staging

# 5. Wait for checks to pass
# GitHub will run tests automatically

# 6. Merge to staging
# Test on staging environment

# 7. Merge staging to main
git checkout main
git merge staging
git push origin main

# 8. Automatic production deployment!
```

### For DevOps

**Key responsibilities:**
- Monitor deployment success rate
- Investigate failed deployments
- Perform rollbacks when needed
- Update secrets when rotated
- Optimize pipeline performance

**Resources:**
- `/docs/CI_CD_DEPLOYMENT_GUIDE.md` - Complete guide
- `/docs/PRIORITY_9_CI_CD_COMPLETE.md` - Technical details
- GitHub Actions logs - Debugging
- Vercel dashboard - Deployment status

---

## Troubleshooting

### Issue: Deployment fails with "VERCEL_TOKEN not found"

**Solution:**
```bash
# Verify secret is set
# GitHub → Settings → Secrets → VERCEL_TOKEN should exist

# If missing, add it:
# Get token from https://vercel.com/account/tokens
```

### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Run locally
npm run type-check

# Fix errors
# Commit and push
```

### Issue: Database backup fails

**Solution:**
```bash
# Check DB URL format
echo $SUPABASE_DB_URL
# Should be: postgresql://postgres:[password]@[host]:5432/postgres

# Test connection
psql $SUPABASE_DB_URL -c "SELECT 1"

# If fails, regenerate database URL in Supabase settings
```

### Issue: Notifications not received

**Solution:**
```bash
# Check secrets are set:
# - EMAIL_USERNAME
# - EMAIL_PASSWORD  
# - NOTIFICATION_EMAIL
# - SLACK_WEBHOOK_URL (optional)

# Test email credentials
# Try sending test email with provided credentials

# Check spam folder
```

### Issue: Rollback not working

**Solution:**
```bash
# Verify workflow file exists
ls .github/workflows/rollback.yml

# Check permissions
# GitHub → Settings → Actions → General
# Workflow permissions: Read and write permissions

# Manual rollback if needed:
PREV_SHA=$(git log --oneline -2 | tail -n 1 | awk '{print $1}')
git checkout $PREV_SHA
vercel deploy --prod
```

---

## Maintenance

### Weekly

- [ ] Review deployment success rate
- [ ] Check for failed builds
- [ ] Monitor build times
- [ ] Review test coverage

### Monthly

- [ ] Rotate secrets (if policy requires)
- [ ] Review and optimize workflows
- [ ] Update dependencies
- [ ] Review rollback logs

### Quarterly

- [ ] Full security audit
- [ ] Update GitHub Actions versions
- [ ] Review and update documentation
- [ ] Team training refresh

---

## Security Best Practices

1. **Never commit secrets to git**
2. **Rotate tokens every 90 days**
3. **Use branch protection**
4. **Require PR reviews**
5. **Keep dependencies updated**
6. **Monitor security alerts**
7. **Regular backup verification**
8. **Limit production access**

---

## Success Checklist

After setup, verify:

- [ ] Push to staging triggers deployment
- [ ] Push to main triggers production deployment
- [ ] Database backups are created
- [ ] Tests run automatically
- [ ] Notifications are sent
- [ ] Rollback workflow is accessible
- [ ] Preview URLs are generated
- [ ] Health checks pass
- [ ] Error monitoring works
- [ ] Team can access workflows

---

## Getting Help

**Documentation:**
- `/docs/CI_CD_DEPLOYMENT_GUIDE.md` - Complete guide
- `/docs/TROUBLESHOOTING.md` - Common issues

**Support:**
- GitHub Issues - Bug reports
- Slack #devops - Quick questions
- Email devops@estal.com - Complex issues

**External:**
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**Setup Time:** ~2 hours  
**Difficulty:** Medium  
**Maintenance:** Low (< 1 hour/month)

Good luck! 🚀
