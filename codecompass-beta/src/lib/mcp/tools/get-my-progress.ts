import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { COURSES } from "@/lib/curriculum";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: "Bearer " + ctx.getToken() } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_my_progress",
  title: "Get my Code Compass progress",
  description:
    "Return an overall summary of the signed-in user's Code Compass progress: lessons completed, quizzes attempted, quizzes passed (>=80%), and per-course completion percentages.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supa = supabaseForUser(ctx);
    const userId = ctx.getUserId();
    const [{ data: lessons, error: le }, { data: quizzes, error: qe }, { data: profile }] =
      await Promise.all([
        supa.from("lesson_completions").select("course_id, lesson_key").eq("user_id", userId),
        supa
          .from("quiz_results")
          .select("course_id, module_id, best_score_pct, best_passed, attempts")
          .eq("user_id", userId),
        supa.from("profiles").select("nec_edition, display_name").eq("id", userId).maybeSingle(),
      ]);
    if (le || qe)
      return {
        content: [{ type: "text", text: (le ?? qe)!.message }],
        isError: true,
      };

    const lessonsByCourse = new Map<string, Set<string>>();
    for (const r of lessons ?? []) {
      if (!lessonsByCourse.has(r.course_id)) lessonsByCourse.set(r.course_id, new Set());
      lessonsByCourse.get(r.course_id)!.add(r.lesson_key);
    }
    const quizzesByCourse = new Map<string, Map<string, { pct: number; passed: boolean }>>();
    for (const q of quizzes ?? []) {
      if (!quizzesByCourse.has(q.course_id)) quizzesByCourse.set(q.course_id, new Map());
      quizzesByCourse
        .get(q.course_id)!
        .set(q.module_id, { pct: q.best_score_pct, passed: q.best_passed });
    }

    let totalLessons = 0,
      completedLessons = 0,
      totalQuizzes = 0,
      passedQuizzes = 0;
    const perCourse = COURSES.map((c) => {
      const doneL = lessonsByCourse.get(c.id) ?? new Set<string>();
      const cQ = quizzesByCourse.get(c.id) ?? new Map();
      let lc = 0,
        qc = 0,
        pc = 0;
      for (const m of c.modules) {
        for (const l of m.lessons) {
          totalLessons++;
          lc++;
          if (doneL.has(l.id)) completedLessons++;
        }
        if (m.quiz && m.quiz.questions.length > 0) {
          totalQuizzes++;
          qc++;
          const q = cQ.get(m.id);
          if (q?.passed) {
            passedQuizzes++;
            pc++;
          }
        }
      }
      const done = [...doneL].filter((k) =>
        c.modules.some((m) => m.lessons.some((l) => l.id === k)),
      ).length;
      const totalItems = lc + qc;
      const doneItems = done + pc;
      return {
        course_id: c.id,
        title: c.title,
        trade: c.trade,
        completion_pct: totalItems ? Math.round((doneItems / totalItems) * 100) : 0,
        lessons_completed: done,
        lessons_total: lc,
        quizzes_passed: pc,
        quizzes_total: qc,
      };
    });

    const summary = {
      user_id: userId,
      display_name: profile?.display_name ?? null,
      nec_edition: profile?.nec_edition ?? null,
      totals: {
        lessons_completed: completedLessons,
        lessons_total: totalLessons,
        quizzes_passed: passedQuizzes,
        quizzes_total: totalQuizzes,
        courses_completed: perCourse.filter((c) => c.completion_pct === 100).length,
      },
      courses: perCourse,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
