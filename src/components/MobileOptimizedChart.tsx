import { memo, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from 'recharts';
import { Card } from './ui/card';
import { useIsMobile } from './ui/use-mobile';

/**
 * Mobile Optimized Chart Components
 * 
 * Features:
 * - Automatically adjusts height and spacing for mobile
 * - Reduces complexity on smaller screens
 * - Enables horizontal scrolling for charts with many data points
 * - Simplifies labels and tooltips on mobile
 */

// ============================================================================
// Mobile-Optimized Custom Tooltip
// ============================================================================

const MobileTooltip = memo(({ active, payload, label }: TooltipProps<any, any>) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-2 sm:p-3 text-xs sm:text-sm">
      <p className="font-medium mb-1 sm:mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1 sm:gap-2">
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
});

MobileTooltip.displayName = 'MobileTooltip';

// ============================================================================
// Mobile Optimized Line Chart
// ============================================================================

interface MobileOptimizedLineChartProps {
  data: any[];
  lines: Array<{
    dataKey: string;
    stroke: string;
    name: string;
  }>;
  xAxisKey: string;
  title?: string;
  height?: number;
  mobileHeight?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animationDuration?: number;
}

export const MobileOptimizedLineChart = memo((props: MobileOptimizedLineChartProps) => {
  const {
    data,
    lines,
    xAxisKey,
    title,
    height = 300,
    mobileHeight = 250,
    showGrid = true,
    showLegend = true,
    animationDuration = 300,
  } = props;

  const isMobile = useIsMobile();
  const chartData = useMemo(() => data, [data]);
  const chartHeight = isMobile ? mobileHeight : height;

  // Reduce data points on mobile for better performance
  const optimizedData = useMemo(() => {
    if (!isMobile || chartData.length <= 10) return chartData;
    
    // Sample data to show max 12 points on mobile
    const step = Math.ceil(chartData.length / 12);
    return chartData.filter((_, index) => index % step === 0);
  }, [chartData, isMobile]);

  return (
    <Card className="p-3 sm:p-6 chart-container overflow-x-auto">
      {title && <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={chartHeight} minWidth={isMobile ? 320 : undefined}>
        <LineChart
          data={optimizedData}
          margin={{ 
            top: 5, 
            right: isMobile ? 10 : 20, 
            left: isMobile ? -10 : 0, 
            bottom: 5 
          }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.3}
              horizontal={true}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke="var(--muted-foreground)"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? 'end' : 'middle'}
            height={isMobile ? 60 : 30}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            width={isMobile ? 35 : 40}
          />
          <Tooltip
            content={<MobileTooltip />}
            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
          />
          {showLegend && !isMobile && (
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={isMobile ? 1.5 : 2}
              name={line.name}
              dot={false}
              activeDot={{ r: isMobile ? 3 : 4 }}
              animationDuration={animationDuration}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Mobile legend below chart */}
      {showLegend && isMobile && (
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {lines.map((line) => (
            <div key={line.dataKey} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: line.stroke }}
              />
              <span>{line.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});

MobileOptimizedLineChart.displayName = 'MobileOptimizedLineChart';

// ============================================================================
// Mobile Optimized Bar Chart
// ============================================================================

interface MobileOptimizedBarChartProps {
  data: any[];
  bars: Array<{
    dataKey: string;
    fill: string;
    name: string;
  }>;
  xAxisKey: string;
  title?: string;
  height?: number;
  mobileHeight?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animationDuration?: number;
}

export const MobileOptimizedBarChart = memo((props: MobileOptimizedBarChartProps) => {
  const {
    data,
    bars,
    xAxisKey,
    title,
    height = 300,
    mobileHeight = 250,
    showGrid = true,
    showLegend = true,
    animationDuration = 300,
  } = props;

  const isMobile = useIsMobile();
  const chartData = useMemo(() => data, [data]);
  const chartHeight = isMobile ? mobileHeight : height;

  return (
    <Card className="p-3 sm:p-6 chart-container overflow-x-auto">
      {title && <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={chartHeight} minWidth={isMobile ? 320 : undefined}>
        <BarChart
          data={chartData}
          margin={{ 
            top: 5, 
            right: isMobile ? 10 : 20, 
            left: isMobile ? -10 : 0, 
            bottom: 5 
          }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.3}
              horizontal={true}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke="var(--muted-foreground)"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? 'end' : 'middle'}
            height={isMobile ? 60 : 30}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            width={isMobile ? 35 : 40}
          />
          <Tooltip
            content={<MobileTooltip />}
            cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
          />
          {showLegend && !isMobile && (
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.fill}
              name={bar.name}
              radius={[4, 4, 0, 0]}
              animationDuration={animationDuration}
              isAnimationActive={true}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Mobile legend below chart */}
      {showLegend && isMobile && (
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {bars.map((bar) => (
            <div key={bar.dataKey} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: bar.fill }}
              />
              <span>{bar.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});

MobileOptimizedBarChart.displayName = 'MobileOptimizedBarChart';

// ============================================================================
// Mobile Optimized Area Chart
// ============================================================================

interface MobileOptimizedAreaChartProps {
  data: any[];
  areas: Array<{
    dataKey: string;
    fill: string;
    stroke: string;
    name: string;
  }>;
  xAxisKey: string;
  title?: string;
  height?: number;
  mobileHeight?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animationDuration?: number;
}

export const MobileOptimizedAreaChart = memo((props: MobileOptimizedAreaChartProps) => {
  const {
    data,
    areas,
    xAxisKey,
    title,
    height = 300,
    mobileHeight = 250,
    showGrid = true,
    showLegend = true,
    animationDuration = 300,
  } = props;

  const isMobile = useIsMobile();
  const chartData = useMemo(() => data, [data]);
  const chartHeight = isMobile ? mobileHeight : height;

  return (
    <Card className="p-3 sm:p-6 chart-container overflow-x-auto">
      {title && <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={chartHeight} minWidth={isMobile ? 320 : undefined}>
        <AreaChart
          data={chartData}
          margin={{ 
            top: 5, 
            right: isMobile ? 10 : 20, 
            left: isMobile ? -10 : 0, 
            bottom: 5 
          }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.3}
              horizontal={true}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke="var(--muted-foreground)"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? 'end' : 'middle'}
            height={isMobile ? 60 : 30}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            width={isMobile ? 35 : 40}
          />
          <Tooltip
            content={<MobileTooltip />}
            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
          />
          {showLegend && !isMobile && (
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {areas.map((area) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              fill={area.fill}
              stroke={area.stroke}
              strokeWidth={isMobile ? 1.5 : 2}
              name={area.name}
              fillOpacity={0.6}
              animationDuration={animationDuration}
              isAnimationActive={true}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* Mobile legend below chart */}
      {showLegend && isMobile && (
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {areas.map((area) => (
            <div key={area.dataKey} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: area.stroke }}
              />
              <span>{area.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});

MobileOptimizedAreaChart.displayName = 'MobileOptimizedAreaChart';
