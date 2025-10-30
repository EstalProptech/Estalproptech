// System Analytics Data for User Management

// Login activity over the last 7 days
export const loginActivityData = [
  { day: 'Mon', logins: 45, uniqueUsers: 38 },
  { day: 'Tue', logins: 52, uniqueUsers: 42 },
  { day: 'Wed', logins: 48, uniqueUsers: 40 },
  { day: 'Thu', logins: 61, uniqueUsers: 48 },
  { day: 'Fri', logins: 38, uniqueUsers: 35 },
  { day: 'Sat', logins: 28, uniqueUsers: 25 },
  { day: 'Sun', logins: 32, uniqueUsers: 28 },
];

// Peak usage hours (24-hour format)
export const peakHoursData = [
  { hour: '00:00', users: 2 },
  { hour: '02:00', users: 1 },
  { hour: '04:00', users: 0 },
  { hour: '06:00', users: 3 },
  { hour: '08:00', users: 18 },
  { hour: '09:00', users: 32 },
  { hour: '10:00', users: 45 },
  { hour: '11:00', users: 52 },
  { hour: '12:00', users: 38 },
  { hour: '13:00', users: 41 },
  { hour: '14:00', users: 48 },
  { hour: '15:00', users: 44 },
  { hour: '16:00', users: 35 },
  { hour: '17:00', users: 28 },
  { hour: '18:00', users: 22 },
  { hour: '19:00', users: 15 },
  { hour: '20:00', users: 12 },
  { hour: '21:00', users: 8 },
  { hour: '22:00', users: 5 },
  { hour: '23:00', users: 3 },
];

// Module usage statistics
export const moduleUsageData = [
  { module: 'Dashboard', visits: 856, avgDuration: '3m 45s', color: '#9BAE84' },
  { module: 'Properties', visits: 624, avgDuration: '5m 20s', color: '#5B6E49' },
  { module: 'Maintenance', visits: 512, avgDuration: '4m 10s', color: '#D9C58E' },
  { module: 'Financial', visits: 445, avgDuration: '6m 30s', color: '#7AA7C7' },
  { module: 'Analytics', visits: 382, avgDuration: '7m 15s', color: '#C5B6C7' },
  { module: 'Clients', visits: 298, avgDuration: '3m 55s', color: '#999999' },
  { module: 'Settings', visits: 186, avgDuration: '2m 40s', color: '#D6E0D0' },
];

// Session duration distribution
export const sessionDurationData = [
  { duration: '0-5 min', count: 145, percentage: 35 },
  { duration: '5-15 min', count: 168, percentage: 40 },
  { duration: '15-30 min', count: 72, percentage: 17 },
  { duration: '30-60 min', count: 28, percentage: 7 },
  { duration: '60+ min', count: 7, percentage: 1 },
];

// User engagement by role
export const roleEngagementData = [
  { 
    role: 'Admin', 
    avgSessionDuration: 28, 
    avgLoginsPerWeek: 18, 
    mostUsedModule: 'Dashboard',
    color: '#5B6E49'
  },
  { 
    role: 'Owner', 
    avgSessionDuration: 22, 
    avgLoginsPerWeek: 12, 
    mostUsedModule: 'Properties',
    color: '#D9C58E'
  },
  { 
    role: 'Accountant', 
    avgSessionDuration: 35, 
    avgLoginsPerWeek: 15, 
    mostUsedModule: 'Financial',
    color: '#9BAE84'
  },
  { 
    role: 'Technician', 
    avgSessionDuration: 18, 
    avgLoginsPerWeek: 20, 
    mostUsedModule: 'Maintenance',
    color: '#7AA7C7'
  },
  { 
    role: 'Client', 
    avgSessionDuration: 12, 
    avgLoginsPerWeek: 6, 
    mostUsedModule: 'Dashboard',
    color: '#999999'
  },
];

