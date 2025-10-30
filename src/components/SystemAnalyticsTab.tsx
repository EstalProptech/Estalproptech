import { motion } from 'motion/react';
import {
  Activity,
  Clock,
  Globe,
  Zap,
  TrendingUp,
  Users,
  Monitor,
  Smartphone,
  Tablet,
  Shield,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import {
  loginActivityData,
  peakHoursData,
  moduleUsageData,
  sessionDurationData,
  roleEngagementData,
  deviceStatsData,
  browserStatsData,
  performanceMetrics,
  topActiveUsers,
  retentionData,
  failedLoginAttempts,
  apiEndpointsUsage,
  getSystemHealthScore,
} from '../data/systemAnalyticsData';
import { AnimatedCounter } from './AnimatedCounter';

export function SystemAnalyticsTab() {
  const healthScore = getSystemHealthScore();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getHealthColor = (score: number) => {
    if (score >= 95) return 'text-secondary';
    if (score >= 85) return 'text-primary';
    if (score >= 70) return 'text-accent';
    return 'text-destructive';
  };

  const getHealthBadgeColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'bg-secondary text-white';
      case 'Good':
        return 'bg-primary text-white';
      case 'Fair':
        return 'bg-accent text-white';
      default:
        return 'bg-destructive text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-[16px] bg-secondary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                </div>
                <Badge className={getHealthBadgeColor(healthScore.status) + ' rounded-xl'}>
                  {healthScore.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">System Health</p>
              <p className={`text-3xl mb-1 ${getHealthColor(healthScore.overall)}`}>
                <AnimatedCounter value={healthScore.overall} />%
              </p>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-[16px] bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Uptime</p>
              <p className="text-3xl mb-1 text-secondary">
                <AnimatedCounter value={performanceMetrics.uptime} decimals={1} />%
              </p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-[16px] bg-accent/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Avg Load Time</p>
              <p className="text-3xl mb-1">
                <AnimatedCounter value={performanceMetrics.avgPageLoadTime} decimals={1} />s
              </p>
              <p className="text-xs text-muted-foreground">Page performance</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-[16px] bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Error Rate</p>
              <p className="text-3xl mb-1">
                <AnimatedCounter value={performanceMetrics.errorRate} decimals={2} />%
              </p>
              <p className="text-xs text-muted-foreground">System errors</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 1: Login Activity & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-[24px] border-border">
            <CardHeader>
              <CardTitle>Login Activity (7 Days)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily logins and unique users
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={loginActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="logins" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="uniqueUsers" fill="var(--secondary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="rounded-[24px] border-border">
            <CardHeader>
              <CardTitle>Peak Usage Hours</CardTitle>
              <p className="text-sm text-muted-foreground">
                Concurrent users by hour
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={peakHoursData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={10} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2: Module Usage & Session Duration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-[24px] border-border">
            <CardHeader>
              <CardTitle>Module Usage Statistics</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total visits per module
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {moduleUsageData.map((module, index) => (
                    <motion.div
                      key={module.module}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: module.color }}
                          />
                          <span className="font-medium">{module.module}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{module.visits}</p>
                          <p className="text-xs text-muted-foreground">{module.avgDuration}</p>
                        </div>
                      </div>
                      <Progress
                        value={(module.visits / moduleUsageData[0].visits) * 100}
                        className="h-2"
                      />
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="rounded-[24px] border-border">
            <CardHeader>
              <CardTitle>Session Duration Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">
                User session length breakdown
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sessionDurationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis dataKey="duration" type="category" stroke="var(--muted-foreground)" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="var(--accent)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 3: Device & Browser Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rounded-[24px] border-border">
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">
                User access by device type
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceStatsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceStatsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-col justify-center space-y-3">
                  {deviceStatsData.map((device, index) => (
                    <motion.div
                      key={device.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: device.color }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{device.name}</p>
                        <p className="text-xs text-muted-foreground">{device.value}%</p>
                      </div>
                      {device.name === 'Desktop' && <Monitor className="w-4 h-4 text-muted-foreground" />}
                      {device.name === 'Mobile' && <Smartphone className="w-4 h-4 text-muted-foreground" />}
                      {device.name === 'Tablet' && <Tablet className="w-4 h-4 text-muted-foreground" />}
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card className="rounded-[24px] border-border">
            <CardHeader>
              <CardTitle>Browser Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">
                User access by browser type
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={browserStatsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {browserStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Active Users & Security Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="rounded-[24px] border-border">
            <CardHeader>
              <CardTitle>Top Active Users</CardTitle>
              <p className="text-sm text-muted-foreground">
                Most engaged users this month
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {topActiveUsers.map((user, index) => (
                    <motion.div
                      key={user.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="p-4 bg-muted/30 rounded-[16px] space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <Badge className="mt-1 text-xs" variant="outline">
                            {user.role}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">{user.logins} logins</p>
                          <p className="text-xs text-muted-foreground">{user.totalTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Activity className="w-3 h-3" />
                        <span>{user.actionsPerformed} actions performed</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <Card className="rounded-[24px] border-border">
            <CardHeader>
              <CardTitle>Security Monitoring</CardTitle>
              <p className="text-sm text-muted-foreground">
                Failed login attempts
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {failedLoginAttempts.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      No suspicious activity detected
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                      {failedLoginAttempts.map((attempt, index) => (
                        <motion.div
                          key={attempt.email}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.65 + index * 0.05 }}
                          className="p-4 bg-destructive/5 border border-destructive/20 rounded-[16px] space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                              <div>
                                <p className="font-medium text-sm">{attempt.email}</p>
                                <p className="text-xs text-muted-foreground">IP: {attempt.ipAddress}</p>
                              </div>
                            </div>
                            <Badge className="bg-destructive text-white rounded-lg">
                              {attempt.attempts} attempts
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last attempt: {formatTime(attempt.lastAttempt)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Retention & API Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="rounded-[24px] border-border">
            <CardHeader>
              <CardTitle>User Retention</CardTitle>
              <p className="text-sm text-muted-foreground">
                Active users returning over time
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retentionData.map((period, index) => (
                  <motion.div
                    key={period.period}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{period.period} Retention</span>
                      <div className="text-right">
                        <p className="font-medium text-primary">{period.percentage}%</p>
                        <p className="text-xs text-muted-foreground">{period.users} users</p>
                      </div>
                    </div>
                    <Progress value={period.percentage} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <Card className="rounded-[24px] border-border">
            <CardHeader>
              <CardTitle>API Performance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Endpoint usage and response times
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] pr-4">
                <div className="space-y-3">
                  {apiEndpointsUsage.map((endpoint, index) => (
                    <motion.div
                      key={endpoint.endpoint}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75 + index * 0.05 }}
                      className="p-3 bg-muted/30 rounded-[16px] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-muted-foreground">
                          {endpoint.endpoint}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {endpoint.calls} calls
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-accent" />
                        <span className="text-xs text-muted-foreground">
                          Avg: {endpoint.avgResponseTime}ms
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
