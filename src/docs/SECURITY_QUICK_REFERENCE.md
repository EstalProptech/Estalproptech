# Security Quick Reference Guide

## 🔒 Developer Security Checklist

Use this guide when developing new features for the Estal platform.

---

## Before Writing Code

- [ ] Review security requirements for the feature
- [ ] Identify sensitive data that will be handled
- [ ] Determine required permission level
- [ ] Plan input validation strategy

---

## Input Validation

### ✅ Always Validate

```typescript
import { validateRequestParams } from '../utils/securityUtils';

// Define validation schema
const schema = {
  email: { type: 'email', required: true },
  name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
  age: { type: 'number', min: 18, max: 120 },
};

// Validate
const { valid, errors } = validateRequestParams(data, schema);
if (!valid) {
  return { error: 'Validation failed', details: errors };
}
```

### ❌ Never Trust Client Input

```typescript
// BAD ❌
const userId = req.query.userId;
const user = await db.get(userId); // No validation!

// GOOD ✅
const userId = req.query.userId;
if (!validateUuid(userId)) {
  return { error: 'Invalid user ID' };
}
const user = await db.get(userId);
```

---

## Output Sanitization

### ✅ Sanitize Before Display

```typescript
import { sanitizeString, sanitizeHtml } from '../utils/securityUtils';

// For plain text
const safeName = sanitizeString(userInput);

// For HTML content (if absolutely necessary)
const safeHtml = sanitizeHtml(userInput);
```

### ✅ Use ImageWithFallback for Images

```typescript
// Always use the secure component
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback 
  src={userProvidedUrl} 
  alt="Description" 
/>
```

---

## Authentication & Authorization

### ✅ Protect Sensitive Endpoints

```typescript
// Server-side (required)
app.get(
  '/api/sensitive-data',
  requireAuth(), // Check if user is logged in
  requireRole(['admin']), // Check if user has permission
  async (c) => {
    // Your code here
  }
);
```

### ✅ Prevent IDOR

```typescript
// BAD ❌
const userId = req.params.userId;
const data = await getUserData(userId); // Anyone can access any user's data!

// GOOD ✅
const userId = req.params.userId;
const requestingUserId = c.get('userId');
const userRole = c.get('user')?.user_metadata?.role;

// Users can only access their own data, admins can access all
if (userId !== requestingUserId && userRole !== 'admin') {
  return c.json({ error: 'Access denied' }, 403);
}

const data = await getUserData(userId);
```

---

## Logging

### ✅ Sanitize Logs

```typescript
import { sanitizeForLogging } from '../utils/securityUtils';

// BAD ❌
console.log('User logged in:', { email: user.email, password: user.password });

// GOOD ✅
console.log('User logged in:', sanitizeForLogging({
  userId: user.id,
  email: user.email,
  // password automatically redacted
}));
```

### ✅ Log Security Events

```typescript
import { criticalEventLogger } from '../utils/criticalEventLogger';

// Login success
criticalEventLogger.logAuth.loginSuccess(userId, { email });

// Login failure
criticalEventLogger.logAuth.loginFailure('Invalid password', { email });

// Access denied
criticalEventLogger.logRBAC.accessDenied(resource, requiredRole, userRole);
```

---

## Error Handling

### ✅ Secure Error Messages

```typescript
// BAD ❌
catch (error) {
  return res.json({ error: error.message }); // May expose internals
}

// GOOD ✅
catch (error) {
  console.error('Internal error:', error); // Log detailed error
  return res.json({ error: 'An error occurred. Please try again.' }); // Generic message
}
```

### ✅ Use Error Monitoring

```typescript
import { errorMonitor } from '../utils/errorMonitoring';

try {
  // Your code
} catch (error) {
  errorMonitor.captureError(error, {
    page: window.location.pathname,
    action: 'user_action_name',
    metadata: { /* contextual data */ },
  });
}
```

---

## File Uploads

### ✅ Validate Files

```typescript
import { validateFileUpload } from '../utils/securityUtils';

const handleFileUpload = (file: File) => {
  const { valid, error } = validateFileUpload(file, {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png'],
    allowedExtensions: ['.jpg', '.jpeg', '.png'],
  });

  if (!valid) {
    toast.error(error);
    return;
  }

  // Proceed with upload
};
```

---

## Rate Limiting

### ✅ Implement Client-Side Rate Limiting

```typescript
import { rateLimiters } from '../utils/securityUtils';

const handleLogin = (email: string, password: string) => {
  // Check rate limit
  if (!rateLimiters.login.check(email)) {
    toast.error('Too many attempts. Please try again later.');
    return;
  }

  // Proceed with login
};
```

---

## API Requests

### ✅ Include Auth Token

```typescript
// For protected endpoints
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});
```

### ✅ Handle Rate Limits

```typescript
const response = await fetch(url);

if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  toast.error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
  return;
}
```

---

## Passwords

