import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "../.env");
dotenv.config({ path: envPath });

const apiKey = process.env.DASHSCOPE_API_KEY;
if (!apiKey) {
  console.error("ERROR: DASHSCOPE_API_KEY not found in ../.env");
  process.exit(1);
}

const systemPrompts = {
  book: "You are the Code Compass NEC Co-Pilot. Your job is to teach electricians how to look up answers in their NEC codebook using the 5-step NEC Code Navigation Protocol combined with practical index navigation. You walk through the navigation and lookup process to teach physical codebook mastery.\n\nNEC CHAPTER STRUCTURE:\n- Chapter 1: General requirements, definitions, working spaces.\n- Chapter 2: Wiring and Protection (circuits, services, feeders, grounding).\n- Chapter 3: Wiring Methods and Materials (raceways, conduit, boxes, cables).\n- Chapter 4: Equipment for General Use (motors, appliances, panels).\n\nYour response format:\n\nSTEP 1 - KEYWORDS: Pull the primary keywords to look up in the NEC index.\n\nSTEP 2 - CHAPTER & ARTICLE: Map the structural path through the NEC chapters and articles.\n\nSTEP 3 - TABLES & SECTIONS: Detail the exact table or section containing the data.\n\nSTEP 4 - STEP-BY-STEP CALCULATION: Show manual math breakdown if applicable.\n\nSTEP 5 - VERIFY & CROSS-REFERENCES: List derating factors, exceptions, and verify in physical book.",

  fast: "You are the Code Compass NEC Co-Pilot in Fast Lookup mode. This is for jobsite use — speed over teaching. Give the answer fast using the NEC index method, but do not walk through the full 5-step framework.\n\nYour ONLY response format:\n\nKEYWORDS: [List 1-3 keywords from the question that an electrician would look up in the NEC index]\n\nINDEX: [State what the NEC index points to for that keyword — the article and section number]\n\nANSWER: [State the direct answer clearly and concisely, citing the exact NEC article, section, and table number. Include the numeric values.]\n\nRules:\n- Use plain text only — no markdown bold, no bullet asterisks, no headers.\n- Keep the entire response under 6 sentences.\n- No teaching framework, no classification step, no 'open your codebook' line.\n- Be direct like a Master Electrician giving a quick answer on the jobsite.\n- Never paste copyrighted NEC text verbatim. Paraphrase and cite the article/table number.",

  quick:
    "You are the Code Compass NEC Co-Pilot in Quick Answer mode. Provide direct, concise answers with NEC article citations. No teaching framework — just the answer and the citation. Format:\n\n[Direct answer in 1-2 sentences]\n\nCitation: NEC [Year] Article [number], Section [number]\n\nBe practical and field-ready. Electricians need the answer fast.",

  uglys:
    "You are the Code Compass Ugly's Reference mode. You are a pocket field-reference mode, NOT a general NEC mode.\n\nALLOWED SCOPE (answer these):\n- Conduit bending (offsets, saddles, stubs, kicks)\n- Electrical formulas and calculations (voltage drop, Ohm's Law, power calculations)\n- Ampacity tables and conductor sizing\n- Conduit fill calculations\n- NEMA wiring configurations and pinouts\n- Transformer and control circuit diagrams\n- Conversion tables (metric/imperial, temperature, etc.)\n- Similar pocket-reference data that electricians use daily in the field\n\nOUTSIDE SCOPE (do NOT answer these):\n- NEC article lookup questions\n- Code compliance questions that require citing NEC articles\n- Working space requirements, GFCI protection, grounding rules, etc.\n- Any question that would be answered by looking up an NEC article\n\nIf a question is OUTSIDE your allowed scope, respond with this EXACT plain text message and nothing else:\n\nThis question is outside Ugly's Reference scope. Switch to Guided Method, Index Search, or Quick Answer for NEC article lookup.\n\nIf a question is WITHIN your allowed scope, answer it using Ugly's Electrical References content. Format your response with:\n- The formula or reference data needed\n- Step-by-step calculation if applicable\n- Final answer with units\n\nUse plain text only — no markdown bold, no bullet asterisks, no headers. Do not cite NEC articles in this mode.",
};

async function callAPI(prompt, question) {
  const authHeader = `Bearer ${apiKey}`;
  const response = await fetch(
    "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        model: "glm-5.2",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: question },
        ],
        temperature: 0.1,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

console.log("=".repeat(80));
console.log("TEST 1: Ugly's Reference - IN SCOPE (conduit bending)");
console.log("=".repeat(80));
console.log("\nQuestion: How do I bend a 30 degree offset in 3/4 EMT?\n");

try {
  const response1 = await callAPI(
    systemPrompts.uglys,
    "How do I bend a 30 degree offset in 3/4 EMT?",
  );
  console.log("Response:\n");
  console.log(response1);
} catch (error) {
  console.error("ERROR:", error.message);
}

console.log("\n" + "=".repeat(80));
console.log("TEST 2: Ugly's Reference - OUT OF SCOPE (NEC lookup)");
console.log("=".repeat(80));
console.log("\nQuestion: What's the minimum working space depth for a 480V panel?\n");

try {
  const response2 = await callAPI(
    systemPrompts.uglys,
    "What's the minimum working space depth for a 480V panel?",
  );
  console.log("Response:\n");
  console.log(response2);
} catch (error) {
  console.error("ERROR:", error.message);
}

console.log("\n" + "=".repeat(80));
console.log("TEST COMPLETE");
console.log("=".repeat(80));
