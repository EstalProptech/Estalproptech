/**
 * ESTAL Platform - Unified Data Access Layer
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Request/response caching
 * - Performance monitoring
 * - Error handling and logging
 * - Request debouncing
 * - Pagination support
 * - Server-side validation integration
 */

import { supabase } from './supabaseClient';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
  responseTime?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 300,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const STALE_WHILE_REVALIDATE_MS = 10 * 60 * 1000; // 10 minutes

// ============================================================================
// In-Memory Cache
// ============================================================================

class RequestCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttl: number = CACHE_TTL_MS): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    });
  }

  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;

    const now = Date.now();
    const age = now - entry.timestamp;
    return age > CACHE_TTL_MS;
  }

  invalidate(keyPattern?: string): void {
    if (!keyPattern) {
      this.cache.clear();
      return;
    }

    // Invalidate keys matching pattern
    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

const cache = new RequestCache();

// ============================================================================
// Performance Monitoring
// ============================================================================

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  duration: number;
  success: boolean;
  cached: boolean;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000;

  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow requests (> 500ms)
    if (metric.duration > 500) {
      console.warn(`🐌 Slow API request: ${metric.endpoint} took ${metric.duration}ms`);
    }
  }

  getStats() {
    const total = this.metrics.length;
    if (total === 0) return null;

    const successful = this.metrics.filter(m => m.success).length;
    const cached = this.metrics.filter(m => m.cached).length;
    const avgDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0) / total;

    return {
      totalRequests: total,
      successRate: (successful / total) * 100,
      cacheHitRate: (cached / total) * 100,
      averageResponseTime: Math.round(avgDuration),
    };
  }

  getRecentMetrics(count: number = 10): PerformanceMetrics[] {
    return this.metrics.slice(-count);
  }
}

const performanceMonitor = new PerformanceMonitor();

// ============================================================================
// API Request Logger
// ============================================================================

class ApiLogger {
  private isProduction = typeof import.meta !== 'undefined' && import.meta.env?.PROD;

  log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [DataService]`;

    switch (level) {
      case 'info':
        if (!this.isProduction) {
          console.log(`${prefix} ℹ️`, message, data || '');
        }
        break;
      case 'warn':
        console.warn(`${prefix} ⚠️`, message, data || '');
        break;
      case 'error':
        console.error(`${prefix} ❌`, message, data || '');
        break;
    }
  }

  logRequest(endpoint: string, method: string, params?: any): void {
    this.log('info', `${method} ${endpoint}`, params);
  }

  logResponse(endpoint: string, duration: number, cached: boolean): void {
    const cacheStatus = cached ? '💾 cached' : '🌐 fresh';
    this.log('info', `${endpoint} completed in ${duration}ms (${cacheStatus})`);
  }

  logError(endpoint: string, error: any, attempt?: number): void {
    const attemptInfo = attempt ? ` (attempt ${attempt})` : '';
    this.log('error', `${endpoint} failed${attemptInfo}`, error);
  }
}

const logger = new ApiLogger();

// ============================================================================
// Retry Logic with Exponential Backoff
// ============================================================================

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  endpoint: string = 'unknown'
): Promise<T> {
  let lastError: any;
  let delay = config.initialDelayMs;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === config.maxRetries) {
        logger.logError(endpoint, error, attempt);
        break;
      }

      logger.log('warn', `${endpoint} failed, retrying in ${delay}ms (attempt ${attempt}/${config.maxRetries})`);
      
      await sleep(delay);
      
      // Exponential backoff with jitter
      delay = Math.min(
        delay * config.backoffMultiplier + Math.random() * 100,
        config.maxDelayMs
      );
    }
  }

  throw lastError;
}

// ============================================================================
// Debounce Utility
// ============================================================================

const debounceTimers = new Map<string, NodeJS.Timeout>();

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  key: string,
  delayMs: number = 300
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      const existingTimer = debounceTimers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(async () => {
        debounceTimers.delete(key);
        const result = await fn(...args);
        resolve(result);
      }, delayMs);

      debounceTimers.set(key, timer);
    });
  };
}

// ============================================================================
// Data Service Class
// ============================================================================

export class DataService {
  /**
   * Generic API request with retry, caching, and monitoring
   */
  static async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      cache?: boolean;
      cacheKey?: string;
      cacheTTL?: number;
      retry?: boolean;
      staleWhileRevalidate?: boolean;
    } = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      cache: enableCache = method === 'GET',
      cacheKey = `${method}:${endpoint}:${JSON.stringify(body || {})}`,
      cacheTTL = CACHE_TTL_MS,
      retry = true,
      staleWhileRevalidate = true,
    } = options;

    const startTime = performance.now();
    
    logger.logRequest(endpoint, method, body);

    // Check cache for GET requests
    if (enableCache && method === 'GET') {
      const cachedData = cache.get<T>(cacheKey);
      if (cachedData) {
        const duration = Math.round(performance.now() - startTime);
        logger.logResponse(endpoint, duration, true);
        
        performanceMonitor.recordMetric({
          endpoint,
          method,
          duration,
          success: true,
          cached: true,
          timestamp: Date.now(),
        });

        // Stale-while-revalidate: return cached data but refresh in background
        if (staleWhileRevalidate && cache.isStale(cacheKey)) {
          this.request<T>(endpoint, { ...options, cache: false }).then(response => {
            if (response.success && response.data) {
              cache.set(cacheKey, response.data, cacheTTL);
            }
          });
        }

        return {
          success: true,
          data: cachedData,
          cached: true,
          responseTime: duration,
        };
      }
    }

    // Make the actual request
    const makeRequest = async (): Promise<ApiResponse<T>> => {
      try {
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-96250128${endpoint}`;
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        const duration = Math.round(performance.now() - startTime);

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: T = await response.json();

