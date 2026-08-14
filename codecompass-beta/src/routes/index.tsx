import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Cpu, ShieldCheck, ArrowRight, Search, ChevronDown, ChevronUp } from "lucide-react";

export const Route = createFileRoute("/")({
  validateSearch: (
    s: Record<string, unknown>,
  ): { q?: string; role?: "apprentice" | "journeyman" | "master"; edition?: string } => {
    try {
      const clean = (v: unknown) => {
        if (!v) return undefined;
        if (Array.isArray(v)) v = v[0];
        const str = String(v).replace(/["']/g, "").trim();
        return str.length > 0 ? str : undefined;
      };

      const rawRole = clean(s.role);
      const role =
        rawRole === "master" ? "master" : rawRole === "journeyman" ? "journeyman" : "apprentice";
      const rawEd = clean(s.edition);
      const edition = rawEd && ["2017", "2020", "2023", "2026"].includes(rawEd) ? rawEd : "2026";
      const q = clean(s.q);

      return { q, role, edition };
    } catch {
      return { q: undefined, role: "apprentice", edition: "2026" };
    }
  },
  head: () => ({
    meta: [
      { title: "Code Compass — Understand the Electrical Code" },
      {
        name: "description",
        content:
          "Code Compass helps apprentices learn book navigation and helps journeymen and master electricians verify NEC questions with clear Gemini-powered citations, stated assumptions, and jobsite verification steps.",
      },
      { property: "og:title", content: "Code Compass — Understand the Electrical Code" },
      {
        property: "og:description",
        content:
          "Gemini-powered NEC guidance for apprentices, journeymen, and master electricians.",
      },
      { property: "og:url", content: "https://www.codecompass.work/" },
    ],
    links: [{ rel: "canonical", href: "https://www.codecompass.work/" }],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"apprentice" | "journeyman" | "master">("apprentice");
  const [edition, setEdition] = useState("2026");
  const [query, setQuery] = useState("");
  const [showBetaTools, setShowBetaTools] = useState(false);

  const handleSearch = () => {
    navigate({
      to: "/study-tools",
      search: { role, edition, q: query.trim() || undefined },
    });
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
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Zap className="h-3.5 w-3.5" />
            Gemini 3.6-Flash Powered NEC Engine
          </div>
          <h1 className="mt-6 font-display text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight">
            Understand the electrical code. Work with more confidence.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-foreground/85 max-w-3xl font-medium leading-relaxed">
            Code Compass helps apprentices learn book navigation and helps journeymen and master
            electricians verify NEC questions with clear Gemini-powered citations, stated
            assumptions, and jobsite verification steps.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSearch}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-ember hover:opacity-90 transition"
            >
              Ask Code Compass
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/practice-test"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3.5 text-sm font-medium hover:bg-secondary transition"
            >
              Take Practice Drill
            </Link>
          </div>
        </div>
      </section>

      {/* ROLE SELECTION & CO-PILOT SEARCH */}
      <section
        aria-labelledby="lookup-heading"
        className="mt-6 rounded-2xl border border-border bg-card/60 p-6 sm:p-8 shadow-sm"
      >
        <h2 id="lookup-heading" className="font-display text-2xl font-semibold">
          Select your role & ask a code question
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose your trade tier so Gemini tailors the guidance and verification steps to your
          workflow.
        </p>

        {/* Role Cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setRole("apprentice")}
            className={`flex flex-col items-start text-left rounded-xl border p-4 transition ${
              role === "apprentice"
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-border bg-background hover:border-border/80"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Apprentice
            </span>
            <span className="mt-1 text-xs sm:text-sm font-medium text-foreground">
              Learn the code, master book navigation, and prepare for licensing.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("journeyman")}
            className={`flex flex-col items-start text-left rounded-xl border p-4 transition ${
              role === "journeyman"
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-border bg-background hover:border-border/80"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Journeyman
            </span>
            <span className="mt-1 text-xs sm:text-sm font-medium text-foreground">
              Rapid code citations, field verification, and jobsite exceptions.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("master")}
            className={`flex flex-col items-start text-left rounded-xl border p-4 transition ${
              role === "master"
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-border bg-background hover:border-border/80"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Master</span>
            <span className="mt-1 text-xs sm:text-sm font-medium text-foreground">
              Advanced compliance, system sizing, and AHJ cross-references.
            </span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="mt-6">
          <div className="rounded-xl border border-border bg-background shadow-sm">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder={
                role === "apprentice"
                  ? "Ask an NEC question (e.g. What is the working space depth for a 120V panel?)..."
                  : role === "journeyman"
                    ? "Enter a jobsite scenario (e.g. Conductor derating for 6 current-carrying wires in 40°C ambient)..."
                    : "Enter a system compliance scenario (e.g. Sizing 400A commercial service conductors or transformer OCPD)..."
              }
              className="w-full resize-none bg-transparent p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 border-t border-border bg-secondary/30">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">Code Edition:</span>
                <select
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                  className="px-3 py-1.5 rounded-md border border-border bg-background text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="2026">NEC 2026</option>
                  <option value="2023">NEC 2023</option>
                  <option value="2020">NEC 2020</option>
                  <option value="2017">NEC 2017</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
              >
                <Search className="h-4 w-4" />
                Ask Code Compass
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EXAM PREP SECTION */}
      <section className="mt-12 rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary">License Track</div>
            <h2 className="mt-2 font-display text-2xl font-semibold">
              Journeyman & Master exam prep
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Timed NEC drills and 25-question practice tests to sharpen trade exam mastery.
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

      {/* NON-PRIMARY BETA / FUTURE TOOLS LOCATION */}
      <section className="mt-12 pt-6 border-t border-border/40">
        <button
          type="button"
          onClick={() => setShowBetaTools(!showBetaTools)}
          className="flex items-center justify-between w-full rounded-xl border border-border/60 bg-card/30 p-4 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <span>Beta / Future Enterprise Modules (PLC Parsing & Compliance)</span>
          {showBetaTools ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showBetaTools && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Link
              to="/plc"
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/50"
            >
              <Cpu className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-foreground">PLC Parser (Beta)</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Upload Rockwell L5X files for ladder logic analysis.
                </div>
              </div>
            </Link>

            <Link
              to="/data-center"
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/50"
            >
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Data Center Compliance (Beta)
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Arc-flash boundary & NFPA 70E compliance workflows.
                </div>
              </div>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
