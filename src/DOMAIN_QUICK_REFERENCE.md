# 📋 Quick Reference Card
## Domain Setup - estalproptech.com

**Print this page and keep it handy during setup!**

---

## 🎯 CHOOSE YOUR METHOD

### ⭐ METHOD 1: NAMESERVERS (RECOMMENDED)

**Vercel Nameservers:**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Where to Add:** Domain Registrar → Nameservers/DNS Settings

**Time:** 1-24 hours for propagation

---

### 🔧 METHOD 2: A + CNAME RECORDS

**A Record:**
```
Type:  A
Name:  @
Value: 76.76.21.21
```

**CNAME Record:**
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
```

**Time:** 1-6 hours for propagation

---

## ✅ SETUP STEPS

### 1️⃣ Vercel Dashboard
- [ ] Login to vercel.com
- [ ] Select: estal-proptech project
- [ ] Go to: Settings → Domains
- [ ] Add: estalproptech.com
- [ ] Add: www.estalproptech.com

### 2️⃣ Domain Registrar
- [ ] Login to your registrar
- [ ] Find: DNS Settings
- [ ] Apply: Method 1 OR Method 2 (above)
- [ ] Save changes

### 3️⃣ Supabase Dashboard
- [ ] Login to supabase.com
- [ ] Go to: Authentication → URL Configuration
- [ ] Add: https://estalproptech.com/*
- [ ] Add: https://www.estalproptech.com/*
- [ ] Save

### 4️⃣ Wait & Verify
- [ ] Wait: 1-24 hours (DNS propagation)
- [ ] Check: whatsmydns.net
- [ ] Verify: SSL certificate issued (Vercel)
- [ ] Test: https://estalproptech.com

---

## 🧪 TEST ACCOUNTS

**Admin:**
```
Email: admin@estal.com
Pass:  admin123
```

**Accountant:**
```
Email: accountant@estal.com
Pass:  accountant123
```

**Owner:**
```
Email: owner@estal.com
Pass:  owner123
```

---

## 🔍 VERIFICATION COMMANDS

**Check DNS:**
```bash
nslookup estalproptech.com
```

**Expected:** `76.76.21.21`

**Check WWW:**
```bash
nslookup www.estalproptech.com
```

**Expected:** Points to `cname.vercel-dns.com`

---

## 🌐 USEFUL TOOLS

**DNS Checker:**
- https://www.whatsmydns.net/

**SSL Checker:**
- https://www.ssllabs.com/ssltest/

**PageSpeed:**
- https://pagespeed.web.dev/

---

## ⏱️ TIMELINE

| Task | Time |
|------|------|
| Add domain in Vercel | 2 min |
| Configure DNS | 5 min |
| DNS propagation | 1-24 hrs |
| SSL certificate | 5 min |
| Update Supabase | 3 min |
| Testing | 20 min |
| **TOTAL** | **~1-24 hrs** |

---

## 🆘 QUICK TROUBLESHOOTING

**DNS not working?**
- Wait 24 hours
- Check records are exact
- No typos in values
- Check whatsmydns.net

**No SSL certificate?**
- Wait for DNS to propagate
- Remove & re-add domain
- Wait 10 minutes
- Contact Vercel support

**Site not loading?**
- Clear browser cache
- Try incognito mode
- Different device/network
- Check Vercel deployment

**Login not working?**
- Check Supabase URLs added
- Verify environment variables
- Check browser console
- Test with demo accounts

---

## 📞 SUPPORT

**Vercel:** support@vercel.com  
**Supabase:** support@supabase.com  
**Docs:** `/docs/CUSTOM_DOMAIN_SETUP.md`

---

## ✅ SUCCESS CHECKLIST

- [ ] DNS shows "Valid" in Vercel
- [ ] SSL certificate issued
- [ ] Site loads via HTTPS
- [ ] Padlock icon showing
- [ ] Login works
- [ ] Mobile responsive
- [ ] No console errors

---

**When all checked → YOU'RE LIVE! 🎉**

---

*Keep this page accessible during setup*  
*Full guide: /docs/CUSTOM_DOMAIN_SETUP.md*
