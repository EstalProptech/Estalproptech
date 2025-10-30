import { useState } from "react";
import {
  ReceiptText,
  Plus,
  FileDown,
  Filter,
  Sparkles,
  Search,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  Building2,
  CreditCard,
  User,
  FileText,
  StickyNote,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { transactionsData } from "../data/transactionsData";
import { AnimatedCounter } from "./AnimatedCounter";

type Transaction = typeof transactionsData.transactions[0];

export function DetailedTransactionsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProperty, setFilterProperty] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("month");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique properties for filter
  const uniqueProperties = Array.from(new Set(transactionsData.transactions.map(t => t.property)));

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter transactions
  const filteredTransactions = transactionsData.transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProperty = filterProperty === "all" || transaction.property === filterProperty;
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;

    return matchesSearch && matchesProperty && matchesType && matchesStatus;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (key: keyof Transaction) => {
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

  // Handle view transaction
  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Completed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Pending':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'Overdue':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    return type === 'Income' 
      ? 'bg-primary/10 text-primary border-primary/20'
      : 'bg-destructive/10 text-destructive border-destructive/20';
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterProperty("all");
    setFilterType("all");
    setFilterStatus("all");
    setDateRange("month");
    setSortConfig(null);
    toast.success("Filters reset");
  };

  // Export functions
  const handleExportPDF = () => {
    toast.success("Exporting to PDF...", {
      description: `${filteredTransactions.length} transactions will be exported.`
    });
  };

  const handleExportExcel = () => {
    toast.success("Exporting to Excel...", {
      description: `${filteredTransactions.length} transactions will be exported.`
    });
  };

  // Add transaction
  const handleAddTransaction = () => {
    toast.info("Add Transaction", {
      description: "This feature will be available soon."
    });
  };

  return (
    <div className="max-w-[1800px] mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-foreground">Detailed Transactions</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage all property-related financial operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleAddTransaction}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>

          <Button variant="outline" onClick={handleExportExcel} className="gap-2">
            <FileDown className="w-4 h-4" />
            Excel
          </Button>

          <Button variant="outline" onClick={handleExportPDF} className="gap-2">
            <FileDown className="w-4 h-4" />
            PDF
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="gap-2 lg:hidden"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>

          <Button
            onClick={() => setIsAIInsightsOpen(!isAIInsightsOpen)}
            className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Sparkles className="w-4 h-4" />
            AI Summary
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Total Income */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
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

        {/* Total Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-destructive" />
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

        {/* Net Cashflow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
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

        {/* Pending Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent-foreground" />
              </div>
            </div>
            <div className="text-muted-foreground text-sm">Pending Invoices</div>
            <div className="text-xl font-semibold text-foreground mt-1">
              <AnimatedCounter end={transactionsData.summary.pendingInvoices} decimals={0} />
            </div>
          </Card>
        </motion.div>

        {/* Paid Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="sm:col-span-2 lg:col-span-2"
        >
          <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-muted-foreground text-sm">Paid Transactions</div>
            <div className="text-xl font-semibold text-foreground mt-1">
              <AnimatedCounter end={transactionsData.summary.paidTransactions} decimals={0} /> completed
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filter Bar - Desktop */}
      <Card className="p-4 bg-card border-border hidden lg:block">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterProperty} onValueChange={setFilterProperty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {uniqueProperties.map(property => (
                <SelectItem key={property} value={property}>{property}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Mobile Filter Sheet */}
      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Advanced Filters</SheetTitle>
            <SheetDescription>Filter transactions by property, type, status, and date</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Property</label>
              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {uniqueProperties.map(property => (
                    <SelectItem key={property} value={property}>{property}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleResetFilters} variant="outline" className="flex-1">
                Reset
              </Button>
              <Button onClick={() => setIsFiltersOpen(false)} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Transactions Table - Desktop */}
      <Card className="bg-card border-border overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr className="border-b border-border">
                <th 
                  className="text-left py-4 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                  onClick={() => handleSort('date')}
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
                  onClick={() => handleSort('amount')}
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
                  <td className="py-4 px-4 text-foreground">{transaction.date}</td>
                  <td className="py-4 px-4 text-foreground">{transaction.property}</td>
                  <td className="py-4 px-4 text-foreground">{transaction.description}</td>
                  <td className="py-4 px-4 text-muted-foreground text-sm">{transaction.category}</td>
                  <td className="py-4 px-4 text-right text-foreground font-semibold">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge variant="outline" className={getTypeColor(transaction.type)}>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info("Edit feature coming soon")}
                        className="w-8 h-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.error("Delete feature coming soon")}
                        className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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

      {/* Mobile Transactions Cards */}
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
                  <div className="text-sm text-muted-foreground">{transaction.date}</div>
                  <h4 className="text-foreground mt-1">{transaction.description}</h4>
                </div>
                <Badge variant="outline" className={getTypeColor(transaction.type)}>
                  {transaction.type}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{transaction.property}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{transaction.category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-semibold text-foreground">{formatCurrency(transaction.amount)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewTransaction(transaction)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
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

      {/* Transaction Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selectedTransaction && (
            <>
              <SheetHeader>
                <SheetTitle>Transaction Details</SheetTitle>
                <SheetDescription>
                  Invoice #{selectedTransaction.invoiceNumber}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status & Type */}
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getTypeColor(selectedTransaction.type)}>
                    {selectedTransaction.type}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status}
                  </Badge>
                </div>

                {/* Amount */}
                <div className="p-4 bg-muted/30 rounded-xl">
                  <div className="text-sm text-muted-foreground">Transaction Amount</div>
                  <div className="text-3xl font-semibold text-foreground mt-1">
                    {formatCurrency(selectedTransaction.amount)}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="text-foreground">{selectedTransaction.date}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Property</div>
                      <div className="text-foreground">{selectedTransaction.property}</div>
                      <div className="text-sm text-muted-foreground">ID: {selectedTransaction.propertyId}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Description</div>
                      <div className="text-foreground">{selectedTransaction.description}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ReceiptText className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div className="text-foreground">{selectedTransaction.category}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Payment Method</div>
                      <div className="text-foreground">{selectedTransaction.paymentMethod}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Approved By</div>
                      <div className="text-foreground">{selectedTransaction.approver}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <StickyNote className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Notes</div>
                      <div className="text-foreground">{selectedTransaction.notes}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button variant="outline" className="flex-1 gap-2">
                    <FileDown className="w-4 h-4" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* AI Insights Panel */}
      <AnimatePresence>
        {isAIInsightsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsAIInsightsOpen(false)}
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
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-secondary" />
                    </div>
                    <h3 className="text-foreground">AI Financial Insights</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAIInsightsOpen(false)}
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {transactionsData.aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-secondary/5 border border-secondary/20 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <Sparkles className="w-3 h-3 text-secondary" />
                        </div>
                        <p className="text-foreground text-sm leading-relaxed">
                          {insight}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button className="w-full mt-6 gap-2 bg-secondary hover:bg-secondary/90">
                  <Sparkles className="w-4 h-4" />
                  Generate Smart Summary
                </Button>

                <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                  <p className="text-muted-foreground text-sm">
                    💡 <strong>Tip:</strong> These insights are generated based on your transaction history and spending patterns.
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
