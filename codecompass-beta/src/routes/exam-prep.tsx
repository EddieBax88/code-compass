import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNecEdition } from "@/lib/nec-edition";

export const Route = createFileRoute("/exam-prep")({
  head: () => {
    const title = "Exam Prep — Code Compass";
    const description =
      "Timed NEC drills: Speed-Find lookups, motor calculations, and Code Hunt article recall to sharpen your journeyman and master exam skills.";
    const url = "https://codecompass-beta.lovable.app/exam-prep";
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
  component: ExamPrep,
});

// ---------- Question banks ----------

type Drill = {
  id: string;
  prompt: string;
  accept: string[]; // acceptable string answers (case-insensitive)
  explain: string;
};

const SPEED_FIND: Drill[] = [
  {
    id: "sf1",
    prompt:
      "Minimum burial depth for direct-buried UF cable under a residential driveway — which NEC table?",
    accept: ["300.5", "table 300.5", "t 300.5"],
    explain: "Table 300.5 lists minimum cover for underground installations.",
  },
  {
    id: "sf2",
    prompt: "Working space in front of a 200A panel — which NEC section?",
    accept: ["110.26", "110.26(a)"],
    explain: "110.26 covers spaces about electrical equipment; Table 110.26(A)(1) has depth.",
  },
  {
    id: "sf3",
    prompt: "Minimum small-appliance branch circuits in a dwelling kitchen?",
    accept: ["2", "two"],
    explain: "210.11(C)(1) — two 20A circuits.",
  },
  {
    id: "sf4",
    prompt: "AFCI protection for dwelling branch circuits — which section?",
    accept: ["210.12"],
    explain: "210.12 covers arc-fault protection.",
  },
  {
    id: "sf5",
    prompt: "Article that covers grounding and bonding?",
    accept: ["250", "article 250", "art 250"],
    explain: "Article 250 is the grounding & bonding article.",
  },
  {
    id: "sf6",
    prompt: "Conductor ampacity table for insulated conductors?",
    accept: ["310.16", "table 310.16"],
    explain: "Table 310.16 — the workhorse ampacity table.",
  },
  {
    id: "sf7",
    prompt: "Standard overcurrent device sizes are listed in which section?",
    accept: ["240.6", "240.6(a)"],
    explain: "240.6(A) lists standard fuse and breaker sizes.",
  },
  {
    id: "sf8",
    prompt: "Motor branch-circuit short-circuit and ground-fault protection table?",
    accept: ["430.52", "table 430.52"],
    explain: "Table 430.52 — the most-tested motor table.",
  },
];

const MOTOR_CALC: Drill[] = [
  {
    id: "mc1",
    prompt:
      "5 HP, 230V, 3-phase motor. Table 430.250 gives FLA 15.2 A. Minimum branch-circuit conductor ampacity (amps)?",
    accept: ["19", "19a"],
    explain: "15.2 × 1.25 = 19 A per 430.22.",
  },
  {
    id: "mc2",
    prompt:
      "10 HP, 208V, 3-phase (FLA 30.8 A). Inverse-time breaker size after rounding to next standard, amps?",
    accept: ["80", "80a"],
    explain: "30.8 × 2.50 = 77 → round up to 80 A per 240.6(A).",
  },
  {
    id: "mc3",
    prompt: "Multiplier applied to motor FLA to size branch-circuit conductors (per 430.22)?",
    accept: ["1.25", "125%", "125"],
    explain: "125% (1.25).",
  },
  {
    id: "mc4",
    prompt: "Dual-element (time-delay) fuse max percentage of FLA per Table 430.52?",
    accept: ["175", "175%"],
    explain: "175%.",
  },
  {
    id: "mc5",
    prompt: "Minimum disconnect rating for a motor, as % of FLA (430.110(A))?",
    accept: ["115", "115%"],
    explain: "115%.",
  },
  {
    id: "mc6",
    prompt: "25 HP, 460V, 3-phase. Table 430.250 FLA (amps)?",
    accept: ["34", "34a"],
    explain: "34 A. Carry this through the rest of the calc.",
  },
];

const CODE_HUNT: Drill[] = [
  {
    id: "ch1",
    prompt: "Which NEC article covers branch circuits?",
    accept: ["210", "article 210"],
    explain: "Article 210.",
  },
  {
    id: "ch2",
    prompt: "Which NEC article covers services?",
    accept: ["230", "article 230"],
    explain: "Article 230.",
  },
  {
    id: "ch3",
    prompt: "Which NEC article covers overcurrent protection?",
    accept: ["240", "article 240"],
    explain: "Article 240.",
  },
  {
    id: "ch4",
    prompt: "GFCI protection for dwellings — which section?",
    accept: ["210.8", "210.8(a)"],
    explain: "210.8(A) for dwelling units.",
  },
  {
    id: "ch5",
    prompt: "Grounding electrode conductor sizing table?",
    accept: ["250.66", "table 250.66"],
    explain: "Table 250.66.",
  },
];

const MODES = [
  {
    id: "speed",
    title: "Speed-Find",
    desc: "Locate any NEC rule under time pressure.",
    bank: SPEED_FIND,
  },
  {
    id: "motor",
    title: "Motor Calc",
    desc: "FLA → conductor → OCP → disconnect.",
    bank: MOTOR_CALC,
  },
  { id: "hunt", title: "Code Hunt", desc: "Article-number recall.", bank: CODE_HUNT },
] as const;

type ModeId = (typeof MODES)[number]["id"];

// ---------- Component ----------

function ExamPrep() {
  const { edition } = useNecEdition();
  const [mode, setMode] = useState<ModeId>("speed");

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-primary">
        Exam prep
        {edition && (
          <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] normal-case tracking-normal text-muted-foreground">
            NEC {edition}
          </span>
        )}
      </div>
      <h1 className="mt-1 font-display text-4xl font-semibold">Timed drills.</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Speed-Find is the fastest way to build the muscle memory that carries into the licensing
        exam. Two minutes per question. Miss one? Read the answer and keep moving.
      </p>

      <div className="mt-4">
        <Link
          to="/practice-test"
          className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition"
        >
          Take the full 25-question Journeyman Practice Test →
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
              mode === m.id
                ? "border-primary bg-primary text-primary-foreground shadow-ember"
                : "border-border bg-card hover:border-primary/60"
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>

      <div className="mt-2 text-sm text-muted-foreground">
        {MODES.find((m) => m.id === mode)!.desc}
      </div>

      <Drill key={mode} mode={mode} />

      <div className="mt-10 text-sm">
        <Link to="/study-tools" className="text-primary hover:underline">
          ← Back to study tools
        </Link>
      </div>
    </main>
  );
}

