// Admin Intelligence Dashboard Data
export interface KPIData {
  id: string;
  title: string;
  value: number;
  unit?: string;
  trend: number;
  trendLabel: string;
  icon: string;
  sparklineData: number[];
  color: string;
  tooltip: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'property' | 'maintenance' | 'financial' | 'user';
  icon: string;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'stable';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface AIInsight {
  id: string;
  text: string;
  icon: string;
  category: 'growth' | 'performance' | 'optimization';
}

// KPI Cards Data
export const kpiData: KPIData[] = [
  {
    id: 'total-users',
    title: 'Total Users',
    value: 1247,
    trend: 12.5,
    trendLabel: '+12.5% from last month',
    icon: 'users',
    sparklineData: [850, 920, 980, 1050, 1120, 1180, 1247],
    color: '#9BAE84',
    tooltip: 'Active users across all roles: 892 Owners, 245 Accountants, 110 Admins',
  },
  {
    id: 'active-properties',
    title: 'Active Properties',
    value: 3842,
    trend: 8.3,
    trendLabel: '+8.3% from last month',
    icon: 'building',
    sparklineData: [3200, 3350, 3480, 3590, 3680, 3760, 3842],
    color: '#5B6E49',
    tooltip: 'Residential: 2,841 | Commercial: 756 | Mixed-use: 245',
  },
  {
    id: 'monthly-revenue',
    title: 'Monthly Revenue',
    value: 487500,
    unit: 'SAR',
    trend: 15.2,
    trendLabel: '+15.2% from last month',
    icon: 'dollar',
    sparklineData: [380000, 395000, 410000, 428000, 445000, 465000, 487500],
    color: '#D9C58E',
    tooltip: 'Rent: 425,000 SAR | Service fees: 45,500 SAR | Other: 17,000 SAR',
  },
  {
    id: 'maintenance-requests',
    title: 'Maintenance Requests',
    value: 156,
    trend: -8.2,
    trendLabel: '-8.2% from last month',
    icon: 'wrench',
    sparklineData: [195, 185, 178, 172, 165, 160, 156],
    color: '#9BAE84',
    tooltip: 'Open: 42 | In Progress: 68 | Completed: 46',
  },
  {
    id: 'occupancy-rate',
    title: 'Occupancy Rate',
    value: 94.7,
    unit: '%',
    trend: 2.1,
    trendLabel: '+2.1% from last month',
    icon: 'percent',
    sparklineData: [91.2, 91.8, 92.5, 93.1, 93.8, 94.3, 94.7],
    color: '#5B6E49',
    tooltip: 'Occupied: 3,638 units | Vacant: 204 units',
  },
  {
    id: 'system-health',
    title: 'System Health',
    value: 99.8,
    unit: '%',
    trend: 0.2,
    trendLabel: '+0.2% uptime',
    icon: 'check',
    sparklineData: [99.4, 99.5, 99.6, 99.7, 99.7, 99.8, 99.8],
    color: '#9BAE84',
    tooltip: 'Uptime: 99.8% | Avg Response: 145ms | Active Sessions: 1,247',
  },
];

// User Growth Data for Line Chart
export const userGrowthData = [
  { month: 'Jan', users: 850, sessions: 3200 },
  { month: 'Feb', users: 920, sessions: 3500 },
  { month: 'Mar', users: 980, sessions: 3800 },
  { month: 'Apr', users: 1050, sessions: 4100 },
  { month: 'May', users: 1120, sessions: 4350 },
  { month: 'Jun', users: 1180, sessions: 4600 },
  { month: 'Jul', users: 1247, sessions: 4920 },
];

// Role Distribution Data for Donut Chart
export const roleDistributionData = [
  { name: 'Owners', value: 892, color: '#5B6E49' },
  { name: 'Accountants', value: 245, color: '#9BAE84' },
  { name: 'Admins', value: 110, color: '#D9C58E' },
];

// Revenue vs Maintenance Cost Data for Bar Chart
export const revenueComparisonData = [
  { month: 'Jan', revenue: 395000, maintenance: 82000 },
  { month: 'Feb', revenue: 410000, maintenance: 78000 },
  { month: 'Mar', revenue: 425000, maintenance: 85000 },
  { month: 'Apr', revenue: 438000, maintenance: 79000 },
  { month: 'May', revenue: 455000, maintenance: 81000 },
  { month: 'Jun', revenue: 472000, maintenance: 76000 },
  { month: 'Jul', revenue: 487500, maintenance: 74000 },
];

// Active Sessions Data for Area Chart
export const activeSessionsData = [
  { time: '00:00', sessions: 145 },
  { time: '04:00', sessions: 89 },
  { time: '08:00', sessions: 456 },
  { time: '12:00', sessions: 892 },
  { time: '16:00', sessions: 1247 },
  { time: '20:00', sessions: 678 },
  { time: '23:59', sessions: 234 },
];

// Activity Feed Data
export const activityFeedData: ActivityItem[] = [
  {
    id: 'act-1',
    user: 'Ahmed Al-Mansour',
    action: 'added a new property "Marina Tower 3"',
    timestamp: '2 minutes ago',
    type: 'property',
    icon: 'building',
  },
  {
    id: 'act-2',
    user: 'Khaled Ibrahim',
    action: 'closed maintenance ticket #MT-1247',
    timestamp: '8 minutes ago',
    type: 'maintenance',
    icon: 'wrench',
  },
  {
    id: 'act-3',
    user: 'Reem Al-Shahrani',
    action: 'exported financial report for Q2 2025',
    timestamp: '15 minutes ago',
    type: 'financial',
    icon: 'file',
  },
  {
    id: 'act-4',
    user: 'Sara Mohamed',
    action: 'updated lease contract for Unit 245',
    timestamp: '23 minutes ago',
    type: 'property',
    icon: 'file-text',
  },
  {
    id: 'act-5',
    user: 'Omar Khalifa',
    action: 'approved maintenance request #MT-1256',
    timestamp: '31 minutes ago',
    type: 'maintenance',
    icon: 'check-circle',
  },
  {
    id: 'act-6',
    user: 'Fatima Hassan',
    action: 'processed payment of 12,500 SAR',
    timestamp: '42 minutes ago',
    type: 'financial',
    icon: 'dollar-sign',
  },
  {
    id: 'act-7',
    user: 'Ali Al-Dosari',
    action: 'invited new user (Accountant)',
    timestamp: '1 hour ago',
    type: 'user',
    icon: 'user-plus',
  },
  {
    id: 'act-8',
    user: 'Nora Abdullah',
    action: 'updated property details for "Sky Gardens"',
    timestamp: '1 hour ago',
    type: 'property',
    icon: 'edit',
  },
];

// System Alerts Data
export const systemAlertsData: Alert[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    message: 'User account "khalid.tech@klz.sa" has been suspended due to multiple failed login attempts',
    timestamp: '5 minutes ago',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    severity: 'warning',
    message: 'Property data sync delayed for 3 properties - retry in progress',
    timestamp: '18 minutes ago',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    severity: 'warning',
    message: 'Missing payment data for 12 lease contracts due today',
    timestamp: '35 minutes ago',
    acknowledged: true,
  },
  {
    id: 'alert-4',
    severity: 'stable',
    message: 'System backup completed successfully (4.2 GB backed up)',
    timestamp: '2 hours ago',
    acknowledged: true,
  },
  {
    id: 'alert-5',
    severity: 'stable',
    message: 'All scheduled maintenance tasks completed without errors',
    timestamp: '3 hours ago',
    acknowledged: true,
  },
];

