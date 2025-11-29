import { motion } from "framer-motion";
import { 
  Code, 
  Heart,
  Globe,
  Sparkles,
  Coffee,
  Rocket,
  Zap,
  Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { RobotMascot } from "@/components/robot-mascot";

export default function Developer() {
  const skills = [
    "Full-Stack Development",
    "Bot Development",
    "Cloud Infrastructure",
    "Security Systems",
    "UI/UX Design",
    "Database Architecture",
  ];

  const techStack = [
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "PostgreSQL",
    "Telegram API",
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
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <Code className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-chart-4 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-primary">KIFZL</span>
            <span className="text-secondary">DEV</span>
            <span className="text-muted-foreground"> HQ</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Developer & Creator
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Coffee className="w-4 h-4 text-chart-4" />
            <span className="text-muted-foreground">Powered by caffeine & passion</span>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="glass neon-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Rocket className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Tentang Developer</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                KIFZLDEV HQ adalah developer independen yang berfokus pada pengembangan platform dan tools untuk komunitas Telegram Indonesia. Dengan pengalaman bertahun-tahun di bidang software development, KIFZLDEV berkomitmen untuk menghadirkan solusi hosting bot yang lengkap, aman, dan mudah digunakan.
              </p>
              <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">2025</p>
                  <p className="text-sm text-muted-foreground">Since</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary">100%</p>
                  <p className="text-sm text-muted-foreground">Passion</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-chart-4">24/7</p>
                  <p className="text-sm text-muted-foreground">Support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills & Tech Stack */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-sm bg-primary/20 text-primary border border-primary/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-secondary" />
                  <h3 className="text-lg font-semibold">Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1.5 rounded-full text-sm bg-secondary/20 text-secondary border border-secondary/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Mascot & Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <RobotMascot size="md" className="mx-auto mb-6" />
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-destructive" />
            <span>in Indonesia</span>
            <Globe className="w-4 h-4 text-secondary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            © 2025 KIFZLDEV HQ. All rights reserved.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
