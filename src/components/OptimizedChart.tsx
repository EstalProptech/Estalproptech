import { memo, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from 'recharts';
import { Card } from './ui/card';

/**
 * Optimized Chart Components
 * 
 * Features:
 * - Memoized to prevent unnecessary re-renders
 * - Optimized Recharts configuration
 * - GPU-accelerated animations
 * - Reduced SVG complexity
 * - Custom tooltip for better performance
 */

// ============================================================================
// Custom Tooltip (Optimized)
// ============================================================================

const CustomTooltip = memo(({ active, payload, label }: TooltipProps<any, any>) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3">
      <p className="text-sm font-medium mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

// ============================================================================
// Optimized Line Chart
// ============================================================================

interface OptimizedLineChartProps {
  data: any[];
  lines: Array<{
    dataKey: string;
    stroke: string;
    name: string;
  }>;
  xAxisKey: string;
  title?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animationDuration?: number;
}

export const OptimizedLineChart = memo(({
  data,
  lines,
  xAxisKey,
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
  animationDuration = 300,
}: OptimizedLineChartProps) => {
  // Memoize chart data to prevent recalculation
  const chartData = useMemo(() => data, [data]);

  return (
    <Card className="p-6 chart-container">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.3}
              // Reduce SVG complexity
              horizontal={true}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={2}
              name={line.name}
              dot={false} // Disable dots for better performance
              activeDot={{ r: 4 }}
              animationDuration={animationDuration}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
});

OptimizedLineChart.displayName = 'OptimizedLineChart';

// ============================================================================
// Optimized Bar Chart
// ============================================================================

interface OptimizedBarChartProps {
  data: any[];
  bars: Array<{
    dataKey: string;
    fill: string;
    name: string;
  }>;
  xAxisKey: string;
  title?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animationDuration?: number;
}

export const OptimizedBarChart = memo(({
  data,
  bars,
  xAxisKey,
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
  animationDuration = 300,
}: OptimizedBarChartProps) => {
  const chartData = useMemo(() => data, [data]);

  return (
    <Card className="p-6 chart-container">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
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
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {bars.map((bar, index) => (
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
    </Card>
  );
});

OptimizedBarChart.displayName = 'OptimizedBarChart';

// ============================================================================
// Optimized Area Chart
// ============================================================================

interface OptimizedAreaChartProps {
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
  showGrid?: boolean;
  showLegend?: boolean;
  animationDuration?: number;
}

export const OptimizedAreaChart = memo(({
  data,
  areas,
  xAxisKey,
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
  animationDuration = 300,
}: OptimizedAreaChartProps) => {
  const chartData = useMemo(() => data, [data]);

  return (
    <Card className="p-6 chart-container">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
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
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {areas.map((area, index) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              fill={area.fill}
              stroke={area.stroke}
              strokeWidth={2}
              name={area.name}
              fillOpacity={0.6}
              animationDuration={animationDuration}
              isAnimationActive={true}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
});

OptimizedAreaChart.displayName = 'OptimizedAreaChart';

// ============================================================================
// Optimized Pie Chart
// ============================================================================

interface OptimizedPieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  title?: string;
  height?: number;
  showLegend?: boolean;
  animationDuration?: number;
}

export const OptimizedPieChart = memo(({
  data,
  title,
  height = 300,
  showLegend = true,
  animationDuration = 300,
}: OptimizedPieChartProps) => {
  const chartData = useMemo(() => data, [data]);

  return (
    <Card className="p-6 chart-container">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={height / 3}
            fill="#8884d8"
            dataKey="value"
            animationDuration={animationDuration}
            isAnimationActive={true}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
            }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

              return percent > 0.05 ? (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight="bold"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              ) : null;
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
});

OptimizedPieChart.displayName = 'OptimizedPieChart';

// ============================================================================
// Export all optimized chart components
// ============================================================================

export {
  CustomTooltip,
};
