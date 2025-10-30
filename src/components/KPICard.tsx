import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  iconBgColor: string;
}

export function KPICard({ title, value, change, isPositive, icon: Icon, iconBgColor }: KPICardProps) {
  return (
    <Card className="rounded-2xl shadow-sm border-border hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground mb-2">{title}</p>
            <h3 className="text-3xl mb-2">{value}</h3>
            <div className="flex items-center gap-1">
              <span className={`text-sm ${isPositive ? 'text-secondary' : 'text-destructive'}`}>
                {change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
