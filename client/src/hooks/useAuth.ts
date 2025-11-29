import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: true,
  });

  return {
    user: user || undefined,
    isLoading,
    isAuthenticated: !!user && user !== null,
    isAdmin: user?.role === "admin",
    isPremium: user?.premiumStatus === "premium",
    error: error && !(error instanceof Error && error.message.includes("401")) ? error : null,
  };
}
