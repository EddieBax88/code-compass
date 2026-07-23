/**
 * Code Compass — NEC Question Bank
 * Data Model includes full index lookup path for teaching the book navigation methodology
 */

export interface LookupPath {
  index_keywords: string[]; // Words to search in the NEC index
  index_entry: string; // Exact index entry to find
  article_or_table: string; // Where the index sends you
  what_to_look_for: string; // What to read on that page (table row, exception, subsection)
}

export interface QuestionCard {
  id: string;
  question: string;
  choices: string[];
  correct_answer: string;
  explanation: string;
  nec_article: string;
  nec_versions: ("2017" | "2020" | "2023" | "2026")[]; // Which code editions this applies to
  difficulty: "journeyman" | "master" | "inspector";
  tags: string[];
  lookup_path: LookupPath;
}

export const questionBank: QuestionCard[] = [
  {
    id: "310-001",
    question:
      "What is the allowable ampacity of a 3/0 AWG copper THWN-2 conductor installed in a raceway containing three current-carrying conductors at an ambient temperature of 30°C?",
    choices: ["200 amps", "225 amps", "250 amps", "175 amps"],
    correct_answer: "225 amps",
    explanation:
      "Per Table 310.16, a 3/0 AWG copper conductor with 90°C rated insulation (THWN-2) has an ampacity of 225A with not more than three current-carrying conductors at 30°C ambient.",
    nec_article: "Table 310.16",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["ampacity", "conductors", "raceway", "THWN-2"],
    lookup_path: {
      index_keywords: ["Ampacity", "Conductors, ampacity"],
      index_entry: "Conductors, ampacity — see Table 310.16",
      article_or_table: "Table 310.16",
      what_to_look_for:
        "Find the '3/0 AWG' row → read the '90°C (THWN-2)' copper column → value is 225A",
    },
  },
  {
    id: "430-001",
    question:
      "What is the maximum percentage of full-load current rating used to size branch-circuit short-circuit and ground-fault protection for a non-time-delay fuse protecting a single-phase motor?",
    choices: ["150%", "200%", "250%", "300%"],
    correct_answer: "300%",
    explanation:
      "Table 430.52(C)(1) specifies a maximum of 300% of motor FLC for non-time-delay fuses. This can increase to 400% if the motor cannot start at 300%.",
    nec_article: "Table 430.52(C)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["motors", "overcurrent", "fuses", "branch-circuit"],
    lookup_path: {
      index_keywords: [
        "Motors, overcurrent protection",
        "Fuses, motor branch circuit",
      ],
      index_entry:
        "Motors — branch-circuit short-circuit and ground-fault protection → 430.52",
      article_or_table: "Table 430.52(C)(1)",
      what_to_look_for:
        "Find 'Non-time-delay fuse' row → read the '% of Full-Load Current' column → 300%",
    },
  },
  {
    id: "250-001",
    question:
      "What is the minimum size copper grounding electrode conductor required for a service supplied by 4/0 AWG copper ungrounded service-entrance conductors?",
    choices: ["4 AWG", "2 AWG", "1/0 AWG", "6 AWG"],
    correct_answer: "2 AWG",
    explanation:
      "Table 250.66 requires a minimum 2 AWG copper grounding electrode conductor when service-entrance conductors are sized 3/0 through 250 kcmil copper.",
    nec_article: "Table 250.66",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["grounding", "service", "electrode conductor"],
    lookup_path: {
      index_keywords: [
        "Grounding electrode conductor, size",
        "Service, grounding",
      ],
      index_entry: "Grounding electrode conductors — size → Table 250.66",
      article_or_table: "Table 250.66",
      what_to_look_for:
        "Find '3/0 AWG–350 kcmil' row in the service conductor column → GEC size is 2 AWG copper",
    },
  },
  {
    id: "210-001",
    question:
      "What is the minimum number of 20-ampere small-appliance branch circuits required for a dwelling unit kitchen?",
    choices: ["One", "Two", "Three", "Four"],
    correct_answer: "Two",
    explanation:
      "NEC 210.11(C)(1) requires at least two 20-ampere small-appliance branch circuits to serve receptacle outlets in the kitchen, pantry, dining room, and similar areas.",
    nec_article: "210.11(C)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["dwelling", "kitchen", "branch circuits", "receptacles"],
    lookup_path: {
      index_keywords: [
        "Small-appliance branch circuits",
        "Kitchen, branch circuits",
      ],
      index_entry:
        "Small-appliance branch circuits — dwelling units → 210.11(C)(1)",
      article_or_table: "210.11(C)(1)",
      what_to_look_for:
        "Read the section — it states 'not fewer than two' 20-ampere circuits required",
    },
  },
  {
    id: "450-001",
    question:
      "What is the maximum overcurrent protection rating for the primary of a transformer (600V or less) with a primary current of 9 amperes or more, when there is no secondary protection?",
    choices: ["125%", "150%", "167%", "200%"],
    correct_answer: "125%",
    explanation:
      "NEC 450.3(B) requires primary-only overcurrent protection for transformers rated 600V or less with primary current of 9A or more to be set at not more than 125% of rated primary current.",
    nec_article: "450.3(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["transformers", "overcurrent", "primary protection"],
    lookup_path: {
      index_keywords: [
        "Transformers, overcurrent protection",
        "Overcurrent protection, transformers",
      ],
      index_entry: "Transformers — overcurrent protection → 450.3",
      article_or_table: "Table 450.3(B)",
      what_to_look_for:
        "Find row for 'Primary ≥ 9A, no secondary protection' → column shows 125% maximum",
    },
  },
  {
    id: "500-001",
    question:
      "What is the classification of a location where ignitable concentrations of flammable gases are present continuously under normal operating conditions?",
    choices: [
      "Class I, Division 1",
      "Class I, Division 2",
      "Class II, Division 1",
      "Zone 0",
    ],
    correct_answer: "Class I, Division 1",
    explanation:
      "NEC 500.5(B)(1) defines Class I, Division 1 as locations where ignitable concentrations of flammable gases or vapors can exist under normal operating conditions.",
    nec_article: "500.5(B)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["hazardous locations", "classification", "flammable gases"],
    lookup_path: {
      index_keywords: ["Hazardous locations, classified", "Class I locations"],
      index_entry: "Hazardous (classified) locations — Class I → 500.5(B)",
      article_or_table: "500.5(B)(1)",
      what_to_look_for:
        "Read (B)(1) — 'continuously, intermittently, or periodically under normal operating conditions' = Division 1",
    },
  },
  {
    id: "690-001",
    question:
      "What is the maximum permitted system voltage for a photovoltaic (PV) system installed in a one-family dwelling?",
    choices: ["300 volts", "480 volts", "600 volts", "1000 volts"],
    correct_answer: "600 volts",
    explanation:
      "NEC 690.7(2) limits the maximum DC system voltage for PV systems on one- and two-family dwellings to 600 volts.",
    nec_article: "690.7(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["solar", "photovoltaic", "voltage", "dwelling"],
    lookup_path: {
      index_keywords: [
        "Photovoltaic systems, voltage",
        "Solar systems, maximum voltage",
      ],
      index_entry: "Photovoltaic (PV) systems — maximum voltage → 690.7",
      article_or_table: "690.7(2)",
      what_to_look_for:
        "Read subsection (2) — one- and two-family dwellings limited to 600V DC maximum",
    },
  },
  {
    id: "314-001",
    question:
      "What is the maximum number of 10 AWG conductors permitted in a 4 inch x 1½ inch square box?",
    choices: ["6", "7", "8", "9"],
    correct_answer: "8",
    explanation:
      "Table 314.16(A)(2) permits a maximum of 8 conductors of 10 AWG in a 4 x 1½ inch square metal box (21.0 cubic inches volume).",
    nec_article: "Table 314.16(A)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["box fill", "conductors", "square box"],
    lookup_path: {
      index_keywords: [
        "Box fill",
        "Outlet boxes, conductor fill",
        "Boxes, conductor fill",
      ],
      index_entry: "Boxes — conductor fill → 314.16 → Table 314.16(A)",
      article_or_table: "Table 314.16(A)(2)",
      what_to_look_for:
        "Find '4 × 1½ square' row → read '10 AWG' conductor count column → 8 conductors",
    },
  },
  {
    id: "240-001",
    question:
      "What is the standard ampere rating for an overcurrent device immediately above 800 amperes?",
    choices: ["850 amperes", "900 amperes", "1000 amperes", "1200 amperes"],
    correct_answer: "1000 amperes",
    explanation:
      "Table 240.6(A) lists 1000 amperes as the next standard rating above 800 amperes for fuses and inverse time circuit breakers.",
    nec_article: "Table 240.6(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["overcurrent", "standard ratings", "circuit breakers"],
    lookup_path: {
      index_keywords: [
        "Overcurrent protective devices, ratings",
        "Circuit breakers, standard ratings",
      ],
      index_entry:
        "Overcurrent protective devices — standard ampere ratings → 240.6(A)",
      article_or_table: "Table 240.6(A)",
      what_to_look_for:
        "Scan the list of standard ratings — after 800A the next value listed is 1000A",
    },
  },
  {
    id: "680-001",
    question:
      "What is the minimum required depth for a wet-niche luminaire installed in a permanently installed swimming pool?",
    choices: ["12 inches", "18 inches", "24 inches", "4 inches"],
    correct_answer: "18 inches",
    explanation:
      "NEC 680.23(A)(5) requires the top of the luminaire lens to be installed at least 18 inches below the normal water level of the pool.",
    nec_article: "680.23(A)(5)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["swimming pool", "luminaire", "wet-niche", "depth"],
    lookup_path: {
      index_keywords: [
        "Swimming pools, luminaires",
        "Luminaires, wet-niche",
        "Pools, underwater lighting",
      ],
      index_entry: "Swimming pools — luminaires, wet-niche → 680.23",
      article_or_table: "680.23(A)(5)",
      what_to_look_for:
        "Read (A)(5) under wet-niche luminaires — '18 inches below the normal water level'",
    },
  },
  {
    id: "230-001",
    question:
      "What is the maximum number of service disconnecting means permitted for a single building?",
    choices: ["2", "4", "6", "8"],
    correct_answer: "6",
    explanation:
      "NEC 230.71(A) permits a maximum of six disconnects per service for each service or set of service-entrance conductors.",
    nec_article: "230.71(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["service", "disconnect", "service entrance"],
    lookup_path: {
      index_keywords: [
        "Service disconnecting means, number",
        "Disconnecting means, service",
      ],
      index_entry: "Service disconnecting means — number of → 230.71",
      article_or_table: "230.71(A)",
      what_to_look_for:
        "Read (A) — 'not more than six disconnects per service' for each set of service-entrance conductors",
    },
  },
  {
    id: "410-001",
    question:
      "What is the minimum clearance required between a luminaire and the top of a clothes closet storage space?",
    choices: ["6 inches", "12 inches", "18 inches", "24 inches"],
    correct_answer: "12 inches",
    explanation:
      "NEC 410.16(A)(2) requires a minimum clearance of 12 inches between a surface-mounted incandescent luminaire with a completely enclosed lamp and the nearest point of a storage space.",
    nec_article: "410.16(A)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["luminaires", "closet", "clearance"],
    lookup_path: {
      index_keywords: [
        "Clothes closets, luminaires",
        "Luminaires, clothes closets",
      ],
      index_entry: "Clothes closets — luminaires → 410.16",
      article_or_table: "410.16(A)(2)",
      what_to_look_for:
        "Read (A)(2) for surface-mounted enclosed luminaires — 12 inch clearance from storage space",
    },
  },
  // ─── AMPACITY ───────────────────────────────────────────────────────────────
  {
    id: "310-002",
    question:
      "What ampacity correction factor applies to a 75°C rated conductor installed where the ambient temperature is 40°C?",
    choices: ["0.82", "0.88", "0.91", "0.94"],
    correct_answer: "0.88",
    explanation:
      "Table 310.15(B)(1) correction factors show that a 75°C rated conductor at 40°C ambient has a correction factor of 0.88, reducing its allowable ampacity.",
    nec_article: "Table 310.15(B)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: [
      "ampacity",
      "correction factor",
      "ambient temperature",
      "conductors",
    ],
    lookup_path: {
      index_keywords: [
        "Ampacity correction factors",
        "Temperature correction, conductors",
      ],
      index_entry:
        "Conductors — ampacity correction factors, ambient temperature → 310.15(B)(1)",
      article_or_table: "Table 310.15(B)(1)",
      what_to_look_for:
        "Find the '40°C' ambient row → read the '75°C' conductor column → correction factor is 0.88",
    },
  },
  {
    id: "310-003",
    question:
      "What adjustment factor applies when 7 to 9 current-carrying conductors are bundled together in a single raceway?",
    choices: ["50%", "60%", "70%", "80%"],
    correct_answer: "70%",
    explanation:
      "Table 310.15(C)(1) requires a 70% adjustment factor when 7 to 9 current-carrying conductors are installed in a single raceway or cable.",
    nec_article: "Table 310.15(C)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["ampacity", "adjustment factor", "bundling", "raceway"],
    lookup_path: {
      index_keywords: [
        "Ampacity adjustment factors",
        "Conductors, bundled",
        "Raceway fill, adjustment",
      ],
      index_entry:
        "Conductors — adjustment factors, more than 3 current-carrying → 310.15(C)(1)",
      article_or_table: "Table 310.15(C)(1)",
      what_to_look_for:
        "Find '7–9 conductors' row → read adjustment factor column → 70%",
    },
  },
  {
    id: "310-004",
    question:
      "A 1/0 AWG copper THHN conductor installed in a conduit with 3 current-carrying conductors at 30°C ambient has an allowable ampacity of:",
    choices: ["125 amps", "150 amps", "170 amps", "145 amps"],
    correct_answer: "150 amps",
    explanation:
      "Table 310.16 lists 150 amperes for 1/0 AWG copper with 90°C insulation (THHN) with not more than 3 current-carrying conductors at 30°C ambient.",
    nec_article: "Table 310.16",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["ampacity", "THHN", "conductors", "1/0 AWG"],
    lookup_path: {
      index_keywords: ["Ampacity", "Conductors, ampacity", "THHN"],
      index_entry:
        "Conductors — ampacity, not more than 3 in raceway → Table 310.16",
      article_or_table: "Table 310.16",
      what_to_look_for:
        "Find '1/0 AWG' row → read '90°C copper (THHN)' column → 150A",
    },
  },

  // ─── BOX FILL ───────────────────────────────────────────────────────────────
  {
    id: "314-002",
    question:
      "How many cubic inches does each 12 AWG conductor count toward box fill calculations?",
    choices: [
      "1.5 cubic inches",
      "2.0 cubic inches",
      "2.25 cubic inches",
      "2.5 cubic inches",
    ],
    correct_answer: "2.25 cubic inches",
    explanation:
      "Table 314.16(B) assigns a volume of 2.25 cubic inches for each 12 AWG conductor used in box fill calculations.",
    nec_article: "Table 314.16(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["box fill", "12 AWG", "volume", "conductors"],
    lookup_path: {
      index_keywords: [
        "Box fill",
        "Conductor volume allowance",
        "Boxes, volume",
      ],
      index_entry:
        "Boxes — conductor volume allowances → 314.16(B) → Table 314.16(B)",
      article_or_table: "Table 314.16(B)",
      what_to_look_for:
        "Find '12 AWG' row → read 'Volume Allowance' column → 2.25 in³",
    },
  },
  {
    id: "314-003",
    question:
      "A device (receptacle) mounted in a box counts as how many conductors for box fill purposes?",
    choices: [
      "One conductor of the largest gauge connected to it",
      "Two conductors of the largest gauge connected to it",
      "One conductor of the smallest gauge",
      "Zero — devices are not counted",
    ],
    correct_answer: "Two conductors of the largest gauge connected to it",
    explanation:
      "NEC 314.16(B)(4) states that each yoke or strap containing one or more devices counts as two conductors based on the largest conductor connected to that device.",
    nec_article: "314.16(B)(4)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["box fill", "device", "receptacle", "yoke"],
    lookup_path: {
      index_keywords: [
        "Box fill, devices",
        "Receptacle, box fill",
        "Device fill",
      ],
      index_entry: "Boxes — conductor fill, device or equipment → 314.16(B)(4)",
      article_or_table: "314.16(B)(4)",
      what_to_look_for:
        "Read (B)(4) — each yoke/strap = two conductors based on largest wire attached",
    },
  },

  // ─── GROUNDING ──────────────────────────────────────────────────────────────
  {
    id: "250-002",
    question:
      "What is the minimum size copper equipment grounding conductor required for a circuit protected by a 60-ampere overcurrent device?",
    choices: ["10 AWG", "8 AWG", "6 AWG", "4 AWG"],
    correct_answer: "10 AWG",
    explanation:
      "Table 250.122 requires a minimum 10 AWG copper equipment grounding conductor for circuits protected by overcurrent devices rated up to 60 amperes.",
    nec_article: "Table 250.122",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["grounding", "equipment grounding conductor", "EGC", "60 amp"],
    lookup_path: {
      index_keywords: [
        "Equipment grounding conductors, size",
        "Grounding conductors, equipment",
      ],
      index_entry: "Equipment grounding conductors — size → Table 250.122",
      article_or_table: "Table 250.122",
      what_to_look_for:
        "Find '60A' row in the 'Rating of Automatic Overcurrent Device' column → copper EGC = 10 AWG",
    },
  },
  {
    id: "250-003",
    question:
      "Which of the following is NOT a listed grounding electrode under NEC Article 250?",
    choices: [
      "Metal water pipe",
      "Concrete-encased electrode",
      "PVC conduit buried 30 inches",
      "Ground ring",
    ],
    correct_answer: "PVC conduit buried 30 inches",
    explanation:
      "NEC 250.52(A) lists acceptable grounding electrodes. PVC (non-metallic) conduit is not a conductor and cannot serve as a grounding electrode regardless of burial depth.",
    nec_article: "250.52(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["grounding", "electrode", "grounding electrode system"],
    lookup_path: {
      index_keywords: ["Grounding electrodes, types", "Electrodes, grounding"],
      index_entry: "Grounding electrodes — types permitted → 250.52(A)",
      article_or_table: "250.52(A)",
      what_to_look_for:
        "Read the list in (A)(1) through (A)(8) — PVC conduit is not listed; only metal/concrete/earth-contact electrodes qualify",
    },
  },
  {
    id: "250-004",
    question:
      "What is the maximum resistance permitted for a single ground rod electrode before a second electrode must be added?",
    choices: ["10 ohms", "25 ohms", "50 ohms", "100 ohms"],
    correct_answer: "25 ohms",
    explanation:
      "NEC 250.53(A)(2) requires a second ground rod if the resistance of a single rod exceeds 25 ohms, unless the single rod is supplemented by another electrode.",
    nec_article: "250.53(A)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["grounding", "ground rod", "resistance", "electrode"],
    lookup_path: {
      index_keywords: [
        "Ground rods, resistance",
        "Grounding electrode, resistance",
      ],
      index_entry:
        "Ground rods — resistance, supplemental electrode → 250.53(A)(2)",
      article_or_table: "250.53(A)(2)",
      what_to_look_for:
        "Read (A)(2) — if single rod resistance exceeds 25 ohms, a second electrode is required",
    },
  },

  // ─── MOTORS ─────────────────────────────────────────────────────────────────
  {
    id: "430-002",
    question:
      "What is the full-load current for a 10 HP, 230-volt, single-phase AC motor?",
    choices: ["40 amps", "50 amps", "56 amps", "64 amps"],
    correct_answer: "50 amps",
    explanation:
      "Table 430.248 lists the full-load current for a 10 HP, 230V single-phase motor as 50 amperes.",
    nec_article: "Table 430.248",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["motors", "full-load current", "single-phase", "10 HP"],
    lookup_path: {
      index_keywords: ["Motors, full-load current", "Single-phase motors, FLC"],
      index_entry:
        "Motors — full-load currents, single-phase AC → Table 430.248",
      article_or_table: "Table 430.248",
      what_to_look_for: "Find '10 HP' row → read '230V' column → FLC = 50A",
    },
  },
  {
    id: "430-003",
    question:
      "What is the minimum conductor ampacity required for a single motor branch circuit?",
    choices: [
      "100% of motor FLC",
      "115% of motor FLC",
      "125% of motor FLC",
      "150% of motor FLC",
    ],
    correct_answer: "125% of motor FLC",
    explanation:
      "NEC 430.22(A) requires motor branch-circuit conductors to have an ampacity of not less than 125% of the motor's full-load current rating.",
    nec_article: "430.22(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["motors", "conductors", "branch circuit", "ampacity"],
    lookup_path: {
      index_keywords: [
        "Motors, branch-circuit conductors",
        "Motor conductors, size",
      ],
      index_entry: "Motors — branch-circuit conductors, single motor → 430.22",
      article_or_table: "430.22(A)",
      what_to_look_for:
        "Read (A) — 'not less than 125 percent of the motor full-load current rating'",
    },
  },
  {
    id: "430-004",
    question:
      "What is the maximum setting for an inverse time circuit breaker protecting a 3-phase, 460V, 25 HP squirrel-cage induction motor?",
    choices: ["150%", "175%", "200%", "250%"],
    correct_answer: "250%",
    explanation:
      "Table 430.52(C)(1) allows inverse time circuit breakers to be set at a maximum of 250% of motor FLC for squirrel-cage induction motors.",
    nec_article: "Table 430.52(C)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["motors", "circuit breaker", "overcurrent", "3-phase"],
    lookup_path: {
      index_keywords: [
        "Motors, overcurrent protection",
        "Circuit breakers, motor protection",
      ],
      index_entry:
        "Motors — branch-circuit short-circuit protection → 430.52 → Table 430.52(C)(1)",
      article_or_table: "Table 430.52(C)(1)",
      what_to_look_for:
        "Find 'Inverse time circuit breaker' row → read '% of Full-Load Current' column → 250%",
    },
  },

  // ─── DWELLING UNITS ─────────────────────────────────────────────────────────
  {
    id: "210-002",
    question:
      "What is the minimum required height for a wall receptacle outlet in a dwelling unit?",
    choices: [
      "No minimum height specified",
      "12 inches from floor",
      "18 inches from floor",
      "24 inches from floor",
    ],
    correct_answer: "No minimum height specified",
    explanation:
      "The NEC does not specify a minimum height for receptacle outlets in dwelling units. NEC 210.52 specifies spacing requirements but not mounting height.",
    nec_article: "210.52",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["dwelling", "receptacles", "height", "210.52"],
    lookup_path: {
      index_keywords: [
        "Receptacles, dwelling units",
        "Dwelling units, receptacle outlets",
      ],
      index_entry: "Receptacles — dwelling units, required → 210.52",
      article_or_table: "210.52",
      what_to_look_for:
        "Read 210.52 — spacing requirements are specified but no minimum floor height is stated",
    },
  },
  {
    id: "210-003",
    question:
      "In a dwelling unit, what is the maximum spacing between receptacle outlets along a wall in a general living area?",
    choices: ["6 feet", "10 feet", "12 feet", "15 feet"],
    correct_answer: "12 feet",
    explanation:
      "NEC 210.52(A)(1) requires that no point along the floor line in any wall space be more than 6 feet from a receptacle outlet, which means outlets must be spaced no more than 12 feet apart.",
    nec_article: "210.52(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["dwelling", "receptacles", "spacing", "living area"],
    lookup_path: {
      index_keywords: [
        "Receptacles, spacing",
        "Dwelling units, receptacle spacing",
      ],
      index_entry: "Receptacles — dwelling units, spacing → 210.52(A)(1)",
      article_or_table: "210.52(A)(1)",
      what_to_look_for:
        "Read (A)(1) — 'no point along the floor line shall be more than 6 ft from a receptacle' = max 12 ft between outlets",
    },
  },
  {
    id: "210-004",
    question:
      "How many 20-ampere circuits are required for the laundry area of a dwelling unit?",
    choices: ["None required", "One", "Two", "Three"],
    correct_answer: "One",
    explanation:
      "NEC 210.11(C)(2) requires at least one 20-ampere branch circuit for the laundry receptacle outlet(s) in a dwelling unit.",
    nec_article: "210.11(C)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["dwelling", "laundry", "branch circuit", "20 amp"],
    lookup_path: {
      index_keywords: ["Laundry branch circuit", "Dwelling units, laundry"],
      index_entry: "Laundry — branch circuit, dwelling units → 210.11(C)(2)",
      article_or_table: "210.11(C)(2)",
      what_to_look_for:
        "Read (C)(2) — 'at least one additional 20-ampere branch circuit shall be provided for laundry receptacle outlets'",
    },
  },
  {
    id: "210-005",
    question:
      "GFCI protection is required for receptacles installed within how many feet of the outside edge of a dwelling unit bathroom sink?",
    choices: [
      "3 feet",
      "6 feet",
      "All bathroom receptacles regardless of distance",
      "Only those within 12 inches",
    ],
    correct_answer: "All bathroom receptacles regardless of distance",
    explanation:
      "NEC 210.8(A)(1) requires GFCI protection for all receptacles installed in bathrooms of dwelling units, regardless of distance from the sink.",
    nec_article: "210.8(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["GFCI", "bathroom", "dwelling", "receptacles"],
    lookup_path: {
      index_keywords: [
        "GFCI protection, bathrooms",
        "Ground-fault circuit-interrupter, bathrooms",
      ],
      index_entry:
        "Ground-fault circuit-interrupter protection — dwelling units, bathrooms → 210.8(A)(1)",
      article_or_table: "210.8(A)(1)",
      what_to_look_for:
        "Read (A)(1) — 'all 125-volt through 250-volt receptacles installed in bathrooms' — no distance limitation",
    },
  },

  // ─── SERVICE ENTRANCE ────────────────────────────────────────────────────────
  {
    id: "230-002",
    question:
      "What is the minimum clearance above a residential driveway for overhead service-drop conductors not exceeding 600 volts?",
    choices: ["10 feet", "12 feet", "15 feet", "18 feet"],
    correct_answer: "12 feet",
    explanation:
      "NEC 230.24(B)(1) requires a minimum clearance of 12 feet above residential driveways for service-drop conductors rated 600 volts or less.",
    nec_article: "230.24(B)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["service entrance", "service drop", "clearance", "driveway"],
    lookup_path: {
      index_keywords: [
        "Service drop, clearances",
        "Overhead conductors, clearances",
        "Driveway clearance",
      ],
      index_entry:
        "Service-drop conductors — clearances, above ground → 230.24(B)",
      article_or_table: "230.24(B)(1)",
      what_to_look_for:
        "Find (B)(1) — residential driveways → 12 ft minimum clearance",
    },
  },
  {
    id: "230-003",
    question:
      "What is the minimum size copper service-entrance conductor permitted for a 200-ampere residential service?",
    choices: ["2/0 AWG", "3/0 AWG", "4/0 AWG", "250 kcmil"],
    correct_answer: "2/0 AWG",
    explanation:
      "Table 310.16 shows that 2/0 AWG copper THWN-2 has an ampacity of 195A at 75°C. However, for a 200A service, 2/0 AWG copper is the minimum per 230.42 when using 90°C rated conductors at 75°C terminal rating.",
    nec_article: "230.42",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["service entrance", "conductor size", "200 amp", "residential"],
    lookup_path: {
      index_keywords: [
        "Service-entrance conductors, size",
        "Service conductors, minimum size",
      ],
      index_entry:
        "Service-entrance conductors — minimum size → 230.42 → Table 310.16",
      article_or_table: "Table 310.16",
      what_to_look_for:
        "Find '2/0 AWG' row → read '75°C copper' column → 175A; check 90°C column → 195A — use 75°C terminal rating per 110.14(C)",
    },
  },

  // ─── TRANSFORMERS ────────────────────────────────────────────────────────────
  {
    id: "450-002",
    question:
      "What is the maximum overcurrent protection for the primary of a transformer with a primary current of less than 2 amperes?",
    choices: ["125%", "167%", "300%", "No protection required"],
    correct_answer: "300%",
    explanation:
      "NEC 450.3(B) allows primary overcurrent protection up to 300% of rated primary current when the primary current is less than 2 amperes.",
    nec_article: "Table 450.3(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["transformers", "overcurrent", "primary protection", "low current"],
    lookup_path: {
      index_keywords: [
        "Transformers, overcurrent protection",
        "Overcurrent protection, transformers",
      ],
      index_entry:
        "Transformers — overcurrent protection, 600V or less → 450.3(B) → Table 450.3(B)",
      article_or_table: "Table 450.3(B)",
      what_to_look_for:
        "Find row for 'Primary < 2A, no secondary protection' → maximum = 300%",
    },
  },
  {
    id: "450-003",
    question:
      "What is the minimum working clearance required in front of a transformer rated over 600 volts?",
    choices: ["3 feet", "4 feet", "6 feet", "Depends on voltage class"],
    correct_answer: "Depends on voltage class",
    explanation:
      "NEC 110.34(A) specifies working clearances for equipment over 600V based on voltage class and condition of installation — ranging from 3 feet to 10 feet depending on voltage and exposure.",
    nec_article: "110.34(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["transformers", "working clearance", "high voltage", "110.34"],
    lookup_path: {
      index_keywords: [
        "Working clearances, over 600V",
        "Clearances, electrical equipment",
      ],
      index_entry:
        "Working clearances — over 600 volts → 110.34(A) → Table 110.34(A)",
      article_or_table: "Table 110.34(A)",
      what_to_look_for:
        "Find voltage range row and installation condition column → read minimum clearance distance",
    },
  },

  // ─── HAZARDOUS LOCATIONS ─────────────────────────────────────────────────────
  {
    id: "500-002",
    question:
      "A Class I, Division 2 location is one where ignitable concentrations of flammable gases:",
    choices: [
      "Exist continuously under normal operating conditions",
      "Are handled, processed, or used but are normally in closed containers",
      "Are present only during abnormal conditions such as container failure",
      "Do not exist",
    ],
    correct_answer:
      "Are present only during abnormal conditions such as container failure",
    explanation:
      "NEC 500.5(B)(2) defines Class I, Division 2 as a location where ignitable concentrations of flammable gases are handled but are normally confined, and could become hazardous only through accidental rupture or breakdown.",
    nec_article: "500.5(B)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["hazardous locations", "Class I", "Division 2", "flammable gases"],
    lookup_path: {
      index_keywords: [
        "Class I locations, Division 2",
        "Hazardous locations, Division 2",
      ],
      index_entry:
        "Hazardous (classified) locations — Class I, Division 2 → 500.5(B)(2)",
      article_or_table: "500.5(B)(2)",
      what_to_look_for:
        "Read (B)(2) — abnormal conditions only; normally confined in closed containers or systems",
    },
  },
  {
    id: "500-003",
    question: "Class II locations involve which type of hazardous material?",
    choices: [
      "Flammable gases or vapors",
      "Combustible dust",
      "Ignitable fibers",
      "Flammable liquids",
    ],
    correct_answer: "Combustible dust",
    explanation:
      "NEC 500.5(C) defines Class II locations as those that are hazardous because of the presence of combustible dust.",
    nec_article: "500.5(C)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["hazardous locations", "Class II", "combustible dust"],
    lookup_path: {
      index_keywords: [
        "Class II locations",
        "Combustible dust, hazardous locations",
      ],
      index_entry: "Hazardous (classified) locations — Class II → 500.5(C)",
      article_or_table: "500.5(C)",
      what_to_look_for:
        "Read (C) — 'Class II locations are those that are hazardous because of the presence of combustible dust'",
    },
  },

  // ─── GFCI / AFCI ─────────────────────────────────────────────────────────────
  {
    id: "210-006",
    question:
      "AFCI protection is required for branch circuits supplying outlets in which rooms of a dwelling unit?",
    choices: [
      "Kitchen and bathrooms only",
      "All 120-volt, 15- and 20-ampere branch circuits in all rooms",
      "Bedrooms only",
      "Garage and outdoors only",
    ],
    correct_answer:
      "All 120-volt, 15- and 20-ampere branch circuits in all rooms",
    explanation:
      "NEC 210.12(A) requires AFCI protection for all 120-volt, 15- and 20-ampere branch circuits supplying outlets or devices installed in dwelling units.",
    nec_article: "210.12(A)",
    nec_versions: ["2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["AFCI", "arc-fault", "dwelling", "branch circuits"],
    lookup_path: {
      index_keywords: [
        "Arc-fault circuit-interrupter protection",
        "AFCI, dwelling units",
      ],
      index_entry:
        "Arc-fault circuit-interrupter protection — dwelling units → 210.12(A)",
      article_or_table: "210.12(A)",
      what_to_look_for:
        "Read (A) — 'all 120-volt, single-phase, 15- and 20-ampere branch circuits supplying outlets or devices'",
    },
  },
  {
    id: "210-007",
    question:
      "GFCI protection is required for 125-volt receptacles installed outdoors at a dwelling unit at grade level and accessible to the public?",
    choices: [
      "Only if within 20 feet of a water source",
      "Yes, all such receptacles",
      "Only in wet locations",
      "No, only indoor receptacles require GFCI",
    ],
    correct_answer: "Yes, all such receptacles",
    explanation:
      "NEC 210.8(A)(3) requires GFCI protection for all 125-volt through 250-volt receptacles installed outdoors at dwelling units where the receptacles are accessible to persons from grade level.",
    nec_article: "210.8(A)(3)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["GFCI", "outdoor", "dwelling", "receptacles"],
    lookup_path: {
      index_keywords: [
        "GFCI protection, outdoors",
        "Outdoor receptacles, GFCI",
      ],
      index_entry:
        "Ground-fault circuit-interrupter protection — dwelling units, outdoors → 210.8(A)(3)",
      article_or_table: "210.8(A)(3)",
      what_to_look_for:
        "Read (A)(3) — 'outdoors' with 'access from grade level' = GFCI required for all such receptacles",
    },
  },
  {
    id: "210-008",
    question:
      "GFCI protection is required for receptacles installed in a commercial kitchen within how many feet of a sink?",
    choices: [
      "3 feet",
      "6 feet",
      "10 feet",
      "All kitchen receptacles regardless of distance",
    ],
    correct_answer: "6 feet",
    explanation:
      "NEC 210.8(B)(2) requires GFCI protection for receptacles installed within 6 feet of the outside edge of a sink in commercial kitchens and similar areas.",
    nec_article: "210.8(B)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["GFCI", "commercial kitchen", "sink", "receptacles"],
    lookup_path: {
      index_keywords: [
        "GFCI protection, commercial",
        "Kitchen receptacles, GFCI",
      ],
      index_entry:
        "Ground-fault circuit-interrupter protection — other than dwelling units → 210.8(B)(2)",
      article_or_table: "210.8(B)(2)",
      what_to_look_for:
        "Read (B)(2) — 'within 6 feet of the outside edge of a sink'",
    },
  },

  // ─── OVERCURRENT PROTECTION ──────────────────────────────────────────────────
  {
    id: "240-002",
    question:
      "What is the maximum overcurrent protection permitted for a 10 AWG copper conductor with 60°C insulation?",
    choices: ["20 amperes", "30 amperes", "40 amperes", "50 amperes"],
    correct_answer: "30 amperes",
    explanation:
      "Table 310.16 lists 30 amperes as the ampacity of 10 AWG copper at 60°C. Per 240.4(D), 10 AWG copper conductors shall not be protected by overcurrent devices rated more than 30 amperes.",
    nec_article: "240.4(D)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["overcurrent protection", "10 AWG", "conductor protection", "240.4"],
    lookup_path: {
      index_keywords: [
        "Overcurrent protection, small conductors",
        "Conductors, overcurrent protection",
      ],
      index_entry: "Overcurrent protection — small conductors → 240.4(D)",
      article_or_table: "240.4(D)",
      what_to_look_for:
        "Read (D) — 10 AWG copper = 30A maximum overcurrent device",
    },
  },
  {
    id: "240-003",
    question:
      "Where a fuse or circuit breaker rating does not correspond to a standard size, the next higher standard rating is permitted provided the overcurrent device does not exceed:",
    choices: ["100 amperes", "200 amperes", "400 amperes", "800 amperes"],
    correct_answer: "800 amperes",
    explanation:
      "NEC 240.4(B) permits the next higher standard overcurrent device rating above the conductor ampacity, provided the device rating does not exceed 800 amperes.",
    nec_article: "240.4(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["overcurrent protection", "next higher rating", "240.4(B)"],
    lookup_path: {
      index_keywords: [
        "Overcurrent protection, next higher rating",
        "Circuit breakers, next higher size",
      ],
      index_entry:
        "Overcurrent protection — next higher standard device rating → 240.4(B)",
      article_or_table: "240.4(B)",
      what_to_look_for:
        "Read (B) — next higher standard rating permitted only if device does not exceed 800A",
    },
  },

  // ─── CONDUIT FILL ────────────────────────────────────────────────────────────
  {
    id: "358-001",
    question:
      "What is the maximum percent fill for a conduit containing 3 or more conductors?",
    choices: ["31%", "40%", "53%", "60%"],
    correct_answer: "40%",
    explanation:
      "Chapter 9, Table 1 limits conduit fill to 40% of the cross-sectional area of the conduit when 3 or more conductors are installed.",
    nec_article: "Chapter 9, Table 1",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["conduit fill", "raceway", "conductors", "Chapter 9"],
    lookup_path: {
      index_keywords: [
        "Conduit fill",
        "Raceway fill",
        "Conductors, conduit fill",
      ],
      index_entry: "Conduit fill — percent fill allowed → Chapter 9, Table 1",
      article_or_table: "Chapter 9, Table 1",
      what_to_look_for:
        "Find '3 or more conductors' row → read '% of Cross-Sectional Area' column → 40%",
    },
  },
  {
    id: "358-002",
    question:
      "What is the maximum percent fill for a conduit containing only 1 conductor?",
    choices: ["31%", "40%", "53%", "60%"],
    correct_answer: "53%",
    explanation:
      "Chapter 9, Table 1 allows a single conductor to fill up to 53% of the conduit cross-sectional area.",
    nec_article: "Chapter 9, Table 1",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["conduit fill", "single conductor", "raceway"],
    lookup_path: {
      index_keywords: ["Conduit fill, single conductor", "Raceway fill"],
      index_entry: "Conduit fill — 1 conductor → Chapter 9, Table 1",
      article_or_table: "Chapter 9, Table 1",
      what_to_look_for:
        "Find '1 conductor' row → read '% of Cross-Sectional Area' column → 53%",
    },
  },
  {
    id: "358-003",
    question:
      "What is the trade size of the smallest EMT conduit permitted to contain three 12 AWG THHN conductors?",
    choices: ["1/2 inch", "3/4 inch", "1 inch", "1-1/4 inch"],
    correct_answer: "1/2 inch",
    explanation:
      "Annex C, Table C.1 shows that 1/2 inch EMT can contain up to 9 conductors of 12 AWG THHN, so three conductors fit within the 40% fill limit.",
    nec_article: "Annex C, Table C.1",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["conduit fill", "EMT", "12 AWG", "THHN"],
    lookup_path: {
      index_keywords: ["EMT conduit fill", "Conduit fill, THHN", "Annex C"],
      index_entry: "Conduit fill — EMT, THHN conductors → Annex C, Table C.1",
      article_or_table: "Annex C, Table C.1",
      what_to_look_for:
        "Find '12 AWG THHN' row → read '1/2 inch EMT' column → max conductors = 9; three conductors fit",
    },
  },

  // ─── WORKING CLEARANCES ──────────────────────────────────────────────────────
  {
    id: "110-001",
    question:
      "What is the minimum working clearance in front of a 120/240-volt panelboard installed in a dwelling unit (Condition 1)?",
    choices: ["2 feet", "2.5 feet", "3 feet", "3.5 feet"],
    correct_answer: "3 feet",
    explanation:
      "Table 110.26(A)(1) requires a minimum working clearance of 3 feet in front of electrical equipment rated 0–150 volts to ground under Condition 1 (exposed live parts on one side, no live or grounded parts on the other).",
    nec_article: "Table 110.26(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["working clearances", "panelboard", "110.26", "dwelling"],
    lookup_path: {
      index_keywords: [
        "Working clearances, electrical equipment",
        "Clearances, panelboard",
      ],
      index_entry:
        "Working clearances — electrical equipment → 110.26(A)(1) → Table 110.26(A)(1)",
      article_or_table: "Table 110.26(A)(1)",
      what_to_look_for:
        "Find '0–150V to ground' row → 'Condition 1' column → 3 ft minimum",
    },
  },
  {
    id: "110-002",
    question:
      "What is the minimum headroom required for working spaces about electrical equipment rated 600 volts or less?",
    choices: ["5.5 feet", "6 feet", "6.5 feet", "7 feet"],
    correct_answer: "6.5 feet",
    explanation:
      "NEC 110.26(A)(3) requires a minimum headroom of 6.5 feet (2.0 m) for working spaces about electrical equipment rated 600 volts or less.",
    nec_article: "110.26(A)(3)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["working clearances", "headroom", "110.26"],
    lookup_path: {
      index_keywords: [
        "Headroom, electrical equipment",
        "Working clearances, headroom",
      ],
      index_entry: "Working clearances — headroom → 110.26(A)(3)",
      article_or_table: "110.26(A)(3)",
      what_to_look_for: "Read (A)(3) — 'minimum headroom of 6½ ft (2.0 m)'",
    },
  },
  {
    id: "110-003",
    question:
      "What is the minimum width of the working space in front of electrical equipment rated 600 volts or less?",
    choices: [
      "24 inches",
      "30 inches",
      "36 inches",
      "The width of the equipment or 30 inches, whichever is greater",
    ],
    correct_answer:
      "The width of the equipment or 30 inches, whichever is greater",
    explanation:
      "NEC 110.26(A)(2) requires the working space width to be the width of the equipment or 30 inches, whichever is greater.",
    nec_article: "110.26(A)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["working clearances", "width", "110.26"],
    lookup_path: {
      index_keywords: [
        "Working clearances, width",
        "Electrical equipment, working space",
      ],
      index_entry: "Working clearances — width of working space → 110.26(A)(2)",
      article_or_table: "110.26(A)(2)",
      what_to_look_for:
        "Read (A)(2) — 'the width of the equipment or 30 in., whichever is greater'",
    },
  },

  // ─── LOAD CALCULATIONS ───────────────────────────────────────────────────────
  {
    id: "220-001",
    question:
      "What is the general lighting load in volt-amperes per square foot for a dwelling unit?",
    choices: ["1 VA/sq ft", "2 VA/sq ft", "3 VA/sq ft", "3.5 VA/sq ft"],
    correct_answer: "3 VA/sq ft",
    explanation:
      "Table 220.12 specifies a general lighting load of 3 volt-amperes per square foot for dwelling units.",
    nec_article: "Table 220.12",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["load calculations", "dwelling", "general lighting", "VA per sq ft"],
    lookup_path: {
      index_keywords: [
        "General lighting loads",
        "Load calculations, dwelling",
        "Volt-amperes per square foot",
      ],
      index_entry: "General lighting loads — by occupancy → Table 220.12",
      article_or_table: "Table 220.12",
      what_to_look_for:
        "Find 'Dwelling units' row → read 'Unit Load (VA/ft²)' column → 3 VA/ft²",
    },
  },
  {
    id: "220-002",
    question:
      "What demand factor applies to the first 3,000 VA of lighting load in a dwelling unit load calculation?",
    choices: ["50%", "75%", "100%", "35%"],
    correct_answer: "100%",
    explanation:
      "Table 220.42 applies a 100% demand factor to the first 3,000 VA of lighting load in a dwelling unit.",
    nec_article: "Table 220.42",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["load calculations", "demand factor", "lighting", "dwelling"],
    lookup_path: {
      index_keywords: [
        "Demand factors, lighting",
        "Lighting load, demand factors",
      ],
      index_entry:
        "Lighting load — demand factors, dwelling units → Table 220.42",
      article_or_table: "Table 220.42",
      what_to_look_for:
        "Find 'First 3,000 VA' row → read 'Demand Factor' column → 100%",
    },
  },
  {
    id: "220-003",
    question:
      "What is the standard volt-ampere load assigned to each small-appliance and laundry branch circuit in a dwelling unit load calculation?",
    choices: ["1,000 VA", "1,500 VA", "2,000 VA", "3,000 VA"],
    correct_answer: "1,500 VA",
    explanation:
      "NEC 220.52(A) and (B) assign 1,500 VA for each 20-ampere small-appliance branch circuit and each laundry branch circuit in a dwelling unit load calculation.",
    nec_article: "220.52(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["load calculations", "small appliance", "laundry", "1500 VA"],
    lookup_path: {
      index_keywords: [
        "Small-appliance load",
        "Load calculations, small appliance",
      ],
      index_entry:
        "Small-appliance branch circuits — load calculation → 220.52(A)",
      article_or_table: "220.52(A)",
      what_to_look_for:
        "Read (A) — 'a load of not less than 1500 volt-amperes for each 2-wire small-appliance branch circuit'",
    },
  },
  {
    id: "220-004",
    question:
      "When calculating the demand load for electric ranges rated over 12 kW in a dwelling unit, which NEC table is used?",
    choices: ["Table 220.42", "Table 220.55", "Table 220.56", "Table 220.12"],
    correct_answer: "Table 220.55",
    explanation:
      "Table 220.55 provides demand factors and maximum demand for household electric ranges, wall-mounted ovens, and counter-mounted cooking units rated over 1¾ kW.",
    nec_article: "Table 220.55",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: [
      "load calculations",
      "electric range",
      "demand factor",
      "cooking equipment",
    ],
    lookup_path: {
      index_keywords: [
        "Electric ranges, demand factors",
        "Cooking equipment, load calculation",
      ],
      index_entry: "Ranges — household, demand loads → 220.55 → Table 220.55",
      article_or_table: "Table 220.55",
      what_to_look_for:
        "Find number of appliances column → read demand load or apply Column C for ranges over 12 kW",
    },
  },

  // ─── PANELBOARDS ─────────────────────────────────────────────────────────────
  {
    id: "408-001",
    question:
      "What is the maximum number of overcurrent devices permitted in a lighting and appliance branch-circuit panelboard?",
    choices: ["24", "30", "42", "No limit"],
    correct_answer: "42",
    explanation:
      "NEC 408.54 limits the number of overcurrent devices in a lighting and appliance branch-circuit panelboard to 42.",
    nec_article: "408.54",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["panelboards", "overcurrent devices", "408.54", "42 circuit"],
    lookup_path: {
      index_keywords: [
        "Panelboards, overcurrent devices",
        "Circuit breakers, panelboard limit",
      ],
      index_entry: "Panelboards — overcurrent devices, maximum number → 408.54",
      article_or_table: "408.54",
      what_to_look_for:
        "Read 408.54 — 'not more than 42 overcurrent devices' in a lighting and appliance branch-circuit panelboard",
    },
  },
  {
    id: "408-002",
    question:
      "Panelboards must be mounted in cabinets, cutout boxes, or enclosures designed for the purpose and must be dead-front. What additional requirement applies to panelboard enclosures?",
    choices: [
      "They must be painted gray",
      "They must be grounded",
      "They must be mounted at eye level",
      "They must be UL listed only",
    ],
    correct_answer: "They must be grounded",
    explanation:
      "NEC 408.40 requires that panelboard enclosures be grounded in accordance with Article 250 and the grounding terminal bar must be bonded to the enclosure.",
    nec_article: "408.40",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["panelboards", "grounding", "enclosure", "408.40"],
    lookup_path: {
      index_keywords: [
        "Panelboards, grounding",
        "Panelboard enclosures, grounding",
      ],
      index_entry: "Panelboards — grounding → 408.40",
      article_or_table: "408.40",
      what_to_look_for:
        "Read 408.40 — enclosure must be grounded per Article 250; grounding terminal bonded to enclosure",
    },
  },
  {
    id: "408-003",
    question:
      "What is required on every circuit breaker or fuse in a panelboard?",
    choices: [
      "A red handle",
      "A legible directory",
      "A ground fault indicator",
      "A surge protector",
    ],
    correct_answer: "A legible directory",
    explanation:
      "NEC 408.4(A) requires that every circuit breaker and fuse be legibly identified as to its purpose or use, and a circuit directory must be provided on the face or inside the door of the panelboard.",
    nec_article: "408.4(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["panelboards", "circuit directory", "labeling", "408.4"],
    lookup_path: {
      index_keywords: [
        "Panelboards, circuit directory",
        "Circuit identification, panelboard",
      ],
      index_entry: "Panelboards — circuit identification → 408.4(A)",
      article_or_table: "408.4(A)",
      what_to_look_for:
        "Read (A) — 'legibly identified as to its purpose or use' and directory on face or inside door",
    },
  },

  // ─── GENERATORS ──────────────────────────────────────────────────────────────
  {
    id: "445-001",
    question: "Generators must be protected against overloads by what means?",
    choices: [
      "An external fuse only",
      "Inherent design, circuit breakers, fuses, or other acceptable overcurrent protective means",
      "A manual disconnect only",
      "No protection required for generators under 5 kW",
    ],
    correct_answer:
      "Inherent design, circuit breakers, fuses, or other acceptable overcurrent protective means",
    explanation:
      "NEC 445.12(A) requires generators to be protected against overloads by inherent design, circuit breakers, fuses, or other acceptable overcurrent protective means.",
    nec_article: "445.12(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["generators", "overcurrent protection", "445.12"],
    lookup_path: {
      index_keywords: [
        "Generators, overcurrent protection",
        "Generator protection",
      ],
      index_entry: "Generators — overcurrent protection → 445.12",
      article_or_table: "445.12(A)",
      what_to_look_for:
        "Read (A) — inherent design, circuit breakers, fuses, or other acceptable means",
    },
  },
  {
    id: "445-002",
    question:
      "What is the minimum conductor ampacity required for a generator with a nameplate current rating?",
    choices: [
      "100% of nameplate current",
      "115% of nameplate current",
      "125% of nameplate current",
      "150% of nameplate current",
    ],
    correct_answer: "115% of nameplate current",
    explanation:
      "NEC 445.13(A) requires generator output circuit conductors to have an ampacity of not less than 115% of the nameplate current rating of the generator.",
    nec_article: "445.13(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["generators", "conductor ampacity", "445.13", "nameplate"],
    lookup_path: {
      index_keywords: [
        "Generators, conductor ampacity",
        "Generator output conductors",
      ],
      index_entry: "Generators — ampacity of conductors → 445.13(A)",
      article_or_table: "445.13(A)",
      what_to_look_for:
        "Read (A) — 'not less than 115 percent of the nameplate current rating'",
    },
  },
  {
    id: "445-003",
    question:
      "A standby generator used as a separately derived system must have its neutral bonded to the generator frame and grounded per which article?",
    choices: ["Article 230", "Article 250", "Article 445", "Article 700"],
    correct_answer: "Article 250",
    explanation:
      "NEC 445.18 requires that a generator used as a separately derived system be grounded and bonded in accordance with Article 250.",
    nec_article: "445.18",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["generators", "separately derived system", "grounding", "bonding"],
    lookup_path: {
      index_keywords: [
        "Generators, separately derived system",
        "Separately derived systems, grounding",
      ],
      index_entry:
        "Generators — separately derived systems → 445.18 → Article 250",
      article_or_table: "445.18",
      what_to_look_for:
        "Read 445.18 — references Article 250 for grounding and bonding requirements",
    },
  },

  // ─── ADDITIONAL MIXED TOPICS ─────────────────────────────────────────────────
  {
    id: "300-001",
    question:
      "What is the minimum burial depth for rigid metal conduit (RMC) installed under a residential driveway?",
    choices: ["6 inches", "12 inches", "18 inches", "24 inches"],
    correct_answer: "6 inches",
    explanation:
      "Table 300.5 requires a minimum cover of 6 inches for rigid metal conduit installed under a residential driveway.",
    nec_article: "Table 300.5",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["burial depth", "RMC", "driveway", "underground"],
    lookup_path: {
      index_keywords: [
        "Underground wiring, burial depth",
        "Conduit, burial depth",
        "Cover requirements",
      ],
      index_entry:
        "Underground installations — minimum cover → 300.5 → Table 300.5",
      article_or_table: "Table 300.5",
      what_to_look_for:
        "Find 'Rigid metal conduit' column → 'Under a residential driveway' row → 6 inches",
    },
  },
  {
    id: "300-002",
    question:
      "What is the minimum burial depth for a direct-buried cable (UF cable) installed under a residential driveway?",
    choices: ["12 inches", "18 inches", "24 inches", "6 inches"],
    correct_answer: "18 inches",
    explanation:
      "Table 300.5 requires a minimum cover of 18 inches for direct-buried cables installed under residential driveways.",
    nec_article: "Table 300.5",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["burial depth", "UF cable", "direct buried", "driveway"],
    lookup_path: {
      index_keywords: ["Direct-buried cables, depth", "UF cable, burial depth"],
      index_entry: "Underground installations — minimum cover → Table 300.5",
      article_or_table: "Table 300.5",
      what_to_look_for:
        "Find 'Direct-buried cables' column → 'Under a residential driveway' row → 18 inches",
    },
  },
  {
    id: "334-001",
    question:
      "NM cable (Romex) is NOT permitted to be installed in which of the following locations?",
    choices: [
      "Inside a wood-frame wall of a dwelling unit",
      "In a commercial building of Type III construction",
      "In a building exceeding three floors above grade",
      "In an attic of a one-family dwelling",
    ],
    correct_answer: "In a building exceeding three floors above grade",
    explanation:
      "NEC 334.10(A)(1) limits the use of NM cable to one- and two-family dwellings and their attached garages and storage areas, and to multifamily dwellings not exceeding three floors above grade.",
    nec_article: "334.10(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["NM cable", "Romex", "wiring methods", "334.10"],
    lookup_path: {
      index_keywords: [
        "NM cable, permitted uses",
        "Nonmetallic-sheathed cable, uses permitted",
      ],
      index_entry: "Nonmetallic-sheathed cable — uses permitted → 334.10",
      article_or_table: "334.10(A)(1)",
      what_to_look_for:
        "Read (A)(1) — limited to structures not exceeding three floors above grade",
    },
  },
  {
    id: "410-002",
    question:
      "What is the minimum distance a recessed incandescent luminaire must be from thermal insulation unless listed for contact with insulation?",
    choices: ["1 inch", "2 inches", "3 inches", "6 inches"],
    correct_answer: "3 inches",
    explanation:
      "NEC 410.116(A)(1) requires recessed luminaires that are not identified for contact with insulation to be installed with a minimum clearance of 3 inches from thermal insulation.",
    nec_article: "410.116(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["luminaires", "recessed", "insulation clearance", "410.116"],
    lookup_path: {
      index_keywords: [
        "Recessed luminaires, insulation clearance",
        "Luminaires, thermal insulation",
      ],
      index_entry:
        "Recessed luminaires — clearance from insulation → 410.116(A)(1)",
      article_or_table: "410.116(A)(1)",
      what_to_look_for:
        "Read (A)(1) — 'not less than 3 in. from thermal insulation' unless listed for contact",
    },
  },
  {
    id: "406-001",
    question:
      "Tamper-resistant receptacles are required in which locations in a dwelling unit?",
    choices: [
      "Only in children's bedrooms",
      "All 125-volt, 15- and 20-ampere receptacles in all areas of a dwelling unit",
      "Only in kitchens and bathrooms",
      "Only in rooms accessible to children under 6",
    ],
    correct_answer:
      "All 125-volt, 15- and 20-ampere receptacles in all areas of a dwelling unit",
    explanation:
      "NEC 406.12(A) requires tamper-resistant receptacles for all 125-volt, 15- and 20-ampere receptacles in all areas of a dwelling unit.",
    nec_article: "406.12(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["tamper-resistant", "receptacles", "dwelling", "406.12"],
    lookup_path: {
      index_keywords: [
        "Tamper-resistant receptacles",
        "Receptacles, tamper-resistant",
      ],
      index_entry: "Tamper-resistant receptacles — dwelling units → 406.12(A)",
      article_or_table: "406.12(A)",
      what_to_look_for:
        "Read (A) — 'all 125-volt, 15- and 20-ampere receptacles in all areas of a dwelling unit'",
    },
  },
  {
    id: "700-001",
    question:
      "Emergency lighting systems must be capable of providing illumination for a minimum of how long upon failure of normal power?",
    choices: ["30 minutes", "60 minutes", "90 minutes", "120 minutes"],
    correct_answer: "90 minutes",
    explanation:
      "NEC 700.12 requires emergency lighting systems to provide illumination for a minimum of 90 minutes upon failure of the normal power supply.",
    nec_article: "700.12",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["emergency systems", "emergency lighting", "700.12", "90 minutes"],
    lookup_path: {
      index_keywords: [
        "Emergency lighting, duration",
        "Emergency systems, battery backup",
      ],
      index_entry: "Emergency systems — illumination duration → 700.12",
      article_or_table: "700.12",
      what_to_look_for:
        "Read 700.12 — 'capable of providing the required illumination for a minimum of 90 minutes'",
    },
  },
  {
    id: "517-001",
    question:
      "In a hospital operating room, what is the maximum voltage permitted between any two exposed conductive surfaces in a patient care vicinity?",
    choices: [
      "5 millivolts",
      "10 millivolts",
      "40 millivolts",
      "100 millivolts",
    ],
    correct_answer: "40 millivolts",
    explanation:
      "NEC 517.13(A) requires that the voltage between any two exposed conductive surfaces in a patient care vicinity not exceed 40 millivolts.",
    nec_article: "517.13(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["healthcare", "hospital", "patient care", "517.13"],
    lookup_path: {
      index_keywords: [
        "Patient care vicinity, voltage",
        "Healthcare facilities, grounding",
      ],
      index_entry:
        "Healthcare facilities — patient care vicinity, voltage → 517.13(A)",
      article_or_table: "517.13(A)",
      what_to_look_for:
        "Read (A) — 'not exceed 40 millivolts' between any two exposed conductive surfaces",
    },
  },
  {
    id: "250-005",
    question:
      "What is the minimum size copper bonding jumper required to bond a metal water piping system in a building with a 200-ampere service?",
    choices: ["6 AWG", "4 AWG", "2 AWG", "1/0 AWG"],
    correct_answer: "4 AWG",
    explanation:
      "Table 250.102(C)(1) requires a minimum 4 AWG copper bonding jumper for metal water piping systems when the service-entrance conductors are 3/0 AWG through 350 kcmil copper.",
    nec_article: "Table 250.102(C)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["grounding", "bonding", "water pipe", "bonding jumper"],
    lookup_path: {
      index_keywords: [
        "Bonding jumpers, metal water pipe",
        "Water piping, bonding",
      ],
      index_entry:
        "Bonding — metal water piping → 250.104(A) → Table 250.102(C)(1)",
      article_or_table: "Table 250.102(C)(1)",
      what_to_look_for:
        "Find service conductor size range matching 200A service → read bonding jumper size column → 4 AWG copper",
    },
  },
  {
    id: "358-004",
    question:
      "What is the maximum number of bends (total degrees) permitted in a single run of conduit between pull points?",
    choices: ["180 degrees", "270 degrees", "360 degrees", "No limit"],
    correct_answer: "360 degrees",
    explanation:
      "NEC 358.26 (EMT) and similar articles for other conduit types limit the total bends between pull points or boxes to 360 degrees (the equivalent of four 90-degree bends).",
    nec_article: "358.26",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["conduit", "bends", "EMT", "358.26"],
    lookup_path: {
      index_keywords: [
        "Conduit bends, maximum",
        "EMT, bends",
        "Bends, conduit",
      ],
      index_entry:
        "Electrical metallic tubing — bends, number in one run → 358.26",
      article_or_table: "358.26",
      what_to_look_for:
        "Read 358.26 — 'not more than the equivalent of four quarter bends (360 degrees total)'",
    },
  },
  {
    id: "210-009",
    question:
      "What is the maximum continuous load permitted on a 20-ampere branch circuit?",
    choices: ["16 amperes", "20 amperes", "24 amperes", "25 amperes"],
    correct_answer: "16 amperes",
    explanation:
      "NEC 210.20(A) limits the continuous load on a branch circuit to 80% of the branch circuit rating, so a 20-ampere circuit is limited to 16 amperes of continuous load.",
    nec_article: "210.20(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["branch circuit", "continuous load", "80%", "210.20"],
    lookup_path: {
      index_keywords: [
        "Continuous loads, branch circuit",
        "Branch circuits, continuous load",
      ],
      index_entry: "Branch circuits — continuous loads → 210.20(A)",
      article_or_table: "210.20(A)",
      what_to_look_for:
        "Read (A) — 'not exceed 80 percent of the branch-circuit ampere rating' for continuous loads",
    },
  },
  {
    id: "550-001",
    question:
      "What is the minimum size service-entrance conductor permitted for a mobile home with a calculated load of 16,000 VA at 120/240 volts?",
    choices: ["4 AWG", "2 AWG", "1/0 AWG", "2/0 AWG"],
    correct_answer: "2 AWG",
    explanation:
      "A 16,000 VA load at 240V = 66.7A. Per Table 310.16, 2 AWG copper at 75°C = 95A, which is adequate. NEC 550.18(A) also sets minimums for mobile home feeder conductors.",
    nec_article: "550.18(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["mobile homes", "service entrance", "load calculation", "550.18"],
    lookup_path: {
      index_keywords: [
        "Mobile homes, service conductors",
        "Mobile homes, feeder",
      ],
      index_entry:
        "Mobile homes — service equipment, feeder conductors → 550.18(A)",
      article_or_table: "550.18(A)",
      what_to_look_for:
        "Calculate load ÷ 240V = amperes → find conductor size in Table 310.16 at 75°C column",
    },
  },
];

export function getRandomQuestions(
  count: number,
  difficulty?: QuestionCard["difficulty"],
  version?: string
): QuestionCard[] {
  let pool = difficulty
    ? questionBank.filter(q => q.difficulty === difficulty)
    : [...questionBank];
  if (version && version !== "all") {
    pool = pool.filter(q =>
      q.nec_versions.includes(version as "2017" | "2020" | "2023" | "2026")
    );
  }
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Helper: search questions
export function searchQuestions(query: string): QuestionCard[] {
  const q = query.toLowerCase();
  return questionBank.filter(
    card =>
      card.question.toLowerCase().includes(q) ||
      card.nec_article.toLowerCase().includes(q) ||
      card.tags.some(t => t.toLowerCase().includes(q)) ||
      card.lookup_path.index_keywords.some(k => k.toLowerCase().includes(q)) ||
      card.explanation.toLowerCase().includes(q)
  );
}
