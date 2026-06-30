import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  colorClass?: string;
}

export const StatCard = ({ title, value, icon: Icon, description, trend, colorClass = "bg-blue-500" }: StatCardProps) => {
  return (
    <Card className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            {description && (
              <p className={cn(
                "text-xs mt-2 font-medium",
                trend === "up" ? "text-emerald-600 dark:text-emerald-400" : trend === "down" ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
              )}>
                {description}
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-2xl text-white shadow-sm", colorClass)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
