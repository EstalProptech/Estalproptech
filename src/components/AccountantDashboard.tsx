import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  DollarSign,
  TrendingDown,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  Lightbulb,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { AnimatedCounter } from './AnimatedCounter';
import { useNavigation } from './NavigationContext';
import { useDashboardKPIs } from '../hooks/useDashboardData';
import { useFinancialReports } from '../hooks/useFinancialReports';
import { useProperties } from '../hooks/useProperties';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  expenseBreakdownData,
  topClients,
  recentTransactions,
  quickAccessModules,
  aiInsight,
  type AccountantKPI,
  type TopClient,
  type FinancialTransaction,
} from '../data/accountantDashboardData';

const iconMap: Record<string, any> = {
  building: Building2,
  dollar: DollarSign,
  'trending-down': TrendingDown,
  chart: BarChart3,
  check: CheckCircle2,
  'file-text': FileText,
  lightbulb: Lightbulb,
};

export function AccountantDashboard() {
  const { navigate } = useNavigation();
  const { kpis, isLoading: kpisLoading, error: kpisError } = useDashboardKPIs();
  const { reports, isLoading: reportsLoading, error: reportsError } = useFinancialReports();
  const { properties, isLoading: propertiesLoading } = useProperties();

  const isLoading = kpisLoading || reportsLoading || propertiesLoading;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (kpisError || reportsError) {
    return (
      <div className="space-y-4">
        <h1 className="text-foreground mb-2">Accountant Dashboard</h1>
        <Alert className="rounded-[20px]">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data: {kpisError || reportsError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Transform real data for Accountant dashboard
  const accountantKPIs = [
    {
      id: 'total-revenue',
      label: 'Total Revenue',
      value: kpis?.monthly_revenue || 0,
      unit: 'SAR',
      trend: 12.5,
      trendLabel: '+12.5% from last month',
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
    {
      id: 'net-profit',
      label: 'Net Profit',
      value: (kpis?.monthly_revenue || 0) - (kpis?.total_expenses || 0),
      unit: 'SAR',
      trend: 18.3,
      trendLabel: '+18.3% from last month',
      icon: 'chart',
    },
    {
      id: 'properties-tracked',
      label: 'Properties Tracked',
      value: kpis?.total_properties || 0,
      trend: 0,
      trendLabel: 'Total active properties',
      icon: 'building',
    },
  ];

  const revenueExpensesData = reports.slice(0, 6).reverse().map(report => ({
    month: report.month.substring(0, 3),
    revenue: report.revenue,
    expenses: report.expenses,
  }));

  const cashflowData = reports.slice(0, 6).reverse().map(report => ({
    month: report.month.substring(0, 3),
    cashflow: report.revenue - report.expenses,
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">Accountant Dashboard</h1>
        <p className="text-muted-foreground">
          Financial overview and profit analysis
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {accountantKPIs.map((kpi, index) => (
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
                6-month comparison
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueExpensesData}>
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
                  <Bar dataKey="revenue" fill="#9BAE84" radius={[8, 8, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" fill="#D9C58E" radius={[8, 8, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="rounded-[20px] border-border shadow-sm">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monthly distribution
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={expenseBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseBreakdownData.map((entry, index) => (
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
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cashflow Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-[20px] border-border shadow-sm">
          <CardHeader>
            <CardTitle>Cashflow Timeline</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Net profit trend over 6 months
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={cashflowData}>
                <defs>
                  <linearGradient id="cashflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B6E49" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5B6E49" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  formatter={(value: number) => [`${formatCurrency(value)} SAR`, 'Cashflow']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#5B6E49"
                  strokeWidth={2}
                  fill="url(#cashflowGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="rounded-[20px] border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Clients</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monthly income leaders
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <ClientItem key={client.id} client={client} index={index} formatCurrency={formatCurrency} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-[20px] border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Latest financial activities
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('financial-reports')}
                  className="rounded-xl text-primary hover:text-primary"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    index={index}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
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
  kpi: AccountantKPI;
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
            {kpi.prefix && (
              <span className="text-sm text-muted-foreground">{kpi.prefix}</span>
            )}
            <span className="text-3xl font-medium text-foreground tracking-tight">
              <AnimatedCounter
                value={kpi.value}
                decimals={0}
                formatter={kpi.prefix ? formatCurrency : undefined}
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

function ClientItem({
  client,
  index,
  formatCurrency,
}: {
  client: TopClient;
  index: number;
  formatCurrency: (value: number) => string;
}) {
  const statusColors = {
    'On Time': 'bg-primary/10 text-primary',
    Pending: 'bg-accent/20 text-accent',
    Overdue: 'bg-destructive/10 text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent/50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground mb-1">{client.name}</h4>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatCurrency(client.monthlyIncome)} SAR/mo</span>
          <span>•</span>
          <span>{client.properties} properties</span>
        </div>
      </div>
      <Badge className={`${statusColors[client.paymentStatus]} rounded-lg`}>
        {client.paymentStatus}
      </Badge>
    </motion.div>
  );
}

function TransactionItem({
  transaction,
  index,
  formatCurrency,
}: {
  transaction: FinancialTransaction;
  index: number;
  formatCurrency: (value: number) => string;
}) {
  const typeColors = {
    Income: 'text-primary',
    Expense: 'text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent/50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground mb-1">
          {transaction.description}
        </h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{transaction.client}</span>
          <span>•</span>
          <span>{transaction.date}</span>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${typeColors[transaction.type]}`}>
          {transaction.type === 'Income' ? '+' : '-'}
          {formatCurrency(transaction.amount)} SAR
        </p>
        <p className="text-xs text-muted-foreground">{transaction.category}</p>
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
      transition={{ delay: 0.45 + index * 0.05 }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[180px] rounded-[20px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] rounded-[20px]" />
        <Skeleton className="h-[400px] rounded-[20px]" />
      </div>
    </div>
  );
}
