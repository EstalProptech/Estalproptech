/**
 * Estal PropTech - Real-time Telemetry Hook
 * Polls system metrics and provides live performance data
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface TelemetryMetrics {
  fetchLatency: number; // milliseconds
  cacheHitRate: number; // percentage 0-100
  errorRate: number; // percentage 0-100
  subscriptionHealth: boolean;
  dataUpdates: number; // updates per interval
  timestamp: number;
}

export interface TelemetryHistory {
  metrics: TelemetryMetrics[];
  maxPoints: number;
}

interface UseTelemetryDataOptions {
  enabled?: boolean;
  pollingInterval?: number; // milliseconds
  historySize?: number; // number of data points to keep
}

interface UseTelemetryDataResult {
  metrics: TelemetryMetrics | null;
  history: TelemetryMetrics[];
  isLive: boolean;
  isPaused: boolean;
  togglePause: () => void;
  resetHistory: () => void;
  healthScore: 'healthy' | 'warning' | 'critical';
  lastUpdateTime: Date | null;
}

/**
 * Simulates system metrics based on realistic patterns
 * In production, this would call an actual API endpoint
 */
function generateRealisticMetrics(previousMetrics: TelemetryMetrics | null): TelemetryMetrics {
  const now = Date.now();
  
  // Base values with some randomness for realism
  const baseLatency = 150;
  const baseCacheHitRate = 90;
  const baseErrorRate = 0.5;
  
  // Add natural variance
  const latencyVariance = (Math.random() - 0.5) * 100; // ±50ms
  const cacheVariance = (Math.random() - 0.5) * 10; // ±5%
  const errorVariance = (Math.random() - 0.5) * 2; // ±1%
  
  // Occasionally simulate spikes (10% chance)
  const hasSpike = Math.random() < 0.1;
  const spikeMultiplier = hasSpike ? 2.5 : 1;
  
  // Calculate metrics
  const fetchLatency = Math.max(50, Math.min(1000, 
    baseLatency + latencyVariance * spikeMultiplier
  ));
  
  const cacheHitRate = Math.max(60, Math.min(99, 
    baseCacheHitRate + cacheVariance
  ));
  
  const errorRate = Math.max(0, Math.min(5, 
    baseErrorRate + errorVariance * spikeMultiplier
  ));
  
  // Subscription health (98% uptime)
  const subscriptionHealth = Math.random() > 0.02;
  
  // Data updates (variable activity)
  const dataUpdates = Math.floor(Math.random() * 50) + 10;
  
  return {
    fetchLatency: Math.round(fetchLatency),
    cacheHitRate: Math.round(cacheHitRate * 10) / 10,
    errorRate: Math.round(errorRate * 10) / 10,
    subscriptionHealth,
    dataUpdates,
    timestamp: now,
  };
}

/**
 * Calculate overall health score based on metrics
 */
function calculateHealthScore(metrics: TelemetryMetrics): 'healthy' | 'warning' | 'critical' {
  // Critical conditions
  if (
    !metrics.subscriptionHealth ||
    metrics.errorRate > 3 ||
    metrics.fetchLatency > 500 ||
    metrics.cacheHitRate < 70
  ) {
    return 'critical';
  }
  
  // Warning conditions
  if (
    metrics.errorRate > 1 ||
    metrics.fetchLatency > 300 ||
    metrics.cacheHitRate < 85
  ) {
    return 'warning';
  }
  
  return 'healthy';
}

/**
 * Hook to manage real-time telemetry data
 */
export function useTelemetryData(options: UseTelemetryDataOptions = {}): UseTelemetryDataResult {
  const {
    enabled = true,
    pollingInterval = 5000, // 5 seconds
    historySize = 30,
  } = options;
  
  const [metrics, setMetrics] = useState<TelemetryMetrics | null>(null);
  const [history, setHistory] = useState<TelemetryMetrics[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch metrics function
  const fetchMetrics = useCallback(async () => {
    try {
      // In production, this would be:
      // const response = await fetch('/api/system-metrics');
      // const data = await response.json();
      
      // For now, generate realistic simulated data
      const newMetrics = generateRealisticMetrics(metrics);
      
      setMetrics(newMetrics);
      setLastUpdateTime(new Date());
      
      // Update history
      setHistory(prev => {
        const updated = [...prev, newMetrics];
        // Keep only the last N points
        return updated.slice(-historySize);
      });
      
      console.log('📊 Telemetry updated:', {
        latency: newMetrics.fetchLatency,
        hitRate: newMetrics.cacheHitRate,
        health: calculateHealthScore(newMetrics),
      });
      
    } catch (error) {
      console.error('❌ Error fetching telemetry data:', error);
    }
  }, [metrics, historySize]);
  
  // Start/stop polling
  useEffect(() => {
    if (!enabled || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    // Initial fetch
    fetchMetrics();
    
    // Set up polling
    intervalRef.current = setInterval(fetchMetrics, pollingInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, isPaused, pollingInterval, fetchMetrics]);
  
  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);
  
  // Reset history
  const resetHistory = useCallback(() => {
    setHistory([]);
  }, []);
  
  // Calculate health score
  const healthScore = metrics ? calculateHealthScore(metrics) : 'healthy';
  
  return {
    metrics,
    history,
    isLive: enabled && !isPaused && metrics !== null,
    isPaused,
    togglePause,
    resetHistory,
    healthScore,
    lastUpdateTime,
  };
}

/**
 * Get color for health status
 */
export function getHealthColor(health: 'healthy' | 'warning' | 'critical'): string {
  switch (health) {
    case 'healthy':
      return '#10B981'; // Green
    case 'warning':
      return '#F59E0B'; // Amber
    case 'critical':
      return '#EF4444'; // Red
  }
}

/**
 * Get emoji for health status
 */
export function getHealthEmoji(health: 'healthy' | 'warning' | 'critical'): string {
  switch (health) {
    case 'healthy':
      return '🟢';
    case 'warning':
      return '🟡';
    case 'critical':
      return '🔴';
  }
}

/**
 * Format latency with appropriate color coding
 */
export function getLatencyColor(latency: number): string {
  if (latency < 200) return '#10B981'; // Green
  if (latency < 400) return '#F59E0B'; // Amber
  return '#EF4444'; // Red
}

/**
 * Format cache hit rate with appropriate color coding
 */
export function getCacheHitRateColor(hitRate: number): string {
  if (hitRate >= 90) return '#10B981'; // Green
  if (hitRate >= 80) return '#F59E0B'; // Amber
  return '#EF4444'; // Red
}
