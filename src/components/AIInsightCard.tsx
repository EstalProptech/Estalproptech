import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

interface AIInsightCardProps {
  type: 'prediction' | 'warning' | 'suggestion' | 'trend';
  title: string;
  description: string;
  metric?: string;
  confidence?: number;
}

export function AIInsightCard({ type, title, description, metric, confidence }: AIInsightCardProps) {
  const typeConfig = {
    prediction: {
      icon: TrendingUp,
      color: 'bg-primary',
      gradient: 'from-primary/20 to-primary/5'
    },
    warning: {
      icon: AlertTriangle,
      color: 'bg-[#F59E0B]',
      gradient: 'from-[#F59E0B]/20 to-[#F59E0B]/5'
    },
    suggestion: {
      icon: Lightbulb,
      color: 'bg-secondary',
      gradient: 'from-secondary/20 to-secondary/5'
    },
    trend: {
      icon: TrendingUp,
      color: 'bg-[#8B5CF6]',
      gradient: 'from-[#8B5CF6]/20 to-[#8B5CF6]/5'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`rounded-2xl shadow-sm border-border overflow-hidden bg-gradient-to-br ${config.gradient}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm">{title}</h4>
                <Badge variant="outline" className="rounded-lg flex items-center gap-1 text-xs">
                  <Sparkles className="w-3 h-3" />
                  AI
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{description}</p>
              {metric && (
                <p className="text-lg text-primary">{metric}</p>
              )}
              {confidence && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Confidence</span>
                    <span>{confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
