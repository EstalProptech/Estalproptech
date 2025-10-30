import { Search, Bell, Moon, Sun, Globe, Menu, Languages, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { motion } from "motion/react";
import { useAuth } from "./AuthContext";

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onMenuClick?: () => void;
  isRTL?: boolean;
  onToggleRTL?: () => void;
}

export function Navbar({ isDarkMode, onToggleTheme, onMenuClick, isRTL, onToggleRTL }: NavbarProps) {
  const { user, logout } = useAuth();

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      'Admin': 'Administrator (مدير)',
      'Accountant': 'Accountant (محاسب)',
      'Owner': 'Property Owner (مالك)',
    };
    return roleLabels[role] || role;
  };

  return (
    <div className="h-14 md:h-16 bg-card border-b border-border px-3 md:px-6 flex items-center justify-between shadow-md fixed top-0 left-0 md:left-20 right-0 z-40">
      <div className="flex items-center gap-2 md:gap-3 flex-1">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden rounded-[16px] min-h-[44px] min-w-[44px]"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search properties, tenants, or maintenance..."
              className="pl-10 bg-input-background border-border rounded-[16px] shadow-sm"
            />
          </div>
        </div>
        {/* Mobile Search Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-[16px] min-h-[44px] min-w-[44px]"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-1 md:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleRTL}
          className="rounded-[16px] hidden md:flex hover:bg-sidebar-accent transition-all duration-200 min-h-[44px] min-w-[44px]"
          title="Toggle RTL/LTR"
        >
          <Languages className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          className="rounded-[16px] hover:bg-sidebar-accent transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
          </motion.div>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-[16px] relative hover:bg-sidebar-accent transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation"
        >
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          <motion.span 
            className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          ></motion.span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 md:gap-3 ml-1 md:ml-2 pl-2 md:pl-3 border-l border-border hover:opacity-80 transition-opacity min-h-[44px] touch-manipulation">
              <div className="text-right hidden md:block">
                <p className="text-sm">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.role || 'Guest'}</p>
              </div>
              <Avatar className="w-9 h-9 md:w-10 md:h-10">
                <AvatarFallback className="bg-primary text-white text-sm">
                  {user ? getUserInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-[16px]">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground font-normal">
                  {user ? getRoleLabel(user.role) : ''}
                </p>
                <p className="text-xs text-muted-foreground font-normal mt-1">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
