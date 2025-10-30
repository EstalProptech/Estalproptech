/**
 * Navigation Tracker
 * Tracks user navigation patterns and screen transitions
 */

import { errorMonitor } from './errorMonitoring';

interface NavigationEvent {
  id: string;
  timestamp: Date;
  from: string;
  to: string;
  duration?: number;
  userId?: string;
  userRole?: string;
  method: 'push' | 'replace' | 'back' | 'forward';
}

interface PageView {
  path: string;
  title: string;
  timestamp: Date;
  timeOnPage?: number;
  exitMethod?: 'navigation' | 'close' | 'refresh';
}

class NavigationTracker {
  private navigationHistory: NavigationEvent[] = [];
  private pageViews: PageView[] = [];
  private currentPageStartTime: number = Date.now();
  private currentPath: string = window.location.pathname;
  private readonly maxHistory = 1000;

  constructor() {
    this.initializeTracking();
    this.loadFromStorage();
  }

  /**
   * Initialize navigation tracking
   */
  private initializeTracking() {
    // Track initial page view
    this.trackPageView(window.location.pathname, document.title);

    // Listen to history changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleNavigation(args[2] as string, 'push');
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleNavigation(args[2] as string, 'replace');
    };

    // Listen to popstate (back/forward)
    window.addEventListener('popstate', () => {
      this.handleNavigation(window.location.pathname, 'back');
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageExit('close');
      }
    });

    // Track before unload
    window.addEventListener('beforeunload', () => {
      this.handlePageExit('close');
      this.saveToStorage();
    });
  }

  /**
   * Handle navigation event
   */
  private handleNavigation(newPath: string, method: 'push' | 'replace' | 'back' | 'forward') {
    const from = this.currentPath;
    const to = typeof newPath === 'string' ? newPath : window.location.pathname;

    // Skip if same path
    if (from === to) return;

    // Calculate time on previous page
    const timeOnPage = Date.now() - this.currentPageStartTime;
    this.updateCurrentPageView(timeOnPage, 'navigation');

    // Create navigation event
    const event: NavigationEvent = {
      id: `nav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      from,
      to,
      userId: this.getCurrentUserId(),
      userRole: this.getCurrentUserRole(),
      method,
    };

    this.navigationHistory.unshift(event);
    if (this.navigationHistory.length > this.maxHistory) {
      this.navigationHistory = this.navigationHistory.slice(0, this.maxHistory);
    }

    // Track performance metric
    errorMonitor.capturePerformanceMetric({
      type: 'navigation',
      duration: 0,
      path: to,
      metadata: { from, method },
    });

    // Track new page view
    this.currentPath = to;
    this.currentPageStartTime = Date.now();
    this.trackPageView(to, document.title);

    this.saveToStorage();
  }

  /**
   * Track page view
   */
  private trackPageView(path: string, title: string) {
    const pageView: PageView = {
      path,
      title,
      timestamp: new Date(),
    };

    this.pageViews.unshift(pageView);
    if (this.pageViews.length > this.maxHistory) {
      this.pageViews = this.pageViews.slice(0, this.maxHistory);
    }
  }

  /**
   * Update current page view with exit info
   */
  private updateCurrentPageView(
    timeOnPage: number,
    exitMethod: 'navigation' | 'close' | 'refresh'
  ) {
    if (this.pageViews.length > 0) {
      const currentView = this.pageViews[0];
      if (currentView.path === this.currentPath) {
        currentView.timeOnPage = timeOnPage;
        currentView.exitMethod = exitMethod;
      }
    }
  }

  /**
   * Handle page exit
   */
  private handlePageExit(exitMethod: 'close' | 'refresh') {
    const timeOnPage = Date.now() - this.currentPageStartTime;
    this.updateCurrentPageView(timeOnPage, exitMethod);
    this.saveToStorage();
  }

  /**
   * Get current user ID
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
   * Get navigation statistics
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
    const recentNavigation = this.navigationHistory.filter(
      (n) => n.timestamp.getTime() > cutoff
    );
    const recentPageViews = this.pageViews.filter((p) => p.timestamp.getTime() > cutoff);

    // Calculate most visited pages
    const pageVisits = recentPageViews.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageVisits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    // Calculate average time on page
    const pagesWithTime = recentPageViews.filter((pv) => pv.timeOnPage !== undefined);
    const avgTimeOnPage = pagesWithTime.length
      ? pagesWithTime.reduce((sum, pv) => sum + (pv.timeOnPage || 0), 0) / pagesWithTime.length
      : 0;

    // Calculate most common navigation patterns
    const navigationPatterns = recentNavigation.reduce((acc, nav) => {
      const pattern = `${nav.from} → ${nav.to}`;
      acc[pattern] = (acc[pattern] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPatterns = Object.entries(navigationPatterns)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([pattern, count]) => ({ pattern, count }));

    // Calculate bounce rate (visits with < 5 seconds)
    const bounces = pagesWithTime.filter((pv) => (pv.timeOnPage || 0) < 5000).length;
    const bounceRate = pagesWithTime.length ? (bounces / pagesWithTime.length) * 100 : 0;

    return {
      totalNavigations: recentNavigation.length,
      totalPageViews: recentPageViews.length,
      uniquePages: Object.keys(pageVisits).length,
      topPages,
      avgTimeOnPage: Math.round(avgTimeOnPage),
      topPatterns,
      bounceRate: Math.round(bounceRate * 10) / 10,
      timeRange,
    };
  }

  /**
   * Get navigation history
   */
  getHistory(limit = 100): NavigationEvent[] {
    return this.navigationHistory.slice(0, limit);
  }

  /**
   * Get page views
   */
  getPageViews(limit = 100): PageView[] {
    return this.pageViews.slice(0, limit);
  }

  /**
   * Get user journey (navigation path for specific user)
   */
  getUserJourney(userId: string, limit = 50): NavigationEvent[] {
    return this.navigationHistory.filter((n) => n.userId === userId).slice(0, limit);
  }

  /**
   * Clear all data
   */
  clear() {
    this.navigationHistory = [];
    this.pageViews = [];
    this.saveToStorage();
  }

  /**
   * Save to localStorage
   */
  private saveToStorage() {
    try {
      localStorage.setItem(
        'estal_navigation',
        JSON.stringify(this.navigationHistory.slice(0, 500))
      );
      localStorage.setItem('estal_page_views', JSON.stringify(this.pageViews.slice(0, 500)));
    } catch (err) {
      console.warn('Failed to save navigation data to localStorage:', err);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage() {
    try {
      const navData = localStorage.getItem('estal_navigation');
      const viewData = localStorage.getItem('estal_page_views');

      if (navData) {
        this.navigationHistory = JSON.parse(navData).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      }

      if (viewData) {
        this.pageViews = JSON.parse(viewData).map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp),
        }));
      }
    } catch (err) {
      console.warn('Failed to load navigation data from localStorage:', err);
    }
  }
}

// Export singleton instance
export const navigationTracker = new NavigationTracker();

// Type exports
export type { NavigationEvent, PageView };
