import { motion } from 'motion/react';
import { 
  UserPlus, 
  UserX, 
  UserCheck, 
  Shield, 
  Key, 
  Mail,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { systemActivities, SystemActivity } from '../data/userAnalyticsData';

const activityIcons: Record<SystemActivity['type'], any> = {
  'user_created': UserPlus,
  'user_updated': UserCheck,
  'user_suspended': UserX,
  'user_activated': UserCheck,
  'role_changed': Shield,
  'password_reset': Key,
  'invitation_sent': Mail,
};

const activityColors: Record<SystemActivity['type'], { bg: string; text: string }> = {
  'user_created': { bg: 'bg-secondary/10', text: 'text-secondary' },
  'user_updated': { bg: 'bg-primary/10', text: 'text-primary' },
  'user_suspended': { bg: 'bg-destructive/10', text: 'text-destructive' },
  'user_activated': { bg: 'bg-secondary/10', text: 'text-secondary' },
  'role_changed': { bg: 'bg-accent/10', text: 'text-accent' },
  'password_reset': { bg: 'bg-primary/10', text: 'text-primary' },
  'invitation_sent': { bg: 'bg-primary/10', text: 'text-primary' },
};

export function ActivityFeed() {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <Card className="rounded-[24px] border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              System-wide user management actions
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary rounded-xl border-0">
            Live
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {systemActivities.map((activity, index) => {
              const Icon = activityIcons[activity.type];
              const colors = activityColors[activity.type];

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-[16px] transition-all hover:bg-muted/30 ${
                    activity.critical 
                      ? 'border-2 border-destructive/20 bg-destructive/5' 
                      : 'border border-border'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium">
                          <span className="text-primary">{activity.actor}</span>
                          {' → '}
                          <span>{activity.target}</span>
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(activity.timestamp)}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {activity.details}
                      </p>

                      {activity.critical && (
                        <div className="flex items-center gap-1 mt-2">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                          <span className="text-xs text-destructive font-medium">
                            Critical Action
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
