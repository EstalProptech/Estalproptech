import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Zap,
  AlertCircle,
  Server,
  Users,
  Navigation,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { errorMonitor } from '../utils/errorMonitoring';
import { criticalEventLogger } from '../utils/criticalEventLogger';
import { navigationTracker } from '../utils/navigationTracker';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner@2.0.3';

type TimeRange = '1h' | '24h' | '7d' | '30d';

export const PerformanceMetricsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorStats, setErrorStats] = useState<any>(null);
  const [perfStats, setPerfStats] = useState<any>(null);
  const [eventStats, setEventStats] = useState<any>(null);
  const [navStats, setNavStats] = useState<any>(null);

  const loadData = () => {
    setErrorStats(errorMonitor.getErrorStats(timeRange));
    setPerfStats(errorMonitor.getPerformanceStats(timeRange));
    setEventStats(criticalEventLogger.getStatistics(timeRange));
    setNavStats(navigationTracker.getStatistics(timeRange));
  };

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Dashboard refreshed');
    }, 500);
  };

  const handleExportReport = () => {
    const report = errorMonitor.generateWeeklyReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estal-performance-report-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all monitoring data? This cannot be undone.')) {
      errorMonitor.clearErrors();
      errorMonitor.clearMetrics();
      criticalEventLogger.clear();
      navigationTracker.clear();
      loadData();
      toast.success('All monitoring data cleared');
    }
  };

  if (!errorStats || !perfStats || !eventStats || !navStats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading performance metrics...</p>
        </div>
      </div>
    );
  }

  const crashFreeRate = 100 - (errorStats.errorsByLevel.error / Math.max(eventStats.totalEvents, 100)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="mb-2">Performance & Error Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring and insights into system health
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-40 rounded-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-[12px]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            className="rounded-[12px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <Badge variant={crashFreeRate > 98 ? 'default' : 'destructive'} className="rounded-lg">
                  {crashFreeRate > 98 ? 'Healthy' : 'Warning'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Crash-Free Rate</p>
              <h3 className="text-3xl mb-2">{crashFreeRate.toFixed(2)}%</h3>
              <Progress value={crashFreeRate} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant={perfStats.meanLatency < 200 ? 'default' : 'secondary'} className="rounded-lg">
                  {perfStats.meanLatency < 200 ? 'Fast' : 'Slow'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Mean API Latency</p>
              <h3 className="text-3xl mb-1">{perfStats.meanLatency}ms</h3>
              <div className="flex items-center gap-1 text-xs">
                {perfStats.meanLatency < 200 ? (
                  <>
                    <TrendingDown className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">Within target</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3 h-3 text-destructive" />
                    <span className="text-destructive">Above target</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <Badge variant={errorStats.totalErrors < 10 ? 'default' : 'destructive'} className="rounded-lg">
                  {errorStats.totalErrors} Errors
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Errors</p>
              <h3 className="text-3xl mb-1">{errorStats.totalErrors}</h3>
              <div className="flex gap-2 text-xs">
                <span className="text-destructive">{errorStats.errorsByLevel.error} Critical</span>
                <span className="text-amber-600">{errorStats.errorsByLevel.warning} Warnings</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="outline" className="rounded-lg">
                  {eventStats.totalEvents} Events
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
              <h3 className="text-3xl mb-2">{eventStats.successRate.toFixed(1)}%</h3>
              <Progress value={eventStats.successRate} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="errors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-[16px]">
          <TabsTrigger value="errors" className="rounded-[12px]">
            <AlertCircle className="w-4 h-4 mr-2" />
            Errors
          </TabsTrigger>
          <TabsTrigger value="performance" className="rounded-[12px]">
            <Server className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="events" className="rounded-[12px]">
            <Activity className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="navigation" className="rounded-[12px]">
            <Navigation className="w-4 h-4 mr-2" />
            Navigation
          </TabsTrigger>
        </TabsList>

        {/* Errors Tab */}
        <TabsContent value="errors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Errors */}
            <Card className="rounded-[20px] shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-lg">Top Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {errorStats.topErrors.map((error: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-muted rounded-[12px] space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">
                              {error.example?.message || 'Unknown error'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {error.example?.context?.page || 'Unknown page'}
                            </p>
                          </div>
                          <Badge variant="destructive" className="rounded-lg ml-2">
                            {error.count}x
                          </Badge>
                        </div>
                        {error.example?.stack && (
                          <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer hover:text-foreground">
                              View stack trace
                            </summary>
                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words">
                              {error.example.stack.split('\n').slice(0, 3).join('\n')}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                    {errorStats.topErrors.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-600" />
                        <p>No errors recorded in this period</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Error Distribution */}
            <Card className="rounded-[20px] shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-lg">Error Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Errors', value: errorStats.errorsByLevel.error, color: '#ef4444' },
                        { name: 'Warnings', value: errorStats.errorsByLevel.warning, color: '#f59e0b' },
                        { name: 'Info', value: errorStats.errorsByLevel.info, color: '#3b82f6' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { color: '#ef4444' },
                        { color: '#f59e0b' },
                        { color: '#3b82f6' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="rounded-[20px] shadow-lg border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mean Latency</p>
                    <p className="text-2xl">{perfStats.meanLatency}ms</p>
                  </div>
                </div>
                <Progress
                  value={Math.min((perfStats.meanLatency / 500) * 100, 100)}
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card className="rounded-[20px] shadow-lg border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">P95 Latency</p>
                    <p className="text-2xl">{perfStats.p95Latency}ms</p>
                  </div>
                </div>
                <Progress
                  value={Math.min((perfStats.p95Latency / 1000) * 100, 100)}
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card className="rounded-[20px] shadow-lg border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Slow Requests</p>
                    <p className="text-2xl">{perfStats.slowRequests}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {perfStats.slowRequestRate.toFixed(1)}% of total requests
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-[20px] shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-lg">Event Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-[12px]">
                  <span className="text-sm">Total Events</span>
                  <Badge variant="outline" className="rounded-lg">
                    {eventStats.totalEvents}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-[12px]">
                  <span className="text-sm">Successful</span>
                  <Badge className="rounded-lg bg-green-600">
                    {eventStats.successfulEvents}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-[12px]">
                  <span className="text-sm">Failed</span>
                  <Badge variant="destructive" className="rounded-lg">
                    {eventStats.failedEvents}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[20px] shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-lg">Auth & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-[12px]">
                  <span className="text-sm">Auth Events</span>
                  <Badge variant="outline" className="rounded-lg">
                    {eventStats.authStats.total}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-[12px]">
                  <span className="text-sm">Auth Failures</span>
                  <Badge variant="destructive" className="rounded-lg">
                    {eventStats.authStats.failures} ({eventStats.authStats.failureRate.toFixed(1)}%)
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-[12px]">
                  <span className="text-sm">RBAC Denials</span>
                  <Badge variant="secondary" className="rounded-lg">
                    {eventStats.rbacDenials}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-[20px] shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-lg">Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {navStats.topPages.map((page: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-[12px]"
                      >
                        <span className="text-sm truncate flex-1">{page.path}</span>
                        <Badge variant="outline" className="rounded-lg ml-2">
                          {page.count} views
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="rounded-[20px] shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-lg">Navigation Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-[12px]">
                  <span className="text-sm">Avg. Time on Page</span>
                  <Badge variant="outline" className="rounded-lg">
                    {(navStats.avgTimeOnPage / 1000).toFixed(1)}s
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-[12px]">
                  <span className="text-sm">Bounce Rate</span>
                  <Badge
                    variant={navStats.bounceRate < 40 ? 'default' : 'secondary'}
                    className="rounded-lg"
                  >
                    {navStats.bounceRate}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-[12px]">
                  <span className="text-sm">Unique Pages</span>
                  <Badge variant="outline" className="rounded-lg">
                    {navStats.uniquePages}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card className="rounded-[20px] shadow-lg border-border border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg mb-1">Data Management</h3>
              <p className="text-sm text-muted-foreground">
                Export reports or clear monitoring data
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleExportReport}
                className="rounded-[12px]"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearData}
                className="rounded-[12px]"
              >
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
