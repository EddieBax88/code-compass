import { createFileRoute } from "@tanstack/react-router";

// Intent classification keywords
const INTENT_KEYWORDS = {
  plc_l5x: ['l5x', 'l5k', 'plc', 'ladder logic', 'rung', 'routine', 'rockwell', 'studio 5000', 'parse', 'routine'],
  uglys_reference: ['bend', 'offset', 'stub', 'saddle', 'kick', 'voltage drop', 'ampacity', 'conduit fill', 'nema', 'pinout', 'transformer diagram', 'conversion table', 'ohm', 'watt', 'calculate', 'formula']
};

// Scope validation patterns for Ugly's Reference
const UGLYS_SCOPE_PATTERNS = [
  /bend|offset|stub|saddle|kick/i,
  /formula|calculate|calculation/i,
  /voltage drop|ohm|watt|power/i,
  /ampacity|conductor size|wire size/i,
  /conduit fill/i,
  /nema|pinout|plug|receptacle config/i,
  /transformer|control circuit|diagram/i,
  /conversion|metric|imperial/i
];

// NEC article/compliance patterns (should NOT be in Ugly's)
const NEC_ARTICLE_PATTERNS = [
  /article|section|nec/i,
  /requirement|shall|must/i,
  /minimum|maximum|clearance|depth|spacing/i,
  /working space|gfci|grounding|bonding/i,
  /what does.*say|what is.*required/i
];

type Intent = 'guided_method' | 'index_search' | 'quick_answer' | 'uglys_reference' | 'plc_l5x' | 'out_of_scope';

