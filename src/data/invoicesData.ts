export const invoicesData = {
  summary: {
    totalInvoices: 420000,
    totalInvoicesChange: 12,
    paid: 320000,
    paidChange: 8,
    outstanding: 100000,
    outstandingChange: -15,
    overdue: 8,
    overdueChange: 25
  },
  invoices: [
    {
      id: "INV-001",
      client: "North View Tower",
      propertyId: "NVT-001",
      issueDate: "2025-10-01",
      dueDate: "2025-10-10",
      amount: 8000,
      status: "Paid",
      method: "Bank Transfer",
      reference: "TXR-8921",
      lineItems: [
        { description: "Monthly Rent", quantity: 1, rate: 7000, amount: 7000 },
        { description: "Utilities", quantity: 1, rate: 1000, amount: 1000 }
      ],
      subtotal: 8000,
      vat: 0,
      total: 8000,
      notes: "Payment received on time",
      paidDate: "2025-10-09",
      paidAmount: 8000
    },
    {
      id: "INV-002",
      client: "Al Arid Villa",
      propertyId: "AAV-004",
      issueDate: "2025-09-25",
      dueDate: "2025-10-05",
      amount: 6500,
      status: "Pending",
      method: "Cash",
      reference: "TXR-8734",
      lineItems: [
        { description: "Monthly Rent", quantity: 1, rate: 5500, amount: 5500 },
        { description: "Maintenance Fee", quantity: 1, rate: 1000, amount: 1000 }
      ],
      subtotal: 6500,
      vat: 0,
      total: 6500,
      notes: "Awaiting payment confirmation",
      paidDate: null,
      paidAmount: 0
    },
    {
      id: "INV-003",
      client: "Al Narjis Complex",
      propertyId: "ANC-007",
      issueDate: "2025-09-10",
      dueDate: "2025-09-20",
      amount: 9200,
      status: "Overdue",
      method: "Bank Transfer",
      reference: "TXR-7834",
      lineItems: [
        { description: "Rent Payment", quantity: 1, rate: 8000, amount: 8000 },
        { description: "Parking", quantity: 1, rate: 1200, amount: 1200 }
      ],
      subtotal: 9200,
      vat: 0,
      total: 9200,
      notes: "Overdue by 31 days - reminder sent",
      paidDate: null,
      paidAmount: 5000
    },
    {
      id: "INV-004",
      client: "Green Valley Apartments",
      propertyId: "GVA-002",
      issueDate: "2025-10-05",
      dueDate: "2025-10-15",
      amount: 24000,
      status: "Paid",
      method: "Bank Transfer",
      reference: "TXR-9012",
      lineItems: [
        { description: "Quarterly Rent", quantity: 1, rate: 22000, amount: 22000 },
        { description: "Service Charge", quantity: 1, rate: 2000, amount: 2000 }
      ],
      subtotal: 24000,
      vat: 0,
      total: 24000,
      notes: "Q4 2025 - paid early",
      paidDate: "2025-10-12",
      paidAmount: 24000
    },
    {
      id: "INV-005",
      client: "Skyline Residences",
      propertyId: "SR-003",
      issueDate: "2025-10-08",
      dueDate: "2025-10-18",
      amount: 12000,
      status: "Pending",
      method: "Bank Transfer",
      reference: "TXR-8956",
      lineItems: [
        { description: "Monthly Rent - Unit 3B", quantity: 1, rate: 11000, amount: 11000 },
        { description: "Storage Fee", quantity: 1, rate: 1000, amount: 1000 }
      ],
      subtotal: 12000,
      vat: 0,
      total: 12000,
      notes: "Due in 7 days",
      paidDate: null,
      paidAmount: 0
    },
    {
      id: "INV-006",
      client: "Downtown Commercial",
      propertyId: "DC-005",
      issueDate: "2025-09-28",
      dueDate: "2025-10-08",
      amount: 15000,
      status: "Paid",
      method: "Bank Transfer",
      reference: "TXR-8823",
      lineItems: [
        { description: "Commercial Lease", quantity: 1, rate: 14000, amount: 14000 },
        { description: "Common Area Fee", quantity: 1, rate: 1000, amount: 1000 }
      ],
      subtotal: 15000,
      vat: 0,
      total: 15000,
      notes: "October payment received",
      paidDate: "2025-10-07",
      paidAmount: 15000
    },
    {
      id: "INV-007",
      client: "Palm Gardens Estate",
      propertyId: "PGE-008",
      issueDate: "2025-09-15",
      dueDate: "2025-09-25",
      amount: 18500,
      status: "Overdue",
      method: "Check",
      reference: "TXR-7654",
      lineItems: [
        { description: "Monthly Rent", quantity: 1, rate: 17000, amount: 17000 },
        { description: "Pool Maintenance", quantity: 1, rate: 1500, amount: 1500 }
      ],
      subtotal: 18500,
      vat: 0,
      total: 18500,
      notes: "Overdue by 26 days - escalation required",
      paidDate: null,
      paidAmount: 0
    },
    {
      id: "INV-008",
      client: "Business Bay Tower",
      propertyId: "BBT-009",
      issueDate: "2025-10-12",
      dueDate: "2025-10-22",
      amount: 32000,
      status: "Pending",
      method: "Bank Transfer",
      reference: "TXR-9145",
      lineItems: [
        { description: "Office Space Rent", quantity: 1, rate: 30000, amount: 30000 },
        { description: "Parking Spaces (3)", quantity: 3, rate: 666.67, amount: 2000 }
      ],
      subtotal: 32000,
      vat: 0,
      total: 32000,
      notes: "High-value tenant - premium location",
      paidDate: null,
      paidAmount: 0
    },
    {
      id: "INV-009",
      client: "Marina View Apartments",
      propertyId: "MVA-010",
      issueDate: "2025-09-20",
      dueDate: "2025-09-30",
      amount: 11000,
      status: "Paid",
      method: "Bank Transfer",
      reference: "TXR-8234",
      lineItems: [
        { description: "Apartment Rent", quantity: 1, rate: 10000, amount: 10000 },
        { description: "Gym Access", quantity: 1, rate: 1000, amount: 1000 }
      ],
      subtotal: 11000,
      vat: 0,
      total: 11000,
      notes: "Regular tenant - excellent payment history",
      paidDate: "2025-09-28",
      paidAmount: 11000
    },
    {
      id: "INV-010",
      client: "Tech Hub Office Park",
      propertyId: "THOP-011",
      issueDate: "2025-10-01",
      dueDate: "2025-10-11",
      amount: 45000,
      status: "Paid",
      method: "Wire Transfer",
      reference: "TXR-9234",
      lineItems: [
        { description: "Office Complex Rent", quantity: 1, rate: 42000, amount: 42000 },
        { description: "Conference Room Fee", quantity: 1, rate: 3000, amount: 3000 }
      ],
      subtotal: 45000,
      vat: 0,
      total: 45000,
      notes: "Corporate client - largest contract",
      paidDate: "2025-10-10",
      paidAmount: 45000
    },
    {
      id: "INV-011",
      client: "Sunset Boulevard Villa",
      propertyId: "SBV-012",
      issueDate: "2025-09-18",
      dueDate: "2025-09-28",
      amount: 14500,
      status: "Overdue",
      method: "Bank Transfer",
      reference: "TXR-7923",
      lineItems: [
        { description: "Luxury Villa Rent", quantity: 1, rate: 13000, amount: 13000 },
        { description: "Garden Maintenance", quantity: 1, rate: 1500, amount: 1500 }
      ],
      subtotal: 14500,
      vat: 0,
      total: 14500,
      notes: "Overdue by 23 days - payment plan requested",
      paidDate: null,
      paidAmount: 7000
    },
    {
      id: "INV-012",
      client: "City Center Retail",
      propertyId: "CCR-013",
      issueDate: "2025-10-03",
      dueDate: "2025-10-13",
      amount: 28000,
      status: "Pending",
      method: "Bank Transfer",
      reference: "TXR-9056",
      lineItems: [
        { description: "Retail Space Lease", quantity: 1, rate: 25000, amount: 25000 },
        { description: "Display Window Fee", quantity: 1, rate: 3000, amount: 3000 }
      ],
      subtotal: 28000,
      vat: 0,
      total: 28000,
      notes: "Prime retail location",
      paidDate: null,
      paidAmount: 0
    },
    {
      id: "INV-013",
      client: "Heritage Homes",
      propertyId: "HH-014",
      issueDate: "2025-09-22",
      dueDate: "2025-10-02",
      amount: 9800,
      status: "Paid",
      method: "Cash",
      reference: "TXR-8456",
      lineItems: [
        { description: "Monthly Rent", quantity: 1, rate: 9000, amount: 9000 },
        { description: "HOA Fee", quantity: 1, rate: 800, amount: 800 }
      ],
      subtotal: 9800,
      vat: 0,
      total: 9800,
      notes: "Cash payment received at office",
      paidDate: "2025-10-01",
      paidAmount: 9800
    },
    {
      id: "INV-014",
      client: "Innovation Campus",
      propertyId: "IC-015",
      issueDate: "2025-10-07",
      dueDate: "2025-10-17",
      amount: 38000,
      status: "Pending",
      method: "Bank Transfer",
      reference: "TXR-9178",
      lineItems: [
        { description: "Campus Rent", quantity: 1, rate: 35000, amount: 35000 },
        { description: "Lab Space Fee", quantity: 1, rate: 3000, amount: 3000 }
      ],
      subtotal: 38000,
      vat: 0,
      total: 38000,
      notes: "Tech startup - growing tenant",
      paidDate: null,
      paidAmount: 0
    },
    {
      id: "INV-015",
      client: "Lakeside Residences",
      propertyId: "LR-016",
      issueDate: "2025-09-12",
      dueDate: "2025-09-22",
      amount: 16200,
      status: "Overdue",
      method: "Bank Transfer",
      reference: "TXR-7712",
      lineItems: [
        { description: "Lakefront Property Rent", quantity: 1, rate: 15000, amount: 15000 },
        { description: "Boat Dock Fee", quantity: 1, rate: 1200, amount: 1200 }
      ],
      subtotal: 16200,
      vat: 0,
      total: 16200,
      notes: "Overdue by 29 days - legal notice prepared",
      paidDate: null,
      paidAmount: 0
    },
    {
      id: "INV-016",
      client: "Royal Plaza",
      propertyId: "RP-017",
      issueDate: "2025-10-09",
      dueDate: "2025-10-19",
      amount: 21000,
      status: "Pending",
      method: "Check",
      reference: "TXR-9089",
      lineItems: [
        { description: "Shopping Center Rent", quantity: 1, rate: 20000, amount: 20000 },
        { description: "Security Fee", quantity: 1, rate: 1000, amount: 1000 }
      ],
      subtotal: 21000,
      vat: 0,
      total: 21000,
      notes: "New tenant - first invoice",
      paidDate: null,
      paidAmount: 0
    },
    {
      id: "INV-017",
      client: "Mountain View Chalets",
      propertyId: "MVC-018",
      issueDate: "2025-09-30",
      dueDate: "2025-10-10",
      amount: 13500,
      status: "Paid",
      method: "Bank Transfer",
      reference: "TXR-8867",
      lineItems: [
        { description: "Chalet Rental", quantity: 1, rate: 12500, amount: 12500 },
        { description: "Ski Equipment Storage", quantity: 1, rate: 1000, amount: 1000 }
      ],
      subtotal: 13500,
      vat: 0,
      total: 13500,
      notes: "Seasonal property - peak season rate",
      paidDate: "2025-10-08",
      paidAmount: 13500
    },
    {
      id: "INV-018",
      client: "Urban Lofts",
      propertyId: "UL-019",
      issueDate: "2025-10-11",
      dueDate: "2025-10-21",
      amount: 10500,
      status: "Pending",
      method: "Bank Transfer",
      reference: "TXR-9201",
      lineItems: [
        { description: "Loft Apartment Rent", quantity: 1, rate: 9500, amount: 9500 },
        { description: "Rooftop Access", quantity: 1, rate: 1000, amount: 1000 }
      ],
      subtotal: 10500,
      vat: 0,
      total: 10500,
      notes: "Modern loft - creative professional tenant",
      paidDate: null,
      paidAmount: 0
    },
    {
      id: "INV-019",
      client: "Riverside Business Center",
      propertyId: "RBC-020",
      issueDate: "2025-09-25",
      dueDate: "2025-10-05",
      amount: 34000,
      status: "Paid",
      method: "Wire Transfer",
      reference: "TXR-8678",
      lineItems: [
        { description: "Business Center Rent", quantity: 1, rate: 32000, amount: 32000 },
        { description: "Meeting Rooms", quantity: 1, rate: 2000, amount: 2000 }
      ],
      subtotal: 34000,
      vat: 0,
      total: 34000,
      notes: "Corporate HQ - multi-year contract",
      paidDate: "2025-10-04",
      paidAmount: 34000
    },
    {
      id: "INV-020",
      client: "Garden Heights",
      propertyId: "GH-021",
      issueDate: "2025-09-08",
      dueDate: "2025-09-18",
      amount: 7800,
      status: "Overdue",
      method: "Cash",
      reference: "TXR-7534",
      lineItems: [
        { description: "Studio Apartment", quantity: 1, rate: 7000, amount: 7000 },
        { description: "Utilities", quantity: 1, rate: 800, amount: 800 }
      ],
      subtotal: 7800,
      vat: 0,
      total: 7800,
      notes: "Overdue by 33 days - tenant contacted",
      paidDate: null,
      paidAmount: 0
    }
  ],
  paymentHistory: [
    {
      id: 1,
      date: "2025-10-12",
      invoiceId: "INV-004",
      client: "Green Valley Apartments",
      amount: 24000,
      method: "Bank Transfer",
      reference: "TXR-9012",
      status: "Cleared"
    },
    {
      id: 2,
      date: "2025-10-10",
      invoiceId: "INV-010",
      client: "Tech Hub Office Park",
      amount: 45000,
      method: "Wire Transfer",
      reference: "TXR-9234",
      status: "Cleared"
    },
    {
      id: 3,
      date: "2025-10-09",
      invoiceId: "INV-001",
      client: "North View Tower",
      amount: 8000,
      method: "Bank Transfer",
      reference: "TXR-8921",
      status: "Cleared"
    },
    {
      id: 4,
      date: "2025-10-08",
      invoiceId: "INV-017",
      client: "Mountain View Chalets",
      amount: 13500,
      method: "Bank Transfer",
      reference: "TXR-8867",
      status: "Cleared"
    },
    {
      id: 5,
      date: "2025-10-07",
      invoiceId: "INV-006",
      client: "Downtown Commercial",
      amount: 15000,
      method: "Bank Transfer",
      reference: "TXR-8823",
      status: "Cleared"
    },
    {
      id: 6,
      date: "2025-10-04",
      invoiceId: "INV-019",
      client: "Riverside Business Center",
      amount: 34000,
      method: "Wire Transfer",
      reference: "TXR-8678",
      status: "Cleared"
    },
    {
      id: 7,
      date: "2025-10-01",
      invoiceId: "INV-013",
      client: "Heritage Homes",
      amount: 9800,
      method: "Cash",
      reference: "TXR-8456",
      status: "Cleared"
    },
    {
      id: 8,
      date: "2025-09-28",
      invoiceId: "INV-009",
      client: "Marina View Apartments",
      amount: 11000,
      method: "Bank Transfer",
      reference: "TXR-8234",
      status: "Cleared"
    },
    {
      id: 9,
      date: "2025-09-22",
      invoiceId: "INV-003",
      client: "Al Narjis Complex",
      amount: 5000,
      method: "Bank Transfer",
      reference: "TXR-7834",
      status: "Partial"
    },
    {
      id: 10,
      date: "2025-09-18",
      invoiceId: "INV-011",
      client: "Sunset Boulevard Villa",
      amount: 7000,
      method: "Bank Transfer",
      reference: "TXR-7923",
      status: "Partial"
    }
  ],
  aiInsights: [
    "8 invoices are overdue by more than 10 days, totaling SAR 66,000.",
    "Average collection time this quarter: 5.4 days (improved from 7.2 days last quarter).",
    "Top client: Tech Hub Office Park with SAR 64,000 YTD payments.",
    "Predicted next month billing volume: SAR 520,000 based on historical patterns.",
    "Outstanding invoices from Al Narjis Complex require immediate attention - 31 days overdue.",
    "Payment method preference: 75% Bank Transfer, 15% Wire Transfer, 10% Cash/Check."
  ]
};
