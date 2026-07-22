import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useNecEdition, citeLabel } from "@/lib/nec-edition";

export const Route = createFileRoute("/practice-test")({
  head: () => {
    const title = "Journeyman Electrician Practice Test — Code Compass";
    const description =
      "Free 25-question journeyman electrician practice test. NEC-based multiple choice with instant feedback, timer, and explanations for the 2017, 2020, and 2023 editions.";
    const url = "https://codecompass-beta.lovable.app/practice-test";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: "Journeyman Electrician Practice Test",
            about: "National Electrical Code (NEC)",
            educationalLevel: "Journeyman electrician",
            url,
            provider: {
              "@type": "Organization",
              name: "Code Compass",
              url: "https://codecompass-beta.lovable.app",
            },
          }),
        },
      ],
    };
  },
  component: PracticeTest,
});

type Q = {
  id: string;
  topic: string;
  ref: string; // NEC ref
  prompt: string;
  choices: string[];
  answer: number; // index
  explain: string;
};

// 25 NEC-focused journeyman questions. Answers are stable across 2017/2020/2023
// unless noted; explanation cites the section every edition shares.
const QUESTIONS: Q[] = [
  {
    id: "q1",
    topic: "Conductor ampacity",
    ref: "310.16",
    prompt:
      "Using the 75°C column of Table 310.16, what is the allowable ampacity of a THWN copper #6 AWG?",
    choices: ["55 A", "65 A", "75 A", "85 A"],
    answer: 1,
    explain: "Table 310.16, 75°C copper column: #6 = 65 A.",
  },
  {
    id: "q2",
    topic: "Boxes",
    ref: "314.16",
    prompt:
      'How many 12 AWG conductors can occupy a 4" square × 1½" deep box (21.0 cu in) with no fittings, clamps, or devices?',
    choices: ["7", "8", "9", "10"],
    answer: 2,
    explain: "21.0 ÷ 2.25 (12 AWG volume) = 9 conductors.",
  },
  {
    id: "q3",
    topic: "GFCI",
    ref: "210.8(A)",
    prompt: "Which dwelling location does NOT require 125V, 15/20A receptacle GFCI protection?",
    choices: ["Kitchen countertop", "Bathroom", "Hallway (interior)", "Unfinished basement"],
    answer: 2,
    explain:
      "210.8(A) lists bathrooms, kitchens, basements, garages, outdoors — interior hallways are not on the list.",
  },
  {
    id: "q4",
    topic: "Working space",
    ref: "110.26(A)(1)",
    prompt:
      "Minimum depth of working space in front of a 208V, 3-phase panel with grounded parts on the opposite side (Condition 2)?",
    choices: ["3 ft", "3½ ft", "4 ft", "6 ft"],
    answer: 1,
    explain: "Table 110.26(A)(1): 151–600V, Condition 2 = 3½ ft.",
  },
  {
    id: "q5",
    topic: "Motor OCPD",
    ref: "430.52",
    prompt:
      "Maximum inverse-time breaker for a 3-phase squirrel-cage motor with FLC = 28 A (standard percentage)?",
    choices: ["50 A", "70 A", "80 A", "90 A"],
    answer: 2,
    explain:
      "430.52 inverse-time breaker = 250% × FLC = 70 A → next standard size up per 430.52(C)(1) Ex.1 = 80 A.",
  },
  {
    id: "q6",
    topic: "Motor conductors",
    ref: "430.22",
    prompt:
      "Branch-circuit conductors for a single continuous-duty motor must be sized at not less than what percentage of the FLC?",
    choices: ["100%", "115%", "125%", "150%"],
    answer: 2,
    explain: "430.22: 125% of the motor FLC from Table 430.250.",
  },
  {
    id: "q7",
    topic: "Grounding",
    ref: "250.66",
    prompt:
      "For a service with 3/0 copper ungrounded conductors, the minimum copper grounding electrode conductor size is:",
    choices: ["#8", "#6", "#4", "#2"],
    answer: 1,
    explain: "Table 250.66: 1/0 – 3/0 copper service = #6 copper GEC.",
  },
  {
    id: "q8",
    topic: "EGC",
    ref: "250.122",
    prompt: "Minimum copper equipment grounding conductor for a 60A branch circuit?",
    choices: ["#12", "#10", "#8", "#6"],
    answer: 1,
    explain: "Table 250.122: 60A OCPD = #10 copper EGC.",
  },
  {
    id: "q9",
    topic: "Conduit fill",
    ref: "Chapter 9 Table 1",
    prompt: "Maximum conductor fill for three or more conductors in a conduit or tubing?",
    choices: ["31%", "40%", "53%", "60%"],
    answer: 1,
    explain: "Chapter 9, Table 1: over 2 conductors = 40% fill.",
  },
  {
    id: "q10",
    topic: "Receptacles",
    ref: "210.52(A)(1)",
    prompt:
      "In a dwelling room, no point along the floor line of any wall shall be more than what distance from a receptacle?",
    choices: ["4 ft", "6 ft", "8 ft", "12 ft"],
    answer: 1,
    explain: "210.52(A)(1): 6 ft measured horizontally along the floor line (12 ft spacing).",
  },
  {
    id: "q11",
    topic: "Small appliance",
    ref: "210.11(C)(1)",
    prompt: "Minimum number of 20A small-appliance branch circuits required in a dwelling kitchen?",
    choices: ["1", "2", "3", "4"],
    answer: 1,
    explain: "210.11(C)(1): at least two 20A small-appliance branch circuits.",
  },
  {
    id: "q12",
    topic: "Voltage drop",
    ref: "210.19 IN",
    prompt: "The informational note in 210.19 recommends branch-circuit voltage drop not exceed:",
    choices: ["1%", "2%", "3%", "5%"],
    answer: 2,
    explain: "Informational note: 3% branch, 5% total (feeder + branch) for reasonable efficiency.",
  },
  {
    id: "q13",
    topic: "Service",
    ref: "230.79",
    prompt: "Minimum service disconnect rating for a one-family dwelling:",
    choices: ["60 A", "100 A", "125 A", "200 A"],
    answer: 1,
    explain: "230.79(C): one-family dwelling = 100A minimum.",
  },
  {
    id: "q14",
    topic: "Cable support",
    ref: "334.30",
    prompt: "Type NM cable must be secured within what distance of every box or fitting?",
    choices: ["8 in", "12 in", "16 in", "4½ ft"],
    answer: 1,
    explain: "334.30: secured within 12 in of every outlet box, junction box, cabinet, or fitting.",
  },
  {
    id: "q15",
    topic: "Burial depth",
    ref: "Table 300.5",
    prompt:
      "Minimum cover for direct-buried UF cable, 120V residential branch circuit with GFCI, under a dwelling driveway (Column 4)?",
    choices: ["6 in", "12 in", "18 in", "24 in"],
    answer: 2,
    explain: "Table 300.5, residential 120V GFCI branch circuit under dwelling driveway = 18 in.",
  },
  {
    id: "q16",
    topic: "Box fill (device)",
    ref: "314.16(B)(4)",
    prompt:
      "A single yoke/strap device counts as how many conductors of the largest conductor connected to the device?",
    choices: ["1", "2", "3", "4"],
    answer: 1,
    explain: "314.16(B)(4): each yoke counts as two conductor volumes.",
  },
  {
    id: "q17",
    topic: "Neutral",
    ref: "220.61",
    prompt:
      "For a feeder neutral serving a nonlinear load bank of electric-discharge lighting, what portion is subject to the 70% demand reduction?",
    choices: ["None", "The first 200A", "The portion over 200A", "The full load"],
    answer: 0,
    explain:
      "220.61(C)(1): no reduction of the neutral capacity is allowed for electric-discharge lighting.",
  },
  {
    id: "q18",
    topic: "Ampacity adjustment",
    ref: "310.15(C)(1)",
    prompt:
      "Adjustment factor for 7 current-carrying conductors bundled in a raceway (over 24 in)?",
    choices: ["80%", "70%", "50%", "45%"],
    answer: 1,
    explain: "310.15(C)(1) adjustment table: 7–9 current-carrying conductors = 70%.",
  },
  {
    id: "q19",
    topic: "Overcurrent",
    ref: "240.6(A)",
    prompt: "Which is NOT a standard ampere rating for fuses and inverse-time breakers?",
    choices: ["70", "85", "110", "125"],
    answer: 1,
    explain: "240.6(A) lists 70, 80, 90, 100, 110, 125… — 85 is not a standard rating.",
  },
  {
    id: "q20",
    topic: "Bathroom",
    ref: "210.11(C)(3)",
    prompt: "A 20A branch circuit supplying a dwelling bathroom receptacle:",
    choices: [
      "May serve receptacles in more than one bathroom",
      "May supply lighting and receptacles in the same bathroom",
      "May not supply any other outlet",
      "Either (a) or (b)",
    ],
    answer: 3,
    explain:
      "210.11(C)(3): the 20A circuit may serve receptacles in multiple bathrooms, OR serve one bathroom's receptacle, lighting, and equipment — but not both.",
  },
  {
    id: "q21",
    topic: "Transformer",
    ref: "450.3(B)",
    prompt:
      "Primary-only protection for a 30 kVA, 480V single-phase transformer (primary FLA = 62.5A), max primary OCPD (125% rule):",
    choices: ["70 A", "80 A", "90 A", "100 A"],
    answer: 1,
    explain: "450.3(B): 125% × 62.5 = 78.1A → next standard = 80A.",
  },
  {
    id: "q22",
    topic: "Continuous load",
    ref: "210.19(A)(1)",
    prompt:
      "Branch-circuit conductors supplying a continuous load must have an ampacity of at least:",
    choices: ["100% of the load", "115% of the load", "125% of the load", "150% of the load"],
    answer: 2,
    explain: "210.19(A)(1): non-continuous + 125% of continuous.",
  },
  {
    id: "q23",
    topic: "AFCI",
    ref: "210.12",
    prompt:
      "AFCI protection is required for 120V, 15/20A branch circuits supplying outlets/devices in which dwelling area?",
    choices: [
      "Bathrooms only",
      "Garages only",
      "Kitchens, family rooms, bedrooms and similar rooms",
      "Only bedrooms",
    ],
    answer: 2,
    explain:
      "210.12(A) applies AFCI to nearly all habitable dwelling rooms — kitchens, family rooms, bedrooms, etc.",
  },
  {
    id: "q24",
    topic: "Grounded conductor",
    ref: "200.6",
    prompt: "A #4 AWG grounded (neutral) conductor may be identified by:",
    choices: [
      "White insulation only",
      "Gray insulation only",
      "White, gray, or three continuous white/gray stripes along its entire length, OR reidentified at terminations",
      "Green tape only",
    ],
    answer: 2,
    explain:
      "200.6(B): conductors larger than #6 may be identified at terminations with white marking or by insulation.",
  },
  {
    id: "q25",
    topic: "Service head",
    ref: "230.54",
    prompt: "Service-drop conductors shall have a drip loop and the service head shall be located:",
    choices: [
      "Below the point of attachment",
      "Above the point of attachment",
      "At the meter socket",
      "Inside the weatherhead",
    ],
    answer: 1,
    explain: "230.54(C): service head above the point of attachment (drip loop below).",
  },
];