function classifyIntent(message: string, userMode: string): Intent {
  const lowerMessage = message.toLowerCase();
  
  // Priority 1: Check for PLC/L5X keywords (unambiguous)
  const plcMatches = INTENT_KEYWORDS.plc_l5x.filter(kw => lowerMessage.includes(kw.toLowerCase()));
  if (plcMatches.length >= 2 || (plcMatches.length === 1 && /parse|analyze|count/i.test(message))) {
    return 'plc_l5x';
  }
  
  // Priority 2: If user selected Ugly's mode, validate scope
  if (userMode === 'uglys') {
    const inScope = UGLYS_SCOPE_PATTERNS.some(pattern => pattern.test(message));
    const hasNECArticlePattern = NEC_ARTICLE_PATTERNS.some(pattern => pattern.test(message));
    
    // If query has NEC article patterns, it's out of scope for Ugly's
    if (hasNECArticlePattern && !inScope) {
      return 'out_of_scope';
    }
    
    // If clearly in scope, route to uglys
    if (inScope) {
      return 'uglys_reference';
    }
    
    // Ambiguous - default to out_of_scope for safety
    return 'out_of_scope';
  }
  
  // Priority 3: Route based on user's selected mode
  if (userMode === 'book') return 'guided_method';
  if (userMode === 'fast') return 'index_search';
  if (userMode === 'quick') return 'quick_answer';
  
  return 'out_of_scope';
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { message, mode } = await request.json();

          // Log incoming request
          console.log(`[chat.ts] Incoming request - mode: ${mode || 'book'}, message length: ${message?.length || 0}`);

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

          // Classify intent before routing
          const intent = classifyIntent(message, mode || "book");
          
          // Log classified intent
          console.log(`[chat.ts] Intent classified - mode: ${mode || 'book'}, intent: ${intent}`);
          
          // Handle out_of_scope intent (Ugly's scope guard)
          if (intent === 'out_of_scope') {
            const refusalText = "This question is outside Ugly's Reference scope. Switch to Guided Method, Index Search, or Quick Answer for NEC article lookup.";
            console.log(`[chat.ts] Refusal sent - reason: out_of_scope`);
            return new Response(JSON.stringify({ text: refusalText, message: refusalText }), {
              status: 200,
              headers: { "content-type": "application/json" },
            });
          }
          
          // Handle PLC/L5X intent (route to parser or specific response)
          if (intent === 'plc_l5x') {
            const plcResponse = "For L5X parsing, please use the PLC Parser module. Upload your L5X file at /plc to parse routines, count rungs, and analyze ladder logic.";
            console.log(`[chat.ts] Redirect sent - reason: plc_l5x`);
            return new Response(JSON.stringify({ text: plcResponse, message: plcResponse }), {
              status: 200,
              headers: { "content-type": "application/json" },
            });
          }

          // Mode-specific system prompts (now intent-routed)
          const systemPrompts: Record<string, string> = {
            guided_method: "You are the Code Compass NEC Co-Pilot. Your job is to teach electricians how to look up answers in their NEC codebook using the true Codeology method combined with practical index navigation. You NEVER give the answer directly — you always walk through the 4-step lookup process first, then tell them to open their codebook and verify.\n\nCRITICAL CODEOLOGY BUCKET MAPPINGS (memorize these):\n- General = Chapter 1. Use this for baseline rules, definitions, working spaces, and general requirements.\n- Plan = Chapter 2. Use this for circuits, services, feeders, grounding, and protection.\n- Build = Chapter 3. Use this for wiring methods, raceways, conduit, boxes, and installation methods.\n- Use = Chapter 4. Use this for equipment, motors, appliances, and general-use equipment.\n\nYour ONLY response format — every single time, no exceptions:\n\nSTEP 1 - CLASSIFY: Identify which Codeology bucket the question belongs to first (General / Plan / Build / Use), then name the NEC chapter (Chapter 1-4). Example: working space questions are ALWAYS General / Chapter 1, never Build.\n\nSTEP 2 - KEYWORDS: Pull the 1-3 keywords the apprentice should look up in the index.\n\nSTEP 3 - ARTICLE: Explain what the index should point them to, then name the specific article and section number.\n\nSTEP 4 - VERIFY: Name the exact table or subsection that contains the answer and state the answer clearly.\n\nOpen your codebook to Article [X.XX] and verify.\n\nRules:\n- NEVER skip the 4-step format. If a question is unclear, ask them to rephrase using an NEC-related term.\n- NEVER paste copyrighted NEC text verbatim. Paraphrase and cite.\n- NEVER say 'the answer is...' without walking through all 4 steps first.\n- Always end with 'Open your codebook to Article [number] and verify.'\n- Keep each step to 1-2 sentences max. Be direct like a Master Electrician teaching an apprentice to move fast in the book.\n- Use plain text only — no markdown bold, no bullet asterisks, no headers, no extra commentary.",
            
            quick_answer: "You are the Code Compass NEC Co-Pilot in Quick Answer mode. Provide direct, concise answers with NEC article citations. No teaching framework — just the answer and the citation. Format:\n\n[Direct answer in 1-2 sentences]\n\nCitation: NEC [Year] Article [number], Section [number]\n\nBe practical and field-ready. Electricians need the answer fast.",
            
            index_search: "You are the Code Compass NEC Co-Pilot in Fast Lookup mode. This is for jobsite use — speed over teaching. Give the answer fast using the NEC index method, but do not walk through the full 4-step Book Lookup framework.\n\nYour ONLY response format:\n\nKEYWORDS: [List 1-3 keywords from the question that an electrician would look up in the NEC index]\n\nINDEX: [State what the NEC index points to for that keyword — the article and section number]\n\nANSWER: [State the direct answer clearly and concisely, citing the exact NEC article, section, and table number. Include the numeric values.]\n\nRules:\n- Use plain text only — no markdown bold, no bullet asterisks, no headers.\n- Keep the entire response under 6 sentences.\n- No teaching framework, no classification step, no 'open your codebook' line.\n- Be direct like a Master Electrician giving a quick answer on the jobsite.\n- Never paste copyrighted NEC text verbatim. Paraphrase and cite the article/table number.",
            
            uglys_reference: "You are the Code Compass Ugly's Reference mode. You are a pocket field-reference mode, NOT a general NEC mode.\n\nALLOWED SCOPE (answer these):\n- Conduit bending (offsets, saddles, stubs, kicks)\n- Electrical formulas and calculations (voltage drop, Ohm's Law, power calculations)\n- Ampacity tables and conductor sizing\n- Conduit fill calculations\n- NEMA wiring configurations and pinouts\n- Transformer and control circuit diagrams\n- Conversion tables (metric/imperial, temperature, etc.)\n- Similar pocket-reference data that electricians use daily in the field\n\nOUTSIDE SCOPE (do NOT answer these):\n- NEC article lookup questions\n- Code compliance questions that require citing NEC articles\n- Working space requirements, GFCI protection, grounding rules, etc.\n- Any question that would be answered by looking up an NEC article\n\nIf a question is OUTSIDE your allowed scope, respond with this EXACT plain text message and nothing else:\n\nThis question is outside Ugly's Reference scope. Switch to Guided Method, Index Search, or Quick Answer for NEC article lookup.\n\nIf a question is WITHIN your allowed scope, answer it using Ugly's Electrical References content. Format your response with:\n- The formula or reference data needed\n- Step-by-step calculation if applicable\n- Final answer with units\n\nUse plain text only — no markdown bold, no bullet asterisks, no headers. Do not cite NEC articles in this mode.",
          };

          // Use intent-routed prompt (fallback to guided_method if unknown)
          const systemPrompt = systemPrompts[intent] || systemPrompts.guided_method;

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
