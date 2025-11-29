import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
}

export function BackButton({ fallbackHref = "/", label = "Kembali" }: BackButtonProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      setLocation(fallbackHref);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className="gap-2"
      data-testid="button-back"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
}
