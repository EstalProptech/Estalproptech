# CI/CD Deployment Guide - Estal Platform

## Overview

This guide covers the complete CI/CD pipeline for the Estal PropTech platform, including automated testing, deployment, rollback procedures, and monitoring.

---

## Table of Contents

1. [Pipeline Overview](#pipeline-overview)
2. [GitHub Actions Workflows](#github-actions-workflows)
3. [Environment Setup](#environment-setup)
4. [Deployment Process](#deployment-process)
5. [Rollback Procedures](#rollback-procedures)
6. [Release Management](#release-management)
7. [Monitoring & Alerts](#monitoring--alerts)
8. [Troubleshooting](#troubleshooting)

---

## Pipeline Overview

### Architecture

```
Developer Push → GitHub → CI/CD Pipeline → Deployment → Monitoring
                    ↓
                 [Tests, Lint, Type Check]
                    ↓
              [Security Scan]
                    ↓
             [Database Backup]
                    ↓
         [Deploy to Environment]
                    ↓
            [Health Checks]
                    ↓
           [Notifications]
```

### Environments

- **Development**: Local development environment
- **Staging**: Pre-production testing environment (staging branch)
- **Production**: Live production environment (main branch)

### Key Features

✅ **Zero Manual Deployments** - Push to trigger deployment  
✅ **Automated Testing** - All tests run before deployment  
✅ **Security Scanning** - Vulnerability checks on every build  
✅ **Database Backups** - Automatic backups before production deployments  
✅ **One-Click Rollback** - Instant rollback capability  
✅ **Deployment Notifications** - Slack/Email alerts  
✅ **Performance Monitoring** - Post-deployment health checks  

---

## GitHub Actions Workflows

### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main`, `staging`, or `develop` branches
- Pull requests to `main` or `staging`
- Manual workflow dispatch

**Jobs:**

#### Quality Checks
- Checkout code
- Install dependencies
- Run ESLint
- Run TypeScript type checking
- Run tests with coverage
- Build project
- Upload artifacts

#### Security Scan
- Run `npm audit`
- Run Snyk security scan (if configured)

#### Database Backup (Production Only)
- Backup Supabase database
- Upload backup to artifacts
- Record metadata

#### Deploy to Staging
- Build for staging environment
- Deploy to Vercel (preview)
- Run smoke tests
- Comment on PR with preview URL

#### Deploy to Production
- Build for production
- Deploy to Vercel (production)
- Run health checks
- Record deployment
- Create release tag

#### Notifications
- Send email notifications
- Send Slack notifications

#### Post-Deployment Monitoring
- Monitor error rates (5 minutes)
- Check performance metrics

### 2. Rollback Workflow (`.github/workflows/rollback.yml`)

**Trigger:** Manual workflow dispatch

**Inputs:**
- `environment`: production or staging
- `target_version`: Git SHA or tag (optional, defaults to previous)
- `reason`: Reason for rollback (required)

**Jobs:**

#### Validate
- Get current deployment version
- Determine target version
- Validate target exists
- Compare versions

#### Backup
- Backup current database state
- Upload pre-rollback backup

#### Rollback
- Checkout target version
- Run tests on target
- Build and deploy
- Health check

#### Verify
- Verify correct version deployed
- Monitor error rates

#### Notify
- Send notifications
- Create incident issue if failed

### 3. Release Management (`.github/workflows/release.yml`)

**Triggers:**
- Push to tags matching `v*`
- Manual workflow dispatch

**Jobs:**

#### Changelog
- Generate changelog from commits
- List contributors
- Create comparison link

#### Release
- Create GitHub release
- Build release artifacts
- Upload assets (tar.gz, zip)

#### Update Documentation
- Update CHANGELOG.md
- Update package.json version
- Commit and push

#### Notify
- Send release notifications

---

## Environment Setup

### Required Secrets

Configure these secrets in GitHub repository settings:

#### Vercel
```bash
VERCEL_TOKEN              # Vercel API token
VERCEL_ORG_ID             # Vercel organization ID
VERCEL_PROJECT_ID         # Vercel project ID
```

#### Supabase
```bash
SUPABASE_PROJECT_ID       # Supabase project ID
SUPABASE_DB_URL           # Production database URL
SUPABASE_DB_URL_STAGING   # Staging database URL
VITE_SUPABASE_URL         # Production Supabase URL
VITE_SUPABASE_URL_STAGING # Staging Supabase URL
VITE_SUPABASE_ANON_KEY    # Production anon key
VITE_SUPABASE_ANON_KEY_STAGING # Staging anon key
SUPABASE_SERVICE_ROLE_KEY # Service role key for API calls
```

#### Notifications
```bash
EMAIL_USERNAME            # SMTP username
EMAIL_PASSWORD            # SMTP password
NOTIFICATION_EMAIL        # Email to receive notifications
SLACK_WEBHOOK_URL         # Slack webhook for notifications
```

#### Security (Optional)
```bash
SNYK_TOKEN               # Snyk security scanning token
```

### Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Husky (Git Hooks)**
   ```bash
   npm run prepare
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

---

## Deployment Process

### Automatic Deployments

#### Deploy to Staging

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to Staging Branch**
   ```bash
   git checkout staging
   git merge feature/my-feature
   git push origin staging
   ```

4. **Automatic Process**
   - CI/CD runs all checks
   - Deploys to staging environment
   - Runs smoke tests
   - Comments preview URL on PR

#### Deploy to Production

1. **Merge to Main**
   ```bash
   git checkout main
   git merge staging
   git push origin main
   ```

2. **Automatic Process**
   - Runs all quality checks
   - Backs up database
   - Deploys to production
   - Runs health checks
   - Creates release tag
   - Sends notifications
   - Monitors for 5 minutes

### Manual Deployments

#### Deploy Specific Branch
```bash
# Navigate to GitHub Actions
# Select "CI/CD Pipeline" workflow
# Click "Run workflow"
# Select branch
# Click "Run workflow"
```

### Pre-Deployment Checklist

Before pushing to production:

- [ ] All tests passing locally
- [ ] No linting errors
- [ ] TypeScript compiles without errors
- [ ] Tested on staging environment
- [ ] Database migrations tested (if any)
- [ ] Environment variables configured
- [ ] Breaking changes documented
- [ ] Rollback plan prepared

---

## Rollback Procedures

### Quick Rollback (One-Click)

1. **Navigate to GitHub Actions**
   ```
   GitHub → Actions → Rollback Deployment
   ```

2. **Click "Run workflow"**

3. **Fill in Parameters**
   - **Environment**: Select `production` or `staging`
   - **Target Version**: Leave empty for previous version, or enter specific SHA/tag
   - **Reason**: Describe why you're rolling back

4. **Click "Run workflow"**

5. **Monitor Progress**
   - Watch workflow progress
   - Verify health checks
   - Confirm deployment

### Manual Rollback

If GitHub Actions is unavailable:

```bash
# 1. Get previous deployment SHA
PREV_SHA=$(git log --oneline -2 | tail -n 1 | awk '{print $1}')

# 2. Checkout previous version
git checkout $PREV_SHA

# 3. Deploy via Vercel CLI
npm install -g vercel
vercel deploy --prod --token=$VERCEL_TOKEN

# 4. Verify deployment
curl -f https://estal.vercel.app

# 5. Tag rollback
git tag -a rollback-$(date +%Y%m%d-%H%M%S) -m "Emergency rollback"
git push --tags
```

### Database Rollback

If database changes need to be reverted:

```bash
# 1. List available backups
supabase db dump --list

# 2. Download specific backup
# (Backups are in GitHub Actions artifacts)

# 3. Restore backup
supabase db reset --db-url=$SUPABASE_DB_URL
psql $SUPABASE_DB_URL < backup.sql

# 4. Verify restoration
psql $SUPABASE_DB_URL -c "SELECT COUNT(*) FROM kv_store_96250128;"
```

### Rollback Verification

After rollback:

- [ ] Correct version is deployed
- [ ] Application loads successfully
- [ ] Critical features working
- [ ] Error rate is normal (< 5%)
- [ ] Database integrity verified
- [ ] Users notified (if necessary)

---

## Release Management

### Creating a Release

#### Automatic Release (Recommended)

1. **Tag a Version**
   ```bash
   git tag -a v1.2.3 -m "Release version 1.2.3"
   git push origin v1.2.3
   ```

2. **Automatic Process**
   - Generates changelog
   - Creates GitHub release
   - Builds artifacts
   - Uploads assets
   - Sends notifications

#### Manual Release

1. **Navigate to GitHub Actions**
   ```
   GitHub → Actions → Release Management
   ```

2. **Click "Run workflow"**

3. **Fill in Parameters**
   - **Version**: e.g., `v1.2.3`
   - **Release Type**: `major`, `minor`, or `patch`

4. **Click "Run workflow"**

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Major** (v2.0.0): Breaking changes
- **Minor** (v1.2.0): New features, backwards compatible
- **Patch** (v1.1.1): Bug fixes, backwards compatible

### Changelog

Changelog is automatically generated from commit messages.

**Commit Message Format:**
```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `chore`: Build/tooling changes

**Examples:**
```bash
git commit -m "feat(dashboard): add revenue chart"
git commit -m "fix(auth): resolve login timeout issue"
git commit -m "docs(api): update endpoint documentation"
```

---

## Monitoring & Alerts

### Deployment Notifications

#### Email Notifications

**Sent to:** `NOTIFICATION_EMAIL` secret

**Triggers:**
- Production deployment success/failure
- Rollback success/failure
- New release published

**Content:**
- Deployment status
- Branch and commit info
- Author
- Workflow link

#### Slack Notifications

**Sent to:** Channel configured in `SLACK_WEBHOOK_URL`

**Triggers:**
- Production deployment
- Rollback
- New release

**Format:**
- Status emoji (✅/❌)
- Environment
- Version
- Quick actions (View Workflow, etc.)

### Post-Deployment Monitoring

#### Error Rate Monitoring

**Duration:** 5 minutes post-deployment

**Threshold:** 5% error rate

**Action:** Alert if exceeded

#### Performance Monitoring

**Metrics:**
- Response time
- Page load time
- API latency

**Threshold:** 3 seconds max response time

**Action:** Warning if exceeded

### Deployment History

View deployment history:

```bash
# Via API
curl https://api.estal.com/make-server-96250128/deployments \
  -H "Authorization: Bearer $TOKEN"

# Via GitHub
GitHub → Actions → Deployments
```

**Tracked Data:**
- Version (Git SHA)
- Environment
- Status
- Timestamp
- Deployed by
- Commit message

---

## Troubleshooting

### Common Issues

#### 1. Build Fails

**Error:** `Build failed: TypeScript errors`

**Solution:**
```bash
# Run type check locally
npm run type-check

# Fix errors
# Commit and push
```

#### 2. Tests Fail

**Error:** `Tests failed: 3 failing`

**Solution:**
```bash
# Run tests locally
npm run test

# Debug failing tests
npm run test:watch

# Fix and commit
```

#### 3. Deployment Timeout

**Error:** `Deployment timed out after 20 minutes`

**Solution:**
- Check Vercel dashboard for errors
- Verify build size (< 250MB)
- Check for infinite loops in build
- Contact Vercel support

#### 4. Database Backup Fails

**Error:** `Failed to backup database`

**Solution:**
```bash
# Check Supabase connection
psql $SUPABASE_DB_URL -c "SELECT 1"

# Verify credentials
echo $SUPABASE_DB_URL | grep -o "postgres://.*@.*:"

# Manual backup
supabase db dump --db-url=$SUPABASE_DB_URL > manual_backup.sql
```

#### 5. Health Check Fails

**Error:** `Health check failed: HTTP 500`

**Solution:**
- Check application logs in Vercel
- Verify environment variables
- Check Supabase status
- Roll back if critical

#### 6. High Error Rate Post-Deployment

**Error:** `Error rate: 15% (threshold: 5%)`

**Action:**
1. Initiate immediate rollback
2. Check error logs
3. Identify root cause
4. Fix and redeploy

### Debug Workflow

1. **Check Workflow Logs**
   ```
   GitHub → Actions → [Failed workflow] → Logs
   ```

2. **Run Locally**
   ```bash
   # Simulate CI environment
   npm ci
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

3. **Check Environment**
   ```bash
   # Verify secrets are set
   GitHub → Settings → Secrets and variables → Actions
   ```

4. **Test Deployment**
   ```bash
   # Deploy to staging first
   git push origin staging
   ```

### Getting Help

- **GitHub Issues**: Report CI/CD issues
- **Slack**: #engineering-help channel
- **Email**: devops@estal.com
- **Documentation**: `/docs` directory

---

## Best Practices

### Code Quality

✅ **Write Tests** - Maintain > 80% coverage  
✅ **Type Everything** - Use TypeScript strictly  
✅ **Lint Before Commit** - Fix all warnings  
✅ **Review PRs** - At least one approval  

### Deployment

✅ **Test on Staging** - Always test before production  
✅ **Small Changes** - Deploy frequently, in small batches  
✅ **Monitor Metrics** - Watch error rates post-deploy  
✅ **Document Changes** - Update changelog  

### Security

✅ **Scan Dependencies** - Run `npm audit` regularly  
✅ **Rotate Secrets** - Update tokens quarterly  
✅ **Review Permissions** - Limit access to production  
✅ **Backup Database** - Before every production deploy  

### Communication

✅ **Announce Deployments** - Notify team of production deploys  
✅ **Document Incidents** - Record all rollbacks  
✅ **Share Knowledge** - Update this guide  
✅ **Celebrate Successes** - Acknowledge good deployments  

---

## Metrics & KPIs

### Deployment Metrics

- **Deployment Frequency**: Target 5-10 per week
- **Lead Time**: Target < 1 hour (commit to production)
- **MTTR** (Mean Time To Recovery): Target < 15 minutes
- **Change Failure Rate**: Target < 15%

### Quality Metrics

- **Test Coverage**: Maintain > 80%
- **Build Success Rate**: Target > 95%
- **Linting Warnings**: Target 0
- **TypeScript Errors**: Target 0

### Performance Metrics

- **Build Time**: Target < 5 minutes
- **Deploy Time**: Target < 10 minutes
- **Rollback Time**: Target < 5 minutes

---

## Appendix

### Useful Commands

```bash
# Run all checks locally
npm run lint && npm run type-check && npm run test && npm run build

# Deploy to staging
git push origin staging

# Deploy to production
git push origin main

# Create release
git tag -a v1.2.3 -m "Release 1.2.3" && git push --tags

# Manual deployment
vercel deploy --prod --token=$VERCEL_TOKEN

# Backup database
npm run db:backup

# Check deployment status
curl https://api.vercel.com/v13/deployments \
  -H "Authorization: Bearer $VERCEL_TOKEN"
```

### Environment Variables Reference

| Variable | Environment | Description |
|----------|-------------|-------------|
| `VITE_SUPABASE_URL` | Production | Supabase project URL |
| `VITE_SUPABASE_URL_STAGING` | Staging | Staging Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Production | Supabase anonymous key |
| `SUPABASE_DB_URL` | Production | Database connection string |
| `VERCEL_TOKEN` | All | Vercel API token |
| `SLACK_WEBHOOK_URL` | All | Slack notifications webhook |

### Workflow Files Reference

- `.github/workflows/ci-cd.yml` - Main CI/CD pipeline
- `.github/workflows/rollback.yml` - Rollback workflow
- `.github/workflows/release.yml` - Release management
- `package.json` - Scripts and dependencies
- `.eslintrc.cjs` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `vitest.config.ts` - Test configuration

---

**Document Version:** 1.0  
**Last Updated:** October 26, 2025  
**Maintained By:** DevOps Team
