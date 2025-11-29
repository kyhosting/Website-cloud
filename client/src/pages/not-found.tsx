import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { RobotMascot } from "@/components/robot-mascot";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-8 px-4 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <RobotMascot size="lg" className="mx-auto mb-8 opacity-80" />
          
          <h1 className="text-8xl font-bold mb-4">
            <span className="text-primary neon-text-glow">4</span>
            <span className="text-secondary neon-text-glow-cyan">0</span>
            <span className="text-primary neon-text-glow">4</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Waduh, halaman ini nggak ditemukan nih!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="neon-glow w-full sm:w-auto" data-testid="button-go-home">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
              data-testid="button-go-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Halaman Sebelumnya
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
