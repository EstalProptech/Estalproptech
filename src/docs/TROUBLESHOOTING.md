# 🔧 ESTAL Platform - Troubleshooting Guide

Quick solutions to common issues encountered when running or deploying the ESTAL platform.

---

## 🔐 Authentication Issues

### ❌ "Invalid login credentials"

**Symptom**: Cannot login with any credentials

**Causes & Solutions**:

1. **Using demo credentials incorrectly**
   ```
   ✅ Correct: admin@estal.com / admin123
   ❌ Wrong: admin@estal.com / Admin123 (case-sensitive)
   ```

2. **Account doesn't exist**
   - Use demo accounts for testing
   - Create new account via registration page
   - Verify Supabase database is accessible

3. **Whitespace in credentials**
   - Trim spaces from email/password
   - Copy-paste carefully

**Quick Fix**:
```typescript
// Try demo account first
Email: admin@estal.com
Password: admin123
```

---

### ❌ "Email not confirmed"

**Symptom**: Registration succeeded but login fails

**Solution**: System auto-confirms emails on next login attempt. Just try logging in again.

**Manual Fix** (if auto-confirm fails):
1. Go to Supabase Dashboard → Authentication → Users
2. Find user email
3. Click user → Confirm email manually

---

### ❌ Session expires immediately

**Symptom**: Logged out after page refresh

**Causes**:
- Cookies blocked by browser
- localStorage cleared
- Browser privacy mode

**Solutions**:
1. Enable cookies in browser settings
2. Disable ad blockers for localhost
3. Try different browser
4. Clear all site data and retry:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   // Then refresh page
   ```

---

## 🗄️ Database & Backend Issues

### ❌ "Failed to fetch" or "Network error"

**Symptom**: API calls fail, data doesn't load

**Causes & Solutions**:

1. **Supabase not configured**
   ```bash
   # Check if info.tsx exists
   cat utils/supabase/info.tsx
   
   # Should contain valid projectId and publicAnonKey
   ```

2. **Wrong environment variables**
   - Verify `SUPABASE_URL` matches your project
   - Check `SUPABASE_ANON_KEY` is correct
   - Service role key should be SECRET

3. **Supabase project paused**
   - Go to Supabase Dashboard
   - Check if project is active
   - Unpause if needed

4. **CORS issues**
   - Already configured in server
   - Check browser console for CORS errors
   - Verify Supabase allows your domain

**Quick Fix**:
```bash
# Restart dev server
npm run dev
```

---

### ❌ KV Store errors

**Symptom**: "Table doesn't exist" or "Permission denied"

**Solution**: Run database setup SQL

```sql
-- In Supabase SQL Editor
CREATE TABLE IF NOT EXISTS kv_store_96250128 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE kv_store_96250128 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do anything"
  ON kv_store_96250128
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

---

## 🚀 Deployment Issues

### ❌ Build fails on Vercel

**Symptom**: Deployment shows "Build failed"

**Common Causes**:

1. **TypeScript errors**
   ```bash
   # Test build locally first
   npm run build
   
   # Fix any TypeScript errors
   # Then commit and redeploy
   ```

2. **Missing dependencies**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Environment variables missing**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all required vars
   - Redeploy

---

### ❌ 404 errors on page refresh

**Symptom**: Direct URLs work, but refreshing shows 404

