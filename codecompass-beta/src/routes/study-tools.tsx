import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Zap, BookOpen, ShieldAlert } from "lucide-react";
import { FoundingMemberModal } from "@/components/FoundingMemberModal";
import { supabase } from "@/integrations/supabase/client";

type LookupResult = {
  answer: string;
  edition: string;
  model: string;
  request_id: string;
};

export const Route = createFileRoute("/study-tools")({
  validateSearch: (s: Record<string, unknown>): { q?: string; edition?: string } => {
    try {
      const clean = (v: unknown) => {
        if (!v) return undefined;
        if (Array.isArray(v)) v = v[0];
        const str = String(v).replace(/["']/g, "").trim();
        return str.length > 0 ? str : undefined;
      };

      const rawEd = clean(s.edition);
      const edition = rawEd && ["2017", "2020", "2023", "2026"].includes(rawEd) ? rawEd : "2026";
      const q = clean(s.q);

      return { q, edition };
    } catch {
      return { q: undefined, edition: "2026" };
    }
  },
  head: () => {
    const title = "NEC Code Co-Pilot — Code Compass";
    const description =
      "Ask the Code Compass NEC Code Co-Pilot any question and work it out through the 4-Step Code Compass Method.";
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

function CoPilot() {
  const search = Route.useSearch();
  const [edition, setEdition] = useState<string>(search.edition || "2026");
  const [query, setQuery] = useState<string>(search.q || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);

  const sendLookup = async (qText?: string) => {
    const activeQuery = (qText !== undefined ? qText : query).trim();
    if (!activeQuery) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }

      const res = await fetch("/api/nec-lookup", {
        method: "POST",
        headers,
        body: JSON.stringify({
          question: activeQuery,
          edition: edition,
        }),
      });

      if (res.status === 402) {
        setShowPaywall(true);
        setError("Code Compass Pro access required for additional searches.");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.error === "founding_member_required") {
          setShowPaywall(true);
          setError("Code Compass Pro access required for additional searches.");
          return;
        }
        throw new Error(`Lookup failed with HTTP status ${res.status}`);
      }

      const data: LookupResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.q && search.q.trim()) {
      sendLookup(search.q);
    }
  }, [search.q]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background px-5 py-12">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black sm:text-4xl">NEC Code Co-Pilot</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Work through any NEC question with the 4-Step Code Compass Method: Classify, Keywords,
            Article, and Verify.
          </p>
        </div>

        {/* QUERY FORM */}
        <div className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border">
          {/* Text Area */}
          <div className="mb-4">
            <label htmlFor="copilot-input" className="sr-only">
              NEC Question
            </label>
            <textarea
              id="copilot-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question or paste an NEC scenario..."
              rows={4}
              className="w-full resize-none rounded-xl border border-border bg-background p-3.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Edition Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">NEC Edition:</span>
              <select
                aria-label="Select NEC Edition"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="2026">NEC 2026</option>
                <option value="2023">NEC 2023</option>
                <option value="2020">NEC 2020</option>
                <option value="2017">NEC 2017</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full sm:w-auto items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setQuery(
                    "What is the minimum burial depth for direct burial cables under a residential driveway?",
                  )
                }
                className="text-xs text-primary hover:underline"
              >
                Try example
              </button>
              <button
                onClick={() => sendLookup()}
                disabled={loading || !query.trim()}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-ember hover:opacity-90 disabled:opacity-50 transition"
              >
                <Zap className="h-4 w-4" />
                {loading ? "Searching..." : "Ask Co-Pilot"}
              </button>
            </div>
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
            <p className="text-sm font-medium text-foreground">
              Working through the 4-Step Code Compass Method...
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Classifying bucket & finding index keywords
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* RESULT CARD */}
        {result && !loading && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-display font-bold text-foreground">
                    Code Compass Method Lookup (NEC {result.edition})
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{result.model}</span>
              </div>

              {/* Formatted Answer */}
              <div className="whitespace-pre-line text-sm leading-relaxed text-foreground font-sans">
                {result.answer}
              </div>

              {/* Verification Callout */}
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
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
        <FoundingMemberModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          title="You've reached your free search limit"
          description="You've used your 1 free AI question. Upgrade to Code Compass Pro for unlimited Gemini-powered NEC searches, practice test drills, and PLC tools."
        />
      </div>
    </main>
  );
}
