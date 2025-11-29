import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bot, Zap, AlertCircle, RotateCw, Trash2, Play, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Bot as BotType } from "@shared/schema";

export default function AdminBotsV2() {
  const { isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const { data: allBots, isLoading: botsLoading } = useQuery<BotType[]>({
    queryKey: ["/api/bots"],
    enabled: isAuthenticated && isAdmin,
  });

  const v2Bots = allBots?.filter((b) => b.version === "v2") || [];

  const deleteMutation = useMutation({
    mutationFn: async (botId: string) => {
      return await apiRequest("DELETE", `/api/bots/${botId}`);
    },
    onSuccess: () => {
      toast({ title: "Berhasil", description: "Bot berhasil dihapus" });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      setSelectedBotId(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Gagal hapus bot", variant: "destructive" });
    },
  });

  const restartMutation = useMutation({
    mutationFn: async (botId: string) => {
      return await apiRequest("POST", `/api/bots/${botId}/restart`);
    },
    onSuccess: () => {
      toast({ title: "Berhasil", description: "Bot berhasil restart" });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Gagal restart bot", variant: "destructive" });
    },
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
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            Bot V2 (Python)
          </h1>
          <p className="text-muted-foreground">Total Bot V2: {v2Bots.length}</p>
        </div>

        <div className="grid gap-4">
          {v2Bots.length > 0 ? (
            v2Bots.map((bot) => (
              <Card key={bot.id} className={`hover-elevate ${bot.status === "error" ? "border-red-500/50" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        {bot.botUsername || `Bot ${bot.telegramId}`}
                      </CardTitle>
                      {bot.lastError && (
                        <p className="text-xs text-red-500 mt-1">Error: {bot.lastError}</p>
                      )}
                    </div>
                    <Badge variant={bot.status === "online" ? "default" : bot.status === "error" ? "destructive" : "outline"}>
                      {bot.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
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
                      <p className="text-muted-foreground">Ping</p>
                      <p>{bot.ping}ms</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restartMutation.mutate(bot.id)}
                      disabled={restartMutation.isPending}
                      className="flex items-center gap-1"
                    >
                      <RotateCw className="w-4 h-4" />
                      Restart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      disabled
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      disabled
                    >
                      <FileText className="w-4 h-4" />
                      Logs
                    </Button>
                    {bot.status === "error" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        disabled
                      >
                        <AlertCircle className="w-4 h-4" />
                        View Error
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm(`Hapus bot ${bot.botUsername || bot.telegramId}?`)) {
                          deleteMutation.mutate(bot.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Belum ada Bot V2</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
