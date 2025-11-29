import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MoreVertical, 
  X, 
  LogIn, 
  Info, 
  Shield, 
  Code, 
  ArrowLeft,
  User,
  History,
  MessageSquare,
  LogOut,
  BarChart3,
  Users,
  Bot,
  CreditCard,
  Crown,
  Settings,
  Database,
  Wrench,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

export function ThreeDotMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [devModeActivated, setDevModeActivated] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [location] = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Developer mode detection with SHIFT+D+V
  useEffect(() => {
    const keysPressed = new Set<string>();
    let holdTimer: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key.toLowerCase());
      
      if (keysPressed.has("shift") && keysPressed.has("d") && keysPressed.has("v")) {
        if (!holdTimer) {
          holdTimer = setTimeout(() => {
            setDevModeActivated(true);
            localStorage.setItem("kifzldev-devmode", "true");
          }, 5000);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Check if dev mode was previously activated
    if (localStorage.getItem("kifzldev-devmode") === "true") {
      setDevModeActivated(true);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Long press detection for dev mode
  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setDevModeActivated(true);
      localStorage.setItem("kifzldev-devmode", "true");
    }, 5000);
    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const getMenuItems = (): MenuItem[] => {
    if (!isAuthenticated) {
      return [
        { icon: <LogIn className="w-5 h-5" />, label: "Login", href: "/api/login" },
        { icon: <Info className="w-5 h-5" />, label: "Tentang", href: "/about" },
        { icon: <Shield className="w-5 h-5" />, label: "Keamanan Sistem", href: "/security" },
        { icon: <Code className="w-5 h-5" />, label: "Developer", href: "/developer" },
        ...(location !== "/" ? [{ icon: <ArrowLeft className="w-5 h-5" />, label: "Kembali", href: "/" }] : []),
      ];
    }

    if (isAdmin) {
      return [
        { icon: <BarChart3 className="w-5 h-5" />, label: "Statistik", href: "/kifzldev" },
        { icon: <Users className="w-5 h-5" />, label: "Semua User", href: "/kifzldev/users" },
        { icon: <Bot className="w-5 h-5" />, label: "Semua Bot", href: "/kifzldev/bots" },
        { icon: <Bot className="w-5 h-5" />, label: "Bot V1", href: "/kifzldev/bots/v1" },
        { icon: <Bot className="w-5 h-5" />, label: "Bot V2", href: "/kifzldev/bots/v2" },
        { icon: <History className="w-5 h-5" />, label: "Aktivitas Bot V2", href: "/kifzldev/activity" },
        { icon: <CreditCard className="w-5 h-5" />, label: "Validasi QRIS", href: "/kifzldev/payments" },
        { icon: <Crown className="w-5 h-5" />, label: "Premium Control", href: "/kifzldev/premium" },
        { icon: <Settings className="w-5 h-5" />, label: "Pilih Paket Premium", href: "/kifzldev/packages" },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Pesan User", href: "/kifzldev/messages" },
        { icon: <Shield className="w-5 h-5" />, label: "Keamanan Sistem", href: "/kifzldev/security" },
        { icon: <Database className="w-5 h-5" />, label: "Backup Database", href: "/kifzldev/backup" },
        { icon: <Wrench className="w-5 h-5" />, label: "Developer Tools", href: "/kifzldev/devtools" },
        { icon: <LogOut className="w-5 h-5" />, label: "Logout", href: "/api/logout" },
        ...(location !== "/kifzldev" ? [{ icon: <ArrowLeft className="w-5 h-5" />, label: "Kembali", onClick: () => window.history.back() }] : []),
      ];
    }

    return [
      { icon: <User className="w-5 h-5" />, label: "Profil", href: "/profile" },
      { icon: <History className="w-5 h-5" />, label: "Riwayat Bot", href: "/bots/history" },
      { icon: <MessageSquare className="w-5 h-5" />, label: "Pesan Admin", href: "/messages" },
      { icon: <LogOut className="w-5 h-5" />, label: "Logout", href: "/api/logout" },
      ...(location !== "/dashboard" ? [{ icon: <ArrowLeft className="w-5 h-5" />, label: "Kembali", onClick: () => window.history.back() }] : []),
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        data-testid="button-three-dot-menu"
        className="relative"
      >
        <MoreVertical className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 glass-dark flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-menu"
            >
              <X className="w-6 h-6" />
            </Button>

            <motion.nav
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-3 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.href ? (
                    item.href.startsWith("/api") ? (
                      <a
                        href={item.href}
                        className="flex items-center gap-4 px-8 py-4 rounded-lg glass neon-border hover-elevate transition-all min-w-[250px]"
                        data-testid={`menu-item-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <span className="text-primary">{item.icon}</span>
                        <span className="text-lg font-medium">{item.label}</span>
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center gap-4 px-8 py-4 rounded-lg glass neon-border hover-elevate transition-all min-w-[250px]"
                        onClick={() => setIsOpen(false)}
                        data-testid={`menu-item-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <span className="text-primary">{item.icon}</span>
                        <span className="text-lg font-medium">{item.label}</span>
                      </Link>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        item.onClick?.();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-4 px-8 py-4 rounded-lg glass neon-border hover-elevate transition-all min-w-[250px]"
                      data-testid={`menu-item-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <span className="text-primary">{item.icon}</span>
                      <span className="text-lg font-medium">{item.label}</span>
                    </button>
                  )}
                </motion.div>
              ))}

              {devModeActivated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: menuItems.length * 0.05 }}
                >
                  <Link
                    href="/devmode"
                    className="flex items-center gap-4 px-8 py-4 rounded-lg bg-destructive/20 border border-destructive/50 hover-elevate transition-all min-w-[250px]"
                    onClick={() => setIsOpen(false)}
                    data-testid="menu-item-dev-mode"
                  >
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span className="text-lg font-medium text-destructive">Dev Mode</span>
                  </Link>
                </motion.div>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
