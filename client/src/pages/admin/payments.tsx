import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  CreditCard, 
  Search, 
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { isUnauthorizedError, getStatusColor, getStatusBgColor, formatCurrency, formatDateTime } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { Payment } from "@shared/schema";

interface PaymentWithUser extends Payment {
  user?: {
    visibleId: string;
    email: string;
    firstName: string;
  };
  package?: {
    name: string;
    durationDays: number;
  };
}

export default function AdminPayments() {
  const { isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithUser | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [adminNote, setAdminNote] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        window.location.href = "/api/login";
      } else if (!isAdmin) {
        setLocation("/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const { data: payments, isLoading: paymentsLoading } = useQuery<PaymentWithUser[]>({
    queryKey: ["/api/admin/payments"],
    enabled: isAuthenticated && isAdmin,
  });

  const processPayment = useMutation({
    mutationFn: async ({ paymentId, status, note }: { paymentId: string; status: "approved" | "rejected"; note: string }) => {
      await apiRequest("POST", `/api/admin/payments/${paymentId}/process`, { status, note });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
      toast({
        title: variables.status === "approved" ? "Pembayaran Disetujui" : "Pembayaran Ditolak",
        description: variables.status === "approved" 
          ? "Premium user telah diaktifkan" 
          : "Notifikasi telah dikirim ke user",
      });
      setShowActionDialog(false);
      setSelectedPayment(null);
      setAdminNote("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Error",
        description: "Gagal memproses pembayaran",
        variant: "destructive",
      });
    },
  });

  const handleAction = (payment: PaymentWithUser, type: "approve" | "reject") => {
    setSelectedPayment(payment);
    setActionType(type);
    setShowActionDialog(true);
  };

  const confirmAction = () => {
    if (!selectedPayment) return;
    processPayment.mutate({
      paymentId: selectedPayment.id,
      status: actionType === "approve" ? "approved" : "rejected",
      note: adminNote,
    });
  };

  const pendingPayments = payments?.filter(p => p.status === "pending") || [];
  const processedPayments = payments?.filter(p => p.status !== "pending") || [];

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
                <CreditCard className="w-8 h-8 text-primary" />
                Validasi QRIS
              </h1>
              <p className="text-muted-foreground mt-1">
                {pendingPayments.length} pembayaran menunggu validasi
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-status-away" />
              Menunggu Validasi
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingPayments.map((payment) => (
                <Card key={payment.id} className="glass neon-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-medium">{payment.user?.firstName || "User"}</p>
                        <p className="text-sm text-muted-foreground font-mono">{payment.user?.visibleId}</p>
                      </div>
                      <Badge className="bg-status-away/20 text-status-away">Pending</Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Paket</span>
                        <span>{payment.package?.durationDays || 0} Hari</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nominal</span>
                        <span className="font-medium">{formatCurrency(payment.amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Waktu</span>
                        <span>{formatDateTime(payment.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowImageDialog(true);
                        }}
                        data-testid={`button-view-proof-${payment.id}`}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Bukti
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAction(payment, "approve")}
                        className="flex-1"
                        data-testid={`button-approve-${payment.id}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(payment, "reject")}
                        data-testid={`button-reject-${payment.id}`}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Processed Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Riwayat Pembayaran</h2>
          <Card className="glass">
            <CardContent className="p-0">
              {paymentsLoading ? (
                <div className="p-6">
                  <TableSkeleton rows={5} />
                </div>
              ) : processedPayments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Belum ada riwayat pembayaran</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Paket</TableHead>
                        <TableHead>Nominal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Waktu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{payment.user?.firstName || "User"}</p>
                              <p className="text-sm text-muted-foreground font-mono">{payment.user?.visibleId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{payment.package?.durationDays || 0} Hari</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBgColor(payment.status)} ${getStatusColor(payment.status)}`}>
                              {payment.status === "approved" ? "Disetujui" : "Ditolak"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDateTime(payment.processedAt || payment.createdAt)}
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

      {/* View Proof Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="glass max-w-lg">
          <DialogHeader>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
            <DialogDescription>
              {selectedPayment?.user?.visibleId} - {formatCurrency(selectedPayment?.amount || 0)}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            {selectedPayment?.proofImageUrl ? (
              <img 
                src={selectedPayment.proofImageUrl} 
                alt="Bukti pembayaran"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Tidak ada gambar</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Setujui Pembayaran" : "Tolak Pembayaran"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "Premium user akan diaktifkan otomatis" 
                : "Notifikasi penolakan akan dikirim ke user"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">User</span>
                <span className="font-medium">{selectedPayment?.user?.visibleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nominal</span>
                <span className="font-medium">{formatCurrency(selectedPayment?.amount || 0)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Catatan Admin (opsional)</label>
              <Textarea
                placeholder="Tambahkan catatan..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                data-testid="textarea-admin-note"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Batal
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={confirmAction}
              disabled={processPayment.isPending}
              data-testid="button-confirm-action"
            >
              {processPayment.isPending ? (
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : actionType === "approve" ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Setujui
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
