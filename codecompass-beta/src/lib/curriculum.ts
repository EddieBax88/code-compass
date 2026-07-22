export type Trade = "electrical" | "plumbing" | "hvac";

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  body: string;
  keyPoints: string[];
  tip?: string;
};

export type Question =
  | {
      id: string;
      kind: "single";
      prompt: string;
      options: string[];
      answerIndex: number;
      explain: string;
    }
  | {
      id: string;
      kind: "multi";
      prompt: string;
      options: string[];
      answerIndices: number[];
      explain: string;
    }
  | {
      id: string;
      kind: "truefalse";
      prompt: string;
      answer: boolean;
      explain: string;
    }
  | {
      id: string;
      kind: "short";
      prompt: string;
      accept: string[];
      explain: string;
    };

export type Quiz = {
  id: string;
  passPct: number;
  questions: Question[];
};

export type Module = {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
  quiz: Quiz;
};

export type Course = {
  id: string;
  trade: Trade;
  title: string;
  level: "Apprentice" | "Journeyman" | "Master";
  tagline: string;
  why: string;
  pinned?: boolean;
  modules: Module[];
};

export const TRADES: { id: Trade; name: string; blurb: string; icon: string }[] = [
  { id: "electrical", name: "Electrical", blurb: "NEC, PLCs, industrial controls", icon: "⚡" },
];

const PASS = 80;

// Any string in a course that contains __EDITION__ is replaced at render time
// with the user's selected NEC edition (e.g. "NEC __EDITION__ · 430.22" →
// "NEC 2023 · 430.22"). Keeps citations correct without duplicating content.
export const EDITION_TOKEN = "__EDITION__";

