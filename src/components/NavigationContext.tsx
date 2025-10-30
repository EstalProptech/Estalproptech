import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface NavigationContextType {
  activeView: string;
  navigate: (view: string) => void;
  previousView: string | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const STORAGE_KEY = 'estal_lastPage';
const DEFAULT_VIEW = 'dashboard';

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [activeView, setActiveView] = useState<string>(() => {
    // Try to restore last visited page from localStorage
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem(STORAGE_KEY);
      return savedView || DEFAULT_VIEW;
    }
    return DEFAULT_VIEW;
  });
  
  const [previousView, setPreviousView] = useState<string | null>(null);

  const navigate = (view: string) => {
    setPreviousView(activeView);
    setActiveView(view);
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, view);
    }
  };

  // Add haptic feedback for touch devices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10); // Subtle haptic feedback on navigation
    }
  }, [activeView]);

  const value: NavigationContextType = {
    activeView,
    navigate,
    previousView,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
