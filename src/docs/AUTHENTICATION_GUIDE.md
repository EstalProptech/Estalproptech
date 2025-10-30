# 🔐 ESTAL Platform - Complete Authentication Guide

## Overview

ESTAL uses a **dual-mode authentication system** that supports both demo accounts (for testing) and real Supabase authentication (for production users).

---

## 🎯 Demo Authentication (Instant Access)

### Demo Credentials

The platform includes three pre-configured demo accounts for testing:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@estal.com | admin123 | Full platform access |
| **Accountant** | accountant@estal.com | accountant123 | Financial focus |
| **Owner** | owner@estal.com | owner123 | Property management |

### How Demo Mode Works

1. **Client-Side Authentication**: Demo accounts bypass Supabase and authenticate locally
2. **localStorage Session**: Demo sessions persist across page refreshes
3. **Role-Based Access**: Each demo account has specific permissions
4. **No Backend Required**: Perfect for testing without database setup

### Using Demo Accounts

1. Go to login page
2. Click **"Try Demo Account"** button
3. Select desired role (Admin, Accountant, or Owner)
4. Auto-login with pre-filled credentials

**OR** manually enter demo credentials

---

## 🔑 Real Authentication (Production Users)

### Registration Flow

```typescript
// New users register through the registration page
POST /functions/v1/make-server-96250128/signup
{
  "email": "user@example.com",
  "password": "secure-password",
  "name": "Full Name",
  "role": "owner" | "accountant" | "admin"
}
```

**Features:**
- Email auto-confirmation (no email verification required)
- Immediate auto-login after registration
- User profile stored in KV Store
- Secure password hashing via Supabase Auth

### Login Flow

```typescript
// Existing users login through Supabase Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

**Session Management:**
- JWT tokens with auto-refresh
- Persistent sessions across devices
- Secure cookie storage
- 7-day session expiration (configurable)

### Logout

```typescript
// Clears both demo and real sessions
await supabase.auth.signOut();
localStorage.removeItem('estal_demo_session');
```

---

## 🛡️ Role-Based Access Control (RBAC)

### Admin Role (مدير)

**Full Access to:**
- ✅ Dashboard
- ✅ Properties Management
- ✅ Maintenance Requests
- ✅ Financial Reports
- ✅ Analytics & Insights
- ✅ Clients Management
- ✅ User Management (Admin only)
- ✅ Security Audit Dashboard
- ✅ Data Flow Visualization
- ✅ Settings
- ✅ Help Center

### Accountant Role (محاسب)

**Financial Focus:**
- ✅ Dashboard (Financial KPIs)
- ✅ Financial Reports
- ✅ Analytics (Revenue, Expenses, ROI)
- ✅ Properties (Read-only for context)
- ✅ Data Flow Visualization
- ✅ Settings (Limited)
- ✅ Help Center
- ❌ User Management
- ❌ Maintenance Requests
- ❌ Clients Management

### Owner Role (مالك عقار)

**Property Management Focus:**
- ✅ Dashboard (Properties Overview)
- ✅ Properties Management
- ✅ Maintenance Requests
- ✅ Clients/Tenants Management
- ✅ Data Flow Visualization
- ✅ Settings (Personal)
- ✅ Help Center
- ❌ Financial Reports (Full access)
- ❌ User Management
- ❌ Security Audit

---

## 🔧 Implementation Details

### Auth Context Provider

```typescript
// components/AuthContext.tsx
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'accountant' | 'owner';
  avatarUrl?: string;
}

// Hook usage
const { user, isAuthenticated, login, logout } = useAuth();
```

### Protected Routes

```typescript
// Check if user has access to a specific view
import { hasAccess } from './components/AuthContext';

if (!hasAccess(user?.role, 'users')) {
  // Redirect or show error
}
```

### Session Persistence

**Demo Sessions:**
- Stored in `localStorage` as `estal_demo_session`
- JSON-encoded user object
- Cleared on logout

**Real Sessions:**
- Managed by Supabase Auth
- JWT tokens in secure HTTP-only cookies
- Auto-refresh on expiration

---

## 🐛 Troubleshooting

### ❌ "Invalid login credentials"

**Cause**: User account doesn't exist in Supabase database

**Solutions:**
1. Use demo accounts for testing (admin@estal.com / admin123)
2. Create a new account via registration page
3. Verify email/password are correct

### ❌ "Email not confirmed"

**Cause**: Legacy accounts created before auto-confirmation

**Solutions:**
1. System auto-confirms on next login attempt
2. Register a new account (auto-confirmed)
3. Contact admin for manual confirmation

### ❌ Session expires immediately

**Cause**: localStorage cleared or cookies blocked

**Solutions:**
1. Enable cookies in browser settings
2. Check browser privacy settings
3. Try incognito mode to test
4. Clear browser cache and retry

### ❌ Role permissions not working

**Cause**: User profile not loaded or role mismatch

**Solutions:**
1. Logout and login again
2. Check browser console for errors
3. Verify user role in database
4. Clear localStorage: `localStorage.clear()`

---

## 🔒 Security Best Practices

### For Demo Mode
- ⚠️ Demo accounts are **public** - don't store sensitive data
- ⚠️ Demo sessions are **client-side only** - not production-safe
- ✅ Use for testing, demos, and development only

### For Production
- ✅ Enforce strong passwords (min 8 characters)
- ✅ Use HTTPS only (enforced by Vercel)
- ✅ Enable rate limiting on login endpoint
- ✅ Implement 2FA (planned for v2.0)
- ✅ Regular security audits
- ✅ Monitor auth logs for suspicious activity

---

## 📊 Authentication Flow Diagram

```
┌─────────────────┐
│   Login Page    │
└────────┬────────┘
         │
         ▼
    ┌────────────────┐
    │ Demo Account?  │
    └───┬────────┬───┘
        │        │
       Yes       No
        │        │
        ▼        ▼
    ┌─────┐  ┌──────────┐
    │Local│  │ Supabase │
    │Auth │  │   Auth   │
    └──┬──┘  └────┬─────┘
       │          │
       └────┬─────┘
            ▼
      ┌──────────┐
      │ Set User │
      │ Context  │
      └────┬─────┘
           ▼
      ┌──────────┐
      │Dashboard │
      │ (RBAC)   │
      └──────────┘
```

---

## 🧪 Testing Authentication

### Manual Testing Checklist

- [ ] Demo login works for all 3 roles
- [ ] Real user registration succeeds
- [ ] Real user login succeeds
- [ ] Session persists after page refresh
- [ ] Logout clears session properly
- [ ] RBAC blocks unauthorized pages
- [ ] Password validation works
- [ ] Error messages are helpful

### Automated Tests (Coming Soon)

```typescript
// Example test structure
describe('Authentication', () => {
  test('demo login works', async () => {
    await login('admin@estal.com', 'admin123');
    expect(user.role).toBe('admin');
  });
  
  test('RBAC blocks unauthorized access', () => {
    setUser({ role: 'owner' });
    expect(hasAccess('owner', 'users')).toBe(false);
  });
});
```

---

## 📞 Support

**Authentication Issues?**
1. Check [Troubleshooting](#-troubleshooting) section
2. Review browser console for errors
3. Test with demo accounts first
4. Submit GitHub issue with error logs

---

**Last Updated**: October 26, 2025
**Maintained by**: ESTAL Development Team
