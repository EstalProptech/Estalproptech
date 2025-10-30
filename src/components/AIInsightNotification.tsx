import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface AIInsightNotificationProps {
  message: string;
  onDismiss?: () => void;
}

export function AIInsightNotification({ message, onDismiss }: AIInsightNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-20 right-4 md:right-8 z-50 max-w-sm"
        >
          <Card className="rounded-[20px] shadow-xl border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm">AI Insight</h4>
                  <TrendingUp className="w-3 h-3 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {message}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="rounded-xl w-6 h-6 flex-shrink-0 -mt-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
