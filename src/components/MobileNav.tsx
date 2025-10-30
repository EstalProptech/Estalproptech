import { 
  LayoutDashboard, 
  Building2,
  FileBarChart,
  Wrench,
  Users,
  UserCog,
  ShieldCheck,
  Activity,
  Settings,
  HelpCircle
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigation } from "./NavigationContext";
import { useAuth, hasAccess } from "./AuthContext";

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'properties', icon: Building2, label: 'Properties' },
  { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
  { id: 'financial-reports', icon: FileBarChart, label: 'Financial' },
  { id: 'clients', icon: Users, label: 'Clients' },
  { id: 'users', icon: UserCog, label: 'Users' },
  { id: 'security-audit', icon: ShieldCheck, label: 'Security' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'help', icon: HelpCircle, label: 'Help' },
];

export function MobileNav() {
  const { activeView, navigate } = useNavigation();
  const { user } = useAuth();

  // Filter nav items based on user role - limit to 5 items for mobile
  const allVisibleItems = navItems.filter(item => hasAccess(user?.role, item.id));
  
  // Prioritize: Dashboard, Properties, Maintenance, Financial, Settings
  const priorityOrder = ['dashboard', 'properties', 'maintenance', 'financial-reports', 'settings'];
  const visibleNavItems = allVisibleItems
    .sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.id);
      const bIndex = priorityOrder.indexOf(b.id);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    })
    .slice(0, 5); // Limit to 5 items for optimal mobile UX

  const handleNavigate = (id: string) => {
    navigate(id);
    
    // Haptic feedback for touch devices
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 shadow-2xl">
      <div 
        className="flex h-16 px-1 safe-area-inset-bottom"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {visibleNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 relative flex-1 min-w-[60px] group ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator - Top Border */}
              <motion.div
                initial={false}
                animate={{
                  scaleX: isActive ? 1 : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{ 
                  duration: 0.25, 
                  ease: 'easeOut',
                  type: 'spring',
                  stiffness: 300,
                  damping: 25
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full shadow-lg shadow-primary/30"
              />

              {/* Icon Container */}
              <motion.div
                animate={isActive ? { 
                  scale: [1, 1.2, 1],
                  y: [0, -2, 0]
                } : {}}
                transition={{ 
                  duration: 0.3,
                  ease: 'easeOut'
                }}
                className="relative"
              >
                {/* Glow effect for active state */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1.5 }}
                    className="absolute inset-0 bg-primary rounded-full blur-md -z-10"
                  />
                )}
                <Icon className="w-5 h-5" />
              </motion.div>

              {/* Label */}
              <motion.span 
                className={`text-[10px] font-medium truncate max-w-[70px] transition-all duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                }`}
                animate={isActive ? { 
                  fontWeight: 600,
                } : {}}
              >
                {item.label}
              </motion.span>

              {/* Ripple effect on tap */}
              {!isActive && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  whileTap={{ 
                    scale: 2, 
                    opacity: 0,
                    transition: { duration: 0.4 }
                  }}
                  className="absolute inset-0 bg-primary/10 rounded-full pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
