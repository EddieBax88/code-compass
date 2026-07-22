import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  courseById,
  applyEdition,
  TRADES,
  type Course,
  type Module,
  type Lesson,
  type Question,
  type Quiz,
} from "@/lib/curriculum";
import { useProgress, courseProgress, quizPassed, quizBest, type QuizResult } from "@/lib/progress";
import { useNecEdition } from "@/lib/nec-edition";

export const Route = createFileRoute("/course/$courseId")({
  head: ({ params }) => {
    const c = courseById(params.courseId);
    const title = c ? `${c.title} — Code Compass` : "Course — Code Compass";
    const description = c?.tagline ?? "Trade course.";
    const url = `https://codecompass-beta.lovable.app/course/${params.courseId}`;
    const trade = c ? TRADES.find((t) => t.id === c.trade) : undefined;
    const tradeUrl = trade ? `https://codecompass-beta.lovable.app/courses/${trade.id}` : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: c
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Course",
                name: c.title,
                description: c.tagline,
                url,
                provider: {
                  "@type": "Organization",
                  name: "Code Compass",
                  sameAs: "https://codecompass-beta.lovable.app",
                },
              }),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://codecompass-beta.lovable.app/",
                  },
                  ...(trade && tradeUrl
                    ? [{ "@type": "ListItem", position: 2, name: trade.name, item: tradeUrl }]
                    : []),
                  { "@type": "ListItem", position: trade ? 3 : 2, name: c.title, item: url },
                ],
              }),
            },
          ]
        : [],
    };
  },
  validateSearch: (search: Record<string, unknown>) => ({
    focus: typeof search.focus === "string" ? (search.focus as string) : undefined,
  }),
  loader: ({ params }): { course: Course } => {
    const c = courseById(params.courseId);
    if (!c) throw notFound();
    return { course: c };
  },
  component: CoursePage,
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-5 py-20 text-center">
      <h1 className="font-display text-4xl">Course not found</h1>
      <Link to="/" className="mt-6 inline-block text-primary">
        ← Back home
      </Link>
    </main>
  ),
});

type LessonSel = { kind: "lesson"; moduleId: string; lessonId: string };
type QuizSel = { kind: "quiz"; moduleId: string };
type Selection = LessonSel | QuizSel | { kind: "overview" };
type NavSelection = LessonSel | QuizSel;

