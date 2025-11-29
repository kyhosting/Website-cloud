import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bot, Trash2, RefreshCw, FileText, Cpu, MemoryStick, Activity, Clock } from "lucide-react";
import type { Bot as BotType } from "@shared/schema";
import { getStatusColor, getStatusBgColor } from "@/lib/authUtils";

interface BotCardProps {
  bot: BotType;
  onDelete?: (id: string) => void;
  onRestart?: (id: string) => void;
  onViewLogs?: (id: string) => void;
  isLoading?: boolean;
}

export function BotCard({ bot, onDelete, onRestart, onViewLogs, isLoading }: BotCardProps) {
  const statusLabels = {
    online: "Online",
    offline: "Offline",
    error: "Error",
    idle: "Idle",
  };

  const formatUptime = (seconds: number | null): string => {
    if (!seconds) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}j ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card className={cn(
      "glass overflow-visible transition-all duration-300",
      bot.status === "online" && "neon-border",
      bot.status === "error" && "border-destructive/50"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              bot.status === "online" ? "bg-primary/20 neon-glow" : "bg-muted"
            )}>
              <Bot className={cn(
                "w-5 h-5",
                bot.status === "online" ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{bot.botName}</h3>
              {bot.botUsername && (
                <p className="text-sm text-muted-foreground truncate">@{bot.botUsername}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge 
              variant="secondary"
              className={cn("text-xs", bot.version === "v2" && "bg-primary/20 text-primary")}
            >
              {bot.version.toUpperCase()}
            </Badge>
            <Badge className={cn(
              getStatusBgColor(bot.status),
              getStatusColor(bot.status),
              bot.status === "online" && "pulse-online"
            )}>
              {statusLabels[bot.status]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Cpu className="w-4 h-4" />
              <span>CPU</span>
            </div>
            <Progress value={bot.cpuUsage || 0} className="h-2" />
            <p className="text-xs text-muted-foreground">{bot.cpuUsage || 0}%</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MemoryStick className="w-4 h-4" />
              <span>RAM</span>
            </div>
            <Progress value={bot.ramUsage || 0} className="h-2" />
            <p className="text-xs text-muted-foreground">{bot.ramUsage || 0}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>Ping: {bot.ping || 0}ms</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Uptime: {formatUptime(bot.uptime)}</span>
          </div>
        </div>

        {bot.lastError && (
          <div className="p-2 rounded-md bg-destructive/10 border border-destructive/30">
            <p className="text-xs text-destructive truncate">{bot.lastError}</p>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewLogs?.(bot.id)}
            disabled={isLoading}
            data-testid={`button-view-logs-${bot.id}`}
          >
            <FileText className="w-4 h-4 mr-1" />
            Logs
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRestart?.(bot.id)}
            disabled={isLoading || bot.status === "offline"}
            data-testid={`button-restart-bot-${bot.id}`}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Restart
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete?.(bot.id)}
            disabled={isLoading}
            data-testid={`button-delete-bot-${bot.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
