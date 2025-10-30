import { Building2, TrendingUp, TrendingDown, DollarSign, ShoppingCart, User, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "motion/react";
import { AnimatedCounter } from "./AnimatedCounter";
import { AIInsightNotification } from "./AIInsightNotification";
import { WelcomeBanner } from "./WelcomeBanner";
import { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "./AuthContext";

const baseWeeklyData = [
  { day: 'Mon', sales: 25000 },
  { day: 'Tue', sales: 32000 },
  { day: 'Wed', sales: 28000 },
  { day: 'Thu', sales: 45000 },
  { day: 'Fri', sales: 38000 },
  { day: 'Sat', sales: 52000 },
  { day: 'Sun', sales: 41000 },
];

const generateRandomizedData = () => {
  return baseWeeklyData.map(item => ({
    ...item,
    sales: Math.round(item.sales * (0.9 + Math.random() * 0.2))
  }));
};

const costBreakdownData = [
  { name: 'Maintenance', value: 35, color: '#5B6E49' },
  { name: 'Repair', value: 25, color: '#9BAE84' },
  { name: 'Taxes', value: 20, color: '#D9C58E' },
  { name: 'Saving', value: 20, color: '#D6E0D0' },
];

const transactions = [
  {
    id: 1,
    property: 'Skyline Tower Unit 402',
    address: 'Al-Narjis District, Riyadh',
    amount: '85,000 SAR',
    date: 'Oct 15, 2025',
    image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400',
    type: 'sale'
  },
  {
    id: 2,
    property: 'Garden Villa 12',
    address: 'King Fahd, Riyadh',
    amount: '120,000 SAR',
    date: 'Oct 14, 2025',
    image: 'https://images.unsplash.com/photo-1689574120966-c7b1e57a8cfe?w=400',
    type: 'sale'
  },
  {
    id: 3,
    property: 'Downtown Loft 8B',
    address: 'Al-Olaya, Riyadh',
    amount: '62,500 SAR',
    date: 'Oct 12, 2025',
    image: 'https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?w=400',
    type: 'sale'
  },
  {
    id: 4,
    property: 'Riverside Apartment 205',
    address: 'Al-Malqa, Riyadh',
    amount: '48,000 SAR',
    date: 'Oct 10, 2025',
    image: 'https://images.unsplash.com/photo-1678788762802-0c6c6cdd89fe?w=400',
    type: 'rent'
  },
];

const maintenanceRequests = [
  {
    id: 1,
    task: 'HVAC System Repair',
    location: 'Building A - Floor 12',
    status: 'In Progress',
    assignedTo: 'Ahmed Hassan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    priority: 'high'
  },
  {
    id: 2,
    task: 'Plumbing Check',
    location: 'Building C - Floor 3',
    status: 'Pending',
    assignedTo: 'Sara Al-Rashid',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    priority: 'medium'
  },
  {
    id: 3,
    task: 'Elevator Maintenance',
    location: 'Building B - Main Lobby',
    status: 'Completed',
    assignedTo: 'Mohammed Ali',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    priority: 'low'
  },
  {
    id: 4,
    task: 'Window Replacement',
    location: 'Building A - Floor 8',
    status: 'Pending',
    assignedTo: 'Fatima Khan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    priority: 'medium'
  },
];

export function NewDashboardView() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState(baseWeeklyData);
  const [showAIInsight, setShowAIInsight] = useState(true);
  const [chartAnimationComplete, setChartAnimationComplete] = useState(false);

  useEffect(() => {
    setWeeklyData(generateRandomizedData());
    const timer = setTimeout(() => setChartAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner for new logins */}
      <WelcomeBanner />

      {showAIInsight && (
        <AIInsightNotification
          message="Based on current maintenance trends, your repair costs will rise 8% next month. Consider preventive maintenance scheduling."
          onDismiss={() => setShowAIInsight(false)}
        />
      )}
      
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Hello, {user?.name || 'User'}! 👋</h1>
        <p className="text-muted-foreground">Welcome back to your property management dashboard</p>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Total Properties</p>
                  <h2 className="text-3xl mb-2">
                    <AnimatedCounter value={120} />
                  </h2>
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="flex items-center gap-1 text-secondary">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">+20%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </motion.div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Number of Sales</p>
                  <h2 className="text-3xl mb-2">
                    <AnimatedCounter value={45} />
                  </h2>
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    <div className="flex items-center gap-1 text-destructive">
                      <TrendingDown className="w-4 h-4" />
                      <span className="text-sm">-10%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </motion.div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="rounded-[20px] shadow-lg border-border overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Total Sales</p>
                  <h2 className="text-3xl mb-2">
                    <AnimatedCounter value={1.25} decimals={2} suffix="M SAR" />
                  </h2>
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <div className="flex items-center gap-1 text-secondary">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">+15%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </motion.div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Report Bar Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle>Weekly Sales Report</CardTitle>
              <p className="text-sm text-muted-foreground">Total sales performance this week</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0DD" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#7C7C7C" 
                    tick={{ fill: '#7C7C7C' }}
                    axisLine={{ stroke: '#E0E0DD' }}
                  />
                  <YAxis 
                    stroke="#7C7C7C" 
                    tick={{ fill: '#7C7C7C' }}
                    axisLine={{ stroke: '#E0E0DD' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #E0E0DD',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} SAR`, 'Sales']}
                    cursor={{ fill: 'rgba(155, 174, 132, 0.1)' }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="#9BAE84" 
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cost Breakdown Donut Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle>Cost Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly expense distribution</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #E0E0DD',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardHeader>
              <CardTitle>Last Transactions</CardTitle>
              <p className="text-sm text-muted-foreground">Recent property sales and rentals</p>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] px-6">
                <div className="space-y-2 py-2">
                  {transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                        <img 
                          src={transaction.image} 
                          alt={transaction.property}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm truncate">{transaction.property}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {transaction.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-secondary">{transaction.amount}</p>
                        <p className="text-xs text-muted-foreground mt-1">{transaction.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Maintenance Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
              <p className="text-sm text-muted-foreground">Active maintenance tasks and assignments</p>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] px-6">
                <div className="space-y-2 py-2">
                  {maintenanceRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-all duration-200 cursor-pointer group"
                    >
                      <Avatar className="w-12 h-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
                        <AvatarImage src={request.avatar} alt={request.assignedTo} />
                        <AvatarFallback className="bg-primary/10 text-primary">{request.assignedTo.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm truncate">{request.task}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {request.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Assigned to: {request.assignedTo}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          request.status === 'Completed' ? 'default' : 
                          request.status === 'In Progress' ? 'secondary' : 
                          'outline'
                        }
                        className="rounded-lg transition-transform duration-200 group-hover:scale-105"
                      >
                        {request.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
