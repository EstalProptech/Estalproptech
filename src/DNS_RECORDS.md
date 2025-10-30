# DNS Records Configuration
## For estalproptech.com

This document contains the exact DNS records you need to configure your domain.

---

## 🎯 Recommended Method: Vercel Nameservers

**Fastest and easiest setup with automatic SSL**

### Nameservers to Use:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### How to Apply:
1. Go to your domain registrar's control panel
2. Find "Nameservers" or "DNS Management"
3. Select "Custom Nameservers" or "Use custom name servers"
4. Replace existing nameservers with the two above
5. Save changes
6. Wait 1-24 hours for propagation

### Popular Registrar Instructions:

**GoDaddy:**
- My Products → Domain → Manage DNS → Nameservers → Change → Custom

**Namecheap:**
- Domain List → Manage → Nameservers → Custom DNS

**Google Domains:**
- My domains → DNS → Name servers → Use custom name servers

**Cloudflare:**
- Not applicable - Cloudflare acts as nameserver itself
- Use A Record method below instead

---

## 🔧 Alternative Method: A + CNAME Records

**Use this if you cannot change nameservers (e.g., using Cloudflare)**

### Record 1: Root Domain (estalproptech.com)

```
Type:     A
Name:     @
Value:    76.76.21.21
TTL:      3600 (or Auto)
Priority: N/A
```

**Copy-Paste Values:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

---

### Record 2: WWW Subdomain (www.estalproptech.com)

```
Type:     CNAME
Name:     www
Value:    cname.vercel-dns.com
TTL:      3600 (or Auto)
Priority: N/A
```

**Copy-Paste Values:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

---

## 📋 Complete DNS Configuration Table

| Type | Name/Host | Value/Points To | TTL | Priority |
|------|-----------|-----------------|-----|----------|
| A | @ | 76.76.21.21 | 3600 | - |
| CNAME | www | cname.vercel-dns.com | 3600 | - |

---

## ✅ Verification Commands

After configuring DNS, use these commands to verify:

### Check Root Domain:
```bash
nslookup estalproptech.com
```

**Expected Result:**
```
Server:  [your DNS server]
Address: [IP address]

Non-authoritative answer:
Name:    estalproptech.com
Address: 76.76.21.21
```

---

### Check WWW Subdomain:
```bash
nslookup www.estalproptech.com
```

**Expected Result:**
```
Server:  [your DNS server]
Address: [IP address]

Non-authoritative answer:
www.estalproptech.com canonical name = cname.vercel-dns.com
Name:    cname.vercel-dns.com
Address: 76.76.21.21
```

---

### Check Nameservers (if using Vercel nameservers):
```bash
nslookup -type=NS estalproptech.com
```

**Expected Result:**
```
estalproptech.com nameserver = ns1.vercel-dns.com
estalproptech.com nameserver = ns2.vercel-dns.com
```

---

## 🌍 DNS Propagation Checker

Use these tools to check if DNS has propagated globally:

1. **WhatIsMyDNS**: https://www.whatsmydns.net/
   - Enter: `estalproptech.com`
   - Select: `A` record type
   - Look for: `76.76.21.21` appearing globally

2. **DNS Checker**: https://dnschecker.org/
   - Enter: `estalproptech.com`
   - Select: `A` record
   - Wait for green checkmarks worldwide

3. **Google DNS**: https://dns.google/
   - Search: `estalproptech.com`
   - Verify record appears

---

## ⚠️ Important Notes

### Before Making Changes:

1. **Backup Current DNS Records**
   - Take screenshots of current DNS settings
   - Export DNS records if possible
   - Note down all existing records

2. **Check Email Configuration**
   - If you have email (MX records) on this domain, DO NOT DELETE them
   - MX, TXT, and SPF records should remain unchanged
   - Only modify A and CNAME records for web hosting

3. **Subdomain Considerations**
   - These instructions are for `estalproptech.com` and `www.estalproptech.com` only
   - Other subdomains (like `mail.`, `blog.`, etc.) require separate configuration
   - Do not delete existing subdomain records unless you're sure they're unused

