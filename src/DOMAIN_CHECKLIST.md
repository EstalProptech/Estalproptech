# ✅ Domain Setup Checklist
## estalproptech.com → Vercel Connection

Use this checklist to track your progress connecting your custom domain.

---

## 🔧 Pre-Setup (Before You Start)

- [ ] Domain `estalproptech.com` is registered and active
- [ ] You have access to domain registrar's DNS settings
- [ ] You have access to Vercel account
- [ ] Vercel project is deployed and working
- [ ] You have Supabase dashboard access

---

## 📝 Setup Tasks

### Phase 1: Vercel Configuration (5 minutes)

- [ ] **1.1** Log into Vercel Dashboard
- [ ] **1.2** Select "estal-proptech" project
- [ ] **1.3** Go to Settings → Domains
- [ ] **1.4** Add domain: `estalproptech.com`
- [ ] **1.5** Add domain: `www.estalproptech.com`
- [ ] **1.6** Note the DNS records/nameservers shown by Vercel

### Phase 2: DNS Configuration (10 minutes)

**Choose ONE option:**

#### Option A: Nameservers (Recommended) ⭐
- [ ] **2A.1** Copy Vercel nameservers (ns1.vercel-dns.com, ns2.vercel-dns.com)
- [ ] **2A.2** Log into domain registrar
- [ ] **2A.3** Find DNS/Nameserver settings
- [ ] **2A.4** Replace existing nameservers with Vercel's
- [ ] **2A.5** Save changes
- [ ] **2A.6** Confirm changes were saved

#### Option B: A Records (Alternative)
- [ ] **2B.1** Log into domain registrar
- [ ] **2B.2** Go to DNS Records section
- [ ] **2B.3** Add A record: Type=A, Name=@, Value=76.76.21.21
- [ ] **2B.4** Add CNAME record: Type=CNAME, Name=www, Value=cname.vercel-dns.com
- [ ] **2B.5** Save all records
- [ ] **2B.6** Confirm records are active

### Phase 3: Verification (1-24 hours wait time)

- [ ] **3.1** Wait for DNS propagation to start (minimum 1 hour)
- [ ] **3.2** Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
- [ ] **3.3** Verify Vercel shows "Valid Configuration" status
- [ ] **3.4** Wait for SSL certificate to be issued (automatic)
- [ ] **3.5** Confirm "Certificate Issued" status in Vercel

### Phase 4: Testing (15 minutes)

- [ ] **4.1** Visit https://estalproptech.com in browser
- [ ] **4.2** Verify site loads correctly
- [ ] **4.3** Check for HTTPS (padlock icon in browser)
- [ ] **4.4** Visit https://www.estalproptech.com
- [ ] **4.5** Verify www redirects to non-www (or vice versa)
- [ ] **4.6** Test on mobile device
- [ ] **4.7** Test on different browsers (Chrome, Firefox, Safari)
- [ ] **4.8** Clear browser cache and test again

### Phase 5: Supabase Configuration (5 minutes)

- [ ] **5.1** Log into Supabase Dashboard
- [ ] **5.2** Go to Authentication → URL Configuration
- [ ] **5.3** Add redirect URL: `https://estalproptech.com/*`
- [ ] **5.4** Add redirect URL: `https://www.estalproptech.com/*`
- [ ] **5.5** Save Supabase settings
- [ ] **5.6** Wait 2-3 minutes for changes to propagate

### Phase 6: Application Testing (20 minutes)

- [ ] **6.1** Test user login with demo accounts:
  - [ ] admin@estal.com / admin123
  - [ ] accountant@estal.com / accountant123
  - [ ] owner@estal.com / owner123
- [ ] **6.2** Test user registration (create test account)
- [ ] **6.3** Test password reset flow (if implemented)
- [ ] **6.4** Test dashboard loads correctly for each role
- [ ] **6.5** Test properties page
- [ ] **6.6** Test maintenance page
- [ ] **6.7** Test financial reports
- [ ] **6.8** Test analytics page
- [ ] **6.9** Test settings page
- [ ] **6.10** Test mobile responsiveness
- [ ] **6.11** Check console for any errors

### Phase 7: Performance & Security (10 minutes)

- [ ] **7.1** Run Google PageSpeed Insights test
- [ ] **7.2** Check SSL certificate at [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)
- [ ] **7.3** Verify security headers are present (F12 → Network)
- [ ] **7.4** Test load time (should be < 3 seconds)
- [ ] **7.5** Verify all assets load via HTTPS
- [ ] **7.6** Check for mixed content warnings
- [ ] **7.7** Test with VPN/different locations (optional)

