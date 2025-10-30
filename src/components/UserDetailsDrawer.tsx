import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Phone, Calendar, Clock, Shield, Building2, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { SystemUser } from "../data/usersData";

interface UserDetailsDrawerProps {
  user: SystemUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSuspend: () => void;
  onResetPassword: () => void;
}

const roleColors: Record<string, { bg: string; text: string; badge: string }> = {
  'Admin': { bg: 'bg-[#5B6E49]/10', text: 'text-[#5B6E49]', badge: 'bg-[#5B6E49]' },
  'Accountant': { bg: 'bg-[#9BAE84]/10', text: 'text-[#9BAE84]', badge: 'bg-[#9BAE84]' },
  'Owner': { bg: 'bg-[#D9C58E]/10', text: 'text-[#D9C58E]', badge: 'bg-[#D9C58E]' },
  'Technician': { bg: 'bg-[#7AA7C7]/10', text: 'text-[#7AA7C7]', badge: 'bg-[#7AA7C7]' },
  'Client': { bg: 'bg-gray-500/10', text: 'text-gray-500', badge: 'bg-gray-500' },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  'Active': { bg: 'bg-secondary/10', text: 'text-secondary' },
  'Pending': { bg: 'bg-accent/10', text: 'text-accent' },
  'Suspended': { bg: 'bg-destructive/10', text: 'text-destructive' },
};

export function UserDetailsDrawer({
  user,
  isOpen,
  onClose,
  onEdit,
  onSuspend,
  onResetPassword,
}: UserDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [permissions, setPermissions] = useState({
    dashboard: true,
    properties: user?.role === 'Admin' || user?.role === 'Owner',
    maintenance: user?.role === 'Admin' || user?.role === 'Owner' || user?.role === 'Technician',
    financial: user?.role === 'Admin' || user?.role === 'Accountant',
    analytics: user?.role === 'Admin' || user?.role === 'Accountant',
    clients: user?.role === 'Admin',
    users: user?.role === 'Admin',
    settings: true,
  });

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl">User Details</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  {user.role === 'Owner' && <TabsTrigger value="properties">Properties</TabsTrigger>}
                  {user.role !== 'Owner' && <TabsTrigger value="activity">Activity</TabsTrigger>}
                </TabsList>

                <ScrollArea className="h-[calc(100vh-280px)]">
                  <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4">
                    {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                    <AvatarFallback className={`${roleColors[user.role].badge} text-white text-xl`}>
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="mb-2">{user.name}</h3>
                  
                  <div className="flex gap-2 mb-3">
                    <Badge className={`${roleColors[user.role].badge} text-white rounded-xl`}>
                      {user.role}
                    </Badge>
                    <Badge className={`${statusColors[user.status].bg} ${statusColors[user.status].text} rounded-xl`}>
                      {user.status}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-3">
                  <h3>Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-[16px]">
                      <div className={`w-10 h-10 rounded-xl ${roleColors[user.role].bg} flex items-center justify-center`}>
                        <Mail className={`w-5 h-5 ${roleColors[user.role].text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm truncate">{user.email}</p>
                      </div>
                    </div>

                    {user.phone && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-[16px]">
                        <div className={`w-10 h-10 rounded-xl ${roleColors[user.role].bg} flex items-center justify-center`}>
                          <Phone className={`w-5 h-5 ${roleColors[user.role].text}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm">{user.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-[16px]">
                      <div className={`w-10 h-10 rounded-xl ${roleColors[user.role].bg} flex items-center justify-center`}>
                        <Calendar className={`w-5 h-5 ${roleColors[user.role].text}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Joined</p>
                        <p className="text-sm">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>

                    {user.lastLogin && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-[16px]">
                        <div className={`w-10 h-10 rounded-xl ${roleColors[user.role].bg} flex items-center justify-center`}>
                          <Clock className={`w-5 h-5 ${roleColors[user.role].text}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Last Login</p>
                          <p className="text-sm">{formatDate(user.lastLogin)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                  </TabsContent>

                  {/* Permissions Tab */}
                  <TabsContent value="permissions" className="space-y-4 mt-0">
                    <div className="space-y-3">
                      <h3>Module Access</h3>
                      <p className="text-sm text-muted-foreground">
                        Control which modules this user can access
                      </p>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(permissions).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-[16px]"
                        >
                          <Label htmlFor={key} className="capitalize cursor-pointer">
                            {key.replace('_', ' ')}
                          </Label>
                          <Switch
                            id={key}
                            checked={value}
                            onCheckedChange={() => togglePermission(key as keyof typeof permissions)}
                          />
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="p-4 bg-accent/10 rounded-[16px] border border-accent/20">
                      <p className="text-sm text-accent-foreground">
                        💡 Changes to permissions will take effect on next login
                      </p>
                    </div>
                  </TabsContent>

                  {/* Properties Tab (for Owners) */}
                  {user.role === 'Owner' && (
                    <TabsContent value="properties" className="space-y-4 mt-0">
                      <div className="space-y-3">
                        <h3>Assigned Properties</h3>
                        <p className="text-sm text-muted-foreground">
                          Properties managed by this owner
                        </p>
                      </div>

                      {user.assignedProperties && user.assignedProperties.length > 0 ? (
                        <div className="space-y-2">
                          {user.assignedProperties.map((property, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center justify-between p-4 bg-muted/30 rounded-[16px] hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{property}</p>
                                  <p className="text-xs text-muted-foreground">Active</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="rounded-xl">
                                View
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                          <p className="text-sm text-muted-foreground">No properties assigned</p>
                        </div>
                      )}
                    </TabsContent>
                  )}

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="space-y-4 mt-0">
                    <div className="space-y-3">
                      <h3>Recent Activity</h3>
                      <p className="text-sm text-muted-foreground">
                        User's recent actions and events
                      </p>
                    </div>

                    {user.activityLog && user.activityLog.length > 0 ? (
                      <div className="space-y-2">
                        {user.activityLog.map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 bg-muted/30 rounded-[16px] space-y-1"
                          >
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-muted-foreground" />
                              <p className="text-sm font-medium">{activity.action}</p>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">
                              {formatDate(activity.timestamp)}
                            </p>
                            {activity.details && (
                              <p className="text-xs text-muted-foreground pl-6">
                                {activity.details}
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="p-6 border-t border-border bg-background">
              <div className="space-y-3">

                <div className="grid gap-3">
                    <Button
                      onClick={onEdit}
                      variant="outline"
                      className="rounded-[16px] justify-start gap-3"
                    >
                      <Shield className="w-4 h-4" />
                      Edit Role & Permissions
                    </Button>
                    
                    <Button
                      onClick={onResetPassword}
                      variant="outline"
                      className="rounded-[16px] justify-start gap-3"
                    >
                      <Clock className="w-4 h-4" />
                      Reset Password
                    </Button>

                    {user.status !== 'Suspended' ? (
                      <Button
                        onClick={onSuspend}
                        variant="outline"
                        className="rounded-[16px] justify-start gap-3 text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                        Suspend Account
                      </Button>
                    ) : (
                      <Button
                        onClick={onSuspend}
                        variant="outline"
                        className="rounded-[16px] justify-start gap-3 text-secondary hover:text-secondary"
                      >
                        <Activity className="w-4 h-4" />
                        Reactivate Account
                      </Button>
                    )}
                  </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
