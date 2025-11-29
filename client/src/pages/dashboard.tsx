import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Bot, 
  Plus, 
  Crown, 
  Activity,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { StatsCard } from "@/components/stats-card";
import { BotCard } from "@/components/bot-card";
import { EmptyState } from "@/components/empty-state";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, getStatusColor, getStatusBgColor } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { Bot as BotType } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated, isPremium } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [restartingBotId, setRestartingBotId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Kamu harus login dulu. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  const { data: bots, isLoading: botsLoading } = useQuery<BotType[]>({
    queryKey: ["/api/bots"],
    enabled: isAuthenticated,
  });

  const deleteBot = useMutation({
    mutationFn: async (botId: string) => {
      await apiRequest("DELETE", `/api/bots/${botId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      toast({
        title: "Bot Dihapus",
        description: "Bot berhasil dihapus dari sistem",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "Session expired. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Gagal menghapus bot",
        variant: "destructive",
      });
    },
  });

  const restartBot = useMutation({
    mutationFn: async (botId: string) => {
      setRestartingBotId(botId);
      await apiRequest("POST", `/api/bots/${botId}/restart`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      toast({
        title: "Bot Direstart",
        description: "Bot sedang direstart...",
      });
      setRestartingBotId(null);
    },
    onError: (error) => {
      setRestartingBotId(null);
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "Session expired. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Gagal merestart bot",
        variant: "destructive",
      });
    },
  });

  if (authLoading || botsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  if (!user) return null;

  const onlineBots = bots?.filter(b => b.status === "online").length || 0;
  const totalBots = bots?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Halo, <span className="text-primary">{user.firstName || "User"}</span>!
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="font-mono text-xs">
                  {user.visibleId}
                </Badge>
                <Badge className={`${getStatusBgColor(user.premiumStatus || "free")} ${getStatusColor(user.premiumStatus || "free")}`}>
                  {isPremium ? (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </>
                  ) : (
                    "Free"
                  )}
                </Badge>
                <Badge className={`${getStatusBgColor(user.accountStatus || "active")} ${getStatusColor(user.accountStatus || "active")}`}>
                  {user.accountStatus === "active" ? "Aktif" : user.accountStatus}
                </Badge>
              </div>
            </div>
            <Button 
              onClick={() => setLocation("/bots/new")} 
              className="neon-glow"
              data-testid="button-add-bot"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Bot
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            title="Total Bot"
            value={totalBots}
            icon={Bot}
            description={`Max: ${user.maxBots}`}
            variant="primary"
          />
          <StatsCard
            title="Bot Online"
            value={onlineBots}
            icon={Activity}
            description={totalBots > 0 ? `${Math.round((onlineBots / totalBots) * 100)}% aktif` : "Belum ada bot"}
            variant="secondary"
          />
          <StatsCard
            title="Status Akun"
            value={user.accountStatus === "active" ? "Aktif" : user.accountStatus || "N/A"}
            icon={user.accountStatus === "active" ? Activity : AlertCircle}
            variant={user.accountStatus === "active" ? "default" : "accent"}
          />
          <StatsCard
            title="Premium Status"
            value={isPremium ? "Premium" : "Free"}
            icon={Crown}
            description={isPremium && user.premiumExpiry ? `Exp: ${new Date(user.premiumExpiry).toLocaleDateString("id-ID")}` : undefined}
            variant={isPremium ? "accent" : "default"}
          />
        </motion.div>

        {/* Bots List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
              <CardTitle className="text-xl">Daftar Bot</CardTitle>
              {totalBots > 0 && (
                <Badge variant="secondary">{totalBots} bot</Badge>
              )}
            </CardHeader>
            <CardContent>
              {totalBots === 0 ? (
                <EmptyState
                  title="Belum ada bot"
                  description="Kamu belum punya bot. Yuk tambah bot pertamamu!"
                  action={{
                    label: "Tambah Bot",
                    onClick: () => setLocation("/bots/new"),
                    icon: Plus,
                  }}
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bots?.map((bot, index) => (
                    <motion.div
                      key={bot.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BotCard
                        bot={bot}
                        onDelete={(id) => deleteBot.mutate(id)}
                        onRestart={(id) => restartBot.mutate(id)}
                        onViewLogs={(id) => setLocation(`/bots/${id}/logs`)}
                        isLoading={deleteBot.isPending || restartingBotId === bot.id}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upgrade CTA for non-premium users */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="glass neon-border overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-chart-4/20 flex items-center justify-center">
                      <Crown className="w-7 h-7 text-chart-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Upgrade ke Premium</h3>
                      <p className="text-muted-foreground">
                        Dapatkan akses Bot V2 (Python), limit lebih besar, dan fitur eksklusif lainnya
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setLocation("/premium")}
                    className="bg-chart-4 hover:bg-chart-4/90 text-white flex-shrink-0"
                    data-testid="button-upgrade-premium"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Sekarang
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Floating Add Bot Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button
          size="lg"
          onClick={() => setLocation("/bots/new")}
          className="rounded-full w-14 h-14 neon-glow shadow-lg"
          data-testid="button-add-bot-fab"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