function CoursePage() {
  const { course: rawCourse } = Route.useLoaderData() as { course: Course };
  const { focus } = Route.useSearch();
  const { edition } = useNecEdition();
  const course = useMemo(() => applyEdition(rawCourse, edition), [rawCourse, edition]);
  const { state, markLesson, unmarkLesson, recordQuiz } = useProgress();
  const initialSelection: Selection = useMemo(() => {
    if (focus && course.modules.some((m) => m.id === focus)) {
      return { kind: "quiz", moduleId: focus };
    }
    return { kind: "overview" };
  }, [focus, course]);
  const [selection, setSelection] = useState<Selection>(initialSelection);

  const trade = TRADES.find((t) => t.id === course.trade)!;
  const lessonsTotal = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const quizzesTotal = course.modules.length;
  const pct = courseProgress(state, course.id, lessonsTotal, quizzesTotal);

  const completed = new Set<string>(state.lessons[course.id] ?? []);
  const passedQuizCount = course.modules.filter((m) => quizPassed(state, course.id, m.id)).length;

  const flatNav = useMemo<NavSelection[]>(() => {
    const out: NavSelection[] = [];
    for (const m of course.modules) {
      for (const l of m.lessons) {
        out.push({ kind: "lesson", moduleId: m.id, lessonId: l.id });
      }
      out.push({ kind: "quiz", moduleId: m.id });
    }
    return out;
  }, [course]);

  const nextUp = useMemo(() => {
    for (const s of flatNav) {
      if (s.kind === "lesson") {
        if (!completed.has(`${s.moduleId}:${s.lessonId}`)) return s;
      } else if (!quizPassed(state, course.id, s.moduleId)) {
        return s;
      }
    }
    return null;
  }, [flatNav, completed, state, course.id]);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-8">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link
          to="/courses/$trade"
          params={{ trade: course.trade }}
          className="hover:text-foreground"
        >
          {trade.name}
        </Link>
        <span>/</span>
        <span className="truncate">{course.title}</span>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8 grain relative">
        <div className="text-[10px] uppercase tracking-[0.2em] text-accent">
          {trade.name} · {course.level}
        </div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold leading-tight">
          {course.title}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">{course.tagline}</p>
        <p className="mt-4 max-w-2xl text-sm">{course.why}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {pct}% complete · {completed.size}/{lessonsTotal} lessons · {passedQuizCount}/
              {quizzesTotal} quizzes passed
            </div>
          </div>
          {nextUp && (
            <button
              onClick={() => setSelection(nextUp)}
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90"
            >
              {pct === 0 ? "Start course" : "Continue →"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-3 h-fit lg:sticky lg:top-20">
          <button
            onClick={() => setSelection({ kind: "overview" })}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              selection.kind === "overview"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/60"
            }`}
          >
            Overview
          </button>
          <div className="mt-2 space-y-3">
            {course.modules.map((m, i) => {
              const qPassed = quizPassed(state, course.id, m.id);
              const best = quizBest(state, course.id, m.id);
              return (
                <div key={m.id}>
                  <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Module {i + 1}
                  </div>
                  <div className="px-3 pb-1 font-medium text-sm">{m.title}</div>
                  <ul className="mt-1">
                    {m.lessons.map((l) => {
                      const key = `${m.id}:${l.id}`;
                      const done = completed.has(key);
                      const active =
                        selection.kind === "lesson" &&
                        selection.moduleId === m.id &&
                        selection.lessonId === l.id;
                      return (
                        <li key={l.id}>
                          <button
                            onClick={() =>
                              setSelection({
                                kind: "lesson",
                                moduleId: m.id,
                                lessonId: l.id,
                              })
                            }
                            className={`w-full flex items-center gap-2 text-left px-3 py-1.5 rounded-md text-sm ${
                              active ? "bg-secondary" : "hover:bg-secondary/60"
                            }`}
                          >
                            <span
                              className={`grid place-items-center h-4 w-4 rounded-full border text-[10px] shrink-0 ${
                                done
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border"
                              }`}
                            >
                              {done ? "✓" : ""}
                            </span>
                            <span className="truncate">{l.title}</span>
                            <span className="ml-auto text-[10px] text-muted-foreground">
                              {l.minutes}m
                            </span>
                          </button>
                        </li>
                      );
                    })}
                    <li>
                      <button
                        onClick={() => setSelection({ kind: "quiz", moduleId: m.id })}
                        className={`w-full flex items-center gap-2 text-left px-3 py-1.5 rounded-md text-sm ${
                          selection.kind === "quiz" && selection.moduleId === m.id
                            ? "bg-secondary"
                            : "hover:bg-secondary/60"
                        }`}
                      >
                        <span
                          className={`grid place-items-center h-4 w-4 rounded-full border text-[10px] shrink-0 ${
                            qPassed
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border"
                          }`}
                        >
                          {qPassed ? "✓" : "?"}
                        </span>
                        <span className="text-accent flex-1 truncate">Module quiz</span>
                        {best && (
                          <span className="text-[10px] text-muted-foreground">
                            {best.scorePct}%
                          </span>
                        )}
                      </button>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="min-w-0">
          {selection.kind === "overview" && (
            <OverviewPane course={course} completed={completed} onPick={setSelection} />
          )}
          {selection.kind === "lesson" &&
            (() => {
              const mod = course.modules.find((m) => m.id === selection.moduleId)!;
              const lesson = mod.lessons.find((l) => l.id === selection.lessonId)!;
              const key = `${mod.id}:${lesson.id}`;
              const done = completed.has(key);
              return (
                <LessonPane
                  module={mod}
                  lesson={lesson}
                  done={done}
                  onToggleDone={() =>
                    done ? unmarkLesson(course.id, key) : markLesson(course.id, key)
                  }
                  onNext={() => {
                    if (!done) markLesson(course.id, key);
                    const idx = flatNav.findIndex(
                      (s) =>
                        s.kind === "lesson" && s.moduleId === mod.id && s.lessonId === lesson.id,
                    );
                    const next = flatNav[idx + 1];
                    if (next) setSelection(next);
                  }}
                />
              );
            })()}
          {selection.kind === "quiz" &&
            (() => {
              const mod = course.modules.find((m) => m.id === selection.moduleId)!;
              const best = quizBest(state, course.id, mod.id);
              return (
                <QuizRunner
                  key={mod.id}
                  module={mod}
                  bestScore={best?.scorePct ?? null}
                  onComplete={(result) => recordQuiz(course.id, mod.id, result)}
                  onNext={() => {
                    const idx = flatNav.findIndex(
                      (s) => s.kind === "quiz" && s.moduleId === mod.id,
                    );
                    const next = flatNav[idx + 1];
                    if (next) setSelection(next);
                    else setSelection({ kind: "overview" });
                  }}
                />
              );
            })()}
        </section>
      </div>
    </main>
  );
}

function OverviewPane({
  course,
  completed,
  onPick,
}: {
  course: Course;
  completed: Set<string>;
  onPick: (s: Selection) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-display text-2xl font-semibold">What you'll learn</h2>
      <ol className="mt-5 space-y-4">
        {course.modules.map((m, i) => {
          const allLessonsDone = m.lessons.every((l) => completed.has(`${m.id}:${l.id}`));
          return (
            <li
              key={m.id}
              className="rounded-xl border border-border p-4 hover:border-primary/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Module {i + 1}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold">{m.title}</div>
                  <div className="text-sm text-muted-foreground">{m.summary}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  {m.lessons.length} lessons · {m.quiz.questions.length} questions
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {m.lessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onPick({ kind: "lesson", moduleId: m.id, lessonId: l.id })}
                    className={`text-xs rounded-full border px-3 py-1 transition ${
                      completed.has(`${m.id}:${l.id}`)
                        ? "border-primary/60 bg-primary/10 text-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {completed.has(`${m.id}:${l.id}`) ? "✓ " : ""}
                    {l.title}
                  </button>
                ))}
                <button
                  onClick={() => onPick({ kind: "quiz", moduleId: m.id })}
                  className={`text-xs rounded-full border px-3 py-1 transition ${
                    allLessonsDone
                      ? "border-accent text-accent hover:bg-accent/10"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  Take quiz
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function LessonPane({
  module: mod,
  lesson,
  done,
  onToggleDone,
  onNext,
}: {
  module: Module;
  lesson: Lesson;
  done: boolean;
  onToggleDone: () => void;
  onNext: () => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 sm:p-10">
      <div className="text-[10px] uppercase tracking-[0.18em] text-accent">{mod.title}</div>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold leading-tight">
        {lesson.title}
      </h2>
      <div className="mt-1 text-xs text-muted-foreground">~{lesson.minutes} min read</div>

      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-foreground/90">
        {lesson.body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-background/40 p-5">
        <div className="text-[10px] uppercase tracking-[0.18em] text-primary">
          Take this to the job
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          {lesson.keyPoints.map((k, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary">▸</span>
              <span>{k}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={onToggleDone}
          className={`rounded-md px-4 py-2 text-sm font-medium border ${
            done
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border hover:bg-secondary"
          }`}
        >
          {done ? "✓ Marked complete" : "Mark complete"}
        </button>
        <button
          onClick={onNext}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90"
        >
          {done ? "Next →" : "Mark & continue →"}
        </button>
      </div>
    </article>
  );
}

/* ===========================
   Quiz engine
   =========================== */

type Answer =
  | { kind: "single"; pick: number | null }
  | { kind: "multi"; picks: Set<number> }
  | { kind: "truefalse"; pick: boolean | null }
  | { kind: "short"; text: string };

function emptyAnswer(q: Question): Answer {
  switch (q.kind) {
    case "single":
      return { kind: "single", pick: null };
    case "multi":
      return { kind: "multi", picks: new Set() };
    case "truefalse":
      return { kind: "truefalse", pick: null };
    case "short":
      return { kind: "short", text: "" };
  }
}

function answered(a: Answer): boolean {
  switch (a.kind) {
    case "single":
      return a.pick !== null;
    case "multi":
      return a.picks.size > 0;
    case "truefalse":
      return a.pick !== null;
    case "short":
      return a.text.trim().length > 0;
  }
}

function isCorrect(q: Question, a: Answer): boolean {
  if (q.kind === "single" && a.kind === "single") {
    return a.pick === q.answerIndex;
  }
  if (q.kind === "multi" && a.kind === "multi") {
    const want = new Set(q.answerIndices);
    if (want.size !== a.picks.size) return false;
    for (const i of a.picks) if (!want.has(i)) return false;
    return true;
  }
  if (q.kind === "truefalse" && a.kind === "truefalse") {
    return a.pick === q.answer;
  }
  if (q.kind === "short" && a.kind === "short") {
    const t = a.text.trim().toLowerCase();
    return q.accept.some((x) => x.trim().toLowerCase() === t);
  }
  return false;
}

function QuizRunner({
  module: mod,
  bestScore,
  onComplete,
  onNext,
}: {
  module: Module;
  bestScore: number | null;
  onComplete: (r: QuizResult) => void;
  onNext: () => void;
}) {
  const quiz = mod.quiz;
  const [answers, setAnswers] = useState<Answer[]>(() => quiz.questions.map(emptyAnswer));
  const [submitted, setSubmitted] = useState<{
    result: QuizResult;
    perQuestion: boolean[];
  } | null>(null);

  function updateAnswer(i: number, next: Answer) {
    setAnswers((prev) => {
      const copy = prev.slice();
      copy[i] = next;
      return copy;
    });
  }

  function submit() {
    const perQuestion = quiz.questions.map((q, i) => isCorrect(q, answers[i]));
    const correct = perQuestion.filter(Boolean).length;
    const total = quiz.questions.length;
    const scorePct = Math.round((correct / total) * 100);
    const result: QuizResult = {
      scorePct,
      correct,
      total,
      passed: scorePct >= quiz.passPct,
      at: Date.now(),
    };
    setSubmitted({ result, perQuestion });
    onComplete(result);
  }

  function retake() {
    setAnswers(quiz.questions.map(emptyAnswer));
    setSubmitted(null);
  }

  const allAnswered = answers.every(answered);

  if (submitted) {
    return (
      <ResultsPane
        quiz={quiz}
        answers={answers}
        perQuestion={submitted.perQuestion}
        result={submitted.result}
        bestScore={bestScore}
        onRetake={retake}
        onNext={onNext}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-accent">
            {mod.title} · Knowledge check
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold">
            {quiz.questions.length} questions · Pass at {quiz.passPct}%
          </h2>
        </div>
        {bestScore !== null && (
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Best
            </div>
            <div className="font-display text-2xl font-semibold ember-text">{bestScore}%</div>
          </div>
        )}
      </div>

      <ol className="mt-8 space-y-8">
        {quiz.questions.map((q, i) => (
          <li key={q.id} className="border-t border-border pt-6">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-semibold text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.16em] text-primary">
                  {kindLabel(q.kind)}
                </div>
                <div className="mt-1 text-lg font-medium">{q.prompt}</div>
              </div>
            </div>
            <div className="mt-4 pl-9">
              <QuestionInput
                question={q}
                answer={answers[i]}
                onChange={(a) => updateAnswer(i, a)}
              />
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-ember disabled:opacity-40 hover:opacity-90"
        >
          Submit quiz
        </button>
        {!allAnswered && (
          <span className="text-xs text-muted-foreground">Answer every question to submit.</span>
        )}
      </div>
    </div>
  );
}

function kindLabel(k: Question["kind"]) {
  switch (k) {
    case "single":
      return "Multiple choice";
    case "multi":
      return "Select all that apply";
    case "truefalse":
      return "True or false";
    case "short":
      return "Short answer";
  }
}

function QuestionInput({
  question,
  answer,
  onChange,
  reveal,
  correct,
}: {
  question: Question;
  answer: Answer;
  onChange: (a: Answer) => void;
  reveal?: boolean;
  correct?: boolean;
}) {
  if (question.kind === "single" && answer.kind === "single") {
    return (
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const picked = answer.pick === i;
          const isAnswer = i === question.answerIndex;
          let cls = "border-border hover:border-primary/40";
          if (reveal) {
            if (isAnswer) cls = "border-primary bg-primary/10";
            else if (picked) cls = "border-destructive bg-destructive/10";
            else cls = "border-border opacity-60";
          } else if (picked) {
            cls = "border-primary";
          }
          return (
            <button
              key={i}
              disabled={!!reveal}
              onClick={() => onChange({ kind: "single", pick: i })}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition ${cls}`}
            >
              <span className="inline-block w-6 text-muted-foreground">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.kind === "multi" && answer.kind === "multi") {
    return (
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const picked = answer.picks.has(i);
          const isAnswer = question.answerIndices.includes(i);
          let cls = "border-border hover:border-primary/40";
          if (reveal) {
            if (isAnswer && picked) cls = "border-primary bg-primary/10";
            else if (isAnswer && !picked) cls = "border-primary/60 bg-primary/5";
            else if (!isAnswer && picked) cls = "border-destructive bg-destructive/10";
            else cls = "border-border opacity-60";
          } else if (picked) {
            cls = "border-primary";
          }
          return (
            <button
              key={i}
              disabled={!!reveal}
              onClick={() => {
                const next = new Set(answer.picks);
                if (next.has(i)) next.delete(i);
                else next.add(i);
                onChange({ kind: "multi", picks: next });
              }}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition flex items-center gap-3 ${cls}`}
            >
              <span
                className={`grid place-items-center h-5 w-5 rounded border text-[11px] shrink-0 ${
                  picked ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}
              >
                {picked ? "✓" : ""}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.kind === "truefalse" && answer.kind === "truefalse") {
    const opts: { label: string; val: boolean }[] = [
      { label: "True", val: true },
      { label: "False", val: false },
    ];
    return (
      <div className="flex gap-2">
        {opts.map((o) => {
          const picked = answer.pick === o.val;
          const isAnswer = question.answer === o.val;
          let cls = "border-border hover:border-primary/40";
          if (reveal) {
            if (isAnswer) cls = "border-primary bg-primary/10";
            else if (picked) cls = "border-destructive bg-destructive/10";
            else cls = "border-border opacity-60";
          } else if (picked) {
            cls = "border-primary";
          }
          return (
            <button
              key={o.label}
              disabled={!!reveal}
              onClick={() => onChange({ kind: "truefalse", pick: o.val })}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${cls}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.kind === "short" && answer.kind === "short") {
    return (
      <div>
        <input
          type="text"
          value={answer.text}
          disabled={!!reveal}
          onChange={(e) => onChange({ kind: "short", text: e.target.value })}
          placeholder="Type your answer…"
          className={`w-full rounded-xl border bg-background/40 px-4 py-3 text-sm outline-none transition focus:border-primary ${
            reveal
              ? correct
                ? "border-primary bg-primary/10"
                : "border-destructive bg-destructive/10"
              : "border-border"
          }`}
        />
        {reveal && (
          <div className="mt-2 text-xs text-muted-foreground">
            Accepted answers: <span className="text-foreground">{question.accept.join(", ")}</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function ResultsPane({
  quiz,
  answers,
  perQuestion,
  result,
  bestScore,
  onRetake,
  onNext,
}: {
  quiz: Quiz;
  answers: Answer[];
  perQuestion: boolean[];
  result: QuizResult;
  bestScore: number | null;
  onRetake: () => void;
  onNext: () => void;
}) {
  const isNewBest = bestScore === null || result.scorePct > bestScore;
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
      <div
        className={`rounded-2xl border p-6 ${
          result.passed
            ? "border-primary/50 bg-primary/10"
            : "border-destructive/50 bg-destructive/10"
        }`}
      >
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {result.passed ? "Passed" : "Not yet"}
            </div>
            <div className="mt-1 font-display text-6xl font-semibold ember-text">
              {result.scorePct}%
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {result.correct} of {result.total} correct · pass at {quiz.passPct}%
            </div>
          </div>
          <div className="ml-auto text-right text-xs text-muted-foreground">
            {isNewBest && bestScore !== null && (
              <div className="text-accent">New best · was {bestScore}%</div>
            )}
            {!isNewBest && bestScore !== null && <div>Best: {bestScore}%</div>}
            <div className="mt-1">Saved to your progress.</div>
          </div>
        </div>
      </div>

      <ol className="mt-8 space-y-6">
        {quiz.questions.map((q, i) => {
          const ok = perQuestion[i];
          return (
            <li key={q.id} className="border-t border-border pt-5">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 grid place-items-center h-6 w-6 rounded-full text-xs font-bold shrink-0 ${
                    ok
                      ? "bg-primary text-primary-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {ok ? "✓" : "✕"}
                </span>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-primary">
                    {kindLabel(q.kind)}
                  </div>
                  <div className="mt-1 font-medium">{q.prompt}</div>
                </div>
              </div>
              <div className="mt-3 pl-9">
                <QuestionInput
                  question={q}
                  answer={answers[i]}
                  onChange={() => {}}
                  reveal
                  correct={ok}
                />
                <div
                  className={`mt-3 rounded-lg border p-3 text-sm ${
                    ok ? "border-primary/40 bg-primary/5" : "border-destructive/40 bg-destructive/5"
                  }`}
                >
                  <span className="font-semibold">
                    {ok ? "Why this is right:" : "Why this is wrong:"}
                  </span>{" "}
                  {q.explain}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
        <button
          onClick={onRetake}
          className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          Retake quiz
        </button>
        <button
          onClick={onNext}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
