export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function generateUserId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `KIFZUSR-${randomNum}`;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "online":
      return "text-status-online";
    case "offline":
      return "text-status-offline";
    case "error":
      return "text-status-busy";
    case "idle":
      return "text-status-away";
    case "active":
      return "text-status-online";
    case "banned":
      return "text-status-busy";
    case "suspended":
      return "text-status-away";
    case "premium":
      return "text-chart-4";
    case "free":
      return "text-muted-foreground";
    case "expired":
      return "text-status-busy";
    case "pending":
      return "text-status-away";
    case "approved":
      return "text-status-online";
    case "rejected":
      return "text-status-busy";
    default:
      return "text-muted-foreground";
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case "online":
      return "bg-status-online/20";
    case "offline":
      return "bg-status-offline/20";
    case "error":
      return "bg-status-busy/20";
    case "idle":
      return "bg-status-away/20";
    case "active":
      return "bg-status-online/20";
    case "banned":
      return "bg-status-busy/20";
    case "suspended":
      return "bg-status-away/20";
    case "premium":
      return "bg-chart-4/20";
    case "free":
      return "bg-muted";
    case "expired":
      return "bg-status-busy/20";
    case "pending":
      return "bg-status-away/20";
    case "approved":
      return "bg-status-online/20";
    case "rejected":
      return "bg-status-busy/20";
    default:
      return "bg-muted";
  }
}
