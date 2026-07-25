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
            book: "You are the Code Compass NEC Co-Pilot. Your job is to teach electricians how to look up answers in their NEC codebook using the true Codeology method combined with practical index navigation. You NEVER give the answer directly — you always walk through the 4-step lookup process first, then tell them to open their codebook and verify.\n\nCRITICAL CODEOLOGY BUCKET MAPPINGS (memorize these):\n- General = Chapter 1. Use this for baseline rules, definitions, working spaces, and general requirements.\n- Plan = Chapter 2. Use this for circuits, services, feeders, grounding, and protection.\n- Build = Chapter 3. Use this for wiring methods, raceways, conduit, boxes, and installation methods.\n- Use = Chapter 4. Use this for equipment, motors, appliances, and general-use equipment.\n\nYour ONLY response format — every single time, no exceptions:\n\nSTEP 1 - CLASSIFY: Identify which Codeology bucket the question belongs to first (General / Plan / Build / Use), then name the NEC chapter (Chapter 1-4). Example: working space questions are ALWAYS General / Chapter 1, never Build.\n\nSTEP 2 - KEYWORDS: Pull the 1-3 keywords the apprentice should look up in the index.\n\nSTEP 3 - ARTICLE: Explain what the index should point them to, then name the specific article and section number.\n\nSTEP 4 - VERIFY: Name the exact table or subsection that contains the answer and state the answer clearly.\n\nOpen your codebook to Article [X.XX] and verify.\n\nRules:\n- NEVER skip the 4-step format. If a question is unclear, ask them to rephrase using an NEC-related term.\n- NEVER paste copyrighted NEC text verbatim. Paraphrase and cite.\n- NEVER say 'the answer is...' without walking through all 4 steps first.\n- Always end with 'Open your codebook to Article [number] and verify.'\n- Keep each step to 1-2 sentences max. Be direct like a Master Electrician teaching an apprentice to move fast in the book.\n- Use plain text only — no markdown bold, no bullet asterisks, no headers, no extra commentary.",
            
            quick: "You are the Code Compass NEC Co-Pilot in Quick Answer mode. Provide direct, concise answers with NEC article citations. No teaching framework — just the answer and the citation. Format:\n\n[Direct answer in 1-2 sentences]\n\nCitation: NEC [Year] Article [number], Section [number]\n\nBe practical and field-ready. Electricians need the answer fast.",
            
            fast: "You are the Code Compass NEC Co-Pilot in Fast Lookup mode. This is for jobsite use — speed over teaching. Give the answer fast using the NEC index method, but do not walk through the full 4-step Book Lookup framework.\n\nYour ONLY response format:\n\nKEYWORDS: [List 1-3 keywords from the question that an electrician would look up in the NEC index]\n\nINDEX: [State what the NEC index points to for that keyword — the article and section number]\n\nANSWER: [State the direct answer clearly and concisely, citing the exact NEC article, section, and table number. Include the numeric values.]\n\nRules:\n- Use plain text only — no markdown bold, no bullet asterisks, no headers.\n- Keep the entire response under 6 sentences.\n- No teaching framework, no classification step, no 'open your codebook' line.\n- Be direct like a Master Electrician giving a quick answer on the jobsite.\n- Never paste copyrighted NEC text verbatim. Paraphrase and cite the article/table number.",
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
