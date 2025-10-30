import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

/**
 * Skeleton Loaders for Async UI Components
 * 
 * These provide visual feedback while content is loading,
 * improving perceived performance and user experience.
 */

// ============================================================================
// Dashboard Skeleton
// ============================================================================

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner Skeleton */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
      </Card>

      {/* KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-64 w-full" />
          </Card>
        ))}
      </div>

      {/* Activity Feed Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// Table Skeleton
// ============================================================================

export function TableSkeleton({ rows = 10, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Table */}
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 py-3 border-t border-border"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-5 w-full" />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// Properties View Skeleton
// ============================================================================

export function PropertiesViewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-20" />
          </Card>
        ))}
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Chart Skeleton
// ============================================================================

export function ChartSkeleton({ title }: { title?: string }) {
  return (
    <Card className="p-6">
      {title && <Skeleton className="h-6 w-48 mb-4" />}
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex gap-4 justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
        
        {/* Chart Area */}
        <div className="relative">
          <Skeleton className="h-64 w-full rounded-lg" />
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 shimmer-animation" />
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between px-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-3 w-12" />
          ))}
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// Card Grid Skeleton
// ============================================================================

export function CardGridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: number }) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// Form Skeleton
// ============================================================================

export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <Card className="p-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// List Skeleton
// ============================================================================

export function ListSkeleton({ items = 8 }: { items?: number }) {
  return (
    <Card className="p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================================
// Shimmer Animation Styles
// Add to globals.css if not already present
// ============================================================================

/*
.shimmer-animation {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
*/