**Solution**: Already fixed in `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

If still broken:
1. Verify `vercel.json` exists in root
2. Verify it's committed to Git
3. Redeploy

---

### ❌ Environment variables not working in production

**Symptom**: App works locally but fails in production

**Solution**:
1. Verify vars are set in Vercel Dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables
4. Check Vercel deployment logs

---

## 🎨 UI & Display Issues

### ❌ Styles not loading / Page looks broken

**Symptoms**: No colors, broken layout, missing styles

**Causes**:
1. **CSS not loaded**
   - Check browser console for 404 on CSS files
   - Verify `styles/globals.css` exists
   - Check Tailwind config

2. **Build issue**
   ```bash
   # Rebuild
   npm run dev
   # Or
   npm run build && npm run preview
   ```

---

### ❌ Images not loading

**Symptom**: Broken image icons or placeholders

**Solutions**:

1. **Unsplash images blocked**
   - Check browser console for CORS errors
   - Verify internet connection
   - ImageWithFallback component handles this

2. **Figma imports missing**
   - Ensure `figma:asset` paths are correct
   - Check `/imports` directory exists

---

### ❌ Charts not rendering

**Symptom**: Empty spaces where charts should be

**Causes**:
1. **Data not loaded**
   - Check browser console for errors
   - Verify backend data is accessible

2. **Recharts issues**
   - Check if window is defined (SSR issue)
   - Verify chart component is wrapped properly

**Quick Fix**:
```typescript
// Wrap charts in client-side only render
{typeof window !== 'undefined' && <Chart />}
```

---

## 📱 Mobile & Responsive Issues

### ❌ Mobile navigation broken

**Symptom**: Hamburger menu doesn't work on mobile

**Solution**: Already implemented in `MobileNav.tsx`

Check:
1. Screen width is < 768px
2. JavaScript is enabled
3. No console errors blocking interactions

---

### ❌ Layout breaks on tablet

**Symptom**: Content overlaps or cuts off at specific widths

**Solution**: Test at these breakpoints:
- Mobile: 375px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

Report issues with specific screen width and page.

---

## ⚡ Performance Issues

### ❌ Slow page loads

**Symptoms**: Long loading times, sluggish interactions

**Solutions**:

1. **Check bundle size**
   ```bash
   npm run build
   # Check dist/ folder size
   # Should be < 2MB total
   ```

2. **Optimize images**
   - Use ImageWithFallback for lazy loading
   - Compress large images

3. **Enable caching**
   - Already configured for Vercel
   - Check browser cache settings

4. **Check network speed**
   - Test on fast connection
   - Verify API response times

---

### ❌ Memory leaks / Tab freezes

**Symptom**: Browser tab becomes unresponsive over time

**Causes**:
- Uncleaned event listeners
- Interval timers not cleared
- Large data sets in memory

**Solutions**:
1. Refresh page
2. Check browser console for warnings
3. Report issue with steps to reproduce

---

## 🔍 Debugging Tools

### Browser Console

**Chrome DevTools**:
```
Right-click → Inspect → Console
```

**Look for**:
- Red errors (critical)
- Yellow warnings (should fix)
- Network tab for failed requests
- Application tab for localStorage

### Vercel Logs

```bash
# Real-time logs
vercel logs [deployment-url] --follow

# Or in Vercel Dashboard
Project → Deployments → [Latest] → View Function Logs
```

### Supabase Logs

1. Go to Supabase Dashboard
2. Click "Logs" in sidebar
3. Filter by:
   - API logs
   - Database logs
   - Edge Function logs

---

## 🆘 Getting Help

### Before Asking for Help

1. **Check this guide** for common solutions
2. **Search browser console** for errors
3. **Test with demo credentials** first
4. **Try different browser** to isolate issue
5. **Clear cache and cookies** 

### How to Report Issues

Include:
- [ ] What you were trying to do
- [ ] What happened instead
- [ ] Error messages (copy-paste)
- [ ] Browser console screenshot
- [ ] Steps to reproduce
- [ ] Your environment (OS, browser, version)

### Where to Get Help

1. **Documentation**: Read relevant guides in `/docs`
2. **GitHub Issues**: Submit detailed bug report
3. **Supabase Docs**: https://supabase.com/docs
4. **Vercel Docs**: https://vercel.com/docs

---

## 🧰 Quick Fixes Toolkit

### Nuclear Option (Reset Everything)

```bash
# Clear all local data
localStorage.clear();
sessionStorage.clear();

# Clear npm cache
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install

# Restart dev server
npm run dev
```

### Test Authentication

```javascript
// In browser console
console.log('Demo login test');
// Then try: admin@estal.com / admin123
```

### Check Environment

```bash
# Node version (should be 18+)
node -v

# npm version (should be 9+)
npm -v

# Verify Supabase config
cat utils/supabase/info.tsx
```

---

## 📊 Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request payload format |
| 401 | Unauthorized | Login again / check credentials |
| 403 | Forbidden | Insufficient permissions (RBAC) |
| 404 | Not Found | Check route or resource exists |
| 500 | Server Error | Check Supabase logs, redeploy |
| CORS | Cross-Origin | Already configured, check network |

---

**Still stuck? Don't hesitate to ask for help! 💬**

---

**Last Updated**: October 26, 2025
**Report Documentation Issues**: GitHub Issues
