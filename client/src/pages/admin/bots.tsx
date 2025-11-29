import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bot, Zap, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { Bot as BotType } from "@shared/schema";

export default function AdminBots() {
  const { user, isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !isAdmin) {
        setLocation("/login");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const { data: bots, isLoading: botsLoading } = useQuery<BotType[]>({
    queryKey: ["/api/bots"],
    enabled: isAuthenticated && isAdmin,
  });

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
          <h1 className="text-3xl font-bold mb-2">Semua Bot</h1>
          <p className="text-muted-foreground">Total Bot di platform: {bots?.length || 0}</p>
        </div>

        <div className="grid gap-4">
          {bots && bots.length > 0 ? (
            bots.map((bot) => (
              <Card key={bot.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      {bot.name}
                    </CardTitle>
                    <Badge variant={bot.status === "online" ? "default" : "outline"}>
                      {bot.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Bot Token</p>
                      <p className="font-mono truncate">{bot.botToken}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Version</p>
                      <p className="font-medium">{bot.version}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CPU Usage</p>
                      <p>{bot.cpuUsage}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">RAM Usage</p>
                      <p>{bot.ramUsage}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Belum ada bot di sistem</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
