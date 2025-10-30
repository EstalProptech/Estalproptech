/**
 * Performance Monitoring Component
 * Displays real-time performance metrics for KV operations
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap, Database, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

export interface PerformanceMetrics {
  fetchTime: number;
  parseTime: number;
  totalTime: number;
  cacheHit: boolean;
}

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics | null;
  targetMetrics?: {
    fetch: number;
    parse: number;
    total: number;
  };
  className?: string;
}

export function PerformanceMonitor({
  metrics,
  targetMetrics = {
    fetch: 300,
    parse: 100,
    total: 400,
  },
  className = '',
}: PerformanceMonitorProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!metrics) {
    return null;
  }

  const getPerformanceStatus = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage <= 50) return { color: 'text-secondary', status: 'Excellent' };
    if (percentage <= 80) return { color: 'text-primary', status: 'Good' };
    if (percentage <= 100) return { color: 'text-yellow-600', status: 'Fair' };
    return { color: 'text-destructive', status: 'Slow' };
  };

  const totalStatus = getPerformanceStatus(metrics.totalTime, targetMetrics.total);
  const fetchStatus = getPerformanceStatus(metrics.fetchTime, targetMetrics.fetch);
  const parseStatus = getPerformanceStatus(metrics.parseTime, targetMetrics.parse);

  return (
    <Card className={`rounded-[20px] border-border ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Performance Metrics
          </CardTitle>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {metrics.cacheHit ? (
              <Badge variant="default" className="rounded-[8px]">
                <Zap className="w-3 h-3 mr-1" />
                Cache Hit
              </Badge>
            ) : (
              <Badge variant="secondary" className="rounded-[8px]">
                <Database className="w-3 h-3 mr-1" />
                Fresh Fetch
              </Badge>
            )}
            <div>
              <p className="text-sm font-medium">
                {metrics.totalTime.toFixed(2)} ms
              </p>
              <p className="text-xs text-muted-foreground">
                Total load time
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${totalStatus.color}`}>
            {totalStatus.status === 'Excellent' || totalStatus.status === 'Good' ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{totalStatus.status}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Performance Score</span>
            <span className={totalStatus.color}>
              {Math.max(0, 100 - (metrics.totalTime / targetMetrics.total) * 100).toFixed(0)}%
            </span>
          </div>
          <Progress
            value={Math.max(0, 100 - (metrics.totalTime / targetMetrics.total) * 100)}
            className="h-2"
          />
        </div>

        {/* Detailed Breakdown */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 pt-3 border-t border-border overflow-hidden"
            >
              {/* Fetch Time */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm">Data Fetch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${fetchStatus.color}`}>
                      {metrics.fetchTime.toFixed(2)} ms
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {targetMetrics.fetch}ms
                    </span>
                  </div>
                </div>
                <Progress
                  value={Math.min(100, (metrics.fetchTime / targetMetrics.fetch) * 100)}
                  className="h-1"
                />
              </div>

              {/* Parse Time */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm">JSON Parsing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${parseStatus.color}`}>
                      {metrics.parseTime.toFixed(2)} ms
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {targetMetrics.parse}ms
                    </span>
                  </div>
                </div>
                <Progress
                  value={Math.min(100, (metrics.parseTime / targetMetrics.parse) * 100)}
                  className="h-1"
                />
              </div>

              {/* Target Summary */}
              <div className="pt-2 grid grid-cols-3 gap-3 text-center">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Target</p>
                  <p className={`text-sm font-medium ${
                    metrics.totalTime <= targetMetrics.total ? 'text-secondary' : 'text-destructive'
                  }`}>
                    {metrics.totalTime <= targetMetrics.total ? '✓ Met' : '✗ Exceeded'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Overhead</p>
                  <p className="text-sm font-medium">
                    {((metrics.parseTime / metrics.totalTime) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Network</p>
                  <p className="text-sm font-medium">
                    {((metrics.fetchTime / metrics.totalTime) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

/**
 * Compact performance badge
 */
export function PerformanceBadge({ 
  metrics 
}: { 
  metrics: PerformanceMetrics | null 
}) {
  if (!metrics) return null;

  const isGood = metrics.totalTime < 400;

  return (
    <Badge
      variant={isGood ? 'default' : 'secondary'}
      className="rounded-[6px]"
    >
      <Activity className="w-3 h-3 mr-1" />
      {metrics.totalTime.toFixed(0)}ms
    </Badge>
  );
}
