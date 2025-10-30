import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { UserProfile } from '../lib/supabaseClient';

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        (payload) => {
          console.log('User profile change detected:', payload);
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateUser = async (id: string, updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      console.error('Error updating user:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update user' };
    }
  };

  const deleteUser = async (id: string) => {
    try {
      // Note: This will cascade delete the auth user due to ON DELETE CASCADE
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (err) {
      console.error('Error deleting user:', err);
      return { error: err instanceof Error ? err.message : 'Failed to delete user' };
    }
  };

  const getUserById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      console.error('Error fetching user:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch user' };
    }
  };

  const getUsersByRole = async (role: 'admin' | 'owner' | 'accountant') => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error fetching users by role:', err);
      return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch users' };
    }
  };

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    updateUser,
    deleteUser,
    getUserById,
    getUsersByRole,
  };
}
