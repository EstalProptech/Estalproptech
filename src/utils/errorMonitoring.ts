/**
 * Error Monitoring & Analytics Service
 * Centralizes error tracking, logging, and reporting for the Estal platform
 */

// Sentry-like error monitoring (can be replaced with actual Sentry SDK)
interface ErrorContext {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  page?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface ErrorEvent {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: ErrorContext;
  fingerprint?: string;
  sanitized: boolean;
}

interface PerformanceMetric {
  id: string;
  timestamp: Date;
  type: 'api' | 'navigation' | 'render' | 'resource';
  duration: number;
  path: string;
  metadata?: Record<string, any>;
}

class ErrorMonitoringService {
  private errors: ErrorEvent[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private readonly maxStoredErrors = 1000;
  private readonly maxStoredMetrics = 5000;
  private sentryEnabled = false;
  private listeners: ((event: ErrorEvent) => void)[] = [];

  constructor() {
    this.initializeGlobalErrorHandlers();
    this.loadFromStorage();
  }

  /**
   * Initialize global error handlers
   */
  private initializeGlobalErrorHandlers() {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        page: window.location.pathname,
        action: 'unhandled_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          page: window.location.pathname,
          action: 'unhandled_rejection',
        }
      );
    });

    // Network error tracking
    this.interceptFetch();
  }

  /**
   * Intercept fetch calls to monitor network errors
   */
  private interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;

      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;

        // Track slow requests (> 2 seconds)
        if (duration > 2000) {
          this.capturePerformanceMetric({
            type: 'api',
            duration,
            path: url,
            metadata: {
              status: response.status,
              slow: true,
            },
          });
        }

        // Track failed requests
        if (!response.ok) {
          this.captureError(new Error(`HTTP ${response.status}: ${url}`), {
            action: 'network_error',
            metadata: {
              status: response.status,
              statusText: response.statusText,
              url,
              duration,
            },
          });
        }

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.captureError(error as Error, {
          action: 'network_failure',
          metadata: {
            url,
            duration,
          },
        });
        throw error;
      }
    };
  }

  /**
   * Sanitize sensitive data from error context
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'apiKey',
      'authorization',
      'creditCard',
      'ssn',
      'bankAccount',
    ];

    const sanitize = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;

      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }

      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          sanitized[key] = sanitize(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    };

    return sanitize(data);
  }

  /**
   * Capture an error
   */
  captureError(error: Error, context?: ErrorContext, level: 'error' | 'warning' | 'info' = 'error') {
    const sanitizedContext = context ? this.sanitizeData(context) : undefined;

    const errorEvent: ErrorEvent = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message: error.message || String(error),
      stack: error.stack,
      context: sanitizedContext,
      fingerprint: this.generateFingerprint(error),
      sanitized: true,
    };

    this.errors.unshift(errorEvent);
    if (this.errors.length > this.maxStoredErrors) {
      this.errors = this.errors.slice(0, this.maxStoredErrors);
    }

    this.saveToStorage();
    this.notifyListeners(errorEvent);

    // Log to console in development
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.error('[Error Monitor]', {
        message: errorEvent.message,
        context: errorEvent.context,
        stack: errorEvent.stack,
      });
    }

    // Send to Sentry if enabled
    if (this.sentryEnabled && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: { custom: sanitizedContext },
        level: level === 'error' ? 'error' : level,
      });
    }

    // Check for critical errors that need alerting
    this.checkAlertingRules(errorEvent);
  }

  /**
   * Generate a fingerprint for error grouping
   */
  private generateFingerprint(error: Error): string {
    const message = error.message || '';
    const stackLine = error.stack?.split('\n')[1] || '';
    return `${message}_${stackLine}`.substring(0, 100);
  }

  /**
   * Capture performance metric
   */
  capturePerformanceMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) {
    const performanceMetric: PerformanceMetric = {
      id: `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...metric,
    };

    this.performanceMetrics.unshift(performanceMetric);
    if (this.performanceMetrics.length > this.maxStoredMetrics) {
      this.performanceMetrics = this.performanceMetrics.slice(0, this.maxStoredMetrics);
    }

    this.saveToStorage();
  }

  /**
   * Check alerting rules
   */
  private checkAlertingRules(error: ErrorEvent) {
    // Auth failure spike detection
    if (error.context?.action?.includes('auth') || error.context?.action?.includes('login')) {
      const recentAuthErrors = this.errors.filter(
        (e) =>
          (e.context?.action?.includes('auth') || e.context?.action?.includes('login')) &&
          Date.now() - e.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
      );

      if (recentAuthErrors.length > 10) {
        this.triggerAlert('auth_failure_spike', {
          count: recentAuthErrors.length,
          timeWindow: '5 minutes',
        });
      }
    }

    // API 500 error rate check
    const recentApiErrors = this.errors.filter(
      (e) =>
        e.context?.metadata?.status >= 500 &&
        Date.now() - e.timestamp.getTime() < 5 * 60 * 1000
    );
    
    const recentApiCalls = this.performanceMetrics.filter(
      (m) => m.type === 'api' && Date.now() - m.timestamp.getTime() < 5 * 60 * 1000
    );

    if (recentApiCalls.length > 100) {
      const errorRate = (recentApiErrors.length / recentApiCalls.length) * 100;
      if (errorRate > 1) {
        this.triggerAlert('api_error_rate_high', {
          errorRate: errorRate.toFixed(2),
          errors: recentApiErrors.length,
          total: recentApiCalls.length,
        });
      }
    }
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(type: string, data: any) {
    console.warn(`[ALERT] ${type}:`, data);
    
    // In production, this would send to Slack/Email
    // For now, we'll store it as a critical error
    this.captureError(new Error(`ALERT: ${type}`), {
      action: 'alert_triggered',
      metadata: { alertType: type, alertData: data },
    });
  }

  /**
   * Add event listener
   */
  addListener(callback: (event: ErrorEvent) => void) {
    this.listeners.push(callback);
  }

  /**
   * Remove event listener
   */
  removeListener(callback: (event: ErrorEvent) => void) {
    this.listeners = this.listeners.filter((l) => l !== callback);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(event: ErrorEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in listener:', err);
      }
    });
  }

  /**
   * Get error statistics
   */
  getErrorStats(timeRange: '1h' | '24h' | '7d' | '30d' = '24h') {
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    const cutoff = now - timeRanges[timeRange];
    const recentErrors = this.errors.filter((e) => e.timestamp.getTime() > cutoff);

    const totalErrors = recentErrors.length;
    const errorsByLevel = {
      error: recentErrors.filter((e) => e.level === 'error').length,
      warning: recentErrors.filter((e) => e.level === 'warning').length,
      info: recentErrors.filter((e) => e.level === 'info').length,
    };

    const errorsByFingerprint = recentErrors.reduce((acc, e) => {
      const fp = e.fingerprint || 'unknown';
      acc[fp] = (acc[fp] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topErrors = Object.entries(errorsByFingerprint)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([fingerprint, count]) => ({
        fingerprint,
        count,
        example: recentErrors.find((e) => e.fingerprint === fingerprint),
      }));

    return {
      totalErrors,
      errorsByLevel,
      topErrors,
      timeRange,
    };
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(timeRange: '1h' | '24h' | '7d' | '30d' = '24h') {
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    const cutoff = now - timeRanges[timeRange];
    const recentMetrics = this.performanceMetrics.filter((m) => m.timestamp.getTime() > cutoff);

    const apiMetrics = recentMetrics.filter((m) => m.type === 'api');
    const meanLatency = apiMetrics.length
      ? apiMetrics.reduce((sum, m) => sum + m.duration, 0) / apiMetrics.length
      : 0;

    const p95Latency = this.calculatePercentile(
      apiMetrics.map((m) => m.duration),
      95
    );

    const slowRequests = apiMetrics.filter((m) => m.duration > 2000).length;

    return {
      totalRequests: apiMetrics.length,
      meanLatency: Math.round(meanLatency),
      p95Latency: Math.round(p95Latency),
      slowRequests,
      slowRequestRate: apiMetrics.length ? (slowRequests / apiMetrics.length) * 100 : 0,
      timeRange,
    };
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = values.slice().sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  /**
   * Get all errors
   */
  getErrors(limit = 100): ErrorEvent[] {
    return this.errors.slice(0, limit);
  }

  /**
   * Get all performance metrics
   */
  getPerformanceMetrics(limit = 100): PerformanceMetric[] {
    return this.performanceMetrics.slice(0, limit);
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errors = [];
    this.saveToStorage();
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.performanceMetrics = [];
    this.saveToStorage();
  }

  /**
   * Save to localStorage
   */
  private saveToStorage() {
    try {
      localStorage.setItem('estal_errors', JSON.stringify(this.errors.slice(0, 100)));
      localStorage.setItem('estal_metrics', JSON.stringify(this.performanceMetrics.slice(0, 500)));
    } catch (err) {
      console.warn('Failed to save monitoring data to localStorage:', err);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage() {
    try {
      const errorsData = localStorage.getItem('estal_errors');
      const metricsData = localStorage.getItem('estal_metrics');

      if (errorsData) {
        this.errors = JSON.parse(errorsData).map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
      }

      if (metricsData) {
        this.performanceMetrics = JSON.parse(metricsData).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      }
    } catch (err) {
      console.warn('Failed to load monitoring data from localStorage:', err);
    }
  }

  /**
   * Enable Sentry integration
   */
  enableSentry(dsn: string) {
    // This would initialize actual Sentry SDK
    // For now, we'll just set the flag
    this.sentryEnabled = true;
    console.log('[Error Monitor] Sentry integration enabled');
  }

  /**
   * Generate weekly error report
   */
  generateWeeklyReport() {
    const stats = this.getErrorStats('7d');
    const perfStats = this.getPerformanceStats('7d');

    return {
      reportDate: new Date(),
      period: 'Last 7 Days',
      errors: stats,
      performance: perfStats,
      crashFreeRate: this.calculateCrashFreeRate(),
      recommendations: this.generateRecommendations(stats, perfStats),
    };
  }

  /**
   * Calculate crash-free session rate
   */
  private calculateCrashFreeRate(): number {
    // Simplified calculation - in production would track actual sessions
    const recentErrors = this.errors.filter(
      (e) => Date.now() - e.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    );
    const criticalErrors = recentErrors.filter((e) => e.level === 'error').length;
    
    // Assume 1 error per 100 sessions on average
    const estimatedSessions = Math.max(recentErrors.length * 100, 1000);
    return Math.max(0, ((estimatedSessions - criticalErrors) / estimatedSessions) * 100);
  }

  /**
   * Generate recommendations based on stats
   */
  private generateRecommendations(errorStats: any, perfStats: any): string[] {
    const recommendations: string[] = [];

    if (errorStats.totalErrors > 100) {
      recommendations.push('High error count detected. Review top errors and implement fixes.');
    }

    if (perfStats.meanLatency > 200) {
      recommendations.push(
        `Mean API latency is ${perfStats.meanLatency}ms. Consider optimizing slow endpoints.`
      );
    }

    if (perfStats.slowRequestRate > 5) {
      recommendations.push(
        `${perfStats.slowRequestRate.toFixed(1)}% of requests are slow (>2s). Investigate performance bottlenecks.`
      );
    }

    if (errorStats.errorsByLevel.error > errorStats.totalErrors * 0.5) {
      recommendations.push('High ratio of critical errors. Prioritize error handling improvements.');
    }

    return recommendations;
  }
}

// Export singleton instance
export const errorMonitor = new ErrorMonitoringService();

// Type exports
export type { ErrorEvent, ErrorContext, PerformanceMetric };