function Drill({ mode }: { mode: ModeId }) {
  const bank = useMemo(() => shuffle(MODES.find((m) => m.id === mode)!.bank), [mode]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<null | { correct: boolean; explain: string }>(null);
  const [correctCount, setCorrect] = useState(0);
  const [seconds, setSeconds] = useState(120);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = bank[idx];
  const done = idx >= bank.length;

  useEffect(() => {
    if (done || feedback) return;
    setSeconds(120);
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(t);
          setFeedback({ correct: false, explain: `Time. Answer: ${q.accept[0]}. ${q.explain}` });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [idx, done, feedback, q]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [idx]);

  if (done) {
    const pct = Math.round((correctCount / bank.length) * 100);
    return (
      <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
        <div className="text-[10px] uppercase tracking-[0.18em] text-primary">Drill complete</div>
        <div className="mt-2 font-display text-5xl font-semibold ember-text">{pct}%</div>
        <div className="mt-2 text-sm text-muted-foreground">
          {correctCount} of {bank.length} correct
        </div>
        <button
          onClick={() => {
            setIdx(0);
            setCorrect(0);
            setAnswer("");
            setFeedback(null);
          }}
          className="mt-6 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Run again
        </button>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback) return;
    const norm = answer.trim().toLowerCase();
    const ok = q.accept.some((a) => a.toLowerCase() === norm);
    if (ok) setCorrect((c) => c + 1);
    setFeedback({ correct: ok, explain: ok ? q.explain : `Answer: ${q.accept[0]}. ${q.explain}` });
  }

  function next() {
    setIdx((i) => i + 1);
    setAnswer("");
    setFeedback(null);
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {idx + 1} of {bank.length}
        </span>
        <span className={seconds <= 20 ? "text-red-500 font-mono font-semibold" : "font-mono"}>
          ⏱ {String(Math.floor(seconds / 60)).padStart(1, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-4 text-lg">{q.prompt}</div>
      <form onSubmit={submit} className="mt-5 flex gap-2">
        <input
          ref={inputRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={!!feedback}
          placeholder="Type your answer"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        {!feedback ? (
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Next →
          </button>
        )}
      </form>
      {feedback && (
        <div
          className={`mt-4 rounded-md border p-3 text-sm ${
            feedback.correct
              ? "border-primary/40 bg-primary/5 text-primary"
              : "border-red-500/30 bg-red-500/5 text-foreground"
          }`}
        >
          <div className="font-semibold">{feedback.correct ? "✓ Correct" : "✗ Not quite"}</div>
          <div className="mt-1 text-muted-foreground">{feedback.explain}</div>
        </div>
      )}
      <div className="mt-6 text-xs text-muted-foreground">
        Score: {correctCount}/{idx + (feedback ? 1 : 0)}
      </div>
    </div>
  );
}

function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
