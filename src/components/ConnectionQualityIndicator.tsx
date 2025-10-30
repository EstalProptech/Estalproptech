import { useConnectionQuality } from '../hooks/useConnectionQuality';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';

/**
 * ConnectionQualityIndicator
 * 
 * Displays the current network connection quality to the user.
 * Shows different icons and messages based on connection speed.
 * Useful for managing user expectations on slower networks.
 */
export function ConnectionQualityIndicator() {
  const { quality, effectiveType, saveData } = useConnectionQuality();

  // Don't show indicator if connection is fast
  if (quality === 'fast' && !saveData) {
    return null;
  }

  const getIndicatorConfig = () => {
    switch (quality) {
      case 'offline':
        return {
          icon: <WifiOff className="w-3 h-3" />,
          label: 'Offline',
          color: 'bg-destructive',
          textColor: 'text-destructive-foreground',
        };
      case 'slow':
        return {
          icon: <Signal className="w-3 h-3" />,
          label: `Slow Connection${effectiveType ? ` (${effectiveType})` : ''}`,
          color: 'bg-amber-500',
          textColor: 'text-white',
        };
      case 'medium':
        return {
          icon: <Wifi className="w-3 h-3" />,
          label: `Limited Connection${effectiveType ? ` (${effectiveType})` : ''}`,
          color: 'bg-yellow-500',
          textColor: 'text-white',
        };
      default:
        if (saveData) {
          return {
            icon: <Signal className="w-3 h-3" />,
            label: 'Data Saver Mode',
            color: 'bg-blue-500',
            textColor: 'text-white',
          };
        }
        return null;
    }
  };

  const config = getIndicatorConfig();

  if (!config) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-16 md:top-20 left-1/2 -translate-x-1/2 z-50"
      >
        <Badge
          className={`${config.color} ${config.textColor} shadow-lg rounded-full px-3 py-1.5 flex items-center gap-2`}
        >
          {config.icon}
          <span className="text-xs font-medium">{config.label}</span>
        </Badge>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Lightweight version for embedding in other components
 */
export function ConnectionQualityBadge() {
  const { quality } = useConnectionQuality();

  if (quality === 'fast') return null;

  const colors = {
    offline: 'bg-destructive',
    slow: 'bg-amber-500',
    medium: 'bg-yellow-500',
    fast: 'bg-green-500',
  };

  return (
    <div className={`w-2 h-2 rounded-full ${colors[quality]} animate-pulse`} />
  );
}
