import { useEffect } from 'react';
import { useNavigation } from './NavigationContext';

const navOrder = [
  'dashboard',
  'properties',
  'maintenance',
  'financial-reports',
  'analytics',
  'clients',
  'users',
  'settings',
  'help'
];

export function useKeyboardNavigation() {
  const { activeView, navigate } = useNavigation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input or textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const currentIndex = navOrder.indexOf(activeView);

      // Navigate with arrow keys (Alt + Arrow)
      if (event.altKey) {
        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault();
            if (currentIndex < navOrder.length - 1) {
              navigate(navOrder[currentIndex + 1]);
            }
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault();
            if (currentIndex > 0) {
              navigate(navOrder[currentIndex - 1]);
            }
            break;
        }
      }

      // Quick navigation with number keys (Alt + 1-9)
      if (event.altKey && event.key >= '1' && event.key <= '9') {
        event.preventDefault();
        const index = parseInt(event.key) - 1;
        if (index < navOrder.length) {
          navigate(navOrder[index]);
        }
      }

      // Navigate to dashboard with Alt + H (Home)
      if (event.altKey && event.key === 'h') {
        event.preventDefault();
        navigate('dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, navigate]);
}
