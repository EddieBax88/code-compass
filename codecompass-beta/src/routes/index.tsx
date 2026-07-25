import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Cpu, ShieldCheck, ArrowRight, Search, BookOpen, MessageCircle, Calculator } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Code Compass - NEC Exam Prep" },
      {
        name: "description",
        content:
          "Automating NEC Compliance and PLC Logic Translation for Active Data Centers. Elite training for electrical professionals.",
      },
      { property: "og:title", content: "Code Compass - NEC Exam Prep" },
      {
        property: "og:description",
        content:
          "Elite training weapon for electrical apprentices. NEC 2026 rapid lookup, PLC parsing, and data-center compliance.",
      },
      { property: "og:url", content: "https://codecompass-beta.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://codecompass-beta.lovable.app/" }],
  }),
  component: Home,
});

type ModuleCard = {
  to: "/study-tools" | "/plc" | "/data-center";
  kicker: string;
  title: string;
  desc: string;
  Icon: typeof Zap;
  cta: string;
  tier: "FREE" | "PREMIUM";
};

const MODULES: ModuleCard[] = [
  {
    to: "/study-tools",
    kicker: "Module 01 · Free",
    title: "NEC 2026 Rapid Lookup",
    desc: "AI co-pilot for the National Electrical Code. Paste any exam question or field scenario — get the article, section, and answer in seconds.",
    Icon: Zap,
    cta: "Open lookup",
    tier: "FREE",
  },
  {
    to: "/plc",
    kicker: "Module 02 · Premium",
    title: "Industrial PLC Parsing",
    desc: "Upload Rockwell L5K / L5X exports. Parse tags, routines, and rung logic for controls-engineer troubleshooting and code review.",
    Icon: Cpu,
    cta: "Open PLC parser",
    tier: "PREMIUM",
  },
  {
    to: "/data-center",
    kicker: "Module 03 · Premium",
    title: "Data Center Compliance",
    desc: "Arc-flash boundary calcs and EMS compliance workflows for hyperscale and colo environments. Built to NFPA 70E and NEC Article 645.",
    Icon: ShieldCheck,
    cta: "Open compliance",
    tier: "PREMIUM",
  },
];

const MODULE_02 = MODULES.find((m) => m.kicker.includes("Module 02"))!;
const MODULE_03 = MODULES.find((m) => m.kicker.includes("Module 03"))!;

function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"book" | "quick" | "uglys">("book");
  const [edition, setEdition] = useState("2026");
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      navigate({
        to: "/study-tools",
        search: { mode, edition, q: query }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24">
      {/* HERO */}
      <section className="relative pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="max-w-4xl">
          <h1 className="mt-6 font-display text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight">
            Automating NEC Compliance and PLC Logic Translation for Active Data Centers.
          </h1>
          <p className="mt-6 text-lg sm:text-2xl text-foreground/85 max-w-3xl font-medium">
            The elite training weapon for electrical apprentices to pass their exam and instantly
            look up code on the job site.
          </p>
          <Link
            to="/study-tools"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition"
          >
            <Zap className="h-3.5 w-3.5 text-primary" />
            Open NEC Co-Pilot
          </Link>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section
        aria-labelledby="what"
        className="mt-10 rounded-2xl border border-border bg-card/40 p-6 sm:p-8"
      >
        <div className="text-[10px] uppercase tracking-[0.2em] text-accent">
          What Code Compass does
        </div>
        <h2 id="what" className="mt-2 font-display text-2xl sm:text-3xl font-semibold">
          One clear path to the code, the logic, and the compliance answer.
        </h2>
        
        {/* Search Bar */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="rounded-xl border border-border bg-background shadow-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question or paste an NEC scenario..."
              className="w-full px-5 py-4 text-base bg-transparent border-0 focus:outline-none focus:ring-0"
            />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3 border-t border-border bg-secondary/30">
              <div className="flex flex-wrap items-center gap-3">
                {/* Mode Toggle */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMode("book")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                      mode === "book"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Book Lookup
                  </button>
                  <button
                    onClick={() => setMode("quick")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                      mode === "quick"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Quick Answer
                  </button>
                  <button
                    onClick={() => setMode("uglys")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                      mode === "uglys"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Calculator className="h-4 w-4" />
                    Ugly's Reference
                  </button>
                </div>
                
                {/* Edition Dropdown */}
                <select
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                  className="px-3 py-1.5 rounded-md border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="2026">NEC 2026</option>
                  <option value="2023">NEC 2023</option>
                  <option value="2020">NEC 2020</option>
                  <option value="2017">NEC 2017</option>
                </select>
              </div>
              
              {/* Submit Button */}
              <button
                onClick={handleSearch}
                disabled={!query.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 02 — PLC */}
      <ModuleCard {...MODULE_02} />

      {/* EXAM PREP */}
      <section className="mt-14 rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary">
              Sharpen your license track
            </div>
            <h2 className="mt-2 font-display text-2xl font-semibold">Journeyman exam prep</h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Timed NEC drills and a full 25-question practice test. Read the answer, keep moving.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/practice-test"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90"
            >
              25-question practice test
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/exam-prep"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Timed drills
            </Link>
          </div>
        </div>
      </section>

      {/* MODULE 03 — Data Center */}
      <ModuleCard {...MODULE_03} />
    </main>
  );
}

function ModuleCard({ to, kicker, title, desc, Icon, cta, tier }: ModuleCard) {
  return (
    <section aria-labelledby="modules" className="mt-14">
      <Link
        to={to}
        className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-primary/60 hover:shadow-ember sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent">{kicker}</span>
              <span
                className={
                  tier === "FREE"
                    ? "rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary"
                    : "rounded-full border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground"
                }
              >
                {tier}
              </span>
            </div>
            <h3 className="mt-1 font-display text-xl sm:text-2xl font-semibold leading-tight">
              {title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary sm:pl-4">
          {cta}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </Link>
    </section>
  );
}
