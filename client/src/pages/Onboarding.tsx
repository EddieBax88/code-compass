/**
 * Code Compass — "How to Use Your Book" Onboarding Module
 * Design: Industrial Control Panel — near-black bg, amber/orange accents, JetBrains Mono for code refs
 *
 * 4-step interactive flow teaching NEC index navigation:
 *   Step 1: Read the exam question → identify the key lookup word
 *   Step 2: Open the NEC index → find the keyword
 *   Step 3: Navigate to the article/table number shown
 *   Step 4: Read the table → select the correct answer
 *
 * Completion stored in localStorage under "cc_onboarding_complete"
 * TO SWAP IN SUPABASE: Replace the localStorage.setItem call in handleComplete()
 * with: await supabase.from('users').update({ onboarding_complete: true }).eq('id', userId)
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import {
  BookOpen,
  Search,
  Navigation,
  CheckCircle2,
  ChevronRight,
  SkipForward,
  Zap,
  ArrowRight,
} from "lucide-react";

// ─── Sample question used throughout the walkthrough ───────────────────────
const SAMPLE_QUESTION = {
  text: "What is the minimum ampacity of a branch-circuit conductor supplying a single 20-ampere receptacle?",
  keywords: ["branch-circuit", "conductor", "ampacity", "receptacle"],
  primaryKeyword: "Branch-circuit conductors",
  indexEntry: {
    term: "Branch-circuit conductors",
    subEntries: [
      { label: "Ampacity", page: "210.19(A)" },
      { label: "General", page: "210.19" },
      { label: "Minimum size", page: "Table 310.16" },
    ],
    targetArticle: "210.19(A)(1)",
  },
  articleSummary:
    "Article 210.19(A)(1) — The ampacity of branch-circuit conductors shall not be less than the maximum load to be served. For a 20-ampere receptacle, the conductor must be rated for at least 20 amperes.",
  correctAnswer: "20 amperes",
  answerExplanation:
    "A conductor supplying a single receptacle must have an ampacity not less than the rating of the receptacle. A 20A receptacle requires a 20A conductor.",
};

// ─── Step definitions ───────────────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    icon: BookOpen,
    label: "Read the Question",
    shortLabel: "Read",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
  },
  {
    id: 2,
    icon: Search,
    label: "Find the Index Word",
    shortLabel: "Index",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30",
  },
  {
    id: 3,
    icon: Navigation,
    label: "Navigate to the Article",
    shortLabel: "Navigate",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
  },
  {
    id: 4,
    icon: CheckCircle2,
    label: "Find the Answer",
    shortLabel: "Answer",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
  },
];

// ─── Highlight helper ────────────────────────────────────────────────────────
function HighlightedText({
  text,
  highlights,
}: {
  text: string;
  highlights: string[];
}) {
  const regex = new RegExp(`(${highlights.join("|")})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        highlights.some(h => h.toLowerCase() === part.toLowerCase()) ? (
          <mark
            key={i}
            className="bg-amber-400/25 text-amber-300 px-0.5 rounded font-semibold not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// ─── Step 1: Read the Question ───────────────────────────────────────────────
function Step1() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">
          The Method — Step 1 of 4
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          Read the Question. Find the Keyword.
        </h2>
        <p className="text-muted-foreground">
          Every NEC exam question contains a{" "}
          <span className="text-amber-400 font-semibold">lookup word</span> — a
          term that appears in the NEC index. Your job is to spot it before you
          even think about the answer.
        </p>
      </div>

      {/* Sample question card */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-amber-400 border-amber-400/40 font-mono text-xs"
          >
            SAMPLE QUESTION
          </Badge>
          <Badge
            variant="outline"
            className="text-muted-foreground font-mono text-xs"
          >
            Motor / Branch Circuit
          </Badge>
        </div>
        <p className="text-foreground text-lg leading-relaxed font-medium">
          {revealed ? (
            <HighlightedText
              text={SAMPLE_QUESTION.text}
              highlights={SAMPLE_QUESTION.keywords}
            />
          ) : (
            SAMPLE_QUESTION.text
          )}
        </p>
        {!revealed ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRevealed(true)}
            className="border-amber-400/40 text-amber-400 hover:bg-amber-400/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            Highlight the lookup words
          </Button>
        ) : (
          <div className="rounded-md bg-amber-400/10 border border-amber-400/30 p-3 space-y-1">
            <p className="text-amber-400 text-sm font-semibold font-mono">
              ✓ Lookup words identified
            </p>
            <p className="text-muted-foreground text-sm">
              The primary index keyword is:{" "}
              <span className="text-amber-300 font-mono font-bold">
                "{SAMPLE_QUESTION.primaryKeyword}"
              </span>
            </p>
            <p className="text-muted-foreground text-xs">
              Pro tip: When multiple keywords appear, start with the most
              specific noun — usually the equipment type or circuit type.
            </p>
          </div>
        )}
      </div>

      {/* Rule box */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">The Rule:</span> You
          are allowed to use your code book on the exam. The exam is not testing
          your memory — it's testing whether you can{" "}
          <span className="text-amber-400">navigate</span> the book faster than
          the clock.
        </p>
      </div>
    </div>
  );
}

