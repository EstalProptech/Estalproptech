/**
 * React Hook for KV Store Caching
 * Provides cache management with React integration
 */

import { useState, useEffect, useCallback } from 'react';
import { kvCache } from '../utils/kvCache';

export interface CacheHookOptions {
  ttl?: number; // Time to live in milliseconds
  refreshInterval?: number; // Auto refresh interval
  enableAutoRefresh?: boolean;
}

export function useKVCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheHookOptions = {}
) {
  const {
    ttl = 2 * 60 * 1000, // 2 minutes default
    refreshInterval = 5 * 60 * 1000, // 5 minutes default
    enableAutoRefresh = false,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  /**
   * Fetch data with caching
   */
  const fetchData = useCallback(async (force = false) => {
    // Check cache first
    if (!force) {
      const cached = kvCache.get<T>(key, ttl);
      if (cached) {
        setData(cached);
        setLastFetch(Date.now());
        return cached;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      
      // Cache the result
      kvCache.set(key, result);
      setData(result);
      setLastFetch(Date.now());
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch data');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, ttl]);

  /**
   * Invalidate cache and refetch
   */
  const invalidate = useCallback(() => {
    kvCache.clearByPrefix(key);
    return fetchData(true);
  }, [key, fetchData]);

  /**
   * Get cache age in seconds
   */
  const getCacheAge = useCallback(() => {
    return kvCache.getAge(key);
  }, [key]);

  /**
   * Check if cache is fresh
   */
  const isCacheFresh = useCallback(() => {
    return kvCache.has(key, ttl);
  }, [key, ttl]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh
  useEffect(() => {
    if (!enableAutoRefresh || !refreshInterval) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, fetchData]);

  return {
    data,
    isLoading,
    error,
    lastFetch,
    refetch: fetchData,
    invalidate,
    getCacheAge,
    isCacheFresh,
  };
}

/**
 * Hook for managing cache statistics
 */
export function useCacheStats() {
  const [stats, setStats] = useState(kvCache.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(kvCache.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return stats;
}

/**
 * Hook for data freshness indicator
 */
export function useDataFreshness(key?: string) {
  const [freshness, setFreshness] = useState({
    age: 0,
    isFresh: true,
    lastSync: kvCache.getTimeSinceSync(),
  });

  useEffect(() => {
    const updateFreshness = () => {
      const age = key ? kvCache.getAge(key) || 0 : 0;
      const lastSync = kvCache.getTimeSinceSync();
      
      setFreshness({
        age,
        isFresh: age < 120, // Fresh if less than 2 minutes
        lastSync,
      });
    };

    updateFreshness();
    const interval = setInterval(updateFreshness, 1000);

    return () => clearInterval(interval);
  }, [key]);

  return freshness;
}
