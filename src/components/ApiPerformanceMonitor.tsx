import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Activity, TrendingUp, Database, Clock } from 'lucide-react';
import DataService from '../lib/DataService';

interface PerformanceStats {
  api: {
    totalRequests: number;
    successRate: number;
    cacheHitRate: number;
    averageResponseTime: number;
  } | null;
  cache: {
    size: number;
    keys: string[];
  };
}

export function ApiPerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
    if (isDev) {
      setIsVisible(true);
      
      // Update stats every 5 seconds
      const interval = setInterval(() => {
        const performanceStats = DataService.getPerformanceStats();
        setStats(performanceStats);
      }, 5000);

      // Initial load
      const performanceStats = DataService.getPerformanceStats();
      setStats(performanceStats);

      return () => clearInterval(interval);
    }
  }, []);

  if (!isVisible || !stats) return null;

  const getResponseTimeColor = (time: number) => {
    if (time < 200) return 'text-green-600';
    if (time < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCacheHitColor = (rate: number) => {
    if (rate > 70) return 'text-green-600';
    if (rate > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs">
      <Card className="p-4 shadow-lg bg-card/95 backdrop-blur-sm border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <h3 className="text-sm font-medium">API Performance</h3>
          <Badge variant="outline" className="ml-auto text-xs">
            DEV
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          {stats.api ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Requests</span>
                </div>
                <span className="font-medium">{stats.api.totalRequests}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Success Rate</span>
                </div>
                <span className="font-medium">{stats.api.successRate.toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Avg Response</span>
                </div>
                <span className={`font-medium ${getResponseTimeColor(stats.api.averageResponseTime)}`}>
                  {stats.api.averageResponseTime}ms
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Cache Hit Rate</span>
                </div>
                <span className={`font-medium ${getCacheHitColor(stats.api.cacheHitRate)}`}>
                  {stats.api.cacheHitRate.toFixed(1)}%
                </span>
              </div>

              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cached Items</span>
                  <span className="font-medium">{stats.cache.size}</span>
                </div>
              </div>

              {/* Performance tips */}
              {stats.api.averageResponseTime > 500 && (
                <div className="pt-2 mt-2 border-t border-yellow-500/20 bg-yellow-500/10 -mx-2 px-2 py-1 rounded">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    ⚠️ Slow responses detected. Consider optimizing queries.
                  </p>
                </div>
              )}

              {stats.api.cacheHitRate < 30 && stats.api.totalRequests > 10 && (
                <div className="pt-2 mt-2 border-t border-blue-500/20 bg-blue-500/10 -mx-2 px-2 py-1 rounded">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    💡 Low cache hit rate. Most requests are fetching fresh data.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No API requests yet</p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-border/50">
          <button
            onClick={() => {
              DataService.invalidateCache();
              console.log('🗑️ Cache cleared manually');
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear Cache
          </button>
        </div>
      </Card>
    </div>
  );
}
