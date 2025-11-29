import { motion } from "framer-motion";
import { 
  Bot, 
  Shield, 
  Zap, 
  Crown, 
  Code,
  Heart,
  Globe,
  Rocket
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { RobotMascot } from "@/components/robot-mascot";

export default function About() {
  const features = [
    {
      icon: Bot,
      title: "Multi-Version Support",
      description: "Mendukung Bot V1 (NodeJS) dan Bot V2 (Python) dengan auto-inject config yang powerful",
    },
    {
      icon: Shield,
      title: "Keamanan Tingkat Tinggi",
      description: "Anti brute force, firewall internal, anti-cloning, dan proteksi multi-layer lainnya",
    },
    {
      icon: Zap,
      title: "Realtime Monitoring",
      description: "Pantau status bot, CPU, RAM, ping, dan uptime secara real-time setiap 5 detik",
    },
    {
      icon: Crown,
      title: "Premium Features",
      description: "Akses eksklusif ke Bot V2, limit bot lebih besar, dan prioritas support",
    },
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
          className="text-center mb-16"
        >
          <RobotMascot size="lg" className="mx-auto mb-8" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tentang <span className="text-primary neon-text-glow">KIFZL</span>
            <span className="text-secondary neon-text-glow-cyan">DEV</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Platform hosting bot Telegram paling lengkap, futuristik, dan profesional di Indonesia
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="glass neon-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Cerita Kami</h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  KIFZLDEV NEO-2025 lahir dari kebutuhan developer Indonesia akan platform hosting bot Telegram yang lengkap, mudah digunakan, dan terpercaya. Kami memahami bahwa mengelola bot Telegram bisa menjadi rumit - dari setup server, konfigurasi, monitoring, hingga keamanan.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Dengan KIFZLDEV, semua itu menjadi mudah. Cukup masukkan token bot, dan sistem kami akan mengurus sisanya. Auto-inject config, monitoring real-time, dan keamanan berlapis - semua sudah termasuk.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Kenapa KIFZLDEV?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="glass h-full hover-elevate">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 neon-glow">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Developer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Card className="glass">
            <CardContent className="p-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 neon-glow">
                <Code className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">KIFZLDEV HQ</h2>
              <p className="text-muted-foreground mb-4">Developer & Creator</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-destructive" />
                <span>in Indonesia</span>
                <Globe className="w-4 h-4 text-secondary" />
              </div>
              <p className="mt-4 text-primary font-semibold">© 2025 KIFZLDEV. All rights reserved.</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
