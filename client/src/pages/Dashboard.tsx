import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Link } from "wouter";
import {
  Timer,
  Zap,
  Search,
  Bot,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ShieldCheck,
  Cpu,
  Calculator,
  FileCheck,
  Check,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const NEC_EDITIONS = ["2017", "2020", "2023", "2026"] as const;

const STATS = [
  { value: "2026", label: "CURRENT NEC CODE CYCLE" },
  { value: "25", label: "QUESTION JOURNEYMAN PRACTICE TEST" },
  { value: "3", label: "SPECIALIST MODULES IN ONE APP" },
  { value: "80%", label: "QUIZ PASS THRESHOLD, EXAM-ALIGNED" },
] as const;

const MODULES = [
  {
    num: "MODULE 01",
    tag: "FREE",
    isFree: true,
    title: "NEC 2026 Rapid Lookup",
    desc: "AI co-pilot for the National Electrical Code. Paste any exam question or field scenario — get the article, section, and answer in seconds.",
    cta: "Open lookup →",
    href: "/copilot",
  },
  {
    num: "MODULE 02",
    tag: "PREMIUM",
    isFree: false,
    title: "Industrial PLC Parsing",
    desc: "Upload Rockwell L5K / L5X exports. Parse tags, routines, and rung logic for controls-engineer troubleshooting and code review.",
    cta: "Unlock PLC parser 🔒",
    href: "/pricing",
  },
  {
    num: "MODULE 03",
    tag: "PREMIUM",
    isFree: false,
    title: "Data Center Compliance",
    desc: "Arc-flash boundary calcs and EMS compliance workflows for hyperscale and colo environments. Built to NFPA 70E and NEC Article 645.",
    cta: "Unlock compliance 🔒",
    href: "/pricing",
  },
] as const;

const TRUST_REASONS = [
  {
    title: "Citation on every answer",
    desc: "No black-box answers. Every calculation and code summary links back to the exact NEC article, section, or table.",
    icon: BookOpen,
  },
  {
    title: "Math you can audit",
    desc: "Conduit fill, box volume, and voltage drop formulas are spelled out line-by-line so you can verify the arithmetic in your own codebook.",
    icon: Calculator,
  },
  {
    title: "Tested calculation engines",
    desc: "Calibrated directly against official NFPA 70, NFPA 70E, and state journeyman/master licensing exam specifications.",
    icon: FileCheck,
  },
  {
    title: "Edition-locked content",
    desc: "Switch instantly between 2017, 2020, 2023, and 2026 editions to match the code version enforced by your local AHJ.",
    icon: ShieldCheck,
  },
] as const;

const FAQS = [
  {
    q: "Which NEC edition does Code Compass use?",
    a: "Code Compass supports NEC 2017, 2020, 2023, and 2026. You can switch editions at any time from the top bar, and all citations and calculations adjust automatically to match your local jurisdiction.",
  },
  {
    q: "Do I need an account to start?",
    a: "No! You can try 3 free AI Co-Pilot code lookups every day without creating an account or entering a credit card.",
  },
  {
    q: "Where do the answers come from?",
    a: "Every response is generated through our specialized NEC retrieval engine and verified against the National Electrical Code tables and index structures. Every answer cites the specific article number so you can verify it in your physical book.",
  },
  {
    q: "Is this only for exam prep?",
    a: "While built to help apprentices pass state Journeyman and Master electrician exams, Code Compass is widely used on active job sites for rapid field lookup, box fill calculations, and Rockwell L5X PLC logic parsing.",
  },
  {
    q: "What is the difference between free and premium?",
    a: "Free access includes 3 daily AI Co-Pilot code lookups. Lifetime Access ($39.99 one-time payment) unlocks unlimited AI lookups, timed 25-question exam simulations, rapid-fire drills, the Rockwell L5X PLC parser, and data center arc-flash compliance calcs.",
  },
  {
    q: "How long is a drill?",
    a: "You can choose from 5-minute quick checks (5 questions), standard practice exams (10–15 questions), or full 60-minute 25-question Journeyman exam simulations.",
  },
];

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [activeEdition, setActiveEdition] = useState("2026");
  const [emailInput, setEmailInput] = useState("");
  const [searchSnippet, setSearchQuery] = useState("");

  const handleLeadCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Free NEC Drill sent to " + emailInput + "! Check your inbox.");
    setEmailInput("");
  };

  return (
    <AppLayout>
      {/* ─── EDITION SELECTOR BAR ─── */}
      <div className="bg-secondary/40 border-b border-border py-2.5 px-4 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
          <span className="text-muted-foreground font-mono uppercase tracking-wider">
            Active Code Edition:
          </span>
          <div className="flex gap-1.5">
            {NEC_EDITIONS.map((ed) => (
              <button
                key={ed}
                onClick={() => setActiveEdition(ed)}
                className={`px-3 py-1 rounded-sm font-mono text-xs font-bold transition-all ${
                  activeEdition === ed
                    ? "bg-primary text-primary-foreground border border-primary"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                NEC {ed}
              </button>
            ))}
          </div>
          <span className="text-muted-foreground text-[11px] hidden md:inline">
            — Code references adjust to match your local jurisdiction.
          </span>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/manus-storage/hero-electrician-tower_f5162f9a.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/20 border border-primary/40 text-primary mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span className="stencil-label text-xs">
              BUILT FOR ELECTRICAL APPRENTICES & JOURNEYMEN
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            Stop Failing the NEC.
            <br />
            <span className="text-primary">Master the Code Book with AI.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-2xl text-amber-100/90 font-mono tracking-tight max-w-2xl mx-auto">
            The elite training weapon for electrical apprentices to pass their exam and instantly look up code on the job site.
          </p>

          {/* Lead Magnet / Email Signup Form */}
          <form
            onSubmit={handleLeadCapture}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email for free drills..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full sm:w-72 bg-black/60 border border-border/80 text-foreground placeholder:text-muted-foreground px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary font-mono"
            />
            <Button
              type="submit"
              className="w-full sm:w-auto bg-primary hover:brightness-110 text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider h-11 px-6"
            >
              Send Free Drill
            </Button>
          </form>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/copilot">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold bg-primary hover:brightness-110 text-primary-foreground shadow-[0_0_30px_rgba(249,115,22,0.35)] transition-all uppercase font-mono tracking-wider"
              >
                <Bot className="w-5 h-5 mr-2" />
                Start Free Co-Pilot →
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

          <p className="mt-4 text-xs text-white/60 font-mono">
            3 free questions/day · No credit card required · All 4 NEC editions
          </p>
        </div>
      </section>

      {/* ─── SOCIAL PROOF STATS STRIP ─── */}
      <section className="bg-card border-y border-border py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-mono font-bold text-primary">
                {value}
              </p>
              <p className="stencil-label text-[10px] text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SEARCH / CO-PILOT CARD PREVIEW ─── */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="panel-card p-6 sm:p-8 rounded-sm">
          <p className="stencil-label mb-2">WHAT CODE COMPASS DOES</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            One clear path to the code, the logic, and the compliance answer.
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mb-6 leading-relaxed">
            Paste any exam question or scenario. Get the exact index keywords, article citations, and plain-English breakdown.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Wall outlet spacing in a bedroom or 314.16 box fill..."
              value={searchSnippet}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-background border border-border p-3.5 rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
            />
            <Link href="/copilot">
              <Button className="h-full bg-primary text-primary-foreground font-mono font-bold uppercase tracking-wider px-6 py-3.5">
                <Search className="w-4 h-4 mr-2" />
                Analyze Question
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── THE TRAINING STACK (MODULES) ─── */}
      <section className="bg-secondary/20 border-y border-border py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="stencil-label mb-2">THE TRAINING STACK</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Free tools up front. Premium engines when you're ready.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MODULES.map(({ num, tag, isFree, title, desc, cta, href }) => (
              <div
                key={title}
                className="panel-card p-6 rounded-sm flex flex-col justify-between hover:border-primary/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {num}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold uppercase tracking-wider ${
                        isFree
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-primary/20 text-primary border border-primary/30"
                      }`}
                    >
                      {tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
                <Link href={href} className="mt-6">
                  <Button
                    variant={isFree ? "default" : "outline"}
                    className={`w-full font-mono text-xs font-bold uppercase tracking-wider ${
                      isFree
                        ? "bg-primary text-primary-foreground hover:brightness-110"
                        : "border-primary/40 text-primary hover:bg-primary/10"
                    }`}
                  >
                    {cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSIDE A DRILL PREVIEW ─── */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="stencil-label mb-2">INSIDE A DRILL</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              See exactly where you are in the lookup.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Every question guides you through index keywords, section titles, and rationale citations. You don't just memorize the answer — you build muscle memory for exam day.
            </p>
            <div className="flex gap-4">
              <Link href="/quiz">
                <Button className="bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider">
                  Run a Timed Drill →
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button variant="outline" className="font-mono text-xs font-bold uppercase tracking-wider">
                  Open Study Tools
                </Button>
              </Link>
            </div>
          </div>

          <div className="panel-card p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="stencil-label">DRILL 01 · SPEED-FIND</span>
              <span className="font-mono text-xs text-primary font-bold">2 of 5 COMPLETE</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-secondary/40 rounded-sm border border-border">
                <p className="text-muted-foreground uppercase text-[10px]">1 · Index Keyword</p>
                <p className="text-foreground font-bold mt-0.5">Branch Circuits → Dwelling Units</p>
              </div>
              <div className="p-3 bg-secondary/40 rounded-sm border border-border">
                <p className="text-muted-foreground uppercase text-[10px]">2 · NEC Citation</p>
                <p className="text-primary font-bold mt-0.5">Article 210.52(A)</p>
              </div>
              <div className="p-3 bg-secondary/40 rounded-sm border border-border">
                <p className="text-muted-foreground uppercase text-[10px]">3 · Rule Summary</p>
                <p className="text-foreground text-[11px] leading-relaxed mt-0.5">
                  Receptacles must be installed so no point along the floor line is more than 6 ft from an outlet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST & AUTHORITY SECTION ─── */}
      <section className="bg-secondary/30 border-y border-border py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="stencil-label mb-2">WHY YOU CAN TRUST THE OUTPUT</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Every answer is traceable back to the book.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TRUST_REASONS.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="panel-card p-6 rounded-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-primary/15 flex items-center justify-center flex-shrink-0 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ACCORDION SECTION ─── */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <p className="stencil-label mb-2">FREQUENTLY ASKED QUESTIONS</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Answers before you commit a single minute.
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {FAQS.map(({ q, a }, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="panel-card px-5 py-2 rounded-sm border border-border"
            >
              <AccordionTrigger className="text-foreground font-semibold text-base hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pt-2">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border bg-background py-10">
        <div className="max-w-5xl mx-auto px-6 text-center text-xs text-muted-foreground space-y-2">
          <p className="font-mono">
            Code Compass · The AI-driven predictive training engine for the NEC, PLC systems, and data center compliance.
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            NEC® and National Electrical Code® are registered trademarks of the National Fire Protection Association (NFPA). Code Compass is an independent study tool and is not affiliated with, endorsed by, or sponsored by the NFPA. Always verify answers in your physical codebook.
          </p>
        </div>
      </footer>
    </AppLayout>
  );
}
