import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useNecEdition } from "./nec-edition-7h2QGTQt.mjs";
import { n as TRADES, r as applyEdition } from "./curriculum-BoKKyowv.mjs";
import { t as Route } from "./course._courseId-DrjxAaiN.mjs";
import {
  i as useProgress,
  n as quizBest,
  r as quizPassed,
  t as courseProgress,
} from "./progress-DY0V9J-M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/course._courseId-CpV9MbB2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CoursePage() {
  const { course: rawCourse } = Route.useLoaderData();
  const { focus } = Route.useSearch();
  const { edition } = useNecEdition();
  const course = (0, import_react.useMemo)(
    () => applyEdition(rawCourse, edition),
    [rawCourse, edition],
  );
  const { state, markLesson, unmarkLesson, recordQuiz } = useProgress();
  const [selection, setSelection] = (0, import_react.useState)(
    (0, import_react.useMemo)(() => {
      if (focus && course.modules.some((m) => m.id === focus))
        return {
          kind: "quiz",
          moduleId: focus,
        };
      return { kind: "overview" };
    }, [focus, course]),
  );
  const trade = TRADES.find((t) => t.id === course.trade);
  const lessonsTotal = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const quizzesTotal = course.modules.length;
  const pct = courseProgress(state, course.id, lessonsTotal, quizzesTotal);
  const completed = new Set(state.lessons[course.id] ?? []);
  const passedQuizCount = course.modules.filter((m) => quizPassed(state, course.id, m.id)).length;
  const flatNav = (0, import_react.useMemo)(() => {
    const out = [];
    for (const m of course.modules) {
      for (const l of m.lessons)
        out.push({
          kind: "lesson",
          moduleId: m.id,
          lessonId: l.id,
        });
      out.push({
        kind: "quiz",
        moduleId: m.id,
      });
    }
    return out;
  }, [course]);
  const nextUp = (0, import_react.useMemo)(() => {
    for (const s of flatNav)
      if (s.kind === "lesson") {
        if (!completed.has(`${s.moduleId}:${s.lessonId}`)) return s;
      } else if (!quizPassed(state, course.id, s.moduleId)) return s;
    return null;
  }, [flatNav, completed, state, course.id]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
    className: "mx-auto max-w-6xl px-5 pb-20 pt-8",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "flex items-center gap-2 text-xs text-muted-foreground",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
            to: "/",
            className: "hover:text-foreground",
            children: "Home",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
            to: "/courses/$trade",
            params: { trade: course.trade },
            className: "hover:text-foreground",
            children: trade.name,
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
            className: "truncate",
            children: course.title,
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8 grain relative",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "text-[10px] uppercase tracking-[0.2em] text-accent",
            children: [trade.name, " · ", course.level],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
            className: "mt-2 font-display text-4xl sm:text-5xl font-semibold leading-tight",
            children: course.title,
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "mt-3 text-muted-foreground max-w-2xl",
            children: course.tagline,
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "mt-4 max-w-2xl text-sm",
            children: course.why,
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "mt-6 flex flex-wrap items-center gap-4",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                className: "flex-1 min-w-[200px]",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                    className: "h-2 w-full rounded-full bg-secondary overflow-hidden",
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                      className: "h-full bg-gradient-to-r from-primary to-accent transition-all",
                      style: { width: `${pct}%` },
                    }),
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                    className: "mt-2 text-xs text-muted-foreground",
                    children: [
                      pct,
                      "% complete · ",
                      completed.size,
                      "/",
                      lessonsTotal,
                      " lessons · ",
                      passedQuizCount,
                      "/",
                      quizzesTotal,
                      " quizzes passed",
                    ],
                  }),
                ],
              }),
              nextUp &&
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                  onClick: () => setSelection(nextUp),
                  className:
                    "rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90",
                  children: pct === 0 ? "Start course" : "Continue →",
                }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "mt-8 grid gap-6 lg:grid-cols-[320px_1fr]",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
            className: "rounded-2xl border border-border bg-card p-3 h-fit lg:sticky lg:top-20",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                onClick: () => setSelection({ kind: "overview" }),
                className: `w-full text-left px-3 py-2 rounded-md text-sm ${selection.kind === "overview" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"}`,
                children: "Overview",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                className: "mt-2 space-y-3",
                children: course.modules.map((m, i) => {
                  const qPassed = quizPassed(state, course.id, m.id);
                  const best = quizBest(state, course.id, m.id);
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "div",
                    {
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                          className:
                            "px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
                          children: ["Module ", i + 1],
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "px-3 pb-1 font-medium text-sm",
                          children: m.title,
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
                          className: "mt-1",
                          children: [
                            m.lessons.map((l) => {
                              const key = `${m.id}:${l.id}`;
                              const done = completed.has(key);
                              return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                "li",
                                {
                                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
                                    onClick: () =>
                                      setSelection({
                                        kind: "lesson",
                                        moduleId: m.id,
                                        lessonId: l.id,
                                      }),
                                    className: `w-full flex items-center gap-2 text-left px-3 py-1.5 rounded-md text-sm ${selection.kind === "lesson" && selection.moduleId === m.id && selection.lessonId === l.id ? "bg-secondary" : "hover:bg-secondary/60"}`,
                                    children: [
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                                        className: `grid place-items-center h-4 w-4 rounded-full border text-[10px] shrink-0 ${done ? "border-primary bg-primary text-primary-foreground" : "border-border"}`,
                                        children: done ? "✓" : "",
                                      }),
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                                        className: "truncate",
                                        children: l.title,
                                      }),
                                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                                        className: "ml-auto text-[10px] text-muted-foreground",
                                        children: [l.minutes, "m"],
                                      }),
                                    ],
                                  }),
                                },
                                l.id,
                              );
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
                              children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
                                onClick: () =>
                                  setSelection({
                                    kind: "quiz",
                                    moduleId: m.id,
                                  }),
                                className: `w-full flex items-center gap-2 text-left px-3 py-1.5 rounded-md text-sm ${selection.kind === "quiz" && selection.moduleId === m.id ? "bg-secondary" : "hover:bg-secondary/60"}`,
                                children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                                    className: `grid place-items-center h-4 w-4 rounded-full border text-[10px] shrink-0 ${qPassed ? "border-accent bg-accent text-accent-foreground" : "border-border"}`,
                                    children: qPassed ? "✓" : "?",
                                  }),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                                    className: "text-accent flex-1 truncate",
                                    children: "Module quiz",
                                  }),
                                  best &&
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                                      className: "text-[10px] text-muted-foreground",
                                      children: [best.scorePct, "%"],
                                    }),
                                ],
                              }),
                            }),
                          ],
                        }),
                      ],
                    },
                    m.id,
                  );
                }),
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
            className: "min-w-0",
            children: [
              selection.kind === "overview" &&
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewPane, {
                  course,
                  completed,
                  onPick: setSelection,
                }),
              selection.kind === "lesson" &&
                (() => {
                  const mod = course.modules.find((m) => m.id === selection.moduleId);
                  const lesson = mod.lessons.find((l) => l.id === selection.lessonId);
                  const key = `${mod.id}:${lesson.id}`;
                  const done = completed.has(key);
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonPane, {
                    module: mod,
                    lesson,
                    done,
                    onToggleDone: () =>
                      done ? unmarkLesson(course.id, key) : markLesson(course.id, key),
                    onNext: () => {
                      if (!done) markLesson(course.id, key);
                      const idx = flatNav.findIndex(
                        (s) =>
                          s.kind === "lesson" && s.moduleId === mod.id && s.lessonId === lesson.id,
                      );
                      const next = flatNav[idx + 1];
                      if (next) setSelection(next);
                    },
                  });
                })(),
              selection.kind === "quiz" &&
                (() => {
                  const mod = course.modules.find((m) => m.id === selection.moduleId);
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    QuizRunner,
                    {
                      module: mod,
                      bestScore: quizBest(state, course.id, mod.id)?.scorePct ?? null,
                      onComplete: (result) => recordQuiz(course.id, mod.id, result),
                      onNext: () => {
                        const idx = flatNav.findIndex(
                          (s) => s.kind === "quiz" && s.moduleId === mod.id,
                        );
                        const next = flatNav[idx + 1];
                        if (next) setSelection(next);
                        else setSelection({ kind: "overview" });
                      },
                    },
                    mod.id,
                  );
                })(),
            ],
          }),
        ],
      }),
    ],
  });
}
function OverviewPane({ course, completed, onPick }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "rounded-2xl border border-border bg-card p-6 sm:p-8",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
        className: "font-display text-2xl font-semibold",
        children: "What you'll learn",
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
        className: "mt-5 space-y-4",
        children: course.modules.map((m, i) => {
          const allLessonsDone = m.lessons.every((l) => completed.has(`${m.id}:${l.id}`));
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "li",
            {
              className: "rounded-xl border border-border p-4 hover:border-primary/40 transition",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "flex items-start justify-between gap-3",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                          className:
                            "text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
                          children: ["Module ", i + 1],
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "mt-1 font-display text-lg font-semibold",
                          children: m.title,
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "text-sm text-muted-foreground",
                          children: m.summary,
                        }),
                      ],
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      className: "text-xs text-muted-foreground shrink-0",
                      children: [
                        m.lessons.length,
                        " lessons · ",
                        m.quiz.questions.length,
                        " questions",
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "mt-3 flex flex-wrap gap-2",
                  children: [
                    m.lessons.map((l) =>
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "button",
                        {
                          onClick: () =>
                            onPick({
                              kind: "lesson",
                              moduleId: m.id,
                              lessonId: l.id,
                            }),
                          className: `text-xs rounded-full border px-3 py-1 transition ${completed.has(`${m.id}:${l.id}`) ? "border-primary/60 bg-primary/10 text-foreground" : "border-border hover:border-primary/50"}`,
                          children: [completed.has(`${m.id}:${l.id}`) ? "✓ " : "", l.title],
                        },
                        l.id,
                      ),
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                      onClick: () =>
                        onPick({
                          kind: "quiz",
                          moduleId: m.id,
                        }),
                      className: `text-xs rounded-full border px-3 py-1 transition ${allLessonsDone ? "border-accent text-accent hover:bg-accent/10" : "border-border text-muted-foreground"}`,
                      children: "Take quiz",
                    }),
                  ],
                }),
              ],
            },
            m.id,
          );
        }),
      }),
    ],
  });
}
function LessonPane({ module: mod, lesson, done, onToggleDone, onNext }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
    className: "rounded-2xl border border-border bg-card p-6 sm:p-10",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className: "text-[10px] uppercase tracking-[0.18em] text-accent",
        children: mod.title,
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
        className: "mt-2 font-display text-3xl sm:text-4xl font-semibold leading-tight",
        children: lesson.title,
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "mt-1 text-xs text-muted-foreground",
        children: ["~", lesson.minutes, " min read"],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className: "mt-6 space-y-4 text-[15px] leading-relaxed text-foreground/90",
        children: lesson.body
          .split("\n\n")
          .map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, i)),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "mt-8 rounded-xl border border-border bg-background/40 p-5",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            className: "text-[10px] uppercase tracking-[0.18em] text-primary",
            children: "Take this to the job",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
            className: "mt-3 space-y-2 text-sm",
            children: lesson.keyPoints.map((k, i) =>
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "li",
                {
                  className: "flex gap-2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                      className: "text-primary",
                      children: "▸",
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: k }),
                  ],
                },
                i,
              ),
            ),
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "mt-8 flex flex-wrap items-center gap-3",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            onClick: onToggleDone,
            className: `rounded-md px-4 py-2 text-sm font-medium border ${done ? "border-primary bg-primary/10 text-foreground" : "border-border hover:bg-secondary"}`,
            children: done ? "✓ Marked complete" : "Mark complete",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            onClick: onNext,
            className:
              "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90",
            children: done ? "Next →" : "Mark & continue →",
          }),
        ],
      }),
    ],
  });
}
function emptyAnswer(q) {
  switch (q.kind) {
    case "single":
      return {
        kind: "single",
        pick: null,
      };
    case "multi":
      return {
        kind: "multi",
        picks: /* @__PURE__ */ new Set(),
      };
    case "truefalse":
      return {
        kind: "truefalse",
        pick: null,
      };
    case "short":
      return {
        kind: "short",
        text: "",
      };
  }
}
function answered(a) {
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
function isCorrect(q, a) {
  if (q.kind === "single" && a.kind === "single") return a.pick === q.answerIndex;
  if (q.kind === "multi" && a.kind === "multi") {
    const want = new Set(q.answerIndices);
    if (want.size !== a.picks.size) return false;
    for (const i of a.picks) if (!want.has(i)) return false;
    return true;
  }
  if (q.kind === "truefalse" && a.kind === "truefalse") return a.pick === q.answer;
  if (q.kind === "short" && a.kind === "short") {
    const t = a.text.trim().toLowerCase();
    return q.accept.some((x) => x.trim().toLowerCase() === t);
  }
  return false;
}
function QuizRunner({ module: mod, bestScore, onComplete, onNext }) {
  const quiz = mod.quiz;
  const [answers, setAnswers] = (0, import_react.useState)(() => quiz.questions.map(emptyAnswer));
  const [submitted, setSubmitted] = (0, import_react.useState)(null);
  function updateAnswer(i, next) {
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
    const result = {
      scorePct,
      correct,
      total,
      passed: scorePct >= quiz.passPct,
      at: Date.now(),
    };
    setSubmitted({
      result,
      perQuestion,
    });
    onComplete(result);
  }
  function retake() {
    setAnswers(quiz.questions.map(emptyAnswer));
    setSubmitted(null);
  }
  const allAnswered = answers.every(answered);
  if (submitted)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsPane, {
      quiz,
      answers,
      perQuestion: submitted.perQuestion,
      result: submitted.result,
      bestScore,
      onRetake: retake,
      onNext,
    });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "rounded-2xl border border-border bg-card p-6 sm:p-10",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "flex items-center justify-between gap-3",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                className: "text-[10px] uppercase tracking-[0.18em] text-accent",
                children: [mod.title, " · Knowledge check"],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
                className: "mt-2 font-display text-3xl font-semibold",
                children: [quiz.questions.length, " questions · Pass at ", quiz.passPct, "%"],
              }),
            ],
          }),
          bestScore !== null &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "text-right",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  className: "text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
                  children: "Best",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "font-display text-2xl font-semibold ember-text",
                  children: [bestScore, "%"],
                }),
              ],
            }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
        className: "mt-8 space-y-8",
        children: quiz.questions.map((q, i) =>
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "li",
            {
              className: "border-t border-border pt-6",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "flex items-baseline gap-3",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                      className: "font-display text-2xl font-semibold text-muted-foreground",
                      children: String(i + 1).padStart(2, "0"),
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      className: "flex-1",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "text-[10px] uppercase tracking-[0.16em] text-primary",
                          children: kindLabel(q.kind),
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "mt-1 text-lg font-medium",
                          children: q.prompt,
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  className: "mt-4 pl-9",
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionInput, {
                    question: q,
                    answer: answers[i],
                    onChange: (a) => updateAnswer(i, a),
                  }),
                }),
              ],
            },
            q.id,
          ),
        ),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            onClick: submit,
            disabled: !allAnswered,
            className:
              "rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-ember disabled:opacity-40 hover:opacity-90",
            children: "Submit quiz",
          }),
          !allAnswered &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
              className: "text-xs text-muted-foreground",
              children: "Answer every question to submit.",
            }),
        ],
      }),
    ],
  });
}
function kindLabel(k) {
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
function QuestionInput({ question, answer, onChange, reveal, correct }) {
  if (question.kind === "single" && answer.kind === "single")
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
      className: "space-y-2",
      children: question.options.map((opt, i) => {
        const picked = answer.pick === i;
        const isAnswer = i === question.answerIndex;
        let cls = "border-border hover:border-primary/40";
        if (reveal)
          if (isAnswer) cls = "border-primary bg-primary/10";
          else if (picked) cls = "border-destructive bg-destructive/10";
          else cls = "border-border opacity-60";
        else if (picked) cls = "border-primary";
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            disabled: !!reveal,
            onClick: () =>
              onChange({
                kind: "single",
                pick: i,
              }),
            className: `w-full text-left rounded-xl border px-4 py-3 text-sm transition ${cls}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                className: "inline-block w-6 text-muted-foreground",
                children: [String.fromCharCode(65 + i), "."],
              }),
              opt,
            ],
          },
          i,
        );
      }),
    });
  if (question.kind === "multi" && answer.kind === "multi")
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
      className: "space-y-2",
      children: question.options.map((opt, i) => {
        const picked = answer.picks.has(i);
        const isAnswer = question.answerIndices.includes(i);
        let cls = "border-border hover:border-primary/40";
        if (reveal)
          if (isAnswer && picked) cls = "border-primary bg-primary/10";
          else if (isAnswer && !picked) cls = "border-primary/60 bg-primary/5";
          else if (!isAnswer && picked) cls = "border-destructive bg-destructive/10";
          else cls = "border-border opacity-60";
        else if (picked) cls = "border-primary";
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            disabled: !!reveal,
            onClick: () => {
              const next = new Set(answer.picks);
              if (next.has(i)) next.delete(i);
              else next.add(i);
              onChange({
                kind: "multi",
                picks: next,
              });
            },
            className: `w-full text-left rounded-xl border px-4 py-3 text-sm transition flex items-center gap-3 ${cls}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className: `grid place-items-center h-5 w-5 rounded border text-[11px] shrink-0 ${picked ? "border-primary bg-primary text-primary-foreground" : "border-border"}`,
                children: picked ? "✓" : "",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt }),
            ],
          },
          i,
        );
      }),
    });
  if (question.kind === "truefalse" && answer.kind === "truefalse")
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
      className: "flex gap-2",
      children: [
        {
          label: "True",
          val: true,
        },
        {
          label: "False",
          val: false,
        },
      ].map((o) => {
        const picked = answer.pick === o.val;
        const isAnswer = question.answer === o.val;
        let cls = "border-border hover:border-primary/40";
        if (reveal)
          if (isAnswer) cls = "border-primary bg-primary/10";
          else if (picked) cls = "border-destructive bg-destructive/10";
          else cls = "border-border opacity-60";
        else if (picked) cls = "border-primary";
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            disabled: !!reveal,
            onClick: () =>
              onChange({
                kind: "truefalse",
                pick: o.val,
              }),
            className: `flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${cls}`,
            children: o.label,
          },
          o.label,
        );
      }),
    });
  if (question.kind === "short" && answer.kind === "short")
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
          type: "text",
          value: answer.text,
          disabled: !!reveal,
          onChange: (e) =>
            onChange({
              kind: "short",
              text: e.target.value,
            }),
          placeholder: "Type your answer…",
          className: `w-full rounded-xl border bg-background/40 px-4 py-3 text-sm outline-none transition focus:border-primary ${reveal ? (correct ? "border-primary bg-primary/10" : "border-destructive bg-destructive/10") : "border-border"}`,
        }),
        reveal &&
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "mt-2 text-xs text-muted-foreground",
            children: [
              "Accepted answers: ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className: "text-foreground",
                children: question.accept.join(", "),
              }),
            ],
          }),
      ],
    });
  return null;
}
function ResultsPane({ quiz, answers, perQuestion, result, bestScore, onRetake, onNext }) {
  const isNewBest = bestScore === null || result.scorePct > bestScore;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "rounded-2xl border border-border bg-card p-6 sm:p-10",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className: `rounded-2xl border p-6 ${result.passed ? "border-primary/50 bg-primary/10" : "border-destructive/50 bg-destructive/10"}`,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          className: "flex flex-wrap items-end gap-6",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
                  children: result.passed ? "Passed" : "Not yet",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "mt-1 font-display text-6xl font-semibold ember-text",
                  children: [result.scorePct, "%"],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "mt-1 text-sm text-muted-foreground",
                  children: [
                    result.correct,
                    " of ",
                    result.total,
                    " correct · pass at ",
                    quiz.passPct,
                    "%",
                  ],
                }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "ml-auto text-right text-xs text-muted-foreground",
              children: [
                isNewBest &&
                  bestScore !== null &&
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                    className: "text-accent",
                    children: ["New best · was ", bestScore, "%"],
                  }),
                !isNewBest &&
                  bestScore !== null &&
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                    children: ["Best: ", bestScore, "%"],
                  }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  className: "mt-1",
                  children: "Saved to your progress.",
                }),
              ],
            }),
          ],
        }),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
        className: "mt-8 space-y-6",
        children: quiz.questions.map((q, i) => {
          const ok = perQuestion[i];
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "li",
            {
              className: "border-t border-border pt-5",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "flex items-start gap-3",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                      className: `mt-1 grid place-items-center h-6 w-6 rounded-full text-xs font-bold shrink-0 ${ok ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`,
                      children: ok ? "✓" : "✕",
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      className: "flex-1",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "text-[10px] uppercase tracking-[0.16em] text-primary",
                          children: kindLabel(q.kind),
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "mt-1 font-medium",
                          children: q.prompt,
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "mt-3 pl-9",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionInput, {
                      question: q,
                      answer: answers[i],
                      onChange: () => {},
                      reveal: true,
                      correct: ok,
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      className: `mt-3 rounded-lg border p-3 text-sm ${ok ? "border-primary/40 bg-primary/5" : "border-destructive/40 bg-destructive/5"}`,
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                          className: "font-semibold",
                          children: ok ? "Why this is right:" : "Why this is wrong:",
                        }),
                        " ",
                        q.explain,
                      ],
                    }),
                  ],
                }),
              ],
            },
            q.id,
          );
        }),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "mt-8 flex flex-wrap gap-3 border-t border-border pt-6",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            onClick: onRetake,
            className:
              "rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary",
            children: "Retake quiz",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            onClick: onNext,
            className:
              "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-ember hover:opacity-90",
            children: "Continue →",
          }),
        ],
      }),
    ],
  });
}
//#endregion
export { CoursePage as component };
