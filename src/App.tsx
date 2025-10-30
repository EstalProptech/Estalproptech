import { useState, useEffect, lazy, Suspense } from "react";
import { NavigationProvider, useNavigation } from "./components/NavigationContext";
import { AuthProvider, useAuth, hasAccess } from "./components/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { Navbar } from "./components/Navbar";
import { Toaster } from "./components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";
import { useKeyboardNavigation } from "./components/useKeyboardNavigation";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "./components/ErrorBoundary";

// ============================================================================
// Lazy-loaded Components (Route-based code splitting)
// ============================================================================

// Dashboard Views - Lazy loaded for better initial bundle size
const AdminDashboard = lazy(() => import("./components/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const OwnerDashboard = lazy(() => import("./components/OwnerDashboard").then(m => ({ default: m.OwnerDashboard })));
const AccountantDashboard = lazy(() => import("./components/AccountantDashboard").then(m => ({ default: m.AccountantDashboard })));

// Main Views - Lazy loaded
const PropertiesView = lazy(() => import("./components/PropertiesView").then(m => ({ default: m.PropertiesView })));
const MaintenanceView = lazy(() => import("./components/MaintenanceView").then(m => ({ default: m.MaintenanceView })));
const FinancialReportsView = lazy(() => import("./components/FinancialReportsView").then(m => ({ default: m.FinancialReportsView })));
const AnalyticsView = lazy(() => import("./components/AnalyticsView").then(m => ({ default: m.AnalyticsView })));
const ClientsView = lazy(() => import("./components/ClientsView").then(m => ({ default: m.ClientsView })));
const EnhancedUserManagementView = lazy(() => import("./components/EnhancedUserManagementView").then(m => ({ default: m.EnhancedUserManagementView })));
const SettingsView = lazy(() => import("./components/SettingsView").then(m => ({ default: m.SettingsView })));
const HelpView = lazy(() => import("./components/HelpView").then(m => ({ default: m.HelpView })));
const SecurityAuditDashboard = lazy(() => import("./components/SecurityAuditDashboard").then(m => ({ default: m.SecurityAuditDashboard })));
const DataFlowVisualizationView = lazy(() => import("./components/DataFlowVisualizationView").then(m => ({ default: m.DataFlowVisualizationView })));
const PerformanceMetricsDashboard = lazy(() => import("./components/PerformanceMetricsDashboard").then(m => ({ default: m.PerformanceMetricsDashboard })));

// Auth Pages - Lazy loaded
const LoginPage = lazy(() => import("./components/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("./components/RegisterPage").then(m => ({ default: m.RegisterPage })));

// Helper Components - Lazy loaded
const AIAssistant = lazy(() => import("./components/AIAssistant").then(m => ({ default: m.AIAssistant })));
const KeyboardShortcutsHelp = lazy(() => import("./components/KeyboardShortcutsHelp").then(m => ({ default: m.KeyboardShortcutsHelp })));
const ApiPerformanceMonitor = lazy(() => import("./components/ApiPerformanceMonitor").then(m => ({ default: m.ApiPerformanceMonitor })));

// ============================================================================
// Loading Fallback Component
// ============================================================================

function LoadingFallback({ fullScreen = false }: { fullScreen?: boolean }) {
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
}

// ============================================================================
// Main App Component
// ============================================================================

function AppContent() {
  const { activeView, navigate, previousView } = useNavigation();
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Enable keyboard navigation only when authenticated
  useKeyboardNavigation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [isRTL]);

  // Redirect to dashboard if user tries to access unauthorized view
  useEffect(() => {
    if (isAuthenticated && user && !hasAccess(user.role, activeView)) {
      navigate('dashboard');
    }
  }, [isAuthenticated, user, activeView, navigate]);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggleRTL = () => {
    setIsRTL(!isRTL);
  };

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <LoadingFallback fullScreen />;
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingFallback fullScreen />}>
        <AnimatePresence mode="wait">
          {authView === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoginPage onSwitchToRegister={() => setAuthView('register')} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster richColors position="top-right" />
      </Suspense>
    );
  }

  const renderView = () => {
    const viewProps = { onNavigate: navigate };
    
    // Helper function to render role-specific dashboard
    const renderDashboard = () => {
      switch (user?.role) {
        case 'admin':
          return <AdminDashboard />;
        case 'owner':
          return <OwnerDashboard />;
        case 'accountant':
          return <AccountantDashboard />;
        default:
          return <AdminDashboard />;
      }
    };
    
    // Check if user has access to the view
    if (!hasAccess(user?.role, activeView)) {
      return renderDashboard();
    }
    
    // Wrap each view in Suspense for lazy loading
    switch (activeView) {
      case 'dashboard':
        return <Suspense fallback={<LoadingFallback />}>{renderDashboard()}</Suspense>;
      case 'properties':
        return <Suspense fallback={<LoadingFallback />}><PropertiesView {...viewProps} /></Suspense>;
      case 'maintenance':
        return <Suspense fallback={<LoadingFallback />}><MaintenanceView {...viewProps} /></Suspense>;
      case 'financial-reports':
        return <Suspense fallback={<LoadingFallback />}><FinancialReportsView /></Suspense>;
      case 'clients':
        return <Suspense fallback={<LoadingFallback />}><ClientsView /></Suspense>;
      case 'users':
        return <Suspense fallback={<LoadingFallback />}><EnhancedUserManagementView /></Suspense>;
      case 'security-audit':
        return <Suspense fallback={<LoadingFallback />}><SecurityAuditDashboard /></Suspense>;
      case 'data-flow-diagram':
        return <Suspense fallback={<LoadingFallback />}><DataFlowVisualizationView /></Suspense>;
      case 'performance':
        return <Suspense fallback={<LoadingFallback />}><PerformanceMetricsDashboard /></Suspense>;
      case 'settings':
        return <Suspense fallback={<LoadingFallback />}><SettingsView /></Suspense>;
      case 'help':
        return <Suspense fallback={<LoadingFallback />}><HelpView /></Suspense>;
      default:
        return <Suspense fallback={<LoadingFallback />}>{renderDashboard()}</Suspense>;
    }
  };

  // Determine slide direction based on navigation
  const getSlideDirection = () => {
    const views = ['dashboard', 'properties', 'maintenance', 'financial-reports', 'clients', 'users', 'security-audit', 'data-flow-diagram', 'performance', 'settings', 'help'];
    const currentIndex = views.indexOf(activeView);
    const previousIndex = previousView ? views.indexOf(previousView) : -1;
    
    if (previousIndex === -1) return 'right';
    return currentIndex > previousIndex ? 'right' : 'left';
  };

  const slideDirection = getSlideDirection();
  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? -30 : 30,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar 
        isDarkMode={isDarkMode} 
        onToggleTheme={handleToggleTheme}
        isRTL={isRTL}
        onToggleRTL={handleToggleRTL}
      />
      
      <main className="md:ml-20 pt-14 md:pt-16 pb-20 md:pb-4 min-h-screen" role="main">
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={activeView}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              duration: 0.25,
              ease: [0.32, 0.72, 0, 1], // Custom easing for smooth feel
            }}
            className="p-3 md:p-8 no-horizontal-scroll"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <MobileNav />
      <Suspense fallback={null}>
        <AIAssistant />
        <KeyboardShortcutsHelp />
        <ApiPerformanceMonitor />
      </Suspense>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary level="page">
      <AuthProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
