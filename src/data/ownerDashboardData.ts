// Owner Dashboard Data

export interface OwnerKPI {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend: number;
  trendLabel: string;
  icon: string;
}

export interface PropertyCard {
  id: string;
  name: string;
  image: string;
  revenue: number;
  occupancy: number;
  status: 'Rented' | 'Vacant' | 'Under Maintenance';
  location: string;
}

export interface MaintenanceTicket {
  id: string;
  task: string;
  property: string;
  status: 'New' | 'In Progress' | 'Completed';
  priority: 'low' | 'medium' | 'high';
  date: string;
}

export const ownerKPIs: OwnerKPI[] = [
  {
    id: 'owned-properties',
    label: 'Owned Properties',
    value: 12,
    trend: 8.3,
    trendLabel: '+1 new property',
    icon: 'building',
  },
  {
    id: 'occupancy-rate',
    label: 'Occupancy Rate',
    value: 95,
    unit: '%',
    trend: 3.2,
    trendLabel: '+3.2% from last month',
    icon: 'chart',
  },
  {
    id: 'active-tenants',
    label: 'Active Tenants',
    value: 34,
    trend: 5.9,
    trendLabel: '+2 new tenants',
    icon: 'users',
  },
  {
    id: 'monthly-income',
    label: 'Monthly Income',
    value: 285000,
    unit: 'SAR',
    trend: 6.8,
    trendLabel: '+6.8% from last month',
    icon: 'dollar',
  },
  {
    id: 'pending-maintenance',
    label: 'Pending Maintenance',
    value: 3,
    trend: -25.0,
    trendLabel: '-25% from last month',
    icon: 'wrench',
  },
];

export const rentalIncomeData = [
  { month: 'May', income: 242000 },
  { month: 'Jun', income: 258000 },
  { month: 'Jul', income: 265000 },
  { month: 'Aug', income: 272000 },
  { month: 'Sep', income: 278000 },
  { month: 'Oct', income: 285000 },
];

export const occupancyDistributionData = [
  { name: 'Rented', value: 75, color: '#5B6E49' },
  { name: 'Vacant', value: 17, color: '#D9C58E' },
  { name: 'Maintenance', value: 8, color: '#9BAE84' },
];

export const maintenanceByCategory = [
  { category: 'Plumbing', count: 8 },
  { category: 'Electrical', count: 6 },
  { category: 'HVAC', count: 5 },
  { category: 'General', count: 4 },
];

export const myProperties: PropertyCard[] = [
  {
    id: 'prop-1',
    name: 'Skyline Tower',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    revenue: 85000,
    occupancy: 100,
    status: 'Rented',
    location: 'North Riyadh',
  },
  {
    id: 'prop-2',
    name: 'Garden Villa 12',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    revenue: 48000,
    occupancy: 100,
    status: 'Rented',
    location: 'West Riyadh',
  },
  {
    id: 'prop-3',
    name: 'Downtown Loft',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    revenue: 32000,
    occupancy: 0,
    status: 'Under Maintenance',
    location: 'Central Riyadh',
  },
  {
    id: 'prop-4',
    name: 'Riverside Apartments',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400',
    revenue: 0,
    occupancy: 0,
    status: 'Vacant',
    location: 'East Riyadh',
  },
  {
    id: 'prop-5',
    name: 'Palm Residences',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400',
    revenue: 62000,
    occupancy: 100,
    status: 'Rented',
    location: 'North Riyadh',
  },
  {
    id: 'prop-6',
    name: 'Executive Suites',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
    revenue: 58000,
    occupancy: 100,
    status: 'Rented',
    location: 'Central Riyadh',
  },
];

export const maintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'mt-1',
    task: 'AC Repair',
    property: 'Skyline Tower',
    status: 'In Progress',
    priority: 'high',
    date: 'Oct 22',
  },
  {
    id: 'mt-2',
    task: 'Plumbing Check',
    property: 'Garden Villa 12',
    status: 'New',
    priority: 'medium',
    date: 'Oct 21',
  },
  {
    id: 'mt-3',
    task: 'Paint & Repair',
    property: 'Downtown Loft',
    status: 'In Progress',
    priority: 'medium',
    date: 'Oct 20',
  },
  {
    id: 'mt-4',
    task: 'Electrical Inspection',
    property: 'Palm Residences',
    status: 'Completed',
    priority: 'low',
    date: 'Oct 19',
  },
  {
    id: 'mt-5',
    task: 'Elevator Service',
    property: 'Executive Suites',
    status: 'Completed',
    priority: 'low',
    date: 'Oct 18',
  },
];

export const quickAccessModules = [
  {
    id: 'properties',
    title: 'My Properties',
    description: 'View and manage properties',
    icon: 'building',
    route: 'properties',
  },
  {
    id: 'income',
    title: 'Income Reports',
    description: 'Track rental income',
    icon: 'chart',
    route: 'financial-reports',
  },
  {
    id: 'maintenance',
    title: 'Maintenance Requests',
    description: 'Track service requests',
    icon: 'wrench',
    route: 'maintenance',
  },
  {
    id: 'contracts',
    title: 'Contracts',
    description: 'Manage rental agreements',
    icon: 'file-text',
    route: 'clients',
  },
];

export const aiInsight = '💡 Your properties achieved 95% occupancy this month.';
