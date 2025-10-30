import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, TrendingDown, Clock, Award, AlertTriangle, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { maintenanceRequests, technicians } from "../data/maintenanceData";

interface MaintenanceAIInsightsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MaintenanceAIInsights({ isOpen, onClose }: MaintenanceAIInsightsProps) {
  // Calculate insights from data
  const totalRequests = maintenanceRequests.length;
  const completedRequests = maintenanceRequests.filter(r => r.status === 'Completed').length;
  const inProgressRequests = maintenanceRequests.filter(r => r.status === 'In Progress').length;
  const urgentRequests = maintenanceRequests.filter(r => r.priority === 'Urgent').length;
  
  // Category breakdown
  const categoryStats = maintenanceRequests.reduce((acc, req) => {
    acc[req.category] = (acc[req.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];
  const categoryPercentage = Math.round((topCategory[1] / totalRequests) * 100);
  
  // Average resolution time (mock calculation)
  const avgResolutionTime = 2.4;
  
  // Top technician
  const topTech = technicians.sort((a, b) => b.tasksCompleted - a.tasksCompleted)[0];
  
  // Trend analysis
  const urgentTrend = -12; // Mock: decreased by 12%

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl">AI Insights</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Smart maintenance analytics
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary Stats */}
              <Card className="rounded-[20px] border-border bg-gradient-to-br from-primary/10 to-secondary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                      <p className="text-2xl">{totalRequests}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl text-secondary">{completedRequests}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-2xl text-accent">{inProgressRequests}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Urgent</p>
                      <p className="text-2xl text-destructive">{urgentRequests}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <div className="space-y-3">
                <h3>Key Insights</h3>

                {/* Category Insight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="rounded-[16px] border-border hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{topCategory[0]}</span> issues make up{' '}
                            <span className="font-medium text-primary">{categoryPercentage}%</span>{' '}
                            of all requests.
                          </p>
                          <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20">
                            Most Common
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Resolution Time Insight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="rounded-[16px] border-border hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            Average resolution time:{' '}
                            <span className="font-medium text-accent">{avgResolutionTime} days</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            15% faster than industry average
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Top Technician Insight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="rounded-[16px] border-border hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{topTech.name}</span> resolved{' '}
                            <span className="font-medium text-secondary">{topTech.tasksCompleted}</span>{' '}
                            tasks this month.
                          </p>
                          <Badge className="mt-2 bg-secondary/10 text-secondary hover:bg-secondary/20">
                            Top Performer
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Trend Insight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="rounded-[16px] border-border hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <TrendingDown className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            Urgent requests decreased by{' '}
                            <span className="font-medium text-green-600">{Math.abs(urgentTrend)}%</span>{' '}
                            since last month.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Preventive maintenance is working
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <Separator />

              {/* Category Breakdown */}
              <div className="space-y-3">
                <h3>Category Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(categoryStats)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count], index) => {
                      const percentage = Math.round((count / totalRequests) * 100);
                      return (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="space-y-1"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span>{category}</span>
                            <span className="text-muted-foreground">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-3">
                <h3>Quick Actions</h3>
                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    className="rounded-[16px] justify-start gap-3 h-auto py-3"
                  >
                    <FileText className="w-4 h-4" />
                    <div className="text-left">
                      <p className="text-sm">Generate Smart Report</p>
                      <p className="text-xs text-muted-foreground">
                        Export detailed analytics as PDF
                      </p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-[16px] justify-start gap-3 h-auto py-3"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <div className="text-left">
                      <p className="text-sm">View Performance Trends</p>
                      <p className="text-xs text-muted-foreground">
                        Analyze historical data
                      </p>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
