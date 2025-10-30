/**
 * Client-side KV Store Utility
 * 
 * This utility provides a simple interface to interact with the kv_store_96250128 table
 * from the frontend. It stores user profiles and other app data as key-value pairs.
 */

import { supabase } from '../../lib/supabaseClient';

const KV_TABLE = 'kv_store_96250128';

export interface KVValue {
  key: string;
  value: any;
}

/**
 * Get a single value by key
 */
export async function get(key: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from(KV_TABLE)
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      const errorMessage = error?.message || String(error);
      console.error('KV get error:', errorMessage);
      return null;
    }

    return data?.value || null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('KV get error:', errorMessage);
    return null;
  }
}

/**
 * Set a value by key
 */
export async function set(key: string, value: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(KV_TABLE)
      .upsert({
        key,
        value,
      });

    if (error) {
      const errorMessage = error?.message || String(error);
      console.error('KV set error:', errorMessage);
      return false;
    }
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('KV set error:', errorMessage);
    return false;
  }
}

/**
 * Delete a value by key
 */
export async function del(key: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(KV_TABLE)
      .delete()
      .eq('key', key);

    if (error) throw error;
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('KV delete error:', errorMessage);
    return false;
  }
}

/**
 * Get multiple values by keys
 */
export async function mget(keys: string[]): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from(KV_TABLE)
      .select('key, value')
      .in('key', keys);

    if (error) throw error;

    // Return values in the same order as keys
    return keys.map(key => {
      const item = data?.find(d => d.key === key);
      return item?.value || null;
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('KV mget error:', errorMessage);
    return keys.map(() => null);
  }
}

/**
 * Set multiple values
 */
export async function mset(entries: Array<{ key: string; value: any }>): Promise<boolean> {
  try {
    const records = entries.map(({ key, value }) => ({
      key,
      value,
    }));

    const { error } = await supabase
      .from(KV_TABLE)
      .upsert(records);

    if (error) {
      const errorMessage = error?.message || String(error);
      console.error('KV mset error:', errorMessage);
      return false;
    }
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('KV mset error:', errorMessage);
    return false;
  }
}

/**
 * Get all values with keys matching a prefix
 */
export async function getByPrefix(prefix: string): Promise<KVValue[]> {
  try {
    const { data, error } = await supabase
      .from(KV_TABLE)
      .select('*')
      .like('key', `${prefix}%`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('KV getByPrefix error:', errorMessage);
    return [];
  }
}

/**
 * User profile helpers - using server-side endpoints
 */
export const userProfiles = {
  /**
   * Get a user profile by ID
   */
  async get(userId: string) {
    try {
      // Skip for demo users - they don't have stored profiles
      if (userId.startsWith('demo-')) {
        return null;
      }
      
      // Hardcode credentials to avoid any import issues
      const projectId = 'hdhncpmsxgqjpdpahaxh';
      const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkaG5jcG1zeGdxanBkcGFoYXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODM0ODIsImV4cCI6MjA3NjY1OTQ4Mn0.uKPiLWMohauKtdtizUs5Riin3UTdBuyFmovY2EnZBHY';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/profile/${userId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        // Silently return null for failed requests
        return null;
      }

      const result = await response.json();
      return result.profile;
    } catch (error) {
      // Silently return null for any errors - avoids console noise
      return null;
    }
  },

  /**
   * Set a user profile
   */
  async set(userId: string, profile: any) {
    try {
      // Skip for demo users - they don't have stored profiles
      if (userId.startsWith('demo-')) {
        return true;
      }
      
      // Hardcode credentials to avoid any import issues
      const projectId = 'hdhncpmsxgqjpdpahaxh';
      const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkaG5jcG1zeGdxanBkcGFoYXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODM0ODIsImV4cCI6MjA3NjY1OTQ4Mn0.uKPiLWMohauKtdtizUs5Riin3UTdBuyFmovY2EnZBHY';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/profile/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(profile),
        }
      );

      if (!response.ok) {
        // Silently return false for failed requests
        return false;
      }

      return true;
    } catch (error) {
      // Silently return false for any errors - avoids console noise
      return false;
    }
  },

  /**
   * Get all user profiles
   */
  async getAll() {
    try {
      // Hardcode credentials to avoid any import issues
      const projectId = 'hdhncpmsxgqjpdpahaxh';
      const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkaG5jcG1zeGdxanBkcGFoYXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODM0ODIsImV4cCI6MjA3NjY1OTQ4Mn0.uKPiLWMohauKtdtizUs5Riin3UTdBuyFmovY2EnZBHY';
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/profiles`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        // Silently return empty array for failed requests
        return [];
      }

      const result = await response.json();
      return result.profiles || [];
    } catch (error) {
      // Silently return empty array for any errors - avoids console noise
      return [];
    }
  },

  /**
   * Update user's last login time
   */
  async updateLastLogin(userId: string) {
    // Skip for demo users
    if (userId.startsWith('demo-')) {
      return true;
    }
    
    const profile = await this.get(userId);
    if (profile) {
      profile.last_login = new Date().toISOString();
      return await this.set(userId, profile);
    }
    return false;
  },
};
