// Sample portfolios for instant demo - showcasing different use cases

export interface DemoPortfolio {
  id: string;
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'mixed';
  owner: {
    name: string;
    email: string;
    role: 'admin' | 'accountant' | 'owner';
  };
  properties: {
    id: string;
    name: string;
    type: string;
    location: string;
    units: number;
    occupancy: number;
    monthlyRevenue: number;
    status: 'active' | 'maintenance' | 'vacant';
  }[];
  financials: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    occupancyRate: number;
    averageRent: number;
  };
  maintenanceRequests: number;
  tenants: number;
}

export const demoPortfolios: DemoPortfolio[] = [
  {
    id: 'demo-residential',
    name: 'محفظة المباني السكنية - الرياض',
    description: 'محفظة سكنية متنوعة في أحياء شمال الرياض',
    type: 'residential',
    owner: {
      name: 'أحمد المالكي',
      email: 'ahmed.demo@estal.sa',
      role: 'owner',
    },
    properties: [
      {
        id: 'res-1',
        name: 'برج النخيل السكني',
        type: 'شقق سكنية',
        location: 'حي النخيل، الرياض',
        units: 24,
        occupancy: 92,
        monthlyRevenue: 168000,
        status: 'active',
      },
      {
        id: 'res-2',
        name: 'مجمع الياسمين',
        type: 'فلل',
        location: 'حي الياسمين، الرياض',
        units: 8,
        occupancy: 100,
        monthlyRevenue: 240000,
        status: 'active',
      },
      {
        id: 'res-3',
        name: 'عمارة الملقا',
        type: 'شقق عائلية',
        location: 'حي الملقا، الرياض',
        units: 16,
        occupancy: 87.5,
        monthlyRevenue: 112000,
        status: 'active',
      },
      {
        id: 'res-4',
        name: 'فلل العليا',
        type: 'فلل فاخرة',
        location: 'حي العليا، الرياض',
        units: 4,
        occupancy: 75,
        monthlyRevenue: 90000,
        status: 'maintenance',
      },
    ],
    financials: {
      totalRevenue: 610000,
      totalExpenses: 183000,
      netIncome: 427000,
      occupancyRate: 90.4,
      averageRent: 11731,
    },
    maintenanceRequests: 12,
    tenants: 47,
  },
  {
    id: 'demo-commercial',
    name: 'محفظة المباني التجارية - جدة',
    description: 'عقارات تجارية استراتيجية في مراكز جدة الحيوية',
    type: 'commercial',
    owner: {
      name: 'شركة الأفق العقارية',
      email: 'alofok.demo@estal.sa',
      role: 'admin',
    },
    properties: [
      {
        id: 'com-1',
        name: 'مول النور التجاري',
        type: 'مركز تسوق',
        location: 'شارع التحلية، جدة',
        units: 45,
        occupancy: 95.6,
        monthlyRevenue: 850000,
        status: 'active',
      },
      {
        id: 'com-2',
        name: 'برج الأعمال',
        type: 'مكاتب تجارية',
        location: 'الكورنيش، جدة',
        units: 32,
        occupancy: 90.6,
        monthlyRevenue: 580000,
        status: 'active',
      },
      {
        id: 'com-3',
        name: 'معرض السيارات',
        type: 'صالات عرض',
        location: 'طريق مكة، جدة',
        units: 6,
        occupancy: 100,
        monthlyRevenue: 180000,
        status: 'active',
      },
      {
        id: 'com-4',
        name: 'مستودعات الميناء',
        type: 'مستودعات',
        location: 'المنطقة الصناعية، جدة',
        units: 12,
        occupancy: 83.3,
        monthlyRevenue: 200000,
        status: 'active',
      },
    ],
    financials: {
      totalRevenue: 1810000,
      totalExpenses: 543000,
      netIncome: 1267000,
      occupancyRate: 93.2,
      averageRent: 19053,
    },
    maintenanceRequests: 8,
    tenants: 89,
  },
  {
    id: 'demo-mixed',
    name: 'محفظة متنوعة - الدمام',
    description: 'مزيج متوازن من العقارات السكنية والتجارية',
    type: 'mixed',
    owner: {
      name: 'مجموعة الخليج للاستثمار',
      email: 'gulf.demo@estal.sa',
      role: 'admin',
    },
    properties: [
      {
        id: 'mix-1',
        name: 'برج الخليج المختلط',
        type: 'سكني + تجاري',
        location: 'الكورنيش، الدمام',
        units: 36,
        occupancy: 94.4,
        monthlyRevenue: 432000,
        status: 'active',
      },
      {
        id: 'mix-2',
        name: 'مجمع الواحة',
        type: 'شقق + محلات',
        location: 'حي الفيصلية، الدمام',
        units: 28,
        occupancy: 89.3,
        monthlyRevenue: 280000,
        status: 'active',
      },
      {
        id: 'mix-3',
        name: 'فندق الشاطئ',
        type: 'فندقي',
        location: 'نصف القمر، الدمام',
        units: 50,
        occupancy: 78,
        monthlyRevenue: 625000,
        status: 'active',
      },
      {
        id: 'mix-4',
        name: 'مركز الأعمال',
        type: 'مكاتب',
        location: 'حي الشاطئ، الدمام',
        units: 18,
        occupancy: 88.9,
        monthlyRevenue: 270000,
        status: 'maintenance',
      },
      {
        id: 'mix-5',
        name: 'عمارة الزهور',
        type: 'شقق سكنية',
        location: 'حي الزهور، الدمام',
        units: 20,
        occupancy: 95,
        monthlyRevenue: 190000,
        status: 'active',
      },
    ],
    financials: {
      totalRevenue: 1797000,
      totalExpenses: 539100,
      netIncome: 1257900,
      occupancyRate: 88.9,
      averageRent: 11796,
    },
    maintenanceRequests: 15,
    tenants: 136,
  },
];

