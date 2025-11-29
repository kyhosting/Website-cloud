import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Zap, Users, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminV2Activate() {
  const { isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"user" | "self">("user");

  // OPSI 1: Activate for user
  const [userForm, setUserForm] = useState({ userId: "", botToken: "", telegramId: "" });
  
  // OPSI 2: Activate for self
  const [selfForm, setSelfForm] = useState({ botToken: "", telegramId: "" });

  if (!authLoading && (!isAuthenticated || !isAdmin)) {
    setLocation("/login");
    return null;
  }

  // Get all users for dropdown
  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && isAdmin,
  });

  // Get admin's own V2 bots
  const { data: adminBots, refetch: refetchAdminBots } = useQuery({
    queryKey: ["/api/admin/v2/self"],
    enabled: isAuthenticated && isAdmin && activeTab === "self",
  });

  // Activate V2 for user
  const activateUserV2 = useMutation({
    mutationFn: async () => {
      // Validate form
      if (!userForm.userId.trim()) {
        throw new Error("Pilih user terlebih dahulu");
      }
      if (!userForm.botToken.trim()) {
        throw new Error("Bot Token diperlukan");
      }
      if (!userForm.telegramId.trim()) {
        throw new Error("Telegram ID diperlukan");
      }
      if (isNaN(Number(userForm.telegramId))) {
        throw new Error("Telegram ID harus berupa angka");
      }
      
      return await apiRequest("POST", "/api/admin/v2/user", {
        userId: userForm.userId,
        botToken: userForm.botToken.trim(),
        telegramId: userForm.telegramId.trim(),
      });
    },
    onSuccess: () => {
      toast({ title: "✅ Bot V2 User", description: "Bot V2 berhasil diaktifkan untuk user" });
      setUserForm({ userId: "", botToken: "", telegramId: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      const errorMsg = error instanceof Error 
        ? error.message 
        : error.response?.data?.message || "Gagal aktivasi";
      toast({ 
        title: "❌ Error", 
        description: errorMsg, 
        variant: "destructive" 
      });
    },
  });

  // Activate V2 for self
  const activateSelfV2 = useMutation({
    mutationFn: async () => {
      // Validate form
      if (!selfForm.botToken.trim()) {
        throw new Error("Bot Token diperlukan");
      }
      if (!selfForm.telegramId.trim()) {
        throw new Error("Telegram ID diperlukan");
      }
      if (isNaN(Number(selfForm.telegramId))) {
        throw new Error("Telegram ID harus berupa angka");
      }
      
      return await apiRequest("POST", "/api/admin/v2/self", {
        botToken: selfForm.botToken.trim(),
        telegramId: selfForm.telegramId.trim(),
      });
    },
    onSuccess: () => {
      toast({ title: "✅ Bot V2 Admin", description: "Bot V2 berhasil diaktifkan!" });
      setSelfForm({ botToken: "", telegramId: "" });
      refetchAdminBots();
    },
    onError: (error: any) => {
      const errorMsg = error instanceof Error 
        ? error.message 
        : error.response?.data?.message || "Gagal aktivasi";
      toast({ 
        title: "❌ Error", 
        description: errorMsg, 
        variant: "destructive" 
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8 px-4 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            Aktivasi Bot V2
          </h1>
          <p className="text-muted-foreground">Aktifkan Bot V2 untuk user atau admin</p>
        </div>

        {/* Tab */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "user" ? "default" : "outline"}
            onClick={() => setActiveTab("user")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Opsi 1: User
          </Button>
          <Button
            variant={activeTab === "self" ? "default" : "outline"}
            onClick={() => setActiveTab("self")}
            className="flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Opsi 2: Admin
          </Button>
        </div>

        {/* OPSI 1: Activate for User */}
        {activeTab === "user" && (
          <Card>
            <CardHeader>
              <CardTitle>Aktivasi Bot V2 untuk User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pilih User</label>
                <select
                  value={userForm.userId}
                  onChange={(e) => setUserForm({ ...userForm, userId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">-- Pilih User --</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email} ({user.visibleId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bot Token</label>
                <input
                  type="password"
                  value={userForm.botToken}
                  onChange={(e) => setUserForm({ ...userForm, botToken: e.target.value })}
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telegram ID (Bot Owner)</label>
                <input
                  type="text"
                  value={userForm.telegramId}
                  onChange={(e) => setUserForm({ ...userForm, telegramId: e.target.value })}
                  placeholder="123456789"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>
              <Button
                onClick={() => activateUserV2.mutate()}
                disabled={activateUserV2.isPending}
                className="w-full"
              >
                {activateUserV2.isPending ? "⏳ Activating..." : "✅ Aktivasi untuk User"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* OPSI 2: Activate for Admin (Multi-bot) */}
        {activeTab === "self" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktivasi Bot V2 Admin (Multi-Bot)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bot Token</label>
                  <input
                    type="password"
                    value={selfForm.botToken}
                    onChange={(e) => setSelfForm({ ...selfForm, botToken: e.target.value })}
                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telegram ID (Bot Owner)</label>
                  <input
                    type="text"
                    value={selfForm.telegramId}
                    onChange={(e) => setSelfForm({ ...selfForm, telegramId: e.target.value })}
                    placeholder="123456789"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
                <Button
                  onClick={() => activateSelfV2.mutate()}
                  disabled={activateSelfV2.isPending}
                  className="w-full"
                >
                  {activateSelfV2.isPending ? "⏳ Activating..." : "✅ Aktivasi untuk Admin"}
                </Button>
              </CardContent>
            </Card>

            {/* Admin's V2 Bots List */}
            {adminBots && adminBots.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Bot V2 Admin ({adminBots.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {adminBots.map((bot: any) => (
                      <div key={bot.id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <p className="font-mono text-sm truncate">{bot.botToken}</p>
                          <p className="text-xs text-muted-foreground">Telegram: {bot.telegramId}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-700 rounded">
                          {bot.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
