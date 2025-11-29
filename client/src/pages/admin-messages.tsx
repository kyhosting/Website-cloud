import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function AdminMessages() {
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

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8 px-4 max-w-4xl mx-auto">
        <BackButton />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="glass mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Pesan Admin</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Pesan dari admin sistem</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <EmptyState
                title="Tidak ada pesan"
                description="Admin belum mengirim pesan apapun untuk kamu saat ini."
                action={{
                  label: "Kembali ke Dashboard",
                  href: "/dashboard",
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
