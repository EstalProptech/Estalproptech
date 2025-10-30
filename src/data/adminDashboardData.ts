// Admin Dashboard Data

export interface AdminKPI {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend: number;
  trendLabel: string;
  icon: string;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  avatar?: string;
}

export const adminKPIs: AdminKPI[] = [
  {
    id: 'total-properties',
    label: 'Total Properties',
    value: 50,
    trend: 4.2,
    trendLabel: '+4.2% from last month',
    icon: 'building',
  },
  {
    id: 'monthly-revenue',
    label: 'Monthly Revenue',
    value: 120000,
    unit: 'SAR',
    trend: 7.3,
    trendLabel: '+7.3% from last month',
    icon: 'dollar',
  },
  {
    id: 'total-expenses',
    label: 'Total Expenses',
    value: 50000,
    unit: 'SAR',
    trend: -5.2,
    trendLabel: '-5.2% from last month',
    icon: 'trending-down',
  },
];

export const revenueExpensesData = [
  { month: 'May', revenue: 1650000, expenses: 820000 },
  { month: 'Jun', revenue: 1720000, expenses: 850000 },
  { month: 'Jul', revenue: 1780000, expenses: 795000 },
  { month: 'Aug', revenue: 1850000, expenses: 840000 },
  { month: 'Sep', revenue: 1880000, expenses: 810000 },
  { month: 'Oct', revenue: 1920000, expenses: 850000 },
];

export const roleDistributionData = [
  { name: 'Owners', value: 45, color: '#5B6E49' },
  { name: 'Accountants', value: 12, color: '#9BAE84' },
  { name: 'Technicians', value: 28, color: '#D9C58E' },
  { name: 'Admins', value: 4, color: '#D6E0D0' },
];

export const recentActivities: RecentActivity[] = [
  {
    id: 'act-1',
    user: 'Ahmed Al-Qahtani',
    action: 'added property',
    target: 'Tower 12',
    timestamp: '2 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: 'act-2',
    user: 'Khaled Ibrahim',
    action: 'completed maintenance request',
    target: 'AC Repair - Building A',
    timestamp: '15 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
  {
    id: 'act-3',
    user: 'Sarah Al-Harbi',
    action: 'generated financial report',
    target: 'Q3 2025 Report',
    timestamp: '1 hour ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: 'act-4',
    user: 'Mohammed Ali',
    action: 'updated property status',
    target: 'Villa 24',
    timestamp: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
  {
    id: 'act-5',
    user: 'Fatima Khan',
    action: 'invited new user',
    target: 'omar.rashid@example.com',
    timestamp: '3 hours ago',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
];

export const quickAccessModules = [
  {
    id: 'users',
    title: 'Users Management',
    description: 'Manage users and permissions',
    icon: 'users-cog',
    route: 'users',
  },
  {
    id: 'financial',
    title: 'Financial Reports',
    description: 'View revenue and expenses',
    icon: 'chart',
    route: 'financial-reports',
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    description: 'Track service requests',
    icon: 'wrench',
    route: 'maintenance',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'System performance insights',
    icon: 'bar-chart',
    route: 'analytics',
  },
];

export const aiInsight = '💡 Revenue up 7% this month, primarily from North Riyadh.';
