import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  TrendingUp,
  MessageSquare,
  DollarSign,
  UserPlus,
  Activity,
  Target,
  Award,
  Mail,
  CheckCircle2,
  BarChart3,
  Calendar,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface GrowthMetrics {
  betaUsers: {
    total: number;
    thisWeek: number;
    target: number;
    trend: number;
  };
  activation: {
    rate: number;
    activated: number;
    pending: number;
    target: number;
  };
  feedback: {
    total: number;
    responseRate: number;
    npsScore: number;
    target: number;
  };
  revenue: {
    paying: number;
    mrr: number;
    arpu: number;
    target: number;
  };
  engagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    retention: number;
  };
}

export const GrowthMetricsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>(
    'week'
  );

  useEffect(() => {
    fetchGrowthMetrics();
  }, [selectedPeriod]);

  const fetchGrowthMetrics = async () => {
    try {
      setLoading(true);

      // Get user session for auth
      const sessionData = localStorage.getItem('supabase.auth.token');
      const session = sessionData ? JSON.parse(sessionData) : null;
      const accessToken = session?.currentSession?.access_token || publicAnonKey;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96250128/growth-metrics?period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch metrics');

      const data = await response.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Error fetching growth metrics:', error);
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    toast.success('جاري تصدير البيانات...');
    // Implementation for data export
  };

  // Mock data for charts
  const weeklySignupData = [
    { week: 'الأسبوع 1', signups: 12, activated: 8 },
    { week: 'الأسبوع 2', signups: 18, activated: 13 },
    { week: 'الأسبوع 3', signups: 25, activated: 19 },
    { week: 'الأسبوع 4', signups: 32, activated: 24 },
  ];

  const feedbackDistribution = [
    { name: 'ميزة جديدة', value: 45, color: '#9BAE84' },
    { name: 'تحسين', value: 30, color: '#7FA972' },
    { name: 'مشكلة', value: 15, color: '#E74C3C' },
    { name: 'أخرى', value: 10, color: '#95A5A6' },
  ];

  const npsData = [
    { category: 'مروّجون', count: 35, color: '#27AE60' },
    { category: 'محايدون', count: 12, color: '#F39C12' },
    { category: 'منتقدون', count: 3, color: '#E74C3C' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded-[12px] animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="mb-2">مقاييس النمو - Beta Launch</h2>
          <p className="text-sm text-muted-foreground">
            تتبع أداء الإطلاق التجريبي والنمو الأسبوعي
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchGrowthMetrics}
            className="rounded-[12px]"
          >
            <Activity className="w-4 h-4 mr-2" />
            تحديث
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            className="rounded-[12px]"
          >
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-3">
        {[
          { value: 'week', label: 'أسبوعي' },
          { value: 'month', label: 'شهري' },
          { value: 'quarter', label: 'ربع سنوي' },
        ].map(({ value, label }) => (
          <Button
            key={value}
            variant={selectedPeriod === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod(value as any)}
            className="rounded-[12px]"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Beta Users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <Badge className="rounded-full bg-blue-100 text-blue-700 border-blue-200">
                  +18 هذا الأسبوع
                </Badge>
              </div>
              <h3 className="text-3xl mb-2">47</h3>
              <p className="text-sm text-muted-foreground mb-3">مستخدمي Beta</p>
              <Progress value={(47 / 50) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                الهدف: 50 مستخدم
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activation Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <Badge className="rounded-full bg-green-100 text-green-700 border-green-200">
                  ممتاز
                </Badge>
              </div>
              <h3 className="text-3xl mb-2">68%</h3>
              <p className="text-sm text-muted-foreground mb-3">معدل التفعيل</p>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                الهدف: 60%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feedback Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                <Badge className="rounded-full bg-purple-100 text-purple-700 border-purple-200">
                  +12 جديد
                </Badge>
              </div>
              <h3 className="text-3xl mb-2">45%</h3>
              <p className="text-sm text-muted-foreground mb-3">
                معدل الملاحظات
              </p>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                الهدف: 40%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Paying Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-[20px] shadow-lg border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-[#9BAE84]" />
                <Badge className="rounded-full bg-[#9BAE84]/10 text-[#9BAE84] border-[#9BAE84]/20">
                  قريباً
                </Badge>
              </div>
              <h3 className="text-3xl mb-2">0</h3>
              <p className="text-sm text-muted-foreground mb-3">
                عملاء مدفوعين
              </p>
              <Progress value={0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                الهدف: خلال 60 يوم
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Signups */}
        <Card className="rounded-[20px] shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-lg">التسجيلات الأسبوعية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklySignupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="signups" fill="#9BAE84" name="تسجيلات" />
                <Bar dataKey="activated" fill="#7FA972" name="مفعّل" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feedback Distribution */}
        <Card className="rounded-[20px] shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-lg">توزيع الملاحظات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feedbackDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {feedbackDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* NPS Score */}
      <Card className="rounded-[20px] shadow-lg border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Net Promoter Score (NPS)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                مقياس رضا العملاء واحتمالية التوصية
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl text-[#9BAE84] mb-2">+64</div>
              <Badge className="rounded-full bg-green-100 text-green-700 border-green-200">
                ممتاز
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {npsData.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-[16px] border-2"
                style={{ borderColor: item.color + '40' }}
              >
                <div className="text-center">
                  <div
                    className="text-4xl mb-2"
                    style={{ color: item.color }}
                  >
                    {item.count}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.category}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {((item.count / 50) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-[12px]">
            <p className="text-sm text-muted-foreground text-center">
              <strong>NPS = 64</strong> يعني أن 64% من المستخدمين هم مروجون نشطون
              للمنصة (ممتاز جداً!)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Activation Funnel */}
      <Card className="rounded-[20px] shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-lg">قمع التفعيل (Activation Funnel)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'طلب الوصول', count: 87, percent: 100 },
              { label: 'تم قبولهم', count: 50, percent: 57.5 },
              { label: 'أكمل التسجيل', count: 47, percent: 54 },
              { label: 'أضاف عقار', count: 38, percent: 43.7 },
              { label: 'مستخدم نشط', count: 32, percent: 36.8 },
            ].map((step, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{step.label}</span>
                  <Badge variant="outline" className="rounded-full">
                    {step.count} ({step.percent.toFixed(1)}%)
                  </Badge>
                </div>
                <Progress value={step.percent} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card className="rounded-[20px] shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-[#9BAE84]" />
            الأهداف الأسبوعية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                goal: 'مستخدمين جدد',
                current: 18,
                target: 15,
                icon: UserPlus,
                status: 'achieved',
              },
              {
                goal: 'معدل تفعيل',
                current: 68,
                target: 60,
                icon: CheckCircle2,
                status: 'achieved',
              },
              {
                goal: 'ملاحظات',
                current: 21,
                target: 20,
                icon: MessageSquare,
                status: 'achieved',
              },
              {
                goal: 'اجتماعات مبيعات',
                current: 3,
                target: 5,
                icon: Users,
                status: 'pending',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-4 rounded-[16px] border-2 ${
                  item.status === 'achieved'
                    ? 'border-green-200 bg-green-50'
                    : 'border-amber-200 bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <item.icon
                    className={`w-6 h-6 ${
                      item.status === 'achieved' ? 'text-green-600' : 'text-amber-600'
                    }`}
                  />
                  {item.status === 'achieved' && (
                    <Award className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className="text-2xl mb-1">
                  {item.current}/{item.target}
                </div>
                <div className="text-sm text-muted-foreground">{item.goal}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
