# 🔄 Documentation Update Script

## Automated Project ID Replacement

This document contains all the replacements needed for documentation files.

### Old Project ID: `ttsasgbrmswtjtenmksw`
### New Project ID: `uiawpsnhjpgkeepvagbs`

---

## Search and Replace Commands

If you have access to command line tools, you can use these commands to update all files at once:

### Unix/Linux/Mac:
```bash
# Update all markdown files in root directory
find . -maxdepth 1 -name "*.md" -type f -exec sed -i '' 's/ttsasgbrmswtjtenmksw/uiawpsnhjpgkeepvagbs/g' {} +

# Update all markdown files in docs directory
find ./docs -name "*.md" -type f -exec sed -i '' 's/ttsasgbrmswtjtenmksw/uiawpsnhjpgkeepvagbs/g' {} +
```

### Windows (PowerShell):
```powershell
# Update all markdown files
Get-ChildItem -Path . -Filter *.md -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace 'ttsasgbrmswtjtenmksw', 'uiawpsnhjpgkeepvagbs' | Set-Content $_.FullName
}
```

### VS Code Search and Replace:
1. Press `Ctrl+Shift+H` (or `Cmd+Shift+H` on Mac)
2. Search for: `ttsasgbrmswtjtenmksw`
3. Replace with: `uiawpsnhjpgkeepvagbs`
4. Files to include: `*.md`
5. Click "Replace All"

---

## Files That Need Manual Update

### Priority 1: User-Facing Documentation
1. `/START_HERE.md` - Main entry point
2. `/START_HERE_CONNECTION_COMPLETE.md` - Connection guide
3. `/START_HERE_CONNECTION_UPDATE.md` - Update guide
4. `/QUICK_DEPLOY.md` - Deployment quickstart
5. `/QUICK_START.md` - Getting started
6. `/QUICK_REFERENCE_CARD.md` - Quick reference
7. `/QUICK_ACTION_CHECKLIST.md` - Action items

### Priority 2: Deployment Documentation
8. `/DEPLOY_NOW_SIMPLE.md` - Simple deployment
9. `/DEPLOY_NOW_UPDATED.md` - Updated deployment
10. `/DEPLOY_COMMANDS.md` - Command reference
11. `/DEPLOY_DATABASE_NOW.md` - Database deployment
12. `/DEPLOY_EDGE_FUNCTION.md` - Function deployment
13. `/DEPLOYMENT_SUMMARY.md` - Summary
14. `/DEPLOYMENT_STATUS.md` - Status
15. `/DEPLOYMENT_FIXED.md` - Fixed deployment
16. `/DEPLOYMENT_READINESS_REPORT.md` - Readiness report
17. `/FINAL_DEPLOYMENT_CHECKLIST.md` - Final checklist

### Priority 3: Connection Documentation
18. `/CONNECTION_COMPLETE_SUMMARY.md` - Connection summary
19. `/CONNECTION_ARCHITECTURE.md` - Architecture
20. `/CONNECTION_UPDATE_SUMMARY_CARD.md` - Update card
21. `/CONNECTION_VERIFICATION_CHECKLIST.md` - Verification
22. `/SUPABASE_CONNECTION_CONFIG.md` - Config
23. `/SUPABASE_CONNECTION_DIAGRAM.md` - Diagram
24. `/SUPABASE_CONNECTION_INDEX.md` - Index
25: `/SUPABASE_CONNECTION_UPDATE_COMPLETE.md` - Update complete
26: `/SUPABASE_CONNECTION_VERIFIED.md` - Verified
27: `/SUPABASE_QUICK_CONNECT.md` - Quick connect
28: `/SUPABASE_SETUP_COMPLETE.md` - Setup complete
29: `/SUPABASE_UPDATE_COMPLETE_REPORT.md` - Update report

### Priority 4: Database Documentation
30: `/DATABASE_DEPLOYMENT_NOW.md` - Database deployment
31: `/DATABASE_CONNECTION_SETUP.md` - Connection setup
32: `/DATABASE_CONNECTION_COMPLETE.md` - Connection complete
33: `/DATABASE_CONNECTION_QUICK_REF.md` - Quick reference
34: `/DATABASE_ARCHITECTURE_DIAGRAM.md` - Architecture
35: `/DATABASE_ERROR_QUICK_REFERENCE.md` - Error reference
36: `/DATABASE_ERROR_FIX_COMPLETE.md` - Error fix complete
37: `/DATABASE_ERROR_FIXES_INDEX.md` - Fixes index
38: `/DATABASE_FIX_USER_ID_ERROR.md` - User ID error fix

### Priority 5: Error Fix Documentation
39: `/ERRORS_FIXED.md` - Fixed errors
40: `/ERROR_RESOLUTION_SUMMARY.md` - Resolution summary
41: `/MODULE_ERROR_FIX_SUMMARY.md` - Module errors
42: `/FIX_EDGE_FUNCTION_DEPLOYMENT.md` - Function deployment fix
43: `/FIX_LOGIN_ERROR.md` - Login error fix
44: `/FIX_SQL_PATH_ERROR.md` - SQL path fix
45: `/FIX_SUPABASE_MODULE_ERROR.md` - Module error fix
46: `/FIX_USER_ID_ERROR_NOW.md` - User ID fix
47: `/FIXES_SUMMARY.md` - Fixes summary
48: `/EDGE_FUNCTION_FIX.md` - Function fix
49: `/EDGE_FUNCTION_FIX_QUICK_CARD.md` - Fix card
50: `/EDGE_FUNCTION_ERROR_FIXED.md` - Error fixed
51: `/EDGE_FUNCTION_ERROR_COMPLETE_FIX.md` - Complete fix
52: `/EDGE_FUNCTION_DEPLOYMENT_QUICK_FIX.md` - Deployment fix
53: `/SQL_PATH_ERROR_QUICK_FIX.md` - SQL path fix
54: `/SUPABASE_MODULE_ERROR_QUICK_FIX.md` - Module fix

