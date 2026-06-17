import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { nanoid } from "nanoid";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Search,
  BookOpen,
  Zap,
  ChevronRight,
  Loader2,
  Lightbulb,
  MapPin,
  FileText,
  ArrowRight,
  Lock,
} from "lucide-react";
import AppLayout from "../components/AppLayout";

/** Stable anonymous device id used to track free daily usage before login. */
function getClientId(): string {
  const KEY = "cc_client_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = nanoid();
    localStorage.setItem(KEY, id);
  }
  return id;
}

type AnalysisResult = {
  keywords: string[];
  indexDrilldown: Array<{ level: number; entry: string; description: string }>;
  article: string;
  articleTitle: string;
  lookupSteps: string[];
  answer: string;
  examTip: string;
  necVersion: string;
};

const NEC_VERSIONS = ["2026", "2023", "2020", "2017"] as const;
type NecVersion = (typeof NEC_VERSIONS)[number];

export default function CoPilot() {
  const [, navigate] = useLocation();

  const [question, setQuestion] = useState("");
  const [necVersion, setNecVersion] = useState<NecVersion>("2026");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedDrilldownLevel, setSelectedDrilldownLevel] = useState<number | null>(null);
  const [clientId] = useState(() => getClientId());
  const [limitReached, setLimitReached] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const utils = trpc.useUtils();

  const { data: suggestions = [] } = trpc.copilot.suggestedQuestions.useQuery();
  const { data: usage } = trpc.copilot.usageStatus.useQuery({ clientId });

  const analyze = trpc.copilot.analyze.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setSelectedDrilldownLevel(null);
      utils.copilot.usageStatus.invalidate({ clientId });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (err) => {
      if (err.message?.includes("LIMIT_REACHED")) {
        setLimitReached(true);
        return;
      }
      toast.error(err.message || "Analysis failed. Try again.");
    },
  });

  const handleSubmit = () => {
    if (!question.trim()) {
      toast.error("Paste an exam question first.");
      return;
    }
    if (usage && !usage.unlimited && usage.remaining <= 0) {
      setLimitReached(true);
      return;
    }
    setResult(null);
    analyze.mutate({ question: question.trim(), necVersion, clientId });
  };

  const handleSuggestion = (s: string) => {
    setQuestion(s);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [question]);

  return (
    <AppLayout>
      {/* Upgrade prompt modal */}
      {limitReached && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card border border-border rounded-lg max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">You're out of free questions today</h3>
            <p className="text-sm text-muted-foreground mb-5">
              You get {usage?.limit ?? 3} free Co-Pilot questions per day. Upgrade to Pro for unlimited
              access to every NEC lookup.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded mb-2 hover:opacity-90 transition-opacity"
            >
              See Pro Plans
            </button>
            <button
              onClick={() => setLimitReached(false)}
              className="w-full text-muted-foreground text-sm py-2 hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
      {/* Page heading + NEC version selector */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Code Co-Pilot</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">NEC</span>
          <div className="flex gap-1">
            {NEC_VERSIONS.map((v) => (
              <button
                key={v}
                onClick={() => setNecVersion(v)}
                className={`text-xs px-2 py-0.5 rounded font-mono font-semibold transition-all ${
                  necVersion === v
                    ? "bg-green-500 text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-6 overflow-y-auto">
        {!result ? (
          <>
            {/* Input Feed Card */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">INPUT FEED</span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste your exam question here..."
                  className="w-full bg-transparent text-foreground placeholder-muted-foreground resize-none focus:outline-none text-sm leading-relaxed"
                  rows={3}
                />
                <button
                  onClick={handleSubmit}
                  disabled={analyze.isPending || !question.trim()}
                  className="mt-4 w-full bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-2 rounded transition-opacity flex items-center justify-center gap-2"
                >
                  {analyze.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
              {/* Usage counter */}
              {usage && !usage.unlimited && (
                <div className="mt-3 text-center text-xs text-muted-foreground">
                  {usage.remaining > 0 ? (
                    <span>
                      {usage.remaining} of {usage.limit} free questions left today ·{" "}
                      <button onClick={() => navigate("/pricing")} className="text-primary hover:underline">
                        Go unlimited
                      </button>
                    </span>
                  ) : (
                    <span>
                      Daily free limit reached ·{" "}
                      <button onClick={() => navigate("/pricing")} className="text-primary hover:underline">
                        Upgrade to Pro
                      </button>
                    </span>
                  )}
                </div>
              )}
              {usage?.unlimited && (
                <div className="mt-3 text-center text-xs text-primary">Pro · Unlimited questions</div>
              )}
            </div>

            {/* Suggested Keywords */}
            {suggestions.length > 0 && (
              <div className="max-w-2xl mx-auto mb-8">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">SUGGESTED KEYWORDS</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(s)}
                      className="px-3 py-1 bg-card border border-border hover:border-primary rounded-full text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground italic">READY FOR NAVIGATION INPUT</p>
            </div>
          </>
        ) : (
          <>
            {/* Results Panel */}
            <div className="max-w-4xl mx-auto">
              {/* Drill-down Index Tree */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">NEC Index Lookup Path</span>
                </div>

                {result.indexDrilldown.length > 0 ? (
                  <div className="space-y-3">
                    {result.indexDrilldown.map((level, idx) => (
                      <div key={idx}>
                        <button
                          onClick={() =>
                            setSelectedDrilldownLevel(
                              selectedDrilldownLevel === level.level ? null : level.level
                            )
                          }
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${
                            selectedDrilldownLevel === level.level
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-background border-border text-foreground hover:border-primary"
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold uppercase opacity-70">
                              Step {level.level}
                            </div>
                            <div className="font-semibold">{level.entry}</div>
                            <div className="text-xs mt-1 opacity-70">{level.description}</div>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              selectedDrilldownLevel === level.level ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                        {idx < result.indexDrilldown.length - 1 && (
                          <div className="flex justify-center py-2">
                            <ArrowRight className="w-4 h-4 text-primary rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Article Citation */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Article Citation</span>
                </div>
                <div className="text-2xl font-bold text-primary mb-2">{result.article}</div>
                <div className="text-foreground/80">{result.articleTitle}</div>
              </div>

              {/* Answer */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Answer</span>
                </div>
                <p className="text-foreground/90 leading-relaxed">{result.answer}</p>
              </div>

              {/* Exam Tip */}
              {result.examTip && (
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Exam Tip</span>
                  </div>
                  <p className="text-foreground/90 leading-relaxed italic">{result.examTip}</p>
                </div>
              )}

              {/* Ask Another */}
              <button
                onClick={() => {
                  setResult(null);
                  setQuestion("");
                }}
                className="w-full px-4 py-3 bg-card border border-border hover:border-primary text-muted-foreground hover:text-primary rounded-lg transition-colors font-semibold"
              >
                Ask Another Question
              </button>
            </div>
          </>
        )}
      </div>

    </AppLayout>
  );
}
