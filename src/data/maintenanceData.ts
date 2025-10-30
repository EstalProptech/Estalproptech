export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  category: 'AC' | 'Plumbing' | 'Electrical' | 'Cleaning' | 'Other';
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'New' | 'In Progress' | 'Completed' | 'Canceled';
  assignedTo: string | null;
  assignedToId: string | null;
  createdBy: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  attachments?: string[];
  estimatedCost?: number;
  actualCost?: number;
}

export interface MaintenanceComment {
  id: string;
  requestId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string[];
  phone: string;
  email: string;
  availability: boolean;
  avatar: string;
  tasksCompleted: number;
  averageRating: number;
}

export const technicians: Technician[] = [
  {
    id: 'tech-1',
    name: 'Ali Hassan',
    specialty: ['AC', 'Electrical'],
    phone: '+966 55 123 4567',
    email: 'ali.hassan@klz.com',
    availability: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    tasksCompleted: 156,
    averageRating: 4.8,
  },
  {
    id: 'tech-2',
    name: 'Mohammed Ali',
    specialty: ['Plumbing'],
    phone: '+966 55 234 5678',
    email: 'mohammed.ali@klz.com',
    availability: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    tasksCompleted: 142,
    averageRating: 4.9,
  },
  {
    id: 'tech-3',
    name: 'Sara Al-Rashid',
    specialty: ['Cleaning', 'Other'],
    phone: '+966 55 345 6789',
    email: 'sara.rashid@klz.com',
    availability: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    tasksCompleted: 98,
    averageRating: 4.7,
  },
  {
    id: 'tech-4',
    name: 'Ahmed Khalil',
    specialty: ['Electrical', 'Other'],
    phone: '+966 55 456 7890',
    email: 'ahmed.khalil@klz.com',
    availability: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    tasksCompleted: 187,
    averageRating: 4.9,
  },
  {
    id: 'tech-5',
    name: 'Fatima Khan',
    specialty: ['AC', 'Plumbing'],
    phone: '+966 55 567 8901',
    email: 'fatima.khan@klz.com',
    availability: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    tasksCompleted: 124,
    averageRating: 4.6,
  },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'MNT-001',
    propertyId: 'prop-1',
    propertyName: 'North View Tower - Unit 402',
    category: 'AC',
    description: 'Air conditioning not cooling properly. Temperature remains at 28°C even when set to 18°C.',
    priority: 'Urgent',
    status: 'In Progress',
    assignedTo: 'Ali Hassan',
    assignedToId: 'tech-1',
    createdBy: 'Sarah Johnson',
    createdById: 'user-1',
    createdAt: '2025-10-20T09:30:00Z',
    updatedAt: '2025-10-20T14:20:00Z',
    attachments: [
      'https://images.unsplash.com/photo-1631545806609-c4c82f5d4c5a?w=400',
    ],
    estimatedCost: 850,
  },
  {
    id: 'MNT-002',
    propertyId: 'prop-2',
    propertyName: 'Al Arid Villa',
    category: 'Plumbing',
    description: 'Leak detected in the master bathroom under the sink. Water dripping continuously.',
    priority: 'Medium',
    status: 'Completed',
    assignedTo: 'Mohammed Ali',
    assignedToId: 'tech-2',
    createdBy: 'Ahmad Malik',
    createdById: 'user-2',
    createdAt: '2025-10-18T11:15:00Z',
    updatedAt: '2025-10-19T16:30:00Z',
    completedAt: '2025-10-19T16:30:00Z',
    attachments: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
    ],
    estimatedCost: 450,
    actualCost: 380,
  },
  {
    id: 'MNT-003',
    propertyId: 'prop-3',
    propertyName: 'Green Park Residences - Unit 205',
    category: 'Electrical',
    description: 'Living room lights flickering intermittently. Issue started 3 days ago.',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Ahmed Khalil',
    assignedToId: 'tech-4',
    createdBy: 'Omar Hassan',
    createdById: 'user-3',
    createdAt: '2025-10-19T14:45:00Z',
    updatedAt: '2025-10-20T10:15:00Z',
    estimatedCost: 320,
  },
  {
    id: 'MNT-004',
    propertyId: 'prop-4',
    propertyName: 'Skyline Apartments - Unit 1203',
    category: 'Cleaning',
    description: 'Deep cleaning required after tenant move-out. Unit needs to be ready for new tenant.',
    priority: 'Medium',
    status: 'New',
    assignedTo: null,
    assignedToId: null,
    createdBy: 'Sarah Johnson',
    createdById: 'user-1',
    createdAt: '2025-10-21T08:00:00Z',
    updatedAt: '2025-10-21T08:00:00Z',
    estimatedCost: 650,
  },
  {
    id: 'MNT-005',
    propertyId: 'prop-5',
    propertyName: 'Downtown Loft 8B',
    category: 'AC',
    description: 'Strange noise coming from AC unit. Sounds like grinding or scraping.',
    priority: 'High',
    status: 'New',
    assignedTo: null,
    assignedToId: null,
    createdBy: 'Layla Ahmed',
    createdById: 'user-4',
    createdAt: '2025-10-21T10:30:00Z',
    updatedAt: '2025-10-21T10:30:00Z',
  },
  {
    id: 'MNT-006',
    propertyId: 'prop-1',
    propertyName: 'North View Tower - Unit 301',
    category: 'Plumbing',
    description: 'Kitchen sink drain clogged. Water not draining at all.',
    priority: 'Urgent',
    status: 'In Progress',
    assignedTo: 'Mohammed Ali',
    assignedToId: 'tech-2',
    createdBy: 'Fatima Al-Saud',
    createdById: 'user-5',
    createdAt: '2025-10-20T16:20:00Z',
    updatedAt: '2025-10-21T09:45:00Z',
    attachments: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    ],
    estimatedCost: 280,
  },
  {
    id: 'MNT-007',
    propertyId: 'prop-6',
    propertyName: 'Garden Villa 12',
    category: 'Electrical',
    description: 'Main circuit breaker keeps tripping. Happened 4 times today.',
    priority: 'Urgent',
    status: 'New',
    assignedTo: null,
    assignedToId: null,
    createdBy: 'Khaled Ibrahim',
    createdById: 'user-6',
    createdAt: '2025-10-21T13:15:00Z',
    updatedAt: '2025-10-21T13:15:00Z',
  },
  {
    id: 'MNT-008',
    propertyId: 'prop-2',
    propertyName: 'Al Arid Villa',
    category: 'Other',
    description: 'Front door lock mechanism stuck. Key not turning smoothly.',
    priority: 'Low',
    status: 'Completed',
    assignedTo: 'Ahmed Khalil',
    assignedToId: 'tech-4',
    createdBy: 'Ahmad Malik',
    createdById: 'user-2',
    createdAt: '2025-10-17T09:00:00Z',
    updatedAt: '2025-10-18T11:30:00Z',
    completedAt: '2025-10-18T11:30:00Z',
    estimatedCost: 150,
    actualCost: 120,
  },
  {
    id: 'MNT-009',
    propertyId: 'prop-7',
    propertyName: 'Riverside Tower - Unit 801',
    category: 'AC',
    description: 'AC filter needs replacement as per scheduled maintenance.',
    priority: 'Low',
    status: 'Completed',
    assignedTo: 'Ali Hassan',
    assignedToId: 'tech-1',
    createdBy: 'System Auto',
    createdById: 'system',
    createdAt: '2025-10-16T08:00:00Z',
    updatedAt: '2025-10-17T14:20:00Z',
    completedAt: '2025-10-17T14:20:00Z',
    estimatedCost: 180,
    actualCost: 180,
  },
  {
    id: 'MNT-010',
    propertyId: 'prop-8',
    propertyName: 'Urban Heights - Unit 15A',
    category: 'Plumbing',
    description: 'Low water pressure in all bathrooms. Affecting daily use.',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Fatima Khan',
    assignedToId: 'tech-5',
    createdBy: 'Noor Abdullah',
    createdById: 'user-7',
    createdAt: '2025-10-20T12:30:00Z',
    updatedAt: '2025-10-21T08:15:00Z',
    estimatedCost: 520,
  },
  {
    id: 'MNT-011',
    propertyId: 'prop-3',
    propertyName: 'Green Park Residences - Unit 108',
    category: 'Other',
    description: 'Window blinds broken in bedroom. Needs replacement.',
    priority: 'Low',
    status: 'New',
    assignedTo: null,
    assignedToId: null,
    createdBy: 'Omar Hassan',
    createdById: 'user-3',
    createdAt: '2025-10-21T15:45:00Z',
    updatedAt: '2025-10-21T15:45:00Z',
    estimatedCost: 200,
  },
  {
    id: 'MNT-012',
    propertyId: 'prop-9',
    propertyName: 'Palm Residences - Villa 5',
    category: 'AC',
    description: 'Central AC making loud banging noise when starting up.',
    priority: 'High',
    status: 'Canceled',
    assignedTo: 'Ali Hassan',
    assignedToId: 'tech-1',
    createdBy: 'Rashed Al-Mansour',
    createdById: 'user-8',
    createdAt: '2025-10-15T11:00:00Z',
    updatedAt: '2025-10-16T09:30:00Z',
  },
];

