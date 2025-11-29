import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { PageLoadingSkeleton } from "@/components/loading-skeleton";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AddBot from "@/pages/add-bot";
import Premium from "@/pages/premium";
import About from "@/pages/about";
import Security from "@/pages/security";
import Developer from "@/pages/developer";
import AdminDashboard from "@/pages/admin/index";
import AdminUsers from "@/pages/admin/users";
import AdminPayments from "@/pages/admin/payments";

function AuthenticatedRoutes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/bots/new" component={AddBot} />
      <Route path="/premium" component={Premium} />
      <Route path="/kifzldev" component={AdminDashboard} />
      <Route path="/kifzldev/users" component={AdminUsers} />
      <Route path="/kifzldev/payments" component={AdminPayments} />
      <Route path="/about" component={About} />
      <Route path="/security" component={Security} />
      <Route path="/developer" component={Developer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function PublicRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/about" component={About} />
      <Route path="/security" component={Security} />
      <Route path="/developer" component={Developer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return isAuthenticated ? <AuthenticatedRoutes /> : <PublicRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="kifzldev-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
