import { Bot } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreeDotMenu } from "@/components/three-dot-menu";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 hover-elevate rounded-lg px-2 py-1" data-testid="link-home">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center neon-glow">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-primary">KIFZL</span>
            <span className="text-secondary">DEV</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ThreeDotMenu />
        </div>
      </div>
    </header>
  );
}
