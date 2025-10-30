// Accountant Dashboard Data

export interface AccountantKPI {
  id: string;
  label: string;
  value: number;
  unit?: string;
  prefix?: string;
  trend: number;
  trendLabel: string;
  icon: string;
}

export interface FinancialTransaction {
  id: string;
  description: string;
  client: string;
  amount: number;
  type: 'Income' | 'Expense';
  date: string;
  category: string;
}

export interface TopClient {
  id: string;
  name: string;
  monthlyIncome: number;
  properties: number;
  paymentStatus: 'On Time' | 'Pending' | 'Overdue';
}

export const accountantKPIs: AccountantKPI[] = [
  {
    id: 'total-revenue',
    label: 'Total Revenue',
    value: 1920000,
    prefix: 'SAR',
    trend: 8.3,
    trendLabel: '+8.3% from last month',
    icon: 'dollar',
  },
  {
    id: 'total-expenses',
    label: 'Total Expenses',
    value: 850000,
    prefix: 'SAR',
    trend: -5.2,
    trendLabel: '-5.2% from last month',
    icon: 'trending-down',
  },
  {
    id: 'net-profit',
    label: 'Net Profit',
    value: 1070000,
    prefix: 'SAR',
    trend: 15.6,
    trendLabel: '+15.6% from last month',
    icon: 'chart',
  },
  {
    id: 'outstanding-invoices',
    label: 'Outstanding Invoices',
    value: 8,
    trend: -20.0,
    trendLabel: '-20% from last month',
    icon: 'file-text',
  },
  {
    id: 'paid-rate',
    label: 'Paid Rate',
    value: 94,
    unit: '%',
    trend: 3.5,
    trendLabel: '+3.5% from last month',
    icon: 'check',
  },
];

export const revenueExpensesData = [
  { month: 'May', revenue: 1650000, expenses: 920000 },
  { month: 'Jun', revenue: 1720000, expenses: 880000 },
  { month: 'Jul', revenue: 1780000, expenses: 895000 },
  { month: 'Aug', revenue: 1850000, expenses: 870000 },
  { month: 'Sep', revenue: 1880000, expenses: 855000 },
  { month: 'Oct', revenue: 1920000, expenses: 850000 },
];

export const expenseBreakdownData = [
  { name: 'Maintenance', value: 35, color: '#5B6E49' },
  { name: 'Taxes', value: 25, color: '#9BAE84' },
  { name: 'Salaries', value: 28, color: '#D9C58E' },
  { name: 'Marketing', value: 12, color: '#D6E0D0' },
];

export const cashflowData = [
  { month: 'May', amount: 730000 },
  { month: 'Jun', amount: 840000 },
  { month: 'Jul', amount: 885000 },
  { month: 'Aug', amount: 980000 },
  { month: 'Sep', amount: 1025000 },
  { month: 'Oct', amount: 1070000 },
];

export const topClients: TopClient[] = [
  {
    id: 'cl-1',
    name: 'Al-Qahtani Holdings',
    monthlyIncome: 185000,
    properties: 8,
    paymentStatus: 'On Time',
  },
  {
    id: 'cl-2',
    name: 'Noor Real Estate',
    monthlyIncome: 142000,
    properties: 5,
    paymentStatus: 'On Time',
  },
  {
    id: 'cl-3',
    name: 'Al-Harbi Group',
    monthlyIncome: 98000,
    properties: 4,
    paymentStatus: 'Pending',
  },
  {
    id: 'cl-4',
    name: 'Al-Rashid Properties',
    monthlyIncome: 76000,
    properties: 3,
    paymentStatus: 'On Time',
  },
  {
    id: 'cl-5',
    name: 'Tower Investments',
    monthlyIncome: 65000,
    properties: 2,
    paymentStatus: 'Overdue',
  },
];

export const recentTransactions: FinancialTransaction[] = [
  {
    id: 'tr-1',
    description: 'Rental Payment',
    client: 'Al-Qahtani Holdings',
    amount: 85000,
    type: 'Income',
    date: 'Oct 21',
    category: 'Rent',
  },
  {
    id: 'tr-2',
    description: 'Maintenance Service',
    client: 'North Tower Maintenance',
    amount: 12000,
    type: 'Expense',
    date: 'Oct 21',
    category: 'Maintenance',
  },
  {
    id: 'tr-3',
    description: 'Property Tax',
    client: 'Tax Authority',
    amount: 45000,
    type: 'Expense',
    date: 'Oct 20',
    category: 'Taxes',
  },
  {
    id: 'tr-4',
    description: 'Rental Payment',
    client: 'Noor Real Estate',
    amount: 62000,
    type: 'Income',
    date: 'Oct 19',
    category: 'Rent',
  },
  {
    id: 'tr-5',
    description: 'Marketing Campaign',
    client: 'Digital Marketing Co.',
    amount: 8500,
    type: 'Expense',
    date: 'Oct 18',
    category: 'Marketing',
  },
  {
    id: 'tr-6',
    description: 'Service Fee',
    client: 'Al-Harbi Group',
    amount: 48000,
    type: 'Income',
    date: 'Oct 17',
    category: 'Service',
  },
];

export const quickAccessModules = [
  {
    id: 'invoices',
    title: 'Invoices & Payments',
    description: 'Manage billing and payments',
    icon: 'file-text',
    route: 'financial-reports',
  },
  {
    id: 'reports',
    title: 'Financial Reports',
    description: 'Generate financial statements',
    icon: 'chart',
    route: 'financial-reports',
  },
  {
    id: 'properties',
    title: 'Properties Overview',
    description: 'View property financials',
    icon: 'building',
    route: 'properties',
  },
  {
    id: 'insights',
    title: 'AI Insights',
    description: 'Financial intelligence',
    icon: 'lightbulb',
    route: 'analytics',
  },
];

export const aiInsight = '💡 Maintenance expenses decreased by 12% this quarter.';
