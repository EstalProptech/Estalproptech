/**
 * Centralized KV Store Error Logging
 * Tracks and reports data fetching and parsing errors
 */

export interface KVError {
  id: string;
  type: 'fetch' | 'parse' | 'validation' | 'subscription';
  message: string;
  context: string;
  timestamp: number;
  details?: any;
}

class KVErrorLogger {
  private errors: KVError[] = [];
  private maxErrors = 100;
  private errorCounts: {
    fetch: number;
    parse: number;
    validation: number;
    subscription: number;
  } = {
    fetch: 0,
    parse: 0,
    validation: 0,
    subscription: 0,
  };

  /**
   * Log a KV store error
   */
  log(
    type: KVError['type'],
    message: string,
    context: string,
    details?: any
  ): void {
    const error: KVError = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      context,
      timestamp: Date.now(),
      details,
    };

    this.errors.unshift(error);
    this.errorCounts[type]++;

    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Console log in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[KV Error] ${type.toUpperCase()} - ${context}:`, message, details);
    }
  }

  /**
   * Get all errors
   */
  getErrors(): KVError[] {
    return [...this.errors];
  }

  /**
   * Get recent errors (last N)
   */
  getRecentErrors(count = 10): KVError[] {
    return this.errors.slice(0, count);
  }

  /**
   * Get errors by type
   */
  getErrorsByType(type: KVError['type']): KVError[] {
    return this.errors.filter(e => e.type === type);
  }

  /**
   * Get error statistics
   */
  getStats() {
    const total = Object.values(this.errorCounts).reduce((sum, count) => sum + count, 0);
    
    return {
      total,
      ...this.errorCounts,
      errorRate: total > 0 ? Math.round((total / (total + 100)) * 100) : 0, // Approximate
      recentErrors: this.errors.length,
    };
  }

  /**
   * Check if error rate is too high (> 10%)
   */
  hasHighErrorRate(): boolean {
    const stats = this.getStats();
    return stats.errorRate > 10;
  }

  /**
   * Clear all errors
   */
  clear(): void {
    this.errors = [];
    this.errorCounts = {
      fetch: 0,
      parse: 0,
      validation: 0,
      subscription: 0,
    };
  }

  /**
   * Clear errors older than specified time (in milliseconds)
   */
  clearOlderThan(ms: number): void {
    const cutoff = Date.now() - ms;
    this.errors = this.errors.filter(e => e.timestamp > cutoff);
  }
}

// Export singleton instance
export const kvErrorLogger = new KVErrorLogger();

// Helper function for easy logging
export function logKVError(
  type: KVError['type'],
  message: string,
  context: string,
  details?: any
): void {
  kvErrorLogger.log(type, message, context, details);
}
