import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Zap, BookOpen, Search, ShieldAlert, AlertTriangle, ShieldCheck } from "lucide-react";

export type RoleType = "apprentice" | "journeyman" | "master";

type LookupResult = {
  answer: string;
  assumptions: string[];
  verification_notes: string[];
  role: RoleType;
  edition: string;
  model: string;
  request_id: string;
};

export const Route = createFileRoute("/study-tools")({
  validateSearch: (
    s: Record<string, unknown>,
  ): { q?: string; role?: RoleType; edition?: string } => {
    try {
      const clean = (v: unknown) => {
        if (!v) return undefined;
        if (Array.isArray(v)) v = v[0];
        const str = String(v).replace(/["']/g, "").trim();
        return str.length > 0 ? str : undefined;
      };

      const rawRole = clean(s.role);
      const role = (
        rawRole === "master" ? "master" : rawRole === "journeyman" ? "journeyman" : "apprentice"
      ) as RoleType;
      const rawEd = clean(s.edition);
      const edition = rawEd && ["2017", "2020", "2023", "2026"].includes(rawEd) ? rawEd : "2026";
      const q = clean(s.q);

      return { q, role, edition };
    } catch {
      return { q: undefined, role: "apprentice", edition: "2026" };
    }
  },
  head: () => {
    const title = "Ask Code Compass — Gemini NEC Guidance";
    const description =
      "Gemini-powered NEC guidance for apprentices, journeymen, and master electricians.";
    const url = "https://www.codecompass.work/study-tools";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CoPilot,
});

const ROLE_OPTIONS: { value: RoleType; title: string; subtext: string }[] = [
  {
    value: "apprentice",
    title: "Apprentice",
    subtext: "Learn the code, master book navigation, and prepare for licensing.",
  },
  {
    value: "journeyman",
    title: "Journeyman",
    subtext: "Rapid code citations, field verification, and jobsite exceptions.",
  },
  {
    value: "master",
    title: "Master",
    subtext: "Advanced compliance, system sizing, and AHJ cross-references.",
  },
];

function CoPilot() {
  const search = Route.useSearch();
  const [role, setRole] = useState<RoleType>(search.role || "apprentice");
  const [edition, setEdition] = useState<string>(search.edition || "2026");
  const [query, setQuery] = useState<string>(search.q || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);

  const sendLookup = async (qText?: string, targetRole?: RoleType) => {
    const activeQuery = (qText !== undefined ? qText : query).trim();
    if (!activeQuery) return;

    // Check search limit for guest/unpaid users
    if (typeof window !== "undefined") {
      const isPaid = localStorage.getItem("cc_pro_subscriber") === "true";
      const currentCount = parseInt(localStorage.getItem("cc_search_count") || "0", 10);
      if (!isPaid && currentCount >= 3) {
        setShowPaywall(true);
        return;
      }
    }

    const activeRole = targetRole || role;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/nec-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQuery,
          role: activeRole,
          edition: edition,
        }),
      });

      if (!res.ok) {
        throw new Error(`Lookup failed with HTTP status ${res.status}`);
      }

      const data: LookupResult = await res.json();
      setResult(data);

      if (typeof window !== "undefined") {
        const isPaid = localStorage.getItem("cc_pro_subscriber") === "true";
        if (!isPaid) {
          const currentCount = parseInt(localStorage.getItem("cc_search_count") || "0", 10);
          localStorage.setItem("cc_search_count", (currentCount + 1).toString());
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.q && search.q.trim()) {
      sendLookup(search.q, search.role);
    }
  }, [search.q]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background px-5 py-12">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black sm:text-4xl">Ask Code Compass</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Clear Gemini 3.6-Flash powered NEC explanations with trade-specific citations,
            assumptions, and verification steps.
          </p>
        </div>

        {/* ROLE SELECTION & QUERY FORM */}
        <div className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border">
          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Select Your Role
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  className={`flex flex-col text-left rounded-xl border p-3.5 transition ${
                    role === opt.value
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border bg-background hover:border-border/80"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {opt.title}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">{opt.subtext}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="mb-4">
            <label htmlFor="copilot-input" className="sr-only">
              NEC Question
            </label>
            <textarea
              id="copilot-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                role === "apprentice"
                  ? "Ask an NEC question (e.g. What is the working space depth for 120V equipment?)..."
                  : role === "journeyman"
                    ? "Enter a jobsite question (e.g. Conductor ampacity derating for 6 current-carrying wires in 40°C ambient)..."
                    : "Enter a system compliance question (e.g. Sizing 400A commercial service conductors or transformer OCPD)..."
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-border bg-background p-3.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Edition:</span>
              <select
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="2026">NEC 2026</option>
                <option value="2023">NEC 2023</option>
                <option value="2020">NEC 2020</option>
                <option value="2017">NEC 2017</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => sendLookup()}
              disabled={loading || !query.trim()}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
              {loading ? "Analyzing..." : "Ask Code Compass"}
            </button>
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="mt-6 rounded-2xl border border-destructive/50 bg-destructive/10 p-5 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* RESPONSE DISPLAY */}
        {result && (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border space-y-5">
              {/* Answer Label */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  {result.role === "apprentice" ? (
                    <>
                      <BookOpen className="h-4 w-4" />
                      Apprentice Navigation & Study
                    </>
                  ) : result.role === "master" ? (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Master Code Compliance
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Journeyman Field Verification
                    </>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">NEC {result.edition} Edition</span>
              </div>

              {/* Main Answer Text */}
              <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {result.answer}
              </div>

              {/* ASSUMPTIONS & VERIFICATION NOTES */}
              {result.role === "journeyman" || result.role === "master" ? (
                /* Journeyman & Master: Rapid Field Verification & Exceptions */
                <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
                    <AlertTriangle className="h-4 w-4" />
                    Field Verification & Jobsite Exceptions
                  </div>

                  {result.assumptions.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        Stated Assumptions:
                      </div>
                      <ul className="mt-1 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                        {result.assumptions.map((a, idx) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.verification_notes.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-foreground">
                        Verification Checkpoints:
                      </div>
                      <ul className="mt-1 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                        {result.verification_notes.map((v, idx) => (
                          <li key={idx}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                /* Apprentice Presentation: Book Navigation & Learning Notes */
                <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
                  {result.assumptions.length > 0 && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-primary">
                        Working Assumptions:
                      </div>
                      <ul className="mt-1 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                        {result.assumptions.map((a, idx) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.verification_notes.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary">
                        Book Navigation & Verification Notes:
                      </div>
                      <ul className="mt-1 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                        {result.verification_notes.map((v, idx) => (
                          <li key={idx}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* SAFETY DISCLAIMER */}
              <div className="rounded-xl border border-border bg-background/50 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p>
                  <strong>Safety Notice:</strong> Code Compass is educational decision support—not
                  code enforcement or engineering approval. Verify the currently adopted NEC
                  edition, local amendments, site conditions, employer procedures, and requirements
                  of the authority having jurisdiction.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PAYWALL MODAL */}
        {showPaywall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="max-w-md w-full rounded-2xl border border-amber-500/40 bg-card p-6 shadow-2xl text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 font-bold text-xl">
                ⚡
              </div>
              <h2 className="font-display text-2xl font-bold">
                You've reached your free search limit
              </h2>
              <p className="text-sm text-muted-foreground">
                You've used all 3 free guest AI searches. Become a Founding Member for unlimited
                Gemini-powered NEC searches, practice test drills, and PLC tools.
              </p>
              <div className="pt-2">
                <a
                  href="https://buy.stripe.com/7sYeVd6waag23eygKZ3sI02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-6 py-3.5 text-base font-bold text-black shadow-lg transition"
                >
                  Founding Member - $1.99
                </a>
              </div>
              <button
                onClick={() => setShowPaywall(false)}
                className="text-xs text-muted-foreground hover:text-foreground pt-1"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
