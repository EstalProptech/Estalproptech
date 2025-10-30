import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank, 
  Percent,
  Home,
  FileDown,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Calendar,
  Building2,
  User,
  Hash,
  CreditCard,
  X,
  Plus,
  Send,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Printer
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { financialData } from "../data/financialData";
import { transactionsData } from "../data/transactionsData";
import { invoicesData } from "../data/invoicesData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";

type Transaction = typeof transactionsData.transactions[0];
type Invoice = typeof invoicesData.invoices[0];

export function FinancialReportsView() {
  const [dateRange, setDateRange] = useState("month");
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Transaction filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [transactionSortConfig, setTransactionSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Invoice filters and state
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [invoiceFilterStatus, setInvoiceFilterStatus] = useState("all");
  const [invoiceSortConfig, setInvoiceSortConfig] = useState<{ key: keyof Invoice; direction: 'asc' | 'desc' } | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceDetailsOpen, setIsInvoiceDetailsOpen] = useState(false);
  const [invoiceCurrentPage, setInvoiceCurrentPage] = useState(1);
  const [invoiceActiveTab, setInvoiceActiveTab] = useState("invoices");
  const invoiceItemsPerPage = 10;

  const COLORS = ['#5B6E49', '#9BAE84', '#D9C58E', '#C5B6C7', '#D6E0D0'];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Export functionality
  const handleExportPDF = () => {
    toast.success("Exporting to PDF...", {
      description: "Your financial report will download shortly."
    });
  };

  const handleExportExcel = () => {
    toast.success("Exporting to Excel...", {
      description: "Your financial data will download shortly."
    });
  };

  // Sorting for table
  const sortedCashflow = [...financialData.cashflowData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'desc' };
      }
      if (current.direction === 'desc') {
        return { key, direction: 'asc' };
      }
      return null;
    });
  };

  // Transaction filtering and sorting
  const filteredTransactions = transactionsData.transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.propertyId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!transactionSortConfig) return 0;

    const aValue = a[transactionSortConfig.key];
    const bValue = b[transactionSortConfig.key];

    if (aValue < bValue) return transactionSortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return transactionSortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTransactionSort = (key: keyof Transaction) => {
    setTransactionSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'desc' };
      }
      if (current.direction === 'desc') {
        return { key, direction: 'asc' };
      }
      return null;
    });
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Pending':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'Rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Income' 
      ? 'text-green-600' 
      : 'text-red-600';
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterStatus("all");
    setTransactionSortConfig(null);
    toast.success("Filters reset");
  };

  // Invoice filtering and sorting
  const filteredInvoices = invoicesData.invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(invoiceSearchQuery.toLowerCase());
    
    const matchesStatus = invoiceFilterStatus === "all" || invoice.status === invoiceFilterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!invoiceSortConfig) return 0;

    const aValue = a[invoiceSortConfig.key];
    const bValue = b[invoiceSortConfig.key];

    if (aValue < bValue) return invoiceSortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return invoiceSortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const invoiceTotalPages = Math.ceil(sortedInvoices.length / invoiceItemsPerPage);
  const paginatedInvoices = sortedInvoices.slice(
    (invoiceCurrentPage - 1) * invoiceItemsPerPage,
    invoiceCurrentPage * invoiceItemsPerPage
  );

  const handleInvoiceSort = (key: keyof Invoice) => {
    setInvoiceSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'desc' };
      }
      if (current.direction === 'desc') {
        return { key, direction: 'asc' };
      }
      return null;
    });
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceDetailsOpen(true);
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Pending':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'Overdue':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getInvoiceStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'Pending':
        return <Clock className="w-3 h-3" />;
      case 'Overdue':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleResetInvoiceFilters = () => {
    setInvoiceSearchQuery("");
    setInvoiceFilterStatus("all");
    setInvoiceSortConfig(null);
    toast.success("Filters reset");
  };

  const handleQuickInvoiceFilter = (status: string) => {
    setInvoiceFilterStatus(status);
    setInvoiceCurrentPage(1);
  };

  const getPaymentProgress = (invoice: Invoice) => {
    if (!invoice.paidAmount) return 0;
    return (invoice.paidAmount / invoice.total) * 100;
  };

  const handleCreateInvoice = () => {
    toast.info("Create Invoice", {
      description: "This feature will be available soon."
    });
  };

  const handleSendInvoice = (invoice: Invoice) => {
    toast.success("Invoice Sent", {
      description: `Invoice ${invoice.id} has been sent to ${invoice.client}.`
    });
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success("Downloading Invoice", {
      description: `Invoice ${invoice.id} is being downloaded.`
    });
  };

  return (
    <div className="max-w-[1800px] mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-foreground">Financial Reports</h1>
          <p className="text-muted-foreground mt-1">
            Analyze revenue, expenses, transactions, and portfolio performance.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={handleExportExcel}
            className="gap-2"
          >
            <FileDown className="w-4 h-4" />
            Excel
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            className="gap-2"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </Button>
          
          <Button
            onClick={() => setInsightsPanelOpen(!insightsPanelOpen)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Sparkles className="w-4 h-4" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Tabs for Overview, Transactions, and Invoices */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices & Payments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                financialData.summary.revenueChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {financialData.summary.revenueChange > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(financialData.summary.revenueChange)}%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-muted-foreground text-sm">Total Revenue</div>
              <div className="text-2xl font-semibold text-foreground mt-1">
                SAR <AnimatedCounter end={financialData.summary.totalRevenue / 1000000} decimals={2} />M
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Operating Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                financialData.summary.expensesChange < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {financialData.summary.expensesChange < 0 ? (
                  <ArrowDownRight className="w-4 h-4" />
                ) : (
                  <ArrowUpRight className="w-4 h-4" />
                )}
                {Math.abs(financialData.summary.expensesChange)}%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-muted-foreground text-sm">Operating Expenses</div>
              <div className="text-2xl font-semibold text-foreground mt-1">
                SAR <AnimatedCounter end={financialData.summary.expenses / 1000} decimals={0} />K
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Net Profit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-secondary" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                financialData.summary.netProfitChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {financialData.summary.netProfitChange > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(financialData.summary.netProfitChange)}%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-muted-foreground text-sm">Net Profit</div>
              <div className="text-2xl font-semibold text-foreground mt-1">
                SAR <AnimatedCounter end={financialData.summary.netProfit / 1000} decimals={0} />K
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ROI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Percent className="w-5 h-5 text-accent" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                financialData.summary.roiChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {financialData.summary.roiChange > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(financialData.summary.roiChange)}%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-muted-foreground text-sm">ROI</div>
              <div className="text-2xl font-semibold text-foreground mt-1">
                <AnimatedCounter end={financialData.summary.roi} decimals={1} />%
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Occupancy Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                financialData.summary.occupancyChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {financialData.summary.occupancyChange > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(financialData.summary.occupancyChange)}%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-muted-foreground text-sm">Occupancy Rate</div>
              <div className="text-2xl font-semibold text-foreground mt-1">
                <AnimatedCounter end={financialData.summary.occupancy} decimals={0} />%
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Revenue vs Expenses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-card border-border">
            <h3 className="text-foreground mb-4">Revenue vs Expenses (Monthly)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0DD" />
                <XAxis 
                  dataKey="month" 
                  stroke="#7C7C7C"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#7C7C7C"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <ChartTooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #E0E0DD',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#9BAE84" name="Revenue" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#D6E0D0" name="Expenses" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Donut Chart - Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 bg-card border-border">
            <h3 className="text-foreground mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financialData.expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {financialData.expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value}% (${formatCurrency(props.payload.amount)})`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #E0E0DD',
                    borderRadius: '12px',
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry: any) => `${value} (${entry.payload.value}%)`}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Cashflow Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6 bg-card border-border overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Monthly Cash Flow Summary</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportExcel}
              className="gap-2"
            >
              <FileDown className="w-4 h-4" />
              Export Table
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th 
                    className="text-left py-3 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort('month')}
                  >
                    Month
                  </th>
                  <th 
                    className="text-right py-3 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort('income')}
                  >
                    Income
                  </th>
                  <th 
                    className="text-right py-3 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort('expenses')}
                  >
                    Expenses
                  </th>
                  <th 
                    className="text-right py-3 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort('net')}
                  >
                    Net
                  </th>
                  <th 
                    className="text-right py-3 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort('roi')}
                  >
                    ROI
                  </th>
                  <th className="text-center py-3 px-4 text-muted-foreground">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCashflow.map((row, index) => (
                  <tr 
                    key={index}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-foreground">{row.month}</td>
                    <td className="py-3 px-4 text-right text-foreground">
                      {formatCurrency(row.income)}
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">
                      {formatCurrency(row.expenses)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-foreground">
                      {formatCurrency(row.net)}
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">
                      {row.roi}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

        </TabsContent>

        {/* Detailed Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4 mt-6">
          {/* Transaction Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    {transactionsData.summary.incomeChange}%
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">Total Income</div>
                <div className="text-xl font-semibold text-foreground mt-1">
                  SAR <AnimatedCounter end={transactionsData.summary.totalIncome / 1000} decimals={0} />K
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ArrowDownRight className="w-3 h-3" />
                    {Math.abs(transactionsData.summary.expensesChange)}%
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">Total Expenses</div>
                <div className="text-xl font-semibold text-foreground mt-1">
                  SAR <AnimatedCounter end={transactionsData.summary.totalExpenses / 1000} decimals={1} />K
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    {transactionsData.summary.cashflowChange}%
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">Net Cashflow</div>
                <div className="text-xl font-semibold text-foreground mt-1">
                  SAR <AnimatedCounter end={transactionsData.summary.netCashflow / 1000} decimals={1} />K
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-accent-foreground" />
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">Total Transactions</div>
                <div className="text-xl font-semibold text-foreground mt-1">
                  <AnimatedCounter end={transactionsData.transactions.length} decimals={0} />
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Filter Bar */}
          <Card className="p-4 bg-card border-border">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by property, description, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleResetFilters}>
                  Reset
                </Button>
              </div>

              {/* Quick Filter Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:bg-primary/10 ${filterType === 'Income' ? 'bg-primary/10 border-primary' : ''}`}
                  onClick={() => setFilterType('Income')}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Income
                </Badge>
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:bg-destructive/10 ${filterType === 'Expense' ? 'bg-destructive/10 border-destructive' : ''}`}
                  onClick={() => setFilterType('Expense')}
                >
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Expenses
                </Badge>
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:bg-primary/10 ${filterStatus === 'Paid' ? 'bg-primary/10 border-primary' : ''}`}
                  onClick={() => setFilterStatus('Paid')}
                >
                  Paid
                </Badge>
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:bg-accent/10 ${filterStatus === 'Pending' ? 'bg-accent/10 border-accent' : ''}`}
                  onClick={() => setFilterStatus('Pending')}
                >
                  Pending
                </Badge>
                {(filterType !== 'all' || filterStatus !== 'all') && (
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={handleResetFilters}
                  >
                    Clear Filters
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Transactions Table - Desktop */}
          <Card className="bg-card border-border overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr className="border-b border-border">
                    <th 
                      className="text-left py-4 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                      onClick={() => handleTransactionSort('date')}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                      </div>
                    </th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Property</th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Description</th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Category</th>
                    <th 
                      className="text-right py-4 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                      onClick={() => handleTransactionSort('amount')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Amount
                        <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                      </div>
                    </th>
                    <th className="text-center py-4 px-4 text-muted-foreground">Type</th>
                    <th className="text-center py-4 px-4 text-muted-foreground">Status</th>
                    <th className="text-center py-4 px-4 text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-muted-foreground text-sm">{formatDate(transaction.date)}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-foreground">{transaction.property}</div>
                          <div className="text-xs text-muted-foreground">{transaction.propertyId}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground">{transaction.description}</td>
                      <td className="py-4 px-4 text-muted-foreground text-sm">{transaction.category}</td>
                      <td className={`py-4 px-4 text-right font-semibold ${getTypeColor(transaction.type)}`}>
                        {transaction.type === 'Income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className={transaction.type === 'Income' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                          {transaction.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTransaction(transaction)}
                            className="w-8 h-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedTransactions.length)} of {sortedTransactions.length} transactions
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Mobile Transaction Cards */}
          <div className="lg:hidden space-y-3">
            {paginatedTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 bg-card border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Receipt className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{formatDate(transaction.date)}</span>
                      </div>
                      <h4 className="text-foreground">{transaction.property}</h4>
                      <div className="text-xs text-muted-foreground mt-1">{transaction.propertyId}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className={transaction.type === 'Income' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                        {transaction.type}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="text-sm text-foreground">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">Category: {transaction.category}</div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Amount</div>
                      <div className={`font-semibold text-foreground ${getTypeColor(transaction.type)}`}>
                        {transaction.type === 'Income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTransaction(transaction)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Invoices & Payments Tab */}
        <TabsContent value="invoices" className="space-y-4 mt-6">
          {/* Invoice Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    {invoicesData.summary.totalInvoicesChange}%
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">Total Invoices</div>
                <div className="text-xl font-semibold text-foreground mt-1">
                  SAR <AnimatedCounter end={invoicesData.summary.totalInvoices / 1000} decimals={0} />K
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    {invoicesData.summary.paidChange}%
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">Paid</div>
                <div className="text-xl font-semibold text-foreground mt-1">
                  SAR <AnimatedCounter end={invoicesData.summary.paid / 1000} decimals={0} />K
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ArrowDownRight className="w-3 h-3" />
                    {Math.abs(invoicesData.summary.outstandingChange)}%
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">Outstanding</div>
                <div className="text-xl font-semibold text-foreground mt-1">
                  SAR <AnimatedCounter end={invoicesData.summary.outstanding / 1000} decimals={0} />K
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <ArrowUpRight className="w-3 h-3" />
                    {invoicesData.summary.overdueChange}%
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">Overdue</div>
                <div className="text-xl font-semibold text-foreground mt-1">
                  <AnimatedCounter end={invoicesData.summary.overdue} decimals={0} />
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Filter and Action Bar */}
          <Card className="p-4 bg-card border-border">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by invoice ID or client..."
                    value={invoiceSearchQuery}
                    onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={invoiceFilterStatus} onValueChange={setInvoiceFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleResetInvoiceFilters} variant="outline">
                  Reset
                </Button>

                <Button onClick={handleCreateInvoice} className="gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  New Invoice
                </Button>
              </div>

              {/* Quick Filter Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:bg-primary/10 ${invoiceFilterStatus === 'Paid' ? 'bg-primary/10 border-primary' : ''}`}
                  onClick={() => handleQuickInvoiceFilter('Paid')}
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Paid
                </Badge>
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:bg-accent/10 ${invoiceFilterStatus === 'Pending' ? 'bg-accent/10 border-accent' : ''}`}
                  onClick={() => handleQuickInvoiceFilter('Pending')}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:bg-destructive/10 ${invoiceFilterStatus === 'Overdue' ? 'bg-destructive/10 border-destructive' : ''}`}
                  onClick={() => handleQuickInvoiceFilter('Overdue')}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              </div>
            </div>
          </Card>

          {/* Invoices Table - Desktop */}
          <Card className="bg-card border-border overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr className="border-b border-border">
                    <th 
                      className="text-left py-4 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                      onClick={() => handleInvoiceSort('id')}
                    >
                      <div className="flex items-center gap-2">
                        Invoice ID
                        <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                      </div>
                    </th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Client</th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Issue Date</th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Due Date</th>
                    <th 
                      className="text-right py-4 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                      onClick={() => handleInvoiceSort('total')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Amount
                        <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                      </div>
                    </th>
                    <th className="text-center py-4 px-4 text-muted-foreground">Status</th>
                    <th className="text-center py-4 px-4 text-muted-foreground">Payment</th>
                    <th className="text-center py-4 px-4 text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-foreground font-semibold">
                          {invoice.id}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-foreground">{invoice.client}</div>
                          <div className="text-xs text-muted-foreground">{invoice.propertyId}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground text-sm">{formatDate(invoice.issueDate)}</td>
                      <td className="py-4 px-4 text-muted-foreground text-sm">{formatDate(invoice.dueDate)}</td>
                      <td className="py-4 px-4 text-right font-semibold text-foreground">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className={getInvoiceStatusColor(invoice.status)}>
                          <span className="flex items-center gap-1">
                            {getInvoiceStatusIcon(invoice.status)}
                            {invoice.status}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {invoice.paidAmount && invoice.paidAmount < invoice.total ? (
                          <div className="space-y-1">
                            <Progress value={getPaymentProgress(invoice)} className="h-2" />
                            <div className="text-xs text-muted-foreground text-center">
                              {Math.round(getPaymentProgress(invoice))}%
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-sm text-muted-foreground">
                            {invoice.status === 'Paid' ? '100%' : 'N/A'}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                            className="w-8 h-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="w-8 h-8 p-0"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {invoiceTotalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Showing {(invoiceCurrentPage - 1) * invoiceItemsPerPage + 1} to {Math.min(invoiceCurrentPage * invoiceItemsPerPage, sortedInvoices.length)} of {sortedInvoices.length} invoices
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInvoiceCurrentPage(p => Math.max(1, p - 1))}
                    disabled={invoiceCurrentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, invoiceTotalPages) }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === invoiceCurrentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setInvoiceCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInvoiceCurrentPage(p => Math.min(invoiceTotalPages, p + 1))}
                    disabled={invoiceCurrentPage === invoiceTotalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Mobile Invoice Cards */}
          <div className="lg:hidden space-y-3">
            {paginatedInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 bg-card border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Receipt className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{invoice.id}</span>
                      </div>
                      <h4 className="text-foreground">{invoice.client}</h4>
                      <div className="text-xs text-muted-foreground mt-1">{invoice.propertyId}</div>
                    </div>
                    <Badge variant="outline" className={getInvoiceStatusColor(invoice.status)}>
                      <span className="flex items-center gap-1">
                        {getInvoiceStatusIcon(invoice.status)}
                        {invoice.status}
                      </span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Issued</div>
                      <div className="text-foreground">{formatDate(invoice.issueDate)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Due</div>
                      <div className="text-foreground">{formatDate(invoice.dueDate)}</div>
                    </div>
                  </div>

                  {invoice.paidAmount && invoice.paidAmount < invoice.total && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Payment Progress</span>
                        <span className="text-xs text-foreground font-semibold">{Math.round(getPaymentProgress(invoice))}%</span>
                      </div>
                      <Progress value={getPaymentProgress(invoice)} className="h-2" />
                    </div>
                  )}

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Amount</div>
                      <div className="font-semibold text-foreground">{formatCurrency(invoice.total)}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Mobile Pagination */}
            {invoiceTotalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInvoiceCurrentPage(p => Math.max(1, p - 1))}
                  disabled={invoiceCurrentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {invoiceCurrentPage} of {invoiceTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInvoiceCurrentPage(p => Math.min(invoiceTotalPages, p + 1))}
                  disabled={invoiceCurrentPage === invoiceTotalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Invoice Details Sheet */}
      <Sheet open={isInvoiceDetailsOpen} onOpenChange={setIsInvoiceDetailsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedInvoice && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Invoice {selectedInvoice.id}
                </SheetTitle>
                <SheetDescription>
                  Issued on {formatDate(selectedInvoice.issueDate)}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getInvoiceStatusColor(selectedInvoice.status)}>
                    <span className="flex items-center gap-1">
                      {getInvoiceStatusIcon(selectedInvoice.status)}
                      {selectedInvoice.status}
                    </span>
                  </Badge>
                  {selectedInvoice.paidDate && (
                    <span className="text-sm text-muted-foreground">
                      Paid on {formatDate(selectedInvoice.paidDate)}
                    </span>
                  )}
                </div>

                {/* Client and Property Info */}
                <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Bill To</div>
                      <div className="text-foreground font-semibold">{selectedInvoice.client}</div>
                      <div className="text-xs text-muted-foreground">Property ID: {selectedInvoice.propertyId}</div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Due Date</span>
                    </div>
                    <span className="text-foreground font-semibold">{formatDate(selectedInvoice.dueDate)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">Payment Method</span>
                    </div>
                    <span className="text-foreground font-semibold">{selectedInvoice.method}</span>
                  </div>

                  {selectedInvoice.reference && (
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hash className="w-4 h-4" />
                        <span className="text-sm">Reference</span>
                      </div>
                      <span className="text-foreground font-semibold">{selectedInvoice.reference}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Line Items */}
                <div>
                  <h4 className="text-foreground mb-3">Line Items</h4>
                  <div className="space-y-2">
                    {selectedInvoice.lineItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex-1">
                          <div className="text-foreground">{item.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.quantity} × {formatCurrency(item.rate)}
                          </div>
                        </div>
                        <div className="font-semibold text-foreground">{formatCurrency(item.amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-semibold">{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>

                  {selectedInvoice.vat > 0 && (
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-muted-foreground">VAT (15%)</span>
                      <span className="text-foreground font-semibold">{formatCurrency(selectedInvoice.vat)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <span className="text-foreground font-semibold">Total Amount</span>
                    <span className="text-xl font-semibold text-primary">{formatCurrency(selectedInvoice.total)}</span>
                  </div>

                  {selectedInvoice.paidAmount && selectedInvoice.paidAmount < selectedInvoice.total && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="text-green-600 font-semibold">{formatCurrency(selectedInvoice.paidAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <span className="text-foreground font-semibold">Balance Due</span>
                        <span className="text-destructive font-semibold">{formatCurrency(selectedInvoice.total - selectedInvoice.paidAmount)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Notes</div>
                    <div className="text-foreground text-sm">{selectedInvoice.notes}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => handleDownloadInvoice(selectedInvoice)}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => handleSendInvoice(selectedInvoice)}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileCheck className="w-4 h-4" />
                    Mark Paid
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Transaction Details Sheet */}
      <Sheet open={isTransactionDetailsOpen} onOpenChange={setIsTransactionDetailsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selectedTransaction && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Transaction Details
                </SheetTitle>
                <SheetDescription>
                  Transaction #{selectedTransaction.id}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status and Type Badges */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={selectedTransaction.type === 'Income' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                    {selectedTransaction.type}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status}
                  </Badge>
                </div>

                {/* Property Info */}
                <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Property</div>
                      <div className="text-foreground font-semibold">{selectedTransaction.property}</div>
                      <div className="text-xs text-muted-foreground">ID: {selectedTransaction.propertyId}</div>
                    </div>
                  </div>
                </div>

                {/* Transaction Amount */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="text-sm text-muted-foreground mb-1">Amount</div>
                  <div className={`text-2xl font-semibold ${getTypeColor(selectedTransaction.type)}`}>
                    {selectedTransaction.type === 'Income' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Date</span>
                    </div>
                    <span className="text-foreground font-semibold">{formatDate(selectedTransaction.date)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Hash className="w-4 h-4" />
                      <span className="text-sm">Invoice Number</span>
                    </div>
                    <span className="text-foreground font-semibold">{selectedTransaction.invoiceNumber}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">Payment Method</span>
                    </div>
                    <span className="text-foreground font-semibold">{selectedTransaction.paymentMethod}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Approver</span>
                    </div>
                    <span className="text-foreground font-semibold">{selectedTransaction.approver}</span>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h4 className="text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground text-sm">{selectedTransaction.description}</p>
                </div>

                {/* Notes */}
                {selectedTransaction.notes && (
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Notes</div>
                    <div className="text-foreground text-sm">{selectedTransaction.notes}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                  <Button variant="outline" className="gap-2">
                    <FileDown className="w-4 h-4" />
                    Export
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Receipt className="w-4 h-4" />
                    View Invoice
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* AI Insights Panel - Sliding from right */}
      <AnimatePresence>
        {insightsPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setInsightsPanelOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-foreground">AI Financial Insights</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInsightsPanelOpen(false)}
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {financialData.aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-primary/5 border border-primary/20 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                        </div>
                        <p className="text-foreground text-sm leading-relaxed">
                          {insight}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                  <p className="text-muted-foreground text-sm">
                    💡 <strong>Tip:</strong> These insights are generated based on your financial data and industry benchmarks.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
