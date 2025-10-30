import { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Search, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import type { LoginAttempt } from '../hooks/useSecurityAudit';

interface AuditLogTableProps {
  loginAttempts: LoginAttempt[];
}

export function AuditLogTable({ loginAttempts }: AuditLogTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'owner' | 'accountant'>('all');

  const filteredAttempts = loginAttempts.filter(attempt => {
    const matchesSearch = 
      attempt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.ip_address.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || attempt.status === statusFilter;
    const matchesRole = roleFilter === 'all' || attempt.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Email', 'Role', 'IP Address', 'Status', 'User Agent'];
    const rows = filteredAttempts.map(attempt => [
      format(new Date(attempt.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      attempt.email,
      attempt.role,
      attempt.ip_address,
      attempt.status,
      attempt.user_agent,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `login-attempts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Authentication Monitor
            </CardTitle>
            <CardDescription>
              Recent login attempts and authentication events
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="rounded-[12px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by email or IP address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-[12px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="w-full md:w-[180px] rounded-[12px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success Only</SelectItem>
              <SelectItem value="failed">Failed Only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={(v: any) => setRoleFilter(v)}>
            <SelectTrigger className="w-full md:w-[180px] rounded-[12px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-[16px] border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>User Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttempts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No login attempts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(attempt.timestamp), 'MMM dd, HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{attempt.email}</span>
                        <span className="text-xs text-muted-foreground">{attempt.user_id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={attempt.role === 'admin' ? 'default' : 'secondary'}
                        className="rounded-[8px]"
                      >
                        {attempt.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {attempt.ip_address}
                    </TableCell>
                    <TableCell>
                      {attempt.status === 'success' ? (
                        <Badge variant="default" className="rounded-[8px] bg-[#9BAE84] hover:bg-[#8A9D73]">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="rounded-[8px]">
                          <XCircle className="w-3 h-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                      {attempt.user_agent}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredAttempts.length} of {loginAttempts.length} attempts
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#9BAE84]" />
              {loginAttempts.filter(a => a.status === 'success').length} successful
            </span>
            <span className="flex items-center gap-1">
              <XCircle className="w-4 h-4 text-destructive" />
              {loginAttempts.filter(a => a.status === 'failed').length} failed
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
