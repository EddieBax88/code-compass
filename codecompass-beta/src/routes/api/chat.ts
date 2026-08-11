import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { message, mode } = await request.json().catch(() => ({}));

          if (!message || typeof message !== "string") {
            return new Response(JSON.stringify({ error: "No message provided" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({
                error: "Configuration error",
                message: "GEMINI_API_KEY not configured on server",
              }),
              {
                status: 500,
                headers: { "content-type": "application/json" },
              }
            );
          }

          const genAI = new GoogleGenerativeAI(apiKey);
          const modelName = "gemini-3.6-flash";
          const model = genAI.getGenerativeModel({ model: modelName });

          const prompt = `You are the Code Compass NEC Co-Pilot. You provide educational decision support for electrical professionals and apprentices.

Safety Directive:
1. This tool provides educational guidance only. It does NOT replace the applicable adopted code, local amendments, authority having jurisdiction (AHJ), employer procedures, licensed electrician, engineer, inspector, or required supervision.
2. Do NOT fabricate NEC article or section citations. Verify all requirements against your local adopted codebook.

Question: "${message}"`;

          const result = await model.generateContent(prompt);
          const text = result.response.text();

          return new Response(JSON.stringify({ text, message: text }), {
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
            }
          );
        }
      },
    },
  },
});
