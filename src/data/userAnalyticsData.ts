import { UserRole } from './usersData';

// User growth over the last 6 months
export const userGrowthData = [
  { month: 'May', users: 28 },
  { month: 'Jun', users: 35 },
  { month: 'Jul', users: 42 },
  { month: 'Aug', users: 51 },
  { month: 'Sep', users: 58 },
  { month: 'Oct', users: 68 },
];

// Role distribution for donut chart
export const roleDistributionData = [
  { name: 'Admin', value: 1, color: '#5B6E49' },
  { name: 'Accountant', value: 1, color: '#9BAE84' },
  { name: 'Owner', value: 4, color: '#D9C58E' },
  { name: 'Technician', value: 2, color: '#7AA7C7' },
  { name: 'Client', value: 4, color: '#999999' },
];

// Pending invitations
export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  sentDate: string;
  status: 'Sent' | 'Resent' | 'Expired';
  sentBy: string;
}

export const pendingInvitations: Invitation[] = [
  {
    id: 'inv-1',
    email: 'sarah.khalid@example.sa',
    role: 'Owner',
    sentDate: '2025-10-19T10:00:00Z',
    status: 'Sent',
    sentBy: 'Ahmed Al-Qahtani',
  },
  {
    id: 'inv-2',
    email: 'tech.service@klz.sa',
    role: 'Technician',
    sentDate: '2025-10-15T14:30:00Z',
    status: 'Resent',
    sentBy: 'Ahmed Al-Qahtani',
  },
  {
    id: 'inv-3',
    email: 'new.client@example.com',
    role: 'Client',
    sentDate: '2025-10-10T09:00:00Z',
    status: 'Expired',
    sentBy: 'Ahmed Al-Qahtani',
  },
  {
    id: 'inv-4',
    email: 'finance.lead@klz.sa',
    role: 'Accountant',
    sentDate: '2025-10-18T16:00:00Z',
    status: 'Sent',
    sentBy: 'Ahmed Al-Qahtani',
  },
];

// Activity log for the system
export interface SystemActivity {
  id: string;
  type: 'user_created' | 'user_updated' | 'user_suspended' | 'user_activated' | 'role_changed' | 'password_reset' | 'invitation_sent';
  actor: string;
  target: string;
  details: string;
  timestamp: string;
  critical?: boolean;
}

export const systemActivities: SystemActivity[] = [
  {
    id: 'act-1',
    type: 'user_suspended',
    actor: 'Ahmed Al-Qahtani',
    target: 'Fatima Al-Saud',
    details: 'Account suspended due to payment overdue',
    timestamp: '2025-10-21T14:30:00Z',
    critical: true,
  },
  {
    id: 'act-2',
    type: 'role_changed',
    actor: 'Ahmed Al-Qahtani',
    target: 'Nora Al-Otaibi',
    details: 'Role changed from Client to Owner',
    timestamp: '2025-10-21T12:15:00Z',
  },
  {
    id: 'act-3',
    type: 'user_created',
    actor: 'Ahmed Al-Qahtani',
    target: 'Ali Hassan',
    details: 'New Technician account created',
    timestamp: '2025-10-21T10:00:00Z',
  },
  {
    id: 'act-4',
    type: 'password_reset',
    actor: 'Ahmed Al-Qahtani',
    target: 'Layla Ahmed',
    details: 'Password reset email sent',
    timestamp: '2025-10-21T09:30:00Z',
  },
  {
    id: 'act-5',
    type: 'invitation_sent',
    actor: 'Ahmed Al-Qahtani',
    target: 'sarah.khalid@example.sa',
    details: 'Invitation sent for Owner role',
    timestamp: '2025-10-19T10:00:00Z',
  },
  {
    id: 'act-6',
    type: 'user_activated',
    actor: 'Ahmed Al-Qahtani',
    target: 'Omar Hassan',
    details: 'Account activated after verification',
    timestamp: '2025-10-18T15:45:00Z',
  },
  {
    id: 'act-7',
    type: 'user_updated',
    actor: 'Ahmed Al-Qahtani',
    target: 'Mohammed Al-Zahrani',
    details: 'Updated contact information',
    timestamp: '2025-10-18T11:20:00Z',
  },
  {
    id: 'act-8',
    type: 'invitation_sent',
    actor: 'Ahmed Al-Qahtani',
    target: 'finance.lead@klz.sa',
    details: 'Invitation sent for Accountant role',
    timestamp: '2025-10-18T16:00:00Z',
  },
  {
    id: 'act-9',
    type: 'role_changed',
    actor: 'Ahmed Al-Qahtani',
    target: 'Khaled Technician',
    details: 'Permissions updated for maintenance module',
    timestamp: '2025-10-17T14:00:00Z',
  },
  {
    id: 'act-10',
    type: 'user_created',
    actor: 'Ahmed Al-Qahtani',
    target: 'Noor Abdullah',
    details: 'New Client account created',
    timestamp: '2025-10-16T13:30:00Z',
  },
];

// Calculate trends
export const getUserTrends = () => {
  const currentMonth = userGrowthData[userGrowthData.length - 1].users;
  const previousMonth = userGrowthData[userGrowthData.length - 2].users;
  const growthRate = ((currentMonth - previousMonth) / previousMonth) * 100;

  return {
    currentMonthUsers: currentMonth,
    previousMonthUsers: previousMonth,
    growthRate: Math.round(growthRate * 10) / 10,
    isPositive: growthRate > 0,
  };
};
