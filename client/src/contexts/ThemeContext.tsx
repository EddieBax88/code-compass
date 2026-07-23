import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Code Compass — Theme System
 * Exactly two themes:
 *   - "oled"  → true #000000 background, orange/amber accents (DEFAULT)
 *   - "light" → readability-first, dark text on near-white, same accent
 * Persisted in localStorage under key "cc_theme". Survives reload.
 */
export type Theme = "oled" | "light";

const STORAGE_KEY = "cc_theme";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  /** When false, only Light is allowed and any OLED selection is forced back to Light. */
  oledUnlocked: boolean;
  setOledUnlocked: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  // :root is OLED (dark) by default. `.light` overrides tokens for light mode.
  // Keep `.dark` in sync for any dark-variant utilities (@custom-variant dark).
  if (theme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Hard default is LIGHT for everyone. OLED is a paid perk that must be
  // explicitly unlocked by a paying user (see AppLayout gating).
  const [oledUnlocked, setOledUnlocked] = useState(false);

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored === "oled" ? "oled" : "light";
  });

  // If OLED is not unlocked (free/unauthed user), force Light regardless of
  // any stored preference. This guarantees all public pages are white.
  const effectiveTheme: Theme = oledUnlocked ? theme : "light";

  useEffect(() => {
    applyThemeClass(effectiveTheme);
  }, [effectiveTheme]);

  useEffect(() => {
    // Only persist a real preference when the user is allowed to use OLED.
    // For locked (free/unauthed) users, actively scrub any stale "oled" value
    // so an old preference can never resurface — Light stays the hard default.
    if (oledUnlocked) {
      localStorage.setItem(STORAGE_KEY, theme);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [theme, oledUnlocked]);

  const setTheme = (t: Theme) => {
    if (t === "oled" && !oledUnlocked) return; // ignore OLED for free users
    setThemeState(t);
  };
  const toggleTheme = () => {
    if (!oledUnlocked) return; // free users stay on Light
    setThemeState(prev => (prev === "oled" ? "light" : "oled"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: effectiveTheme,
        setTheme,
        toggleTheme,
        oledUnlocked,
        setOledUnlocked,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
