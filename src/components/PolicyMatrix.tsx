import { useState } from 'react';
import { Shield, Eye, Edit, X, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import type { RLSPolicy } from '../hooks/useSecurityAudit';

interface PolicyMatrixProps {
  policies: RLSPolicy[];
}

interface RolePermission {
  role: string;
  module: string;
  access: 'view' | 'edit' | 'none';
}

const rolePermissions: RolePermission[] = [
  { role: 'Admin', module: 'Dashboard', access: 'edit' },
  { role: 'Admin', module: 'Properties', access: 'edit' },
  { role: 'Admin', module: 'Maintenance', access: 'edit' },
  { role: 'Admin', module: 'Financial Reports', access: 'edit' },
  { role: 'Admin', module: 'Analytics', access: 'edit' },
  { role: 'Admin', module: 'Clients', access: 'edit' },
  { role: 'Admin', module: 'Users', access: 'edit' },
  { role: 'Admin', module: 'Settings', access: 'edit' },
  
  { role: 'Owner', module: 'Dashboard', access: 'view' },
  { role: 'Owner', module: 'Properties', access: 'view' },
  { role: 'Owner', module: 'Maintenance', access: 'view' },
  { role: 'Owner', module: 'Financial Reports', access: 'none' },
  { role: 'Owner', module: 'Analytics', access: 'none' },
  { role: 'Owner', module: 'Clients', access: 'view' },
  { role: 'Owner', module: 'Users', access: 'none' },
  { role: 'Owner', module: 'Settings', access: 'view' },
  
  { role: 'Accountant', module: 'Dashboard', access: 'view' },
  { role: 'Accountant', module: 'Properties', access: 'view' },
  { role: 'Accountant', module: 'Maintenance', access: 'none' },
  { role: 'Accountant', module: 'Financial Reports', access: 'edit' },
  { role: 'Accountant', module: 'Analytics', access: 'view' },
  { role: 'Accountant', module: 'Clients', access: 'none' },
  { role: 'Accountant', module: 'Users', access: 'none' },
  { role: 'Accountant', module: 'Settings', access: 'view' },
];

export function PolicyMatrix({ policies }: PolicyMatrixProps) {
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  const getAccessIcon = (access: 'view' | 'edit' | 'none') => {
    switch (access) {
      case 'edit':
        return <Edit className="w-4 h-4 text-[#9BAE84]" />;
      case 'view':
        return <Eye className="w-4 h-4 text-[#5B6E49]" />;
      case 'none':
        return <X className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getAccessBadge = (access: 'view' | 'edit' | 'none') => {
    const variants = {
      edit: 'default',
      view: 'secondary',
      none: 'outline',
    } as const;

    return (
      <Badge variant={variants[access]} className="rounded-[8px] gap-1">
        {getAccessIcon(access)}
        {access === 'edit' ? 'Full Access' : access === 'view' ? 'View Only' : 'No Access'}
      </Badge>
    );
  };

  // Group permissions by role
  const permissionsByRole = rolePermissions.reduce((acc, perm) => {
    if (!acc[perm.role]) {
      acc[perm.role] = [];
    }
    acc[perm.role].push(perm);
    return acc;
  }, {} as Record<string, RolePermission[]>);

  return (
    <div className="space-y-6">
      {/* Role & Permission Matrix */}
      <Card className="rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Role & Permission Matrix
          </CardTitle>
          <CardDescription>
            System-wide access control configuration by role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-[16px] border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Access Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(permissionsByRole).map(([role, permissions]) =>
                  permissions.map((perm, idx) => (
                    <TableRow key={`${role}-${perm.module}`}>
                      {idx === 0 && (
                        <TableCell rowSpan={permissions.length} className="font-medium">
                          <Badge
                            variant={role === 'Admin' ? 'default' : 'secondary'}
                            className="rounded-[8px]"
                          >
                            {role}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>{perm.module}</TableCell>
                      <TableCell>{getAccessBadge(perm.access)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* RLS Policy Inspector */}
      <Card className="rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            RLS Policy Inspector
          </CardTitle>
          <CardDescription>
            Active Row Level Security policies protecting database tables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {policies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No RLS policies found</p>
              <p className="text-sm">This may indicate a security issue</p>
            </div>
          ) : (
            policies.map((policy) => (
              <Collapsible
                key={`${policy.tablename}-${policy.policyname}`}
                open={expandedPolicy === policy.policyname}
                onOpenChange={(open) => setExpandedPolicy(open ? policy.policyname : null)}
              >
                <div className="rounded-[16px] border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="rounded-[8px] font-mono">
                        {policy.tablename}
                      </Badge>
                      <span className="font-medium">{policy.policyname}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">
                              This policy controls {policy.cmd.toLowerCase()} access to the {policy.tablename} table
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-[12px]">
                        {expandedPolicy === policy.policyname ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            View Details
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="rounded-[8px]">
                      {policy.cmd}
                    </Badge>
                    <Badge variant="secondary" className="rounded-[8px]">
                      {policy.permissive}
                    </Badge>
                    <span className="text-muted-foreground">
                      Applies to: {policy.roles.join(', ')}
                    </span>
                  </div>

                  <CollapsibleContent>
                    <div className="mt-4 p-4 rounded-[12px] bg-muted/50">
                      <p className="text-sm font-medium mb-2">Policy Expression:</p>
                      <code className="text-xs font-mono block p-3 rounded-[8px] bg-background border overflow-x-auto">
                        {policy.qual || 'No expression (allows all)'}
                      </code>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))
          )}

          {/* RLS Status Summary */}
          <div className="mt-6 p-4 rounded-[16px] border bg-muted/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">RLS Status Summary</h4>
              <Badge
                variant={policies.length >= 4 ? 'default' : 'destructive'}
                className="rounded-[8px]"
              >
                {policies.length >= 4 ? 'Protected' : 'Needs Review'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Total Policies</p>
                <p className="text-2xl font-bold">{policies.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Protected Tables</p>
                <p className="text-2xl font-bold">
                  {new Set(policies.map(p => p.tablename)).size}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">SELECT Policies</p>
                <p className="text-2xl font-bold">
                  {policies.filter(p => p.cmd === 'SELECT').length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">WRITE Policies</p>
                <p className="text-2xl font-bold">
                  {policies.filter(p => ['INSERT', 'UPDATE', 'DELETE'].includes(p.cmd)).length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
