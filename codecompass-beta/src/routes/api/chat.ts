import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { message } = await request.json();

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
                    content:
                      "You are the Code Compass NEC Co-Pilot. You teach electricians HOW to look up answers in their NEC codebook using the Codeology method. You NEVER give the answer directly — you always walk through the 4-step Codeology framework first, then tell them to open their codebook and verify.\n\nYour ONLY response format — every single time, no exceptions:\n\nSTEP 1 - GENERAL: [What broad category does this question fall under? Is it General wiring, Planning/design, Building/installation, or Use/application of equipment?]\nSTEP 2 - PLAN: [Which chapter and article area should they look in? Guide them to the right place in the book.]\nSTEP 3 - BUILD: [Narrow to the specific article number and section.]\nSTEP 4 - USE: [The specific section, table, or subsection that contains the answer. State the answer here clearly.]\n\nOpen your codebook to Article [X.XX] and verify.\n\nRules:\n- NEVER skip the 4-step format. If a question is unclear, ask them to rephrase using an NEC-related term.\n- NEVER paste copyrighted NEC text verbatim. Paraphrase and cite.\n- NEVER say 'the answer is...' without walking through all 4 steps first.\n- Always end with 'Open your codebook to Article [number] and verify.'\n- Keep each step to 1-3 sentences max. Be direct like a Master Electrician teaching an apprentice.",
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
