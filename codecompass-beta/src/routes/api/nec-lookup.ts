import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { enforcePaywall, getClientIp, checkIpRateLimit } from "@/lib/paywall.server";

export const Route = createFileRoute("/api/nec-lookup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        try {
          // Enforce server-side paywall (1 free query for guests/unpaid, 402 onward)
          const paywallResult = await enforcePaywall(request);
          if (!paywallResult.allowed) {
            return new Response(
              JSON.stringify({
                error: "founding_member_required",
                message:
                  "You've used your free AI question. Upgrade to Code Compass Pro for unlimited access (founding rate is closed).",
                request_id: requestId,
              }),
              {
                status: 402,
                headers: {
                  "content-type": "application/json",
                  ...(paywallResult.setCookieHeader
                    ? { "set-cookie": paywallResult.setCookieHeader }
                    : {}),
                },
              },
            );
          }

          // Enforce per-IP rate limit backstop (20 req/hour per IP) before Gemini call
          const clientIp = getClientIp(request);
          const rateLimit = await checkIpRateLimit(clientIp);
          if (!rateLimit.allowed) {
            return new Response(
              "Too many requests from this network. Try again in an hour.",
              {
                status: 429,
                headers: {
                  "content-type": "text/plain",
                  ...(paywallResult.setCookieHeader
                    ? { "set-cookie": paywallResult.setCookieHeader }
                    : {}),
                },
              },
            );
          }

          const body = await request.json().catch(() => ({}));
          const { question, edition = "2026" } = body;

          if (!question || typeof question !== "string" || !question.trim()) {
            return new Response(JSON.stringify({ error: "Invalid question provided" }), {
              status: 400,
              headers: {
                "content-type": "application/json",
                ...(paywallResult.setCookieHeader
                  ? { "set-cookie": paywallResult.setCookieHeader }
                  : {}),
              },
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
          let model = genAI.getGenerativeModel({ model: modelName });

          const systemPrompt = `You are the Code Compass NEC Co-Pilot. Your job is to teach electricians how to look up answers in their NEC codebook using the Code Compass Method combined with practical index navigation. You NEVER give the answer directly — you always walk through the 4-step lookup process first, then tell them to open their codebook and verify.

CRITICAL CODE COMPASS METHOD BUCKET MAPPINGS:
- General = Chapter 1. Use this for baseline rules, definitions, working spaces, and general requirements.
- Plan = Chapter 2. Use this for circuits, services, feeders, grounding, and protection.
- Build = Chapter 3. Use this for wiring methods, raceways, conduit, boxes, and installation methods.
- Use = Chapter 4. Use this for equipment, motors, appliances, and general-use equipment.

Your ONLY response format — every single time, no exceptions:

STEP 1 - CLASSIFY: Identify which Code Compass Method bucket the question belongs to first (General / Plan / Build / Use), then name the NEC chapter (Chapter 1-4). Example: working space questions are ALWAYS General / Chapter 1, never Build.

STEP 2 - KEYWORDS: Pull the 1-3 keywords the electrician should look up in the index.

STEP 3 - ARTICLE: Explain what the index should point them to, then name the specific article and section number.

STEP 4 - VERIFY: Name the exact table or subsection that contains the answer and state the answer clearly.

Open your codebook to Article [X.XX] and verify.

Rules:
- NEVER skip the 4-step format. If a question is unclear, ask them to rephrase using an NEC-related term.
- NEVER paste copyrighted NEC text verbatim. Paraphrase and cite.
- NEVER say 'the answer is...' without walking through all 4 steps first.
- Always end with 'Open your codebook to Article [number] and verify.'
- Keep each step to 1-2 sentences max. Be direct like a Master Electrician teaching an apprentice to move fast in the book.
- Use plain text only — no markdown bold, no bullet asterisks, no headers, no extra commentary.

Question: "${question}"
NEC Edition: ${edition}`;

          let result;
          try {
            result = await model.generateContent(systemPrompt);
          } catch (modelErr) {
            console.warn(
              `[nec-lookup][${requestId}] Model ${modelName} failed, falling back to gemini-3.6-flash:`,
              modelErr,
            );
            modelName = "gemini-3.6-flash";
            model = genAI.getGenerativeModel({ model: modelName });
            result = await model.generateContent(systemPrompt);
          }

          const text = result.response.text().trim();

          return new Response(
            JSON.stringify({
              answer: text,
              edition: String(edition),
              model: modelName,
              request_id: requestId,
            }),
            {
              status: 200,
              headers: {
                "content-type": "application/json",
                ...(paywallResult.setCookieHeader
                  ? { "set-cookie": paywallResult.setCookieHeader }
                  : {}),
              },
            },
          );
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
