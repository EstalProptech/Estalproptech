/**
 * Optimized Dashboard KPIs Hook
 * Uses caching, memoization, and smart data aggregation
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { kvCache } from '../utils/kvCache';
import { logKVError } from '../utils/kvErrorLogger';
import { aggregateByTimeRange, getCountByTimeRange, TimeRange } from '../utils/aggregateByTimeRange';

export interface DashboardKPI {
  totalProperties: number;
  activeMaintenanceRequests: number;
  totalRevenue: number;
  occupancyRate: number;
  trends: {
    properties: number;
    maintenance: number;
    revenue: number;
    occupancy: number;
  };
}

export interface PerformanceMetrics {
  fetchTime: number;
  parseTime: number;
  totalTime: number;
  cacheHit: boolean;
}

const CACHE_TTL = 2 * 60 * 1000; // 2 minutes
const CACHE_KEY_PREFIX = 'dashboard_kpi';

export function useDashboardKPIs() {
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  /**
   * Fetch KPIs with caching and performance monitoring
   */
  const fetchKPIs = useCallback(async (force = false) => {
    const startTime = performance.now();
    let fetchTime = 0;
    let parseTime = 0;
    let cacheHit = false;

    try {
      // Check cache first
      if (!force) {
        const cached = kvCache.get<DashboardKPI>(`${CACHE_KEY_PREFIX}:main`, CACHE_TTL);
        if (cached) {
          setKpis(cached);
          setLastUpdate(Date.now());
          cacheHit = true;
          
          const totalTime = performance.now() - startTime;
          setPerformance({
            fetchTime: 0,
            parseTime: 0,
            totalTime,
            cacheHit: true,
          });
          
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      setError(null);

      // Start fetch timer
      const fetchStartTime = performance.now();

      // Fetch data with optimized queries
      const [propertiesData, maintenanceData, financialData] = await Promise.all([
        fetchPropertiesKPI(),
        fetchMaintenanceKPI(),
        fetchFinancialKPI(),
      ]);

      fetchTime = performance.now() - fetchStartTime;

      // Start parse timer
      const parseStartTime = performance.now();

      // Aggregate and compute KPIs
      const kpiData: DashboardKPI = {
        totalProperties: propertiesData.total,
        activeMaintenanceRequests: maintenanceData.active,
        totalRevenue: financialData.total,
        occupancyRate: propertiesData.occupancyRate,
        trends: {
          properties: propertiesData.trend,
          maintenance: maintenanceData.trend,
          revenue: financialData.trend,
          occupancy: propertiesData.occupancyTrend,
        },
      };

      parseTime = performance.now() - parseStartTime;

      // Cache the result
      kvCache.set(`${CACHE_KEY_PREFIX}:main`, kpiData);
      kvCache.markSynced();

      setKpis(kpiData);
      setLastUpdate(Date.now());

      const totalTime = performance.now() - startTime;
      setPerformance({
        fetchTime,
        parseTime,
        totalTime,
        cacheHit: false,
      });

      // Log performance metrics
      console.log('📊 Dashboard KPI Performance:', {
        fetchTime: `${fetchTime.toFixed(2)}ms`,
        parseTime: `${parseTime.toFixed(2)}ms`,
        totalTime: `${totalTime.toFixed(2)}ms`,
        cacheHit,
      });

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch KPIs');
      setError(error);
      logKVError('fetch', error.message, 'useDashboardKPIs', err);

      // Try to use stale cache as fallback
      const staleCache = kvCache.get<DashboardKPI>(`${CACHE_KEY_PREFIX}:main`, Infinity);
      if (staleCache) {
        console.warn('Using stale cache due to fetch error');
        setKpis(staleCache);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch properties KPI
   */
  const fetchPropertiesKPI = async () => {
    try {
      const { data, error } = await supabase
        .from('kv_store_96250128')
        .select('key, value')
        .like('key', 'property:%')
        .limit(200);

      if (error) throw error;

      const properties = data?.map(item => ({
        id: item.key,
        ...item.value,
      })) || [];

      // Calculate occupancy
      const totalUnits = properties.reduce((sum, p) => sum + (p.units || 0), 0);
      const occupiedUnits = properties.reduce((sum, p) => sum + (p.occupied_units || 0), 0);
      const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

      return {
        total: properties.length,
        occupancyRate,
        trend: 5, // Would calculate from historical data
        occupancyTrend: 2,
      };
    } catch (err) {
      logKVError('fetch', 'Failed to fetch properties KPI', 'fetchPropertiesKPI', err);
      return { total: 0, occupancyRate: 0, trend: 0, occupancyTrend: 0 };
    }
  };

  /**
   * Fetch maintenance KPI
   */
  const fetchMaintenanceKPI = async () => {
    try {
      const { data, error } = await supabase
        .from('kv_store_96250128')
        .select('key, value')
        .like('key', 'maintenance:%')
        .limit(200);

      if (error) throw error;

      const requests = data?.map(item => ({
        id: item.key,
        ...item.value,
      })) || [];

      const active = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length;

      return {
        active,
        trend: -3, // Would calculate from historical data
      };
    } catch (err) {
      logKVError('fetch', 'Failed to fetch maintenance KPI', 'fetchMaintenanceKPI', err);
      return { active: 0, trend: 0 };
    }
  };

  /**
   * Fetch financial KPI
   */
  const fetchFinancialKPI = async () => {
    try {
      const { data, error } = await supabase
        .from('kv_store_96250128')
        .select('key, value')
        .like('key', 'transaction:%')
        .limit(200);

      if (error) throw error;

      const transactions = data?.map(item => ({
        id: item.key,
        ...item.value,
      })) || [];

      const total = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      return {
        total,
        trend: 8, // Would calculate from historical data
      };
    } catch (err) {
      logKVError('fetch', 'Failed to fetch financial KPI', 'fetchFinancialKPI', err);
      return { total: 0, trend: 0 };
    }
  };

  /**
   * Invalidate cache and force refresh
   */
  const refresh = useCallback(() => {
    kvCache.clearByPrefix(CACHE_KEY_PREFIX);
    return fetchKPIs(true);
  }, [fetchKPIs]);

  // Initial fetch
  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  // Memoized values
  const cacheAge = useMemo(() => {
    return kvCache.getAge(`${CACHE_KEY_PREFIX}:main`);
  }, [lastUpdate]);

  const isCacheFresh = useMemo(() => {
    return kvCache.has(`${CACHE_KEY_PREFIX}:main`, CACHE_TTL);
  }, [lastUpdate]);

  return {
    kpis,
    isLoading,
    error,
    performance,
    lastUpdate,
    cacheAge,
    isCacheFresh,
    refresh,
    refetch: fetchKPIs,
  };
}
