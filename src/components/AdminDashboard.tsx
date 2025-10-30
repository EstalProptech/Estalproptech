import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  DollarSign,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Lightbulb,
  UserCog,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { AnimatedCounter } from './AnimatedCounter';
import { useNavigation } from './NavigationContext';
import { useDashboardKPIs } from '../hooks/useDashboardData';
import { useFinancialReports } from '../hooks/useFinancialReports';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  roleDistributionData,
  recentActivities,
  quickAccessModules,
  aiInsight,
  type RecentActivity,
} from '../data/adminDashboardData';

const iconMap: Record<string, any> = {
  building: Building2,
  dollar: DollarSign,
  chart: BarChart3,
  'trending-down': TrendingDown,
  'users-cog': UserCog,
  'bar-chart': BarChart3,
};

export function AdminDashboard() {
  const { navigate } = useNavigation();
  const { kpis, isLoading, error } = useDashboardKPIs();
  const { reports, isLoading: reportsLoading } = useFinancialReports();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  if (isLoading || reportsLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-foreground mb-2">Admin Dashboard</h1>
        <Alert className="rounded-[20px]">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Transform real data into chart format
  const revenueExpensesData = reports.slice(0, 6).reverse().map(report => ({
    month: report.month.substring(0, 3),
    revenue: report.revenue,
    expenses: report.expenses,
  }));

  // Create KPI cards from real data
  const adminKPIs = [
    {
      id: 'total-properties',
      label: 'Total Properties',
      value: kpis?.total_properties || 0,
      trend: 4.2,
      trendLabel: '+4.2% from last month',
      icon: 'building',
    },
    {
      id: 'monthly-revenue',
      label: 'Monthly Revenue',
      value: kpis?.monthly_revenue || 0,
      unit: 'SAR',
      trend: 7.3,
      trendLabel: '+7.3% from last month',
      icon: 'dollar',
    },
    {
      id: 'total-expenses',
      label: 'Total Expenses',
      value: kpis?.total_expenses || 0,
      unit: 'SAR',
      trend: -5.2,
      trendLabel: '-5.2% from last month',
      icon: 'trending-down',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and operational insights
        </p>
      </motion.div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-[20px] border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">AI Insight</h4>
                <p className="text-sm text-muted-foreground">{aiInsight}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminKPIs.map((kpi, index) => (
          <KPICard key={kpi.id} kpi={kpi} index={index} formatCurrency={formatCurrency} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-[20px] border-border shadow-sm">
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                6-month financial trend
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenueExpensesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0DD" vertical={false} />
                  <XAxis dataKey="month" stroke="#7C7C7C" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#7C7C7C" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E0E0DD',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${formatCurrency(value)} SAR`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#9BAE84"
                    strokeWidth={2}
                    dot={{ fill: '#9BAE84', r: 4 }}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#D9C58E"
                    strokeWidth={2}
                    dot={{ fill: '#D9C58E', r: 4 }}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Role Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="rounded-[20px] border-border shadow-sm">
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                User breakdown by role
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={roleDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {roleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E0E0DD',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-[20px] border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Latest system activities
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <ActivityItem key={activity.id} activity={activity} index={index} />
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="text-foreground mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessModules.map((module, index) => (
            <QuickAccessCard key={module.id} module={module} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function KPICard({
  kpi,
  index,
  formatCurrency,
}: {
  kpi: any;
  index: number;
  formatCurrency: (value: number) => string;
}) {
  const Icon = iconMap[kpi.icon] || BarChart3;
  const isPositiveTrend = kpi.trend >= 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.03 }}
      whileHover={{ y: -2 }}
    >
      <Card className="rounded-[20px] border-border shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                isPositiveTrend
                  ? 'bg-primary/10 text-primary'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              <TrendIcon className="w-3 h-3" />
              {Math.abs(kpi.trend)}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{kpi.label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium text-foreground tracking-tight">
              <AnimatedCounter
                value={kpi.value}
                decimals={0}
                formatter={kpi.unit === 'SAR' ? formatCurrency : undefined}
              />
            </span>
            {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{kpi.trendLabel}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActivityItem({
  activity,
  index,
}: {
  activity: RecentActivity;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-sidebar-accent/50 transition-colors"
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={activity.avatar} alt={activity.user} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {activity.user.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{activity.user}</span>{' '}
          <span className="text-muted-foreground">{activity.action}</span>{' '}
          <span className="font-medium">{activity.target}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
      </div>
    </motion.div>
  );
}

function QuickAccessCard({ module, index }: { module: any; index: number }) {
  const { navigate } = useNavigation();
  const Icon = iconMap[module.icon] || Building2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className="rounded-[20px] border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
        onClick={() => navigate(module.route)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h4 className="text-foreground font-medium mb-1">{module.title}</h4>
          <p className="text-sm text-muted-foreground">{module.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-24 rounded-[20px]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[180px] rounded-[20px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] rounded-[20px]" />
        <Skeleton className="h-[400px] rounded-[20px]" />
      </div>
      <Skeleton className="h-[400px] rounded-[20px]" />
    </div>
  );
}
