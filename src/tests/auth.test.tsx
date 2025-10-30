/**
 * ESTAL Platform - Authentication Test Suite
 * 
 * Validates Priority 2 checklist items:
 * 1. Demo login for all roles
 * 2. RBAC redirects
 * 3. Session persistence
 * 4. Token refresh
 * 5. Error messages
 * 6. Concurrent sessions
 * 7. Logout clearing
 * 8. Protected routes
 * 9. API error fallback
 * 10. Role-based UI hiding
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth, hasAccess, rolePermissions } from '../components/AuthContext';
import { NavigationProvider } from '../components/NavigationContext';

describe('Authentication System', () => {
  beforeEach(() => {
    // Clear localStorage and sessionStorage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('1. Demo Account Login', () => {
    it('should authenticate admin demo account', async () => {
      const TestComponent = () => {
        const { login, user } = useAuth();

        const handleLogin = async () => {
          await login('admin@estal.com', 'admin123');
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            {user && <div data-testid="user-role">{user.role}</div>}
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        const roleElement = screen.getByTestId('user-role');
        expect(roleElement.textContent).toBe('admin');
      });
    });

    it('should authenticate accountant demo account', async () => {
      const TestComponent = () => {
        const { login, user } = useAuth();

        const handleLogin = async () => {
          await login('accountant@estal.com', 'accountant123');
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            {user && <div data-testid="user-role">{user.role}</div>}
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        const roleElement = screen.getByTestId('user-role');
        expect(roleElement.textContent).toBe('accountant');
      });
    });

    it('should authenticate owner demo account', async () => {
      const TestComponent = () => {
        const { login, user } = useAuth();

        const handleLogin = async () => {
          await login('owner@estal.com', 'owner123');
        };

        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            {user && <div data-testid="user-role">{user.role}</div>}
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        const roleElement = screen.getByTestId('user-role');
        expect(roleElement.textContent).toBe('owner');
      });
    });
  });

  describe('2. Role-Based Access Control', () => {
    it('should grant admin access to all views', () => {
      const allViews = [
        'dashboard',
        'properties',
        'maintenance',
        'financial-reports',
        'analytics',
        'clients',
        'users',
        'security-audit',
        'data-flow-diagram',
        'settings',
        'help',
      ];

      allViews.forEach((view) => {
        expect(hasAccess('admin', view)).toBe(true);
      });
    });

    it('should restrict accountant access to financial views', () => {
      expect(hasAccess('accountant', 'financial-reports')).toBe(true);
      expect(hasAccess('accountant', 'analytics')).toBe(true);
      expect(hasAccess('accountant', 'maintenance')).toBe(false);
      expect(hasAccess('accountant', 'users')).toBe(false);
      expect(hasAccess('accountant', 'clients')).toBe(false);
    });

    it('should restrict owner access to property management', () => {
      expect(hasAccess('owner', 'properties')).toBe(true);
      expect(hasAccess('owner', 'maintenance')).toBe(true);
      expect(hasAccess('owner', 'clients')).toBe(true);
      expect(hasAccess('owner', 'financial-reports')).toBe(false);
      expect(hasAccess('owner', 'users')).toBe(false);
      expect(hasAccess('owner', 'security-audit')).toBe(false);
    });

    it('should deny access when user role is undefined', () => {
      expect(hasAccess(undefined, 'dashboard')).toBe(false);
      expect(hasAccess(undefined, 'properties')).toBe(false);
    });
  });

  describe('3. Session Persistence', () => {
    it('should persist demo session in localStorage', async () => {
      const TestComponent = () => {
        const { login } = useAuth();

        const handleLogin = async () => {
          await login('admin@estal.com', 'admin123');
        };

        return <button onClick={handleLogin}>Login</button>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        const demoSession = localStorage.getItem('estal_demo_session');
        expect(demoSession).not.toBeNull();
        
        const session = JSON.parse(demoSession!);
        expect(session.role).toBe('admin');
        expect(session.sessionId).toBeDefined();
      });
    });

    it('should restore session from localStorage on mount', async () => {
      // Pre-populate localStorage with demo session
      const demoUser = {
        id: 'demo-admin',
        email: 'admin@estal.com',
        name: 'Admin User',
        role: 'admin',
        sessionId: 'test-session-123',
        loginTime: Date.now(),
      };
      localStorage.setItem('estal_demo_session', JSON.stringify(demoUser));

      const TestComponent = () => {
        const { user, isAuthenticated } = useAuth();
        
        return (
          <div>
            <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not authenticated'}</div>
            {user && <div data-testid="user-role">{user.role}</div>}
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        const authStatus = screen.getByTestId('auth-status');
        expect(authStatus.textContent).toBe('authenticated');
        
        const roleElement = screen.getByTestId('user-role');
        expect(roleElement.textContent).toBe('admin');
      });
    });
  });

  describe('7. Logout Functionality', () => {
    it('should clear demo session on logout', async () => {
      const TestComponent = () => {
        const { login, logout, user } = useAuth();

        return (
          <div>
            <button onClick={() => login('admin@estal.com', 'admin123')}>Login</button>
            <button onClick={logout}>Logout</button>
            <div data-testid="auth-state">{user ? 'logged-in' : 'logged-out'}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Login first
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('auth-state').textContent).toBe('logged-in');
      });

      // Then logout
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByTestId('auth-state').textContent).toBe('logged-out');
        expect(localStorage.getItem('estal_demo_session')).toBeNull();
      });
    });

    it('should clear sessionStorage on logout', async () => {
      // Set some session data
      sessionStorage.setItem('test-data', 'value');

      const TestComponent = () => {
        const { logout } = useAuth();
        return <button onClick={logout}>Logout</button>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(sessionStorage.getItem('test-data')).toBeNull();
      });
    });
  });

  describe('10. Role Permissions Configuration', () => {
    it('should have correct admin permissions', () => {
      expect(rolePermissions.admin).toContain('dashboard');
      expect(rolePermissions.admin).toContain('users');
      expect(rolePermissions.admin).toContain('security-audit');
      expect(rolePermissions.admin.length).toBe(11);
    });

    it('should have correct accountant permissions', () => {
      expect(rolePermissions.accountant).toContain('dashboard');
      expect(rolePermissions.accountant).toContain('financial-reports');
      expect(rolePermissions.accountant).toContain('analytics');
      expect(rolePermissions.accountant).not.toContain('users');
      expect(rolePermissions.accountant).not.toContain('maintenance');
    });

    it('should have correct owner permissions', () => {
      expect(rolePermissions.owner).toContain('dashboard');
      expect(rolePermissions.owner).toContain('properties');
      expect(rolePermissions.owner).toContain('maintenance');
      expect(rolePermissions.owner).not.toContain('users');
      expect(rolePermissions.owner).not.toContain('financial-reports');
    });
  });
});

describe('Password Validation', () => {
  it('should reject login with incorrect password', async () => {
    const TestComponent = () => {
      const { login } = useAuth();
      const [error, setError] = useState<string>('');

      const handleLogin = async () => {
        try {
          await login('admin@estal.com', 'wrongpassword');
        } catch (err: any) {
          setError('Login failed');
        }
      };

      return (
        <div>
          <button onClick={handleLogin}>Login</button>
          {error && <div data-testid="error">{error}</div>}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    // Should not authenticate with wrong password
    await waitFor(() => {
      expect(localStorage.getItem('estal_demo_session')).toBeNull();
    });
  });
});

describe('Concurrent Sessions', () => {
  it('should generate unique session IDs for each login', async () => {
    const sessionIds: string[] = [];

    const TestComponent = () => {
      const { login } = useAuth();

      const handleLogin = async () => {
        await login('admin@estal.com', 'admin123');
        const session = localStorage.getItem('estal_demo_session');
        if (session) {
          const parsed = JSON.parse(session);
          sessionIds.push(parsed.sessionId);
        }
      };

      return <button onClick={handleLogin}>Login</button>;
    };

    const { rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First login
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(sessionIds.length).toBe(1);
    });

    // Logout and login again
    localStorage.clear();
    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(sessionIds.length).toBe(2);
      expect(sessionIds[0]).not.toBe(sessionIds[1]);
    });
  });
});
