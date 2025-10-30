export const financialData = {
  summary: {
    totalRevenue: 1250000,
    revenueChange: 12,
    expenses: 320000,
    expensesChange: -8,
    netProfit: 930000,
    netProfitChange: 6,
    roi: 7.4,
    roiChange: 1.5,
    occupancy: 92,
    occupancyChange: 3
  },
  monthlyData: [
    { month: "Jan", revenue: 100000, expenses: 40000 },
    { month: "Feb", revenue: 95000, expenses: 38000 },
    { month: "Mar", revenue: 105000, expenses: 42000 },
    { month: "Apr", revenue: 110000, expenses: 35000 },
    { month: "May", revenue: 98000, expenses: 36000 },
    { month: "Jun", revenue: 115000, expenses: 39000 },
    { month: "Jul", revenue: 108000, expenses: 41000 },
    { month: "Aug", revenue: 112000, expenses: 37000 },
    { month: "Sep", revenue: 110000, expenses: 45000 },
    { month: "Oct", revenue: 120000, expenses: 40000 },
    { month: "Nov", revenue: 125000, expenses: 38000 },
    { month: "Dec", revenue: 130000, expenses: 42000 }
  ],
  expenseBreakdown: [
    { name: "Maintenance", value: 35, amount: 112000 },
    { name: "Utilities", value: 25, amount: 80000 },
    { name: "Taxes", value: 20, amount: 64000 },
    { name: "Insurance", value: 12, amount: 38400 },
    { name: "Misc", value: 8, amount: 25600 }
  ],
  cashflowData: [
    {
      month: "Oct 2025",
      income: 120000,
      expenses: 40000,
      net: 80000,
      roi: 7.2,
      trend: "up"
    },
    {
      month: "Sep 2025",
      income: 110000,
      expenses: 45000,
      net: 65000,
      roi: 6.5,
      trend: "up"
    },
    {
      month: "Aug 2025",
      income: 112000,
      expenses: 37000,
      net: 75000,
      roi: 7.0,
      trend: "up"
    },
    {
      month: "Jul 2025",
      income: 108000,
      expenses: 41000,
      net: 67000,
      roi: 6.8,
      trend: "down"
    },
    {
      month: "Jun 2025",
      income: 115000,
      expenses: 39000,
      net: 76000,
      roi: 7.1,
      trend: "up"
    },
    {
      month: "May 2025",
      income: 98000,
      expenses: 36000,
      net: 62000,
      roi: 6.3,
      trend: "down"
    }
  ],
  aiInsights: [
    "Your ROI increased by 1.5% this quarter compared to Q2 2025.",
    "Expenses dropped 8% compared to last quarter - excellent cost management!",
    "Predicted Q4 revenue: SAR 1.35M (+9% growth expected).",
    "Maintenance costs are trending 15% lower than industry average.",
    "Consider increasing marketing budget - occupancy is at 92% with room for growth."
  ]
};