### TTL (Time To Live) Explanation:

- **3600 seconds** = 1 hour cache time
- Lower TTL = Faster propagation but more DNS queries
- Higher TTL = Slower propagation but fewer DNS queries
- **Recommended**: 3600 during setup, can increase to 86400 (24 hrs) after stable

---

## 🔒 DNSSEC Considerations

If your domain has DNSSEC enabled:

### Using Vercel Nameservers:
- ✅ Safe to use - Vercel handles DNSSEC automatically
- No action needed on your part

### Using A/CNAME Records:
- ⚠️ May need to disable DNSSEC temporarily during setup
- Re-enable after DNS propagation is complete
- Consult your registrar's documentation

---

## 🚫 Records to AVOID

Do NOT create these records (unless you know what you're doing):

❌ **Don't create**: A record for `www` (use CNAME instead)  
❌ **Don't create**: Multiple A records for @ (unless load balancing)  
❌ **Don't create**: CNAME for @ (CNAME can't be used for root domain)  
❌ **Don't delete**: Existing MX records (unless you don't use email)  
❌ **Don't delete**: Existing TXT records (may be for verification/SPF)  

---

## 📧 Email Records (If Applicable)

**If you have email on this domain**, you may also have these records.  
**DO NOT DELETE THEM:**

### Typical Email Records:

```
Type: MX
Name: @
Value: mail.youremailprovider.com
Priority: 10
TTL: 3600
```

```
Type: TXT
Name: @
Value: "v=spf1 include:_spf.youremailprovider.com ~all"
TTL: 3600
```

**Note**: These are examples. Your actual email records may differ.  
**Keep them unchanged** when adding Vercel DNS records.

---

## 🎯 Quick Setup Summary

### Method 1: Nameservers (Recommended)
1. Change nameservers to: `ns1.vercel-dns.com` and `ns2.vercel-dns.com`
2. Wait 1-24 hours
3. Done!

### Method 2: A/CNAME Records
1. Add A record: `@ → 76.76.21.21`
2. Add CNAME record: `www → cname.vercel-dns.com`
3. Wait 1-6 hours
4. Done!

---

## ✅ Post-Configuration Checklist

After adding DNS records:

- [ ] Records saved in registrar
- [ ] No typos in values
- [ ] TTL set to 3600
- [ ] Email records (MX/TXT) preserved
- [ ] Waited at least 1 hour
- [ ] Checked DNS propagation
- [ ] Verified in Vercel dashboard
- [ ] SSL certificate issued
- [ ] Site accessible via HTTPS

---

## 🆘 Troubleshooting DNS

### Problem: DNS not propagating after 24 hours

**Check:**
1. Verify records are exactly as shown above (no extra spaces)
2. Ensure TTL isn't set too high (should be 3600 or less)
3. Check you saved the changes in registrar
4. Confirm no conflicting records exist
5. Try flushing local DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Problem: "Invalid Configuration" in Vercel

**Solution:**
1. Double-check record values match exactly
2. Remove old/conflicting A records
3. If using nameservers, don't also add A/CNAME records
4. Wait 15 minutes and refresh Vercel dashboard
5. Try removing domain from Vercel and re-adding

### Problem: SSL certificate not issuing

**Solution:**
1. Ensure DNS is fully propagated (check whatsmydns.net)
2. Wait 10 minutes after DNS propagation
3. Check no CAA records blocking Let's Encrypt
4. Verify domain ownership in Vercel
5. Contact Vercel support if still failing after 1 hour

---

## 📞 Get Help

**Vercel Support**: support@vercel.com  
**DNS Issues**: Check your registrar's support documentation  
**General Questions**: See `/docs/CUSTOM_DOMAIN_SETUP.md`

---

**Ready to configure DNS?** Choose your method above and follow the steps!

---

*Last Updated: October 28, 2025*  
*Domain: estalproptech.com*  
*Platform: Vercel*  
*SSL: Auto-provisioned by Vercel*
