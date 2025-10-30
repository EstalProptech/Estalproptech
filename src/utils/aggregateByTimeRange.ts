/**
 * Time-based Data Aggregation Utilities
 * For charts and analytics preprocessing
 */

import { format, startOfDay, startOfWeek, startOfMonth, parseISO, isValid } from 'date-fns';

export type TimeRange = 'hour' | 'day' | 'week' | 'month';

export interface TimeSeriesData {
  timestamp: string;
  [key: string]: any;
}

export interface AggregatedData {
  period: string;
  count: number;
  data: any[];
  startDate: Date;
  endDate: Date;
}

/**
 * Aggregate data by time range
 */
export function aggregateByTimeRange<T extends TimeSeriesData>(
  data: T[],
  range: TimeRange,
  options: {
    dateKey?: keyof T;
    sortAscending?: boolean;
  } = {}
): AggregatedData[] {
  const { dateKey = 'timestamp' as keyof T, sortAscending = false } = options;

  // Group data by period
  const groups = new Map<string, T[]>();

  data.forEach(item => {
    const dateValue = item[dateKey];
    if (!dateValue) return;

    try {
      const date = typeof dateValue === 'string' ? parseISO(dateValue) : new Date(dateValue);
      
      if (!isValid(date)) {
        console.warn('Invalid date:', dateValue);
        return;
      }

      let periodStart: Date;
      let periodKey: string;

      switch (range) {
        case 'hour':
          periodStart = new Date(date);
          periodStart.setMinutes(0, 0, 0);
          periodKey = format(periodStart, 'yyyy-MM-dd HH:00');
          break;

        case 'day':
          periodStart = startOfDay(date);
          periodKey = format(periodStart, 'yyyy-MM-dd');
          break;

        case 'week':
          periodStart = startOfWeek(date);
          periodKey = format(periodStart, 'yyyy-MM-dd');
          break;

        case 'month':
          periodStart = startOfMonth(date);
          periodKey = format(periodStart, 'yyyy-MM');
          break;

        default:
          periodStart = startOfDay(date);
          periodKey = format(periodStart, 'yyyy-MM-dd');
      }

      if (!groups.has(periodKey)) {
        groups.set(periodKey, []);
      }
      groups.get(periodKey)!.push(item);
    } catch (error) {
      console.error('Error processing date:', dateValue, error);
    }
  });

  // Convert to aggregated format
  const aggregated: AggregatedData[] = Array.from(groups.entries()).map(([period, items]) => {
    const dates = items.map(item => {
      const dateValue = item[dateKey];
      return typeof dateValue === 'string' ? parseISO(dateValue) : new Date(dateValue);
    }).filter(isValid);

    return {
      period,
      count: items.length,
      data: items,
      startDate: new Date(Math.min(...dates.map(d => d.getTime()))),
      endDate: new Date(Math.max(...dates.map(d => d.getTime()))),
    };
  });

  // Sort by period
  aggregated.sort((a, b) => {
    const comparison = a.startDate.getTime() - b.startDate.getTime();
    return sortAscending ? comparison : -comparison;
  });

  return aggregated;
}

/**
 * Get count by time range
 */
export function getCountByTimeRange<T extends TimeSeriesData>(
  data: T[],
  range: TimeRange,
  options?: { dateKey?: keyof T }
): Array<{ period: string; count: number }> {
  const aggregated = aggregateByTimeRange(data, range, options);
  return aggregated.map(({ period, count }) => ({ period, count }));
}

/**
 * Aggregate numeric values by time range
 */
export function sumByTimeRange<T extends TimeSeriesData>(
  data: T[],
  range: TimeRange,
  valueKey: keyof T,
  options?: { dateKey?: keyof T }
): Array<{ period: string; total: number }> {
  const aggregated = aggregateByTimeRange(data, range, options);
  
  return aggregated.map(({ period, data: items }) => {
    const total = items.reduce((sum, item) => {
      const value = Number(item[valueKey]) || 0;
      return sum + value;
    }, 0);

    return { period, total };
  });
}

/**
 * Calculate average by time range
 */
export function averageByTimeRange<T extends TimeSeriesData>(
  data: T[],
  range: TimeRange,
  valueKey: keyof T,
  options?: { dateKey?: keyof T }
): Array<{ period: string; average: number }> {
  const aggregated = aggregateByTimeRange(data, range, options);
  
  return aggregated.map(({ period, data: items, count }) => {
    const total = items.reduce((sum, item) => {
      const value = Number(item[valueKey]) || 0;
      return sum + value;
    }, 0);

    return {
      period,
      average: count > 0 ? Math.round((total / count) * 100) / 100 : 0,
    };
  });
}

/**
 * Group data by field value within time range
 */
export function groupByFieldInTimeRange<T extends TimeSeriesData>(
  data: T[],
  range: TimeRange,
  groupKey: keyof T,
  options?: { dateKey?: keyof T }
): Array<{ period: string; groups: Map<any, T[]> }> {
  const aggregated = aggregateByTimeRange(data, range, options);
  
  return aggregated.map(({ period, data: items }) => {
    const groups = new Map<any, T[]>();
    
    items.forEach(item => {
      const key = item[groupKey];
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    });

    return { period, groups };
  });
}

/**
 * Get trend direction (up, down, stable)
 */
export function getTrend(
  current: number,
  previous: number,
  threshold = 5
): 'up' | 'down' | 'stable' {
  const change = ((current - previous) / previous) * 100;
  
  if (Math.abs(change) < threshold) return 'stable';
  return change > 0 ? 'up' : 'down';
}

/**
 * Calculate percentage change
 */
export function getPercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
}

/**
 * Fill missing periods with zero counts
 */
export function fillMissingPeriods(
  data: Array<{ period: string; [key: string]: any }>,
  range: TimeRange,
  startDate: Date,
  endDate: Date
): Array<{ period: string; [key: string]: any }> {
  const filled: Array<{ period: string; [key: string]: any }> = [];
  const dataMap = new Map(data.map(d => [d.period, d]));

  let current = new Date(startDate);
  
  while (current <= endDate) {
    let periodKey: string;

    switch (range) {
      case 'hour':
        periodKey = format(current, 'yyyy-MM-dd HH:00');
        current.setHours(current.getHours() + 1);
        break;

      case 'day':
        periodKey = format(current, 'yyyy-MM-dd');
        current.setDate(current.getDate() + 1);
        break;

      case 'week':
        periodKey = format(current, 'yyyy-MM-dd');
        current.setDate(current.getDate() + 7);
        break;

      case 'month':
        periodKey = format(current, 'yyyy-MM');
        current.setMonth(current.getMonth() + 1);
        break;

      default:
        periodKey = format(current, 'yyyy-MM-dd');
        current.setDate(current.getDate() + 1);
    }

    if (dataMap.has(periodKey)) {
      filled.push(dataMap.get(periodKey)!);
    } else {
      filled.push({ period: periodKey, count: 0 });
    }
  }

  return filled;
}