// Device and browser statistics
export const deviceStatsData = [
  { name: 'Desktop', value: 68, color: '#9BAE84' },
  { name: 'Mobile', value: 25, color: '#D9C58E' },
  { name: 'Tablet', value: 7, color: '#7AA7C7' },
];

export const browserStatsData = [
  { name: 'Chrome', value: 52, color: '#5B6E49' },
  { name: 'Safari', value: 28, color: '#9BAE84' },
  { name: 'Firefox', value: 12, color: '#D9C58E' },
  { name: 'Edge', value: 6, color: '#7AA7C7' },
  { name: 'Other', value: 2, color: '#C5B6C7' },
];

// System performance metrics
export const performanceMetrics = {
  avgPageLoadTime: 1.2, // seconds
  avgApiResponseTime: 245, // milliseconds
  uptime: 99.8, // percentage
  errorRate: 0.15, // percentage
  activeSessionsPeak: 52,
  dataTransferredToday: 2.4, // GB
};

// Top performing users (most active)
export const topActiveUsers = [
  { 
    name: 'Ahmed Al-Qahtani', 
    role: 'Admin', 
    logins: 45, 
    totalTime: '12h 30m',
    actionsPerformed: 342
  },
  { 
    name: 'Sara Al-Mansour', 
    role: 'Accountant', 
    logins: 38, 
    totalTime: '18h 15m',
    actionsPerformed: 285
  },
  { 
    name: 'Nora Al-Otaibi', 
    role: 'Owner', 
    logins: 32, 
    totalTime: '9h 45m',
    actionsPerformed: 198
  },
  { 
    name: 'Khaled Technician', 
    role: 'Technician', 
    logins: 42, 
    totalTime: '14h 20m',
    actionsPerformed: 256
  },
  { 
    name: 'Ali Hassan', 
    role: 'Technician', 
    logins: 40, 
    totalTime: '13h 10m',
    actionsPerformed: 234
  },
];

// User retention data (7-day, 14-day, 30-day)
export const retentionData = [
  { period: '7-Day', percentage: 85, users: 58 },
  { period: '14-Day', percentage: 76, users: 52 },
  { period: '30-Day', percentage: 68, users: 46 },
];

// Failed login attempts (security monitoring)
export const failedLoginAttempts = [
  { 
    email: 'unknown@example.com', 
    attempts: 8, 
    lastAttempt: '2025-10-21T14:23:00Z',
    ipAddress: '192.168.1.45'
  },
  { 
    email: 'test@klz.sa', 
    attempts: 5, 
    lastAttempt: '2025-10-21T12:15:00Z',
    ipAddress: '192.168.1.78'
  },
  { 
    email: 'admin@test.com', 
    attempts: 4, 
    lastAttempt: '2025-10-21T09:30:00Z',
    ipAddress: '192.168.1.92'
  },
];

// API endpoints usage
export const apiEndpointsUsage = [
  { endpoint: '/api/properties', calls: 1245, avgResponseTime: 180 },
  { endpoint: '/api/users', calls: 986, avgResponseTime: 150 },
  { endpoint: '/api/maintenance', calls: 842, avgResponseTime: 220 },
  { endpoint: '/api/financial', calls: 723, avgResponseTime: 310 },
  { endpoint: '/api/analytics', calls: 654, avgResponseTime: 280 },
];

// Calculate system health score
export const getSystemHealthScore = () => {
  const uptimeScore = performanceMetrics.uptime;
  const performanceScore = 100 - (performanceMetrics.avgPageLoadTime * 20); // Lower is better
  const errorScore = 100 - (performanceMetrics.errorRate * 100);
  
  const overallScore = (uptimeScore + performanceScore + errorScore) / 3;
  
  return {
    overall: Math.round(overallScore),
    uptime: performanceMetrics.uptime,
    performance: Math.round(performanceScore),
    errorRate: performanceMetrics.errorRate,
    status: overallScore >= 95 ? 'Excellent' : overallScore >= 85 ? 'Good' : overallScore >= 70 ? 'Fair' : 'Poor'
  };
};
