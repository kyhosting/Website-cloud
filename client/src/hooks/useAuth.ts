import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: 0,
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // If data is null, treat as not authenticated (either never logged in or logged out)
  const isAuthenticated = user !== null && user !== undefined;
  
  return {
    user: user || undefined,
    isLoading: isLoading && user === undefined, // Only show loading if we truly haven't loaded yet
    isAuthenticated,
    isAdmin: user?.role === "admin",
    isPremium: user?.premiumStatus === "premium",
    error: error && !(error instanceof Error && error.message.includes("401")) ? error : null,
  };
}
