/**
 * Code Compass — Custom Back Button
 * State-aware in-app back navigation. Falls back to a sensible default route
 * when there is no history (e.g. user landed directly on a deep link).
 */
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

interface BackButtonProps {
  /** Route to navigate to if there is no browser history to go back to. Defaults to "/". */
  fallback?: string;
  /** Optional label override. Defaults to "Back". */
  label?: string;
  className?: string;
}

export default function BackButton({
  fallback = "/",
  label = "Back",
  className = "",
}: BackButtonProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    // If there is real in-app history, use it; otherwise go to the fallback route.
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150 ${className}`}
      aria-label={label}
    >
      <ChevronLeft className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
