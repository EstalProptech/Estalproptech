/**
 * Critical Event Logger
 * Tracks important business events across the platform
 */

import { errorMonitor } from './errorMonitoring';

export type EventType =
  | 'auth_login_success'
  | 'auth_login_failure'
  | 'auth_logout'
  | 'auth_register'
  | 'auth_password_reset'
  | 'rbac_access_denied'
  | 'rbac_permission_change'
  | 'payment_initiated'
  | 'payment_success'
  | 'payment_failure'
  | 'invoice_created'
  | 'invoice_paid'
  | 'property_created'
  | 'property_updated'
  | 'property_deleted'
  | 'maintenance_created'
  | 'maintenance_completed'
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'data_export'
  | 'settings_changed'
  | 'api_key_created'
  | 'api_key_revoked';

interface CriticalEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  userId?: string;
  userRole?: string;
  metadata?: Record<string, any>;
  success: boolean;
  error?: string;
  ipAddress?: string;
  userAgent?: string;
}

class CriticalEventLogger {
  private events: CriticalEvent[] = [];
  private readonly maxEvents = 10000;
  private listeners: Map<EventType, ((event: CriticalEvent) => void)[]> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Log a critical event
   */
  log(
    type: EventType,
    metadata?: Record<string, any>,
    success: boolean = true,
    error?: string
  ) {
    const event: CriticalEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      userRole: this.getCurrentUserRole(),
      metadata: this.sanitizeMetadata(metadata),
      success,
      error,
      ipAddress: this.getIpAddress(),
      userAgent: navigator.userAgent,
    };

    this.events.unshift(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    this.saveToStorage();
    this.notifyListeners(event);

    // Log failures as errors in the monitoring system
    if (!success) {
      errorMonitor.captureError(new Error(`Critical event failed: ${type}`), {
        action: type,
        metadata: {
          ...metadata,
          eventId: event.id,
          error,
        },
      });
    }

    // Log to console in development
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.log(
        `[Critical Event] ${type}`,
        success ? '✓' : '✗',
        metadata
      );
    }

