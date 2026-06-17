/**
 * Code Compass — App Layout
 * Top header bar (logo + nav + single theme toggle) on every screen.
 * Full-width content area below the header.
 */
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Zap, Search, LayoutDashboard, Timer, CreditCard, Bot } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { InAppBrowserBanner } from "./InAppBrowserBanner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";

const NAV_ITEMS = [
  { href: "/", label: "PANEL", icon: LayoutDashboard },
  { href: "/exam", label: "EXAM", icon: Timer },
  { href: "/quiz", label: "DRILL", icon: Zap },
  { href: "/search", label: "LOOKUP", icon: Search },
  { href: "/copilot", label: "CO-PILOT", icon: Bot },
  { href: "/pricing", label: "PLANS", icon: CreditCard },
] as const;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const { oledUnlocked, setOledUnlocked } = useTheme();

  // OLED is a paid perk. Unlock it only when the signed-in user has active access.
  const { data: subStatus } = trpc.stripe.subscriptionStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const hasPaidAccess =
    isAuthenticated &&
    (subStatus?.status === "active" || subStatus?.status === "trialing");

  useEffect(() => {
    setOledUnlocked(Boolean(hasPaidAccess));
  }, [hasPaidAccess, setOledUnlocked]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Header Bar */}
      <header className="flex-shrink-0 border-b border-border bg-[var(--sidebar)]">
        <div className="flex items-center justify-between gap-4 px-4 lg:px-6 h-14">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663501556292/h96iBuVHfguftcpG5HiHBb/logo-icon-6yBaNeWTkQfgdZ5r2BEFr3.webp"
                alt="Code Compass"
                className="w-8 h-8"
              />
              <div className="hidden sm:block leading-tight">
                <h1 className="text-sm font-bold text-foreground tracking-tight">CODE COMPASS</h1>
                <p className="stencil-label">NEC 2026</p>
              </div>
            </div>
          </Link>

          {/* Center nav */}
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return (
                <Link key={href} href={href}>
                  <div
                    className={`flex items-center gap-2 px-2.5 lg:px-3 py-2 rounded-sm transition-all duration-150 ${
                      active
                        ? "bg-primary/15 border border-primary/40 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden lg:block font-mono text-xs font-medium tracking-wider uppercase">
                      {label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Single theme toggle — paid perk only */}
          <div className="flex-shrink-0">
            {oledUnlocked && <ThemeToggle />}
          </div>
        </div>
      </header>

      {/* Main Content — full width */}
      <main className="flex-1 overflow-y-auto">
        <InAppBrowserBanner />
        {children}
      </main>
    </div>
  );
}