### Phase 8: Final Checks (10 minutes)

- [ ] **8.1** Update any marketing materials with new domain
- [ ] **8.2** Update social media links
- [ ] **8.3** Update email signatures
- [ ] **8.4** Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] **8.5** Configure Google Analytics (if applicable)
- [ ] **8.6** Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] **8.7** Create backup plan documentation
- [ ] **8.8** Document rollback procedure

---

## 🎯 Success Criteria

Your domain is successfully configured when ALL these are true:

✅ **DNS Status**: Vercel shows "Valid Configuration"  
✅ **SSL Status**: Certificate issued and working  
✅ **HTTPS**: Site loads with https:// and padlock icon  
✅ **Redirects**: www redirects properly  
✅ **Login**: Users can log in successfully  
✅ **Performance**: PageSpeed score > 80  
✅ **Security**: SSL Labs rating A or A+  
✅ **Mobile**: Responsive on all devices  
✅ **Errors**: No console errors  

---

## ⏱️ Estimated Timeline

| Phase | Duration | Can Work Simultaneously? |
|-------|----------|-------------------------|
| Pre-Setup | 10 min | - |
| Phase 1: Vercel | 5 min | ✅ Yes |
| Phase 2: DNS | 10 min | ✅ Yes |
| Phase 3: Wait | 1-24 hrs | ⏳ Must wait |
| Phase 4: Testing | 15 min | ✅ After Phase 3 |
| Phase 5: Supabase | 5 min | ✅ Can do during Phase 3 |
| Phase 6: App Testing | 20 min | ✅ After Phase 3 |
| Phase 7: Performance | 10 min | ✅ After Phase 3 |
| Phase 8: Final | 10 min | ✅ After everything |
| **Total Active Time** | **~1.5 hours** | - |
| **Total Elapsed Time** | **~1-24 hours** | (including DNS wait) |

---

## 🚨 Troubleshooting

If you encounter issues, check these common problems:

### DNS Not Propagating
- [ ] Verify DNS records are correct
- [ ] Check TTL settings (lower = faster propagation)
- [ ] Use [whatsmydns.net](https://whatsmydns.net) to monitor
- [ ] Wait full 24 hours before escalating

### SSL Certificate Issues
- [ ] Ensure DNS is fully propagated first
- [ ] Try removing and re-adding domain in Vercel
- [ ] Check for CAA DNS records blocking certificate
- [ ] Contact Vercel support if persists > 1 hour after DNS

### Site Not Loading
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Try incognito/private mode
- [ ] Test from different network/device
- [ ] Check Vercel deployment status

### Login/Auth Issues
- [ ] Verify Supabase redirect URLs include new domain
- [ ] Check browser console for CORS errors
- [ ] Ensure environment variables are set
- [ ] Test with demo accounts first

---

## 📊 Progress Tracker

**Started**: ________________ (Date/Time)  
**DNS Updated**: ________________ (Date/Time)  
**DNS Propagated**: ________________ (Date/Time)  
**SSL Issued**: ________________ (Date/Time)  
**Testing Complete**: ________________ (Date/Time)  
**Launched**: ________________ (Date/Time)  

**Total Time**: ________________

---

## 🎉 Post-Launch Tasks

After successful launch:

- [ ] Announce launch to beta users
- [ ] Monitor error rates in first 24 hours
- [ ] Check analytics for traffic patterns
- [ ] Gather user feedback
- [ ] Plan next iteration/improvements
- [ ] Set up regular backups
- [ ] Schedule maintenance windows
- [ ] Document lessons learned

---

## 📞 Support Contacts

**Vercel Support**: [vercel.com/support](https://vercel.com/support)  
**Supabase Support**: [supabase.com/support](https://supabase.com/support)  
**Domain Registrar**: ________________ (Your registrar support)  

---

## 📚 Reference Documents

- **Full Setup Guide**: `/docs/CUSTOM_DOMAIN_SETUP.md`
- **Quick Start**: `/DOMAIN_SETUP_QUICK_START.md`
- **Deployment Guide**: `/docs/DEPLOYMENT_GUIDE.md`
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md`

---

**Questions? Issues?** Check the full documentation or contact support!

**Ready to go?** Start with Phase 1! 🚀

---

*Last Updated: October 28, 2025*  
*Platform: Estal PropTech*  
*Domain: estalproptech.com*