### Priority 6: Status and Summary Documentation
55: `/CURRENT_STATUS.md` - Current status
56: `/COMPLETED_ACTIONS.md` - Completed actions
57: `/NEW_DOCUMENTATION_SUMMARY.md` - Doc summary
58: `/LAUNCH_READY.md` - Launch ready
59: `/PRIORITY_2_COMPLETE.md` - Priority 2
60: `/PRIORITY_3_COMPLETE.md` - Priority 3
61: `/PRIORITY_4_COMPLETE.md` - Priority 4
62: `/PRIORITY_5_COMPLETE.md` - Priority 5

### Priority 7: Setup and Configuration
63: `/SETUP_RLS_ESTALPROPTECH_TABLE.md` - RLS setup
64: `/RLS_SETUP_SUMMARY.md` - RLS summary
65: `/RLS_QUICK_REFERENCE.md` - RLS reference
66: `/ENVIRONMENT_SETUP.md` - Environment
67: `/GIT_SETUP_GUIDE.md` - Git setup

### Priority 8: Domain and DNS
68: `/DOMAIN_CHECKLIST.md` - Domain checklist
69: `/DOMAIN_QUICK_REFERENCE.md` - Domain reference
70: `/DOMAIN_SETUP_QUICK_START.md` - Domain setup
71: `/DNS_RECORDS.md` - DNS records

### Priority 9: /docs/ Subdirectory
72: `/docs/DEPLOYMENT_GUIDE.md` - Deployment guide
73: `/docs/AUTHENTICATION_GUIDE.md` - Auth guide
74: `/docs/AUTHENTICATION_VALIDATION_REPORT.md` - Auth validation
75: `/docs/BACKEND_INTEGRATION_REPORT.md` - Backend report
76: `/docs/BETA_LAUNCH_GUIDE.md` - Beta launch
77: `/docs/CI_CD_DEPLOYMENT_GUIDE.md` - CI/CD deployment
78: `/docs/CI_CD_QUICK_REFERENCE.md` - CI/CD reference
79: `/docs/CI_CD_SETUP_INSTRUCTIONS.md` - CI/CD setup
80: `/docs/CUSTOM_DOMAIN_SETUP.md` - Custom domain
81: `/docs/EDGE_FUNCTION_DEPLOYMENT_FIX.md` - Edge function fix
82: `/docs/ERROR_FIXES_SUMMARY.md` - Error fixes
83: `/docs/ERROR_FIX_PROFILE_OPERATIONS.md` - Profile fixes
84: `/docs/ERROR_FIX_ROUND_2.md` - Fix round 2
85: `/docs/ERROR_FIX_ROUND_3_FINAL.md` - Fix round 3
86: `/docs/TROUBLESHOOTING.md` - Troubleshooting

---

## URL Patterns to Replace

### Dashboard URLs:
```
OLD: https://supabase.com/dashboard/project/ttsasgbrmswtjtenmksw
NEW: https://supabase.com/dashboard/project/uiawpsnhjpgkeepvagbs
```

### API URLs:
```
OLD: https://ttsasgbrmswtjtenmksw.supabase.co
NEW: https://uiawpsnhjpgkeepvagbs.supabase.co
```

### Database Hosts:
```
OLD: db.ttsasgbrmswtjtenmksw.supabase.co
NEW: db.uiawpsnhjpgkeepvagbs.supabase.co
```

### Specific Dashboard Pages:
- `/sql` → SQL Editor
- `/sql/new` → New SQL Query
- `/editor` → Table Editor
- `/auth/users` → Authentication Users
- `/functions` → Edge Functions
- `/settings/api` → API Settings
- `/settings/database` → Database Settings
- `/storage/buckets` → Storage Buckets

---

## Verification After Update

After replacing all occurrences, verify:

1. **Count check:**
   ```bash
   # Should return 0
   grep -r "ttsasgbrmswtjtenmksw" *.md | wc -l
   ```

2. **New ID check:**
   ```bash
   # Should return many matches
   grep -r "uiawpsnhjpgkeepvagbs" *.md | wc -l
   ```

3. **Config files check:**
   ```bash
   # Check core config files
   grep "projectId" utils/supabase/info.tsx
   grep "project_id" supabase/config.toml
   ```

---

## Notes

- **Core files already updated:** `/utils/supabase/info.tsx` and `/supabase/config.toml`
- **Code files don't need updates:** They use the `projectId` variable
- **Only documentation needs updates:** All `.md` files
- **Anon key still needs update:** Get from Supabase dashboard

---

**Total Files to Update:** ~86 markdown files  
**Automated Method:** Use search-and-replace (fastest)  
**Manual Method:** Edit each file individually (most time-consuming)  
**Recommended:** Use VS Code's "Replace in Files" feature

