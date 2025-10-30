import { useState, useEffect } from 'react';
import type { MaintenanceRequest } from '../lib/supabaseClient';

// Mock data for maintenance requests
const MOCK_REQUESTS: MaintenanceRequest[] = [];

export function useMaintenanceRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use mock data for now
      setRequests(MOCK_REQUESTS);
    } catch (err) {
      console.error('Error fetching maintenance requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch maintenance requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const addRequest = async (request: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at' | 'property_name'>) => {
    try {
      // Mock implementation
      const newRequest = {
        ...request,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        property_name: 'Property Name', // Mock
      };

      setRequests(prev => [newRequest as MaintenanceRequest, ...prev]);
      return { data: newRequest, error: null };
    } catch (err) {
      console.error('Error adding maintenance request:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add maintenance request' };
    }
  };

  const updateRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    try {
      // Mock implementation
      setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r));
      const updated = requests.find(r => r.id === id);
      return { data: updated || null, error: null };
    } catch (err) {
      console.error('Error updating maintenance request:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update maintenance request' };
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      // Mock implementation
      setRequests(prev => prev.filter(r => r.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting maintenance request:', err);
      return { error: err instanceof Error ? err.message : 'Failed to delete maintenance request' };
    }
  };

  return {
    requests,
    isLoading,
    error,
    refetch: fetchRequests,
    addRequest,
    updateRequest,
    deleteRequest,
  };
}
