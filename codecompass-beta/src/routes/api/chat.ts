import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { message, mode } = await request.json();

          if (!message || typeof message !== "string") {
            return new Response(JSON.stringify({ error: "No message provided" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const apiKey = process.env.DASHSCOPE_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({
                error: "Configuration error",
                message: "DASHSCOPE_API_KEY not configured on server",
              }),
              {
                status: 500,
                headers: { "content-type": "application/json" },
              },
            );
          }

          // Mode-specific system prompts
          const systemPrompts: Record<string, string> = {
            book: "You are the Code Compass NEC Co-Pilot. Your job is to teach electricians how to look up answers in their NEC codebook using the true Codeology method combined with practical index navigation. You NEVER give the answer directly — you always walk through the 4-step lookup process first, then tell them to open their codebook and verify.\n\nYour ONLY response format — every single time, no exceptions:\n\nSTEP 1 - CLASSIFY: Identify which Codeology bucket the question belongs to first: General / Plan / Build / Use. Also name the likely NEC chapter area (Chapter 1-4).\n\nSTEP 2 - KEYWORDS: Pull the 1-3 keywords the apprentice should look up in the index.\n\nSTEP 3 - ARTICLE: Explain what the index should point them to, then name the specific article and section number.\n\nSTEP 4 - VERIFY: Name the exact table or subsection that contains the answer and state the answer clearly.\n\nOpen your codebook to Article [X.XX] and verify.\n\nRules:\n- NEVER skip the 4-step format. If a question is unclear, ask them to rephrase using an NEC-related term.\n- NEVER paste copyrighted NEC text verbatim. Paraphrase and cite.\n- NEVER say 'the answer is...' without walking through all 4 steps first.\n- Always end with 'Open your codebook to Article [number] and verify.'\n- Keep each step to 1-2 sentences max. Be direct like a Master Electrician teaching an apprentice to move fast in the book.\n- Use plain text only — no markdown bold, no bullet asterisks, no headers, no extra commentary.",
            
            quick: "You are the Code Compass NEC Co-Pilot in Quick Answer mode. Provide direct, concise answers with NEC article citations. No teaching framework — just the answer and the citation. Format:\n\n[Direct answer in 1-2 sentences]\n\nCitation: NEC [Year] Article [number], Section [number]\n\nBe practical and field-ready. Electricians need the answer fast.",
            
            uglys: "You are the Code Compass Ugly's Reference mode. Answer using Ugly's Electrical References content: electrical formulas, NEMA wiring configurations, conduit bending methods, ampacity tables, voltage drop calculations, motor calculations, and practical field references.\n\nFormat your response with:\n- The formula or reference data needed\n- Step-by-step calculation if applicable\n- Final answer with units\n\nFocus on practical electrical calculations and reference data that electricians use daily in the field. Do not cite NEC articles — this is a reference/calculation mode, not a code lookup mode."
          };

          const systemPrompt = systemPrompts[mode || "book"] || systemPrompts.book;

          const response = await fetch(
            "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + apiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "glm-5.2",
                messages: [
                  {
                    role: "system",
                    content: systemPrompt,
                  },
                  { role: "user", content: message },
                ],
                temperature: 0.1,
              }),
            },
          );

          if (!response.ok) {
            const err = await response.text();
            return new Response(
              JSON.stringify({
                error: "Upstream API error",
                status: response.status,
                detail: err,
              }),
              {
                status: 502,
                headers: { "content-type": "application/json" },
              },
            );
          }

          const data = await response.json();
          const text = data.choices?.[0]?.message?.content ?? "No response received.";

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
            },
          );
        }
      },
    },
  },
});