// Helper function to get demo data for a specific role
export const getDemoDataForRole = (role: 'admin' | 'accountant' | 'owner') => {
  switch (role) {
    case 'admin':
      return demoPortfolios[1]; // Commercial portfolio - full access
    case 'accountant':
      return demoPortfolios[2]; // Mixed portfolio - financial focus
    case 'owner':
    default:
      return demoPortfolios[0]; // Residential portfolio - property management
  }
};

// Generate sample transactions for demo
export const generateDemoTransactions = (portfolioId: string) => {
  const baseDate = new Date();
  const transactions = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    transactions.push({
      id: `demo-txn-${portfolioId}-${i}`,
      date: date.toISOString(),
      type: i % 3 === 0 ? 'expense' : 'income',
      category: i % 3 === 0 ? 'maintenance' : 'rent',
      amount: i % 3 === 0 ? Math.random() * 5000 + 1000 : Math.random() * 10000 + 5000,
      description: i % 3 === 0 ? `صيانة - ${i}` : `إيجار شهري - ${i}`,
      property: `property-${(i % 4) + 1}`,
    });
  }

  return transactions;
};

// Generate sample maintenance requests
export const generateDemoMaintenanceRequests = (portfolioId: string) => {
  const statuses = ['pending', 'in-progress', 'completed'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const types = ['plumbing', 'electrical', 'ac', 'general'];

  return Array.from({ length: 12 }, (_, i) => ({
    id: `demo-maint-${portfolioId}-${i}`,
    title: `طلب صيانة ${i + 1}`,
    description: `وصف تفصيلي لطلب الصيانة رقم ${i + 1}`,
    status: statuses[i % 3],
    priority: priorities[i % 4],
    type: types[i % 4],
    property: `property-${(i % 4) + 1}`,
    unit: `${Math.floor(Math.random() * 20) + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedCost: Math.floor(Math.random() * 5000) + 500,
  }));
};

// Generate demo analytics data
export const generateDemoAnalytics = (portfolio: DemoPortfolio) => {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];

  return {
    revenue: months.map((month, i) => ({
      month,
      value: portfolio.financials.totalRevenue * (0.9 + Math.random() * 0.2),
    })),
    expenses: months.map((month, i) => ({
      month,
      value: portfolio.financials.totalExpenses * (0.85 + Math.random() * 0.3),
    })),
    occupancy: months.map((month, i) => ({
      month,
      value: portfolio.financials.occupancyRate + (Math.random() * 10 - 5),
    })),
    netIncome: months.map((month, i) => ({
      month,
      value: portfolio.financials.netIncome * (0.85 + Math.random() * 0.3),
    })),
  };
};

export default demoPortfolios;