        logger.logResponse(endpoint, duration, false);

        performanceMonitor.recordMetric({
          endpoint,
          method,
          duration,
          success: true,
          cached: false,
          timestamp: Date.now(),
        });

        // Cache successful GET responses
        if (enableCache && method === 'GET') {
          cache.set(cacheKey, data, cacheTTL);
        }

        return {
          success: true,
          data,
          cached: false,
          responseTime: duration,
        };
      } catch (error: any) {
        const duration = Math.round(performance.now() - startTime);
        
        performanceMonitor.recordMetric({
          endpoint,
          method,
          duration,
          success: false,
          cached: false,
          timestamp: Date.now(),
        });

        throw error;
      }
    };

    try {
      if (retry) {
        return await retryWithBackoff(makeRequest, DEFAULT_RETRY_CONFIG, endpoint);
      } else {
        return await makeRequest();
      }
    } catch (error: any) {
      logger.logError(endpoint, error);
      
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        responseTime: Math.round(performance.now() - startTime),
      };
    }
  }

  /**
   * Paginated request helper
   */
  static async getPaginated<T>(
    endpoint: string,
    params: PaginationParams,
    additionalParams?: Record<string, any>
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...additionalParams,
    });

    return this.request<PaginatedResponse<T>>(
      `${endpoint}?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  /**
   * Invalidate cache for specific pattern
   */
  static invalidateCache(pattern?: string): void {
    cache.invalidate(pattern);
    logger.log('info', `Cache invalidated${pattern ? ` (pattern: ${pattern})` : ''}`);
  }

  /**
   * Get performance statistics
   */
  static getPerformanceStats() {
    return {
      api: performanceMonitor.getStats(),
      cache: cache.getStats(),
    };
  }

  /**
   * Get recent performance metrics
   */
  static getRecentMetrics(count: number = 10) {
    return performanceMonitor.getRecentMetrics(count);
  }
}

// ============================================================================
// Domain-Specific Services
// ============================================================================

export class PropertyService {
  static async getAll(pagination?: PaginationParams) {
    if (pagination) {
      return DataService.getPaginated('/properties', pagination);
    }
    return DataService.request('/properties', { method: 'GET' });
  }

  static async getById(id: string) {
    return DataService.request(`/properties/${id}`, { method: 'GET' });
  }

  static async create(data: any) {
    const response = await DataService.request('/properties', {
      method: 'POST',
      body: data,
      cache: false,
    });
    
    if (response.success) {
      DataService.invalidateCache('properties');
    }
    
    return response;
  }

  static async update(id: string, data: any) {
    const response = await DataService.request(`/properties/${id}`, {
      method: 'PUT',
      body: data,
      cache: false,
    });
    
    if (response.success) {
      DataService.invalidateCache('properties');
    }
    
    return response;
  }

  static async delete(id: string) {
    const response = await DataService.request(`/properties/${id}`, {
      method: 'DELETE',
      cache: false,
    });
    
    if (response.success) {
      DataService.invalidateCache('properties');
    }
    
    return response;
  }
}

export class MaintenanceService {
  static async getAll(pagination?: PaginationParams) {
    if (pagination) {
      return DataService.getPaginated('/maintenance', pagination);
    }
    return DataService.request('/maintenance', { method: 'GET' });
  }

  static async getById(id: string) {
    return DataService.request(`/maintenance/${id}`, { method: 'GET' });
  }

  static async create(data: any) {
    const response = await DataService.request('/maintenance', {
      method: 'POST',
      body: data,
      cache: false,
    });
    
    if (response.success) {
      DataService.invalidateCache('maintenance');
    }
    
    return response;
  }

  static async updateStatus(id: string, status: string) {
    const response = await DataService.request(`/maintenance/${id}/status`, {
      method: 'PUT',
      body: { status },
      cache: false,
    });
    
    if (response.success) {
      DataService.invalidateCache('maintenance');
    }
    
    return response;
  }
}

export class FinancialService {
  static async getTransactions(pagination?: PaginationParams, filters?: any) {
    if (pagination) {
      return DataService.getPaginated('/financial/transactions', pagination, filters);
    }
    return DataService.request('/financial/transactions', { method: 'GET' });
  }

  static async getReports(period: 'month' | 'quarter' | 'year') {
    return DataService.request(`/financial/reports/${period}`, { 
      method: 'GET',
      cacheTTL: 15 * 60 * 1000, // Cache for 15 minutes
    });
  }

  static async getDashboardMetrics() {
    return DataService.request('/financial/dashboard', {
      method: 'GET',
      cacheTTL: 2 * 60 * 1000, // Cache for 2 minutes
    });
  }
}

export class TenantService {
  static async getAll(pagination?: PaginationParams) {
    if (pagination) {
      return DataService.getPaginated('/tenants', pagination);
    }
    return DataService.request('/tenants', { method: 'GET' });
  }

  static async getByProperty(propertyId: string) {
    return DataService.request(`/properties/${propertyId}/tenants`, { method: 'GET' });
  }
}

// Export singleton instance for convenience
export default DataService;
