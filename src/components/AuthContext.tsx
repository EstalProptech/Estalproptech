import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { userProfiles } from '../utils/supabase/kv';
import { criticalEventLogger } from '../utils/criticalEventLogger';

export type UserRole = 'admin' | 'accountant' | 'owner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Check for existing session on mount and listen for auth changes
  useEffect(() => {
    checkSession();

    // Listen for auth state changes (session refresh, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        // Check if we're in demo mode - if so, ignore Supabase auth events
        const demoSessionStr = localStorage.getItem('estal_demo_session');
        if (demoSessionStr) {
          console.log('Demo mode active, ignoring Supabase auth event');
          return;
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('✅ Session refreshed successfully');
          if (session?.user) {
            await loadUserProfile(session.user.id);
          }
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          setUser(null);
        }
        
        if (event === 'USER_UPDATED') {
          console.log('👤 User updated');
          if (session?.user) {
            await loadUserProfile(session.user.id);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      // First check for demo session in localStorage
      const demoSessionStr = localStorage.getItem('estal_demo_session');
      if (demoSessionStr) {
        try {
          const demoUser = JSON.parse(demoSessionStr);
          console.log('✅ Found demo session for:', demoUser.email);
          setUser(demoUser);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing demo session:', e);
          localStorage.removeItem('estal_demo_session');
        }
      }
      
      // Check for real Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      // Skip profile loading for demo users
      if (userId.startsWith('demo-')) {
        console.log('Skipping profile load for demo user');
        return;
      }
      
      // Get user profile from KV store
      const profile = await userProfiles.get(userId);

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as UserRole,
          avatarUrl: profile.avatar_url,
        });

        // Update last login
        await userProfiles.updateLastLogin(userId);
      } else {
        // Profile doesn't exist - this user was created before KV migration
        // Try to get their info from auth metadata
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const newProfile = {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            role: (authUser.user_metadata?.role as UserRole) || 'owner',
            avatar_url: authUser.user_metadata?.avatar_url,
            status: 'active',
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          };
          
          // Create the profile in KV store
          await userProfiles.set(authUser.id, newProfile);
          
          setUser({
            id: newProfile.id,
            email: newProfile.email,
            name: newProfile.name,
            role: newProfile.role,
            avatarUrl: newProfile.avatar_url,
          });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error loading user profile:', errorMessage);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('🔐 Attempting login for:', email);
      console.log('📧 Email (trimmed, lowercase):', email.trim().toLowerCase());
      console.log('🔑 Password length:', password.length);
      
      // IMPORTANT: Check if this is a demo account FIRST before any Supabase calls
      const demoAccounts = {
        'admin@estal.com': { password: 'admin123', role: 'admin' as UserRole, name: 'Admin User' },
        'accountant@estal.com': { password: 'accountant123', role: 'accountant' as UserRole, name: 'Accountant User' },
        'owner@estal.com': { password: 'owner123', role: 'owner' as UserRole, name: 'Property Owner' },
      };

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();
      const demoAccount = demoAccounts[normalizedEmail as keyof typeof demoAccounts];
      
      console.log('🎯 Demo account lookup:', normalizedEmail);
      console.log('🎯 Demo account found:', !!demoAccount);
      
      if (demoAccount) {
        console.log('🔍 Checking password match...');
        console.log('🔍 Expected password:', demoAccount.password);
        console.log('🔍 Provided password:', normalizedPassword);
        console.log('🔍 Passwords match:', normalizedPassword === demoAccount.password);
      }
      
      if (demoAccount && normalizedPassword === demoAccount.password) {
        console.log('✅✅✅ DEMO ACCOUNT AUTHENTICATED - BYPASSING SUPABASE ✅✅✅');
        
        // Generate unique session ID to prevent concurrent session conflicts
        const newSessionId = `demo-session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        
        // Create a demo user session
        const demoUser: User = {
          id: `demo-${demoAccount.role}`,
          email: normalizedEmail,
          name: demoAccount.name,
          role: demoAccount.role,
          avatarUrl: undefined,
        };
        
        // Store demo session in localStorage with session ID
        const demoSession = {
          ...demoUser,
          sessionId: newSessionId,
          loginTime: Date.now(),
        };
        localStorage.setItem('estal_demo_session', JSON.stringify(demoSession));
        
        setUser(demoUser);
        setSessionId(newSessionId);
        setIsLoading(false);
        
        // Log successful auth event
        criticalEventLogger.logAuth.loginSuccess(demoUser.id, {
          email: normalizedEmail,
          role: demoAccount.role,
          isDemoAccount: true,
        });
        
        console.log('✅ Demo login successful for role:', demoAccount.role);
        console.log('✅ Session ID:', newSessionId);
        console.log('✅ User object:', demoUser);
        return true;
      }
      
      console.log('⚠️ Not a demo account or password mismatch, proceeding with Supabase authentication...');
      
      // Not a demo account, proceed with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error.message);
        console.error('Error details:', error);
        
        // Log failed auth event
        criticalEventLogger.logAuth.loginFailure(error.message, {
          email,
          errorCode: error.status,
        });
        
        // Handle email not confirmed error
        if (error.message.includes('Email not confirmed')) {
          console.log('⚠️ Email not confirmed, attempting to auto-confirm...');
          
          try {
            // Get Supabase project info with fallback
            const info = await import('../utils/supabase/info').catch(() => ({ 
              projectId: 'ttsasgbrmswtjtenmksw', 
              publicAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2FzZ2JybXN3dGp0ZW5ta3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NjY5NDIsImV4cCI6MjA0NjI0Mjk0Mn0.J5lXZwYIgS8jLBzLgRf7V3TGZ_IwBq5L5_0Q3kF4I_0'
            }));
            const { projectId, publicAnonKey } = info;
            
            // Call server to confirm the user's email
            const confirmResponse = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-96250128/confirm-user`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`,
                },
                body: JSON.stringify({ email }),
              }
            );

            const confirmResult = await confirmResponse.json();

            if (confirmResponse.ok && confirmResult.success) {
              console.log('✅ Email confirmed automatically, retrying login...');
              
              // Retry login after confirmation
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (retryError) {
                console.error('❌ Login failed after confirmation:', retryError);
                setIsLoading(false);
                throw retryError;
              }

              if (retryData.user) {
                console.log('✅ Login successful after email confirmation:', retryData.user.email);
                await loadUserProfile(retryData.user.id);
                setIsLoading(false);
                return true;
              }
            } else {
              console.error('❌ Failed to confirm email:', confirmResult.error);
              console.log('');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('💡 EMAIL NOT CONFIRMED:');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('Your email address could not be auto-confirmed.');
              console.log('');
              console.log('👉 Solutions:');
              console.log('1. Check your email inbox for confirmation link');
              console.log('2. Or register a new account (new accounts are auto-confirmed)');
              console.log('3. Contact support if you need help');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('');
            }
          } catch (confirmError) {
            console.error('❌ Error during auto-confirmation:', confirmError);
          }
        }
        
        // Provide helpful error messages for other errors
        if (error.message.includes('Invalid login credentials')) {
          console.log('');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('💡 LOGIN TROUBLESHOOTING TIPS:');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('1. ✅ Have you created an account?');
          console.log('   → Click "Create New Account" to register');
          console.log('');
          console.log('2. ✅ Check your credentials:');
          console.log('   → Email: ' + email);
          console.log('   → Make sure password is correct');
          console.log('');
          console.log('3. ✅ Email confirmation:');
          console.log('   → New accounts are auto-confirmed');
          console.log('   → If you registered before, your email will be auto-confirmed on login');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('');
        }
        
        setIsLoading(false);
        throw error; // Throw to let LoginPage handle the error
      }

      if (data.user) {
        console.log('✅ Login successful for user:', data.user.email);
        await loadUserProfile(data.user.id);
        
        // Log successful auth event
        criticalEventLogger.logAuth.loginSuccess(data.user.id, {
          email: data.user.email,
        });
        
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('❌ Login exception:', error);
      setIsLoading(false);
      throw error; // Re-throw to let LoginPage handle it
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('🔐 Starting registration for:', email, 'with role:', role);
      
      // Get Supabase project info with fallback
      const info = await import('../utils/supabase/info').catch(() => ({ 
        projectId: 'ttsasgbrmswtjtenmksw', 
        publicAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2FzZ2JybXN3dGp0ZW5ta3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NjY5NDIsImV4cCI6MjA0NjI0Mjk0Mn0.J5lXZwYIgS8jLBzLgRf7V3TGZ_IwBq5L5_0Q3kF4I_0'
      }));
      const { projectId, publicAnonKey } = info;
      
      // Call server-side signup endpoint to create user with auto-confirmed email
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name, role }),
        }
      );

      const result = await response.json();

      // Handle user already exists
      if (result.code === 'user_exists') {
        console.log('⚠️ User already exists, attempting to confirm email...');
        
        // Try to confirm the existing user's email
        const confirmResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-96250128/confirm-user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({ email }),
          }
        );

        const confirmResult = await confirmResponse.json();

        if (confirmResponse.ok && confirmResult.success) {
          console.log('✅ Existing user email confirmed');
          
          // Now try to sign in with the provided password
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            console.error('❌ Login failed after confirmation. The password may be different.');
            setIsLoading(false);
            throw new Error(
              'Your account exists but the password is incorrect. ' +
              'We confirmed your email - please try logging in with your original password, ' +
              'or use "Forgot Password" to reset it.'
            );
          }

          if (signInData.user) {
            console.log('✅ Login successful after email confirmation');
            await loadUserProfile(signInData.user.id);
            setIsLoading(false);
            return true;
          }
        }
        
        setIsLoading(false);
        throw new Error(
          'An account with this email already exists. ' +
          'Please try logging in instead, or use "Forgot Password" if you don\'t remember your password.'
        );
      }

      if (!response.ok || result.error) {
        console.error('❌ Server registration error:', result.error);
        setIsLoading(false);
        throw new Error(result.error || 'Registration failed');
      }

      console.log('✅ Auth user created with auto-confirmed email:', result.user.id);
      
      // Now sign in the user immediately
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('❌ Auto-login error after registration:', signInError);
        setIsLoading(false);
        throw signInError;
      }

      if (signInData.user) {
        console.log('✅ Auto-login successful after registration');
        
        // Log registration event
        criticalEventLogger.logAuth.register(signInData.user.id, role);
        
        // Create user profile in KV store
        const profile = {
          id: signInData.user.id,
          name,
          email,
          role,
          status: 'active',
          avatar_url: null,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        const success = await userProfiles.set(signInData.user.id, profile);

        if (!success) {
          console.error('❌ Profile creation error: Failed to save to KV store');
          console.log('');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('💡 KV STORE ISSUE:');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('Could not save user profile to KV store.');
          console.log('');
          console.log('👉 Make sure:');
          console.log('1. The kv_store_96250128 table exists');
          console.log('2. Your Supabase project is accessible');
          console.log('3. You have proper permissions');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('');
          
          setIsLoading(false);
          throw new Error('Failed to create user profile');
        }

        console.log('✅ User profile created successfully in KV store');
        console.log('✅ Registration complete! Loading dashboard...');
        
        // Set the user immediately
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as UserRole,
          avatarUrl: profile.avatar_url,
        });
        
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('❌ Registration exception:', error);
      setIsLoading(false);
      throw error; // Re-throw to let RegisterPage handle it
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Initiating logout...');
      
      // Log logout event
      if (user) {
        criticalEventLogger.logAuth.logout(user.id);
      }
      
      // Clear demo session if exists
      const hadDemoSession = !!localStorage.getItem('estal_demo_session');
      localStorage.removeItem('estal_demo_session');
      
      // Clear any cached data
      sessionStorage.clear();
      
      // Sign out from Supabase (won't error if no session exists)
      if (!hadDemoSession) {
        await supabase.auth.signOut();
      }
      
      // Clear user state
      setUser(null);
      
      console.log('✅ Logout complete - all sessions cleared');
      console.log('   - Demo session:', hadDemoSession ? 'cleared' : 'none');
      console.log('   - Supabase session:', !hadDemoSession ? 'cleared' : 'skipped');
      console.log('   - User state: null');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force clear user state even if logout fails
      setUser(null);
      localStorage.removeItem('estal_demo_session');
      sessionStorage.clear();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Role-based access control helper
export const rolePermissions = {
  admin: [
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
  ],
  accountant: [
    'dashboard',
    'financial-reports',
    'analytics',
    'properties',
    'data-flow-diagram',
    'settings',
    'help',
  ],
  owner: [
    'dashboard',
    'properties',
    'maintenance',
    'clients',
    'data-flow-diagram',
    'settings',
    'help',
  ],
};

export function hasAccess(userRole: UserRole | undefined, view: string): boolean {
  if (!userRole) return false;
  return rolePermissions[userRole].includes(view);
}
