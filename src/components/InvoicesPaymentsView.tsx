import { useState } from "react";
import {
  FileText,
  Plus,
  CreditCard,
  FileDown,
  Filter,
  Sparkles,
  Search,
  ArrowUpDown,
  Eye,
  Send,
  Download,
  CheckCircle2,
  X,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Receipt,
  User,
  Hash,
  FileCheck,
  Printer
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { invoicesData } from "../data/invoicesData";
import { AnimatedCounter } from "./AnimatedCounter";

type Invoice = typeof invoicesData.invoices[0];
type PaymentHistory = typeof invoicesData.paymentHistory[0];

export function InvoicesPaymentsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice; direction: 'asc' | 'desc' } | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("invoices");
  const itemsPerPage = 10;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter invoices
  const filteredInvoices = invoicesData.invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
  const paginatedInvoices = sortedInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (key: keyof Invoice) => {
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

  // Handle view invoice
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  // Get status color
  const getStatusColor = (status: string) => {
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

  // Get status icon
  const getStatusIcon = (status: string) => {
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

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setSortConfig(null);
    toast.success("Filters reset");
  };

  // Export functions
  const handleExportPDF = () => {
    toast.success("Exporting to PDF...", {
      description: `${filteredInvoices.length} invoices will be exported.`
    });
  };

  const handleExportExcel = () => {
    toast.success("Exporting to Excel...", {
      description: `${filteredInvoices.length} invoices will be exported.`
    });
  };

  // Create invoice
  const handleCreateInvoice = () => {
    toast.info("Create Invoice", {
      description: "This feature will be available soon."
    });
  };

  // Add payment
  const handleAddPayment = () => {
    toast.info("Add Payment", {
      description: "This feature will be available soon."
    });
  };

  // Quick filter by status
  const handleQuickFilter = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  // Calculate payment progress
  const getPaymentProgress = (invoice: Invoice) => {
    if (!invoice.paidAmount) return 0;
    return (invoice.paidAmount / invoice.total) * 100;
  };

  return (
    <div className="max-w-[1800px] mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-foreground">Invoices & Payments</h1>
          <p className="text-muted-foreground mt-1">
            Monitor, issue, and track all billing and payment activities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleCreateInvoice}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </Button>

          <Button
            onClick={handleAddPayment}
            variant="outline"
            className="gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Add Payment
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
            onClick={() => setIsAIInsightsOpen(!isAIInsightsOpen)}
            className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Sparkles className="w-4 h-4" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                {invoicesData.summary.totalInvoicesChange}%
              </div>
            </div>
            <div className="text-muted-foreground text-sm">Total Invoices</div>
            <div className="text-xl font-semibold text-foreground mt-1">
              SAR <AnimatedCounter end={invoicesData.summary.totalInvoices / 1000} decimals={0} />K
            </div>
          </Card>
        </motion.div>

        {/* Paid Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                {invoicesData.summary.paidChange}%
              </div>
            </div>
            <div className="text-muted-foreground text-sm">Paid Invoices</div>
            <div className="text-xl font-semibold text-foreground mt-1">
              SAR <AnimatedCounter end={invoicesData.summary.paid / 1000} decimals={0} />K
            </div>
          </Card>
        </motion.div>

        {/* Outstanding Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingDown className="w-3 h-3" />
                {Math.abs(invoicesData.summary.outstandingChange)}%
              </div>
            </div>
            <div className="text-muted-foreground text-sm">Outstanding Balance</div>
            <div className="text-xl font-semibold text-foreground mt-1">
              SAR <AnimatedCounter end={invoicesData.summary.outstanding / 1000} decimals={0} />K
            </div>
          </Card>
        </motion.div>

        {/* Overdue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <TrendingUp className="w-3 h-3" />
                {invoicesData.summary.overdueChange}%
              </div>
            </div>
            <div className="text-muted-foreground text-sm">Overdue Invoices</div>
            <div className="text-xl font-semibold text-foreground mt-1">
              <AnimatedCounter end={invoicesData.summary.overdue} decimals={0} /> invoices
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tabs for Invoices and Payment History */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4 mt-4">
          {/* Filter Bar and Quick Filters */}
          <Card className="p-4 bg-card border-border">
            <div className="space-y-3">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by invoice ID or client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
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

                <Button variant="outline" onClick={handleResetFilters}>
                  Reset
                </Button>
              </div>

              {/* Quick Filter Chips */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:bg-primary/10 ${filterStatus === 'Paid' ? 'bg-primary/10 border-primary' : ''}`}
                  onClick={() => handleQuickFilter('Paid')}
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Paid
                </Badge>
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:bg-accent/10 ${filterStatus === 'Pending' ? 'bg-accent/10 border-accent' : ''}`}
                  onClick={() => handleQuickFilter('Pending')}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:bg-destructive/10 ${filterStatus === 'Overdue' ? 'bg-destructive/10 border-destructive' : ''}`}
                  onClick={() => handleQuickFilter('Overdue')}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
                {filterStatus !== 'all' && (
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleQuickFilter('all')}
                  >
                    Show All
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Invoices Table - Desktop */}
          <Card className="bg-card border-border overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-muted-foreground">
                      Invoice ID
                    </th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Client / Property</th>
                    <th 
                      className="text-left py-4 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                      onClick={() => handleSort('issueDate')}
                    >
                      <div className="flex items-center gap-2">
                        Issue Date
                        <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                      </div>
                    </th>
                    <th 
                      className="text-left py-4 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                      onClick={() => handleSort('dueDate')}
                    >
                      <div className="flex items-center gap-2">
                        Due Date
                        <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                      </div>
                    </th>
                    <th 
                      className="text-right py-4 px-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Amount
                        <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                      </div>
                    </th>
                    <th className="text-center py-4 px-4 text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Payment Method</th>
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
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{invoice.id}</span>
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
                      <td className="py-4 px-4 text-right text-foreground font-semibold">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className={getStatusColor(invoice.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(invoice.status)}
                            {invoice.status}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground text-sm">{invoice.method}</td>
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedInvoices.length)} of {sortedInvoices.length} invoices
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
                    <Badge variant="outline" className={getStatusColor(invoice.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </span>
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Issue Date:</span>
                      <span className="text-foreground">{formatDate(invoice.issueDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="text-foreground">{formatDate(invoice.dueDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="text-foreground">{invoice.method}</span>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Amount</div>
                      <div className="font-semibold text-foreground">{formatCurrency(invoice.amount)}</div>
                    </div>
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

                  {/* Payment Progress for Partial Payments */}
                  {invoice.paidAmount && invoice.paidAmount > 0 && invoice.paidAmount < invoice.total && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Paid: {formatCurrency(invoice.paidAmount)}</span>
                        <span>{Math.round(getPaymentProgress(invoice))}%</span>
                      </div>
                      <Progress value={getPaymentProgress(invoice)} className="h-2" />
                    </div>
                  )}
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

        {/* Payment History Tab */}
        <TabsContent value="payments" className="space-y-4 mt-4">
          <Card className="bg-card border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-muted-foreground">Date</th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Invoice ID</th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Client</th>
                    <th className="text-right py-4 px-4 text-muted-foreground">Amount</th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Method</th>
                    <th className="text-left py-4 px-4 text-muted-foreground">Reference</th>
                    <th className="text-center py-4 px-4 text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoicesData.paymentHistory.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-foreground">{formatDate(payment.date)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{payment.invoiceId}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground">{payment.client}</td>
                      <td className="py-4 px-4 text-right text-foreground font-semibold">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground text-sm">{payment.method}</td>
                      <td className="py-4 px-4 text-muted-foreground text-sm">{payment.reference}</td>
                      <td className="py-4 px-4 text-center">
                        <Badge 
                          variant="outline" 
                          className={payment.status === 'Cleared' 
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'bg-accent/10 text-accent-foreground border-accent/20'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selectedInvoice && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Invoice Details
                </SheetTitle>
                <SheetDescription>
                  {selectedInvoice.id}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={getStatusColor(selectedInvoice.status)} size="lg">
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedInvoice.status)}
                      {selectedInvoice.status}
                    </span>
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Ref: {selectedInvoice.reference}
                  </div>
                </div>

                {/* Client & Property Info */}
                <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Client / Property</div>
                      <div className="text-foreground font-semibold">{selectedInvoice.client}</div>
                      <div className="text-xs text-muted-foreground">ID: {selectedInvoice.propertyId}</div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">Issue Date</div>
                    </div>
                    <div className="text-foreground font-semibold">{formatDate(selectedInvoice.issueDate)}</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">Due Date</div>
                    </div>
                    <div className="text-foreground font-semibold">{formatDate(selectedInvoice.dueDate)}</div>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <h4 className="text-foreground mb-3 flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    Line Items
                  </h4>
                  <div className="space-y-2">
                    {selectedInvoice.lineItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-start p-3 bg-muted/20 rounded-lg">
                        <div className="flex-1">
                          <div className="text-foreground">{item.description}</div>
                          <div className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × {formatCurrency(item.rate)}
                          </div>
                        </div>
                        <div className="text-foreground font-semibold">
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT (0%)</span>
                    <span className="text-foreground">{formatCurrency(selectedInvoice.vat)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-foreground font-semibold">Total</span>
                    <span className="text-foreground font-semibold text-xl">
                      {formatCurrency(selectedInvoice.total)}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                {selectedInvoice.paidAmount > 0 && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Paid Amount</span>
                      <span className="font-semibold text-primary">{formatCurrency(selectedInvoice.paidAmount)}</span>
                    </div>
                    {selectedInvoice.paidAmount < selectedInvoice.total && (
                      <>
                        <Progress value={getPaymentProgress(selectedInvoice)} className="h-2 mb-2" />
                        <div className="text-xs text-muted-foreground">
                          {Math.round(getPaymentProgress(selectedInvoice))}% paid · {formatCurrency(selectedInvoice.total - selectedInvoice.paidAmount)} remaining
                        </div>
                      </>
                    )}
                    {selectedInvoice.paidDate && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Paid on {formatDate(selectedInvoice.paidDate)}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Notes</div>
                    <div className="text-foreground text-sm">{selectedInvoice.notes}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                  <Button variant="outline" className="gap-2">
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                  {selectedInvoice.status !== 'Paid' && (
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* AI Billing Insights Panel */}
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
                    <h3 className="text-foreground">AI Billing Insights</h3>
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
                  {invoicesData.aiInsights.map((insight, index) => (
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
                  Generate Billing Summary
                </Button>

                <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                  <p className="text-muted-foreground text-sm">
                    💡 <strong>Tip:</strong> These insights are based on your billing patterns and payment history to help optimize collections.
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
