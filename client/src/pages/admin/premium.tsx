import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Crown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface PremiumPackage {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  maxBots: number;
  features: string[];
  isActive: boolean;
}

export default function AdminPremium() {
  const { isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const { data: packages, isLoading } = useQuery<PremiumPackage[]>({
    queryKey: ["/api/premium/packages"],
    enabled: isAuthenticated && isAdmin,
  });

  if (authLoading || isLoading || !isAdmin) {
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
            <Crown className="w-8 h-8 text-amber-500" />
            Premium Control
          </h1>
          <p className="text-muted-foreground">Kelola paket premium dan fitur</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {packages && packages.length > 0 ? (
            packages.map((pkg) => (
              <Card key={pkg.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <Badge variant={pkg.isActive ? "default" : "outline"}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-xl font-bold">Rp {pkg.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p>{pkg.durationDays} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Bots</p>
                    <p>{pkg.maxBots} bots</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Features</p>
                    <div className="flex flex-wrap gap-1">
                      {pkg.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-3">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Belum ada paket premium</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
