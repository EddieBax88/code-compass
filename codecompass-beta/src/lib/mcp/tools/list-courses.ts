import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { COURSES } from "@/lib/curriculum";

export default defineTool({
  name: "list_courses",
  title: "List Code Compass courses",
  description:
    "List Code Compass courses and their modules with lesson and quiz counts. Optionally filter by trade.",
  inputSchema: {
    trade: z.enum(["electrical", "plumbing", "hvac"]).optional().describe("Optional trade filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ trade }) => {
    const filtered = trade ? COURSES.filter((c) => c.trade === trade) : COURSES;
    const shape = filtered.map((c) => ({
      id: c.id,
      title: c.title,
      trade: c.trade,
      level: c.level,
      modules: c.modules.map((m) => ({
        id: m.id,
        title: m.title,
        lessons: m.lessons.length,
        quiz_questions: m.quiz?.questions.length ?? 0,
      })),
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(shape, null, 2) }],
      structuredContent: { courses: shape },
    };
  },
});
