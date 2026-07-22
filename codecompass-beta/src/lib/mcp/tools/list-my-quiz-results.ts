import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: "Bearer " + ctx.getToken() } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_my_quiz_results",
  title: "List my quiz results",
  description:
    "List the signed-in user's quiz results across Code Compass modules, including best score, attempts, and pass status. Optionally filter by course_id.",
  inputSchema: {
    course_id: z.string().optional().describe("Optional Code Compass course id to filter by."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ course_id }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    let q = supabaseForUser(ctx)
      .from("quiz_results")
      .select(
        "course_id, module_id, attempts, best_score_pct, best_correct, best_total, best_passed, last_score_pct, last_passed, last_at",
      )
      .eq("user_id", ctx.getUserId())
      .order("last_at", { ascending: false });
    if (course_id) q = q.eq("course_id", course_id);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { results: data ?? [] },
    };
  },
});
