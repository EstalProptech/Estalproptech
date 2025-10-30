import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface SecurityChartProps {
  type: 'line' | 'bar';
  data: ChartData[];
  title: string;
  description?: string;
  dataKey: string;
  xAxisKey: string;
  color?: string;
  secondaryDataKey?: string;
  secondaryColor?: string;
}

export function SecurityChart({
  type,
  data,
  title,
  description,
  dataKey,
  xAxisKey,
  color = '#9BAE84',
  secondaryDataKey,
  secondaryColor = '#5B6E49',
}: SecurityChartProps) {
  return (
    <Card className="rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#64748B"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#64748B"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E5E5',
                  borderRadius: '12px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2}
                dot={{ fill: color, r: 4 }}
                activeDot={{ r: 6 }}
              />
              {secondaryDataKey && (
                <Line 
                  type="monotone" 
                  dataKey={secondaryDataKey} 
                  stroke={secondaryColor} 
                  strokeWidth={2}
                  dot={{ fill: secondaryColor, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#64748B"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#64748B"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E5E5',
                  borderRadius: '12px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Bar 
                dataKey={dataKey} 
                fill={color}
                radius={[8, 8, 0, 0]}
              />
              {secondaryDataKey && (
                <Bar 
                  dataKey={secondaryDataKey} 
                  fill={secondaryColor}
                  radius={[8, 8, 0, 0]}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
