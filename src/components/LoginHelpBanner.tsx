import { useState } from 'react';
import { AlertCircle, X, ExternalLink, Database, UserPlus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

interface LoginHelpBannerProps {
  onCreateAccount: () => void;
}

export function LoginHelpBanner({ onCreateAccount }: LoginHelpBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-[20px] overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
            ⚠️ Can't Login? You Need to Create an Account First!
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
            If you're seeing "Invalid login credentials", it means you haven't registered yet.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={onCreateAccount}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-[12px] h-8"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Create Account Now
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="rounded-[12px] h-8 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900"
            >
              {showDetails ? 'Hide' : 'Show'} Setup Steps
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open('/LOGIN_TROUBLESHOOTING.md', '_blank')}
              className="rounded-[12px] h-8 text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900"
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Full Guide
            </Button>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-amber-200 dark:border-amber-800 overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-white/50 dark:bg-black/20">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Set Up Database (One-time)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Run the SQL setup script in Supabase Dashboard
                  </p>
                  <a
                    href="https://supabase.com/dashboard/project/hdhncpmsxgqjpdpahaxh/sql"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-secondary transition-colors"
                  >
                    Open SQL Editor
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    📄 Then copy/paste SQL from: <code className="bg-muted px-1 rounded">/supabase/functions/server/database-setup.sql</code>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Create Your Account
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Register a new user with your email and password
                  </p>
                  <Button
                    size="sm"
                    onClick={onCreateAccount}
                    className="bg-secondary hover:bg-secondary/90 text-white rounded-[10px] h-8"
                  >
                    Go to Registration →
                  </Button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Log In & Start Managing
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    After registration, you'll be automatically logged in. For future logins, use the credentials you created.
                  </p>
                </div>
              </div>

              {/* Help Note */}
              <div className="pt-3 border-t border-amber-200 dark:border-amber-800">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Need help?</strong> Check the{' '}
                  <button
                    onClick={() => window.open('/LOGIN_TROUBLESHOOTING.md', '_blank')}
                    className="text-primary hover:text-secondary underline"
                  >
                    Login Troubleshooting Guide
                  </button>
                  {' '}for detailed instructions and common issues.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
