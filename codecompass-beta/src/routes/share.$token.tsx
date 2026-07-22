import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { COURSES, TRADES } from "@/lib/curriculum";

export const Route = createFileRoute("/share/$token")({
  head: () => ({ meta: [{ title: "Shared progress — Code Compass" }] }),
  component: SharePage,
});

type Payload = {
  label: string | null;
  createdAt: string;
  profile: { display_name?: string | null; nec_edition?: string | null };
  lessons: { course_id: string; lesson_key: string; completed_at: string }[];
  quizzes: {
    course_id: string;
    module_id: string;
    attempts: number;
    best_score_pct: number;
    best_passed: boolean;
    best_at: string | null;
    last_score_pct: number;
    last_passed: boolean;
    last_at: string | null;
  }[];
};

function SharePage() {
  const { token } = Route.useParams();
  const [data, setData] = useState<Payload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/public/share/${token}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("This share link is invalid or has been revoked.");
        return r.json();
      })
      .then(setData)
      .catch((e) => setErr(String(e.message ?? e)));
  }, [token]);

  if (err) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl">Link unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">{err}</p>
        <Link to="/" className="mt-6 inline-block text-primary">
          ← Home
        </Link>
      </main>
    );
  }
  if (!data) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-sm text-muted-foreground">Loading…</main>
    );
  }

  const lessonSet = new Map<string, Set<string>>();
  for (const l of data.lessons) {
    if (!lessonSet.has(l.course_id)) lessonSet.set(l.course_id, new Set());
    lessonSet.get(l.course_id)!.add(l.lesson_key);
  }
  const quizByCourse = new Map<string, Map<string, Payload["quizzes"][number]>>();
  for (const q of data.quizzes) {
    if (!quizByCourse.has(q.course_id)) quizByCourse.set(q.course_id, new Map());
    quizByCourse.get(q.course_id)!.set(q.module_id, q);
  }

  const name = data.profile.display_name || "Code Compass apprentice";
  const totalLessons = COURSES.reduce(
    (n, c) => n + c.modules.reduce((m, mm) => m + mm.lessons.length, 0),
    0,
  );
  const totalQuizzes = COURSES.reduce((n, c) => n + c.modules.length, 0);
  const doneLessons = data.lessons.length;
  const passedQuizzes = data.quizzes.filter((q) => q.best_passed).length;

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6">
        <div className="text-[10px] uppercase tracking-[0.18em] text-primary">
          Read-only foreman view
        </div>
        <h1 className="mt-1 font-display text-3xl font-semibold">{name}'s progress</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {data.label ? `Shared link: ${data.label}. ` : ""}
          NEC {data.profile.nec_edition ?? "—"} · shared{" "}
          {new Date(data.createdAt).toLocaleDateString()}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Lessons" value={`${doneLessons}/${totalLessons}`} />
          <Stat label="Quizzes passed" value={`${passedQuizzes}/${totalQuizzes}`} />
          <Stat
            label="NEC edition"
            value={data.profile.nec_edition ? `NEC ${data.profile.nec_edition}` : "—"}
          />
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {COURSES.map((c) => {
          const lessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
          const quizzes = c.modules.length;
          const doneLcount = lessonSet.get(c.id)?.size ?? 0;
          const passed = Array.from(quizByCourse.get(c.id)?.values() ?? []).filter(
            (r) => r.best_passed,
          ).length;
          const pct = Math.round(((doneLcount + passed) / (lessons + quizzes)) * 100);
          return (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-accent">
                    {TRADES.find((t) => t.id === c.trade)?.name} · {c.level}
                  </div>
                  <div className="mt-1 font-display text-xl font-semibold">{c.title}</div>
                </div>
                <div className="text-sm font-semibold">{pct}%</div>
              </div>
              <div className="mt-3 space-y-2">
                {c.modules.map((m) => {
                  const q = quizByCourse.get(c.id)?.get(m.id);
                  return (
                    <div key={m.id} className="rounded-md border border-border bg-background p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{m.title}</span>
                        {q?.best_passed ? (
                          <span className="text-xs font-semibold text-primary">
                            ✓ {q.best_score_pct}%
                          </span>
                        ) : q ? (
                          <span className="text-xs text-muted-foreground">
                            attempted — best {q.best_score_pct}%
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">not attempted</span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                        {m.lessons.map((l) => {
                          const done = lessonSet.get(c.id)?.has(`${m.id}:${l.id}`);
                          return (
                            <span
                              key={l.id}
                              className={`rounded px-1.5 py-0.5 border ${
                                done
                                  ? "border-primary/40 bg-primary/10 text-primary"
                                  : "border-border bg-secondary/40 text-muted-foreground"
                              }`}
                            >
                              {done ? "✓" : "○"} {l.title}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="font-display text-xl font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
}
