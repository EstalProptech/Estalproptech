import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Initialize Supabase client
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// Test connection
console.log('✅ Supabase client initialized:', supabaseUrl);
console.log('💡 Demo accounts available: admin@estal.com, accountant@estal.com, owner@estal.com');

// Database types
export interface Property {
  id: string;
  name: string;
  location: string;
  status: 'Rented' | 'Vacant' | 'Under Maintenance';
  rent: number;
  occupancy: number;
  owner_id: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialReport {
  id: string;
  month: string;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  roi: number;
  created_at: string;
}

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  property_name?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  technician: string;
  status: 'New' | 'In Progress' | 'Completed';
  cost: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'accountant';
  status: 'active' | 'inactive';
  avatar_url?: string;
  last_login: string;
  created_at: string;
}

export interface DashboardKPI {
  total_properties: number;
  monthly_revenue: number;
  total_expenses: number;
  active_tenants: number;
  pending_maintenance: number;
  occupancy_rate: number;
}
