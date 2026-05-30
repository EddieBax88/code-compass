/**
 * Code Compass — App Layout
 * Design: Industrial Control Panel — fixed left sidebar as "breaker panel"
 */
import { Link, useLocation } from "wouter";
import { BookOpen, Zap, Search, LayoutDashboard, Timer } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "PANEL", icon: LayoutDashboard },
  { href: "/exam", label: "EXAM", icon: Timer },
  { href: "/quiz", label: "DRILL", icon: Zap },
  { href: "/search", label: "LOOKUP", icon: Search },
] as const;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — "Breaker Panel" */}
      <aside className="w-16 lg:w-56 flex-shrink-0 border-r border-border bg-[oklch(0.06_0.005_250)] flex flex-col">
        {/* Logo */}
        <div className="p-3 lg:p-4 border-b border-border flex items-center gap-3">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663501556292/h96iBuVHfguftcpG5HiHBb/logo-icon-6yBaNeWTkQfgdZ5r2BEFr3.webp"
            alt="Code Compass"
            className="w-8 h-8 lg:w-10 lg:h-10"
          />
          <div className="hidden lg:block">
            <h1 className="text-sm font-bold text-foreground tracking-tight">CODE COMPASS</h1>
            <p className="stencil-label">NEC 2026</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150 ${
                    active
                      ? "bg-primary/15 border border-primary/40 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:block font-mono text-xs font-medium tracking-wider uppercase">
                    {label}
                  </span>
                  {active && (
                    <span className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-primary indicator-pulse" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className="hidden lg:flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="stencil-label">Open your code book</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
