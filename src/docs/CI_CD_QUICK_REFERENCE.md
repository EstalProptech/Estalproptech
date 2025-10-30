# CI/CD Quick Reference

## 🚀 Quick Commands

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes, then commit
git add .
git commit -m "feat: your feature description"

# 3. Push to remote
git push origin feature/your-feature

# 4. Create PR to staging on GitHub
# Tests run automatically

# 5. After PR approval, merge to staging
# Staging deployment happens automatically

# 6. Test on staging, then merge to main
git checkout main
git merge staging
git push origin main

# Production deployment happens automatically! ✅
```

---

## 📝 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Build/tooling

### Examples
```bash
git commit -m "feat(dashboard): add revenue chart"
git commit -m "fix(auth): resolve login timeout"
git commit -m "docs(api): update endpoint docs"
```

---

## 🔄 Deployment Process

### Automatic Deployments

| Branch | Environment | Trigger | URL |
|--------|-------------|---------|-----|
| `staging` | Staging | Push | Vercel preview URL |
| `main` | Production | Push | https://estal.vercel.app |

### Manual Deployment

```bash
# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

---

## ↩️ Rollback

### GitHub Actions (Recommended)

1. Go to: `GitHub → Actions → Rollback Deployment`
2. Click `Run workflow`
3. Select environment
4. Enter reason
5. Click `Run workflow`

### Manual Rollback

```bash
# Get previous commit
PREV=$(git log --oneline -2 | tail -n 1 | awk '{print $1}')

# Checkout and deploy
git checkout $PREV
vercel --prod

# Tag rollback
git tag rollback-$(date +%Y%m%d-%H%M%S)
git push --tags
```

---

## ✅ Pre-Push Checklist

Before pushing to main:

- [ ] All tests passing locally (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Tested on staging
- [ ] PR reviewed and approved
- [ ] No breaking changes (or documented)

---

## 🧪 Local Testing

```bash
# Run all checks (like CI)
npm run lint && npm run type-check && npm test && npm run build

# Watch tests
npm run test:watch

# Check coverage
npm run test:coverage

# Fix lint errors
npm run lint:fix

# Format code
npm run format
```

---

## 📊 Monitoring

### Check Deployment Status

**GitHub Actions:**
```
GitHub → Actions → CI/CD Pipeline
```

**Vercel Dashboard:**
```
https://vercel.com/dashboard
```

**Deployment History:**
```
GitHub → Actions → Deployments
```

### View Logs

**GitHub Actions Logs:**
```
GitHub → Actions → [Workflow Run] → [Job] → Logs
```

**Vercel Logs:**
```
Vercel Dashboard → Project → Deployments → [Deployment] → Logs
```

**Application Logs:**
```
Vercel Dashboard → Project → Logs
```

---

## 🐛 Troubleshooting

### Build Failed

```bash
# Check what failed
# GitHub → Actions → [Failed Run] → Logs

# Run locally
npm run build

# Common issues:
# - TypeScript errors: npm run type-check
# - Lint errors: npm run lint
# - Test failures: npm test
# - Missing dependencies: npm install
```

### Tests Failed

```bash
# Run tests locally
npm test

# Run specific test
npm test -- auth.test.tsx

# Debug test
npm run test:watch

# Fix and commit
git add .
git commit -m "fix: resolve test failures"
git push
```

### Deployment Timeout

```bash
# Check build size
npm run build
du -sh dist/

# If too large:
# - Remove unused dependencies
# - Optimize images
# - Code splitting
```

---

## 🔑 Environment Variables

### Required for Build

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

### Set in Vercel

```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

### Set Locally

```bash
# .env.local
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## 📦 Release Process

### Create Release

```bash
# Tag version
git tag -a v1.2.3 -m "Release 1.2.3"
git push origin v1.2.3

# GitHub Actions will:
# - Generate changelog
# - Create GitHub release
# - Build artifacts
# - Send notifications
```

### Version Numbering

- **Major** (v2.0.0): Breaking changes
- **Minor** (v1.2.0): New features
- **Patch** (v1.1.1): Bug fixes

---

## 🚨 Emergency Procedures

### Critical Bug in Production

```bash
# Option 1: Quick rollback
# GitHub → Actions → Rollback Deployment → Run

# Option 2: Hotfix
git checkout -b hotfix/critical-bug
# Fix the bug
git commit -m "fix: critical bug"
git push origin hotfix/critical-bug
# Create PR to main
# Emergency merge and deploy
```

### Database Issues

```bash
# Restore from backup
# Download from GitHub Actions artifacts
# Or from Supabase dashboard

# Restore
psql $SUPABASE_DB_URL < backup.sql

# Verify
psql $SUPABASE_DB_URL -c "SELECT COUNT(*) FROM kv_store_96250128;"
```

### Service Down

1. Check Vercel status: https://vercel-status.com
2. Check Supabase status: https://status.supabase.com
3. Check GitHub status: https://githubstatus.com
4. If all OK, check application logs
5. Consider rollback if recent deployment

---

## 📞 Getting Help

| Issue | Contact |
|-------|---------|
| CI/CD questions | #devops Slack |
| Build failures | #engineering Slack |
| Deployment issues | devops@estal.com |
| Emergency | @devops-oncall |

---

## 📚 Documentation Links

- [Full CI/CD Guide](/docs/CI_CD_DEPLOYMENT_GUIDE.md)
- [Setup Instructions](/docs/CI_CD_SETUP_INSTRUCTIONS.md)
- [Priority 9 Complete](/docs/PRIORITY_9_CI_CD_COMPLETE.md)
- [Troubleshooting](/docs/TROUBLESHOOTING.md)

---

## ⚡ Common Tasks

### Add New Environment Variable

```bash
# 1. Add to GitHub Secrets
# GitHub → Settings → Secrets → New secret

# 2. Add to Vercel
vercel env add VARIABLE_NAME production
vercel env add VARIABLE_NAME preview

# 3. Use in code
const value = import.meta.env.VITE_VARIABLE_NAME;
```

### Update Dependencies

```bash
# Update all
npm update

# Update specific package
npm update package-name

# Check for outdated
npm outdated

# Security audit
npm audit
npm audit fix
```

### View Deployment History

```bash
# Via GitHub
# GitHub → Actions → Deployments

# Via API
curl https://api.estal.com/make-server-96250128/deployments \
  -H "Authorization: Bearer $TOKEN"

# Via Vercel
vercel ls
```

---

## 💡 Tips & Best Practices

✅ **Commit often** - Small, focused commits  
✅ **Test locally** - Before pushing  
✅ **Use staging** - Always test there first  
✅ **Write tests** - For new features  
✅ **Document changes** - Clear commit messages  
✅ **Review PRs** - Catch issues early  
✅ **Monitor deployments** - Watch for errors  
✅ **Clean branches** - Delete after merge  

❌ **Don't push to main** - Use PRs  
❌ **Don't skip tests** - They catch bugs  
❌ **Don't deploy without testing** - Use staging  
❌ **Don't commit secrets** - Use env vars  
❌ **Don't bypass checks** - They're there for a reason  

---

## 🎯 Performance Targets

| Metric | Target |
|--------|--------|
| Build time | < 5 minutes |
| Test time | < 3 minutes |
| Deploy time | < 10 minutes |
| Rollback time | < 5 minutes |

---

## 📈 Metrics to Monitor

- Deployment frequency
- Build success rate
- Test pass rate
- Rollback frequency
- Build duration
- Deploy duration

---

**Last Updated:** October 26, 2025  
**Version:** 1.0  
**Maintained By:** DevOps Team

---

*Keep this handy! Bookmark this page for quick reference.* 🚀
