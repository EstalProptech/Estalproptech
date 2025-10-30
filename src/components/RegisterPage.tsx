import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Building2, Loader2, CheckCircle2, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth, UserRole } from './AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Validation
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('Full name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

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
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain uppercase, lowercase, and number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📝 Starting registration process...');
      const success = await register(name, email, password, role);
      
      if (success) {
        console.log('✅ Registration successful! Redirecting to dashboard...');
        setRegisterSuccess(true);
        // The redirect will happen automatically through the auth context
      } else {
        console.error('❌ Registration failed');
        setError(
          'Registration failed. This usually means:\n' +
          '• This email is already registered\n' +
          '• There\'s a connection issue with Supabase\n' +
          '• The KV store table is not accessible\n\n' +
          'Check the browser console for more details.'
        );
      }
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      
      // Provide specific error messages
      if (err?.message?.includes('duplicate key') || err?.message?.includes('already exists')) {
        setError(
          '❌ This email is already registered!\n\n' +
          '👉 Try:\n' +
          '• Use a different email address\n' +
          '• Or go back to login if this is your account'
        );
      } else if (err?.message?.includes('KV') || err?.message?.includes('kv_store')) {
        setError(
          '❌ Storage error!\n\n' +
          '👉 The KV store table may not be accessible:\n' +
          '1. Check your Supabase project is running\n' +
          '2. Verify the kv_store_96250128 table exists\n' +
          '3. Check browser console (F12) for details\n' +
          '4. Try again in a moment'
        );
      } else {
        setError(
          'Registration error: ' + (err?.message || 'Unknown error') + '\n\n' +
          'Check the browser console (F12) for detailed error information.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              <h1 className="text-3xl md:text-4xl mb-2">Create an Account</h1>
              <p className="text-muted-foreground">
                Join Estal PropTech and start managing your properties
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
                  <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                </Alert>
                {error.includes('Storage') && (
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://supabase.com/dashboard/project/hdhncpmsxgqjpdpahaxh', '_blank')}
                      className="rounded-[12px]"
                    >
                      Open Supabase Dashboard →
                    </Button>
                  </div>
                )}
                {error.includes('already registered') && (
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onSwitchToLogin}
                      className="rounded-[12px]"
                    >
                      Go to Login Page →
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Success State */}
            {registerSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-6 bg-secondary/10 rounded-[20px] flex items-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-medium text-secondary">Registration Successful!</p>
                  <p className="text-sm text-muted-foreground">Setting up your account...</p>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) validateName(e.target.value);
                    }}
                    onBlur={() => validateName(name)}
                    placeholder="John Doe"
                    className={`pl-12 h-12 rounded-[16px] ${nameError ? 'border-destructive' : ''}`}
                    disabled={isSubmitting || registerSuccess}
                  />
                </div>
                {nameError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {nameError}
                  </motion.p>
                )}
              </div>

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
                    disabled={isSubmitting || registerSuccess}
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
                      if (confirmPassword) validateConfirmPassword(confirmPassword);
                    }}
                    onBlur={() => validatePassword(password)}
                    placeholder="••••••••"
                    className={`pl-12 pr-12 h-12 rounded-[16px] ${passwordError ? 'border-destructive' : ''}`}
                    disabled={isSubmitting || registerSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isSubmitting || registerSuccess}
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmPasswordError) validateConfirmPassword(e.target.value);
                    }}
                    onBlur={() => validateConfirmPassword(confirmPassword)}
                    placeholder="••••••••"
                    className={`pl-12 pr-12 h-12 rounded-[16px] ${confirmPasswordError ? 'border-destructive' : ''}`}
                    disabled={isSubmitting || registerSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isSubmitting || registerSuccess}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPasswordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {confirmPasswordError}
                  </motion.p>
                )}
              </div>

              {/* Role Selector */}
              <div className="space-y-2">
                <Label htmlFor="role">Select Your Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={isSubmitting || registerSuccess}>
                  <SelectTrigger id="role" className="h-12 rounded-[16px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div>
                        <div className="font-medium">Admin (مدير)</div>
                        <div className="text-xs text-muted-foreground">Full system access</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="accountant">
                      <div>
                        <div className="font-medium">Accountant (محاسب)</div>
                        <div className="text-xs text-muted-foreground">Financial & reports access</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="owner">
                      <div>
                        <div className="font-medium">Owner (مالك عقار)</div>
                        <div className="text-xs text-muted-foreground">Property management access</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                  disabled={isSubmitting || registerSuccess}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <button type="button" className="text-primary hover:text-secondary transition-colors">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-primary hover:text-secondary transition-colors">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || registerSuccess}
                className="w-full h-12 rounded-[16px] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : registerSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Success!
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-primary hover:text-secondary transition-colors font-medium"
                  disabled={isSubmitting || registerSuccess}
                >
                  Sign In
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                Powered by Estal Technologies
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden lg:block relative bg-gradient-to-br from-secondary to-accent p-12 overflow-hidden"
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
                Start Your Journey
                <br />
                with Estal PropTech
              </h2>
              <p className="text-white/80">
                Join thousands of property managers who trust Estal PropTech for their business.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-4">
                <p className="text-3xl text-white mb-1">10K+</p>
                <p className="text-sm text-white/80">Properties Managed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-4">
                <p className="text-3xl text-white mb-1">500+</p>
                <p className="text-sm text-white/80">Active Users</p>
              </div>
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

            {/* Benefits */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">Easy property management</p>
              </div>
              <div className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">Real-time financial tracking</p>
              </div>
              <div className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">AI-powered insights</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
