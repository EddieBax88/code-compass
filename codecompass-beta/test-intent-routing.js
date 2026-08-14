// Test script for intent routing system

const INTENT_KEYWORDS = {
  plc_l5x: [
    "l5x",
    "l5k",
    "plc",
    "ladder logic",
    "rung",
    "routine",
    "rockwell",
    "studio 5000",
    "parse",
    "routine",
  ],
  uglys_reference: [
    "bend",
    "offset",
    "stub",
    "saddle",
    "kick",
    "voltage drop",
    "ampacity",
    "conduit fill",
    "nema",
    "pinout",
    "transformer diagram",
    "conversion table",
    "ohm",
    "watt",
    "calculate",
    "formula",
  ],
};

const UGLYS_SCOPE_PATTERNS = [
  /bend|offset|stub|saddle|kick/i,
  /formula|calculate|calculation/i,
  /voltage drop|ohm|watt|power/i,
  /ampacity|conductor size|wire size/i,
  /conduit fill/i,
  /nema|pinout|plug|receptacle config/i,
  /transformer|control circuit|diagram/i,
  /conversion|metric|imperial/i,
];

const NEC_ARTICLE_PATTERNS = [
  /article|section|nec/i,
  /requirement|shall|must/i,
  /minimum|maximum|clearance|depth|spacing/i,
  /working space|gfci|grounding|bonding/i,
  /what does.*say|what is.*required/i,
];

function classifyIntent(message, userMode) {
  const lowerMessage = message.toLowerCase();

  // Priority 1: Check for PLC/L5X keywords
  const plcMatches = INTENT_KEYWORDS.plc_l5x.filter((kw) =>
    lowerMessage.includes(kw.toLowerCase()),
  );
  if (plcMatches.length >= 2 || (plcMatches.length === 1 && /parse|analyze|count/i.test(message))) {
    return "plc_l5x";
  }

  // Priority 2: If user selected Ugly's mode, validate scope
  if (userMode === "uglys") {
    const inScope = UGLYS_SCOPE_PATTERNS.some((pattern) => pattern.test(message));
    const hasNECArticlePattern = NEC_ARTICLE_PATTERNS.some((pattern) => pattern.test(message));

    if (hasNECArticlePattern && !inScope) {
      return "out_of_scope";
    }

    if (inScope) {
      return "uglys_reference";
    }

    return "out_of_scope";
  }

  // Priority 3: Route based on user's selected mode
  if (userMode === "book") return "guided_method";
  if (userMode === "fast") return "index_search";
  if (userMode === "quick") return "quick_answer";

  return "out_of_scope";
}

// Test queries
const testQueries = [
  {
    query: "How do I bend a 30 degree offset in 3/4 EMT?",
    mode: "uglys",
    expected: "uglys_reference",
  },
  {
    query: "What's the minimum working space depth for a 480V panel?",
    mode: "uglys",
    expected: "out_of_scope",
  },
  {
    query: "What's the conduit fill for three 12 AWG THHN in 1/2 EMT?",
    mode: "uglys",
    expected: "uglys_reference",
  },
  {
    query: "Parse this L5X routine and count the rungs",
    mode: "uglys",
    expected: "plc_l5x",
  },
];

console.log("=".repeat(80));
console.log("INTENT ROUTING TEST RESULTS");
console.log("=".repeat(80));

testQueries.forEach((test, index) => {
  const intent = classifyIntent(test.query, test.mode);
  const passed = intent === test.expected;

  console.log(`\nTest ${index + 1}: ${passed ? "✓ PASS" : "✗ FAIL"}`);
  console.log(`Query: "${test.query}"`);
  console.log(`Mode: ${test.mode}`);
  console.log(`Expected: ${test.expected}`);
  console.log(`Got: ${intent}`);

  if (intent === "out_of_scope") {
    console.log(
      `Response: "This question is outside Ugly's Reference scope. Switch to Guided Method, Index Search, or Quick Answer for NEC article lookup."`,
    );
  } else if (intent === "plc_l5x") {
    console.log(
      `Response: "For L5X parsing, please use the PLC Parser module. Upload your L5X file at /plc to parse routines, count rungs, and analyze ladder logic."`,
    );
  } else {
    console.log(`Response: [Would route to ${intent} system prompt]`);
  }
});

console.log("\n" + "=".repeat(80));
