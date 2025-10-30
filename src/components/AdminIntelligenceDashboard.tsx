import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Wrench,
  Percent,
  CheckCircle,
  Download,
  RefreshCw,
  Bell,
  ChevronRight,
  X,
  Lightbulb,
  Activity,
  Zap,
  PieChart,
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  FileBarChart,
  Calendar
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { AnimatedCounter } from './AnimatedCounter';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
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
  kpiData,
  userGrowthData,
  roleDistributionData,
  revenueComparisonData,
  activeSessionsData,
  activityFeedData,
  systemAlertsData,
  aiInsightsData,
  quickAccessCards,
  type KPIData,
  type ActivityItem,
  type Alert,
  type AIInsight,
} from '../data/adminIntelligenceData';
import { useNavigation } from './NavigationContext';
import { toast } from 'sonner@2.0.3';
import { DataFreshnessIndicator } from './DataFreshnessIndicator';

const iconMap: Record<string, any> = {
  users: Users,
  building: Building2,
  dollar: DollarSign,
  wrench: Wrench,
  percent: Percent,
  check: CheckCircle,
  'trending-up': TrendingUp,
  activity: Activity,
  zap: Zap,
  lightbulb: Lightbulb,
  'pie-chart': PieChart,
  clock: Clock,
  'file-bar-chart': FileBarChart,
  'building-2': Building2,
};

export function AdminIntelligenceDashboard() {
  const [dateRange, setDateRange] = useState('month');
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false);
  const [alerts, setAlerts] = useState(systemAlertsData);
  const { navigate } = useNavigation();

  const handleExportPDF = () => {
    toast.success('PDF Report Generated', {
      description: 'Admin Intelligence Dashboard report has been downloaded.',
    });
  };

  const handleRefresh = () => {
    toast.success('Dashboard Refreshed', {
      description: 'All data has been updated to the latest values.',
    });
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    toast.success('Alert Acknowledged');
  };

  const generateNewInsight = () => {
    toast.success('AI Analysis Complete', {
      description: 'New insights have been generated based on current data.',
    });
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-foreground">Admin Intelligence Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Real-time performance overview of Estal PropTech system
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DataFreshnessIndicator className="hidden lg:inline-flex" />
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[160px] bg-card border-border rounded-xl">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="rounded-xl border-border hover:bg-sidebar-accent"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="rounded-xl border-border hover:bg-sidebar-accent"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-border hover:bg-sidebar-accent relative"
            >
              <Bell className="w-4 h-4" />
              {unacknowledgedAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                  {unacknowledgedAlerts.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={kpi.id} kpi={kpi} index={index} />
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 rounded-[20px] border-border shadow-md">
            <h3 className="text-foreground mb-4">User Growth & System Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0DD" />
                <XAxis dataKey="month" stroke="#7C7C7C" />
                <YAxis stroke="#7C7C7C" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E0E0DD',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#9BAE84"
                  strokeWidth={3}
                  dot={{ fill: '#9BAE84', r: 4 }}
                  name="Total Users"
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#D9C58E"
                  strokeWidth={3}
                  dot={{ fill: '#D9C58E', r: 4 }}
                  name="Active Sessions"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Role Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="p-6 rounded-[20px] border-border shadow-md">
            <h3 className="text-foreground mb-4">Role Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
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
                  }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Revenue vs Maintenance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 rounded-[20px] border-border shadow-md">
          <h3 className="text-foreground mb-4">Revenue vs. Maintenance Cost</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0DD" />
              <XAxis dataKey="month" stroke="#7C7C7C" />
              <YAxis stroke="#7C7C7C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E0E0DD',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#9BAE84" radius={[8, 8, 0, 0]} name="Revenue (SAR)" />
              <Bar dataKey="maintenance" fill="#D9C58E" radius={[8, 8, 0, 0]} name="Maintenance Cost (SAR)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Active Sessions Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Card className="p-6 rounded-[20px] border-border shadow-md">
          <h3 className="text-foreground mb-4">Active Sessions Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activeSessionsData}>
              <defs>
                <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9BAE84" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9BAE84" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0DD" />
              <XAxis dataKey="time" stroke="#7C7C7C" />
              <YAxis stroke="#7C7C7C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E0E0DD',
                  borderRadius: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#9BAE84"
                strokeWidth={2}
                fill="url(#sessionsGradient)"
                name="Active Sessions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Activity & Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 rounded-[20px] border-border shadow-md h-[500px] flex flex-col">
            <h3 className="text-foreground mb-4">Real-time Activity Feed</h3>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {activityFeedData.map((activity, index) => (
                  <ActivityItemCard key={activity.id} activity={activity} index={index} />
                ))}
              </div>
            </ScrollArea>
          </Card>
        </motion.div>

        {/* System Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card className="p-6 rounded-[20px] border-border shadow-md h-[500px] flex flex-col">
            <h3 className="text-foreground mb-4">System Alerts</h3>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    index={index}
                    onAcknowledge={handleAcknowledgeAlert}
                  />
                ))}
              </div>
            </ScrollArea>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card
          className="p-6 rounded-[20px] border-border shadow-md bg-gradient-to-br from-primary/10 to-accent/10 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setInsightsPanelOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground">AI-Powered Insights</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  View intelligent recommendations and analysis
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>
      </motion.div>

      {/* Quick Access Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <h3 className="text-foreground mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessCards.map((card, index) => (
            <QuickAccessCard key={card.id} card={card} index={index} />
          ))}
        </div>
      </motion.div>

      {/* AI Insights Panel */}
      <AnimatePresence>
        {insightsPanelOpen && (
          <AIInsightsPanel
            onClose={() => setInsightsPanelOpen(false)}
            onGenerateNew={generateNewInsight}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// KPI Card Component
function KPICard({ kpi, index }: { kpi: KPIData; index: number }) {
  const Icon = iconMap[kpi.icon] || Activity;
  const isPositiveTrend = kpi.trend >= 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <Card className="p-6 rounded-[20px] border-border shadow-md hover:shadow-lg transition-all group cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${kpi.color}20` }}
            >
              <Icon className="w-6 h-6" style={{ color: kpi.color }} />
            </div>
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              isPositiveTrend ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
            }`}
          >
            <TrendIcon className="w-3 h-3" />
            <span className="text-xs font-medium">{Math.abs(kpi.trend)}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">{kpi.title}</p>
          <div className="flex items-baseline gap-2">
            <AnimatedCounter
              value={kpi.value}
              className="text-foreground"
            />
            {kpi.unit && <span className="text-muted-foreground text-sm">{kpi.unit}</span>}
          </div>
          <p className="text-xs text-muted-foreground">{kpi.trendLabel}</p>
        </div>

        {/* Sparkline */}
        <div className="mt-4 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpi.sparklineData.map((v, i) => ({ value: v, index: i }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={kpi.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tooltip on hover */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-muted-foreground">{kpi.tooltip}</p>
        </div>
      </Card>
    </motion.div>
  );
}

// Activity Item Card
function ActivityItemCard({ activity, index }: { activity: ActivityItem; index: number }) {
  const typeColors: Record<string, string> = {
    property: '#9BAE84',
    maintenance: '#D9C58E',
    financial: '#5B6E49',
    user: '#9BAE84',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-sidebar-accent transition-colors"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${typeColors[activity.type]}20` }}
      >
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[activity.type] }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{activity.user}</span> {activity.action}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
      </div>
    </motion.div>
  );
}