### ✅ Enforce Strong Passwords

```typescript
import { validatePassword } from '../utils/securityUtils';

const { valid, errors } = validatePassword(password);
if (!valid) {
  errors.forEach(err => toast.error(err));
  return;
}
```

### ❌ Never Store Plaintext Passwords

```typescript
// Passwords are handled by Supabase Auth - never store them yourself!
```

---

## XSS Prevention

### ✅ Use React's Built-in Protection

```typescript
// SAFE ✅ - React escapes by default
<div>{userInput}</div>

// DANGEROUS ❌ - Only use if absolutely necessary
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// If you must use HTML:
import { sanitizeHtml } from '../utils/securityUtils';
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userInput) }} />
```

---

## SQL Injection Prevention

### ✅ Use Parameterized Queries

```typescript
// We use Supabase which automatically parameterizes queries
// But be aware:

// BAD ❌
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;

// GOOD ✅
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail); // Automatically escaped
```

---

## CSRF Protection

### ✅ SameSite Cookies

```typescript
// Already configured in securityConfig.ts
cookies: {
  sameSite: 'strict',
  secure: true,
  httpOnly: true,
}
```

---

## Security Headers Checklist

When creating server endpoints, ensure these headers are set (done automatically by middleware):

- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Content-Security-Policy: [policy]`
- [ ] `Strict-Transport-Security` (on HTTPS)

---

## Common Security Pitfalls

### ❌ Avoid These Mistakes

1. **Trusting Client Data**
   ```typescript
   // BAD
   const isAdmin = req.body.isAdmin; // User can set this to true!
   
   // GOOD
   const isAdmin = user.role === 'admin'; // Check server-side
   ```

2. **Exposing Sensitive Info in URLs**
   ```typescript
   // BAD
   /api/reset-password?token=secret123&email=user@example.com
   
   // GOOD
   POST /api/reset-password with token in body
   ```

3. **Not Validating File Types**
   ```typescript
   // BAD
   if (file.name.endsWith('.jpg')) // Can be spoofed!
   
   // GOOD
   if (file.type === 'image/jpeg' && file.name.endsWith('.jpg'))
   ```

4. **Logging Sensitive Data**
   ```typescript
   // BAD
   console.log('User data:', user);
   
   // GOOD
   console.log('User data:', sanitizeForLogging(user));
   ```

5. **Not Handling Race Conditions**
   ```typescript
   // BAD
   if (balance >= amount) {
     balance -= amount; // Race condition!
   }
   
   // GOOD
   Use database transactions or atomic operations
   ```

---

## Security Testing

### Before Submitting PR

- [ ] All user inputs validated
- [ ] Sensitive data sanitized in logs
- [ ] Authentication required on protected routes
- [ ] Authorization checks in place
- [ ] Rate limiting tested
- [ ] Error messages don't expose internals
- [ ] No hardcoded secrets or API keys

### Manual Testing

```bash
# Test IDOR
curl -H "Authorization: Bearer <user1_token>" \
  https://api.estal.com/profile/<user2_id>
# Should return 403 Forbidden

# Test Rate Limiting
for i in {1..10}; do
  curl -X POST https://api.estal.com/login \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Should return 429 Too Many Requests

# Test XSS
# Submit: <script>alert('xss')</script>
# Should be sanitized or escaped
```

---

## Incident Response

### If You Discover a Vulnerability

1. **Do NOT** disclose publicly
2. **Do** email security@estal.com immediately
3. **Do** document:
   - Steps to reproduce
   - Potential impact
   - Affected versions

### If You Suspect an Attack

1. **Immediately** notify security team
2. **Do NOT** attempt to investigate yourself
3. **Do** preserve evidence
4. **Do** follow the SIRP: `/docs/SECURITY_INCIDENT_RESPONSE_PLAN.md`

---

## Security Resources

- **SIRP:** `/docs/SECURITY_INCIDENT_RESPONSE_PLAN.md`
- **Security Config:** `/utils/securityConfig.ts`
- **Security Utils:** `/utils/securityUtils.ts`
- **Security Middleware:** `/supabase/functions/server/securityMiddleware.tsx`

### External Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Security Best Practices](https://www.npmjs.com/package/helmet)

---

## Quick Commands

```bash
# View security logs
grep "security" logs/app.log

# Check for vulnerabilities in dependencies
npm audit

# Run security tests
npm run test:security

# Generate security report
npm run security:report
```

---

## Security Champions

Every team has a designated Security Champion:

- **Frontend:** [Name]
- **Backend:** [Name]
- **DevOps:** [Name]

Contact them for security questions or code reviews.

---

## Remember

> "Security is not a feature, it's a mindset."

- Always validate input
- Never trust client data
- Sanitize output
- Log security events
- Test security measures
- Keep dependencies updated
- Follow the principle of least privilege

---

**Last Updated:** October 26, 2025  
**Version:** 1.0  
**Maintained By:** Security Team