export const maintenanceComments: MaintenanceComment[] = [
  {
    id: 'comment-1',
    requestId: 'MNT-001',
    authorId: 'tech-1',
    authorName: 'Ali Hassan',
    authorRole: 'Technician',
    content: 'Inspected the unit. The compressor seems to be failing. Will need replacement.',
    createdAt: '2025-10-20T10:45:00Z',
  },
  {
    id: 'comment-2',
    requestId: 'MNT-001',
    authorId: 'user-1',
    authorName: 'Sarah Johnson',
    authorRole: 'Owner',
    content: 'How long will the repair take? Do we need to relocate the tenant?',
    createdAt: '2025-10-20T11:30:00Z',
  },
  {
    id: 'comment-3',
    requestId: 'MNT-001',
    authorId: 'tech-1',
    authorName: 'Ali Hassan',
    authorRole: 'Technician',
    content: 'Repair will take 2-3 hours. No need to relocate. Will complete tomorrow morning.',
    createdAt: '2025-10-20T14:20:00Z',
  },
  {
    id: 'comment-4',
    requestId: 'MNT-002',
    authorId: 'tech-2',
    authorName: 'Mohammed Ali',
    authorRole: 'Technician',
    content: 'Leak fixed. Replaced the damaged pipe section. All tested and working.',
    createdAt: '2025-10-19T16:15:00Z',
  },
  {
    id: 'comment-5',
    requestId: 'MNT-003',
    authorId: 'tech-4',
    authorName: 'Ahmed Khalil',
    authorRole: 'Technician',
    content: 'Found loose wiring in the junction box. Working on fixing it now.',
    createdAt: '2025-10-20T10:15:00Z',
  },
];
