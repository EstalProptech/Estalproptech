import { Building2, DollarSign, Users, Wrench, Plus, TrendingUp, Activity, Sparkles } from "lucide-react";
import { useState } from "react";
import { KPICard } from "./KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AIInsightCard } from "./AIInsightCard";
import { AddPropertyModal } from "./AddPropertyModal";
import { motion } from "motion/react";

const revenueData = [
  { month: 'Jan', revenue: 180000 },
  { month: 'Feb', revenue: 210000 },
  { month: 'Mar', revenue: 195000 },
  { month: 'Apr', revenue: 245000 },
  { month: 'May', revenue: 230000 },
  { month: 'Jun', revenue: 268000 },
  { month: 'Jul', revenue: 285000 },
  { month: 'Aug', revenue: 302000 },
  { month: 'Sep', revenue: 318000 },
  { month: 'Oct', revenue: 340000 },
];

const propertyStatusData = [
  { name: 'Available', value: 10, color: '#10B981' },
  { name: 'Rented', value: 110, color: '#0EA5E9' },
  { name: 'Maintenance', value: 12, color: '#F59E0B' },
];

const recentActivities = [
  { id: 1, type: 'lease', title: 'New lease signed', property: 'Skyline Apartments #402', time: '2 hours ago', status: 'success' },
  { id: 2, type: 'payment', title: 'Payment received - 4,500 SAR', property: 'Downtown Plaza #1203', time: '4 hours ago', status: 'success' },
  { id: 3, type: 'maintenance', title: 'Maintenance request', property: 'Garden View #105', time: '5 hours ago', status: 'warning' },
  { id: 4, type: 'lease', title: 'Lease renewal', property: 'Riverside Tower #801', time: '1 day ago', status: 'success' },
  { id: 5, type: 'issue', title: 'Issue reported', property: 'Parkside Homes #22', time: '1 day ago', status: 'error' },
];

interface DashboardViewProps {
  onNavigate?: (view: string) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, here's what's happening today</p>
        </div>
        <Button 
          onClick={() => setIsAddPropertyOpen(true)}
          className="rounded-xl gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AIInsightCard
          type="prediction"
          title="Revenue Prediction"
          description="Predicted revenue for next month based on current trends and seasonal patterns"
          metric="+8.2% (1.35M SAR)"
          confidence={87}
        />
        <AIInsightCard
          type="suggestion"
          title="Rent Optimization"
          description="AI suggests increasing rent in Al-Narjis district by 5% based on market demand"
          metric="Potential: +22,500 SAR/month"
          confidence={92}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <KPICard
            title="Total Properties"
            value="120"
            change="+8"
          isPositive={true}
          icon={Building2}
          iconBgColor="bg-primary"
        />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <KPICard
            title="Monthly Revenue"
            value="1.25M SAR"
            change="+12.5%"
            isPositive={true}
            icon={DollarSign}
            iconBgColor="bg-secondary"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <KPICard
            title="Occupancy Rate"
            value="92%"
            change="+2.4%"
            isPositive={true}
            icon={Users}
            iconBgColor="bg-[#8B5CF6]"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <KPICard
            title="Active Issues"
            value="43"
            change="-4"
            isPositive={true}
            icon={Wrench}
            iconBgColor="bg-[#F59E0B]"
          />
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Revenue Trend
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-lg">Last 10 Months</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-primary">AI: +8.2% predicted next month</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
                  formatter={(value) => [`${value.toLocaleString()} SAR`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" strokeWidth={3} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Status Pie Chart */}
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Property Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {propertyStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="rounded-2xl shadow-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-lg"
              onClick={() => onNavigate?.('maintenance')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-sidebar-accent/50 hover:bg-sidebar-accent transition-all cursor-pointer hover:shadow-md"
              >
                <div className="flex-1">
                  <p>{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.property}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                  <Badge 
                    variant={activity.status === 'success' ? 'default' : activity.status === 'warning' ? 'secondary' : 'destructive'}
                    className="rounded-lg"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddPropertyModal 
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
      />
    </div>
  );
}
