import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bot, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import type { Bot as BotType } from "@shared/schema";

export default function AdminBotsV1() {
  const { isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const { data: allBots, isLoading: botsLoading } = useQuery<BotType[]>({
    queryKey: ["/api/bots"],
    enabled: isAuthenticated && isAdmin,
  });

  const v1Bots = allBots?.filter((b) => b.version === "v1") || [];

  if (authLoading || botsLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-8 px-4">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8 px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Bot className="w-8 h-8" />
            Bot V1 (Node.js)
          </h1>
          <p className="text-muted-foreground">Total Bot V1: {v1Bots.length}</p>
        </div>

        <div className="grid gap-4">
          {v1Bots.length > 0 ? (
            v1Bots.map((bot) => (
              <Card key={bot.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      {bot.botUsername || `Bot ${bot.telegramId}`}
                    </CardTitle>
                    <Badge variant={bot.status === "online" ? "default" : "outline"}>
                      {bot.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Bot Token</p>
                      <p className="font-mono text-xs truncate">{bot.botToken.slice(0, 20)}...</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Owner ID</p>
                      <p>{bot.telegramId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CPU / RAM</p>
                      <p>{bot.cpuUsage}% / {bot.ramUsage}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Uptime</p>
                      <p>{Math.round(bot.uptime / 3600)}h {Math.round((bot.uptime % 3600) / 60)}m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Belum ada Bot V1</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
