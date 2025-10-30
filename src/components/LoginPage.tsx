import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Building2, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth, UserRole } from './AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FirstTimeSetupModal } from './FirstTimeSetupModal';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showDemoOptions, setShowDemoOptions] = useState(false);

  // Validation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleDemoLogin = async (role: 'admin' | 'accountant' | 'owner') => {
    const demoAccounts = {
      admin: { email: 'admin@estal.com', password: 'admin123' },
      accountant: { email: 'accountant@estal.com', password: 'accountant123' },
      owner: { email: 'owner@estal.com', password: 'owner123' },
    };

    const demo = demoAccounts[role];
    setEmail(demo.email);
    setPassword(demo.password);
    setShowDemoOptions(false);
    
    // Auto-submit after a brief delay
    setTimeout(() => {
      handleSubmit(new Event('submit') as any);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Trim inputs to avoid whitespace issues
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      console.log('📧 Login attempt - Email:', trimmedEmail);
      console.log('🔑 Login attempt - Password length:', trimmedPassword.length);
      
      const success = await login(trimmedEmail, trimmedPassword);
      if (success) {
        setLoginSuccess(true);
        // The redirect will happen automatically through the auth context
      } else {
        setError(
          '❌ Login failed: No account found.\n\n' +
          '👉 Quick Solutions:\n' +
          '• Click "Try Demo Account" for instant access\n' +
          '• Click "Create New Account" to register\n' +
          '• Verify your email and password are correct'
        );
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Provide specific error messages based on the error
      if (err?.message?.includes('Invalid login credentials')) {
        setError(
          '❌ No account found with these credentials.\n\n' +
          '👉 Quick Solutions:\n' +
          '1. Click "Try Demo Account" button below for instant access\n' +
          '2. Click "Create New Account" to register your own account\n' +
          '3. If you have an account, verify your email and password\n\n' +
          '💡 Demo credentials:\n' +
          '• Admin: admin@estal.com / admin123\n' +
          '• Accountant: accountant@estal.com / accountant123\n' +
          '• Owner: owner@estal.com / owner123'
        );
      } else {
        setError(
          '❌ Connection error: Unable to reach authentication service.\n\n' +
          'Please check:\n' +
          '• Your internet connection\n' +
          '• Supabase configuration in .env file\n' +
          '• Or try demo account for testing'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FirstTimeSetupModal />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-card rounded-[32px] shadow-2xl overflow-hidden"
      >
        {/* Left Side - Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-[16px] bg-primary flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl">Estal PropTech</h2>
              </div>
            </div>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl mb-2">Sign In</h1>
              <p className="text-muted-foreground">
                Access your real estate management dashboard
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert variant="destructive" className="rounded-[16px]">
                  <AlertDescription className="whitespace-pre-line text-sm">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Success State */}
            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-6 bg-secondary/10 rounded-[20px] flex items-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-medium text-secondary">Login Successful!</p>
                  <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={() => validateEmail(email)}
                    placeholder="you@example.com"
                    className={`pl-12 h-12 rounded-[16px] ${emailError ? 'border-destructive' : ''}`}
                    disabled={isSubmitting || loginSuccess}
                  />
                </div>
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) validatePassword(e.target.value);
                    }}
                    onBlur={() => validatePassword(password)}
                    placeholder="••••••••"
                    className={`pl-12 pr-12 h-12 rounded-[16px] ${passwordError ? 'border-destructive' : ''}`}
                    disabled={isSubmitting || loginSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isSubmitting || loginSuccess}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </div>



              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                    disabled={isSubmitting || loginSuccess}
                  />
                  <span className="text-sm">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-secondary transition-colors"
                  disabled={isSubmitting || loginSuccess}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || loginSuccess}
                className="w-full h-12 rounded-[16px] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : loginSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Success!
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Demo Account Button */}
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDemoOptions(!showDemoOptions)}
                  disabled={isSubmitting || loginSuccess}
                  className="w-full h-12 rounded-[16px] border-2 border-dashed"
                >
                  🎯 Try Demo Account
                </Button>
                
                {showDemoOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 p-3 bg-card border border-border rounded-[16px] shadow-lg z-10"
                  >
                    <p className="text-xs text-muted-foreground mb-2">Select a role to demo:</p>
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDemoLogin('admin')}
                        className="w-full justify-start rounded-[12px]"
                      >
                        👨‍💼 Admin (Full Access)
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDemoLogin('accountant')}
                        className="w-full justify-start rounded-[12px]"
                      >
                        💰 Accountant (Financial Focus)
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDemoLogin('owner')}
                        className="w-full justify-start rounded-[12px]"
                      >
                        🏢 Owner (Property Manager)
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Create Account Button */}
              <Button
                type="button"
                variant="secondary"
                onClick={onSwitchToRegister}
                disabled={isSubmitting || loginSuccess}
                className="w-full h-12 rounded-[16px]"
              >
                Create New Account
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-center mb-3">
                <p className="text-xs text-muted-foreground">
                  Having trouble? Check the{' '}
                  <button
                    type="button"
                    onClick={() => window.open('/AUTHENTICATION_ERROR_FIX.md', '_blank')}
                    className="text-primary hover:underline"
                  >
                    Authentication Guide
                  </button>
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Powered by Estal Technologies
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden lg:block relative bg-gradient-to-br from-primary to-secondary p-12 overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl text-white mb-4">
                Manage Your Properties
                <br />
                with Confidence
              </h2>
              <p className="text-white/80">
                Comprehensive real estate management platform for modern property owners and managers.
              </p>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md aspect-square rounded-[24px] overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1681216868987-b7268753b81c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjEwMzI0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Modern Property Management"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-white/90">Property Management</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-white/90">Secure & Reliable</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-white/90">Easy to Use</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </>
  );
}