// AI Insights Data
export const aiInsightsData: AIInsight[] = [
  {
    id: 'insight-1',
    text: 'User growth increased by 12% this month, primarily driven by new property owners registering in the Marina District.',
    icon: 'trending-up',
    category: 'growth',
  },
  {
    id: 'insight-2',
    text: 'Maintenance requests dropped 8% compared to last week, indicating improved property condition and preventive maintenance effectiveness.',
    icon: 'activity',
    category: 'performance',
  },
  {
    id: 'insight-3',
    text: 'System uptime remains at 99.8% with average response time of 145ms - exceeding SLA targets by 0.3%.',
    icon: 'zap',
    category: 'performance',
  },
  {
    id: 'insight-4',
    text: 'Revenue per property increased by 15% this quarter. Consider expanding premium services to capitalize on this trend.',
    icon: 'lightbulb',
    category: 'optimization',
  },
  {
    id: 'insight-5',
    text: 'Occupancy rate improved to 94.7%, with the highest demand in residential properties during Q2.',
    icon: 'pie-chart',
    category: 'growth',
  },
  {
    id: 'insight-6',
    text: 'Peak usage hours are between 12:00-16:00. Consider scheduling system maintenance during off-peak times (00:00-06:00).',
    icon: 'clock',
    category: 'optimization',
  },
];

// Quick Access Cards Data
export interface QuickAccessCard {
  id: string;
  title: string;
  icon: string;
  targetView: string;
  stat: string;
  statLabel: string;
  color: string;
}

export const quickAccessCards: QuickAccessCard[] = [
  {
    id: 'qa-financial',
    title: 'Financial Reports',
    icon: 'file-bar-chart',
    targetView: 'financial-reports',
    stat: '487.5K',
    statLabel: 'Monthly Revenue',
    color: '#D9C58E',
  },
  {
    id: 'qa-maintenance',
    title: 'Maintenance Overview',
    icon: 'wrench',
    targetView: 'maintenance',
    stat: '42',
    statLabel: 'Open Requests',
    color: '#9BAE84',
  },
  {
    id: 'qa-users',
    title: 'User Management',
    icon: 'users',
    targetView: 'users',
    stat: '1,247',
    statLabel: 'Active Users',
    color: '#5B6E49',
  },
  {
    id: 'qa-properties',
    title: 'Property Directory',
    icon: 'building-2',
    targetView: 'properties',
    stat: '3,842',
    statLabel: 'Total Properties',
    color: '#9BAE84',
  },
];
