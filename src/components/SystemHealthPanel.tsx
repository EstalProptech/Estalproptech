/**
 * System Health Panel - Floating widget showing real-time performance
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Database, 
  Zap, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { TelemetryMetrics } from '../hooks/useTelemetryData';
import { 
  getHealthColor, 
  getHealthEmoji, 
  getLatencyColor, 
  getCacheHitRateColor 
} from '../hooks/useTelemetryData';

interface SystemHealthPanelProps {
  metrics: TelemetryMetrics | null;
  history: TelemetryMetrics[];
  healthScore: 'healthy' | 'warning' | 'critical';
  lastUpdateTime: Date | null;
  isLive: boolean;
}

export function SystemHealthPanel({
  metrics,
  history,
  healthScore,
  lastUpdateTime,
  isLive,
}: SystemHealthPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!metrics) {
    return null;
  }

  // Calculate trends
  const getTrend = (current: number, historical: number[]) => {
    if (historical.length < 2) return 'stable';
    const previous = historical[historical.length - 2];
    if (current > previous * 1.1) return 'up';
    if (current < previous * 0.9) return 'down';
    return 'stable';
  };

  const latencyTrend = getTrend(
    metrics.fetchLatency,
    history.map(h => h.fetchLatency)
  );
  
  const cacheRateTrend = getTrend(
    metrics.cacheHitRate,
    history.map(h => h.cacheHitRate)
  );

  // Compact badge view
  if (isCollapsed) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center backdrop-blur-sm border-2 transition-all hover:scale-110"
          style={{ 
            backgroundColor: `${getHealthColor(healthScore)}20`,
            borderColor: getHealthColor(healthScore),
          }}
        >
          <span className="text-2xl">{getHealthEmoji(healthScore)}</span>
          
          {/* Pulse animation for live status */}
          {isLive && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ borderColor: getHealthColor(healthScore) }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card className="w-80 rounded-[20px] shadow-2xl border-2 backdrop-blur-sm bg-background/95">
        {/* Header */}
        <div 
          className="p-4 border-b border-border flex items-center justify-between"
          style={{ borderTopColor: getHealthColor(healthScore) }}
        >
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">System Health</h3>
            <Badge 
              variant="default" 
              className="rounded-[6px] text-xs"
              style={{ backgroundColor: getHealthColor(healthScore) }}
            >
              {getHealthEmoji(healthScore)} {healthScore.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              className="h-8 w-8 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Fetch Latency */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Fetch Latency</span>
                    </div>
                    {latencyTrend === 'up' && <TrendingUp className="w-3 h-3 text-red-500" />}
                    {latencyTrend === 'down' && <TrendingDown className="w-3 h-3 text-green-500" />}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: getLatencyColor(metrics.fetchLatency) }}
                    >
                      {metrics.fetchLatency}
                    </span>
                    <span className="text-sm text-muted-foreground">ms</span>
                  </div>
                  {/* Mini sparkline */}
                  <Sparkline 
                    data={history.map(h => h.fetchLatency)} 
                    color={getLatencyColor(metrics.fetchLatency)}
                    height={30}
                  />
                </div>

                {/* Cache Hit Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Cache Hit Rate</span>
                    </div>
                    {cacheRateTrend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                    {cacheRateTrend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: getCacheHitRateColor(metrics.cacheHitRate) }}
                    >
                      {metrics.cacheHitRate}
                    </span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  {/* Mini sparkline */}
                  <Sparkline 
                    data={history.map(h => h.cacheHitRate)} 
                    color={getCacheHitRateColor(metrics.cacheHitRate)}
                    height={30}
                  />
                </div>

                {/* Error Rate */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Error Rate</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span 
                      className={`text-2xl font-bold ${
                        metrics.errorRate > 2 ? 'text-red-500' : 
                        metrics.errorRate > 1 ? 'text-amber-500' : 
                        'text-green-500'
                      }`}
                    >
                      {metrics.errorRate}
                    </span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.errorRate * 20}%` }}
                      style={{
                        backgroundColor: metrics.errorRate > 2 ? '#EF4444' : 
                          metrics.errorRate > 1 ? '#F59E0B' : '#10B981',
                      }}
                    />
                  </div>
                </div>

                {/* Data Updates */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Data Updates</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {metrics.dataUpdates}
                    </span>
                    <span className="text-sm text-muted-foreground">/interval</span>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Connection</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        metrics.subscriptionHealth ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {metrics.subscriptionHealth && (
                        <motion.div
                          className="w-2 h-2 rounded-full bg-green-500"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}
                    </div>
                    <span className="text-xs font-medium">
                      {metrics.subscriptionHealth ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>

                {/* Last Update */}
                {lastUpdateTime && (
                  <div className="pt-2 text-center">
                    <span className="text-xs text-muted-foreground">
                      Last update: {lastUpdateTime.toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Indicator */}
        {isLive && (
          <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center justify-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <span className="text-xs font-medium text-green-600">Live Telemetry Active</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

/**
 * Mini sparkline chart component
 */
function Sparkline({ 
  data, 
  color, 
  height = 30 
}: { 
  data: number[]; 
  color: string; 
  height?: number;
}) {
  if (data.length < 2) {
    return <div style={{ height }} className="bg-muted/20 rounded" />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} className="rounded overflow-hidden">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <polyline
        points={`0,${height} ${points} 100,${height}`}
        fill={color}
        opacity="0.1"
      />
    </svg>
  );
}
