import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Clock, Bot } from "lucide-react";
import { BotCard } from "@/components/bot-card";
import { EmptyState } from "@/components/empty-state";
import type { Bot as BotType } from "@shared/schema";

export default function BotHistory() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Kamu harus login dulu. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  const { data: bots, isLoading: botsLoading } = useQuery<BotType[]>({
    queryKey: ["/api/bots"],
    enabled: isAuthenticated,
  });

  if (authLoading || botsLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        <BackButton />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="glass mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Riwayat Bot</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Lihat semua bot yang pernah dibuat</p>
                  </div>
                </div>
                {bots && bots.length > 0 && (
                  <Badge variant="secondary">{bots.length} bot</Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {!bots || bots.length === 0 ? (
            <EmptyState
              title="Belum ada riwayat bot"
              description="Kamu belum pernah membuat bot sebelumnya."
              action={{
                label: "Buat Bot Pertama",
                icon: Bot,
              }}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bots.map((bot) => (
                <BotCard key={bot.id} bot={bot} />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
