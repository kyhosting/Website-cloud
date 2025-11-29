import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Crown, 
  CheckCircle, 
  Upload, 
  QrCode,
  Clock,
  Shield,
  Zap,
  Bot,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, formatCurrency, formatDate } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PremiumPackage, Payment } from "@shared/schema";

const premiumFeatures = [
  { icon: Bot, text: "Akses Bot V2 (Python)" },
  { icon: Zap, text: "Limit 10 Bot" },
  { icon: Shield, text: "Prioritas CPU" },
  { icon: Clock, text: "Support Prioritas" },
];

export default function Premium() {
  const { user, isLoading: authLoading, isAuthenticated, isPremium } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<PremiumPackage | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);

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

  const { data: packages, isLoading: packagesLoading } = useQuery<PremiumPackage[]>({
    queryKey: ["/api/premium/packages"],
    enabled: isAuthenticated,
  });

  const { data: pendingPayment } = useQuery<Payment>({
    queryKey: ["/api/payments/pending"],
    enabled: isAuthenticated,
  });

  const submitPayment = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/payments", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit payment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments/pending"] });
      toast({
        title: "Bukti Pembayaran Terkirim",
        description: "Admin akan memvalidasi pembayaran kamu dalam 1x24 jam",
      });
      setShowUploadDialog(false);
      setProofFile(null);
      setSelectedPackage(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
        title: "Gagal Upload",
        description: error.message || "Terjadi kesalahan saat upload bukti",
        variant: "destructive",
      });
    },
  });

  const handleSelectPackage = (pkg: PremiumPackage) => {
    setSelectedPackage(pkg);
    setShowUploadDialog(true);
  };

  const handleUploadProof = () => {
    if (!proofFile || !selectedPackage) return;

    const formData = new FormData();
    formData.append("proof", proofFile);
    formData.append("packageId", selectedPackage.id);
    formData.append("amount", selectedPackage.price.toString());

    submitPayment.mutate(formData);
  };

  if (authLoading || packagesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-8 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <BackButton fallbackHref="/dashboard" />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-chart-4/20 text-chart-4 border border-chart-4/30 mb-4">
            <Crown className="w-4 h-4" />
            <span className="text-sm font-medium">Premium</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Upgrade ke <span className="text-chart-4">Premium</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dapatkan akses ke fitur eksklusif dan tingkatkan pengalaman hosting bot kamu
          </p>
        </motion.div>

        {/* Current Status */}
        {isPremium && user?.premiumExpiry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <Card className="glass neon-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-chart-4/20 flex items-center justify-center">
                      <Crown className="w-7 h-7 text-chart-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Status Premium Aktif</h3>
                      <p className="text-muted-foreground">
                        Berlaku hingga: {formatDate(user.premiumExpiry)}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-chart-4/20 text-chart-4">Aktif</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pending Payment Notice */}
        {pendingPayment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="glass border-status-away/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-status-away/20 flex items-center justify-center">
                    <Clock className="w-7 h-7 text-status-away" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Menunggu Validasi</h3>
                    <p className="text-muted-foreground">
                      Pembayaran kamu ({formatCurrency(pendingPayment.amount)}) sedang diproses admin
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {packages?.map((pkg, index) => {
            const isPopular = pkg.durationDays === 30;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className={`glass h-full ${isPopular ? "neon-border scale-105" : "border-border/50"}`}>
                  <CardContent className="p-6">
                    {isPopular && (
                      <div className="text-center mb-4">
                        <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30">
                          Paling Populer
                        </Badge>
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <p className="text-4xl font-bold">
                        {formatCurrency(pkg.price)}
                      </p>
                      <p className="text-muted-foreground mt-1">{pkg.durationDays} Hari</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {premiumFeatures.map((feature) => (
                        <li key={feature.text} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-status-online flex-shrink-0" />
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${isPopular ? "neon-glow" : ""}`}
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => handleSelectPackage(pkg)}
                      disabled={!!pendingPayment}
                      data-testid={`button-select-package-${pkg.durationDays}`}
                    >
                      {pendingPayment ? "Menunggu Validasi" : "Pilih Paket"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* QRIS Payment Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Cara Pembayaran
              </CardTitle>
              <CardDescription>
                Ikuti langkah-langkah berikut untuk melakukan pembayaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">1</span>
                  <span>Pilih paket premium yang diinginkan</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">2</span>
                  <span>Scan QRIS yang muncul dan lakukan pembayaran sesuai nominal</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">3</span>
                  <span>Screenshot bukti pembayaran dan upload melalui form yang disediakan</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">4</span>
                  <span>Tunggu validasi dari admin (maksimal 1x24 jam)</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-status-online/20 text-status-online flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                  <span>Setelah divalidasi, status premium akan aktif otomatis</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Upload Payment Proof Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
            <DialogDescription>
              Paket: {selectedPackage?.durationDays} Hari - {selectedPackage && formatCurrency(selectedPackage.price)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* QRIS Image Placeholder */}
            <div className="aspect-square max-w-[250px] mx-auto bg-white rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">QRIS akan ditampilkan di sini</p>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Nominal: <span className="font-bold text-foreground">{selectedPackage && formatCurrency(selectedPackage.price)}</span>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="proof">Bukti Pembayaran</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Input
                  id="proof"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  data-testid="input-payment-proof"
                />
                <Label htmlFor="proof" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {proofFile ? proofFile.name : "Klik untuk upload bukti"}
                  </p>
                </Label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowUploadDialog(false)}
                className="flex-1"
                data-testid="button-cancel-payment"
              >
                Batal
              </Button>
              <Button 
                onClick={handleUploadProof}
                disabled={!proofFile || submitPayment.isPending}
                className="flex-1 neon-glow"
                data-testid="button-submit-payment"
              >
                {submitPayment.isPending ? (
                  <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
