import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Users, 
  Search, 
  Crown, 
  Ban,
  CheckCircle,
  MoreVertical,
  Mail,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { TableSkeleton } from "@/components/loading-skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, getStatusColor, getStatusBgColor, formatDate } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";

export default function AdminUsers() {
  const { isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        window.location.href = "/login";
      } else if (!isAdmin) {
        setLocation("/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && isAdmin,
  });

  const updateUser = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
      await apiRequest("PATCH", `/api/admin/users/${userId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User Diperbarui",
        description: "Status user berhasil diperbarui",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        window.location.href = "/login";
        return;
      }
      toast({
        title: "Error",
        description: "Gagal memperbarui user",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users?.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.visibleId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
          <TableSkeleton rows={10} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <BackButton fallbackHref="/kifzldev" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                Kelola User
              </h1>
              <p className="text-muted-foreground mt-1">
                {users?.length || 0} user terdaftar
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-users"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass">
            <CardContent className="p-0">
              {usersLoading ? (
                <div className="p-6">
                  <TableSkeleton rows={5} />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Premium</TableHead>
                        <TableHead>Bots</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers?.map((user) => (
                        <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {user.profileImageUrl ? (
                                <img 
                                  src={user.profileImageUrl} 
                                  alt=""
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                  <Users className="w-5 h-5 text-primary" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{user.firstName || "User"} {user.lastName || ""}</p>
                                <p className="text-sm text-muted-foreground">{user.email || "-"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {user.visibleId}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBgColor(user.accountStatus || "active")} ${getStatusColor(user.accountStatus || "active")}`}>
                              {user.accountStatus === "active" ? "Aktif" : user.accountStatus === "banned" ? "Banned" : "Suspended"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBgColor(user.premiumStatus || "free")} ${getStatusColor(user.premiumStatus || "free")}`}>
                              {user.premiumStatus === "premium" && <Crown className="w-3 h-3 mr-1" />}
                              {user.premiumStatus === "premium" ? "Premium" : user.premiumStatus === "expired" ? "Expired" : "Free"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Bot className="w-4 h-4 text-muted-foreground" />
                              <span>{user.totalBots || 0}/{user.maxBots || 3}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" data-testid={`button-user-actions-${user.id}`}>
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="glass">
                                <DropdownMenuItem
                                  onClick={() => setLocation(`/kifzldev/users/${user.id}`)}
                                >
                                  <Users className="w-4 h-4 mr-2" />
                                  Detail User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateUser.mutate({ userId: user.id, updates: { premiumStatus: "premium" } })}
                                >
                                  <Crown className="w-4 h-4 mr-2" />
                                  Upgrade Premium
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Kirim Pesan
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.accountStatus === "banned" ? (
                                  <DropdownMenuItem
                                    onClick={() => updateUser.mutate({ userId: user.id, updates: { accountStatus: "active" } })}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Unban User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => updateUser.mutate({ userId: user.id, updates: { accountStatus: "banned" } })}
                                  >
                                    <Ban className="w-4 h-4 mr-2" />
                                    Ban User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
