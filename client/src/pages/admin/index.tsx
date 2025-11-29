import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Bot, 
  CreditCard, 
  Crown,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { StatsCard } from "@/components/stats-card";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

interface AdminStats {
  totalUsers: number;
  totalBots: number;
  onlineBots: number;
  premiumUsers: number;
  pendingPayments: number;
  totalRevenue: number;
  securityAlerts: number;
  activeV2Bots: number;
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast({
          title: "Unauthorized",
          description: "Kamu harus login dulu. Redirecting...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      } else if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "Kamu tidak punya akses ke halaman ini",
          variant: "destructive",
        });
        setLocation("/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, toast, setLocation]);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && isAdmin,
  });

  if (authLoading || statsLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  const quickActions = [
    { label: "Semua User", href: "/kifzldev/users", icon: Users, count: stats?.totalUsers || 0 },
    { label: "Bot V1", href: "/kifzldev/bots/v1", icon: Bot, count: stats?.totalBots || 0 },
    { label: "Bot V2", href: "/kifzldev/bots/v2", icon: Zap, count: stats?.activeV2Bots || 0 },
    { label: "Aktivasi V2", href: "/kifzldev/v2-activate", icon: Zap, highlight: true },
    { label: "Validasi QRIS", href: "/kifzldev/payments", icon: CreditCard, count: stats?.pendingPayments || 0, highlight: true },
    { label: "Premium Control", href: "/kifzldev/premium", icon: Crown, count: stats?.premiumUsers || 0 },
    { label: "Keamanan", href: "/kifzldev/security", icon: AlertTriangle, count: stats?.securityAlerts || 0, danger: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30">
              KIFZLDEV
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Selamat datang kembali, {user?.firstName || "Admin"}!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Total Bots"
            value={stats?.totalBots || 0}
            icon={Bot}
            description={`${stats?.onlineBots || 0} online`}
            variant="secondary"
          />
          <StatsCard
            title="Premium Users"
            value={stats?.premiumUsers || 0}
            icon={Crown}
            variant="accent"
          />
          <StatsCard
            title="Revenue"
            value={`Rp ${((stats?.totalRevenue || 0) / 1000).toFixed(0)}K`}
            icon={TrendingUp}
            variant="default"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Link href={action.href}>
                  <Card className={`glass hover-elevate cursor-pointer transition-all h-full ${
                    action.highlight ? "neon-border" : action.danger ? "border-destructive/50" : ""
                  }`}>
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                        action.danger 
                          ? "bg-destructive/20" 
                          : action.highlight 
                            ? "bg-primary/20 neon-glow" 
                            : "bg-muted"
                      }`}>
                        <action.icon className={`w-6 h-6 ${
                          action.danger 
                            ? "text-destructive" 
                            : action.highlight 
                              ? "text-primary" 
                              : "text-muted-foreground"
                        }`} />
                      </div>
                      <p className="font-medium text-sm">{action.label}</p>
                      {action.count > 0 && (
                        <Badge variant="secondary" className="mt-2">
                          {action.count}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
                <CardTitle className="text-lg">User Baru</CardTitle>
                <Link href="/kifzldev/users">
                  <Badge variant="outline" className="cursor-pointer">
                    Lihat Semua
                  </Badge>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">User #{i}</p>
                        <p className="text-sm text-muted-foreground font-mono">KIFZUSR-XXXXXX</p>
                      </div>
                      <Badge variant="secondary">Baru</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
                <CardTitle className="text-lg">Pembayaran Pending</CardTitle>
                <Link href="/kifzldev/payments">
                  <Badge variant="outline" className="cursor-pointer">
                    Lihat Semua
                  </Badge>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.pendingPayments === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Tidak ada pembayaran pending</p>
                    </div>
                  ) : (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-10 h-10 rounded-full bg-status-away/20 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-status-away" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">Paket 30 Hari</p>
                          <p className="text-sm text-muted-foreground">Rp 75.000</p>
                        </div>
                        <Badge className="bg-status-away/20 text-status-away">Pending</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