    return event.id;
  }

  /**
   * Log authentication events
   */
  logAuth = {
    loginSuccess: (userId: string, metadata?: Record<string, any>) => {
      return this.log('auth_login_success', { userId, ...metadata }, true);
    },
    loginFailure: (error: string, metadata?: Record<string, any>) => {
      return this.log('auth_login_failure', metadata, false, error);
    },
    logout: (userId: string) => {
      return this.log('auth_logout', { userId }, true);
    },
    register: (userId: string, role: string) => {
      return this.log('auth_register', { userId, role }, true);
    },
    passwordReset: (userId: string) => {
      return this.log('auth_password_reset', { userId }, true);
    },
  };

  /**
   * Log RBAC events
   */
  logRBAC = {
    accessDenied: (resource: string, requiredRole: string, userRole: string) => {
      return this.log(
        'rbac_access_denied',
        { resource, requiredRole, userRole },
        false,
        `Access denied to ${resource}`
      );
    },
    permissionChange: (userId: string, oldRole: string, newRole: string) => {
      return this.log('rbac_permission_change', { userId, oldRole, newRole }, true);
    },
  };

  /**
   * Log payment events
   */
  logPayment = {
    initiated: (amount: number, currency: string, metadata?: Record<string, any>) => {
      return this.log('payment_initiated', { amount, currency, ...metadata }, true);
    },
    success: (amount: number, transactionId: string, metadata?: Record<string, any>) => {
      return this.log('payment_success', { amount, transactionId, ...metadata }, true);
    },
    failure: (amount: number, error: string, metadata?: Record<string, any>) => {
      return this.log('payment_failure', { amount, ...metadata }, false, error);
    },
  };

  /**
   * Sanitize metadata to remove sensitive information
   */
  private sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    if (!metadata) return undefined;

    const sensitiveKeys = ['password', 'token', 'secret', 'creditCard', 'cvv', 'pin'];
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(metadata)) {
      if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Get current user ID from auth context
   */
  private getCurrentUserId(): string | undefined {
    try {
      const authData = localStorage.getItem('estal_auth');
      if (authData) {
        const { user } = JSON.parse(authData);
        return user?.id;
      }
    } catch (err) {
      // Ignore
    }
    return undefined;
  }

  /**
   * Get current user role
   */
  private getCurrentUserRole(): string | undefined {
    try {
      const authData = localStorage.getItem('estal_auth');
      if (authData) {
        const { user } = JSON.parse(authData);
        return user?.role;
      }
    } catch (err) {
      // Ignore
    }
    return undefined;
  }

  /**
   * Get IP address (placeholder - would need backend implementation)
   */
  private getIpAddress(): string | undefined {
    // In production, this would be provided by the backend
    return undefined;
  }

  /**
   * Add event listener
   */
  on(eventType: EventType, callback: (event: CriticalEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(eventType: EventType, callback: (event: CriticalEvent) => void) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      this.listeners.set(
        eventType,
        listeners.filter((l) => l !== callback)
      );
    }
  }

  /**
   * Notify listeners
   */
  private notifyListeners(event: CriticalEvent) {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error('Error in event listener:', err);
        }
      });
    }
  }

  /**
   * Get events by type
   */
  getEvents(type?: EventType, limit = 100): CriticalEvent[] {
    const filtered = type ? this.events.filter((e) => e.type === type) : this.events;
    return filtered.slice(0, limit);
  }

  /**
   * Get event statistics
   */
  getStatistics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h') {
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    const cutoff = now - timeRanges[timeRange];
    const recentEvents = this.events.filter((e) => e.timestamp.getTime() > cutoff);

    const totalEvents = recentEvents.length;
    const successfulEvents = recentEvents.filter((e) => e.success).length;
    const failedEvents = recentEvents.filter((e) => !e.success).length;

    const eventsByType = recentEvents.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Auth-specific stats
    const authEvents = recentEvents.filter((e) => e.type.startsWith('auth_'));
    const authFailures = authEvents.filter((e) => !e.success).length;
    const authSuccesses = authEvents.filter((e) => e.success).length;

    // RBAC-specific stats
    const rbacDenials = recentEvents.filter((e) => e.type === 'rbac_access_denied').length;

    // Payment-specific stats
    const paymentEvents = recentEvents.filter((e) => e.type.startsWith('payment_'));
    const paymentFailures = paymentEvents.filter((e) => !e.success).length;

    return {
      totalEvents,
      successfulEvents,
      failedEvents,
      successRate: totalEvents ? (successfulEvents / totalEvents) * 100 : 100,
      eventsByType,
      authStats: {
        total: authEvents.length,
        successes: authSuccesses,
        failures: authFailures,
        failureRate: authEvents.length ? (authFailures / authEvents.length) * 100 : 0,
      },
      rbacDenials,
      paymentStats: {
        total: paymentEvents.length,
        failures: paymentFailures,
        failureRate: paymentEvents.length ? (paymentFailures / paymentEvents.length) * 100 : 0,
      },
      timeRange,
    };
  }

  /**
   * Clear all events
   */
  clear() {
    this.events = [];
    this.saveToStorage();
  }

  /**
   * Save to localStorage
   */
  private saveToStorage() {
    try {
      localStorage.setItem('estal_critical_events', JSON.stringify(this.events.slice(0, 1000)));
    } catch (err) {
      console.warn('Failed to save critical events to localStorage:', err);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage() {
    try {
      const data = localStorage.getItem('estal_critical_events');
      if (data) {
        this.events = JSON.parse(data).map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
      }
    } catch (err) {
      console.warn('Failed to load critical events from localStorage:', err);
    }
  }
}

// Export singleton instance
export const criticalEventLogger = new CriticalEventLogger();

// Type exports
export type { CriticalEvent };
