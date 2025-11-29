import { motion } from "framer-motion";
import { 
  Bot, 
  Shield, 
  Zap, 
  Crown, 
  Users, 
  Activity, 
  Clock, 
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { RobotMascot } from "@/components/robot-mascot";

const features = [
  {
    icon: Bot,
    title: "Bot V1 & V2",
    description: "Dukung bot NodeJS (V1) dan Python (V2) dengan auto-inject config",
  },
  {
    icon: Shield,
    title: "Keamanan Berlapis",
    description: "Anti brute force, firewall, dan proteksi anti-cloning sistem",
  },
  {
    icon: Zap,
    title: "Realtime Monitoring",
    description: "Pantau CPU, RAM, ping, dan uptime bot secara real-time",
  },
  {
    icon: Crown,
    title: "Premium Features",
    description: "Akses Bot V2, limit lebih besar, dan prioritas support",
  },
];

const stats = [
  { value: "1000+", label: "Total Bots", icon: Bot },
  { value: "500+", label: "Active Users", icon: Users },
  { value: "99.9%", label: "Uptime", icon: Activity },
  { value: "< 50ms", label: "Response Time", icon: Clock },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-animate" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30 neon-glow">
                  Platform Hosting Bot Telegram #1
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
              >
                <span className="text-primary neon-text-glow">KIFZL</span>
                <span className="text-secondary neon-text-glow-cyan">DEV</span>
                <br />
                <span className="text-foreground">NEO-2025</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Platform hosting bot Telegram paling lengkap, futuristik, dan profesional. 
                Kelola bot V1 & V2 dengan mudah, sistem premium, dan keamanan berlapis.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <a href="/login">
                  <Button size="lg" className="neon-glow text-lg px-8 py-6 group" data-testid="button-start-now">
                    Mulai Sekarang
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" data-testid="button-learn-more">
                  Pelajari Lebih Lanjut
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-sm text-muted-foreground"
              >
                Developer: <span className="text-primary font-semibold">KIFZLDEV HQ</span> — 2025
              </motion.p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <RobotMascot size="xl" className="drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-pattern" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fitur <span className="text-primary">Lengkap</span> & <span className="text-secondary">Powerful</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Semua yang kamu butuhkan untuk mengelola bot Telegram dengan mudah dan profesional
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass neon-border h-full hover-elevate transition-all duration-300">
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 gradient-animate opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl glass neon-border"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-secondary" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-primary neon-text-glow mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-chart-4/20 text-chart-4 border border-chart-4/30 mb-4">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">Premium</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upgrade ke <span className="text-chart-4">Premium</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dapatkan akses ke fitur eksklusif dan tingkatkan pengalaman hosting bot kamu
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { days: 7, price: 25000 },
              { days: 30, price: 75000, popular: true },
              { days: 90, price: 180000 },
            ].map((plan, index) => (
              <motion.div
                key={plan.days}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass h-full ${plan.popular ? "neon-border scale-105" : "border-border/50"}`}>
                  <CardContent className="p-6">
                    {plan.popular && (
                      <div className="text-center mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-chart-4/20 text-chart-4">
                          Paling Populer
                        </span>
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <p className="text-4xl font-bold">
                        Rp {plan.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-muted-foreground mt-1">{plan.days} Hari</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Akses Bot V2 (Python)",
                        "Limit 10 Bot",
                        "Prioritas CPU",
                        "Support Prioritas",
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-status-online flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? "neon-glow" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      data-testid={`button-plan-${plan.days}`}
                    >
                      Pilih Paket
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-animate" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <RobotMascot size="lg" className="mx-auto mb-8" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Siap <span className="text-primary neon-text-glow">Memulai?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Bergabung dengan ribuan developer yang sudah menggunakan KIFZLDEV untuk hosting bot Telegram mereka
            </p>
            <a href="/api/login">
              <Button size="lg" className="neon-glow text-lg px-10 py-6" data-testid="button-join-now">
                Gas Sekarang!
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">
                <span className="text-primary">KIFZL</span>
                <span className="text-secondary">DEV</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 KIFZLDEV HQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
