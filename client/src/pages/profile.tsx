import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Copy, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Kamu harus login dulu. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isLoading, isAuthenticated, toast]);

  if (isLoading || !user) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} berhasil disalin!`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8 px-4 max-w-2xl mx-auto">
        <BackButton />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-2xl">Profil User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nama */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-lg font-medium">{user.firstName || user.email}</p>
                </div>
              </div>

              {/* User ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 rounded-lg bg-muted/50 border border-border/50 font-mono text-sm">
                    {user.visibleId}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(user.visibleId, "User ID")}
                    data-testid="button-copy-userid"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-base">{user.email}</p>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status Akun</label>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <Badge className="bg-green-500/20 text-green-400">
                      {user.accountStatus === "active" ? "Aktif" : user.accountStatus}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Premium Status</label>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <Badge className={user.premiumStatus === "premium" ? "bg-purple-500/20 text-purple-400" : "bg-gray-500/20 text-gray-400"}>
                      {user.premiumStatus === "premium" ? "Premium" : "Free"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Premium Expiry */}
              {user.premiumStatus === "premium" && user.premiumExpiry && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Premium Berakhir
                  </label>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-base">{new Date(user.premiumExpiry).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
              )}

              {/* Total Bots */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Total Bot</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Digunakan</p>
                    <p className="text-2xl font-bold text-primary">{user.totalBots}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Max</p>
                    <p className="text-2xl font-bold text-secondary">{user.maxBots}</p>
                  </div>
                </div>
              </div>

              {/* Created At */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Bergabung Sejak</label>
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-base">{new Date(user.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
