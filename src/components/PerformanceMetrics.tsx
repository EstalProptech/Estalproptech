import { useEffect, useState } from 'react';

/**
 * Performance Metrics Monitoring
 * 
 * Tracks Web Vitals and Core Performance Metrics:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - TTFB (Time to First Byte)
 * - FCP (First Contentful Paint)
 * 
 * Reports to console in development and can be sent to analytics in production.
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

// Thresholds for Web Vitals (based on Google guidelines)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function reportMetric(metric: PerformanceMetric) {
  const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
  const isProd = typeof import.meta !== 'undefined' && import.meta.env?.PROD;
  
  // Log to console in development
  if (isDev) {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(
      `${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`
    );
  }

  // In production, send to analytics service
  if (isProd) {
    // Example: Send to Google Analytics, Vercel Analytics, etc.
    // window.gtag?.('event', metric.name, {
    //   value: metric.value,
    //   metric_rating: metric.rating,
    // });
    
    // Or send to custom endpoint
    // fetch('/api/metrics', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    // });
  }
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);

  useEffect(() => {
    // Check if Performance API is supported
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    // Measure TTFB (Time to First Byte)
    const measureTTFB = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        const metric: PerformanceMetric = {
          name: 'TTFB',
          value: ttfb,
          rating: getRating('TTFB', ttfb),
          timestamp: Date.now(),
        };
        reportMetric(metric);
        setMetrics(prev => [...prev, metric]);
      }
    };

    // Measure FCP (First Contentful Paint)
    const measureFCP = () => {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        const metric: PerformanceMetric = {
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: getRating('FCP', fcpEntry.startTime),
          timestamp: Date.now(),
        };
        reportMetric(metric);
        setMetrics(prev => [...prev, metric]);
      }
    };

    // Use PerformanceObserver for Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP Observer
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          
          const metric: PerformanceMetric = {
            name: 'LCP',
            value: lastEntry.startTime,
            rating: getRating('LCP', lastEntry.startTime),
            timestamp: Date.now(),
          };
          reportMetric(metric);
          setMetrics(prev => [...prev, metric]);
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        // LCP not supported
      }

      // FID Observer
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            const metric: PerformanceMetric = {
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              rating: getRating('FID', entry.processingStart - entry.startTime),
              timestamp: Date.now(),
            };
            reportMetric(metric);
            setMetrics(prev => [...prev, metric]);
          });
        });
        
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        // FID not supported
      }

      // CLS Observer
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          
          const metric: PerformanceMetric = {
            name: 'CLS',
            value: clsValue,
            rating: getRating('CLS', clsValue),
            timestamp: Date.now(),
          };
          reportMetric(metric);
          setMetrics(prev => {
            const filtered = prev.filter(m => m.name !== 'CLS');
            return [...filtered, metric];
          });
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        // CLS not supported
      }
    }

    // Measure TTFB and FCP after page load
    if (document.readyState === 'complete') {
      measureTTFB();
      measureFCP();
    } else {
      window.addEventListener('load', () => {
        measureTTFB();
        setTimeout(measureFCP, 0);
      });
    }

    // Resource Timing Analysis
    const analyzeResources = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const analysis = {
        totalSize: 0,
        totalDuration: 0,
        byType: {} as Record<string, { count: number; size: number; duration: number }>,
      };

      resources.forEach((resource) => {
        const type = resource.initiatorType || 'other';
        const size = resource.transferSize || 0;
        const duration = resource.duration;

        analysis.totalSize += size;
        analysis.totalDuration += duration;

        if (!analysis.byType[type]) {
          analysis.byType[type] = { count: 0, size: 0, duration: 0 };
        }

        analysis.byType[type].count++;
        analysis.byType[type].size += size;
        analysis.byType[type].duration += duration;
      });

      const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
      if (isDev) {
        console.log('📊 Resource Analysis:', {
          totalResources: resources.length,
          totalSize: `${(analysis.totalSize / 1024).toFixed(2)} KB`,
          totalDuration: `${analysis.totalDuration.toFixed(2)}ms`,
          byType: Object.entries(analysis.byType).map(([type, stats]) => ({
            type,
            count: stats.count,
            size: `${(stats.size / 1024).toFixed(2)} KB`,
            avgDuration: `${(stats.duration / stats.count).toFixed(2)}ms`,
          })),
        });
      }
    };

    window.addEventListener('load', () => {
      setTimeout(analyzeResources, 1000);
    });

  }, []);

  return metrics;
}

// Export a component that just runs the hook
export function PerformanceMetrics() {
  usePerformanceMetrics();
  return null;
}

// Export function to manually measure custom metrics
export function measureCustomMetric(name: string, value: number) {
  const metric: PerformanceMetric = {
    name,
    value,
    rating: 'good',
    timestamp: Date.now(),
  };
  reportMetric(metric);
}

// Export function to get current performance summary
export function getPerformanceSummary() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paintEntries = performance.getEntriesByType('paint');

  return {
    // Navigation Timing
    redirectTime: navigationEntry?.redirectEnd - navigationEntry?.redirectStart,
    dnsTime: navigationEntry?.domainLookupEnd - navigationEntry?.domainLookupStart,
    tcpTime: navigationEntry?.connectEnd - navigationEntry?.connectStart,
    requestTime: navigationEntry?.responseStart - navigationEntry?.requestStart,
    responseTime: navigationEntry?.responseEnd - navigationEntry?.responseStart,
    domProcessingTime: navigationEntry?.domComplete - navigationEntry?.domInteractive,
    loadTime: navigationEntry?.loadEventEnd - navigationEntry?.loadEventStart,
    
    // Paint Timing
    fcp: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime,
    
    // Memory (if available)
    memory: (performance as any).memory ? {
      usedJSHeapSize: ((performance as any).memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: ((performance as any).memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    } : null,
  };
}
