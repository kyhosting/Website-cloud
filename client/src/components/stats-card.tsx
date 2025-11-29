import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "accent";
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
  className,
}: StatsCardProps) {
  const variantStyles = {
    default: "border-border/50",
    primary: "neon-border",
    secondary: "neon-border-cyan",
    accent: "border-accent/50",
  };

  const iconStyles = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/20 text-primary neon-glow",
    secondary: "bg-secondary/20 text-secondary neon-glow-cyan",
    accent: "bg-accent/20 text-accent",
  };

  return (
    <Card className={cn("glass", variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-3xl font-bold mt-2 tracking-tight">{value}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <p className={cn(
                "text-sm mt-2 font-medium",
                trend.isPositive ? "text-status-online" : "text-status-busy"
              )}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                <span className="text-muted-foreground ml-1">dari kemarin</span>
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", iconStyles[variant])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