// ─── Step 2: Find the Index Word ─────────────────────────────────────────────
function Step2() {
  const [selected, setSelected] = useState<string | null>(null);
  const correct = SAMPLE_QUESTION.indexEntry.term;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">
          The Method — Step 2 of 4
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          Open the Index. Find the Term.
        </h2>
        <p className="text-muted-foreground">
          The NEC index is in the back of the book. Go to the letter that
          matches your keyword. Here's what a real index entry looks like:
        </p>
      </div>

      {/* Simulated index page */}
      <div className="rounded-lg border border-border bg-card p-5 font-mono text-sm space-y-1">
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-3 border-b border-border pb-2">
          NEC INDEX — Excerpt (B)
        </p>
        {[
          "Bonding jumpers, supply-side ........... 250.30(A)(2)",
          "Branch-circuit conductors",
          "  Ampacity ........................... 210.19(A)",
          "  General ........................... 210.19",
          "  Minimum size ...................... Table 310.16",
          "Branch-circuit ratings ............... 210.3",
          "Branch circuits, required ............ 210.11",
          "Busways ............................ Article 368",
        ].map((line, i) => {
          const isTerm = line === "Branch-circuit conductors";
          const isSubEntry = line.startsWith("  ");
          return (
            <p
              key={i}
              className={`${
                isTerm
                  ? "text-amber-400 font-bold cursor-pointer hover:bg-amber-400/10 px-1 rounded"
                  : isSubEntry
                    ? "text-muted-foreground pl-4"
                    : "text-foreground/70"
              }`}
              onClick={isTerm ? () => setSelected(line) : undefined}
            >
              {line}
            </p>
          );
        })}
      </div>

      {/* Instruction */}
      {!selected ? (
        <div className="rounded-md bg-muted/30 border border-border p-3">
          <p className="text-sm text-muted-foreground">
            <span className="text-amber-400 font-semibold">Your turn:</span>{" "}
            Click the correct index term for our sample question above.
          </p>
        </div>
      ) : (
        <div className="rounded-md bg-orange-400/10 border border-orange-400/30 p-3 space-y-1">
          <p className="text-orange-400 text-sm font-semibold font-mono">
            ✓ Correct — "{correct}"
          </p>
          <p className="text-muted-foreground text-sm">
            Now look at the sub-entries. You need{" "}
            <span className="text-orange-300 font-mono font-bold">
              Ampacity → 210.19(A)
            </span>
            . That's your destination. Write it on your scratch paper.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Navigate to the Article ─────────────────────────────────────────
function Step3() {
  const [tabOpen, setTabOpen] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">
          The Method — Step 3 of 4
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          Flip to the Article. Scan the Table.
        </h2>
        <p className="text-muted-foreground">
          You have your article number:{" "}
          <span className="text-yellow-400 font-mono font-bold">210.19(A)</span>
          . Now flip to it. Articles are numbered sequentially — use the running
          header at the top of each page to navigate fast.
        </p>
      </div>

      {/* Article navigation visual */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="bg-muted/50 px-5 py-3 border-b border-border flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            NEC 2026 — Article 210 · Branch Circuits
          </span>
          <span className="font-mono text-xs text-yellow-400">Page ~70</span>
        </div>
        <div className="p-5 space-y-3 font-mono text-sm">
          <p className="text-foreground font-bold text-base">
            210.19 Conductors — Minimum Ampacity and Size
          </p>
          <div
            className={`rounded border cursor-pointer transition-all ${
              tabOpen === "A"
                ? "border-yellow-400/50 bg-yellow-400/10"
                : "border-border hover:border-yellow-400/30 hover:bg-yellow-400/5"
            } p-3`}
            onClick={() => setTabOpen(tabOpen === "A" ? null : "A")}
          >
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 font-bold">
                (A) Branch-Circuit Conductors
              </span>
              <ChevronRight
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  tabOpen === "A" ? "rotate-90" : ""
                }`}
              />
            </div>
            {tabOpen === "A" && (
              <div className="mt-3 space-y-2 text-muted-foreground text-xs leading-relaxed">
                <p className="text-foreground font-bold text-sm">
                  (1) General.
                </p>
                <p>
                  Branch-circuit conductors shall have an ampacity not less than
                  the maximum load to be served.{" "}
                  <span className="text-yellow-300 font-bold">
                    Conductors that supply a single receptacle shall have an
                    ampacity not less than the rating of the receptacle.
                  </span>
                </p>
                <div className="mt-2 rounded bg-yellow-400/15 border border-yellow-400/30 px-3 py-2">
                  <p className="text-yellow-400 font-bold">
                    → Answer found: 20 amperes
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    A 20A receptacle requires a 20A conductor. Article
                    210.19(A)(1) is your citation.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="rounded border border-border p-3 opacity-40">
            <span className="text-muted-foreground">
              (B) Household Ranges and Cooking Appliances
            </span>
          </div>
          <div className="rounded border border-border p-3 opacity-40">
            <span className="text-muted-foreground">(C) Household Dryers</span>
          </div>
        </div>
      </div>

      {!tabOpen && (
        <div className="rounded-md bg-muted/30 border border-border p-3">
          <p className="text-sm text-muted-foreground">
            <span className="text-yellow-400 font-semibold">Your turn:</span>{" "}
            Click section (A) to open it and find the answer.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Step 4: Find the Answer ─────────────────────────────────────────────────
function Step4({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const choices = ["15 amperes", "20 amperes", "25 amperes", "30 amperes"];
  const correct = SAMPLE_QUESTION.correctAnswer;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">
          The Method — Step 4 of 4
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          Select the Answer. Cite the Article.
        </h2>
        <p className="text-muted-foreground">
          You've navigated to the article. You've found the rule. Now select the
          answer — and always write the article number next to it. That's your
          proof.
        </p>
      </div>

      {/* Question recap */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
          Question
        </p>
        <p className="text-foreground font-medium">{SAMPLE_QUESTION.text}</p>
      </div>

      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map(choice => {
          const isSelected = selected === choice;
          const isCorrect = choice === correct;
          const showResult = selected !== null;
          return (
            <button
              key={choice}
              onClick={() => !selected && setSelected(choice)}
              disabled={!!selected}
              className={`rounded-lg border p-4 text-left transition-all font-mono font-bold text-sm ${
                showResult
                  ? isCorrect
                    ? "border-green-400 bg-green-400/15 text-green-400"
                    : isSelected
                      ? "border-red-400 bg-red-400/15 text-red-400"
                      : "border-border text-muted-foreground opacity-50"
                  : "border-border hover:border-amber-400/50 hover:bg-amber-400/5 text-foreground cursor-pointer"
              }`}
            >
              {choice}
              {showResult && isCorrect && (
                <span className="ml-2 text-green-400">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Result */}
      {selected && (
        <div className="rounded-lg border border-green-400/30 bg-green-400/10 p-4 space-y-3">
          <p className="text-green-400 font-bold font-mono">
            ✓ Correct — {correct}
          </p>
          <p className="text-muted-foreground text-sm">
            {SAMPLE_QUESTION.answerExplanation}
          </p>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-yellow-400 border-yellow-400/40 font-mono text-xs"
            >
              Citation: Article 210.19(A)(1)
            </Badge>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-foreground font-semibold text-sm mb-3">
              That's the method. Every question. Every time.
            </p>
            <Button
              onClick={onComplete}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold w-full"
            >
              Enter Code Compass
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Onboarding Component ───────────────────────────────────────────────
export default function Onboarding() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

  const handleComplete = () => {
    // Store completion in localStorage
    // TO SWAP IN SUPABASE: Replace this line with your Supabase update call
    // await supabase.from('users').update({ onboarding_complete: true }).eq('id', userId)
    localStorage.setItem("cc_onboarding_complete", "true");
    navigate("/");
  };

  const handleSkip = () => {
    localStorage.setItem("cc_onboarding_complete", "true");
    navigate("/");
  };

  const canAdvance = currentStep < 4;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-card/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm leading-none">
              Code Compass
            </p>
            <p className="text-muted-foreground text-xs font-mono">
              NEC Co-Pilot
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            <SkipForward className="w-3 h-3 mr-1" />
            Skip — I know how to use the book
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-amber-500 transition-all duration-500"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="border-b border-border bg-card/30 px-6 py-3">
        <div className="flex items-center gap-1 max-w-2xl mx-auto">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = step.id === currentStep;
            const isDone = step.id < currentStep;
            return (
              <div key={step.id} className="flex items-center gap-1 flex-1">
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-all ${
                    isActive
                      ? `${step.bgColor} ${step.color} border ${step.borderColor}`
                      : isDone
                        ? "text-green-400 opacity-70"
                        : "text-muted-foreground opacity-40"
                  }`}
                >
                  <StepIcon className="w-3 h-3 shrink-0" />
                  <span className="hidden sm:inline">{step.shortLabel}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-2xl space-y-8">
          {/* Step content */}
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 onComplete={handleComplete} />}

          {/* Navigation */}
          {canAdvance && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-muted-foreground text-xs font-mono">
                Step {currentStep} of 4
              </p>
              <Button
                onClick={() => setCurrentStep(s => s + 1)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
              >
                Next Step
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
