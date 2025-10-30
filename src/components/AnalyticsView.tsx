import { Activity, Users, AlertCircle, Clock, Zap, Server, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const realtimeData = [
  { time: '00:00', users: 45, requests: 120 },
  { time: '04:00', users: 23, requests: 65 },
  { time: '08:00', users: 89, requests: 245 },
  { time: '12:00', users: 134, requests: 378 },
  { time: '16:00', users: 156, requests: 432 },
  { time: '20:00', users: 98, requests: 289 },
];

const performanceData = [
  { time: '00:00', loadTime: 245 },
  { time: '04:00', loadTime: 198 },
  { time: '08:00', loadTime: 312 },
  { time: '12:00', loadTime: 378 },
  { time: '16:00', loadTime: 289 },
  { time: '20:00', loadTime: 234 },
];

const errorLogs = [
  {
    id: 'ERR-001',
    type: 'Database',
    message: 'Connection timeout on primary DB',
    severity: 'high',
    timestamp: '2025-10-21 14:23:45',
    status: 'resolved',
  },
  {
    id: 'ERR-002',
    type: 'API',
    message: 'Rate limit exceeded on /api/properties',
    severity: 'medium',
    timestamp: '2025-10-21 13:15:22',
    status: 'investigating',
  },
  {
    id: 'ERR-003',
    type: 'Auth',
    message: 'Failed login attempt from IP 192.168.1.1',
    severity: 'low',
    timestamp: '2025-10-21 12:45:10',
    status: 'resolved',
  },
  {
    id: 'ERR-004',
    type: 'Storage',
    message: 'Low disk space warning (85% used)',
    severity: 'high',
    timestamp: '2025-10-21 11:30:00',
    status: 'investigating',
  },
];

const severityConfig = {
  'low': { color: 'bg-[#6B7280]' },
  'medium': { color: 'bg-[#F59E0B]' },
  'high': { color: 'bg-[#EF4444]' },
};

const statusConfig = {
  'resolved': { color: 'bg-secondary' },
  'investigating': { color: 'bg-primary' },
};

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>System Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time system monitoring and performance metrics</p>
        </div>
        <Badge className="bg-secondary text-white rounded-lg px-4 py-2 flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" />
          System Online
        </Badge>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="rounded-lg">Live</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Active Users</p>
            <h3 className="text-3xl mb-2">156</h3>
            <p className="text-xs text-secondary">+12% from last hour</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <Badge variant="outline" className="rounded-lg">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Error Rate</p>
            <h3 className="text-3xl mb-2">0.02%</h3>
            <p className="text-xs text-destructive">2 errors in last hour</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <Badge variant="outline" className="rounded-lg">Avg</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Avg Load Time</p>
            <h3 className="text-3xl mb-2">289ms</h3>
            <p className="text-xs text-secondary">-45ms from last hour</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <Badge variant="outline" className="rounded-lg">99.9%</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">System Uptime</p>
            <h3 className="text-3xl mb-2">30d</h3>
            <p className="text-xs text-secondary">No downtime</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Activity */}
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Real-time Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={realtimeData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
                />
                <Area type="monotone" dataKey="users" stroke="#0EA5E9" strokeWidth={2} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="requests" stroke="#10B981" strokeWidth={2} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#F59E0B]" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
                  formatter={(value) => [`${value}ms`, 'Load Time']}
                />
                <Line 
                  type="monotone" 
                  dataKey="loadTime" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="w-5 h-5 text-primary" />
              Server Load
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Memory</span>
                <span className="text-sm">62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Network</span>
                <span className="text-sm">28%</span>
              </div>
              <Progress value={28} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="w-5 h-5 text-secondary" />
              Database Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Active Connections</span>
                <span className="text-sm">234/500</span>
              </div>
              <Progress value={47} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Query Time</span>
                <span className="text-sm">12ms avg</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Storage Used</span>
                <span className="text-sm">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-5 h-5 text-[#8B5CF6]" />
              API Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm">99.98%</span>
              </div>
              <Progress value={99.98} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Response Time</span>
                <span className="text-sm">156ms</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Requests/min</span>
                <span className="text-sm">1,245</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Logs */}
      <Card className="rounded-2xl shadow-sm border-border">
        <CardHeader>
          <CardTitle>Error Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30">
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.type}</TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>
                      <Badge className={`${severityConfig[log.severity as keyof typeof severityConfig].color} text-white rounded-lg`}>
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge className={`${statusConfig[log.status as keyof typeof statusConfig].color} text-white rounded-lg`}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
