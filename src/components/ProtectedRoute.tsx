import { ReactNode, useEffect } from 'react';
import { useAuth, hasAccess, UserRole } from './AuthContext';
import { useNavigation } from './NavigationContext';
import { Alert, AlertDescription } from './ui/alert';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredView: string;
  fallbackView?: string;
}

/**
 * ProtectedRoute component ensures that users can only access views they have permission for.
 * 
 * Features:
 * - Validates user role permissions before rendering content
 * - Redirects unauthorized users to dashboard or specified fallback
 * - Shows clear error message with navigation options
 * - Prevents direct URL access to unauthorized routes
 */
export function ProtectedRoute({ 
  children, 
  requiredView, 
  fallbackView = 'dashboard' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { navigate } = useNavigation();

  // Check access on mount and when dependencies change
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (!hasAccess(user.role, requiredView)) {
        console.warn(
          `🚫 Access denied: User with role "${user.role}" attempted to access "${requiredView}"`
        );
        
        // Redirect to fallback view after a brief delay to show error message
        const redirectTimer = setTimeout(() => {
          navigate(fallbackView);
        }, 2000);

        return () => clearTimeout(redirectTimer);
      }
    }
  }, [isLoading, isAuthenticated, user, requiredView, fallbackView, navigate]);

  // Show loading state
  if (isLoading) {
    return null; // Parent component handles loading
  }

  // User is not authenticated - shouldn't reach here but handle gracefully
  if (!isAuthenticated || !user) {
    return null; // AuthProvider handles redirect to login
  }

  // User doesn't have access to this view
  if (!hasAccess(user.role, requiredView)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="rounded-[20px]">
            <ShieldX className="h-5 w-5" />
            <AlertDescription className="mt-2">
              <div className="space-y-3">
                <div>
                  <p className="font-medium mb-1">Access Denied</p>
                  <p className="text-sm opacity-90">
                    Your role ({user.role}) doesn't have permission to access this page.
                  </p>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs opacity-75 mb-2">
                    Redirecting to dashboard in 2 seconds...
                  </p>
                  <Button
                    onClick={() => navigate(fallbackView)}
                    variant="outline"
                    size="sm"
                    className="rounded-[12px]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go to Dashboard Now
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </motion.div>
    );
  }

  // User has access - render protected content
  return <>{children}</>;
}
