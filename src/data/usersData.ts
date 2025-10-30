export type UserRole = 'Admin' | 'Accountant' | 'Owner' | 'Technician' | 'Client';
export type UserStatus = 'Active' | 'Pending' | 'Suspended';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  assignedProperties?: string[];
  activityLog?: ActivityLogEntry[];
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export const systemUsers: SystemUser[] = [
  {
    id: 'user-1',
    name: 'Ahmed Al-Qahtani',
    email: 'admin@klz.sa',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    phone: '+966 50 123 4567',
    createdAt: '2025-10-20T08:30:00Z',
    lastLogin: '2025-10-21T14:30:00Z',
    activityLog: [
      {
        id: 'act-1',
        action: 'Logged in',
        timestamp: '2025-10-21T14:30:00Z',
      },
      {
        id: 'act-2',
        action: 'Updated user role',
        timestamp: '2025-10-21T12:15:00Z',
        details: 'Changed Nora Al-Otaibi from Client to Owner',
      },
      {
        id: 'act-3',
        action: 'Created new property',
        timestamp: '2025-10-21T10:00:00Z',
        details: 'Added Skyline Tower Unit 501',
      },
    ],
  },
  {
    id: 'user-2',
    name: 'Nora Al-Otaibi',
    email: 'owner@klz.sa',
    role: 'Owner',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    phone: '+966 55 234 5678',
    createdAt: '2025-09-15T10:00:00Z',
    lastLogin: '2025-10-21T09:45:00Z',
    assignedProperties: ['North View Tower', 'Al Arid Villa'],
    activityLog: [
      {
        id: 'act-4',
        action: 'Logged in',
        timestamp: '2025-10-21T09:45:00Z',
      },
      {
        id: 'act-5',
        action: 'Created maintenance request',
        timestamp: '2025-10-20T16:20:00Z',
        details: 'AC maintenance for North View Tower',
      },
    ],
  },
  {
    id: 'user-3',
    name: 'Fahad Al-Harbi',
    email: 'client@klz.sa',
    role: 'Client',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    phone: '+966 54 345 6789',
    createdAt: '2025-10-01T14:20:00Z',
    activityLog: [
      {
        id: 'act-6',
        action: 'Account created',
        timestamp: '2025-10-01T14:20:00Z',
        details: 'Invitation sent',
      },
    ],
  },
  {
    id: 'user-4',
    name: 'Khaled Technician',
    email: 'tech@klz.sa',
    role: 'Technician',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    phone: '+966 56 456 7890',
    createdAt: '2025-10-10T11:30:00Z',
    lastLogin: '2025-10-21T08:15:00Z',
    activityLog: [
      {
        id: 'act-7',
        action: 'Logged in',
        timestamp: '2025-10-21T08:15:00Z',
      },
      {
        id: 'act-8',
        action: 'Completed maintenance task',
        timestamp: '2025-10-20T17:30:00Z',
        details: 'Fixed AC unit at Green Park Residences',
      },
    ],
  },
  {
    id: 'user-5',
    name: 'Sara Al-Mansour',
    email: 'accountant@klz.sa',
    role: 'Accountant',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    phone: '+966 53 567 8901',
    createdAt: '2025-08-25T09:00:00Z',
    lastLogin: '2025-10-21T13:00:00Z',
    activityLog: [
      {
        id: 'act-9',
        action: 'Logged in',
        timestamp: '2025-10-21T13:00:00Z',
      },
      {
        id: 'act-10',
        action: 'Exported financial report',
        timestamp: '2025-10-21T11:30:00Z',
        details: 'Q3 2025 Financial Summary',
      },
    ],
  },
  {
    id: 'user-6',
    name: 'Mohammed Al-Zahrani',
    email: 'm.zahrani@example.sa',
    role: 'Owner',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
    phone: '+966 55 678 9012',
    createdAt: '2025-07-12T08:00:00Z',
    lastLogin: '2025-10-20T18:30:00Z',
    assignedProperties: ['Garden Villa 12', 'Urban Heights Unit 15A'],
    activityLog: [
      {
        id: 'act-11',
        action: 'Logged in',
        timestamp: '2025-10-20T18:30:00Z',
      },
    ],
  },
  {
    id: 'user-7',
    name: 'Layla Ahmed',
    email: 'layla.ahmed@example.sa',
    role: 'Client',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
    phone: '+966 54 789 0123',
    createdAt: '2025-09-20T10:15:00Z',
    lastLogin: '2025-10-21T07:45:00Z',
    activityLog: [
      {
        id: 'act-12',
        action: 'Logged in',
        timestamp: '2025-10-21T07:45:00Z',
      },
      {
        id: 'act-13',
        action: 'Submitted maintenance request',
        timestamp: '2025-10-21T10:30:00Z',
        details: 'Downtown Loft 8B - AC issue',
      },
    ],
  },
  {
    id: 'user-8',
    name: 'Omar Hassan',
    email: 'omar.hassan@example.sa',
    role: 'Owner',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100',
    phone: '+966 56 890 1234',
    createdAt: '2025-06-05T14:00:00Z',
    lastLogin: '2025-10-21T11:20:00Z',
    assignedProperties: ['Green Park Residences'],
    activityLog: [
      {
        id: 'act-14',
        action: 'Logged in',
        timestamp: '2025-10-21T11:20:00Z',
      },
    ],
  },
  {
    id: 'user-9',
    name: 'Fatima Al-Saud',
    email: 'fatima.saud@example.sa',
    role: 'Client',
    status: 'Suspended',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100',
    phone: '+966 52 901 2345',
    createdAt: '2025-05-18T09:30:00Z',
    lastLogin: '2025-10-10T15:00:00Z',
    activityLog: [
      {
        id: 'act-15',
        action: 'Account suspended',
        timestamp: '2025-10-15T10:00:00Z',
        details: 'Payment overdue',
      },
    ],
  },
  {
    id: 'user-10',
    name: 'Ali Hassan',
    email: 'ali.hassan@klz.sa',
    role: 'Technician',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    phone: '+966 55 012 3456',
    createdAt: '2025-04-10T08:00:00Z',
    lastLogin: '2025-10-21T06:30:00Z',
    activityLog: [
      {
        id: 'act-16',
        action: 'Logged in',
        timestamp: '2025-10-21T06:30:00Z',
      },
      {
        id: 'act-17',
        action: 'Updated maintenance status',
        timestamp: '2025-10-20T14:20:00Z',
        details: 'North View Tower AC - In Progress',
      },
    ],
  },
  {
    id: 'user-11',
    name: 'Rashed Al-Mansour',
    email: 'rashed.m@example.sa',
    role: 'Owner',
    status: 'Pending',
    phone: '+966 54 123 4567',
    createdAt: '2025-10-18T16:00:00Z',
    assignedProperties: ['Palm Residences Villa 5'],
    activityLog: [
      {
        id: 'act-18',
        action: 'Account created',
        timestamp: '2025-10-18T16:00:00Z',
        details: 'Invitation sent',
      },
    ],
  },
  {
    id: 'user-12',
    name: 'Noor Abdullah',
    email: 'noor.abdullah@example.sa',
    role: 'Client',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    phone: '+966 53 234 5678',
    createdAt: '2025-08-08T12:00:00Z',
    lastLogin: '2025-10-21T10:00:00Z',
    activityLog: [
      {
        id: 'act-19',
        action: 'Logged in',
        timestamp: '2025-10-21T10:00:00Z',
      },
    ],
  },
];

export const getUserStats = () => {
  const total = systemUsers.length;
  const active = systemUsers.filter(u => u.status === 'Active').length;
  const pending = systemUsers.filter(u => u.status === 'Pending').length;
  const suspended = systemUsers.filter(u => u.status === 'Suspended').length;

  return {
    total,
    active,
    pending,
    suspended,
    activePercentage: Math.round((active / total) * 100),
    pendingPercentage: Math.round((pending / total) * 100),
  };
};

export const getRoleStats = () => {
  const roles = systemUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<UserRole, number>);

  return roles;
};
