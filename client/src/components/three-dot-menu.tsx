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
        { icon: <CreditCard className="w-5 h-5" />, label: "Validasi QRIS", href: "/kifzldev/payments" },
        { icon: <Crown className="w-5 h-5" />, label: "Premium", href: "/premium" },
        { icon: <Shield className="w-5 h-5" />, label: "Keamanan", href: "/security" },
        { icon: <LogOut className="w-5 h-5" />, label: "Logout", href: "/api/logout" },
        ...(location !== "/kifzldev" ? [{ icon: <ArrowLeft className="w-5 h-5" />, label: "Kembali", onClick: () => window.history.back() }] : []),
      ];
    }

    return [
      { icon: <Crown className="w-5 h-5" />, label: "Premium", href: "/premium" },
      { icon: <Info className="w-5 h-5" />, label: "Tentang", href: "/about" },
      { icon: <Shield className="w-5 h-5" />, label: "Keamanan", href: "/security" },
      { icon: <Code className="w-5 h-5" />, label: "Developer", href: "/developer" },
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
            transition={{ duration: 0.05 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col w-screen h-screen"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-end p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-menu"
                className="text-primary hover-elevate"
              >
                <X className="w-8 h-8" />
              </Button>
            </div>

            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }}
              className="flex flex-col w-full h-full overflow-y-auto px-6 pt-4 pb-8 gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {menuItems.map((item, index) => (
                <div
                  key={item.label}
                >
                  {item.href ? (
                    item.href.startsWith("/api") ? (
                      <a
                        href={item.href}
                        className="w-full flex items-center gap-6 px-8 py-5 rounded-xl bg-muted/50 hover:bg-muted hover-elevate transition-all active-elevate-2"
                        data-testid={`menu-item-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <span className="text-primary text-2xl">{item.icon}</span>
                        <span className="text-lg font-medium">{item.label}</span>
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="w-full flex items-center gap-6 px-8 py-5 rounded-xl bg-muted/50 hover:bg-muted hover-elevate transition-all active-elevate-2"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        data-testid={`menu-item-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <span className="text-primary text-2xl">{item.icon}</span>
                        <span className="text-lg font-medium">{item.label}</span>
                      </Link>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        item.onClick?.();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-6 px-8 py-5 rounded-xl bg-muted/50 hover:bg-muted hover-elevate transition-all active-elevate-2"
                      data-testid={`menu-item-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <span className="text-primary text-2xl">{item.icon}</span>
                      <span className="text-lg font-medium">{item.label}</span>
                    </button>
                  )}
                </div>
              ))}

              {devModeActivated && (
                <Link
                  href="/devmode"
                  className="w-full flex items-center gap-6 px-8 py-5 rounded-xl bg-destructive/20 hover:bg-destructive/30 border border-destructive/50 hover-elevate transition-all active-elevate-2"
                  onClick={() => setIsOpen(false)}
                  data-testid="menu-item-dev-mode"
                >
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  <span className="text-lg font-medium text-destructive">Dev Mode</span>
                </Link>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
