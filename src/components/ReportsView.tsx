import { Download, FileText, Calendar, TrendingUp, FileCheck } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";

const monthlySalesData = [
  { month: 'Jan', sales: 180000, expenses: 128000 },
  { month: 'Feb', sales: 208000, expenses: 140000 },
  { month: 'Mar', sales: 192000, expenses: 132000 },
  { month: 'Apr', sales: 244000, expenses: 152000 },
  { month: 'May', sales: 232000, expenses: 144000 },
  { month: 'Jun', sales: 268000, expenses: 160000 },
  { month: 'Jul', sales: 288000, expenses: 168000 },
  { month: 'Aug', sales: 276000, expenses: 164000 },
];

const incomeTrendData = [
  { month: 'Jan', income: 52000 },
  { month: 'Feb', income: 68000 },
  { month: 'Mar', income: 60000 },
  { month: 'Apr', income: 92000 },
  { month: 'May', income: 88000 },
  { month: 'Jun', income: 108000 },
  { month: 'Jul', income: 120000 },
  { month: 'Aug', income: 112000 },
];

const expenseCategoryData = [
  { name: 'Maintenance', value: 280000, color: '#0EA5E9' },
  { name: 'Utilities', value: 150000, color: '#10B981' },
  { name: 'Insurance', value: 120000, color: '#F59E0B' },
  { name: 'Taxes', value: 180000, color: '#8B5CF6' },
  { name: 'Management', value: 100000, color: '#EF4444' },
];

export function ReportsView() {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    toast.info("Generating PDF Report...", {
      description: "Please wait while we compile your report.",
    });

    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2500));

    setIsExportingPDF(false);
    toast.success("PDF Report Generated!", {
      description: "Your report has been downloaded successfully.",
      icon: <FileCheck className="w-4 h-4" />,
    });
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    toast.info("Generating Excel Report...", {
      description: "Please wait while we compile your report.",
    });

    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2500));

    setIsExportingExcel(false);
    toast.success("Excel Report Generated!", {
      description: "Your report has been downloaded successfully.",
      icon: <FileCheck className="w-4 h-4" />,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Financial reports and business insights</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl gap-2"
            onClick={handleExportPDF}
            disabled={isExportingPDF}
          >
            {isExportingPDF ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export PDF
              </>
            )}
          </Button>
          <Button 
            className="rounded-xl gap-2 shadow-lg shadow-primary/30"
            onClick={handleExportExcel}
            disabled={isExportingExcel}
          >
            {isExportingExcel ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Excel
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl shadow-sm border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select defaultValue="2025">
              <SelectTrigger className="w-full md:w-48 rounded-xl">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-48 rounded-xl">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="monthly">
              <SelectTrigger className="w-full md:w-48 rounded-xl">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl gap-2">
              <Calendar className="w-4 h-4" />
              Custom Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl">$492,000</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-secondary text-white rounded-lg">+12.5%</Badge>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <h3 className="text-2xl">$297,000</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#F59E0B] text-white rounded-lg">+8.2%</Badge>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <h3 className="text-2xl">$195,000</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-secondary text-white rounded-lg">+15.3%</Badge>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle>Monthly Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
                  formatter={(value) => `$${value}`}
                />
                <Legend iconType="circle" />
                <Bar dataKey="sales" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Income Trend Chart */}
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle>Net Income Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={incomeTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
                  formatter={(value) => [`$${value}`, 'Income']}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Expense Categories Pie Chart */}
      <Card className="rounded-2xl shadow-sm border-border">
        <CardHeader>
          <CardTitle>Expense Categories Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={expenseCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={140}
                dataKey="value"
              >
                {expenseCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
                formatter={(value) => `$${value}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
