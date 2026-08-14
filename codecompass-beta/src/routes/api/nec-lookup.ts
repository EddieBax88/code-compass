import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";

export const Route = createFileRoute("/api/nec-lookup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        try {
          const body = await request.json().catch(() => ({}));
          const { question, role: rawRole = "apprentice", edition = "2026" } = body;

          const validRoles = ["apprentice", "journeyman", "master"] as const;
          type ValidRole = (typeof validRoles)[number];
          const role: ValidRole = validRoles.includes(rawRole as ValidRole)
            ? (rawRole as ValidRole)
            : "apprentice";

          if (!question || typeof question !== "string" || !question.trim()) {
            return new Response(JSON.stringify({ error: "Invalid question provided" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const apiKey =
            process.env.GEMINI_API_KEY ||
            process.env.GOOGLE_API_KEY ||
            process.env.GOOGLE_GENERATIVE_AI_API_KEY;
          if (!apiKey) {
            console.error(
              `[nec-lookup][${requestId}] Missing API key: GEMINI_API_KEY, GOOGLE_API_KEY, or GOOGLE_GENERATIVE_AI_API_KEY not configured`,
            );
            return new Response(
              JSON.stringify({
                error: "Server configuration error",
                message: "GEMINI_API_KEY is not configured on the server",
              }),
              {
                status: 500,
                headers: { "content-type": "application/json" },
              },
            );
          }

          const genAI = new GoogleGenerativeAI(apiKey);
          let modelName = "gemini-3.7-flash";
          let model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: "application/json",
            },
          });

          const systemPrompt = `You are the Code Compass NEC Co-Pilot. You provide educational decision support for electrical trade professionals and apprentices.

TRADE-LEVEL OUTPUT PROTOCOL:
${
  role === "apprentice"
    ? `APPRENTICE PROTOCOL (Book Navigation & Learning Focus):
1. Quick Answer: Output the concise, direct Quick Answer first.
2. 5-Step NEC Code Navigation Protocol & Manual Math Breakdown (Teach physical book navigation):
   - Step 1: Index Key Words (Search Strategy) - State the exact primary subject/term to look up in the physical NEC Index (e.g., search "Tubing, Electrical Metallic" instead of acronyms like "EMT").
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

CRITICAL SAFETY DIRECTIVE:
1. Your guidance is strictly for educational decision support. It does NOT replace the applicable adopted code, local amendments, authority having jurisdiction (AHJ), employer procedures, licensed electrician, engineer, inspector, or required jobsite supervision.
2. If the question lacks critical context or jobsite specifics, clearly identify the missing details or state your working assumptions in the "assumptions" array.
3. Do NOT fabricate NEC article or section citations. State clearly in "verification_notes" that the user must verify all applicable requirements against their locally adopted NEC codebook and AHJ. Never output internal technical disclaimers or mention session capabilities or database connections to the user.
4. Do NOT use trademarked terms such as "Codeology".

USER CONTEXT:
- Question: "${question}"
- Target Role: ${role === "apprentice" ? "Apprentice" : role === "journeyman" ? "Journeyman" : "Master"}
- NEC Edition: ${edition}

You MUST respond strictly with a JSON object matching this schema:
{
  "answer": "string - comprehensive answer following the ${role} trade-level output protocol above",
  "assumptions": ["string - specific assumption or missing context item"],
  "verification_notes": ["string - verification requirement, exception cross-reference, or local code reminder"]
}`;

          let result;
          try {
            result = await model.generateContent(systemPrompt);
          } catch (modelErr) {
            console.warn(
              `[nec-lookup][${requestId}] Model ${modelName} failed, falling back to gemini-3.6-flash:`,
              modelErr,
            );
            modelName = "gemini-3.6-flash";
            model = genAI.getGenerativeModel({
              model: modelName,
              generationConfig: {
                responseMimeType: "application/json",
              },
            });
            result = await model.generateContent(systemPrompt);
          }
          const text = result.response.text();

          let parsed;
          try {
            parsed = JSON.parse(text);
          } catch {
            parsed = {
              answer: text,
              assumptions: ["Query processed with default general context."],
              verification_notes: [
                "Verify answer and article citations against your local adopted NEC codebook.",
              ],
            };
          }

          const sanitizeText = (str: string) =>
            str
              .replace(
                /Automated retrieval from a verified full-text database is not connected to this session\.?/gi,
                "",
              )
              .replace(/full-text database is not connected to this session\.?/gi, "")
              .trim();

          const rawAnswer = sanitizeText(parsed.answer || text);
          const rawNotes = (
            Array.isArray(parsed.verification_notes) ? parsed.verification_notes : []
          )
            .map((note: string) => sanitizeText(note))
            .filter((note: string) => note.length > 0);

          const responsePayload = {
            answer: rawAnswer,
            assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions : [],
            verification_notes:
              rawNotes.length > 0
                ? rawNotes
                : ["Verify all answers against the locally adopted codebook and AHJ requirements."],
            role,
            edition: String(edition),
            model: modelName,
            request_id: requestId,
          };

          return new Response(JSON.stringify(responsePayload), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Failed to process request";
          console.error(`[nec-lookup][${requestId}] Execution error:`, error);
          return new Response(
            JSON.stringify({
              error: "Gemini API execution failed",
              message: errMsg,
              request_id: requestId,
            }),
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
