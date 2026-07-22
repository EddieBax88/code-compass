import { useEffect, useState, useCallback, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const KEY = "tradesmith.progress.v2";
const MIGRATED_KEY = "tradesmith.progress.migrated";

export type QuizResult = {
  scorePct: number;
  correct: number;
  total: number;
  passed: boolean;
  at: number;
};

export type ModuleQuizRecord = {
  attempts: number;
  best: QuizResult;
  last: QuizResult;
};

export type ProgressState = {
  lessons: Record<string, string[]>;
  quizResults: Record<string, Record<string, ModuleQuizRecord>>;
};

const empty: ProgressState = { lessons: {}, quizResults: {} };

// ------------- localStorage plumbing (guest mode) -------------
function readLocal(): ProgressState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return {
      lessons: parsed.lessons ?? {},
      quizResults: parsed.quizResults ?? {},
    };
  } catch {
    return empty;
  }
}

function writeLocal(s: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("tradesmith:progress"));
}

// ------------- cloud <-> shape conversion -------------
async function loadCloud(userId: string): Promise<ProgressState> {
  const [lessonsRes, quizzesRes] = await Promise.all([
    supabase.from("lesson_completions").select("course_id, lesson_key").eq("user_id", userId),
    supabase.from("quiz_results").select("*").eq("user_id", userId),
  ]);

  const lessons: Record<string, string[]> = {};
  for (const row of lessonsRes.data ?? []) {
    (lessons[row.course_id] ||= []).push(row.lesson_key);
  }

  const quizResults: Record<string, Record<string, ModuleQuizRecord>> = {};
  for (const q of quizzesRes.data ?? []) {
    const byCourse = (quizResults[q.course_id] ||= {});
    byCourse[q.module_id] = {
      attempts: q.attempts,
      best: {
        scorePct: q.best_score_pct,
        correct: q.best_correct,
        total: q.best_total,
        passed: q.best_passed,
        at: q.best_at ? new Date(q.best_at).getTime() : 0,
      },
      last: {
        scorePct: q.last_score_pct,
        correct: q.last_correct,
        total: q.last_total,
        passed: q.last_passed,
        at: q.last_at ? new Date(q.last_at).getTime() : 0,
      },
    };
  }
  return { lessons, quizResults };
}