// Alert Card
function AlertCard({
  alert,
  index,
  onAcknowledge,
}: {
  alert: Alert;
  index: number;
  onAcknowledge: (id: string) => void;
}) {
  const severityConfig = {
    critical: {
      icon: AlertCircle,
      color: '#D66E6E',
      bg: '#D66E6E10',
      label: 'Critical',
    },
    warning: {
      icon: AlertTriangle,
      color: '#D9C58E',
      bg: '#D9C58E10',
      label: 'Warning',
    },
    stable: {
      icon: CheckCircle2,
      color: '#9BAE84',
      bg: '#9BAE8410',
      label: 'Stable',
    },
  };

  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border transition-all ${
        alert.acknowledged ? 'opacity-60' : ''
      }`}
      style={{
        backgroundColor: config.bg,
        borderColor: `${config.color}40`,
      }}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: config.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-xs"
              style={{ borderColor: config.color, color: config.color }}
            >
              {config.label}
            </Badge>
            {!alert.acknowledged && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAcknowledge(alert.id)}
                className="h-6 px-2 text-xs hover:bg-white/50"
              >
                Acknowledge
              </Button>
            )}
          </div>
          <p className="text-sm text-foreground">{alert.message}</p>
          <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
        </div>
      </div>
    </motion.div>
  );
}

// AI Insights Panel
function AIInsightsPanel({
  onClose,
  onGenerateNew,
}: {
  onClose: () => void;
  onGenerateNew: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-card border-l border-border shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-foreground">AI Insights</h2>
              <p className="text-sm text-muted-foreground">Intelligent recommendations</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {aiInsightsData.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} index={index} />
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <Button
            onClick={onGenerateNew}
            className="w-full rounded-xl bg-primary hover:bg-primary/90"
          >
            <Zap className="w-4 h-4 mr-2" />
            Generate New Insight
          </Button>
        </div>
      </motion.div>
    </>
  );
}

// Insight Card
function InsightCard({ insight, index }: { insight: AIInsight; index: number }) {
  const Icon = iconMap[insight.icon] || Lightbulb;

  const categoryColors = {
    growth: '#9BAE84',
    performance: '#5B6E49',
    optimization: '#D9C58E',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-4 rounded-xl border-border hover:shadow-md transition-shadow">
        <div className="flex gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${categoryColors[insight.category]}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: categoryColors[insight.category] }} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground leading-relaxed">{insight.text}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Quick Access Card
function QuickAccessCard({ card, index }: { card: any; index: number }) {
  const { navigate } = useNavigation();
  const Icon = iconMap[card.icon] || Activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -4 }}
    >
      <Card
        className="p-6 rounded-[20px] border-border shadow-md hover:shadow-lg transition-all cursor-pointer group"
        onClick={() => navigate(card.targetView)}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${card.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: card.color }} />
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <h4 className="text-foreground mb-3">{card.title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-foreground">{card.stat}</span>
          <span className="text-xs text-muted-foreground">{card.statLabel}</span>
        </div>
      </Card>
    </motion.div>
  );
}
