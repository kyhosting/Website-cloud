import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, LogIn, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RobotMascot } from "@/components/robot-mascot";

export default function Login() {
  const [selectedMethod, setSelectedMethod] = useState<"google" | "email" | null>(null);

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = "/api/auth/google";
  };

  const handleEmailLogin = () => {
    // Redirect to email OTP page
    window.location.href = "/login/email";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-animate" />
      <div className="absolute inset-0 cyber-grid opacity-20" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left hidden lg:block"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30 neon-glow">
                Platform Hosting Bot #1
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold mb-6 tracking-tight"
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
              className="text-lg text-muted-foreground mb-8"
            >
              Kelola bot Telegram V1 & V2 dengan teknologi terdepan, keamanan berlapis, dan sistem premium profesional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3"
            >
              {[
                { icon: Zap, text: "Real-time Monitoring" },
                { icon: Mail, text: "Email + OTP Telegram" },
                { icon: LogIn, text: "Google OAuth" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-muted-foreground">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12"
            >
              <RobotMascot size="md" className="drop-shadow-2xl" />
            </motion.div>
          </motion.div>

          {/* Right side - Login Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="cursor-pointer hover-elevate border-primary/30 bg-card/50 backdrop-blur" data-testid="card-google-login">
                  <CardHeader>
                    <CardTitle className="text-xl">Login dengan Google</CardTitle>
                    <CardDescription>Cepat dan aman dengan akun Google Anda</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleGoogleLogin}
                      className="w-full neon-glow text-base py-6 group"
                      size="lg"
                      data-testid="button-google-login"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Login dengan Google
                      <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">atau</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="cursor-pointer hover-elevate border-secondary/30 bg-card/50 backdrop-blur" data-testid="card-email-login">
                  <CardHeader>
                    <CardTitle className="text-xl">Login dengan Email + OTP</CardTitle>
                    <CardDescription>OTP dikirim via Telegram untuk keamanan maksimal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleEmailLogin}
                      variant="outline"
                      className="w-full text-base py-6 group"
                      size="lg"
                      data-testid="button-email-login"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Login dengan Email
                      <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-sm text-muted-foreground mt-6"
              >
                Developer: <span className="text-primary font-semibold">KIFZLDEV HQ</span> — 2025
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
