import { motion } from 'motion/react';
import { X, ShieldCheck, Calculator, Building2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { useAuth, UserRole } from './AuthContext';

const roleInfo: Record<UserRole, { icon: typeof ShieldCheck; color: string; description: string; features: string[] }> = {
  Admin: {
    icon: ShieldCheck,
    color: 'text-primary',
    description: 'You have full system access',
    features: ['Manage all properties', 'View financial reports', 'Manage maintenance', 'User management'],
  },
  Accountant: {
    icon: Calculator,
    color: 'text-accent',
    description: 'You have financial and reporting access',
    features: ['View financial reports', 'Manage invoices', 'Analytics dashboard', 'Export reports'],
  },
  Owner: {
    icon: Building2,
    color: 'text-secondary',
    description: 'You have property management access',
    features: ['Manage your properties', 'Track maintenance', 'View property analytics', 'Communication tools'],
  },
};

export function WelcomeBanner() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Check if banner has been shown in this session
    const shown = sessionStorage.getItem('welcomeBannerShown');
    if (!shown && user) {
      setIsVisible(true);
      sessionStorage.setItem('welcomeBannerShown', 'true');
      setHasBeenShown(true);
    }
  }, [user]);

  if (!isVisible || !user || hasBeenShown === false) return null;

  const info = roleInfo[user.role];
  const Icon = info.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Card className="rounded-[24px] border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4 flex-1">
              <div className={`w-12 h-12 rounded-[16px] bg-primary/10 flex items-center justify-center flex-shrink-0 ${info.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <h3 className="mb-1">
                  Welcome back, {user.name}! 👋
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {info.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-2">
                  {info.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="rounded-xl flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
