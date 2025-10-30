import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Database, UserPlus, LogIn, X, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

export function FirstTimeSetupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen the setup guide
    const hasSeenSetup = localStorage.getItem('estal_has_seen_setup');
    if (!hasSeenSetup) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('estal_has_seen_setup', 'true');
    setIsOpen(false);
  };

  const steps = [
    {
      icon: Database,
      title: 'Set Up Database',
      description: 'Run the SQL setup script in Supabase',
      details: [
        'Open Supabase Dashboard (click link below)',
        'Navigate to: SQL Editor tab on the left sidebar',
        'Click "+ New Query" button',
        'Copy the SQL from /supabase/functions/server/database-setup.sql',
        'Paste into the query editor and click "Run"',
        'Wait for "Success. No rows returned" message',
        'Verify tables in: Table Editor → user_profiles, properties, etc.'
      ],
      time: '5 minutes',
      link: 'https://supabase.com/dashboard/project/hdhncpmsxgqjpdpahaxh/sql'
    },
    {
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Register your first user account',
      details: [
        'Close this modal and click "Create New Account" button',
        'Fill in your full name (e.g., "John Smith")',
        'Enter your email address',
        'Create a strong password (min 8 chars, include uppercase, lowercase, and number)',
        'Choose your role: Admin (full access), Owner (property management), or Accountant (financial)',
        'Check the Terms agreement checkbox',
        'Click "Create Account" - you\'ll be automatically logged in!'
      ],
      time: '2 minutes',
    },
    {
      icon: LogIn,
      title: 'Log In & Explore',
      description: 'Access your personalized dashboard',
      details: [
        'Use your new credentials to log in',
        'Explore your role-specific dashboard',
        'Check out real-time data updates',
        'Customize settings to your preference'
      ],
      time: '1 minute',
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Welcome to Estal PropTech! 🏢</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Get started in 3 simple steps (takes ~8 minutes total)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    currentStep === index
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {currentStep > index ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                  <span className="text-sm hidden md:inline">Step {index + 1}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className="w-8 md:w-16 h-0.5 bg-border mx-2" />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Step Header */}
              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-[20px] border border-primary/20">
                <div className="p-3 bg-primary rounded-[12px]">
                  {(() => {
                    const Icon = steps[currentStep].icon;
                    return <Icon className="w-6 h-6 text-white" />;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl">{steps[currentStep].title}</h3>
                    <span className="text-sm text-muted-foreground">
                      ⏱️ {steps[currentStep].time}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>

              {/* Step Details */}
              <div className="space-y-3">
                {steps[currentStep].details.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-[12px] hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground">{detail}</p>
                  </motion.div>
                ))}
              </div>

              {/* External Link */}
              {steps[currentStep].link && (
                <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-[12px]">
                  <p className="text-sm text-foreground mb-2">
                    <strong>Quick Action:</strong>
                  </p>
                  <a
                    href={steps[currentStep].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-[8px] hover:bg-secondary/90 transition-colors text-sm"
                  >
                    Open Supabase SQL Editor
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">
                    Opens directly to the SQL Editor where you can run the setup script
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="rounded-[12px]"
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="rounded-[12px]"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleClose}
                  className="rounded-[12px] bg-secondary hover:bg-secondary/90"
                >
                  Got it, Let's Start! 🚀
                </Button>
              )}
            </div>
          </div>

          {/* Skip Button */}
          <div className="text-center">
            <button
              onClick={handleClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip setup guide (I've already set things up)
            </button>
          </div>

          {/* Help Links */}
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">
              Need more help? Check out our guides:
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="/QUICK_START.md"
                className="text-xs px-3 py-1.5 bg-muted rounded-[8px] hover:bg-muted/80 transition-colors"
                target="_blank"
              >
                📖 Quick Start Guide
              </a>
              <a
                href="/SUPABASE_SETUP_GUIDE.md"
                className="text-xs px-3 py-1.5 bg-muted rounded-[8px] hover:bg-muted/80 transition-colors"
                target="_blank"
              >
                🗄️ Database Setup Guide
              </a>
              <a
                href="/README.md"
                className="text-xs px-3 py-1.5 bg-muted rounded-[8px] hover:bg-muted/80 transition-colors"
                target="_blank"
              >
                📚 Full Documentation
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
