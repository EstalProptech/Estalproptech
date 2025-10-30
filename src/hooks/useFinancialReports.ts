import { useState, useEffect } from 'react';
import type { FinancialReport } from '../lib/supabaseClient';

// Mock data for financial reports
const MOCK_REPORTS: FinancialReport[] = [];

export function useFinancialReports() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use mock data for now
      setReports(MOCK_REPORTS);
    } catch (err) {
      console.error('Error fetching financial reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch financial reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const addReport = async (report: Omit<FinancialReport, 'id' | 'profit' | 'created_at' | 'updated_at'>) => {
    try {
      // Mock implementation
      const newReport = {
        ...report,
        id: Math.random().toString(36).substr(2, 9),
        profit: (report.revenue || 0) - (report.expenses || 0),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setReports(prev => [newReport as FinancialReport, ...prev]);
      return { data: newReport, error: null };
    } catch (err) {
      console.error('Error adding financial report:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add financial report' };
    }
  };

  const updateReport = async (id: string, updates: Partial<FinancialReport>) => {
    try {
      // Mock implementation
      setReports(prev => prev.map(r => r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r));
      const updated = reports.find(r => r.id === id);
      return { data: updated || null, error: null };
    } catch (err) {
      console.error('Error updating financial report:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update financial report' };
    }
  };

  const deleteReport = async (id: string) => {
    try {
      // Mock implementation
      setReports(prev => prev.filter(r => r.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting financial report:', err);
      return { error: err instanceof Error ? err.message : 'Failed to delete financial report' };
    }
  };

  return {
    reports,
    isLoading,
    error,
    refetch: fetchReports,
    addReport,
    updateReport,
    deleteReport,
  };
}
