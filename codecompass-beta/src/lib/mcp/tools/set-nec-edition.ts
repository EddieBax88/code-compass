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
  name: "set_nec_edition",
  title: "Set my NEC edition",
  description:
    "Update the signed-in user's active NEC edition (2017, 2020, or 2023). This edition is used for citations across Code Compass lessons and quizzes.",
  inputSchema: {
    edition: z.enum(["2017", "2020", "2023"]).describe("NEC edition to make active."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  handler: async ({ edition }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supa = supabaseForUser(ctx);
    const { error } = await supa
      .from("profiles")
      .update({ nec_edition: edition })
      .eq("id", ctx.getUserId());
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `NEC edition set to ${edition}.` }],
      structuredContent: { nec_edition: edition },
    };
  },
});
