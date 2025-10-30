import { AlertTriangle, ShieldCheck, Activity, Lock, CheckCircle2, XCircle, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import type { SecurityAlert } from '../hooks/useSecurityAudit';

interface AlertCardsProps {
  alerts: SecurityAlert[];
  authStatus: 'ok' | 'warning' | 'error';
  rlsIntegrity: 'checked' | 'missing' | 'partial';
  realtimeHealth: 'connected' | 'disconnected' | 'reconnecting';
}

export function AlertCards({ alerts, authStatus, rlsIntegrity, realtimeHealth }: AlertCardsProps) {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const highAlerts = alerts.filter(a => a.severity === 'high').length;
  const mediumAlerts = alerts.filter(a => a.severity === 'medium').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
      case 'checked':
      case 'connected':
        return 'text-[#9BAE84]';
      case 'warning':
      case 'partial':
      case 'reconnecting':
        return 'text-[#D9C58E]';
      case 'error':
      case 'missing':
      case 'disconnected':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
      case 'checked':
      case 'connected':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'warning':
      case 'partial':
      case 'reconnecting':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
      case 'missing':
      case 'disconnected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status.includes('ok') || status.includes('checked') || status.includes('connected')
      ? 'default'
      : status.includes('warning') || status.includes('partial') || status.includes('reconnecting')
      ? 'secondary'
      : 'destructive';

    return (
      <Badge variant={variant} className="rounded-[8px]">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Auth Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Auth Status
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className={getStatusColor(authStatus)}>
                        {getStatusIcon(authStatus)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {authStatus === 'ok'
                          ? 'Authentication system is functioning normally'
                          : authStatus === 'warning'
                          ? 'Authentication system has warnings'
                          : 'Authentication system has errors'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getStatusBadge(authStatus)}
                <p className="text-xs text-muted-foreground">
                  {authStatus === 'ok'
                    ? 'All authentication services operational'
                    : authStatus === 'warning'
                    ? 'Minor authentication issues detected'
                    : 'Critical authentication errors found'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RLS Integrity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                  RLS Integrity
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className={getStatusColor(rlsIntegrity)}>
                        {getStatusIcon(rlsIntegrity)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {rlsIntegrity === 'checked'
                          ? 'All tables have Row Level Security enabled'
                          : rlsIntegrity === 'partial'
                          ? 'Some tables lack RLS policies'
                          : 'Critical tables missing RLS protection'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getStatusBadge(rlsIntegrity)}
                <p className="text-xs text-muted-foreground">
                  {rlsIntegrity === 'checked'
                    ? 'Database security policies validated'
                    : rlsIntegrity === 'partial'
                    ? 'Some tables need RLS configuration'
                    : 'Review RLS policies immediately'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Realtime Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {realtimeHealth === 'connected' ? (
                    <Wifi className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  Realtime Health
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className={getStatusColor(realtimeHealth)}>
                        {getStatusIcon(realtimeHealth)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {realtimeHealth === 'connected'
                          ? 'Real-time subscriptions are active'
                          : realtimeHealth === 'reconnecting'
                          ? 'Attempting to reconnect real-time channels'
                          : 'Real-time connection unavailable'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getStatusBadge(realtimeHealth)}
                <p className="text-xs text-muted-foreground">
                  {realtimeHealth === 'connected'
                    ? 'Live updates active and synchronized'
                    : realtimeHealth === 'reconnecting'
                    ? 'Re-establishing connection...'
                    : 'Enable Realtime in Supabase dashboard'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Security Alerts */}
      <Card className="rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            System Alerts & Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Alert Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-[16px] border bg-destructive/5">
              <p className="text-sm text-muted-foreground mb-1">Critical</p>
              <p className="text-3xl font-bold text-destructive">{criticalAlerts}</p>
            </div>
            <div className="p-4 rounded-[16px] border bg-orange-500/5">
              <p className="text-sm text-muted-foreground mb-1">High</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{highAlerts}</p>
            </div>
            <div className="p-4 rounded-[16px] border bg-yellow-500/5">
              <p className="text-sm text-muted-foreground mb-1">Medium</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{mediumAlerts}</p>
            </div>
            <div className="p-4 rounded-[16px] border bg-[#9BAE84]/5">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-3xl font-bold text-[#5B6E49]">{alerts.length}</p>
            </div>
          </div>

          {/* Alert List */}
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-[#9BAE84]" />
              <p className="font-medium">No security alerts</p>
              <p className="text-sm">System is operating normally</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-[16px] border ${
                    alert.severity === 'critical'
                      ? 'border-destructive/50 bg-destructive/5'
                      : alert.severity === 'high'
                      ? 'border-orange-500/50 bg-orange-500/5'
                      : alert.severity === 'medium'
                      ? 'border-yellow-500/50 bg-yellow-500/5'
                      : 'border-blue-500/50 bg-blue-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                          className="rounded-[8px]"
                        >
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline" className="rounded-[8px]">
                          {alert.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="font-medium mb-1">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <AlertTriangle
                      className={`w-5 h-5 flex-shrink-0 ${
                        alert.severity === 'critical'
                          ? 'text-destructive'
                          : alert.severity === 'high'
                          ? 'text-orange-600'
                          : alert.severity === 'medium'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
              {alerts.length > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  + {alerts.length - 5} more alerts
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
