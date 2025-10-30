import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  Users,
  DollarSign,
  Wrench,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Lightbulb,
  FileText,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AnimatedCounter } from './AnimatedCounter';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigation } from './NavigationContext';
import { useAuth } from './AuthContext';
import { useDashboardKPIs } from '../hooks/useDashboardData';
import { useProperties } from '../hooks/useProperties';
import { useMaintenanceRequests } from '../hooks/useMaintenanceRequests';
import { useFinancialReports } from '../hooks/useFinancialReports';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  rentalIncomeData,
  occupancyDistributionData,
  maintenanceByCategory,
  myProperties,
  maintenanceTickets,
  quickAccessModules,
  aiInsight,
  type OwnerKPI,
  type PropertyCard,
  type MaintenanceTicket,
} from '../data/ownerDashboardData';

const iconMap: Record<string, any> = {
  building: Building2,
  users: Users,
  dollar: DollarSign,
  wrench: Wrench,
  chart: BarChart3,
  'file-text': FileText,
};

export function OwnerDashboard() {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const { kpis, isLoading: kpisLoading, error: kpisError } = useDashboardKPIs();
  const { properties, isLoading: propertiesLoading, error: propertiesError } = useProperties();
  const { requests: maintenanceRequests, isLoading: maintenanceLoading } = useMaintenanceRequests();
  const { reports, isLoading: reportsLoading } = useFinancialReports();
  const [propertyFilter, setPropertyFilter] = useState('all');

  const isLoading = kpisLoading || propertiesLoading || maintenanceLoading || reportsLoading;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (kpisError || propertiesError) {
    return (
      <div className="space-y-4">
        <h1 className="text-foreground mb-2">Owner Dashboard</h1>
        <Alert className="rounded-[20px]">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data: {kpisError || propertiesError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Transform real data for Owner dashboard
  const ownerKPIs = [
    {
      id: 'my-properties',
      label: 'My Properties',
      value: properties.length,
      trend: 0,
      trendLabel: 'Total properties owned',
      icon: 'building',
    },
    {
      id: 'occupied-units',
      label: 'Occupied Units',
      value: properties.filter(p => p.status === 'Rented').length,
      trend: 0,
      trendLabel: `${Math.round((properties.filter(p => p.status === 'Rented').length / Math.max(properties.length, 1)) * 100)}% occupancy`,
      icon: 'users',
    },
    {
      id: 'monthly-income',
      label: 'Monthly Income',
      value: properties.filter(p => p.status === 'Rented').reduce((sum, p) => sum + (p.rent || 0), 0),
      unit: 'SAR',
      trend: 5.8,
      trendLabel: '+5.8% from last month',
      icon: 'dollar',
    },
    {
      id: 'pending-repairs',
      label: 'Pending Repairs',
      value: maintenanceRequests.filter(r => r.status !== 'Completed').length,
      trend: 0,
      trendLabel: 'Active maintenance requests',
      icon: 'wrench',
    },
  ];

  const propertyCards = properties.map(p => ({
    id: p.id,
    name: p.name,
    location: p.location,
    status: p.status,
    occupancy: p.occupancy,
    revenue: p.rent,
    image: p.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
  }));

  const maintenanceTickets = maintenanceRequests.map(r => ({
    id: r.id,
    property: r.property_name || 'Unknown Property',
    issue: r.category,
    priority: r.priority as 'low' | 'medium' | 'high',
    status: r.status,
    technician: r.technician || 'Unassigned',
    cost: r.cost,
  }));

  const revenueData = reports.slice(0, 6).reverse().map(report => ({
    month: report.month.substring(0, 3),
    income: report.revenue,
    expenses: report.expenses,
  }));

  const filteredTickets =
    propertyFilter === 'all'
      ? maintenanceTickets
      : maintenanceTickets.filter((t) => t.property === propertyFilter);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">Property Owner Dashboard</h1>
        <p className="text-muted-foreground">
          Track your properties, income, and maintenance
        </p>
      </motion.div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-[20px] border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">AI Insight</h4>
                <p className="text-sm text-muted-foreground">{aiInsight}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {ownerKPIs.map((kpi, index) => (
          <KPICard key={kpi.id} kpi={kpi} index={index} formatCurrency={formatCurrency} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rental Income Over Time */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-[20px] border-border shadow-sm">
            <CardHeader>
              <CardTitle>Rental Income Over Time</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                6-month income trend
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={rentalIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0DD" vertical={false} />
                  <XAxis dataKey="month" stroke="#7C7C7C" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#7C7C7C" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E0E0DD',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${formatCurrency(value)} SAR`, 'Income']}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#9BAE84"
                    strokeWidth={3}
                    dot={{ fill: '#9BAE84', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Property Occupancy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="rounded-[20px] border-border shadow-sm">
            <CardHeader>
              <CardTitle>Property Occupancy</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Current status
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={occupancyDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {occupancyDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E0E0DD',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Maintenance Requests by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-[20px] border-border shadow-sm">
          <CardHeader>
            <CardTitle>Maintenance Requests by Category</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Distribution across property types
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={maintenanceByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0DD" vertical={false} />
                <XAxis dataKey="category" stroke="#7C7C7C" tick={{ fontSize: 12 }} />
                <YAxis stroke="#7C7C7C" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E0E0DD',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#9BAE84" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* My Properties */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground">My Properties</h3>
          <Button
            variant="outline"
            onClick={() => navigate('properties')}
            className="rounded-xl"
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProperties.slice(0, 6).map((property, index) => (
            <PropertyCardComponent key={property.id} property={property} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Maintenance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-[20px] border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Maintenance Summary</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Latest service requests
                </p>
              </div>
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className="w-[180px] rounded-xl">
                  <SelectValue placeholder="Filter by property" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Properties</SelectItem>
                  {myProperties.map((property) => (
                    <SelectItem key={property.id} value={property.name}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTickets.map((ticket, index) => (
              <MaintenanceTicketItem key={ticket.id} ticket={ticket} index={index} />
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h3 className="text-foreground mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessModules.map((module, index) => (
            <QuickAccessCard key={module.id} module={module} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function KPICard({
  kpi,
  index,
  formatCurrency,
}: {
  kpi: OwnerKPI;
  index: number;
  formatCurrency: (value: number) => string;
}) {
  const Icon = iconMap[kpi.icon] || BarChart3;
  const isPositiveTrend = kpi.trend >= 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.03 }}
      whileHover={{ y: -2 }}
    >
      <Card className="rounded-[20px] border-border shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                isPositiveTrend
                  ? 'bg-primary/10 text-primary'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              <TrendIcon className="w-3 h-3" />
              {Math.abs(kpi.trend)}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{kpi.label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium text-foreground tracking-tight">
              <AnimatedCounter
                value={kpi.value}
                decimals={0}
                formatter={kpi.unit === 'SAR' ? formatCurrency : undefined}
              />
            </span>
            {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{kpi.trendLabel}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PropertyCardComponent({
  property,
  index,
}: {
  property: PropertyCard;
  index: number;
}) {
  const statusColors = {
    Rented: 'bg-primary/10 text-primary',
    Vacant: 'bg-accent/20 text-accent',
    'Under Maintenance': 'bg-muted text-muted-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="rounded-[20px] border-border shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <ImageWithFallback
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <Badge className={`absolute top-3 right-3 ${statusColors[property.status]}`}>
            {property.status}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h4 className="text-foreground font-medium mb-1">{property.name}</h4>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
            <MapPin className="w-3 h-3" />
            {property.location}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-sm font-medium text-foreground">
                {property.revenue.toLocaleString()} SAR
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Occupancy</p>
              <p className="text-sm font-medium text-foreground">{property.occupancy}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MaintenanceTicketItem({
  ticket,
  index,
}: {
  ticket: MaintenanceTicket;
  index: number;
}) {
  const statusColors = {
    New: 'bg-accent/20 text-accent',
    'In Progress': 'bg-primary/10 text-primary',
    Completed: 'bg-secondary/10 text-secondary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent/50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium text-foreground">{ticket.task}</h4>
          <span className="text-xs text-muted-foreground">–</span>
          <span className="text-xs text-muted-foreground">{ticket.property}</span>
        </div>
        <p className="text-xs text-muted-foreground">{ticket.date}</p>
      </div>
      <Badge className={`${statusColors[ticket.status]} rounded-lg`}>
        {ticket.status}
      </Badge>
    </motion.div>
  );
}

function QuickAccessCard({ module, index }: { module: any; index: number }) {
  const { navigate } = useNavigation();
  const Icon = iconMap[module.icon] || Building2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 + index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className="rounded-[20px] border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
        onClick={() => navigate(module.route)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h4 className="text-foreground font-medium mb-1">{module.title}</h4>
          <p className="text-sm text-muted-foreground">{module.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-24 rounded-[20px]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[180px] rounded-[20px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[400px] rounded-[20px] lg:col-span-2" />
        <Skeleton className="h-[400px] rounded-[20px]" />
      </div>
    </div>
  );
}
