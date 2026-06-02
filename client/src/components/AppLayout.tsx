/**
 * Code Compass — App Layout
 * Industrial Control Panel — fixed left sidebar with NEC version selector
 */
import { Link, useLocation } from "wouter";
import { BookOpen, Zap, Search, LayoutDashboard, Timer, GraduationCap, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNecVersion, type NecVersion } from "@/contexts/NecVersionContext";

const NAV_ITEMS = [
  { href: "/", label: "PANEL", icon: LayoutDashboard },
  { href: "/book-method", label: "HOW TO USE", icon: GraduationCap },
  { href: "/exam", label: "EXAM", icon: Timer },
  { href: "/quiz", label: "DRILL", icon: Zap },
  { href: "/search", label: "LOOKUP", icon: Search },
] as const;

const VERSIONS: NecVersion[] = ["2017", "2020", "2023", "2026"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { version, setVersion } = useNecVersion();
  const [versionOpen, setVersionOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setVersionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
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
            <p className="stencil-label">NEC CO-PILOT</p>
          </div>
        </div>

        {/* NEC Version Selector */}
        <div className="px-2 py-3 border-b border-border" ref={dropdownRef}>
          <p className="stencil-label mb-1.5 hidden lg:block px-1">BOOK EDITION</p>
          <div className="relative">
            <button
              onClick={() => setVersionOpen(!versionOpen)}
              className="w-full panel-card rounded-sm px-3 py-2 flex items-center justify-between hover:border-primary/40 transition-all"
              data-testid="version-selector"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-mono text-xs font-bold text-primary">NEC {version}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform hidden lg:block ${versionOpen ? "rotate-180" : ""}`} />
            </button>
            {versionOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 border border-border rounded-sm bg-background shadow-lg overflow-hidden">
                {VERSIONS.map(v => (
                  <button
                    key={v}
                    onClick={() => { setVersion(v); setVersionOpen(false); }}
                    className={`w-full px-3 py-2.5 text-left font-mono text-xs font-bold transition-all flex items-center justify-between ${
                      v === version
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                    data-testid={`version-option-${v}`}
                  >
                    <span>NEC {v}</span>
                    {v === version && <span className="text-[10px] text-primary">ACTIVE</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            const isHowTo = href === "/book-method";
            return (
              <Link key={href} href={href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-150 ${
                    active
                      ? "bg-primary/15 border border-primary/40 text-primary"
                      : isHowTo
                      ? "text-amber-400/70 hover:text-amber-400 hover:bg-amber-400/10 border border-transparent hover:border-amber-400/20"
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

        {/* Footer hint */}
        <div className="p-3 border-t border-border">
          <div className="hidden lg:flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="stencil-label">Have your book open</span>
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
