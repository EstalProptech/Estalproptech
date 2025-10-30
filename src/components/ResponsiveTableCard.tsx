import { ReactNode } from 'react';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

interface ResponsiveTableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

/**
 * ResponsiveTableCard - A card component that replaces table rows on mobile
 * Features:
 * - Touch-optimized with minimum 44px touch targets
 * - Swipe gesture support
 * - Haptic feedback on interactions
 * - Smooth animations
 */
export function ResponsiveTableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = '',
}: ResponsiveTableCardProps) {
  const { ref, isSwiping } = useSwipeGesture<HTMLDivElement>({
    onSwipeLeft,
    onSwipeRight,
    threshold: 80,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isSwiping ? 0.98 : 1,
      }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="p-4 hover:shadow-md transition-shadow duration-200 touch-manipulation">
        {children}
      </Card>
    </motion.div>
  );
}

interface ResponsiveTableRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function ResponsiveTableRow({ label, value, className = '' }: ResponsiveTableRowProps) {
  return (
    <div className={`flex justify-between items-center py-2 min-h-[44px] ${className}`}>
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="font-medium text-right">{value}</div>
    </div>
  );
}
