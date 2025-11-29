import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Server,
  Fingerprint,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";

export default function Security() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "Anti Brute Force",
      description: "Proteksi login dengan rate limiting dan cooldown otomatis setelah beberapa kali percobaan gagal",
      status: "active",
    },
    {
      icon: Fingerprint,
      title: "Anti Cloning",
      description: "Sistem fingerprint untuk mendeteksi dan memblokir panel yang tidak resmi atau hasil clone",
      status: "active",
    },
    {
      icon: Eye,
      title: "Session Monitoring",
      description: "Auto logout setelah 24 jam dan monitoring aktivitas mencurigakan secara real-time",
      status: "active",
    },
    {
      icon: Server,
      title: "Internal Firewall",
      description: "Rate limiting, anti DDoS ringan, dan blocking IP mencurigakan dengan auto unblock 6 jam",
      status: "active",
    },
    {
      icon: ShieldCheck,
      title: "OTP Protection",
      description: "Verifikasi OTP via Telegram dengan expire 5 menit dan proteksi spam",
      status: "active",
    },
    {
      icon: AlertTriangle,
      title: "Lockdown Mode",
      description: "Sistem freeze otomatis saat terdeteksi aktivitas berbahaya seperti brute force atau akses ilegal",
      status: "active",
    },
  ];

  const protectionLayers = [
    "Anti rename developer KIFZLDEV",
    "Anti akses bot milik user lain",
    "Anti modify file sistem panel",
    "Auto suspend akses ilegal",
    "Hash validation untuk integritas file",
    "Domain binding protection",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-8 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <BackButton />
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-6 neon-glow">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Keamanan <span className="text-primary">Sistem</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            KIFZLDEV menggunakan proteksi multi-layer untuk menjaga keamanan platform dan data pengguna
          </p>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Fitur Keamanan</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Card className="glass h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{feature.title}</h3>
                          <Badge className="bg-status-online/20 text-status-online text-xs">
                            Aktif
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Protection Layers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Lapisan Proteksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {protectionLayers.map((layer, index) => (
                  <motion.div
                    key={layer}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <CheckCircle className="w-5 h-5 text-status-online flex-shrink-0" />
                    <span className="text-sm">{layer}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="glass border-destructive/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive mb-2">Peringatan</h3>
                  <p className="text-sm text-muted-foreground">
                    Segala percobaan untuk mengakses sistem secara ilegal, clone panel, atau memodifikasi file sistem akan terdeteksi dan diblokir secara otomatis. Admin akan menerima notifikasi dan tindakan hukum dapat diambil terhadap pelaku.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
