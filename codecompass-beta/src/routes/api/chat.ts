import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const { message, role = "apprentice", edition = "2026" } = body;

          if (!message || typeof message !== "string") {
            return new Response(JSON.stringify({ error: "No message provided" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const apiKey =
            process.env.GEMINI_API_KEY ||
            process.env.GOOGLE_API_KEY ||
            process.env.GOOGLE_GENERATIVE_AI_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({
                error: "Configuration error",
                message: "GEMINI_API_KEY not configured on server",
              }),
              {
                status: 500,
                headers: { "content-type": "application/json" },
              },
            );
          }

          const validRoles = ["apprentice", "journeyman", "master"] as const;
          type ValidRole = (typeof validRoles)[number];
          const activeRole: ValidRole = validRoles.includes(role as ValidRole)
            ? (role as ValidRole)
            : "apprentice";

          const genAI = new GoogleGenerativeAI(apiKey);
          const modelName = "gemini-3.7-flash";
          const model = genAI.getGenerativeModel({ model: modelName });

          const prompt = `You are the Code Compass NEC Co-Pilot. You provide educational decision support for electrical trade professionals and apprentices.

TRADE-LEVEL OUTPUT RULES:
${
  activeRole === "apprentice"
    ? `APPRENTICE PROTOCOL (Book Navigation & Learning Focus):
1. Quick Answer: Output the concise, direct Quick Answer first.
2. 5-Step NEC Code Navigation Protocol & Manual Math Breakdown (Teach physical book navigation):
   - Step 1: Index Key Words (Search Strategy) - State the exact primary subject/term to look up in the physical NEC Index (e.g., search "Tubing, Electrical Metallic" instead of "EMT").
   - Step 2: Chapter & Article Path - Map out the structural path through the NEC (e.g., Chapter 3 Wiring Methods -> Article 358 EMT -> Chapter 9 Tables).
   - Step 3: Table & Section Lookup - Detail how to locate exact values in code tables or sections (e.g., Chapter 9 Table 4 for raceway area, Table 5 for conductor area, or Annex C for pre-calculated fill).
   - Step 4: Step-by-Step Calculation & Manual Math Breakdown - Show clear manual mathematical steps using the extracted code numbers and values so the apprentice masters manual calculation fundamentals.
   - Step 5: Cross-References & Field Exceptions - List mandatory follow-up sections, derating factors, and safety rules.
Goal: Train the apprentice to navigate the physical codebook and perform trade calculations under exam and jobsite conditions.`
    : `JOURNEYMAN & MASTER PROTOCOL (Rapid Jobsite Verification Focus):
1. Quick Answer & Exact NEC Citation: Output the direct bottom-line Quick Answer and exact NEC article, section, and table citations first.
2. Field Verification Notes & Exception Cross-References: Provide rapid verification points for immediate on-site verification, including:
   - Conductor ampacity derating and ambient temperature adjustment factors (Table 310.15/Article 310)
   - Nipple fill rules and raceway length exceptions (Chapter 9 Note 4 for raceways <= 24 inches / 600mm)
   - Continuous load rules (125% sizing where applicable)
   - Terminal temperature ratings (60°C / 75°C / 90°C per 110.14(C))
   - Authority Having Jurisdiction (AHJ) notes and common local inspection checkpoints.
Goal: Rapid on-site verification and exception cross-referencing without unnecessary exposition.`
}

SAFETY DIRECTIVE:
1. This tool provides educational guidance only. It does NOT replace the applicable adopted code, local amendments, authority having jurisdiction (AHJ), employer procedures, licensed electrician, engineer, inspector, or required supervision.
2. Do NOT fabricate NEC article or section citations. Verify all requirements against your local adopted codebook and AHJ.
3. Do NOT use trademarked terms such as "Codeology".

USER CONTEXT:
- Role: ${activeRole === "apprentice" ? "Apprentice" : activeRole === "journeyman" ? "Journeyman" : "Master"}
- Edition: NEC ${edition}
- Question: "${message}"`;

          const result = await model.generateContent(prompt);
          const text = result.response.text();

          return new Response(JSON.stringify({ text, message: text, role: activeRole }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Unknown error";
          return new Response(
            JSON.stringify({ error: "Failed to process message", message: errMsg }),
            {
              status: 500,
              headers: { "content-type": "application/json" },
            },
          );
        }
      },
    },
  },
});
