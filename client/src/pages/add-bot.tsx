import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, ArrowRight, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

const addBotSchema = z.object({
  botToken: z.string().min(40, "Token bot tidak valid").max(100, "Token terlalu panjang"),
  telegramId: z.string().min(1, "Telegram ID tidak boleh kosong").regex(/^\d+$/, "Hanya angka"),
  version: z.enum(["v1", "v2"]),
});

type AddBotForm = z.infer<typeof addBotSchema>;

export default function AddBot() {
  const { user, isLoading: authLoading, isAuthenticated, isPremium } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);

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

  const form = useForm<AddBotForm>({
    resolver: zodResolver(addBotSchema),
    defaultValues: {
      botToken: "",
      telegramId: "",
      version: "v1",
    },
  });

  const addBot = useMutation({
    mutationFn: async (data: AddBotForm) => {
      const response = await apiRequest("POST", "/api/bots", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      toast({
        title: "Bot Berhasil Ditambahkan!",
        description: "Bot kamu sedang diproses dan akan segera aktif",
      });
      setLocation("/dashboard");
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
        title: "Gagal Menambah Bot",
        description: error.message || "Terjadi kesalahan saat menambah bot",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddBotForm) => {
    if (data.version === "v2" && !isPremium) {
      toast({
        title: "Premium Required",
        description: "Bot V2 hanya tersedia untuk pengguna premium",
        variant: "destructive",
      });
      return;
    }
    addBot.mutate(data);
  };

  const selectedVersion = form.watch("version");

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-8 px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <BackButton fallbackHref="/dashboard" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass neon-border">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4 neon-glow">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Tambah Bot Baru</CardTitle>
              <CardDescription>
                Isi informasi bot Telegram kamu untuk mulai hosting
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step >= s 
                        ? "bg-primary text-primary-foreground neon-glow" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                    </div>
                    {s < 2 && (
                      <div className={`w-16 h-1 rounded ${step > s ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="version"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pilih Versi Bot</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                <div>
                                  <RadioGroupItem
                                    value="v1"
                                    id="v1"
                                    className="peer sr-only"
                                  />
                                  <Label
                                    htmlFor="v1"
                                    className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                  >
                                    <Bot className="w-8 h-8 mb-2 text-primary" />
                                    <span className="font-semibold">Bot V1</span>
                                    <span className="text-xs text-muted-foreground mt-1">NodeJS</span>
                                  </Label>
                                </div>
                                <div>
                                  <RadioGroupItem
                                    value="v2"
                                    id="v2"
                                    className="peer sr-only"
                                    disabled={!isPremium}
                                  />
                                  <Label
                                    htmlFor="v2"
                                    className={`flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary [&:has([data-state=checked])]:border-secondary cursor-pointer transition-all ${
                                      !isPremium ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                  >
                                    <Bot className="w-8 h-8 mb-2 text-secondary" />
                                    <span className="font-semibold">Bot V2</span>
                                    <span className="text-xs text-muted-foreground mt-1">Python</span>
                                    {!isPremium && (
                                      <span className="text-xs text-chart-4 mt-1">Premium Only</span>
                                    )}
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-muted-foreground">
                            {selectedVersion === "v1" ? (
                              <>
                                <p className="font-medium text-foreground mb-1">Bot V1 (NodeJS)</p>
                                <p>Cocok untuk bot sederhana. Auto-inject config: token, owner, userId, premium status.</p>
                              </>
                            ) : (
                              <>
                                <p className="font-medium text-foreground mb-1">Bot V2 (Python)</p>
                                <p>Untuk bot kompleks. Virtual environment otomatis, requirements auto-install, prioritas CPU.</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="button" 
                        onClick={() => setStep(2)} 
                        className="w-full"
                        data-testid="button-next-step"
                      >
                        Lanjut
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="telegramId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telegram ID Bot</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Contoh: 1234567890" 
                                {...field}
                                data-testid="input-telegram-id"
                              />
                            </FormControl>
                            <FormDescription>
                              ID numerik bot Telegram untuk aktivasi otomatis
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="botToken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bot Token</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ" 
                                type="password"
                                {...field}
                                data-testid="input-bot-token"
                              />
                            </FormControl>
                            <FormDescription>
                              Dapatkan token dari @BotFather di Telegram
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setStep(1)} 
                          className="flex-1"
                          data-testid="button-prev-step"
                        >
                          Kembali
                        </Button>
                        <Button 
                          type="submit"
                          className="flex-1 neon-glow"
                          disabled={addBot.isPending}
                          data-testid="button-submit-bot"
                        >
                          {addBot.isPending ? (
                            <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                          ) : (
                            <>
                              Tambah Bot
                              <CheckCircle className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