async function upsertLessonCloud(userId: string, courseId: string, key: string) {
  await supabase
    .from("lesson_completions")
    .upsert(
      { user_id: userId, course_id: courseId, lesson_key: key },
      { onConflict: "user_id,course_id,lesson_key" },
    );
}
async function deleteLessonCloud(userId: string, courseId: string, key: string) {
  await supabase
    .from("lesson_completions")
    .delete()
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("lesson_key", key);
}
async function upsertQuizCloud(
  userId: string,
  courseId: string,
  moduleId: string,
  rec: ModuleQuizRecord,
) {
  await supabase.from("quiz_results").upsert(
    {
      user_id: userId,
      course_id: courseId,
      module_id: moduleId,
      attempts: rec.attempts,
      best_score_pct: rec.best.scorePct,
      best_correct: rec.best.correct,
      best_total: rec.best.total,
      best_passed: rec.best.passed,
      best_at: new Date(rec.best.at).toISOString(),
      last_score_pct: rec.last.scorePct,
      last_correct: rec.last.correct,
      last_total: rec.last.total,
      last_passed: rec.last.passed,
      last_at: new Date(rec.last.at).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_id,module_id" },
  );
}

// One-time migration from localStorage into the user's cloud account.
async function migrateLocalToCloud(user: User) {
  if (typeof window === "undefined") return;
  const flag = window.localStorage.getItem(MIGRATED_KEY);
  if (flag === user.id) return;
  const local = readLocal();
  const jobs: Promise<unknown>[] = [];
  for (const [courseId, keys] of Object.entries(local.lessons)) {
    for (const k of keys) jobs.push(upsertLessonCloud(user.id, courseId, k));
  }
  for (const [courseId, byModule] of Object.entries(local.quizResults)) {
    for (const [moduleId, rec] of Object.entries(byModule)) {
      jobs.push(upsertQuizCloud(user.id, courseId, moduleId, rec));
    }
  }
  await Promise.allSettled(jobs);
  window.localStorage.setItem(MIGRATED_KEY, user.id);
}

// ------------- Hook -------------
export function useProgress() {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<ProgressState>(empty);
  const [loading, setLoading] = useState(true);
  const userIdRef = useRef<string | null>(null);

  // Local (guest) hydration + storage sync
  useEffect(() => {
    if (authLoading) return;
    if (user) return; // cloud path handles it
    setState(readLocal());
    setLoading(false);
    const onChange = () => setState(readLocal());
    window.addEventListener("tradesmith:progress", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("tradesmith:progress", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [user, authLoading]);

  // Cloud hydration + migration on sign-in
  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    userIdRef.current = user.id;
    (async () => {
      await migrateLocalToCloud(user);
      const cloud = await loadCloud(user.id);
      if (!cancelled) {
        setState(cloud);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const markLesson = useCallback(
    (courseId: string, key: string) => {
      const uid = userIdRef.current;
      if (user && uid) {
        setState((s) => {
          const arr = new Set(s.lessons[courseId] ?? []);
          arr.add(key);
          return { ...s, lessons: { ...s.lessons, [courseId]: Array.from(arr) } };
        });
        upsertLessonCloud(uid, courseId, key).catch(console.error);
      } else {
        const s = readLocal();
        const arr = new Set(s.lessons[courseId] ?? []);
        arr.add(key);
        s.lessons[courseId] = Array.from(arr);
        writeLocal(s);
      }
    },
    [user],
  );

  const unmarkLesson = useCallback(
    (courseId: string, key: string) => {
      const uid = userIdRef.current;
      if (user && uid) {
        setState((s) => {
          const arr = new Set(s.lessons[courseId] ?? []);
          arr.delete(key);
          return { ...s, lessons: { ...s.lessons, [courseId]: Array.from(arr) } };
        });
        deleteLessonCloud(uid, courseId, key).catch(console.error);
      } else {
        const s = readLocal();
        const arr = new Set(s.lessons[courseId] ?? []);
        arr.delete(key);
        s.lessons[courseId] = Array.from(arr);
        writeLocal(s);
      }
    },
    [user],
  );

  const recordQuiz = useCallback(
    (courseId: string, moduleId: string, result: QuizResult) => {
      const uid = userIdRef.current;
      if (user && uid) {
        setState((s) => {
          const byCourse = { ...(s.quizResults[courseId] ?? {}) };
          const prev = byCourse[moduleId];
          const best = !prev || result.scorePct > prev.best.scorePct ? result : prev.best;
          const rec: ModuleQuizRecord = {
            attempts: (prev?.attempts ?? 0) + 1,
            best,
            last: result,
          };
          byCourse[moduleId] = rec;
          upsertQuizCloud(uid, courseId, moduleId, rec).catch(console.error);
          return { ...s, quizResults: { ...s.quizResults, [courseId]: byCourse } };
        });
      } else {
        const s = readLocal();
        const byCourse = s.quizResults[courseId] ?? {};
        const prev = byCourse[moduleId];
        const best = !prev || result.scorePct > prev.best.scorePct ? result : prev.best;
        byCourse[moduleId] = {
          attempts: (prev?.attempts ?? 0) + 1,
          best,
          last: result,
        };
        s.quizResults[courseId] = byCourse;
        writeLocal(s);
      }
    },
    [user],
  );

  const reset = useCallback(() => {
    if (!user) writeLocal(empty);
    // (cloud reset is intentionally not exposed to avoid destructive UI paths)
  }, [user]);

  return { state, markLesson, unmarkLesson, recordQuiz, reset, loading };
}

export function quizPassed(state: ProgressState, courseId: string, moduleId: string) {
  return state.quizResults[courseId]?.[moduleId]?.best.passed ?? false;
}

export function quizBest(state: ProgressState, courseId: string, moduleId: string) {
  return state.quizResults[courseId]?.[moduleId]?.best ?? null;
}

export function courseProgress(
  state: ProgressState,
  courseId: string,
  totalLessons: number,
  totalQuizzes: number,
) {
  const lessons = state.lessons[courseId]?.length ?? 0;
  const passedQuizzes = Object.values(state.quizResults[courseId] ?? {}).filter(
    (r) => r.best.passed,
  ).length;
  const total = totalLessons + totalQuizzes;
  if (total === 0) return 0;
  return Math.round(((lessons + passedQuizzes) / total) * 100);
}

export function courseAverageScore(state: ProgressState, courseId: string) {
  const recs = Object.values(state.quizResults[courseId] ?? {});
  if (recs.length === 0) return null;
  const sum = recs.reduce((n, r) => n + r.best.scorePct, 0);
  return Math.round(sum / recs.length);
}

export type WeakSpot = {
  courseId: string;
  moduleId: string;
  score: number; // best score pct (0-100), or -1 if never attempted
  attempts: number;
  passed: boolean;
  weakness: number; // higher = weaker; sortable
  reason: "failing" | "struggling" | "shaky" | "untested";
};

/**
 * Rank modules by how much the learner should revisit them.
 * Considers modules from courses the user has started (any lesson done
 * or any quiz attempted). Highest `weakness` first.
 *
 * Scoring intuition:
 *   - Never attempted a quiz on a started course → moderate priority (untested)
 *   - Attempted but not passing → high priority, scaled by how far from 80
 *     and multiplied by attempts (more failed tries = keeps missing it)
 *   - Passed but below 100 → low priority, decays as score approaches 100
 */
export function weakestModules(
  state: ProgressState,
  courses: {
    id: string;
    modules: { id: string; lessons: unknown[] }[];
  }[],
  limit = 3,
): WeakSpot[] {
  const startedCourses = courses.filter(
    (c) =>
      (state.lessons[c.id]?.length ?? 0) > 0 ||
      Object.keys(state.quizResults[c.id] ?? {}).length > 0,
  );

  const spots: WeakSpot[] = [];
  for (const c of startedCourses) {
    const doneLessons = new Set(state.lessons[c.id] ?? []);
    for (const m of c.modules) {
      const rec = state.quizResults[c.id]?.[m.id];
      // Only surface modules the user has read at least one lesson from
      // OR taken the quiz for — otherwise it's just "haven't started yet".
      const hasLessonProgress = m.lessons.some((l) =>
        doneLessons.has(`${m.id}:${(l as { id: string }).id}`),
      );
      if (!rec && !hasLessonProgress) continue;

      if (!rec) {
        spots.push({
          courseId: c.id,
          moduleId: m.id,
          score: -1,
          attempts: 0,
          passed: false,
          weakness: 40, // moderate: read but never tested
          reason: "untested",
        });
        continue;
      }
      const best = rec.best.scorePct;
      const attempts = rec.attempts;
      if (!rec.best.passed) {
        // Failing: distance below the 80% pass line dominates, attempts amplify
        const gap = Math.max(0, 80 - best);
        spots.push({
          courseId: c.id,
          moduleId: m.id,
          score: best,
          attempts,
          passed: false,
          weakness: 100 + gap + attempts * 8,
          reason: attempts >= 3 ? "failing" : "struggling",
        });
      } else if (best < 100) {
        // Passed but not clean — worth a polish pass
        spots.push({
          courseId: c.id,
          moduleId: m.id,
          score: best,
          attempts,
          passed: true,
          weakness: Math.max(0, 100 - best) / 2, // 0..50
          reason: "shaky",
        });
      }
    }
  }
  spots.sort((a, b) => b.weakness - a.weakness);
  return spots.slice(0, limit);
}
