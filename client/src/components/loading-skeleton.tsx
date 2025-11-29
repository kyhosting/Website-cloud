import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("shimmer rounded-md bg-muted", className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-lg border border-border/50 glass space-y-4">
      <LoadingSkeleton className="h-6 w-1/3" />
      <LoadingSkeleton className="h-10 w-full" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-4 p-4">
        <LoadingSkeleton className="h-4 w-1/4" />
        <LoadingSkeleton className="h-4 w-1/4" />
        <LoadingSkeleton className="h-4 w-1/4" />
        <LoadingSkeleton className="h-4 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-t border-border/30">
          <LoadingSkeleton className="h-4 w-1/4" />
          <LoadingSkeleton className="h-4 w-1/4" />
          <LoadingSkeleton className="h-4 w-1/4" />
          <LoadingSkeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-10 w-48" />
        <LoadingSkeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="rounded-lg border border-border/50 glass p-6">
        <LoadingSkeleton className="h-6 w-32 mb-4" />
        <TableSkeleton rows={3} />
      </div>
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    </div>
  );
}
