/**
 * Data Freshness Indicator
 * Shows cache status and data age in the dashboard
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Zap, Database, TrendingUp, AlertCircle } from 'lucide-react';
import { useCacheStats, useDataFreshness } from '../hooks/useKVCache';
import { kvErrorLogger } from '../utils/kvErrorLogger';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Badge } from './ui/badge';

interface DataFreshnessIndicatorProps {
  cacheKey?: string;
  className?: string;
  showDetailed?: boolean;
}

export function DataFreshnessIndicator({
  cacheKey,
  className = '',
  showDetailed = false,
}: DataFreshnessIndicatorProps) {
  const { age, isFresh, lastSync } = useDataFreshness(cacheKey);
  const cacheStats = useCacheStats();
  const [errorStats, setErrorStats] = useState(kvErrorLogger.getStats());
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Update error stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setErrorStats(kvErrorLogger.getStats());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Trigger pulse animation on data update
  useEffect(() => {
    if (isFresh) {
      setPulseAnimation(true);
      const timeout = setTimeout(() => setPulseAnimation(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [lastSync]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getFreshnessColor = () => {
    if (age === null || age < 60) return 'text-secondary';
    if (age < 120) return 'text-primary';
    if (age < 300) return 'text-yellow-600';
    return 'text-destructive';
  };

  const getFreshnessIcon = () => {
    if (age === null || age < 60) return <Zap className="w-3 h-3" />;
    if (age < 120) return <Clock className="w-3 h-3" />;
    return <AlertCircle className="w-3 h-3" />;
  };

  const hasHighErrorRate = errorStats.errorRate > 10;

  if (!showDetailed) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: pulseAnimation ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-[8px] bg-muted/50 hover:bg-muted transition-colors cursor-pointer ${className}`}
          >
            <span className={`${getFreshnessColor()} transition-colors`}>
              {getFreshnessIcon()}
            </span>
            <span className="text-xs text-muted-foreground">
              {age !== null ? formatTime(age) : 'Live'}
            </span>
          </motion.div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 rounded-[16px]" align="end">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Data Freshness</h4>
              <Badge variant={isFresh ? 'default' : 'secondary'} className="rounded-[6px]">
                {isFresh ? 'Fresh' : 'Cached'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Last Update</p>
                <p className="text-sm font-medium">
                  {age !== null ? formatTime(age) : 'Just now'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Last Sync</p>
                <p className="text-sm font-medium">{formatTime(lastSync)}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Cache Performance</p>
                <span className="text-xs font-medium text-primary">
                  {cacheStats.hitRate.toFixed(1)}% hit rate
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Database className="w-3 h-3" />
                <span>{cacheStats.size} items</span>
                <span>•</span>
                <span>{cacheStats.hits} hits</span>
                <span>•</span>
                <span>{cacheStats.misses} misses</span>
              </div>
            </div>

            {hasHighErrorRate && (
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-destructive">
                  <AlertCircle className="w-3 h-3" />
                  <span>High error rate: {errorStats.errorRate}%</span>
                </div>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  // Detailed view for dashboard header
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-4 py-2 bg-muted/30 rounded-[12px] ${className}`}
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{
            scale: pulseAnimation ? [1, 1.2, 1] : 1,
            opacity: pulseAnimation ? [1, 0.6, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
          className={getFreshnessColor()}
        >
          {getFreshnessIcon()}
        </motion.div>
        <div>
          <p className="text-xs text-muted-foreground">Data freshness</p>
          <p className="text-sm font-medium">
            {age !== null ? formatTime(age) : 'Live data'}
          </p>
        </div>
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Cache hit rate</p>
          <p className="text-sm font-medium text-primary">
            {cacheStats.hitRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <AnimatePresence>
        {hasHighErrorRate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">Error rate</p>
                <p className="text-sm font-medium text-destructive">
                  {errorStats.errorRate}%
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Compact freshness badge for inline use
 */
export function FreshnessBadge({ 
  age, 
  className = '' 
}: { 
  age: number | null; 
  className?: string; 
}) {
  if (age === null || age < 5) {
    return (
      <Badge variant="default" className={`rounded-[6px] ${className}`}>
        <Zap className="w-3 h-3 mr-1" />
        Live
      </Badge>
    );
  }

  if (age < 120) {
    return (
      <Badge variant="secondary" className={`rounded-[6px] ${className}`}>
        <Clock className="w-3 h-3 mr-1" />
        Fresh
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`rounded-[6px] ${className}`}>
      <Clock className="w-3 h-3 mr-1" />
      Cached
    </Badge>
  );
}
