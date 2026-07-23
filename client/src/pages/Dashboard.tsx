/**
 * Code Compass — Welcome / Landing Page
 * Minimalist. Full-bleed hero image. Single CTA above the fold.
 * Light default. Method + modes below the fold.
 */
import AppLayout from "@/components/AppLayout";
import { Link } from "wouter";
import { Timer, Zap, Search, Bot, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const MODES = [
  {
    href: "/exam",
    title: "Exam Mode",
    subtitle: "Timed, scored practice. Mirrors the real test.",
    icon: Timer,
    badge: "Paid",
  },
  {
    href: "/quiz",
    title: "Quick Drill",
    subtitle: "Rapid-fire questions. Build speed and confidence.",
    icon: Zap,
    badge: "Paid",
  },
  {
    href: "/search",
    title: "Code Lookup",
    subtitle: "Search by keyword. Jump straight to the article.",
    icon: Search,
    badge: "Paid",
  },
] as const;

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <AppLayout>
      {/* ─── HERO — full-bleed image ─── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/manus-storage/hero-electrician-tower_f5162f9a.jpg')",
          }}
        />
        {/* Dark overlay — enough to make white text legible, not enough to kill the photo */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Hero content — centered, minimal */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-xs font-mono tracking-[0.2em] text-amber-400/90 uppercase mb-5">
            Unofficial NEC Study Tool · 2017 / 2020 / 2023 / 2026
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            Find any NEC
            <br />
            answer fast.
          </h1>

          <p className="mt-5 text-xl sm:text-2xl font-mono text-amber-400 tracking-tight">
            Question → keyword → article → answer.
          </p>

          <p className="mt-5 text-white/75 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            The exact method journeyman and master electricians use — on the
            exam and on the job.
          </p>

          {/* Single primary CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/copilot">
              <Button
                size="lg"
                className="h-14 px-10 text-base font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_40px_rgba(245,158,11,0.35)] transition-all"
              >
                <Bot className="w-5 h-5 mr-2" />
                Start Free — Ask the Co-Pilot
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            {!loading && !isAuthenticated && (
              <a href={getLoginUrl()}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur"
                >
                  Sign in
                </Button>
              </a>
            )}
          </div>

          <p className="mt-4 text-xs text-white/50 font-mono">
            3 free questions/day · No card required
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce">
          <div className="w-px h-8 bg-white/30 rounded-full" />
        </div>
      </section>

      {/* ─── METHOD STRIP ─── */}
      <section className="bg-background border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-14 text-center">
          <p className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase mb-2">
            The Method
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-10">
            How every answer is found in the book
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {(
              [
                {
                  step: "01",
                  label: "Question",
                  note: "Read what's actually being asked.",
                },
                {
                  step: "02",
                  label: "Index Keyword",
                  note: "Spot the word to look up.",
                },
                {
                  step: "03",
                  label: "Article / Table",
                  note: "Navigate straight to it.",
                },
                {
                  step: "04",
                  label: "Answer",
                  note: "Pull the answer from the book.",
                },
              ] as const
            ).map(({ step, label, note }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center gap-2"
              >
                <span className="text-4xl font-bold text-amber-500/20 font-mono leading-none">
                  {step}
                </span>
                <h3 className="font-semibold text-foreground text-sm">
                  {label}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CO-PILOT FEATURE CARD ─── */}
      <section className="bg-background">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <Link href="/copilot">
            <div className="group relative rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-500/5 p-8 hover:border-amber-500/60 transition-all duration-200 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-14 h-14 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-7 h-7 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">
                    AI Co-Pilot
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed max-w-lg">
                    Paste any NEC question. The Co-Pilot walks you through the
                    index keyword, the article, and the answer — so you learn to
                    find it yourself next time.
                  </p>
                  <p className="text-xs text-amber-600 font-mono mt-2 font-semibold">
                    3 FREE questions/day · Unlimited with Lifetime Access
                    ($39.99)
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── 3 PRACTICE MODES ─── */}
      <section className="bg-muted/40 border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="text-xs font-mono tracking-[0.2em] text-muted-foreground uppercase mb-2 text-center">
            Practice Modes
          </p>
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Unlock with Lifetime Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {MODES.map(({ href, title, subtitle, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className="group bg-background rounded-xl border border-border p-6 h-full hover:border-amber-500/40 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      LIFETIME
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-base">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {subtitle}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-amber-600 font-medium group-hover:gap-2 transition-all">
                    <span>Get access</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8">
                Get Lifetime Access — $39.99
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-2">
              One-time payment. No subscription. Ever.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FREE NEC ACCESS + FOOTER ─── */}
      <section className="bg-background border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start gap-4">
          <BookOpen className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Don't own the code book yet?
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              NFPA offers free read-only access to NFPA 70 (NEC) online.{" "}
              <a
                href="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 underline underline-offset-2"
              >
                Get free access at NFPA.org
              </a>{" "}
              — then use Code Compass to navigate it faster.
            </p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 pb-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            Unofficial study tool — not affiliated with NFPA. Always verify
            answers with your code book.
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
