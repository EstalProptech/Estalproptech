# Custom Domain Setup Guide
## Connecting estalproptech.com to Vercel

This guide will walk you through connecting your custom domain `estalproptech.com` to your Estal PropTech platform deployed on Vercel.

---

## Prerequisites

✅ Domain registered: `estalproptech.com`  
✅ Access to domain DNS settings (via your domain registrar)  
✅ Vercel project deployed  
✅ Vercel account access  

---

## Step 1: Add Domain in Vercel Dashboard

### 1.1 Access Your Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Select your **estal-proptech** project

### 1.2 Add Custom Domain
1. Click on **Settings** tab
2. Navigate to **Domains** section
3. Click **Add** or **Add Domain**
4. Enter: `estalproptech.com`
5. Click **Add**

### 1.3 Add www Subdomain (Optional but Recommended)
1. Also add: `www.estalproptech.com`
2. Set it to redirect to `estalproptech.com`
3. This ensures users can access your site with or without "www"

---

## Step 2: Configure DNS Records

Vercel will show you which DNS records to add. You'll need to add these records in your domain registrar's DNS settings.

### Option A: Using Vercel Nameservers (Recommended - Easiest)

**Advantages:**
- Automatic SSL certificate
- Fastest setup
- Automatic configuration
- Best performance with Vercel's global CDN

**Steps:**
1. In Vercel, you'll see nameservers like:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
2. Go to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
3. Find **DNS Settings** or **Nameservers** section
4. Change nameservers from default to Vercel's nameservers
5. Save changes
6. Wait 24-48 hours for DNS propagation (usually faster, ~1-2 hours)

### Option B: Using A Records (Alternative Method)

**If you can't change nameservers**, use A records instead:

1. In your domain registrar's DNS settings, add these records:

