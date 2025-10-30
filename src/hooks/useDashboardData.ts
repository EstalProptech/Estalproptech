import { useState, useEffect } from 'react';
import type { DashboardKPI } from '../lib/supabaseClient';

// Mock KPI data
const MOCK_KPIS: DashboardKPI = {
  total_properties: 0,
  total_revenue: 0,
  total_expenses: 0,
  occupancy_rate: 0,
  pending_maintenance: 0,
};

export function useDashboardKPIs() {
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKPIs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use mock data for now
      setKpis(MOCK_KPIS);
    } catch (err) {
      console.error('Error fetching dashboard KPIs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  return { kpis, isLoading, error, refetch: fetchKPIs };
}
