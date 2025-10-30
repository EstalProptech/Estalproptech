import { useState, useMemo } from "react";
import { 
  Plus, 
  RefreshCw, 
  Download, 
  Search,
  Eye,
  Mail,
  MoreVertical,
  Users as UsersIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { systemUsers, getUserStats, UserRole, UserStatus, SystemUser } from "../data/usersData";
import { userGrowthData, roleDistributionData, getUserTrends } from "../data/userAnalyticsData";
import { UserDetailsDrawer } from "./UserDetailsDrawer";
import { InvitationsPanel } from "./InvitationsPanel";
import { ActivityFeed } from "./ActivityFeed";
import { SystemAnalyticsTab } from "./SystemAnalyticsTab";
import { AdminIntelligenceDashboard } from "./AdminIntelligenceDashboard";
import { toast } from "sonner@2.0.3";
import { AnimatedCounter } from "./AnimatedCounter";

const roleColors: Record<UserRole, string> = {
  'Admin': 'bg-[#5B6E49] text-white',
  'Accountant': 'bg-[#9BAE84] text-white',
  'Owner': 'bg-[#D9C58E] text-white',
  'Technician': 'bg-[#7AA7C7] text-white',
  'Client': 'bg-gray-500 text-white',
};

const statusColors: Record<UserStatus, string> = {
  'Active': 'bg-secondary text-white',
  'Pending': 'bg-accent text-white',
  'Suspended': 'bg-destructive text-white',
};

type SortField = 'name' | 'email' | 'role' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function EnhancedUserManagementView() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sorting states
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Client' as UserRole,
    status: 'Pending' as UserStatus,
    phone: '',
    sendInvitation: true,
  });

  const stats = getUserStats();
  const trends = getUserTrends();

  // Filtered and sorted users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = systemUsers.filter(user => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !user.name.toLowerCase().includes(query) &&
          !user.email.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Role filter
      if (roleFilter !== 'All' && user.role !== roleFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'All' && user.status !== statusFilter) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchQuery, roleFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = () => {
    toast.success('User list refreshed!');
  };

  const handleExport = () => {
    toast.success('Exporting users to Excel...');
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Client',
      status: 'Pending',
      phone: '',
      sendInvitation: true,
    });
    setIsAddUserOpen(true);
  };

  const handleEditUser = (user: SystemUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone || '',
      sendInvitation: false,
    });
    setIsAddUserOpen(true);
    setIsDetailsDrawerOpen(false);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      toast.success(`User "${formData.name}" updated successfully!`);
    } else {
      const inviteMessage = formData.sendInvitation ? ' and invitation sent' : '';
      toast.success(`User "${formData.name}" created${inviteMessage}!`);
    }
    setIsAddUserOpen(false);
  };

  const handleViewUser = (user: SystemUser) => {
    setSelectedUser(user);
    setIsDetailsDrawerOpen(true);
  };

  const handleResendInvite = (user: SystemUser) => {
    toast.success(`Invitation resent to ${user.email}`);
  };

  const handleSuspendUser = () => {
    if (selectedUser) {
      const action = selectedUser.status === 'Suspended' ? 'reactivated' : 'suspended';
      toast.success(`User "${selectedUser.name}" ${action} successfully!`);
      setIsDetailsDrawerOpen(false);
    }
  };

  const handleResetPassword = () => {
    if (selectedUser) {
      toast.success(`Password reset email sent to ${selectedUser.email}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  const resetFilters = () => {
    setSearchQuery('');
    setRoleFilter('All');
    setStatusFilter('All');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1>User Management</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive user administration and analytics dashboard
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="rounded-[16px] gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-[16px] gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Button
            onClick={handleAddUser}
            className="rounded-[16px] gap-2 shadow-lg shadow-primary/30"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-muted/30 rounded-[16px]">
          <TabsTrigger value="overview" className="rounded-[12px]">Overview</TabsTrigger>
          <TabsTrigger value="users" className="rounded-[12px]">Users</TabsTrigger>
          <TabsTrigger value="invitations" className="rounded-[12px]">Invitations</TabsTrigger>
          <TabsTrigger value="activity" className="rounded-[12px]">Activity</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-[12px]">System Analytics</TabsTrigger>
          <TabsTrigger value="intelligence" className="rounded-[12px]">Admin Intelligence</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="rounded-[20px] border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-[16px] bg-primary/10 flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge className="bg-primary/10 text-primary rounded-xl border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {trends.growthRate}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-3xl mb-1">
                    <AnimatedCounter value={stats.total} />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    +{trends.currentMonthUsers - trends.previousMonthUsers} this month
                  </p>
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
                    <div className="w-12 h-12 rounded-[16px] bg-secondary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Active</p>
                  <p className="text-3xl mb-1 text-secondary">
                    <AnimatedCounter value={stats.active} />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.activePercentage}% of total
                  </p>
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
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-3xl mb-1 text-accent">
                    <AnimatedCounter value={stats.pending} />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Awaiting activation
                  </p>
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
                      <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Suspended</p>
                  <p className="text-3xl mb-1 text-destructive">
                    <AnimatedCounter value={stats.suspended} />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Inactive accounts
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="rounded-[24px] border-border">
                <CardHeader>
                  <CardTitle>User Growth Trend</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Last 6 months user registration
                  </p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis 
                        dataKey="month" 
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          padding: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--primary)', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Role Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card className="rounded-[24px] border-border">
                <CardHeader>
                  <CardTitle>Role Distribution</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    User breakdown by role type
                  </p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roleDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {roleDistributionData.map((entry, index) => (
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
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6 mt-6">
          {/* Filters */}
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3>Search & Filter</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Name or email..."
                        className="pl-10 rounded-[16px]"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="rounded-[16px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Roles</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Accountant">Accountant</SelectItem>
                        <SelectItem value="Owner">Owner</SelectItem>
                        <SelectItem value="Technician">Technician</SelectItem>
                        <SelectItem value="Client">Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="rounded-[16px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="rounded-[20px] border-border">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedUsers.length} of {systemUsers.length} users
                </p>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block rounded-[16px] border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('name')}
                          className="h-8 -ml-3"
                        >
                          User
                          <ArrowUpDown className="ml-2 w-3 h-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('email')}
                          className="h-8 -ml-3"
                        >
                          Email
                          <ArrowUpDown className="ml-2 w-3 h-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('role')}
                          className="h-8 -ml-3"
                        >
                          Role
                          <ArrowUpDown className="ml-2 w-3 h-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('status')}
                          className="h-8 -ml-3"
                        >
                          Status
                          <ArrowUpDown className="ml-2 w-3 h-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('createdAt')}
                          className="h-8 -ml-3"
                        >
                          Created
                          <ArrowUpDown className="ml-2 w-3 h-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-muted/30 cursor-pointer transition-colors"
                          onClick={() => handleViewUser(user)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                                <AvatarFallback className="bg-primary text-white">
                                  {getUserInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                {user.phone && (
                                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={`${roleColors[user.role]} rounded-lg`}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusColors[user.status]} rounded-lg`}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" className="rounded-xl">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-[16px]">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewUser(user);
                                }}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditUser(user);
                                }}>
                                  Edit User
                                </DropdownMenuItem>
                                {user.status === 'Pending' && (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleResendInvite(user);
                                  }}>
                                    <Mail className="w-4 h-4 mr-2" />
                                    Resend Invite
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {filteredAndSortedUsers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  filteredAndSortedUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleViewUser(user)}
                      className="p-4 border border-border rounded-[16px] space-y-3 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                            <AvatarFallback className="bg-primary text-white">
                              {getUserInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${roleColors[user.role]} rounded-lg text-xs`}>
                          {user.role}
                        </Badge>
                        <Badge className={`${statusColors[user.status]} rounded-lg text-xs`}>
                          {user.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Joined {formatDate(user.createdAt)}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations" className="space-y-6 mt-6">
          <InvitationsPanel />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6 mt-6">
          <ActivityFeed />
        </TabsContent>

        {/* System Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <SystemAnalyticsTab />
        </TabsContent>

        {/* Admin Intelligence Dashboard Tab */}
        <TabsContent value="intelligence" className="space-y-6 mt-6">
          <AdminIntelligenceDashboard />
        </TabsContent>
      </Tabs>

      {/* Add/Edit User Modal */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[24px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Update user information and permissions'
                : 'Create a new user account and send invitation'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="rounded-[16px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="rounded-[16px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+966 XX XXX XXXX"
                className="rounded-[16px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                >
                  <SelectTrigger id="role" className="rounded-[16px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Accountant">Accountant</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}
                >
                  <SelectTrigger id="status" className="rounded-[16px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!editingUser && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendInvitation"
                  checked={formData.sendInvitation}
                  onChange={(e) => setFormData({ ...formData, sendInvitation: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <Label htmlFor="sendInvitation" className="cursor-pointer">
                  Send invitation email
                </Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserOpen(false)}
              className="rounded-[16px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={!formData.name || !formData.email}
              className="rounded-[16px]"
            >
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Drawer */}
      <UserDetailsDrawer
        user={selectedUser}
        isOpen={isDetailsDrawerOpen}
        onClose={() => {
          setIsDetailsDrawerOpen(false);
          setSelectedUser(null);
        }}
        onEdit={() => selectedUser && handleEditUser(selectedUser)}
        onSuspend={handleSuspendUser}
        onResetPassword={handleResetPassword}
      />
    </div>
  );
}
