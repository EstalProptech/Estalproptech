# ⚡ Edge Function Fix - Quick Reference Card

## ❌ The Error
```
Module not found "securityMiddleware.tsx"
```

---

## ✅ The Fix (Choose One)

### Option 1: "server" Function (Project: uiawpsnhjpgkeepvagbs)
**File to deploy:** [server-edge-function-single-file.ts](server-edge-function-single-file.ts)

**Steps:**
1. Copy [server-edge-function-single-file.ts](server-edge-function-single-file.ts)
2. Go to: https://supabase.com/dashboard/project/uiawpsnhjpgkeepvagbs/functions
3. Create/Edit function named "server"
4. Paste code → Deploy
5. Test: `curl https://uiawpsnhjpgkeepvagbs.supabase.co/functions/v1/server/make-server-96250128/health`

---

### Option 2: "make-server" Function (Project: ttsasgbrmswtjtenmksw)
**File to deploy:** [edge-function-single-file.ts](edge-function-single-file.ts)

**Steps:**
1. Copy [edge-function-single-file.ts](edge-function-single-file.ts)
2. Go to: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw/functions
3. Create/Edit function named "make-server"
4. Paste code → Deploy
5. Test: `curl https://ttsasgbrmswtjtenmksw.supabase.co/functions/v1/make-server/health`

---

## 🎯 Which One Do I Use?

**Look at your error message:**

| Error Shows | Use File | Function Name |
|-------------|----------|---------------|
| `uiawpsnhjpgkeepvagbs` | server-edge-function-single-file.ts | server |
| `ttsasgbrmswtjtenmksw` | edge-function-single-file.ts | make-server |

---

## ✅ Success Checklist

- [ ] Copied correct file for your project
- [ ] Deployed to correct Supabase project
- [ ] Function shows "Active" status
- [ ] Health endpoint responds with JSON
- [ ] No errors in function logs

---

## 📚 Full Documentation

**Complete guide:** [EDGE_FUNCTION_ERROR_COMPLETE_FIX.md](EDGE_FUNCTION_ERROR_COMPLETE_FIX.md)

**Quick guides:**
- [EDGE_FUNCTION_DEPLOYMENT_QUICK_FIX.md](EDGE_FUNCTION_DEPLOYMENT_QUICK_FIX.md)
- [FIX_EDGE_FUNCTION_DEPLOYMENT.md](FIX_EDGE_FUNCTION_DEPLOYMENT.md)

---

**Time:** 2 minutes  
**Difficulty:** Easy  
**Status:** Ready! 🚀
