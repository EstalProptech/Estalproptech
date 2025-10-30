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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { motion } from "motion/react";
import { useNavigation } from "./NavigationContext";
import { useAuth, hasAccess } from "./AuthContext";

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'properties', icon: Building2, label: 'Properties' },
  { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
  { id: 'financial-reports', icon: FileBarChart, label: 'Financial Reports' },
  { id: 'clients', icon: Users, label: 'Clients' },
  { id: 'users', icon: UserCog, label: 'User Management' },
  { id: 'security-audit', icon: ShieldCheck, label: 'Security Audit' },
  { id: 'performance', icon: Activity, label: 'Performance Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'help', icon: HelpCircle, label: 'Help' },
];

export function Sidebar() {
  const { activeView, navigate } = useNavigation();
  const { user } = useAuth();

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter(item => hasAccess(user?.role, item.id));

  return (
    <div className="hidden md:flex w-20 bg-card border-r border-border h-screen fixed left-0 top-0 flex-col items-center py-6 shadow-md z-50">
      <div className="mb-8">
        <motion.div 
          className="w-12 h-12 bg-primary rounded-[16px] flex items-center justify-center shadow-md cursor-pointer"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('dashboard')}
        >
          <span className="text-white">Estal</span>
        </motion.div>
      </div>
      
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 flex flex-col gap-3" role="navigation" aria-label="Main navigation">
          {visibleNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => navigate(item.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-14 h-14 rounded-[16px] flex items-center justify-center transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-primary hover:shadow-sm'
                    }`}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Active Indicator - Left Border */}
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        x: isActive ? 0 : -4,
                      }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-secondary rounded-r-full"
                    />

                    <motion.div
                      initial={false}
                      animate={isActive ? { 
                        scale: [1, 1.15, 1],
                        rotate: [0, 5, 0]
                      } : {}}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="relative z-10"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>

                    {/* Hover Glow Effect */}
                    {!isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 rounded-[16px] bg-primary/5"
                      />
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right" className="rounded-xl bg-card border-border">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isActive ? 'Current page' : 'Navigate'}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </div>
  );
}
