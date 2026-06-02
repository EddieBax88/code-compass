/**
 * Code Compass — NEC Question Bank
 * Data Model includes full index lookup path for teaching the book navigation methodology
 */

export interface LookupPath {
  index_keywords: string[];       // Words to search in the NEC index
  index_entry: string;            // Exact index entry to find
  article_or_table: string;       // Where the index sends you
  what_to_look_for: string;       // What to read on that page (table row, exception, subsection)
}

export interface QuestionCard {
  id: string;
  question: string;
  choices: string[];
  correct_answer: string;
  explanation: string;
  nec_article: string;
  nec_versions: ("2017" | "2020" | "2023" | "2026")[];  // Which code editions this applies to
  difficulty: "journeyman" | "master" | "inspector";
  tags: string[];
  lookup_path: LookupPath;
}

export const questionBank: QuestionCard[] = [
  {
    id: "310-001",
    question: "What is the allowable ampacity of a 3/0 AWG copper THWN-2 conductor installed in a raceway containing three current-carrying conductors at an ambient temperature of 30°C?",
    choices: ["200 amps", "225 amps", "250 amps", "175 amps"],
    correct_answer: "225 amps",
    explanation: "Per Table 310.16, a 3/0 AWG copper conductor with 90°C rated insulation (THWN-2) has an ampacity of 225A with not more than three current-carrying conductors at 30°C ambient.",
    nec_article: "Table 310.16",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["ampacity", "conductors", "raceway", "THWN-2"],
    lookup_path: {
      index_keywords: ["Ampacity", "Conductors, ampacity"],
      index_entry: "Conductors, ampacity — see Table 310.16",
      article_or_table: "Table 310.16",
      what_to_look_for: "Find the '3/0 AWG' row → read the '90°C (THWN-2)' copper column → value is 225A"
    }
  },
  {
    id: "430-001",
    question: "What is the maximum percentage of full-load current rating used to size branch-circuit short-circuit and ground-fault protection for a non-time-delay fuse protecting a single-phase motor?",
    choices: ["150%", "200%", "250%", "300%"],
    correct_answer: "300%",
    explanation: "Table 430.52(C)(1) specifies a maximum of 300% of motor FLC for non-time-delay fuses. This can increase to 400% if the motor cannot start at 300%.",
    nec_article: "Table 430.52(C)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["motors", "overcurrent", "fuses", "branch-circuit"],
    lookup_path: {
      index_keywords: ["Motors, overcurrent protection", "Fuses, motor branch circuit"],
      index_entry: "Motors — branch-circuit short-circuit and ground-fault protection → 430.52",
      article_or_table: "Table 430.52(C)(1)",
      what_to_look_for: "Find 'Non-time-delay fuse' row → read the '% of Full-Load Current' column → 300%"
    }
  },
  {
    id: "250-001",
    question: "What is the minimum size copper grounding electrode conductor required for a service supplied by 4/0 AWG copper ungrounded service-entrance conductors?",
    choices: ["4 AWG", "2 AWG", "1/0 AWG", "6 AWG"],
    correct_answer: "2 AWG",
    explanation: "Table 250.66 requires a minimum 2 AWG copper grounding electrode conductor when service-entrance conductors are sized 3/0 through 250 kcmil copper.",
    nec_article: "Table 250.66",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["grounding", "service", "electrode conductor"],
    lookup_path: {
      index_keywords: ["Grounding electrode conductor, size", "Service, grounding"],
      index_entry: "Grounding electrode conductors — size → Table 250.66",
      article_or_table: "Table 250.66",
      what_to_look_for: "Find '3/0 AWG–350 kcmil' row in the service conductor column → GEC size is 2 AWG copper"
    }
  },
  {
    id: "210-001",
    question: "What is the minimum number of 20-ampere small-appliance branch circuits required for a dwelling unit kitchen?",
    choices: ["One", "Two", "Three", "Four"],
    correct_answer: "Two",
    explanation: "NEC 210.11(C)(1) requires at least two 20-ampere small-appliance branch circuits to serve receptacle outlets in the kitchen, pantry, dining room, and similar areas.",
    nec_article: "210.11(C)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["dwelling", "kitchen", "branch circuits", "receptacles"],
    lookup_path: {
      index_keywords: ["Small-appliance branch circuits", "Kitchen, branch circuits"],
      index_entry: "Small-appliance branch circuits — dwelling units → 210.11(C)(1)",
      article_or_table: "210.11(C)(1)",
      what_to_look_for: "Read the section — it states 'not fewer than two' 20-ampere circuits required"
    }
  },
  {
    id: "450-001",
    question: "What is the maximum overcurrent protection rating for the primary of a transformer (600V or less) with a primary current of 9 amperes or more, when there is no secondary protection?",
    choices: ["125%", "150%", "167%", "200%"],
    correct_answer: "125%",
    explanation: "NEC 450.3(B) requires primary-only overcurrent protection for transformers rated 600V or less with primary current of 9A or more to be set at not more than 125% of rated primary current.",
    nec_article: "450.3(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["transformers", "overcurrent", "primary protection"],
    lookup_path: {
      index_keywords: ["Transformers, overcurrent protection", "Overcurrent protection, transformers"],
      index_entry: "Transformers — overcurrent protection → 450.3",
      article_or_table: "Table 450.3(B)",
      what_to_look_for: "Find row for 'Primary ≥ 9A, no secondary protection' → column shows 125% maximum"
    }
  },
  {
    id: "500-001",
    question: "What is the classification of a location where ignitable concentrations of flammable gases are present continuously under normal operating conditions?",
    choices: ["Class I, Division 1", "Class I, Division 2", "Class II, Division 1", "Zone 0"],
    correct_answer: "Class I, Division 1",
    explanation: "NEC 500.5(B)(1) defines Class I, Division 1 as locations where ignitable concentrations of flammable gases or vapors can exist under normal operating conditions.",
    nec_article: "500.5(B)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["hazardous locations", "classification", "flammable gases"],
    lookup_path: {
      index_keywords: ["Hazardous locations, classified", "Class I locations"],
      index_entry: "Hazardous (classified) locations — Class I → 500.5(B)",
      article_or_table: "500.5(B)(1)",
      what_to_look_for: "Read (B)(1) — 'continuously, intermittently, or periodically under normal operating conditions' = Division 1"
    }
  },
  {
    id: "690-001",
    question: "What is the maximum permitted system voltage for a photovoltaic (PV) system installed in a one-family dwelling?",
    choices: ["300 volts", "480 volts", "600 volts", "1000 volts"],
    correct_answer: "600 volts",
    explanation: "NEC 690.7(2) limits the maximum DC system voltage for PV systems on one- and two-family dwellings to 600 volts.",
    nec_article: "690.7(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["solar", "photovoltaic", "voltage", "dwelling"],
    lookup_path: {
      index_keywords: ["Photovoltaic systems, voltage", "Solar systems, maximum voltage"],
      index_entry: "Photovoltaic (PV) systems — maximum voltage → 690.7",
      article_or_table: "690.7(2)",
      what_to_look_for: "Read subsection (2) — one- and two-family dwellings limited to 600V DC maximum"
    }
  },
  {
    id: "314-001",
    question: "What is the maximum number of 10 AWG conductors permitted in a 4 inch x 1½ inch square box?",
    choices: ["6", "7", "8", "9"],
    correct_answer: "8",
    explanation: "Table 314.16(A)(2) permits a maximum of 8 conductors of 10 AWG in a 4 x 1½ inch square metal box (21.0 cubic inches volume).",
    nec_article: "Table 314.16(A)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["box fill", "conductors", "square box"],
    lookup_path: {
      index_keywords: ["Box fill", "Outlet boxes, conductor fill", "Boxes, conductor fill"],
      index_entry: "Boxes — conductor fill → 314.16 → Table 314.16(A)",
      article_or_table: "Table 314.16(A)(2)",
      what_to_look_for: "Find '4 × 1½ square' row → read '10 AWG' conductor count column → 8 conductors"
    }
  },
  {
    id: "240-001",
    question: "What is the standard ampere rating for an overcurrent device immediately above 800 amperes?",
    choices: ["850 amperes", "900 amperes", "1000 amperes", "1200 amperes"],
    correct_answer: "1000 amperes",
    explanation: "Table 240.6(A) lists 1000 amperes as the next standard rating above 800 amperes for fuses and inverse time circuit breakers.",
    nec_article: "Table 240.6(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["overcurrent", "standard ratings", "circuit breakers"],
    lookup_path: {
      index_keywords: ["Overcurrent protective devices, ratings", "Circuit breakers, standard ratings"],
      index_entry: "Overcurrent protective devices — standard ampere ratings → 240.6(A)",
      article_or_table: "Table 240.6(A)",
      what_to_look_for: "Scan the list of standard ratings — after 800A the next value listed is 1000A"
    }
  },
  {
    id: "680-001",
    question: "What is the minimum required depth for a wet-niche luminaire installed in a permanently installed swimming pool?",
    choices: ["12 inches", "18 inches", "24 inches", "4 inches"],
    correct_answer: "18 inches",
    explanation: "NEC 680.23(A)(5) requires the top of the luminaire lens to be installed at least 18 inches below the normal water level of the pool.",
    nec_article: "680.23(A)(5)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["swimming pool", "luminaire", "wet-niche", "depth"],
    lookup_path: {
      index_keywords: ["Swimming pools, luminaires", "Luminaires, wet-niche", "Pools, underwater lighting"],
      index_entry: "Swimming pools — luminaires, wet-niche → 680.23",
      article_or_table: "680.23(A)(5)",
      what_to_look_for: "Read (A)(5) under wet-niche luminaires — '18 inches below the normal water level'"
    }
  },
  {
    id: "230-001",
    question: "What is the maximum number of service disconnecting means permitted for a single building?",
    choices: ["2", "4", "6", "8"],
    correct_answer: "6",
    explanation: "NEC 230.71(A) permits a maximum of six disconnects per service for each service or set of service-entrance conductors.",
    nec_article: "230.71(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["service", "disconnect", "service entrance"],
    lookup_path: {
      index_keywords: ["Service disconnecting means, number", "Disconnecting means, service"],
      index_entry: "Service disconnecting means — number of → 230.71",
      article_or_table: "230.71(A)",
      what_to_look_for: "Read (A) — 'not more than six disconnects per service' for each set of service-entrance conductors"
    }
  },
  {
    id: "410-001",
    question: "What is the minimum clearance required between a luminaire and the top of a clothes closet storage space?",
    choices: ["6 inches", "12 inches", "18 inches", "24 inches"],
    correct_answer: "12 inches",
    explanation: "NEC 410.16(A)(2) requires a minimum clearance of 12 inches between a surface-mounted incandescent luminaire with a completely enclosed lamp and the nearest point of a storage space.",
    nec_article: "410.16(A)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["luminaires", "closet", "clearance"],
    lookup_path: {
      index_keywords: ["Clothes closets, luminaires", "Luminaires, clothes closets"],
      index_entry: "Clothes closets — luminaires → 410.16",
      article_or_table: "410.16(A)(2)",
      what_to_look_for: "Read (A)(2) for surface-mounted enclosed luminaires — 12 inch clearance from storage space"
    }
  },
];

// Helper: get random questions
export function getRandomQuestions(count: number, difficulty?: QuestionCard["difficulty"], version?: string): QuestionCard[] {
  let pool = difficulty ? questionBank.filter(q => q.difficulty === difficulty) : [...questionBank];
  if (version && version !== "all") {
    pool = pool.filter(q => q.nec_versions.includes(version as "2017" | "2020" | "2023" | "2026"));
  }
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Helper: search questions
export function searchQuestions(query: string): QuestionCard[] {
  const q = query.toLowerCase();
  return questionBank.filter(card =>
    card.question.toLowerCase().includes(q) ||
    card.nec_article.toLowerCase().includes(q) ||
    card.tags.some(t => t.toLowerCase().includes(q)) ||
    card.lookup_path.index_keywords.some(k => k.toLowerCase().includes(q)) ||
    card.explanation.toLowerCase().includes(q)
  );
}
