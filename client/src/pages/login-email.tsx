import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Smartphone, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const emailSchema = z.object({
  email: z.string().email("Email tidak valid"),
  telegramId: z.string().min(1, "Telegram ID diperlukan"),
});

const otpSchema = z.object({
  code: z.string().length(6, "OTP harus 6 karakter"),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export default function LoginEmail() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const { toast } = useToast();

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const requestOtpMutation = useMutation({
    mutationFn: async (data: EmailFormData) => {
      const isDev = import.meta.env.DEV;
      const backendUrl = import.meta.env.VITE_API_URL || "https://runner-workspace.replit.dev";
      const apiUrl = isDev ? "/api/auth/email/request-otp" : `${backendUrl}/api/auth/email/request-otp`;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal mengirim OTP");
      }
      return response.json();
    },
    onSuccess: () => {
      setEmail(emailForm.getValues("email"));
      setTelegramId(emailForm.getValues("telegramId"));
      setStep("otp");
      toast({
        title: "OTP Terkirim!",
        description: "Periksa Telegram Anda untuk kode OTP 6 digit",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: OtpFormData) => {
      const isDev = import.meta.env.DEV;
      const backendUrl = import.meta.env.VITE_API_URL || "https://runner-workspace.replit.dev";
      const apiUrl = isDev ? "/api/auth/email/verify-otp" : `${backendUrl}/api/auth/email/verify-otp`;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: data.code,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "OTP tidak valid");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login Berhasil!",
        description: "Redirect ke dashboard...",
      });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Gagal Verify OTP",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-animate" />
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-primary/30 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">Login dengan Email</CardTitle>
              <CardDescription>
                {step === "email"
                  ? "Masukkan email dan Telegram ID Anda"
                  : "Masukkan kode OTP 6 digit dari Telegram"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === "email" ? (
                <Form {...emailForm}>
                  <form
                    onSubmit={emailForm.handleSubmit((data) =>
                      requestOtpMutation.mutate(data)
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="you@example.com"
                              type="email"
                              {...field}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="telegramId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            Telegram ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123456789 (numeric)"
                              type="number"
                              {...field}
                              data-testid="input-telegram-id"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full neon-glow py-6 group"
                      size="lg"
                      disabled={requestOtpMutation.isPending}
                      data-testid="button-request-otp"
                    >
                      {requestOtpMutation.isPending ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Mail className="w-5 h-5 mr-2" />
                      )}
                      Kirim OTP
                      {!requestOtpMutation.isPending && (
                        <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...otpForm}>
                  <form
                    onSubmit={otpForm.handleSubmit((data) =>
                      verifyOtpMutation.mutate(data)
                    )}
                    className="space-y-4"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Email: {email}</p>
                      <p>Kode OTP 6 digit sudah dikirim ke Telegram Anda</p>
                    </div>

                    <FormField
                      control={otpForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kode OTP</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="000000"
                              maxLength={6}
                              {...field}
                              data-testid="input-otp-code"
                              className="text-center text-xl tracking-widest"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full neon-glow py-6 group"
                      size="lg"
                      disabled={verifyOtpMutation.isPending}
                      data-testid="button-verify-otp"
                    >
                      {verifyOtpMutation.isPending ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      )}
                      Verifikasi OTP
                      {!verifyOtpMutation.isPending && (
                        <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setStep("email");
                        otpForm.reset();
                      }}
                      data-testid="button-back"
                    >
                      Kembali
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            <Button
              variant="link"
              className="p-0 text-primary hover:text-primary/80"
              onClick={() => (window.location.href = "/login")}
              data-testid="link-back-to-login"
            >
              Kembali ke halaman login
            </Button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
