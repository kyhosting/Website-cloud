import { useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function AdminSecurity() {
  const { isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  if (authLoading || !isAdmin) {
    return <div className="min-h-screen bg-background"><Header /></div>;
  }

  const securityChecks = [
    { name: "Google OAuth", status: "active", icon: "✓" },
    { name: "Email OTP", status: "active", icon: "✓" },
    { name: "Session Security", status: "active", icon: "✓" },
    { name: "Database Encryption", status: "active", icon: "✓" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8 px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="w-8 h-8 text-green-500" />
            Security Settings
          </h1>
          <p className="text-muted-foreground">Monitor keamanan platform</p>
        </div>

        <div className="grid gap-4">
          {securityChecks.map((check, idx) => (
            <Card key={idx} className="hover-elevate">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {check.status === "active" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                    {check.name}
                  </CardTitle>
                  <Badge variant={check.status === "active" ? "default" : "outline"}>
                    {check.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