export const COURSES: Course[] = [
  // ==========================================================
  // ELECTRICAL — NEC Navigation Method (pinned, apprentice, appears first)
  // ==========================================================
  {
    id: "elec-nec-navigation",
    trade: "electrical",
    title: "The NEC Navigation Method: Find the Path",
    level: "Apprentice",
    tagline: "Classify → Article → Section → Answer.",
    pinned: true,
    why: "Start here — even if you've been in the trade for years. Fast electricians don't memorize the NEC. They know the shape of the book, the neighborhood each article lives in, and how to move from a job-site question to the exact section in under a minute. That's the skill this course builds.",
    modules: [
      {
        id: "m1",
        title: "How the NEC Is Built",
        summary:
          "Chapters 1–9, article numbering, parts, sections, and shall vs. shall be permitted.",
        lessons: [
          {
            id: "l1",
            title: "The Nine Chapters",
            minutes: 8,
            body: "The NEC __EDITION__ is organized into 9 chapters plus informative annexes. Chapters 1–4 apply generally to all installations. Chapters 5–7 modify or supplement Chapters 1–4 for special occupancies, equipment, and conditions. Chapter 8 covers communications and stands alone. Chapter 9 is tables.\n\nChapter 1 — General. Definitions and requirements every install must satisfy.\nChapter 2 — Wiring and Protection. Grounding, overcurrent, branch circuits, feeders, services.\nChapter 3 — Wiring Methods and Materials. Conductors, raceways, boxes.\nChapter 4 — Equipment for General Use. Cords, fixtures, motors, transformers.\nChapter 5 — Special Occupancies. Hazardous locations, healthcare, places of assembly.\nChapter 6 — Special Equipment. Signs, cranes, elevators, PV, EV chargers.\nChapter 7 — Special Conditions. Emergency systems, standby.\nChapter 8 — Communications. Not modified by 1–7 unless explicitly stated.\nChapter 9 — Tables. Conduit fill, conductor properties.",
            keyPoints: [
              "Chapters 1–4 apply generally",
              "5–7 modify 1–4 for special cases",
              "Chapter 9 is where the tables live",
            ],
            tip: "On the exam, if the question is about hospital wiring, PV, or an elevator — Chapters 5–7 first. General residential wiring — stay in 1–4.",
          },
          {
            id: "l2",
            title: "Articles, Parts, and Sections",
            minutes: 9,
            body: "Inside each chapter are articles. Think of articles as chapters within chapters — Article 210 covers branch circuits, Article 250 covers grounding, Article 430 covers motors.\n\nEvery article breaks into Parts (I, II, III…), and inside each Part are numbered sections. A citation like NEC __EDITION__ · 310.15(B)(7) reads: Article 310 (conductors), Section 15 (ampacities), subsection (B), item (7). The number after the dot is the section — never the page.\n\nTables get their own numbers and live inside the article they belong to (Table 310.16, Table 430.52). Informational Notes sit under sections in smaller print — they are NOT enforceable code, just guidance. Exceptions ARE enforceable and always follow the rule they modify.",
            keyPoints: [
              "Article = topic. Part = section of that topic. Section = the actual rule.",
              "Informational Notes = guidance, not law",
              "Exceptions ARE code and follow the rule they modify",
            ],
            tip: "If someone quotes you an 'Informational Note' as the reason for a red-tag, ask which section it lives under. The section is the rule.",
          },
          {
            id: "l3",
            title: "Shall vs. Shall Be Permitted",
            minutes: 6,
            body: 'The NEC uses two kinds of language and mixing them up will cost you points on the exam and money in the field.\n\n"Shall" = mandatory. You must do it this way.\n"Shall be permitted" = permissive. You are allowed to do it this way, but other methods may also be acceptable.\n"Shall not" = prohibited.\n\nWhen you see "shall be permitted," it does not mean you have to — it means you may. Inspectors sometimes forget this. If the code permits your method, you\'re allowed.',
            keyPoints: [
              "Shall = must",
              "Shall be permitted = may (option, not mandate)",
              "Shall not = never",
            ],
          },
        ],
        quiz: {
          id: "q1",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "single",
              prompt: "In NEC __EDITION__, which chapter contains conduit fill tables?",
              options: ["Chapter 3", "Chapter 4", "Chapter 8", "Chapter 9"],
              answerIndex: 3,
              explain:
                "Chapter 9 is the tables chapter. Conduit fill and conductor properties live here.",
            },
            {
              id: "b",
              kind: "truefalse",
              prompt: "Informational Notes in the NEC are enforceable code.",
              answer: false,
              explain:
                "Informational Notes are guidance only. Sections and Exceptions are enforceable.",
            },
            {
              id: "c",
              kind: "multi",
              prompt: "Which of these apply generally to all installations? (select all)",
              options: ["Chapter 1", "Chapter 2", "Chapter 5", "Chapter 4"],
              answerIndices: [0, 1, 3],
              explain: "Chapters 1–4 apply generally. Chapter 5 modifies for special occupancies.",
            },
            {
              id: "d",
              kind: "short",
              prompt: "What NEC article number covers motors, motor circuits, and controllers?",
              accept: ["430", "article 430", "art 430"],
              explain: "Article 430 is the motor article. Tab it in your book.",
            },
            {
              id: "e",
              kind: "single",
              prompt: '"Shall be permitted" means:',
              options: [
                "You must do it this way",
                "You are allowed to do it this way",
                "You are forbidden from doing it this way",
                "Only an inspector can approve it",
              ],
              answerIndex: 1,
              explain:
                "Permissive language — the method is one of possibly several acceptable options.",
            },
          ],
        },
      },
      {
        id: "m2",
        title: "The 4-Phase NEC Lookup",
        summary: "Classify → Article → Section → Answer. Find any rule in under a minute.",
        lessons: [
          {
            id: "l1",
            title: "Broad to Narrow — Every Time",
            minutes: 8,
            body: "Every NEC __EDITION__ question you get in the field or on an exam can be located with the same five-step drill:\n\n1. Chapter — What's the general area? (Wiring? Special occupancy? Motors?)\n2. Article — What's the specific topic? (210 branch circuits, 250 grounding, 430 motors, 310 conductors.)\n3. Part — Which portion of the article? (Article 250 Part III is grounding electrode system; Part V is bonding.)\n4. Section — The actual rule number (250.66).\n5. Exception or Table — Read after the section, always.\n\nDo NOT flip to a random page and start reading. Do NOT start in the index for topics you already know the article for. Broad to narrow, every time.",
            keyPoints: [
              "Chapter → Article → Part → Section → Exception/Table",
              "Never skip a level",
              "Read exceptions AFTER the main rule",
            ],
            tip: "Time yourself. If a lookup takes more than 60 seconds, you skipped a level. Reset and do it broad-to-narrow.",
          },
          {
            id: "l2",
            title: "Index vs. Table of Contents",
            minutes: 7,
            body: "Two lookup tools, two different jobs.\n\nTable of Contents (front of book): Use when you already know the topic and want to see the layout of an article. Example — you know you're in Article 430 for motors and want to jump straight to Part IV (Motor Branch-Circuit Short-Circuit and Ground-Fault Protection).\n\nIndex (back of book): Use when you have a keyword but don't know the article. Example — the question says \"minimum burial depth\" and you don't remember which article. Index → \"Burial depth\" → Table 300.5.\n\nRule of thumb: TOC for topics you own, index for keywords you're chasing. On the exam, weak students live in the index. Strong students live in the TOC.",
            keyPoints: [
              "TOC = you know the article, want the part",
              "Index = you have a keyword, need an article",
              "Master the TOC and your speed doubles",
            ],
          },
        ],
        quiz: {
          id: "q2",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "single",
              prompt:
                "You need to find the disconnect requirements for a 3-phase motor. Fastest path in NEC __EDITION__?",
              options: [
                "Index → 'motor disconnect'",
                "TOC → Chapter 4 → Article 430 → Part IX",
                "Chapter 9 tables",
                "Article 250 (grounding)",
              ],
              answerIndex: 1,
              explain:
                "You already know it's a motor. TOC to Article 430, then Part IX for disconnects. Faster than the index.",
            },
            {
              id: "b",
              kind: "truefalse",
              prompt:
                "Exceptions should be ignored if the main section already answers the question.",
              answer: false,
              explain: "Always read exceptions. They can flip the answer completely.",
            },
            {
              id: "c",
              kind: "multi",
              prompt: "The correct navigation order is: (select all steps in order)",
              options: ["Chapter", "Article", "Part", "Random page"],
              answerIndices: [0, 1, 2],
              explain: "Chapter → Article → Part → Section → Exception/Table. Never random.",
            },
            {
              id: "d",
              kind: "short",
              prompt:
                "You don't know the article but the keyword is 'burial depth'. Which lookup tool do you use — index or TOC?",
              accept: ["index"],
              explain:
                "Unknown article + specific keyword = index. Known article + want structure = TOC.",
            },
          ],
        },
      },
      {
        id: "m3",
        title: "The Spiral Tabbed Notebook Method",
        summary: "Build your own personal index the code inspectors can't take away from you.",
        lessons: [
          {
            id: "l1",
            title: "Buy the Notebook This Week",
            minutes: 6,
            body: "This is the single best exam-prep tool that isn't the NEC __EDITION__ book itself. Go buy a 5-subject spiral notebook with plastic tabs. Or better, one with 8+ tabs so you can dedicate one per NEC chapter.\n\nLabel your tabs:\n• Tab 1 — Chapter 1 (General)\n• Tab 2 — Chapter 2 (Wiring & Protection)\n• Tab 3 — Chapter 3 (Wiring Methods)\n• Tab 4 — Chapter 4 (Equipment)\n• Tab 5 — Chapter 5 (Special Occupancies)\n• Tab 6 — Chapter 6 (Special Equipment)\n• Tab 7 — Chapter 7 (Special Conditions)\n• Tab 8 — Chapter 8 (Communications)\n• Tab 9 — Chapter 9 (Tables)\n\nExtra tabs — dedicate to the articles you look up constantly: Article 430 (Motors), Article 310 (Conductors), Article 240 (Overcurrent), Article 250 (Grounding), Article 210 (Branch Circuits).",
            keyPoints: [
              "5-subject or larger spiral, tabbed",
              "One tab per NEC chapter",
              "Extra tabs for 430, 310, 240, 250, 210",
            ],
            tip: "Do not skip the physical notebook and try to keep notes on your phone. The muscle memory of thumbing to a tab is exactly what you need on exam day.",
          },
          {
            id: "l2",
            title: "How to Write in It",
            minutes: 7,
            body: 'Every time you study an article, open your notebook to that chapter\'s tab and add three lines:\n\n1. Article number and topic — "Art 210 — Branch Circuits"\n2. Key section numbers — "210.8 GFCI, 210.12 AFCI, 210.52 receptacle placement"\n3. Key table numbers — "Table 210.24 summary of branch circuits"\n\nAfter a month of study, your notebook IS your personal index — written in your handwriting, organized the way YOUR brain works. On the exam, you\'ll be allowed the NEC book. Your notebook trained the muscle memory of which chapter, which article, which section.\n\nDo NOT copy the code word-for-word. Write the LOCATION of the rule, not the rule itself. Location is what gets you to the answer fast.',
            keyPoints: [
              "Write the location, not the rule",
              "Article # + topic, section #s, table #s",
              "Update it every time you study",
            ],
          },
        ],
        quiz: {
          id: "q3",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "single",
              prompt: "In your notebook, what should you write down when you study an article?",
              options: [
                "Word-for-word copy of the section",
                "Article number, topic, key section numbers, key table numbers",
                "Just the article number",
                "The inspector's phone number",
              ],
              answerIndex: 1,
              explain: "You're building an index, not a copy of the code. Location > content.",
            },
            {
              id: "b",
              kind: "truefalse",
              prompt:
                "Keeping your NEC notes on your phone is just as effective as a spiral notebook.",
              answer: false,
              explain: "The physical muscle memory of thumbing tabs is what carries into the exam.",
            },
            {
              id: "c",
              kind: "multi",
              prompt: "Which articles deserve their own dedicated tabs? (select all)",
              options: [
                "Article 430 (Motors)",
                "Article 310 (Conductors)",
                "Article 250 (Grounding)",
                "Article 90 (Introduction)",
              ],
              answerIndices: [0, 1, 2],
              explain:
                "430, 310, 250, 240, and 210 are the most-referenced articles. Article 90 is worth reading but rarely looked up under time pressure.",
            },
            {
              id: "d",
              kind: "short",
              prompt: "Minimum number of subject dividers recommended for your NEC notebook?",
              accept: ["5", "five"],
              explain: "5-subject is the minimum. 8+ is better so you get one tab per chapter.",
            },
          ],
        },
      },
      {
        id: "m4",
        title: "Speed-Find Drills",
        summary: "Real exam-style scenarios with the fastest lookup path.",
        lessons: [
          {
            id: "l1",
            title: "Direct Burial Cable Depth",
            minutes: 8,
            body: 'Scenario: A residential driveway needs a direct-buried UF cable feeding a garage subpanel. What\'s the minimum burial depth?\n\nFastest path in NEC __EDITION__:\n1. Chapter 3 — Wiring Methods and Materials\n2. Article 300 — General Requirements for Wiring Methods\n3. Section 300.5 — Underground Installations\n4. Table 300.5 — Minimum cover requirements\n\nIndex keyword: "Burial depth" or "Cover, underground." Both point to Table 300.5 immediately.',
            keyPoints: [
              "Underground rules = 300.5",
              "Table 300.5 is the answer for cover",
              "Index keyword: 'burial' or 'cover'",
            ],
            tip: "If you see 'underground,' 'buried,' or 'direct burial' on the exam — flip to Article 300 first. Nine times out of ten the answer is in Table 300.5.",
          },
          {
            id: "l2",
            title: "Working Space in Front of a Panel",
            minutes: 8,
            body: 'Scenario: A 200A residential panel installed in a garage. What\'s the minimum working clearance in front of the panel?\n\nFastest path in NEC __EDITION__:\n1. Chapter 1 — General\n2. Article 110 — Requirements for Electrical Installations\n3. Section 110.26 — Spaces About Electrical Equipment\n4. Table 110.26(A)(1) — Working Space depths by condition\n\nIndex keyword: "Working space" → 110.26. Answer is typically 3 ft depth, 30 in width, 6.5 ft height (Condition 1, ≤150V to ground).',
            keyPoints: [
              "Working space = 110.26",
              "Depth from Table 110.26(A)(1)",
              "Width min 30 in, height min 6.5 ft",
            ],
            tip: "Any question with the words 'working space,' 'dedicated space,' or 'headroom' around equipment — flip to 110.26 first.",
          },
          {
            id: "l3",
            title: "Small Appliance Branch Circuits in a Kitchen",
            minutes: 7,
            body: 'Scenario: How many small-appliance branch circuits are required in a dwelling kitchen, and what\'s the minimum ampacity?\n\nFastest path in NEC __EDITION__:\n1. Chapter 2 — Wiring and Protection\n2. Article 210 — Branch Circuits\n3. Section 210.11(C)(1) — Small-Appliance Branch Circuits\n\nAnswer: At least two 20A small-appliance branch circuits, serving countertop receptacles in kitchen, pantry, breakfast room, dining room.\n\nIndex keyword: "Small appliance branch circuits" → 210.11(C)(1).',
            keyPoints: [
              "Two 20A minimum",
              "Kitchen, pantry, breakfast, dining",
              "210.11(C)(1) is the section",
            ],
            tip: "'Kitchen circuits' or 'small appliance' on the exam = 210.11. Do not confuse with 210.52 (receptacle placement).",
          },
        ],
        quiz: {
          id: "q4",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "short",
              prompt: "For a burial-depth question in NEC __EDITION__, what table do you turn to?",
              accept: ["300.5", "table 300.5", "t 300.5"],
              explain: "Table 300.5 lists minimum cover for underground installations.",
            },
            {
              id: "b",
              kind: "single",
              prompt: "Working space in front of a panel — fastest lookup?",
              options: ["Article 250", "Section 110.26", "Table 310.16", "Article 430"],
              answerIndex: 1,
              explain:
                "110.26 covers spaces about electrical equipment. Table 110.26(A)(1) gives depth.",
            },
            {
              id: "c",
              kind: "short",
              prompt:
                "Minimum number of 20A small-appliance branch circuits required in a dwelling kitchen?",
              accept: ["2", "two"],
              explain:
                "210.11(C)(1) — two 20A circuits minimum for kitchen countertop receptacles.",
            },
            {
              id: "d",
              kind: "multi",
              prompt:
                "You see 'underground,' 'buried,' or 'direct burial' on the exam. What do you do? (select all)",
              options: [
                "Flip to Article 300",
                "Check Table 300.5",
                "Flip to Chapter 9 first",
                "Start at Article 250",
              ],
              answerIndices: [0, 1],
              explain: "Underground rules live in Article 300, cover distances in Table 300.5.",
            },
          ],
        },
      },
    ],
  },

  // ==========================================================
  // ELECTRICAL — existing courses (kept)
  // ==========================================================
  {
    id: "elec-101",
    trade: "electrical",
    title: "Residential Wiring Foundations",
    level: "Apprentice",
    tagline: "From service panel to the last outlet on the run.",
    why: "Before you pull a single wire on a real job, you need to read a panel, size a circuit, and know which color goes where. Skip this and you create fire risk.",
    modules: [
      {
        id: "m1",
        title: "Reading the Service Panel",
        summary: "Main breakers, bus bars, neutral and ground separation.",
        lessons: [
          {
            id: "l1",
            title: "Anatomy of a Panel",
            minutes: 8,
            body: "The service panel is where utility power becomes branch circuits. Power enters through the main lugs to the main breaker, then splits across two hot bus bars. Single-pole breakers tap one bus; double-pole breakers straddle both for 240V loads.\n\nThe neutral bar carries return current. The ground bar carries fault current. In the main panel they are bonded together per NEC __EDITION__ · 250.24(A). In a sub-panel they MUST be separated, or you create parallel neutral paths and shock hazards on metal enclosures.",
            keyPoints: [
              "Main breaker rating = service size",
              "Bond neutral and ground only at the main panel",
              "Sub-panels: 4-wire feed, isolated neutral",
            ],
          },
          {
            id: "l2",
            title: "Sizing Branch Circuits",
            minutes: 10,
            body: "Wire ampacity must match (or exceed) the breaker per NEC __EDITION__ · Table 310.16. 14 AWG copper → 15A. 12 AWG → 20A. 10 AWG → 30A. Never undersize.\n\nGeneral lighting and receptacles in dwellings are typically 15A or 20A. Kitchen small-appliance circuits require at least two 20A circuits (210.11(C)(1)). Bathrooms get a dedicated 20A (210.11(C)(3)). Laundry gets its own 20A (210.11(C)(2)).",
            keyPoints: [
              "14 AWG = 15A, 12 AWG = 20A, 10 AWG = 30A",
              "Two 20A small-appliance circuits in kitchens",
              "Dedicated 20A for bath and laundry",
            ],
          },
        ],
        quiz: {
          id: "q1",
          passPct: PASS,
          questions: [
            {
              id: "q1a",
              kind: "single",
              prompt: "In a sub-panel, what is the correct treatment of neutral and ground?",
              options: [
                "Bond them together, same as main panel",
                "Keep them isolated; ground bonds to enclosure, neutral floats",
                "Tie neutral to enclosure, ground floats",
                "Connect both to the main breaker",
              ],
              answerIndex: 1,
              explain:
                "Bonding in a sub-panel creates parallel neutral paths through the ground, energizing metal parts.",
            },
            {
              id: "q1b",
              kind: "multi",
              prompt: "Which of the following are TRUE about branch circuit sizing? (select all)",
              options: [
                "14 AWG copper is rated for a 20A breaker",
                "12 AWG copper is rated for a 20A breaker",
                "Bathrooms require a dedicated 20A circuit",
                "Laundry can share with general lighting",
              ],
              answerIndices: [1, 2],
              explain: "14 AWG = 15A only. Bath and laundry both require dedicated 20A circuits.",
            },
            {
              id: "q1c",
              kind: "truefalse",
              prompt: "A double-pole breaker straddles both hot bus bars to supply a 240V load.",
              answer: true,
              explain: "Two hots from opposite phases produce 240V across the load.",
            },
            {
              id: "q1d",
              kind: "short",
              prompt: "What AWG copper wire is required for a 30A circuit?",
              accept: ["10", "10 awg", "10awg", "#10", "ten"],
              explain: "10 AWG copper is rated for 30A per NEC __EDITION__ · Table 310.16.",
            },
          ],
        },
      },
      {
        id: "m2",
        title: "Outlets, Switches, and Code",
        summary: "GFCI, AFCI, tamper-resistant, and the 6/12 rule.",
        lessons: [
          {
            id: "l1",
            title: "Where GFCI and AFCI are Required",
            minutes: 9,
            body: "GFCI (NEC __EDITION__ · 210.8) protects people from shock by detecting current imbalance. Required in bathrooms, kitchens (counter-top), garages, outdoors, unfinished basements, laundry, and within 6 ft of any sink.\n\nAFCI (210.12) protects against arc faults that cause fires. Required on most dwelling-unit branch circuits supplying outlets in living areas, bedrooms, hallways, and similar.",
            keyPoints: [
              "GFCI = people protection (shock)",
              "AFCI = property protection (fire)",
              "Dual-function breakers cover both",
            ],
          },
        ],
        quiz: {
          id: "q2",
          passPct: PASS,
          questions: [
            {
              id: "q2a",
              kind: "single",
              prompt: "Which space requires GFCI protection but not necessarily AFCI?",
              options: ["Bedroom", "Outdoor receptacle", "Hallway", "Living room"],
              answerIndex: 1,
              explain:
                "Outdoor receptacles need GFCI. AFCI is focused on living spaces inside dwellings.",
            },
            {
              id: "q2b",
              kind: "multi",
              prompt: "GFCI protection is required in which of these locations? (select all)",
              options: ["Bathrooms", "Garages", "Bedrooms", "Outdoor receptacles"],
              answerIndices: [0, 1, 3],
              explain:
                "Bathrooms, garages, and outdoor receptacles all require GFCI. Bedrooms primarily need AFCI.",
            },
            {
              id: "q2c",
              kind: "truefalse",
              prompt: "A dual-function breaker provides both GFCI and AFCI protection.",
              answer: true,
              explain: "Dual-function breakers combine both protections in one device.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "elec-201",
    trade: "electrical",
    title: "Troubleshooting Live Circuits",
    level: "Journeyman",
    tagline: "Find the fault without becoming the load.",
    why: "Diagnostic work is where journeymen earn their rate. Knowing how to isolate a fault in under 10 minutes is the difference between a happy customer and a callback.",
    modules: [
      {
        id: "m1",
        title: "The Meter Workflow",
        summary: "Verify dead before touching, prove live after restoring.",
        lessons: [
          {
            id: "l1",
            title: "Live-Dead-Live Test",
            minutes: 7,
            body: "Before working on a circuit you believe is de-energized: (1) test the meter on a known live source, (2) test the target circuit, (3) test the meter again on the known live source. If step 3 fails, you can't trust step 2.\n\nUse a non-contact tester for a first pass, then a true contact meter for confirmation. Never trust a single tool. Lockout/tagout per NEC __EDITION__ · 110.25 and OSHA 1910.147.",
            keyPoints: [
              "Always Live-Dead-Live",
              "Two tools beat one",
              "Lock out the breaker before working",
            ],
          },
        ],
        quiz: {
          id: "q1",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "single",
              prompt: "Why test the meter on a known live source AFTER testing the dead circuit?",
              options: [
                "To discharge the meter",
                "To confirm the meter still works and your dead reading was real",
                "Required by manufacturer",
                "To reset the battery indicator",
              ],
              answerIndex: 1,
              explain:
                "A meter that died between steps 1 and 2 would falsely show a live circuit as dead.",
            },
            {
              id: "b",
              kind: "truefalse",
              prompt: "A non-contact tester alone is enough proof a circuit is de-energized.",
              answer: false,
              explain:
                "Non-contact testers can miss shielded or low-voltage hots. Always confirm with a contact meter.",
            },
            {
              id: "c",
              kind: "short",
              prompt: "Three-letter abbreviation for the lockout/tagout safety procedure?",
              accept: ["loto", "l.o.t.o", "l.o.t.o."],
              explain: "LOTO = Lockout/Tagout. Lock the breaker, tag it with your name.",
            },
          ],
        },
      },
    ],
  },

  // ==========================================================
  // ELECTRICAL — Motor Calculations (Journeyman)
  // ==========================================================
  {
    id: "elec-motor-calcs",
    trade: "electrical",
    title: "Motor Calculations: From FLA to the Licensing Exam",
    level: "Journeyman",
    tagline: "The one topic that shows up on every journeyman and master exam.",
    why: "Motor problems are the highest-point-value questions on most licensing exams. Nail the FLA → conductor → OCP → disconnect path and you gain 15–20 points.",
    modules: [
      {
        id: "m1",
        title: "Full-Load Amperes (FLA)",
        summary: "Table 430.247 / 248 / 249 / 250. Never use nameplate for conductor sizing.",
        lessons: [
          {
            id: "l1",
            title: "Where FLA Actually Lives",
            minutes: 8,
            body: "The NEC __EDITION__ gives you four FLA tables. Know which is which:\n\n• Table 430.247 — DC motors\n• Table 430.248 — Single-phase AC motors\n• Table 430.249 — Two-phase AC motors (rare)\n• Table 430.250 — Three-phase AC motors\n\nHere's the trap: motor nameplates also list FLA (they call it FLC — full-load current). For BRANCH CIRCUIT CONDUCTOR SIZING and OVERCURRENT PROTECTION SIZING, NEC __EDITION__ · 430.6(A)(1) says you MUST use the table value, not the nameplate. The nameplate FLA is only used for overload sizing (430.32).\n\nExample: 5 HP, 230V, 3-phase motor. Table 430.250 → 15.2 A. That's the number you carry through every downstream calculation.",
            keyPoints: [
              "Three-phase → Table 430.250",
              "Single-phase → Table 430.248",
              "Table FLA for branch circuit + OCP. Nameplate FLA only for overload.",
            ],
            tip: "The exam will give you HP and voltage. Go straight to Table 430.250 for 3-phase or 430.248 for single-phase. Do not use the nameplate — 430.6(A)(1).",
          },
        ],
        quiz: {
          id: "q1",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "single",
              prompt:
                "For branch-circuit conductor sizing on a 3-phase motor, which value do you use?",
              options: [
                "Nameplate FLA",
                "Table 430.250 value",
                "Measured amps at startup",
                "Nameplate × 1.25",
              ],
              answerIndex: 1,
              explain:
                "NEC __EDITION__ · 430.6(A)(1) — use the table value, not the nameplate, for conductor and OCP sizing.",
            },
            {
              id: "b",
              kind: "short",
              prompt: "Which NEC table lists FLA for three-phase AC motors?",
              accept: ["430.250", "table 430.250", "t 430.250"],
              explain: "Table 430.250. Tab it.",
            },
            {
              id: "c",
              kind: "truefalse",
              prompt: "Nameplate FLA is used for overload device sizing (430.32).",
              answer: true,
              explain: "Overloads use nameplate. Branch circuit and OCP use table value.",
            },
            {
              id: "d",
              kind: "multi",
              prompt: "Which tables cover motor FLA? (select all)",
              options: ["Table 430.247", "Table 430.248", "Table 310.16", "Table 430.250"],
              answerIndices: [0, 1, 3],
              explain: "310.16 is conductor ampacity — different table.",
            },
          ],
        },
      },
      {
        id: "m2",
        title: "Branch Circuit Conductors — the 125% Rule",
        summary: "430.22: conductors sized at 125% of table FLA.",
        lessons: [
          {
            id: "l1",
            title: "The 1.25 Multiplier",
            minutes: 10,
            body: "NEC __EDITION__ · 430.22 requires branch-circuit conductors supplying a single continuous-duty motor to be sized at not less than 125% of the motor's full-load current.\n\nWorked examples:\n\n1 HP, 120V, single-phase → Table 430.248 → 16 A. Conductor min ampacity = 16 × 1.25 = 20 A → Table 310.16 → 12 AWG copper.\n\n5 HP, 230V, 3-phase → Table 430.250 → 15.2 A. 15.2 × 1.25 = 19 A → 12 AWG copper (14 AWG max is 20A at 75°C but only 15A per 240.4(D)(3)).\n\n10 HP, 208V, 3-phase → Table 430.250 → 30.8 A. 30.8 × 1.25 = 38.5 A → 8 AWG copper (50A at 75°C).\n\n10 HP, 480V, 3-phase → Table 430.250 → 14 A. 14 × 1.25 = 17.5 A → 12 AWG copper.",
            keyPoints: [
              "Conductor ≥ FLA × 1.25 (430.22)",
              "Then look up wire size in Table 310.16",
              "Apply 240.4(D) small-conductor limits to 14, 12, 10 AWG",
            ],
            tip: "The magic multiplier is 1.25. FLA × 1.25 = minimum conductor ampacity. Then go to Table 310.16 to find the wire size.",
          },
        ],
        quiz: {
          id: "q2",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "short",
              prompt:
                "Multiplier applied to motor FLA to size branch-circuit conductors (per 430.22)?",
              accept: ["1.25", "125%", "125", "1.25x"],
              explain: "1.25 (125%). NEC __EDITION__ · 430.22.",
            },
            {
              id: "b",
              kind: "short",
              prompt:
                "5 HP, 230V, 3-phase motor. Table 430.250 gives 15.2 A. Minimum branch-circuit conductor ampacity in amps?",
              accept: ["19", "19a", "19 a"],
              explain: "15.2 × 1.25 = 19 A.",
            },
            {
              id: "c",
              kind: "short",
              prompt:
                "1 HP, 120V, single-phase motor. Table 430.248 gives 16 A. Minimum conductor ampacity?",
              accept: ["20", "20a", "20 a"],
              explain: "16 × 1.25 = 20 A → 12 AWG copper.",
            },
            {
              id: "d",
              kind: "single",
              prompt: "After computing 125% × FLA, where do you find the wire size?",
              options: ["Table 430.52", "Table 310.16", "Table 250.66", "Table 300.5"],
              answerIndex: 1,
              explain: "Table 310.16 — conductor ampacity for insulated conductors.",
            },
          ],
        },
      },
      {
        id: "m3",
        title: "Motor Overcurrent Protection (OCP)",
        summary:
          "430.52 and Table 430.52 — inverse-time 250%, dual-element fuse 175%, instantaneous trip 800%.",
        lessons: [
          {
            id: "l1",
            title: "Reading Table 430.52",
            minutes: 11,
            body: "Motors draw locked-rotor current at startup — up to 6× FLA. Standard breakers would trip immediately. NEC __EDITION__ · Table 430.52 tells you the MAXIMUM allowable branch-circuit short-circuit and ground-fault protection, expressed as a percentage of FLA:\n\n• Non-time-delay (one-time) fuse — 300% of FLA\n• Dual-element (time-delay) fuse — 175% of FLA\n• Instantaneous-trip circuit breaker — 800% of FLA\n• Inverse-time circuit breaker — 250% of FLA\n\nAfter you compute the % × FLA number, NEC __EDITION__ · 430.52(C)(1) Exception 1 lets you round UP to the next standard size from 240.6(A) if the calculated value doesn't hit a standard.\n\nStandard sizes (240.6(A)): 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600 …\n\nWorked example: 10 HP, 208V, 3-phase, FLA = 30.8 A. Inverse-time breaker: 30.8 × 2.50 = 77 A. Not standard. Round up to 80 A.\n\nCommon exam trap: mixing dual-element (175%) with non-time-delay (300%). Read the fuse type carefully.",
            keyPoints: [
              "Inverse-time breaker = 250% × FLA",
              "Dual-element (time-delay) fuse = 175% × FLA",
              "Round up to next standard 240.6(A) size",
            ],
            tip: "Table 430.52 is the single most tested motor table on licensing exams. Tab it in your NEC book right now.",
          },
        ],
        quiz: {
          id: "q3",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "short",
              prompt: "Percentage of FLA for an inverse-time breaker (Table 430.52)?",
              accept: ["250", "250%"],
              explain: "250%. NEC __EDITION__ · Table 430.52.",
            },
            {
              id: "b",
              kind: "short",
              prompt: "Percentage of FLA for a dual-element (time-delay) fuse?",
              accept: ["175", "175%"],
              explain: "175%.",
            },
            {
              id: "c",
              kind: "short",
              prompt:
                "10 HP, 208V, 3-phase (FLA 30.8 A). Inverse-time breaker size after rounding to next standard, in amps?",
              accept: ["80", "80a", "80 a"],
              explain: "30.8 × 2.50 = 77 A → round up to 80 A (240.6(A)).",
            },
            {
              id: "d",
              kind: "single",
              prompt:
                "You calculated an OCP value that lands between two standard sizes. What does 430.52(C)(1) Ex. 1 allow?",
              options: [
                "Always round down",
                "Round up to the next standard size in 240.6(A)",
                "Split the difference",
                "Only round up if the motor is over 100 HP",
              ],
              answerIndex: 1,
              explain: "Round up to the next standard size.",
            },
          ],
        },
      },
      {
        id: "m4",
        title: "Motor Disconnect and Controller",
        summary: "430.102 disconnect requirements; controller must break locked-rotor current.",
        lessons: [
          {
            id: "l1",
            title: "Disconnect Location and Rating",
            minutes: 9,
            body: "NEC __EDITION__ · 430.102(A) — a disconnecting means shall be located within sight of the CONTROLLER.\n430.102(B) — a disconnect shall also be located within sight of the MOTOR and driven machinery, with some exceptions (industrial process, capable-of-being-locked disconnect at the controller).\n\nRating: The disconnect must be rated at least 115% of the motor's FLA (430.110(A)). It must also be able to interrupt locked-rotor current — this is why we use HP-rated disconnects.\n\nController: Per 430.83, the controller must have a horsepower rating equal to or greater than the motor. Combination starters combine disconnect + controller + overload in a single enclosure — common on commercial jobs.",
            keyPoints: [
              "Disconnect within sight of controller (430.102(A))",
              "Disconnect within sight of motor (430.102(B), with exceptions)",
              "Disconnect rated ≥ 115% of FLA (430.110(A))",
              "Controller HP rating ≥ motor HP (430.83)",
            ],
          },
        ],
        quiz: {
          id: "q4",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "single",
              prompt:
                "Minimum disconnect current rating for a motor per NEC __EDITION__ · 430.110(A)?",
              options: ["100% of FLA", "115% of FLA", "125% of FLA", "250% of FLA"],
              answerIndex: 1,
              explain: "115% of FLA. Do not confuse with the 125% conductor rule.",
            },
            {
              id: "b",
              kind: "truefalse",
              prompt:
                "The controller must have a horsepower rating equal to or greater than the motor.",
              answer: true,
              explain: "430.83.",
            },
            {
              id: "c",
              kind: "short",
              prompt: "NEC section requiring a disconnect within sight of the controller?",
              accept: ["430.102", "430.102(a)"],
              explain: "430.102(A).",
            },
          ],
        },
      },
      {
        id: "m5",
        title: "Full Motor Circuit Calculation — Exam Drill",
        summary: "HP + voltage → FLA → conductor → OCP → disconnect. In 90 seconds.",
        lessons: [
          {
            id: "l1",
            title: "The 90-Second Path",
            minutes: 12,
            body: "Given: 25 HP, 460V, 3-phase, continuous duty. Inverse-time breaker for branch circuit protection.\n\nStep 1 — FLA (Table 430.250)\nLook up 25 HP at 460V → 34 A.\n\nStep 2 — Branch-circuit conductor (430.22)\n34 × 1.25 = 42.5 A minimum ampacity → Table 310.16 → 8 AWG copper (50 A at 75°C).\n\nStep 3 — OCP (Table 430.52, inverse-time breaker)\n34 × 2.50 = 85 A. Not standard. Round up per 430.52(C)(1) Ex. 1 → 90 A breaker.\n\nStep 4 — Disconnect (430.110(A))\n34 × 1.15 = 39.1 A minimum. Use next standard HP-rated disconnect (typically 60 A HP-rated for a 25 HP / 460V motor).\n\nThat's the entire path. FLA → conductor → OCP → disconnect. Every motor calc question on every exam follows this order.",
            keyPoints: [
              "FLA from Table 430.247–430.250",
              "Conductor: FLA × 1.25 → Table 310.16",
              "OCP: FLA × Table 430.52 % → round up to 240.6(A)",
              "Disconnect: FLA × 1.15, HP-rated",
            ],
            tip: "On the exam you have ~2 minutes per question. If it's a motor calc, you need FLA → conductor → OCP in 90 seconds. Practice this path until it's automatic.",
          },
        ],
        quiz: {
          id: "q5",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "short",
              prompt: "25 HP, 460V, 3-phase motor. Table 430.250 FLA in amps?",
              accept: ["34", "34a", "34 a"],
              explain: "34 A. This is the number you carry through the rest of the calc.",
            },
            {
              id: "b",
              kind: "short",
              prompt: "Same motor. Minimum branch-circuit conductor ampacity (FLA × 1.25)?",
              accept: ["42.5", "42.5a", "43"],
              explain: "34 × 1.25 = 42.5 A. Round up in wire selection to 8 AWG copper.",
            },
            {
              id: "c",
              kind: "short",
              prompt:
                "Same motor with an inverse-time breaker. Standard breaker size after rounding (amps)?",
              accept: ["90", "90a", "90 a"],
              explain: "34 × 2.50 = 85 A → round up to 90 A per 240.6(A).",
            },
            {
              id: "d",
              kind: "single",
              prompt: "In what order do you solve a motor problem on the exam?",
              options: [
                "OCP → disconnect → FLA → conductor",
                "Conductor → FLA → OCP → disconnect",
                "FLA → conductor → OCP → disconnect",
                "Disconnect → OCP → conductor → FLA",
              ],
              answerIndex: 2,
              explain: "Always: FLA → conductor → OCP → disconnect. Muscle memory.",
            },
          ],
        },
      },
    ],
  },

  // ==========================================================
  // PLUMBING (unchanged)
  // ==========================================================
  {
    id: "plumb-101",
    trade: "plumbing",
    title: "Drain, Waste, and Vent Basics",
    level: "Apprentice",
    tagline: "Why every fixture needs a vent — and what happens when it doesn't.",
    why: "A drain without a proper vent will siphon traps dry and pull sewer gas into the house. Get DWV right or every other thing you do is decoration.",
    modules: [
      {
        id: "m1",
        title: "Traps, Vents, and Slope",
        summary: "P-traps, vent distance, and the 1/4-inch-per-foot rule.",
        lessons: [
          {
            id: "l1",
            title: "Why P-Traps Hold Water",
            minutes: 6,
            body: 'Every fixture connects to the waste stack through a P-trap. The water held in the bend is a seal that blocks sewer gas. If the seal evaporates, siphons out, or is blown out, the house smells.\n\nVents prevent siphoning by letting air into the system above the trap. The maximum distance from trap to vent depends on the drain size — for a 1-1/2" line, typically 5 ft.',
            keyPoints: [
              "P-trap seal = ~2 inches of water",
              "Vent within code distance of every trap",
              "1/4 in. per foot drainage slope",
            ],
          },
          {
            id: "l2",
            title: "Sizing the Vent",
            minutes: 8,
            body: 'Vent diameter is typically half the drain it serves, but never less than 1-1/4". The vent stack through the roof must terminate at least 6 inches above the roof and away from windows.\n\nWet venting and air admittance valves (AAVs) can simplify retrofits, but check your local code — not all jurisdictions accept AAVs.',
            keyPoints: [
              'Vent ≥ 1/2 drain size, min 1-1/4"',
              "Roof termination clear of openings",
              "AAVs only where code allows",
            ],
          },
        ],
        quiz: {
          id: "q1",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "short",
              prompt: "Standard slope for a horizontal drain line, in inches per foot?",
              accept: ["1/4", "0.25", "quarter", "1/4 inch", '1/4"'],
              explain:
                "1/4 inch per foot keeps liquids and solids moving together. Steeper can let water outrun solids.",
            },
            {
              id: "b",
              kind: "single",
              prompt: "What does the water in a P-trap do?",
              options: [
                "Slows down drainage",
                "Seals against sewer gas",
                "Filters debris",
                "Cools the pipe",
              ],
              answerIndex: 1,
              explain: "The water seal is what blocks sewer gas from entering the building.",
            },
            {
              id: "c",
              kind: "multi",
              prompt: "Which are TRUE about DWV vents? (select all)",
              options: [
                'Minimum vent diameter is 1-1/4"',
                'Roof termination must be at least 6" above the roof',
                "AAVs are accepted in every jurisdiction",
                "A vent prevents trap siphoning",
              ],
              answerIndices: [0, 1, 3],
              explain: "AAV acceptance varies — always check local code.",
            },
            {
              id: "d",
              kind: "truefalse",
              prompt: "A steeper-than-1/4-in-per-foot slope is always better.",
              answer: false,
              explain: "Too steep and water outruns solids, leaving clogs. Stick to the spec.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "plumb-201",
    trade: "plumbing",
    title: "Pressure, Pipe, and Fittings",
    level: "Journeyman",
    tagline: "Choose the right material before you cut.",
    why: "PEX, copper, CPVC and PVC all have a job. Pick wrong and you'll be re-doing the work in five years — on your dime.",
    modules: [
      {
        id: "m1",
        title: "Material Selection",
        summary: "What goes where, and why.",
        lessons: [
          {
            id: "l1",
            title: "Hot, Cold, and Pressure Ratings",
            minutes: 8,
            body: "PEX is flexible, freeze-tolerant, and fast to install — first choice for residential supply runs. Copper is durable and bacteriostatic but expensive and slow. CPVC handles hot water; standard PVC does not.\n\nFor drain lines, PVC is the workhorse. ABS is common in some regions. Never mix glues — PVC cement on ABS, or vice versa, fails.",
            keyPoints: [
              "PEX: residential supply, freeze-friendly",
              "Copper: durable, premium",
              "PVC drains, CPVC for hot supply",
            ],
          },
        ],
        quiz: {
          id: "q1",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "single",
              prompt: "Which material is NOT rated for hot domestic water supply?",
              options: ["Copper Type L", "PEX-A", "Standard PVC", "CPVC"],
              answerIndex: 2,
              explain: "Standard PVC softens at hot-water temperatures. Use CPVC instead.",
            },
            {
              id: "b",
              kind: "truefalse",
              prompt: "PVC cement is interchangeable with ABS cement.",
              answer: false,
              explain: "Mixing PVC and ABS solvents leads to failed joints. Use the right glue.",
            },
            {
              id: "c",
              kind: "multi",
              prompt: "Which materials handle hot domestic supply? (select all)",
              options: ["Copper Type L", "CPVC", "Standard PVC", "PEX-A"],
              answerIndices: [0, 1, 3],
              explain: "Copper, CPVC, and PEX all handle hot supply. Standard PVC does not.",
            },
          ],
        },
      },
    ],
  },

  // ==========================================================
  // HVAC (unchanged)
  // ==========================================================
  {
    id: "hvac-101",
    trade: "hvac",
    title: "The Refrigeration Cycle",
    level: "Apprentice",
    tagline: "Compress, condense, expand, evaporate.",
    why: "Every diagnostic decision on a cooling system traces back to one of four states of the refrigerant. If you can't picture the cycle, you can't read your gauges.",
    modules: [
      {
        id: "m1",
        title: "Four Components, One Loop",
        summary: "Compressor, condenser, metering device, evaporator.",
        lessons: [
          {
            id: "l1",
            title: "Following the Refrigerant",
            minutes: 9,
            body: "Refrigerant leaves the compressor as a hot high-pressure vapor. In the condenser (outdoor coil), it gives up heat and turns to a hot high-pressure liquid.\n\nThe metering device (TXV or fixed orifice) drops the pressure dramatically. Now a cold low-pressure liquid enters the evaporator (indoor coil), absorbs heat from indoor air, and boils into a cold low-pressure vapor. Back to the compressor. Repeat.",
            keyPoints: [
              "Heat moves from indoors to outdoors via state change",
              "High side = compressor → condenser → metering device inlet",
              "Low side = metering device outlet → evaporator → compressor",
            ],
          },
          {
            id: "l2",
            title: "Superheat and Subcooling",
            minutes: 10,
            body: "Superheat is how many degrees the refrigerant vapor leaving the evaporator is above its saturation temperature. Too low = liquid floodback into the compressor (bad). Too high = starved evaporator, poor cooling.\n\nSubcooling is how many degrees the liquid leaving the condenser is below saturation. Used to verify charge on TXV systems. Most manufacturers spec 8-12°F.",
            keyPoints: [
              "Superheat measured at evaporator outlet",
              "Subcooling measured at condenser outlet",
              "TXV = charge by subcool; fixed orifice = charge by superheat",
            ],
          },
        ],
        quiz: {
          id: "q1",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "single",
              prompt: "On a TXV system, which value verifies proper charge?",
              options: ["Superheat", "Subcooling", "Static pressure", "Amp draw"],
              answerIndex: 1,
              explain:
                "A TXV maintains superheat automatically, so subcooling is the meaningful indicator of charge.",
            },
            {
              id: "b",
              kind: "truefalse",
              prompt: "On a fixed-orifice system, charge is verified by superheat.",
              answer: true,
              explain: "Without a TXV, superheat varies with charge and is the right target.",
            },
            {
              id: "c",
              kind: "multi",
              prompt: "Which components are on the HIGH side of the system? (select all)",
              options: ["Compressor discharge", "Condenser", "Evaporator", "Metering device inlet"],
              answerIndices: [0, 1, 3],
              explain:
                "The high side runs from the compressor discharge through the condenser to the metering device inlet.",
            },
            {
              id: "d",
              kind: "short",
              prompt:
                "Typical manufacturer subcooling spec, in degrees F (give a number in range)?",
              accept: ["8", "9", "10", "11", "12"],
              explain: "Most manufacturers spec 8-12°F of subcooling.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "hvac-201",
    trade: "hvac",
    title: "Airflow and Static Pressure",
    level: "Journeyman",
    tagline: "If air isn't moving, the cycle doesn't matter.",
    why: "Most 'low refrigerant' calls are actually airflow problems. Learn to measure static pressure before you ever connect gauges.",
    modules: [
      {
        id: "m1",
        title: "Reading Total External Static",
        summary: "Manometer placement and what the numbers mean.",
        lessons: [
          {
            id: "l1",
            title: "TESP Measurement",
            minutes: 8,
            body: 'Total external static pressure is the resistance the blower has to overcome — return-side plus supply-side, measured outside the air handler (after the filter, before the coil on supply).\n\nMost residential equipment is rated for 0.5" WC total. Anything over 0.8" indicates a serious restriction: undersized duct, blocked filter, or dirty coil.',
            keyPoints: [
              "Drill test ports after filter and before coil/heat exchanger",
              'Rated TESP usually 0.5" WC',
              "High static = restriction, not weak blower",
            ],
          },
        ],
        quiz: {
          id: "q1",
          passPct: PASS,
          questions: [
            {
              id: "a",
              kind: "single",
              prompt: 'A system measures 0.95" WC TESP. Most likely cause?',
              options: [
                "Refrigerant overcharge",
                "Severe duct or filter restriction",
                "Open blower door",
                "Low voltage",
              ],
              answerIndex: 1,
              explain:
                "Static this high almost always points to airflow restriction — dirty filter, undersized return, or blocked coil.",
            },
            {
              id: "b",
              kind: "truefalse",
              prompt: "High static pressure means the blower motor is failing.",
              answer: false,
              explain:
                "Static measures the system's resistance, not the blower's health. Restrictions cause high static.",
            },
            {
              id: "c",
              kind: "short",
              prompt: "Typical residential TESP rating in inches WC?",
              accept: ["0.5", ".5", "0.50", "half"],
              explain: 'Most residential equipment is rated 0.5" WC.',
            },
          ],
        },
      },
    ],
  },
];

export const courseById = (id: string) => COURSES.find((c) => c.id === id);
export const coursesByTrade = (t: Trade) => COURSES.filter((c) => c.trade === t);

export function totalQuestions(moduleQuiz: Quiz) {
  return moduleQuiz.questions.length;
}

/**
 * Deep-substitute the current NEC edition into every string field of a course.
 * Replaces the literal token __EDITION__ with e.g. "2023" so citations render
 * as "NEC 2023 · 430.22" throughout the app.
 */
export function applyEdition<T>(value: T, edition: string | null): T {
  const ed = edition ?? "—";
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return v.split(EDITION_TOKEN).join(ed);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        out[k] = walk(val);
      }
      return out;
    }
    return v;
  };
  return walk(value) as T;
}
