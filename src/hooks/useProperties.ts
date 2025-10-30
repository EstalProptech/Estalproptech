import { useState, useEffect } from 'react';
import type { Property } from '../lib/supabaseClient';

// Mock data for properties
const MOCK_PROPERTIES: Property[] = [];

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use mock data for now
      setProperties(MOCK_PROPERTIES);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Mock implementation - would use KV store in production
      const newProperty = {
        ...property,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setProperties(prev => [newProperty as Property, ...prev]);
      return { data: newProperty, error: null };
    } catch (err) {
      console.error('Error adding property:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add property' };
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      // Mock implementation
      setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
      const updated = properties.find(p => p.id === id);
      return { data: updated || null, error: null };
    } catch (err) {
      console.error('Error updating property:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update property' };
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      // Mock implementation
      setProperties(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting property:', err);
      return { error: err instanceof Error ? err.message : 'Failed to delete property' };
    }
  };

  return {
    properties,
    isLoading,
    error,
    refetch: fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
  };
}
