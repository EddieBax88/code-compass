import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/study-tools")({
  head: () => {
    const title = "AI Co-Pilot — Code Compass";
    const description =
      "Ask the Code Compass AI Co-Pilot any NEC exam question and get a fast, cited answer.";
    const url = "https://codecompass-beta.lovable.app/study-tools";
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

const SUGGESTIONS = [
  "Wall outlet spacing in a living room",
  "Working space depth for 120/240V panel",
  "GFCI required in residential bathroom",
  "Vertical clearance over a driveway",
  "Wire gauge for a 20-amp circuit",
  "Bonding requirements for metal water pipe",
];

function CoPilot() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setResponse(
        typeof data === "string" ? data : (data.text ?? data.message ?? JSON.stringify(data)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background px-5 py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="w-full rounded-2xl bg-card p-6 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-border">
          <label htmlFor="copilot-input" className="sr-only">
            Exam question
          </label>
          <textarea
            id="copilot-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste your exam question here..."
            rows={5}
            className="w-full resize-none border-0 bg-transparent p-2 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          />
          <button
            type="button"
            onClick={send}
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            <Zap className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {(response || error) && (
          <div className="mt-6 w-full rounded-2xl bg-card p-6 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-border">
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
                {response}
              </p>
            )}
          </div>
        )}

        <div className="mt-10 w-full">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Suggested keywords
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground transition hover:bg-secondary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
