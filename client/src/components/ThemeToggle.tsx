/**
 * Code Compass — Theme Toggle
 * Single shared toggle between OLED Black and Light. Used in every header.
 */
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const isOled = theme === "oled";

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-sm border border-border px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ${className}`}
      title={isOled ? "Switch to Light mode" : "Switch to OLED Black"}
      aria-label="Toggle color theme"
    >
      {isOled ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="hidden sm:inline font-mono text-xs font-medium tracking-wider uppercase">
        {isOled ? "Light" : "OLED"}
      </span>
    </button>
  );
}
