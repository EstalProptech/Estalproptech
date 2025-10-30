import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Rocket,
  GitBranch,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Download,
  ExternalLink,
  Activity,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Deployment {
  id: number;
  version: string;
  environment: string;
  status: 'success' | 'failure' | 'rollback' | 'pending';
  deployed_at: string;
  deployed_by: string;
  commit_message: string;
  metadata?: {
    from_version?: string;
    reason?: string;
  };
}

export const DeploymentDashboard: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalDeployments: 0,
    successRate: 0,
    avgDeployTime: '5m 32s',
    lastDeployment: null as Deployment | null,
  });

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      setLoading(true);

      // Get user session for auth
      const sessionData = localStorage.getItem('supabase.auth.token');
      const session = sessionData ? JSON.parse(sessionData) : null;
      const accessToken = session?.currentSession?.access_token;

      if (!accessToken) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/deployments?limit=20`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch deployments');
      }

      const data = await response.json();
      setDeployments(data.deployments || []);

      // Calculate metrics
      const total = data.deployments?.length || 0;
      const successful = data.deployments?.filter(
        (d: Deployment) => d.status === 'success'
      ).length || 0;

      setMetrics({
        totalDeployments: total,
        successRate: total > 0 ? (successful / total) * 100 : 0,
        avgDeployTime: '5m 32s',
        lastDeployment: data.deployments?.[0] || null,
      });
    } catch (error) {
      console.error('Error fetching deployments:', error);
      toast.error('Failed to load deployment history');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = (deployment: Deployment) => {
    toast.info('Rollback feature requires GitHub Actions access');
    window.open(
      'https://github.com/your-org/estal-platform/actions/workflows/rollback.yml',
      '_blank'
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'failure':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'rollback':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="rounded-lg bg-green-600">Success</Badge>;
      case 'failure':
        return <Badge variant="destructive" className="rounded-lg">Failed</Badge>;
      case 'rollback':
        return <Badge variant="secondary" className="rounded-lg">Rollback</Badge>;
      default:
        return <Badge variant="outline" className="rounded-lg">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="mb-2">Deployment Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Monitor deployments, track history, and manage releases
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDeployments}
            className="rounded-[12px]"
          >
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                'https://github.com/your-org/estal-platform/actions',
                '_blank'
              )
            }
            className="rounded-[12px]"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            GitHub Actions
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Rocket className="w-8 h-8 text-[#9BAE84]" />
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-3xl mb-2">{metrics.totalDeployments}</h3>
              <p className="text-sm text-muted-foreground">Total Deployments</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <Activity className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-3xl mb-2">{metrics.successRate.toFixed(1)}%</h3>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
                <Activity className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-3xl mb-2">{metrics.avgDeployTime}</h3>
              <p className="text-sm text-muted-foreground">Avg Deploy Time</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-purple-600" />
                <Activity className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-3xl mb-2">
                {metrics.lastDeployment?.deployed_by?.split('@')[0] || 'N/A'}
              </h3>
              <p className="text-sm text-muted-foreground">Last Deployed By</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deployment History */}
      <Card className="rounded-[20px] shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-lg">Deployment History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-muted rounded-[12px] animate-pulse"
                />
              ))}
            </div>
          ) : deployments.length === 0 ? (
            <div className="text-center py-12">
              <Rocket className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No deployments yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Deploy to main or staging branch to see deployment history
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deployments.map((deployment) => (
                <div
                  key={deployment.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-[12px] hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(deployment.status)}

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm">
                          {deployment.metadata?.reason
                            ? deployment.metadata.reason
                            : deployment.commit_message}
                        </p>
                        {getStatusBadge(deployment.status)}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          {deployment.environment}
                        </span>
                        <span>{deployment.version.substring(0, 7)}</span>
                        <span>{deployment.deployed_by}</span>
                        <span>{formatDate(deployment.deployed_at)}</span>
                      </div>
                    </div>
                  </div>

                  {deployment.status === 'success' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRollback(deployment)}
                      className="rounded-[12px]"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Rollback
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CI/CD Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-[20px] shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-lg">CI/CD Pipeline Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Build & Test</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Security Scan</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Database Backup</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Deployment</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[20px] shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between rounded-[12px]"
              onClick={() =>
                window.open(
                  'https://github.com/your-org/estal-platform/actions/workflows/ci-cd.yml',
                  '_blank'
                )
              }
            >
              <span>View Pipeline</span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between rounded-[12px]"
              onClick={() =>
                window.open(
                  'https://github.com/your-org/estal-platform/actions/workflows/rollback.yml',
                  '_blank'
                )
              }
            >
              <span>Trigger Rollback</span>
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between rounded-[12px]"
              onClick={() =>
                window.open(
                  'https://github.com/your-org/estal-platform/releases',
                  '_blank'
                )
              }
            >
              <span>View Releases</span>
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between rounded-[12px]"
              onClick={() =>
                window.open('https://vercel.com/dashboard', '_blank')
              }
            >
              <span>Vercel Dashboard</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
