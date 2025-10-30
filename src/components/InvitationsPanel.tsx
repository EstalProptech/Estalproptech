import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, RefreshCw, X, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { pendingInvitations, Invitation } from '../data/userAnalyticsData';
import { toast } from 'sonner@2.0.3';

const roleColors: Record<string, string> = {
  'Admin': 'bg-[#5B6E49] text-white',
  'Accountant': 'bg-[#9BAE84] text-white',
  'Owner': 'bg-[#D9C58E] text-white',
  'Technician': 'bg-[#7AA7C7] text-white',
  'Client': 'bg-gray-500 text-white',
};

const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  'Sent': { bg: 'bg-secondary/10', text: 'text-secondary', icon: Mail },
  'Resent': { bg: 'bg-accent/10', text: 'text-accent', icon: RefreshCw },
  'Expired': { bg: 'bg-destructive/10', text: 'text-destructive', icon: AlertCircle },
};

export function InvitationsPanel() {
  const [invitations, setInvitations] = useState(pendingInvitations);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleResend = (invitation: Invitation) => {
    toast.success(`Invitation resent to ${invitation.email}`);
    // Update status
    setInvitations(invitations.map(inv => 
      inv.id === invitation.id ? { ...inv, status: 'Resent' as const } : inv
    ));
  };

  const handleRevoke = (invitation: Invitation) => {
    toast.success(`Invitation to ${invitation.email} revoked`);
    setInvitations(invitations.filter(inv => inv.id !== invitation.id));
  };

  return (
    <Card className="rounded-[24px] border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pending Invitations</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage user invitations and access requests
            </p>
          </div>
          <Badge className="bg-accent text-white rounded-xl">
            {invitations.length} Pending
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No Pending Invitations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              All invitations have been accepted or expired
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-[16px] border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Sent By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation, index) => {
                    const StatusIcon = statusColors[invitation.status].icon;
                    return (
                      <motion.tr
                        key={invitation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{invitation.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${roleColors[invitation.role]} rounded-lg text-xs`}>
                            {invitation.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`w-4 h-4 ${statusColors[invitation.status].text}`} />
                            <Badge className={`${statusColors[invitation.status].bg} ${statusColors[invitation.status].text} rounded-lg text-xs border-0`}>
                              {invitation.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(invitation.sentDate)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {invitation.sentBy}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {invitation.status !== 'Sent' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResend(invitation)}
                                className="rounded-xl gap-1"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Resend
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRevoke(invitation)}
                              className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {invitations.map((invitation, index) => {
                const StatusIcon = statusColors[invitation.status].icon;
                return (
                  <motion.div
                    key={invitation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border border-border rounded-[16px] space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <p className="font-medium text-sm">{invitation.email}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${roleColors[invitation.role]} rounded-lg text-xs`}>
                            {invitation.role}
                          </Badge>
                          <Badge className={`${statusColors[invitation.status].bg} ${statusColors[invitation.status].text} rounded-lg text-xs border-0`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {invitation.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Sent: {formatDate(invitation.sentDate)}</p>
                      <p>By: {invitation.sentBy}</p>
                    </div>

                    <div className="flex gap-2">
                      {invitation.status !== 'Sent' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResend(invitation)}
                          className="flex-1 rounded-xl gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Resend
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevoke(invitation)}
                        className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                        Revoke
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
