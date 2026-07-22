import { createFileRoute } from "@tanstack/react-router";

// Server route that resolves a share token into a read-only progress payload.
// Uses the admin client to bypass RLS. Returns 404 when the token is missing
// or revoked. Never exposes the owner's email or auth data.
export const Route = createFileRoute("/api/public/share/$token")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const token = params.token;

        const { data: link } = await supabaseAdmin
          .from("share_links")
          .select("user_id, label, created_at, revoked_at")
          .eq("token", token)
          .maybeSingle();

        if (!link || link.revoked_at) {
          return new Response(JSON.stringify({ error: "not_found" }), {
            status: 404,
            headers: { "content-type": "application/json" },
          });
        }

        const [profileRes, lessonsRes, quizRes] = await Promise.all([
          supabaseAdmin
            .from("profiles")
            .select("display_name, nec_edition")
            .eq("id", link.user_id)
            .maybeSingle(),
          supabaseAdmin
            .from("lesson_completions")
            .select("course_id, lesson_key, completed_at")
            .eq("user_id", link.user_id),
          supabaseAdmin
            .from("quiz_results")
            .select(
              "course_id, module_id, attempts, best_score_pct, best_passed, best_at, last_score_pct, last_passed, last_at",
            )
            .eq("user_id", link.user_id),
        ]);

        return new Response(
          JSON.stringify({
            label: link.label,
            createdAt: link.created_at,
            profile: profileRes.data ?? {},
            lessons: lessonsRes.data ?? [],
            quizzes: quizRes.data ?? [],
          }),
          { headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});