const PASS_PCT = 75;
const DURATION_MIN = 50; // real journeyman exams give ~2 min/question

function PracticeTest() {
  const { edition } = useNecEdition();
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const q = QUESTIONS[idx];

  const score = useMemo(() => {
    let n = 0;
    for (const item of QUESTIONS) {
      if (answers[item.id] === item.answer) n++;
    }
    return n;
  }, [answers]);

  const pct = Math.round((score / QUESTIONS.length) * 100);

  function pick(i: number) {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [q.id]: i }));
  }

  function reset() {
    setStarted(false);
    setSubmitted(false);
    setAnswers({});
    setIdx(0);
    setStartedAt(null);
  }

  if (!started) {
    return (
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-10">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Exam Prep</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold">
          Journeyman Electrician Practice Test
        </h1>
        <p className="mt-4 text-muted-foreground">
          25 NEC-based multiple-choice questions in the format you'll see on the state journeyman
          exam. Aim for {PASS_PCT}% or better. You'll get {DURATION_MIN} minutes — the same pace
          your real exam expects.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Card label="Questions" value="25" />
          <Card label="Passing" value={`${PASS_PCT}%`} />
          <Card label="Time" value={`${DURATION_MIN} min`} />
          <Card label="NEC edition" value={edition ?? "Pick one"} />
        </div>

        {!edition && (
          <div className="mt-4 rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm">
            Pick your NEC edition first —{" "}
            <Link to="/study-tools" className="underline">
              set it here
            </Link>
            . Answers below are consistent across 2017, 2020, and 2023 except where noted in
            explanations.
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setStarted(true);
              setStartedAt(Date.now());
            }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground shadow-ember hover:opacity-90 transition"
          >
            Start test →
          </button>
          <Link
            to="/exam-prep"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 font-medium hover:bg-secondary transition"
          >
            Timed drills instead
          </Link>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold">What's on this test</h2>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {Array.from(new Set(QUESTIONS.map((q) => q.topic))).map((t) => (
              <li key={t} className="rounded-md border border-border bg-card px-3 py-2">
                {t}
              </li>
            ))}
          </ul>
        </section>
      </main>
    );
  }

  if (submitted) {
    const passed = pct >= PASS_PCT;
    const minutes = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 60000)) : 0;
    return (
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-10">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Results</div>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          {passed ? "You'd pass." : "Not there yet."}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {score} of {QUESTIONS.length} correct · {pct}% · {minutes} min
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground shadow-ember hover:opacity-90 transition"
          >
            Retake test
          </button>
          <Link
            to="/exam-prep"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 font-medium hover:bg-secondary transition"
          >
            Drill weak spots
          </Link>
        </div>

        <ol className="mt-10 space-y-4">
          {QUESTIONS.map((item, i) => {
            const picked = answers[item.id];
            const correct = picked === item.answer;
            return (
              <li
                key={item.id}
                className={`rounded-2xl border p-4 ${
                  correct ? "border-border bg-card" : "border-primary/40 bg-card"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
                  <span className="text-muted-foreground">
                    Q{i + 1} · {item.topic}
                  </span>
                  <span className={correct ? "text-accent" : "text-primary"}>
                    {correct ? "Correct" : "Missed"}
                  </span>
                </div>
                <div className="mt-2 font-medium">{item.prompt}</div>
                <div className="mt-3 grid gap-1 text-sm">
                  {item.choices.map((c, ci) => (
                    <div
                      key={ci}
                      className={`rounded-md border px-3 py-1.5 ${
                        ci === item.answer
                          ? "border-accent/60 bg-accent/10"
                          : ci === picked
                            ? "border-primary/60 bg-primary/10"
                            : "border-border"
                      }`}
                    >
                      {c}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {citeLabel(edition, item.ref)}
                  </span>{" "}
                  — {item.explain}
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    );
  }

  const answered = Object.keys(answers).length;
  const picked = answers[q.id];

  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-10">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Question {idx + 1} of {QUESTIONS.length} · {q.topic}
        </div>
        <div className="text-xs text-muted-foreground">
          Answered {answered}/{QUESTIONS.length}
        </div>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all"
          style={{ width: `${((idx + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <h1 className="mt-6 font-display text-2xl sm:text-3xl font-semibold leading-tight">
        {q.prompt}
      </h1>
      <div className="mt-2 text-xs text-muted-foreground">
        Reference: {citeLabel(edition, q.ref)}
      </div>

      <div className="mt-6 grid gap-2">
        {q.choices.map((c, ci) => {
          const selected = picked === ci;
          return (
            <button
              key={ci}
              onClick={() => pick(ci)}
              className={`text-left rounded-lg border px-4 py-3 transition ${
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span className="mr-2 font-mono text-xs text-muted-foreground">
                {String.fromCharCode(65 + ci)}.
              </span>
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="rounded-md border border-border bg-card px-4 py-2 text-sm disabled:opacity-40"
        >
          ← Back
        </button>
        {idx < QUESTIONS.length - 1 ? (
          <button
            onClick={() => setIdx((i) => Math.min(QUESTIONS.length - 1, i + 1))}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            disabled={answered < QUESTIONS.length}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90 disabled:opacity-40"
            title={
              answered < QUESTIONS.length ? `Answer all ${QUESTIONS.length} questions first` : ""
            }
          >
            Submit test
          </button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-5 gap-1 sm:grid-cols-10">
        {QUESTIONS.map((item, i) => {
          const done = answers[item.id] !== undefined;
          return (
            <button
              key={item.id}
              onClick={() => setIdx(i)}
              className={`h-8 rounded-md border text-xs font-mono ${
                i === idx
                  ? "border-primary bg-primary/20"
                  : done
                    ? "border-accent/60 bg-accent/10"
                    : "border-border bg-card"
              }`}
              aria-label={`Go to question ${i + 1}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
