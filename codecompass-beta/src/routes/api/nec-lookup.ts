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
          const {
            question,
            role = "apprentice",
            edition = "2026",
          } = body;

          if (!question || typeof question !== "string" || !question.trim()) {
            return new Response(
              JSON.stringify({ error: "Invalid question provided" }),
              {
                status: 400,
                headers: { "content-type": "application/json" },
              }
            );
          }

          const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({
                error: "Server configuration error",
                message: "GEMINI_API_KEY is not configured on the server",
              }),
              {
                status: 500,
                headers: { "content-type": "application/json" },
              }
            );
          }

          const genAI = new GoogleGenerativeAI(apiKey);
          const modelName = "gemini-3.6-flash";
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: "application/json",
            },
          });

          const systemPrompt = `You are the Code Compass NEC Co-Pilot. You provide educational decision support for electrical professionals and apprentices.

CRITICAL SAFETY DIRECTIVE:
1. Your guidance is strictly for educational decision support. It does NOT replace the applicable adopted code, local amendments, authority having jurisdiction (AHJ), employer procedures, licensed electrician, engineer, inspector, or required jobsite supervision.
2. If the question lacks critical context or jobsite specifics, clearly identify the missing details or state your working assumptions in the "assumptions" array.
3. Do NOT fabricate NEC article or section citations. Since automated retrieval from a verified full-text database is not connected to this session, explicitly state in "verification_notes" that the user must verify all applicable requirements against their locally adopted physical or official digital NEC codebook.

USER CONTEXT:
- Question: "${question}"
- Target Role: ${role === "field_electrician" ? "Field Electrician" : "Apprentice"}
- NEC Edition: ${edition}

You MUST respond strictly with a JSON object matching this schema:
{
  "answer": "string - clear, direct explanation tailored for a ${role}",
  "assumptions": ["string - specific assumption or missing context item"],
  "verification_notes": ["string - verification requirement or local code reminder"]
}`;

          const result = await model.generateContent(systemPrompt);
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

          const responsePayload = {
            answer: parsed.answer || text,
            assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions : [],
            verification_notes: Array.isArray(parsed.verification_notes)
              ? parsed.verification_notes
              : [
                  "Verify all answers against the locally adopted codebook and AHJ requirements.",
                ],
            role: role === "field_electrician" ? "field_electrician" : "apprentice",
            edition: String(edition),
            model: modelName,
            request_id: requestId,
          };

          return new Response(JSON.stringify(responsePayload), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          const errMsg =
            error instanceof Error ? error.message : "Failed to process request";
          return new Response(
            JSON.stringify({
              error: "Gemini API execution failed",
              message: errMsg,
              request_id: requestId,
            }),
            {
              status: 500,
              headers: { "content-type": "application/json" },
            }
          );
        }
      },
    },
  },
});