**For Root Domain (estalproptech.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For www Subdomain (www.estalproptech.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

2. Save the DNS records
3. Wait 1-24 hours for DNS propagation

---

## Step 3: Verify Domain Configuration

### 3.1 Check Vercel Dashboard
1. Go back to your Vercel project → **Settings** → **Domains**
2. Wait for the domain status to show:
   - ✅ **Valid Configuration** (green checkmark)
   - Or a pending status that will update automatically

### 3.2 SSL Certificate
- Vercel automatically provisions an SSL certificate
- This usually takes 1-5 minutes after DNS propagation
- You'll see "Certificate Issued" status when ready

### 3.3 Test Your Domain
Once DNS has propagated:

1. Open browser and visit:
   - `https://estalproptech.com`
   - `https://www.estalproptech.com`

2. Both should load your Estal PropTech application

3. Verify HTTPS is working (look for padlock icon in browser)

---

## Step 4: Update Application Configuration (If Needed)

### 4.1 Check for Hardcoded URLs
The application should work automatically, but verify these areas if you have any issues:

1. **Supabase Configuration**
   - Add `estalproptech.com` to Supabase allowed redirect URLs
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add: `https://estalproptech.com/*`
   - Add: `https://www.estalproptech.com/*`

2. **CORS Settings**
   - Ensure Supabase allows requests from your domain
   - Add domain to Supabase API settings if needed

---

## DNS Propagation Time

| Method | Typical Time | Maximum Time |
|--------|--------------|--------------|
| Vercel Nameservers | 1-2 hours | 24-48 hours |
| A Records | 1-6 hours | 24 hours |
| CNAME Records | 1-2 hours | 24 hours |

**Tip:** Use [whatsmydns.net](https://www.whatsmydns.net/) to check DNS propagation globally.

---

## Common Domain Registrars - DNS Configuration Links

### Popular Registrars:

**GoDaddy:**
1. Go to GoDaddy Domain Manager
2. Select your domain → DNS → Manage Zones
3. Add/Edit DNS records

**Namecheap:**
1. Dashboard → Domain List → Manage
2. Advanced DNS tab
3. Add/Edit records

**Google Domains:**
1. My domains → Manage → DNS
2. Custom resource records section

**Cloudflare:**
1. Dashboard → Select domain
2. DNS tab
3. Add/Edit records

**Note:** If using Cloudflare, set proxy status to "DNS only" (gray cloud) for Vercel domains.

---

## Troubleshooting

### Issue: Domain not working after 24 hours

**Solution:**
1. Check DNS records are correct in registrar
2. Verify nameservers are pointing to Vercel
3. Clear browser cache and try incognito mode
4. Use `nslookup estalproptech.com` in terminal to check DNS

### Issue: SSL Certificate not issued

**Solution:**
1. Wait 5-10 minutes after DNS propagation
2. Check that DNS records are correct
3. In Vercel, try removing and re-adding the domain
4. Contact Vercel support if issue persists

### Issue: "Invalid Configuration" in Vercel

**Solution:**
1. Double-check DNS records match Vercel's requirements exactly
2. Remove any conflicting DNS records (old A records if using nameservers)
3. Wait for DNS propagation to complete
4. Refresh Vercel dashboard

### Issue: Mixed Content Warnings

**Solution:**
1. Ensure all assets load via HTTPS
2. Check for hardcoded HTTP URLs in code
3. Update any HTTP references to HTTPS or use protocol-relative URLs

---

## Production Checklist

Before going live with your custom domain:

- [ ] Domain DNS configured correctly
- [ ] SSL certificate issued and working
- [ ] Both `estalproptech.com` and `www.estalproptech.com` working
- [ ] Supabase redirect URLs updated
- [ ] Test login/registration flows
- [ ] Test all major features
- [ ] Mobile responsiveness verified
- [ ] Performance tested (Google PageSpeed Insights)
- [ ] Analytics configured (if applicable)
- [ ] Email confirmations working
- [ ] 404 pages configured
- [ ] Robots.txt and sitemap configured (if needed)

---

## Environment Variables

Your environment variables in Vercel should already be configured:

```env
VITE_SUPABASE_URL=@vite_supabase_url
VITE_SUPABASE_ANON_KEY=@vite_supabase_anon_key
```

These are already set in your `vercel.json` and should work with the custom domain automatically.

---

## Performance Optimization

Once your domain is live:

1. **Enable Vercel Analytics** (Optional)
   - Settings → Analytics → Enable
   - Monitor real user performance

2. **Configure Caching**
   - Already configured in `vercel.json`
   - Assets cached for 1 year
   - HTML revalidated on each request

3. **Enable Compression**
   - Automatically enabled by Vercel
   - Brotli/Gzip compression for all assets

---

## Security Headers

Your application already has security headers configured in `vercel.json`:

✅ **X-Frame-Options**: DENY (prevents clickjacking)  
✅ **X-Content-Type-Options**: nosniff (prevents MIME sniffing)  
✅ **Referrer-Policy**: strict-origin-when-cross-origin  
✅ **Permissions-Policy**: Restricted camera, microphone, geolocation  

---

## Support Resources

- **Vercel Docs**: [vercel.com/docs/custom-domains](https://vercel.com/docs/concepts/projects/custom-domains)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **DNS Checker**: [whatsmydns.net](https://www.whatsmydns.net/)
- **SSL Checker**: [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)

---

## Quick Reference Commands

### Check DNS Configuration
```bash
# Check A record
nslookup estalproptech.com

# Check nameservers
nslookup -type=NS estalproptech.com

# Check CNAME (for www)
nslookup www.estalproptech.com
```

### Test Domain Locally
```bash
# Test if domain resolves
ping estalproptech.com

# Test HTTPS
curl -I https://estalproptech.com
```

---

## Timeline Summary

| Step | Duration | Status |
|------|----------|--------|
| Add domain in Vercel | 2 minutes | Immediate |
| Configure DNS records | 5-10 minutes | Immediate |
| DNS propagation | 1-24 hours | Wait |
| SSL certificate issuance | 1-5 minutes | After DNS |
| **Total Time** | **~1-24 hours** | - |

---

## Next Steps After Domain is Live

1. ✅ **Announce the launch** to your beta users
2. ✅ **Update marketing materials** with new domain
3. ✅ **Monitor analytics** and user feedback
4. ✅ **Set up monitoring** (uptime monitoring, error tracking)
5. ✅ **Configure backups** (Supabase automatic backups)
6. ✅ **Plan scaling strategy** as user base grows

---

**Need Help?**

If you encounter any issues:
1. Check Vercel's real-time status page
2. Review DNS configuration in registrar
3. Contact Vercel support (they're very responsive)
4. Check the troubleshooting section above

---

*Last Updated: October 28, 2025*  
*Platform: Estal PropTech*  
*Domain: estalproptech.com*
