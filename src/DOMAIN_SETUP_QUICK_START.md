# 🚀 Quick Start: Custom Domain Setup
## Connect estalproptech.com to Vercel in 5 Minutes

---

## ⚡ Fast Track Setup (Recommended)

### Step 1: Add Domain in Vercel (2 min)
1. Go to [vercel.com](https://vercel.com) → Your Project
2. **Settings** → **Domains** → **Add**
3. Enter: `estalproptech.com`
4. Also add: `www.estalproptech.com`

### Step 2: Update DNS (3 min)
Go to your domain registrar and update nameservers to:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Step 3: Wait & Verify (1-24 hours)
- DNS propagation: 1-24 hours
- SSL certificate: Auto-issued
- Check: https://estalproptech.com

**Done! ✅**

---

## 📋 Alternative: Using A Records

**If you can't change nameservers:**

### Add these DNS records at your registrar:

**Record 1 - Root Domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Record 2 - www Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## ✅ Post-Setup Checklist

After DNS propagates:

1. **Update Supabase URLs**
   - Supabase Dashboard → Authentication → URL Configuration
   - Add: `https://estalproptech.com/*`
   - Add: `https://www.estalproptech.com/*`

2. **Test Everything**
   - [ ] Visit https://estalproptech.com
   - [ ] HTTPS working (padlock icon)
   - [ ] Login/Registration works
   - [ ] Demo accounts work
   - [ ] Mobile responsive

3. **Go Live!** 🎉

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Domain not working | Wait 1-24hrs for DNS propagation |
| No SSL certificate | Wait 5 mins after DNS propagation |
| "Invalid Configuration" | Double-check DNS records |
| 404 errors | Verify vercel.json rewrites are correct |

**Need detailed help?** See `/docs/CUSTOM_DOMAIN_SETUP.md`

---

## 📞 Support

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **DNS Checker**: [whatsmydns.net](https://www.whatsmydns.net/)
- **Full Guide**: [/docs/CUSTOM_DOMAIN_SETUP.md](/docs/CUSTOM_DOMAIN_SETUP.md)

---

**Ready to launch?** Start with Step 1! 🚀
