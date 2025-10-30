import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Download, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { useSecurityAudit } from '../hooks/useSecurityAudit';
import { SecurityChart } from './SecurityChart';
import { AuditLogTable } from './AuditLogTable';
import { PolicyMatrix } from './PolicyMatrix';
import { AlertCards } from './AlertCards';
import { useAuth } from './AuthContext';
import { DataFreshnessIndicator, FreshnessBadge } from './DataFreshnessIndicator';

export function SecurityAuditDashboard() {
  const { user } = useAuth();
  const {
    loginAttempts,
    rlsPolicies,
    apiLogs,
    securityAlerts,
    isLoading,
    error,
    refetch,
  } = useSecurityAudit();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="rounded-[20px]">
          <AlertDescription>
            Access Denied: Only administrators can access the Security Audit Dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Process login activity data for chart (last 30 days)
  const loginActivityData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 29 - i));
      return {
        date: format(date, 'MMM dd'),
        timestamp: date.getTime(),
        success: 0,
        failed: 0,
      };
    });

    loginAttempts.forEach(attempt => {
      const attemptDate = startOfDay(new Date(attempt.timestamp));
      const dayData = last30Days.find(d => d.timestamp === attemptDate.getTime());
      if (dayData) {
        if (attempt.status === 'success') {
          dayData.success++;
        } else {
          dayData.failed++;
        }
      }
    });

    return last30Days;
  }, [loginAttempts]);

  // Process API response time data
  const apiResponseData = useMemo(() => {
    // Group by endpoint and calculate average response time
    const endpointStats: { [key: string]: { total: number; count: number } } = {};

    apiLogs.forEach(log => {
      if (!endpointStats[log.endpoint]) {
        endpointStats[log.endpoint] = { total: 0, count: 0 };
      }
      endpointStats[log.endpoint].total += log.response_time;
      endpointStats[log.endpoint].count++;
    });

    return Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({
        endpoint: endpoint.split('/').pop() || endpoint,
        avgResponseTime: Math.round(stats.total / stats.count),
      }))
      .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
      .slice(0, 10);
  }, [apiLogs]);

  // Calculate system health status
  const authStatus = useMemo(() => {
    const recentFailed = loginAttempts
      .filter(a => a.status === 'failed')
      .filter(a => new Date(a.timestamp) > subDays(new Date(), 1));
    
    if (recentFailed.length > 10) return 'error';
    if (recentFailed.length > 5) return 'warning';
    return 'ok';
  }, [loginAttempts]);

  const rlsIntegrity = useMemo(() => {
    const criticalTables = ['properties', 'financial_reports', 'maintenance_requests'];
    const protectedTables = new Set(rlsPolicies.map(p => p.tablename));
    
    const missingTables = criticalTables.filter(t => !protectedTables.has(t));
    
    if (missingTables.length === 0) return 'checked';
    if (missingTables.length <= 1) return 'partial';
    return 'missing';
  }, [rlsPolicies]);

  // Realtime health would be determined by actual connection status
  const realtimeHealth = 'connected'; // In production, this would be dynamic

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const exportSecurityReport = () => {
    const report = {
      generated_at: new Date().toISOString(),
      summary: {
        total_login_attempts: loginAttempts.length,
        successful_logins: loginAttempts.filter(a => a.status === 'success').length,
        failed_logins: loginAttempts.filter(a => a.status === 'failed').length,
        active_rls_policies: rlsPolicies.length,
        security_alerts: securityAlerts.length,
        critical_alerts: securityAlerts.filter(a => a.severity === 'critical').length,
      },
      health: {
        auth_status: authStatus,
        rls_integrity: rlsIntegrity,
        realtime_health: realtimeHealth,
      },
      recent_alerts: securityAlerts.slice(0, 10),
      login_attempts: loginAttempts.slice(0, 50),
      rls_policies: rlsPolicies,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading security audit data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="rounded-[20px]">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Security Audit Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor authentication, permissions, and security posture in real-time
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DataFreshnessIndicator className="hidden lg:inline-flex" />
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-[12px]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={exportSecurityReport}
            className="rounded-[12px] bg-[#9BAE84] hover:bg-[#8A9D73]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* System Health & Alerts */}
      <AlertCards
        alerts={securityAlerts}
        authStatus={authStatus}
        rlsIntegrity={rlsIntegrity}
        realtimeHealth={realtimeHealth}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="authentication" className="space-y-6">
        <TabsList className="rounded-[16px] p-1">
          <TabsTrigger value="authentication" className="rounded-[12px]">
            <Activity className="w-4 h-4 mr-2" />
            Authentication
          </TabsTrigger>
          <TabsTrigger value="permissions" className="rounded-[12px]">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Permissions & RLS
          </TabsTrigger>
          <TabsTrigger value="api-access" className="rounded-[12px]">
            <TrendingUp className="w-4 h-4 mr-2" />
            API Access
          </TabsTrigger>
        </TabsList>

        {/* Authentication Tab */}
        <TabsContent value="authentication" className="space-y-6">
          {/* Login Activity Chart */}
          <SecurityChart
            type="line"
            data={loginActivityData}
            title="Login Activity (Last 30 Days)"
            description="Track successful and failed authentication attempts over time"
            dataKey="success"
            secondaryDataKey="failed"
            xAxisKey="date"
            color="#9BAE84"
            secondaryColor="#EF4444"
          />

          {/* Login Attempts Table */}
          <AuditLogTable loginAttempts={loginAttempts} />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-[20px] bg-gradient-to-br from-[#9BAE84]/10 to-[#9BAE84]/5 border border-[#9BAE84]/20"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <TrendingUp className="w-4 h-4 text-[#9BAE84]" />
              </div>
              <p className="text-3xl font-bold">
                {loginAttempts.length > 0
                  ? Math.round(
                      (loginAttempts.filter(a => a.status === 'success').length /
                        loginAttempts.length) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {loginAttempts.filter(a => a.status === 'success').length} of{' '}
                {loginAttempts.length} attempts
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-[20px] bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Failed Attempts</p>
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
              <p className="text-3xl font-bold text-destructive">
                {loginAttempts.filter(a => a.status === 'failed').length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last 24h:{' '}
                {
                  loginAttempts.filter(
                    a =>
                      a.status === 'failed' &&
                      new Date(a.timestamp) > subDays(new Date(), 1)
                  ).length
                }
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-[20px] bg-gradient-to-br from-[#D9C58E]/10 to-[#D9C58E]/5 border border-[#D9C58E]/20"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Unique IPs</p>
                <Activity className="w-4 h-4 text-[#D9C58E]" />
              </div>
              <p className="text-3xl font-bold">
                {new Set(loginAttempts.map(a => a.ip_address)).size}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Active locations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-[20px] bg-gradient-to-br from-[#5B6E49]/10 to-[#5B6E49]/5 border border-[#5B6E49]/20"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Admin Logins</p>
                <ShieldCheck className="w-4 h-4 text-[#5B6E49]" />
              </div>
              <p className="text-3xl font-bold">
                {loginAttempts.filter(a => a.role === 'admin' && a.status === 'success').length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Privileged access
              </p>
            </motion.div>
          </div>
        </TabsContent>

        {/* Permissions & RLS Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <PolicyMatrix policies={rlsPolicies} />
        </TabsContent>

        {/* API Access Tab */}
        <TabsContent value="api-access" className="space-y-6">
          {/* API Response Time Chart */}
          <SecurityChart
            type="bar"
            data={apiResponseData}
            title="API Response Time (Average)"
            description="Average response time by endpoint in milliseconds"
            dataKey="avgResponseTime"
            xAxisKey="endpoint"
            color="#5B6E49"
          />

          {/* API Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-[20px] border bg-card">
              <p className="text-sm text-muted-foreground mb-2">Total API Calls</p>
              <p className="text-3xl font-bold">{apiLogs.length}</p>
            </div>
            <div className="p-6 rounded-[20px] border bg-card">
              <p className="text-sm text-muted-foreground mb-2">Avg Response Time</p>
              <p className="text-3xl font-bold">
                {apiLogs.length > 0
                  ? Math.round(
                      apiLogs.reduce((sum, log) => sum + log.response_time, 0) / apiLogs.length
                    )
                  : 0}
                ms
              </p>
            </div>
            <div className="p-6 rounded-[20px] border bg-card">
              <p className="text-sm text-muted-foreground mb-2">Slow Requests (&gt;1s)</p>
              <p className="text-3xl font-bold">
                {apiLogs.filter(log => log.response_time > 1000).length}
              </p>
            </div>
          </div>

          {/* Note about API logging */}
          {apiLogs.length === 0 && (
            <Alert className="rounded-[20px]">
              <AlertDescription>
                No API access logs found. API logging is currently not active. Enable API
                logging to track endpoint usage and performance.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
