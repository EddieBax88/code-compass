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
  // ─── AMPACITY ───────────────────────────────────────────────────────────────
  {
    id: "310-002",
    question: "What ampacity correction factor applies to a 75°C rated conductor installed where the ambient temperature is 40°C?",
    choices: ["0.82", "0.88", "0.91", "0.94"],
    correct_answer: "0.88",
    explanation: "Table 310.15(B)(1) correction factors show that a 75°C rated conductor at 40°C ambient has a correction factor of 0.88, reducing its allowable ampacity.",
    nec_article: "Table 310.15(B)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["ampacity", "correction factor", "ambient temperature", "conductors"],
    lookup_path: {
      index_keywords: ["Ampacity correction factors", "Temperature correction, conductors"],
      index_entry: "Conductors — ampacity correction factors, ambient temperature → 310.15(B)(1)",
      article_or_table: "Table 310.15(B)(1)",
      what_to_look_for: "Find the '40°C' ambient row → read the '75°C' conductor column → correction factor is 0.88"
    }
  },
  {
    id: "310-003",
    question: "What adjustment factor applies when 7 to 9 current-carrying conductors are bundled together in a single raceway?",
    choices: ["50%", "60%", "70%", "80%"],
    correct_answer: "70%",
    explanation: "Table 310.15(C)(1) requires a 70% adjustment factor when 7 to 9 current-carrying conductors are installed in a single raceway or cable.",
    nec_article: "Table 310.15(C)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["ampacity", "adjustment factor", "bundling", "raceway"],
    lookup_path: {
      index_keywords: ["Ampacity adjustment factors", "Conductors, bundled", "Raceway fill, adjustment"],
      index_entry: "Conductors — adjustment factors, more than 3 current-carrying → 310.15(C)(1)",
      article_or_table: "Table 310.15(C)(1)",
      what_to_look_for: "Find '7–9 conductors' row → read adjustment factor column → 70%"
    }
  },
  {
    id: "310-004",
    question: "A 1/0 AWG copper THHN conductor installed in a conduit with 3 current-carrying conductors at 30°C ambient has an allowable ampacity of:",
    choices: ["125 amps", "150 amps", "170 amps", "145 amps"],
    correct_answer: "150 amps",
    explanation: "Table 310.16 lists 150 amperes for 1/0 AWG copper with 90°C insulation (THHN) with not more than 3 current-carrying conductors at 30°C ambient.",
    nec_article: "Table 310.16",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["ampacity", "THHN", "conductors", "1/0 AWG"],
    lookup_path: {
      index_keywords: ["Ampacity", "Conductors, ampacity", "THHN"],
      index_entry: "Conductors — ampacity, not more than 3 in raceway → Table 310.16",
      article_or_table: "Table 310.16",
      what_to_look_for: "Find '1/0 AWG' row → read '90°C copper (THHN)' column → 150A"
    }
  },

  // ─── BOX FILL ───────────────────────────────────────────────────────────────
  {
    id: "314-002",
    question: "How many cubic inches does each 12 AWG conductor count toward box fill calculations?",
    choices: ["1.5 cubic inches", "2.0 cubic inches", "2.25 cubic inches", "2.5 cubic inches"],
    correct_answer: "2.25 cubic inches",
    explanation: "Table 314.16(B) assigns a volume of 2.25 cubic inches for each 12 AWG conductor used in box fill calculations.",
    nec_article: "Table 314.16(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["box fill", "12 AWG", "volume", "conductors"],
    lookup_path: {
      index_keywords: ["Box fill", "Conductor volume allowance", "Boxes, volume"],
      index_entry: "Boxes — conductor volume allowances → 314.16(B) → Table 314.16(B)",
      article_or_table: "Table 314.16(B)",
      what_to_look_for: "Find '12 AWG' row → read 'Volume Allowance' column → 2.25 in³"
    }
  },
  {
    id: "314-003",
    question: "A device (receptacle) mounted in a box counts as how many conductors for box fill purposes?",
    choices: ["One conductor of the largest gauge connected to it", "Two conductors of the largest gauge connected to it", "One conductor of the smallest gauge", "Zero — devices are not counted"],
    correct_answer: "Two conductors of the largest gauge connected to it",
    explanation: "NEC 314.16(B)(4) states that each yoke or strap containing one or more devices counts as two conductors based on the largest conductor connected to that device.",
    nec_article: "314.16(B)(4)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["box fill", "device", "receptacle", "yoke"],
    lookup_path: {
      index_keywords: ["Box fill, devices", "Receptacle, box fill", "Device fill"],
      index_entry: "Boxes — conductor fill, device or equipment → 314.16(B)(4)",
      article_or_table: "314.16(B)(4)",
      what_to_look_for: "Read (B)(4) — each yoke/strap = two conductors based on largest wire attached"
    }
  },

  // ─── GROUNDING ──────────────────────────────────────────────────────────────
  {
    id: "250-002",
    question: "What is the minimum size copper equipment grounding conductor required for a circuit protected by a 60-ampere overcurrent device?",
    choices: ["10 AWG", "8 AWG", "6 AWG", "4 AWG"],
    correct_answer: "10 AWG",
    explanation: "Table 250.122 requires a minimum 10 AWG copper equipment grounding conductor for circuits protected by overcurrent devices rated up to 60 amperes.",
    nec_article: "Table 250.122",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["grounding", "equipment grounding conductor", "EGC", "60 amp"],
    lookup_path: {
      index_keywords: ["Equipment grounding conductors, size", "Grounding conductors, equipment"],
      index_entry: "Equipment grounding conductors — size → Table 250.122",
      article_or_table: "Table 250.122",
      what_to_look_for: "Find '60A' row in the 'Rating of Automatic Overcurrent Device' column → copper EGC = 10 AWG"
    }
  },
  {
    id: "250-003",
    question: "Which of the following is NOT a listed grounding electrode under NEC Article 250?",
    choices: ["Metal water pipe", "Concrete-encased electrode", "PVC conduit buried 30 inches", "Ground ring"],
    correct_answer: "PVC conduit buried 30 inches",
    explanation: "NEC 250.52(A) lists acceptable grounding electrodes. PVC (non-metallic) conduit is not a conductor and cannot serve as a grounding electrode regardless of burial depth.",
    nec_article: "250.52(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["grounding", "electrode", "grounding electrode system"],
    lookup_path: {
      index_keywords: ["Grounding electrodes, types", "Electrodes, grounding"],
      index_entry: "Grounding electrodes — types permitted → 250.52(A)",
      article_or_table: "250.52(A)",
      what_to_look_for: "Read the list in (A)(1) through (A)(8) — PVC conduit is not listed; only metal/concrete/earth-contact electrodes qualify"
    }
  },
  {
    id: "250-004",
    question: "What is the maximum resistance permitted for a single ground rod electrode before a second electrode must be added?",
    choices: ["10 ohms", "25 ohms", "50 ohms", "100 ohms"],
    correct_answer: "25 ohms",
    explanation: "NEC 250.53(A)(2) requires a second ground rod if the resistance of a single rod exceeds 25 ohms, unless the single rod is supplemented by another electrode.",
    nec_article: "250.53(A)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["grounding", "ground rod", "resistance", "electrode"],
    lookup_path: {
      index_keywords: ["Ground rods, resistance", "Grounding electrode, resistance"],
      index_entry: "Ground rods — resistance, supplemental electrode → 250.53(A)(2)",
      article_or_table: "250.53(A)(2)",
      what_to_look_for: "Read (A)(2) — if single rod resistance exceeds 25 ohms, a second electrode is required"
    }
  },

  // ─── MOTORS ─────────────────────────────────────────────────────────────────
  {
    id: "430-002",
    question: "What is the full-load current for a 10 HP, 230-volt, single-phase AC motor?",
    choices: ["40 amps", "50 amps", "56 amps", "64 amps"],
    correct_answer: "50 amps",
    explanation: "Table 430.248 lists the full-load current for a 10 HP, 230V single-phase motor as 50 amperes.",
    nec_article: "Table 430.248",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["motors", "full-load current", "single-phase", "10 HP"],
    lookup_path: {
      index_keywords: ["Motors, full-load current", "Single-phase motors, FLC"],
      index_entry: "Motors — full-load currents, single-phase AC → Table 430.248",
      article_or_table: "Table 430.248",
      what_to_look_for: "Find '10 HP' row → read '230V' column → FLC = 50A"
    }
  },
  {
    id: "430-003",
    question: "What is the minimum conductor ampacity required for a single motor branch circuit?",
    choices: ["100% of motor FLC", "115% of motor FLC", "125% of motor FLC", "150% of motor FLC"],
    correct_answer: "125% of motor FLC",
    explanation: "NEC 430.22(A) requires motor branch-circuit conductors to have an ampacity of not less than 125% of the motor's full-load current rating.",
    nec_article: "430.22(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["motors", "conductors", "branch circuit", "ampacity"],
    lookup_path: {
      index_keywords: ["Motors, branch-circuit conductors", "Motor conductors, size"],
      index_entry: "Motors — branch-circuit conductors, single motor → 430.22",
      article_or_table: "430.22(A)",
      what_to_look_for: "Read (A) — 'not less than 125 percent of the motor full-load current rating'"
    }
  },
  {
    id: "430-004",
    question: "What is the maximum setting for an inverse time circuit breaker protecting a 3-phase, 460V, 25 HP squirrel-cage induction motor?",
    choices: ["150%", "175%", "200%", "250%"],
    correct_answer: "250%",
    explanation: "Table 430.52(C)(1) allows inverse time circuit breakers to be set at a maximum of 250% of motor FLC for squirrel-cage induction motors.",
    nec_article: "Table 430.52(C)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["motors", "circuit breaker", "overcurrent", "3-phase"],
    lookup_path: {
      index_keywords: ["Motors, overcurrent protection", "Circuit breakers, motor protection"],
      index_entry: "Motors — branch-circuit short-circuit protection → 430.52 → Table 430.52(C)(1)",
      article_or_table: "Table 430.52(C)(1)",
      what_to_look_for: "Find 'Inverse time circuit breaker' row → read '% of Full-Load Current' column → 250%"
    }
  },

  // ─── DWELLING UNITS ─────────────────────────────────────────────────────────
  {
    id: "210-002",
    question: "What is the minimum required height for a wall receptacle outlet in a dwelling unit?",
    choices: ["No minimum height specified", "12 inches from floor", "18 inches from floor", "24 inches from floor"],
    correct_answer: "No minimum height specified",
    explanation: "The NEC does not specify a minimum height for receptacle outlets in dwelling units. NEC 210.52 specifies spacing requirements but not mounting height.",
    nec_article: "210.52",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["dwelling", "receptacles", "height", "210.52"],
    lookup_path: {
      index_keywords: ["Receptacles, dwelling units", "Dwelling units, receptacle outlets"],
      index_entry: "Receptacles — dwelling units, required → 210.52",
      article_or_table: "210.52",
      what_to_look_for: "Read 210.52 — spacing requirements are specified but no minimum floor height is stated"
    }
  },
  {
    id: "210-003",
    question: "In a dwelling unit, what is the maximum spacing between receptacle outlets along a wall in a general living area?",
    choices: ["6 feet", "10 feet", "12 feet", "15 feet"],
    correct_answer: "12 feet",
    explanation: "NEC 210.52(A)(1) requires that no point along the floor line in any wall space be more than 6 feet from a receptacle outlet, which means outlets must be spaced no more than 12 feet apart.",
    nec_article: "210.52(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["dwelling", "receptacles", "spacing", "living area"],
    lookup_path: {
      index_keywords: ["Receptacles, spacing", "Dwelling units, receptacle spacing"],
      index_entry: "Receptacles — dwelling units, spacing → 210.52(A)(1)",
      article_or_table: "210.52(A)(1)",
      what_to_look_for: "Read (A)(1) — 'no point along the floor line shall be more than 6 ft from a receptacle' = max 12 ft between outlets"
    }
  },
  {
    id: "210-004",
    question: "How many 20-ampere circuits are required for the laundry area of a dwelling unit?",
    choices: ["None required", "One", "Two", "Three"],
    correct_answer: "One",
    explanation: "NEC 210.11(C)(2) requires at least one 20-ampere branch circuit for the laundry receptacle outlet(s) in a dwelling unit.",
    nec_article: "210.11(C)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["dwelling", "laundry", "branch circuit", "20 amp"],
    lookup_path: {
      index_keywords: ["Laundry branch circuit", "Dwelling units, laundry"],
      index_entry: "Laundry — branch circuit, dwelling units → 210.11(C)(2)",
      article_or_table: "210.11(C)(2)",
      what_to_look_for: "Read (C)(2) — 'at least one additional 20-ampere branch circuit shall be provided for laundry receptacle outlets'"
    }
  },
  {
    id: "210-005",
    question: "GFCI protection is required for receptacles installed within how many feet of the outside edge of a dwelling unit bathroom sink?",
    choices: ["3 feet", "6 feet", "All bathroom receptacles regardless of distance", "Only those within 12 inches"],
    correct_answer: "All bathroom receptacles regardless of distance",
    explanation: "NEC 210.8(A)(1) requires GFCI protection for all receptacles installed in bathrooms of dwelling units, regardless of distance from the sink.",
    nec_article: "210.8(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["GFCI", "bathroom", "dwelling", "receptacles"],
    lookup_path: {
      index_keywords: ["GFCI protection, bathrooms", "Ground-fault circuit-interrupter, bathrooms"],
      index_entry: "Ground-fault circuit-interrupter protection — dwelling units, bathrooms → 210.8(A)(1)",
      article_or_table: "210.8(A)(1)",
      what_to_look_for: "Read (A)(1) — 'all 125-volt through 250-volt receptacles installed in bathrooms' — no distance limitation"
    }
  },

  // ─── SERVICE ENTRANCE ────────────────────────────────────────────────────────
  {
    id: "230-002",
    question: "What is the minimum clearance above a residential driveway for overhead service-drop conductors not exceeding 600 volts?",
    choices: ["10 feet", "12 feet", "15 feet", "18 feet"],
    correct_answer: "12 feet",
    explanation: "NEC 230.24(B)(1) requires a minimum clearance of 12 feet above residential driveways for service-drop conductors rated 600 volts or less.",
    nec_article: "230.24(B)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["service entrance", "service drop", "clearance", "driveway"],
    lookup_path: {
      index_keywords: ["Service drop, clearances", "Overhead conductors, clearances", "Driveway clearance"],
      index_entry: "Service-drop conductors — clearances, above ground → 230.24(B)",
      article_or_table: "230.24(B)(1)",
      what_to_look_for: "Find (B)(1) — residential driveways → 12 ft minimum clearance"
    }
  },
  {
    id: "230-003",
    question: "What is the minimum size copper service-entrance conductor permitted for a 200-ampere residential service?",
    choices: ["2/0 AWG", "3/0 AWG", "4/0 AWG", "250 kcmil"],
    correct_answer: "2/0 AWG",
    explanation: "Table 310.16 shows that 2/0 AWG copper THWN-2 has an ampacity of 195A at 75°C. However, for a 200A service, 2/0 AWG copper is the minimum per 230.42 when using 90°C rated conductors at 75°C terminal rating.",
    nec_article: "230.42",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["service entrance", "conductor size", "200 amp", "residential"],
    lookup_path: {
      index_keywords: ["Service-entrance conductors, size", "Service conductors, minimum size"],
      index_entry: "Service-entrance conductors — minimum size → 230.42 → Table 310.16",
      article_or_table: "Table 310.16",
      what_to_look_for: "Find '2/0 AWG' row → read '75°C copper' column → 175A; check 90°C column → 195A — use 75°C terminal rating per 110.14(C)"
    }
  },

  // ─── TRANSFORMERS ────────────────────────────────────────────────────────────
  {
    id: "450-002",
    question: "What is the maximum overcurrent protection for the primary of a transformer with a primary current of less than 2 amperes?",
    choices: ["125%", "167%", "300%", "No protection required"],
    correct_answer: "300%",
    explanation: "NEC 450.3(B) allows primary overcurrent protection up to 300% of rated primary current when the primary current is less than 2 amperes.",
    nec_article: "Table 450.3(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["transformers", "overcurrent", "primary protection", "low current"],
    lookup_path: {
      index_keywords: ["Transformers, overcurrent protection", "Overcurrent protection, transformers"],
      index_entry: "Transformers — overcurrent protection, 600V or less → 450.3(B) → Table 450.3(B)",
      article_or_table: "Table 450.3(B)",
      what_to_look_for: "Find row for 'Primary < 2A, no secondary protection' → maximum = 300%"
    }
  },
  {
    id: "450-003",
    question: "What is the minimum working clearance required in front of a transformer rated over 600 volts?",
    choices: ["3 feet", "4 feet", "6 feet", "Depends on voltage class"],
    correct_answer: "Depends on voltage class",
    explanation: "NEC 110.34(A) specifies working clearances for equipment over 600V based on voltage class and condition of installation — ranging from 3 feet to 10 feet depending on voltage and exposure.",
    nec_article: "110.34(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["transformers", "working clearance", "high voltage", "110.34"],
    lookup_path: {
      index_keywords: ["Working clearances, over 600V", "Clearances, electrical equipment"],
      index_entry: "Working clearances — over 600 volts → 110.34(A) → Table 110.34(A)",
      article_or_table: "Table 110.34(A)",
      what_to_look_for: "Find voltage range row and installation condition column → read minimum clearance distance"
    }
  },

  // ─── HAZARDOUS LOCATIONS ─────────────────────────────────────────────────────
  {
    id: "500-002",
    question: "A Class I, Division 2 location is one where ignitable concentrations of flammable gases:",
    choices: [
      "Exist continuously under normal operating conditions",
      "Are handled, processed, or used but are normally in closed containers",
      "Are present only during abnormal conditions such as container failure",
      "Do not exist"
    ],
    correct_answer: "Are present only during abnormal conditions such as container failure",
    explanation: "NEC 500.5(B)(2) defines Class I, Division 2 as a location where ignitable concentrations of flammable gases are handled but are normally confined, and could become hazardous only through accidental rupture or breakdown.",
    nec_article: "500.5(B)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["hazardous locations", "Class I", "Division 2", "flammable gases"],
    lookup_path: {
      index_keywords: ["Class I locations, Division 2", "Hazardous locations, Division 2"],
      index_entry: "Hazardous (classified) locations — Class I, Division 2 → 500.5(B)(2)",
      article_or_table: "500.5(B)(2)",
      what_to_look_for: "Read (B)(2) — abnormal conditions only; normally confined in closed containers or systems"
    }
  },
  {
    id: "500-003",
    question: "Class II locations involve which type of hazardous material?",
    choices: ["Flammable gases or vapors", "Combustible dust", "Ignitable fibers", "Flammable liquids"],
    correct_answer: "Combustible dust",
    explanation: "NEC 500.5(C) defines Class II locations as those that are hazardous because of the presence of combustible dust.",
    nec_article: "500.5(C)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["hazardous locations", "Class II", "combustible dust"],
    lookup_path: {
      index_keywords: ["Class II locations", "Combustible dust, hazardous locations"],
      index_entry: "Hazardous (classified) locations — Class II → 500.5(C)",
      article_or_table: "500.5(C)",
      what_to_look_for: "Read (C) — 'Class II locations are those that are hazardous because of the presence of combustible dust'"
    }
  },

  // ─── GFCI / AFCI ─────────────────────────────────────────────────────────────
  {
    id: "210-006",
    question: "AFCI protection is required for branch circuits supplying outlets in which rooms of a dwelling unit?",
    choices: [
      "Kitchen and bathrooms only",
      "All 120-volt, 15- and 20-ampere branch circuits in all rooms",
      "Bedrooms only",
      "Garage and outdoors only"
    ],
    correct_answer: "All 120-volt, 15- and 20-ampere branch circuits in all rooms",
    explanation: "NEC 210.12(A) requires AFCI protection for all 120-volt, 15- and 20-ampere branch circuits supplying outlets or devices installed in dwelling units.",
    nec_article: "210.12(A)",
    nec_versions: ["2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["AFCI", "arc-fault", "dwelling", "branch circuits"],
    lookup_path: {
      index_keywords: ["Arc-fault circuit-interrupter protection", "AFCI, dwelling units"],
      index_entry: "Arc-fault circuit-interrupter protection — dwelling units → 210.12(A)",
      article_or_table: "210.12(A)",
      what_to_look_for: "Read (A) — 'all 120-volt, single-phase, 15- and 20-ampere branch circuits supplying outlets or devices'"
    }
  },
  {
    id: "210-007",
    question: "GFCI protection is required for 125-volt receptacles installed outdoors at a dwelling unit at grade level and accessible to the public?",
    choices: ["Only if within 20 feet of a water source", "Yes, all such receptacles", "Only in wet locations", "No, only indoor receptacles require GFCI"],
    correct_answer: "Yes, all such receptacles",
    explanation: "NEC 210.8(A)(3) requires GFCI protection for all 125-volt through 250-volt receptacles installed outdoors at dwelling units where the receptacles are accessible to persons from grade level.",
    nec_article: "210.8(A)(3)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["GFCI", "outdoor", "dwelling", "receptacles"],
    lookup_path: {
      index_keywords: ["GFCI protection, outdoors", "Outdoor receptacles, GFCI"],
      index_entry: "Ground-fault circuit-interrupter protection — dwelling units, outdoors → 210.8(A)(3)",
      article_or_table: "210.8(A)(3)",
      what_to_look_for: "Read (A)(3) — 'outdoors' with 'access from grade level' = GFCI required for all such receptacles"
    }
  },
  {
    id: "210-008",
    question: "GFCI protection is required for receptacles installed in a commercial kitchen within how many feet of a sink?",
    choices: ["3 feet", "6 feet", "10 feet", "All kitchen receptacles regardless of distance"],
    correct_answer: "6 feet",
    explanation: "NEC 210.8(B)(2) requires GFCI protection for receptacles installed within 6 feet of the outside edge of a sink in commercial kitchens and similar areas.",
    nec_article: "210.8(B)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["GFCI", "commercial kitchen", "sink", "receptacles"],
    lookup_path: {
      index_keywords: ["GFCI protection, commercial", "Kitchen receptacles, GFCI"],
      index_entry: "Ground-fault circuit-interrupter protection — other than dwelling units → 210.8(B)(2)",
      article_or_table: "210.8(B)(2)",
      what_to_look_for: "Read (B)(2) — 'within 6 feet of the outside edge of a sink'"
    }
  },

  // ─── OVERCURRENT PROTECTION ──────────────────────────────────────────────────
  {
    id: "240-002",
    question: "What is the maximum overcurrent protection permitted for a 10 AWG copper conductor with 60°C insulation?",
    choices: ["20 amperes", "30 amperes", "40 amperes", "50 amperes"],
    correct_answer: "30 amperes",
    explanation: "Table 310.16 lists 30 amperes as the ampacity of 10 AWG copper at 60°C. Per 240.4(D), 10 AWG copper conductors shall not be protected by overcurrent devices rated more than 30 amperes.",
    nec_article: "240.4(D)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["overcurrent protection", "10 AWG", "conductor protection", "240.4"],
    lookup_path: {
      index_keywords: ["Overcurrent protection, small conductors", "Conductors, overcurrent protection"],
      index_entry: "Overcurrent protection — small conductors → 240.4(D)",
      article_or_table: "240.4(D)",
      what_to_look_for: "Read (D) — 10 AWG copper = 30A maximum overcurrent device"
    }
  },
  {
    id: "240-003",
    question: "Where a fuse or circuit breaker rating does not correspond to a standard size, the next higher standard rating is permitted provided the overcurrent device does not exceed:",
    choices: ["100 amperes", "200 amperes", "400 amperes", "800 amperes"],
    correct_answer: "800 amperes",
    explanation: "NEC 240.4(B) permits the next higher standard overcurrent device rating above the conductor ampacity, provided the device rating does not exceed 800 amperes.",
    nec_article: "240.4(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["overcurrent protection", "next higher rating", "240.4(B)"],
    lookup_path: {
      index_keywords: ["Overcurrent protection, next higher rating", "Circuit breakers, next higher size"],
      index_entry: "Overcurrent protection — next higher standard device rating → 240.4(B)",
      article_or_table: "240.4(B)",
      what_to_look_for: "Read (B) — next higher standard rating permitted only if device does not exceed 800A"
    }
  },

  // ─── CONDUIT FILL ────────────────────────────────────────────────────────────
  {
    id: "358-001",
    question: "What is the maximum percent fill for a conduit containing 3 or more conductors?",
    choices: ["31%", "40%", "53%", "60%"],
    correct_answer: "40%",
    explanation: "Chapter 9, Table 1 limits conduit fill to 40% of the cross-sectional area of the conduit when 3 or more conductors are installed.",
    nec_article: "Chapter 9, Table 1",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["conduit fill", "raceway", "conductors", "Chapter 9"],
    lookup_path: {
      index_keywords: ["Conduit fill", "Raceway fill", "Conductors, conduit fill"],
      index_entry: "Conduit fill — percent fill allowed → Chapter 9, Table 1",
      article_or_table: "Chapter 9, Table 1",
      what_to_look_for: "Find '3 or more conductors' row → read '% of Cross-Sectional Area' column → 40%"
    }
  },
  {
    id: "358-002",
    question: "What is the maximum percent fill for a conduit containing only 1 conductor?",
    choices: ["31%", "40%", "53%", "60%"],
    correct_answer: "53%",
    explanation: "Chapter 9, Table 1 allows a single conductor to fill up to 53% of the conduit cross-sectional area.",
    nec_article: "Chapter 9, Table 1",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["conduit fill", "single conductor", "raceway"],
    lookup_path: {
      index_keywords: ["Conduit fill, single conductor", "Raceway fill"],
      index_entry: "Conduit fill — 1 conductor → Chapter 9, Table 1",
      article_or_table: "Chapter 9, Table 1",
      what_to_look_for: "Find '1 conductor' row → read '% of Cross-Sectional Area' column → 53%"
    }
  },
  {
    id: "358-003",
    question: "What is the trade size of the smallest EMT conduit permitted to contain three 12 AWG THHN conductors?",
    choices: ["1/2 inch", "3/4 inch", "1 inch", "1-1/4 inch"],
    correct_answer: "1/2 inch",
    explanation: "Annex C, Table C.1 shows that 1/2 inch EMT can contain up to 9 conductors of 12 AWG THHN, so three conductors fit within the 40% fill limit.",
    nec_article: "Annex C, Table C.1",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["conduit fill", "EMT", "12 AWG", "THHN"],
    lookup_path: {
      index_keywords: ["EMT conduit fill", "Conduit fill, THHN", "Annex C"],
      index_entry: "Conduit fill — EMT, THHN conductors → Annex C, Table C.1",
      article_or_table: "Annex C, Table C.1",
      what_to_look_for: "Find '12 AWG THHN' row → read '1/2 inch EMT' column → max conductors = 9; three conductors fit"
    }
  },

  // ─── WORKING CLEARANCES ──────────────────────────────────────────────────────
  {
    id: "110-001",
    question: "What is the minimum working clearance in front of a 120/240-volt panelboard installed in a dwelling unit (Condition 1)?",
    choices: ["2 feet", "2.5 feet", "3 feet", "3.5 feet"],
    correct_answer: "3 feet",
    explanation: "Table 110.26(A)(1) requires a minimum working clearance of 3 feet in front of electrical equipment rated 0–150 volts to ground under Condition 1 (exposed live parts on one side, no live or grounded parts on the other).",
    nec_article: "Table 110.26(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["working clearances", "panelboard", "110.26", "dwelling"],
    lookup_path: {
      index_keywords: ["Working clearances, electrical equipment", "Clearances, panelboard"],
      index_entry: "Working clearances — electrical equipment → 110.26(A)(1) → Table 110.26(A)(1)",
      article_or_table: "Table 110.26(A)(1)",
      what_to_look_for: "Find '0–150V to ground' row → 'Condition 1' column → 3 ft minimum"
    }
  },
  {
    id: "110-002",
    question: "What is the minimum headroom required for working spaces about electrical equipment rated 600 volts or less?",
    choices: ["5.5 feet", "6 feet", "6.5 feet", "7 feet"],
    correct_answer: "6.5 feet",
    explanation: "NEC 110.26(A)(3) requires a minimum headroom of 6.5 feet (2.0 m) for working spaces about electrical equipment rated 600 volts or less.",
    nec_article: "110.26(A)(3)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["working clearances", "headroom", "110.26"],
    lookup_path: {
      index_keywords: ["Headroom, electrical equipment", "Working clearances, headroom"],
      index_entry: "Working clearances — headroom → 110.26(A)(3)",
      article_or_table: "110.26(A)(3)",
      what_to_look_for: "Read (A)(3) — 'minimum headroom of 6½ ft (2.0 m)'"
    }
  },
  {
    id: "110-003",
    question: "What is the minimum width of the working space in front of electrical equipment rated 600 volts or less?",
    choices: ["24 inches", "30 inches", "36 inches", "The width of the equipment or 30 inches, whichever is greater"],
    correct_answer: "The width of the equipment or 30 inches, whichever is greater",
    explanation: "NEC 110.26(A)(2) requires the working space width to be the width of the equipment or 30 inches, whichever is greater.",
    nec_article: "110.26(A)(2)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["working clearances", "width", "110.26"],
    lookup_path: {
      index_keywords: ["Working clearances, width", "Electrical equipment, working space"],
      index_entry: "Working clearances — width of working space → 110.26(A)(2)",
      article_or_table: "110.26(A)(2)",
      what_to_look_for: "Read (A)(2) — 'the width of the equipment or 30 in., whichever is greater'"
    }
  },

  // ─── LOAD CALCULATIONS ───────────────────────────────────────────────────────
  {
    id: "220-001",
    question: "What is the general lighting load in volt-amperes per square foot for a dwelling unit?",
    choices: ["1 VA/sq ft", "2 VA/sq ft", "3 VA/sq ft", "3.5 VA/sq ft"],
    correct_answer: "3 VA/sq ft",
    explanation: "Table 220.12 specifies a general lighting load of 3 volt-amperes per square foot for dwelling units.",
    nec_article: "Table 220.12",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["load calculations", "dwelling", "general lighting", "VA per sq ft"],
    lookup_path: {
      index_keywords: ["General lighting loads", "Load calculations, dwelling", "Volt-amperes per square foot"],
      index_entry: "General lighting loads — by occupancy → Table 220.12",
      article_or_table: "Table 220.12",
      what_to_look_for: "Find 'Dwelling units' row → read 'Unit Load (VA/ft²)' column → 3 VA/ft²"
    }
  },
  {
    id: "220-002",
    question: "What demand factor applies to the first 3,000 VA of lighting load in a dwelling unit load calculation?",
    choices: ["50%", "75%", "100%", "35%"],
    correct_answer: "100%",
    explanation: "Table 220.42 applies a 100% demand factor to the first 3,000 VA of lighting load in a dwelling unit.",
    nec_article: "Table 220.42",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["load calculations", "demand factor", "lighting", "dwelling"],
    lookup_path: {
      index_keywords: ["Demand factors, lighting", "Lighting load, demand factors"],
      index_entry: "Lighting load — demand factors, dwelling units → Table 220.42",
      article_or_table: "Table 220.42",
      what_to_look_for: "Find 'First 3,000 VA' row → read 'Demand Factor' column → 100%"
    }
  },
  {
    id: "220-003",
    question: "What is the standard volt-ampere load assigned to each small-appliance and laundry branch circuit in a dwelling unit load calculation?",
    choices: ["1,000 VA", "1,500 VA", "2,000 VA", "3,000 VA"],
    correct_answer: "1,500 VA",
    explanation: "NEC 220.52(A) and (B) assign 1,500 VA for each 20-ampere small-appliance branch circuit and each laundry branch circuit in a dwelling unit load calculation.",
    nec_article: "220.52(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["load calculations", "small appliance", "laundry", "1500 VA"],
    lookup_path: {
      index_keywords: ["Small-appliance load", "Load calculations, small appliance"],
      index_entry: "Small-appliance branch circuits — load calculation → 220.52(A)",
      article_or_table: "220.52(A)",
      what_to_look_for: "Read (A) — 'a load of not less than 1500 volt-amperes for each 2-wire small-appliance branch circuit'"
    }
  },
  {
    id: "220-004",
    question: "When calculating the demand load for electric ranges rated over 12 kW in a dwelling unit, which NEC table is used?",
    choices: ["Table 220.42", "Table 220.55", "Table 220.56", "Table 220.12"],
    correct_answer: "Table 220.55",
    explanation: "Table 220.55 provides demand factors and maximum demand for household electric ranges, wall-mounted ovens, and counter-mounted cooking units rated over 1¾ kW.",
    nec_article: "Table 220.55",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["load calculations", "electric range", "demand factor", "cooking equipment"],
    lookup_path: {
      index_keywords: ["Electric ranges, demand factors", "Cooking equipment, load calculation"],
      index_entry: "Ranges — household, demand loads → 220.55 → Table 220.55",
      article_or_table: "Table 220.55",
      what_to_look_for: "Find number of appliances column → read demand load or apply Column C for ranges over 12 kW"
    }
  },

  // ─── PANELBOARDS ─────────────────────────────────────────────────────────────
  {
    id: "408-001",
    question: "What is the maximum number of overcurrent devices permitted in a lighting and appliance branch-circuit panelboard?",
    choices: ["24", "30", "42", "No limit"],
    correct_answer: "42",
    explanation: "NEC 408.54 limits the number of overcurrent devices in a lighting and appliance branch-circuit panelboard to 42.",
    nec_article: "408.54",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["panelboards", "overcurrent devices", "408.54", "42 circuit"],
    lookup_path: {
      index_keywords: ["Panelboards, overcurrent devices", "Circuit breakers, panelboard limit"],
      index_entry: "Panelboards — overcurrent devices, maximum number → 408.54",
      article_or_table: "408.54",
      what_to_look_for: "Read 408.54 — 'not more than 42 overcurrent devices' in a lighting and appliance branch-circuit panelboard"
    }
  },
  {
    id: "408-002",
    question: "Panelboards must be mounted in cabinets, cutout boxes, or enclosures designed for the purpose and must be dead-front. What additional requirement applies to panelboard enclosures?",
    choices: [
      "They must be painted gray",
      "They must be grounded",
      "They must be mounted at eye level",
      "They must be UL listed only"
    ],
    correct_answer: "They must be grounded",
    explanation: "NEC 408.40 requires that panelboard enclosures be grounded in accordance with Article 250 and the grounding terminal bar must be bonded to the enclosure.",
    nec_article: "408.40",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["panelboards", "grounding", "enclosure", "408.40"],
    lookup_path: {
      index_keywords: ["Panelboards, grounding", "Panelboard enclosures, grounding"],
      index_entry: "Panelboards — grounding → 408.40",
      article_or_table: "408.40",
      what_to_look_for: "Read 408.40 — enclosure must be grounded per Article 250; grounding terminal bonded to enclosure"
    }
  },
  {
    id: "408-003",
    question: "What is required on every circuit breaker or fuse in a panelboard?",
    choices: ["A red handle", "A legible directory", "A ground fault indicator", "A surge protector"],
    correct_answer: "A legible directory",
    explanation: "NEC 408.4(A) requires that every circuit breaker and fuse be legibly identified as to its purpose or use, and a circuit directory must be provided on the face or inside the door of the panelboard.",
    nec_article: "408.4(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["panelboards", "circuit directory", "labeling", "408.4"],
    lookup_path: {
      index_keywords: ["Panelboards, circuit directory", "Circuit identification, panelboard"],
      index_entry: "Panelboards — circuit identification → 408.4(A)",
      article_or_table: "408.4(A)",
      what_to_look_for: "Read (A) — 'legibly identified as to its purpose or use' and directory on face or inside door"
    }
  },

  // ─── GENERATORS ──────────────────────────────────────────────────────────────
  {
    id: "445-001",
    question: "Generators must be protected against overloads by what means?",
    choices: [
      "An external fuse only",
      "Inherent design, circuit breakers, fuses, or other acceptable overcurrent protective means",
      "A manual disconnect only",
      "No protection required for generators under 5 kW"
    ],
    correct_answer: "Inherent design, circuit breakers, fuses, or other acceptable overcurrent protective means",
    explanation: "NEC 445.12(A) requires generators to be protected against overloads by inherent design, circuit breakers, fuses, or other acceptable overcurrent protective means.",
    nec_article: "445.12(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["generators", "overcurrent protection", "445.12"],
    lookup_path: {
      index_keywords: ["Generators, overcurrent protection", "Generator protection"],
      index_entry: "Generators — overcurrent protection → 445.12",
      article_or_table: "445.12(A)",
      what_to_look_for: "Read (A) — inherent design, circuit breakers, fuses, or other acceptable means"
    }
  },
  {
    id: "445-002",
    question: "What is the minimum conductor ampacity required for a generator with a nameplate current rating?",
    choices: ["100% of nameplate current", "115% of nameplate current", "125% of nameplate current", "150% of nameplate current"],
    correct_answer: "115% of nameplate current",
    explanation: "NEC 445.13(A) requires generator output circuit conductors to have an ampacity of not less than 115% of the nameplate current rating of the generator.",
    nec_article: "445.13(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["generators", "conductor ampacity", "445.13", "nameplate"],
    lookup_path: {
      index_keywords: ["Generators, conductor ampacity", "Generator output conductors"],
      index_entry: "Generators — ampacity of conductors → 445.13(A)",
      article_or_table: "445.13(A)",
      what_to_look_for: "Read (A) — 'not less than 115 percent of the nameplate current rating'"
    }
  },
  {
    id: "445-003",
    question: "A standby generator used as a separately derived system must have its neutral bonded to the generator frame and grounded per which article?",
    choices: ["Article 230", "Article 250", "Article 445", "Article 700"],
    correct_answer: "Article 250",
    explanation: "NEC 445.18 requires that a generator used as a separately derived system be grounded and bonded in accordance with Article 250.",
    nec_article: "445.18",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["generators", "separately derived system", "grounding", "bonding"],
    lookup_path: {
      index_keywords: ["Generators, separately derived system", "Separately derived systems, grounding"],
      index_entry: "Generators — separately derived systems → 445.18 → Article 250",
      article_or_table: "445.18",
      what_to_look_for: "Read 445.18 — references Article 250 for grounding and bonding requirements"
    }
  },

  // ─── ADDITIONAL MIXED TOPICS ─────────────────────────────────────────────────
  {
    id: "300-001",
    question: "What is the minimum burial depth for rigid metal conduit (RMC) installed under a residential driveway?",
    choices: ["6 inches", "12 inches", "18 inches", "24 inches"],
    correct_answer: "6 inches",
    explanation: "Table 300.5 requires a minimum cover of 6 inches for rigid metal conduit installed under a residential driveway.",
    nec_article: "Table 300.5",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["burial depth", "RMC", "driveway", "underground"],
    lookup_path: {
      index_keywords: ["Underground wiring, burial depth", "Conduit, burial depth", "Cover requirements"],
      index_entry: "Underground installations — minimum cover → 300.5 → Table 300.5",
      article_or_table: "Table 300.5",
      what_to_look_for: "Find 'Rigid metal conduit' column → 'Under a residential driveway' row → 6 inches"
    }
  },
  {
    id: "300-002",
    question: "What is the minimum burial depth for a direct-buried cable (UF cable) installed under a residential driveway?",
    choices: ["12 inches", "18 inches", "24 inches", "6 inches"],
    correct_answer: "18 inches",
    explanation: "Table 300.5 requires a minimum cover of 18 inches for direct-buried cables installed under residential driveways.",
    nec_article: "Table 300.5",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["burial depth", "UF cable", "direct buried", "driveway"],
    lookup_path: {
      index_keywords: ["Direct-buried cables, depth", "UF cable, burial depth"],
      index_entry: "Underground installations — minimum cover → Table 300.5",
      article_or_table: "Table 300.5",
      what_to_look_for: "Find 'Direct-buried cables' column → 'Under a residential driveway' row → 18 inches"
    }
  },
  {
    id: "334-001",
    question: "NM cable (Romex) is NOT permitted to be installed in which of the following locations?",
    choices: [
      "Inside a wood-frame wall of a dwelling unit",
      "In a commercial building of Type III construction",
      "In a building exceeding three floors above grade",
      "In an attic of a one-family dwelling"
    ],
    correct_answer: "In a building exceeding three floors above grade",
    explanation: "NEC 334.10(A)(1) limits the use of NM cable to one- and two-family dwellings and their attached garages and storage areas, and to multifamily dwellings not exceeding three floors above grade.",
    nec_article: "334.10(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["NM cable", "Romex", "wiring methods", "334.10"],
    lookup_path: {
      index_keywords: ["NM cable, permitted uses", "Nonmetallic-sheathed cable, uses permitted"],
      index_entry: "Nonmetallic-sheathed cable — uses permitted → 334.10",
      article_or_table: "334.10(A)(1)",
      what_to_look_for: "Read (A)(1) — limited to structures not exceeding three floors above grade"
    }
  },
  {
    id: "410-002",
    question: "What is the minimum distance a recessed incandescent luminaire must be from thermal insulation unless listed for contact with insulation?",
    choices: ["1 inch", "2 inches", "3 inches", "6 inches"],
    correct_answer: "3 inches",
    explanation: "NEC 410.116(A)(1) requires recessed luminaires that are not identified for contact with insulation to be installed with a minimum clearance of 3 inches from thermal insulation.",
    nec_article: "410.116(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["luminaires", "recessed", "insulation clearance", "410.116"],
    lookup_path: {
      index_keywords: ["Recessed luminaires, insulation clearance", "Luminaires, thermal insulation"],
      index_entry: "Recessed luminaires — clearance from insulation → 410.116(A)(1)",
      article_or_table: "410.116(A)(1)",
      what_to_look_for: "Read (A)(1) — 'not less than 3 in. from thermal insulation' unless listed for contact"
    }
  },
  {
    id: "406-001",
    question: "Tamper-resistant receptacles are required in which locations in a dwelling unit?",
    choices: [
      "Only in children's bedrooms",
      "All 125-volt, 15- and 20-ampere receptacles in all areas of a dwelling unit",
      "Only in kitchens and bathrooms",
      "Only in rooms accessible to children under 6"
    ],
    correct_answer: "All 125-volt, 15- and 20-ampere receptacles in all areas of a dwelling unit",
    explanation: "NEC 406.12(A) requires tamper-resistant receptacles for all 125-volt, 15- and 20-ampere receptacles in all areas of a dwelling unit.",
    nec_article: "406.12(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["tamper-resistant", "receptacles", "dwelling", "406.12"],
    lookup_path: {
      index_keywords: ["Tamper-resistant receptacles", "Receptacles, tamper-resistant"],
      index_entry: "Tamper-resistant receptacles — dwelling units → 406.12(A)",
      article_or_table: "406.12(A)",
      what_to_look_for: "Read (A) — 'all 125-volt, 15- and 20-ampere receptacles in all areas of a dwelling unit'"
    }
  },
  {
    id: "700-001",
    question: "Emergency lighting systems must be capable of providing illumination for a minimum of how long upon failure of normal power?",
    choices: ["30 minutes", "60 minutes", "90 minutes", "120 minutes"],
    correct_answer: "90 minutes",
    explanation: "NEC 700.12 requires emergency lighting systems to provide illumination for a minimum of 90 minutes upon failure of the normal power supply.",
    nec_article: "700.12",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["emergency systems", "emergency lighting", "700.12", "90 minutes"],
    lookup_path: {
      index_keywords: ["Emergency lighting, duration", "Emergency systems, battery backup"],
      index_entry: "Emergency systems — illumination duration → 700.12",
      article_or_table: "700.12",
      what_to_look_for: "Read 700.12 — 'capable of providing the required illumination for a minimum of 90 minutes'"
    }
  },
  {
    id: "517-001",
    question: "In a hospital operating room, what is the maximum voltage permitted between any two exposed conductive surfaces in a patient care vicinity?",
    choices: ["5 millivolts", "10 millivolts", "40 millivolts", "100 millivolts"],
    correct_answer: "40 millivolts",
    explanation: "NEC 517.13(A) requires that the voltage between any two exposed conductive surfaces in a patient care vicinity not exceed 40 millivolts.",
    nec_article: "517.13(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["healthcare", "hospital", "patient care", "517.13"],
    lookup_path: {
      index_keywords: ["Patient care vicinity, voltage", "Healthcare facilities, grounding"],
      index_entry: "Healthcare facilities — patient care vicinity, voltage → 517.13(A)",
      article_or_table: "517.13(A)",
      what_to_look_for: "Read (A) — 'not exceed 40 millivolts' between any two exposed conductive surfaces"
    }
  },
  {
    id: "250-005",
    question: "What is the minimum size copper bonding jumper required to bond a metal water piping system in a building with a 200-ampere service?",
    choices: ["6 AWG", "4 AWG", "2 AWG", "1/0 AWG"],
    correct_answer: "4 AWG",
    explanation: "Table 250.102(C)(1) requires a minimum 4 AWG copper bonding jumper for metal water piping systems when the service-entrance conductors are 3/0 AWG through 350 kcmil copper.",
    nec_article: "Table 250.102(C)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["grounding", "bonding", "water pipe", "bonding jumper"],
    lookup_path: {
      index_keywords: ["Bonding jumpers, metal water pipe", "Water piping, bonding"],
      index_entry: "Bonding — metal water piping → 250.104(A) → Table 250.102(C)(1)",
      article_or_table: "Table 250.102(C)(1)",
      what_to_look_for: "Find service conductor size range matching 200A service → read bonding jumper size column → 4 AWG copper"
    }
  },
  {
    id: "358-004",
    question: "What is the maximum number of bends (total degrees) permitted in a single run of conduit between pull points?",
    choices: ["180 degrees", "270 degrees", "360 degrees", "No limit"],
    correct_answer: "360 degrees",
    explanation: "NEC 358.26 (EMT) and similar articles for other conduit types limit the total bends between pull points or boxes to 360 degrees (the equivalent of four 90-degree bends).",
    nec_article: "358.26",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["conduit", "bends", "EMT", "358.26"],
    lookup_path: {
      index_keywords: ["Conduit bends, maximum", "EMT, bends", "Bends, conduit"],
      index_entry: "Electrical metallic tubing — bends, number in one run → 358.26",
      article_or_table: "358.26",
      what_to_look_for: "Read 358.26 — 'not more than the equivalent of four quarter bends (360 degrees total)'"
    }
  },
  {
    id: "210-009",
    question: "What is the maximum continuous load permitted on a 20-ampere branch circuit?",
    choices: ["16 amperes", "20 amperes", "24 amperes", "25 amperes"],
    correct_answer: "16 amperes",
    explanation: "NEC 210.20(A) limits the continuous load on a branch circuit to 80% of the branch circuit rating, so a 20-ampere circuit is limited to 16 amperes of continuous load.",
    nec_article: "210.20(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["branch circuit", "continuous load", "80%", "210.20"],
    lookup_path: {
      index_keywords: ["Continuous loads, branch circuit", "Branch circuits, continuous load"],
      index_entry: "Branch circuits — continuous loads → 210.20(A)",
      article_or_table: "210.20(A)",
      what_to_look_for: "Read (A) — 'not exceed 80 percent of the branch-circuit ampere rating' for continuous loads"
    }
  },
  {
    id: "550-001",
    question: "What is the minimum size service-entrance conductor permitted for a mobile home with a calculated load of 16,000 VA at 120/240 volts?",
    choices: ["4 AWG", "2 AWG", "1/0 AWG", "2/0 AWG"],
    correct_answer: "2 AWG",
    explanation: "A 16,000 VA load at 240V = 66.7A. Per Table 310.16, 2 AWG copper at 75°C = 95A, which is adequate. NEC 550.18(A) also sets minimums for mobile home feeder conductors.",
    nec_article: "550.18(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["mobile homes", "service entrance", "load calculation", "550.18"],
    lookup_path: {
      index_keywords: ["Mobile homes, service conductors", "Mobile homes, feeder"],
      index_entry: "Mobile homes — service equipment, feeder conductors → 550.18(A)",
      article_or_table: "550.18(A)",
      what_to_look_for: "Calculate load ÷ 240V = amperes → find conductor size in Table 310.16 at 75°C column"
    }
  },

  {
    id: "090-001",
    question: "According to Article 90, what is the stated purpose of the National Electrical Code?",
    choices: [
      "The practical safeguarding of persons and property from hazards arising from the use of electricity",
      "To serve as a design manual for electrical engineers",
      "To provide an instruction guide for untrained persons",
      "To ensure electrical installations are efficient and convenient"
    ],
    correct_answer: "The practical safeguarding of persons and property from hazards arising from the use of electricity",
    explanation: "NEC 90.1(A) states the purpose of the Code is the practical safeguarding of persons and property from hazards arising from the use of electricity. 90.1 also notes the NEC is not intended as a design specification or an instruction manual for untrained persons.",
    nec_article: "90.1(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["article 90", "purpose", "scope"],
    lookup_path: {
      index_keywords: ["Purpose of Code", "Scope, NEC"],
      index_entry: "Purpose (of the Code) → 90.1",
      article_or_table: "90.1(A)",
      what_to_look_for: "Read 90.1(A) — 'practical safeguarding of persons and property from hazards arising from the use of electricity'"
    }
  },
  {
    id: "100-001",
    question: "Per the Article 100 definition, equipment that is 'readily accessible' must be reachable:",
    choices: [
      "Quickly, without climbing over obstacles or using ladders or tools to gain access",
      "Within 25 feet of the equipment served",
      "By removing a panel or cover with simple tools",
      "Only by qualified persons"
    ],
    correct_answer: "Quickly, without climbing over obstacles or using ladders or tools to gain access",
    explanation: "Article 100 defines 'Accessible, Readily (Readily Accessible)' as capable of being reached quickly for operation, renewal, or inspections without requiring those to whom ready access is requisite to take actions such as using tools (other than keys), climbing over or under, or removing obstacles, or resorting to portable ladders.",
    nec_article: "Article 100",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["definitions", "readily accessible", "article 100"],
    lookup_path: {
      index_keywords: ["Readily accessible", "Definitions"],
      index_entry: "Accessible, readily — definition → Article 100",
      article_or_table: "Article 100 — Definitions",
      what_to_look_for: "Find 'Accessible, Readily' — reachable quickly without tools, ladders, or climbing over obstacles"
    }
  },
  {
    id: "110-004",
    question: "Service equipment in other than dwelling units must be legibly field-marked with the maximum available fault current. What else must the marking include?",
    choices: [
      "The date the fault-current calculation was performed",
      "The name of the electrician who installed it",
      "The utility transformer kVA rating",
      "The conductor insulation type"
    ],
    correct_answer: "The date the fault-current calculation was performed",
    explanation: "NEC 110.24(A) requires service equipment in other than dwelling units to be legibly marked in the field with the maximum available fault current, and the field marking must include the date the fault-current calculation was performed.",
    nec_article: "110.24(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["available fault current", "field marking", "service equipment", "110.24"],
    lookup_path: {
      index_keywords: ["Fault current, available", "Service equipment, marking"],
      index_entry: "Available fault current — field marking → 110.24",
      article_or_table: "110.24(A)",
      what_to_look_for: "Read (A) — marking must include the maximum available fault current and the date the calculation was performed"
    }
  },
  {
    id: "110-005",
    question: "Each disconnecting means required by the Code must be legibly marked to indicate:",
    choices: [
      "Its purpose, unless located and arranged so the purpose is evident",
      "The name of the manufacturer only",
      "The wire size connected to it",
      "The date of installation"
    ],
    correct_answer: "Its purpose, unless located and arranged so the purpose is evident",
    explanation: "NEC 110.22(A) requires each disconnecting means to be legibly marked to indicate its purpose unless it is located and arranged so the purpose is evident. The marking must be of sufficient durability to withstand the environment involved.",
    nec_article: "110.22(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["disconnecting means", "identification", "marking", "110.22"],
    lookup_path: {
      index_keywords: ["Disconnecting means, identification", "Identification, disconnecting means"],
      index_entry: "Disconnecting means — identification → 110.22",
      article_or_table: "110.22(A)",
      what_to_look_for: "Read (A) — marked to indicate its purpose unless located and arranged so the purpose is evident"
    }
  },
  {
    id: "210-010",
    question: "For one- and two-family dwellings, GFCI protection is required for outdoor outlets supplied by single-phase branch circuits rated 150 volts or less to ground and up to what ampere rating?",
    choices: ["50 amperes", "20 amperes", "30 amperes", "60 amperes"],
    correct_answer: "50 amperes",
    explanation: "NEC 210.8(F), added in the 2020 code, requires GFCI protection for outdoor outlets (not just receptacles) at dwellings supplied by single-phase branch circuits rated 150V or less to ground, 50 amperes or less — this notably pulled in hard-wired equipment like HVAC condensers.",
    nec_article: "210.8(F)",
    nec_versions: ["2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["GFCI", "outdoor outlets", "dwelling", "210.8(F)"],
    lookup_path: {
      index_keywords: ["Ground-fault circuit interrupters", "Outdoor outlets, dwellings"],
      index_entry: "GFCI — outdoor outlets, dwellings → 210.8(F)",
      article_or_table: "210.8(F)",
      what_to_look_for: "Read (F) — outdoor outlets, single-phase, 150V to ground or less, 50A or less require GFCI"
    }
  },
  {
    id: "210-011",
    question: "In a dwelling kitchen, no point along the wall line of a countertop 12 inches or wider may be more than how far from a receptacle outlet?",
    choices: ["24 inches", "12 inches", "36 inches", "48 inches"],
    correct_answer: "24 inches",
    explanation: "NEC 210.52(C) requires countertop receptacles so that no point along the wall line is more than 600 mm (24 in.) measured horizontally from a receptacle outlet — i.e., receptacles at least every 4 feet of countertop wall space.",
    nec_article: "210.52(C)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["receptacles", "kitchen", "countertop", "210.52"],
    lookup_path: {
      index_keywords: ["Receptacles, countertop", "Kitchen, receptacle spacing"],
      index_entry: "Receptacle outlets — countertops, dwelling → 210.52(C)",
      article_or_table: "210.52(C)",
      what_to_look_for: "Read the countertop spacing rule — no point more than 24 in. from a receptacle"
    }
  },
  {
    id: "210-012",
    question: "In dwelling units, at least one wall switch-controlled lighting outlet is required in which of the following locations?",
    choices: [
      "Every habitable room, kitchen, and bathroom",
      "Only kitchens and bathrooms",
      "Only rooms larger than 70 square feet",
      "Bedrooms only"
    ],
    correct_answer: "Every habitable room, kitchen, and bathroom",
    explanation: "NEC 210.70(A)(1) requires at least one wall switch-controlled lighting outlet in every habitable room, kitchen, and bathroom of a dwelling unit. (Exceptions allow switched receptacles in rooms other than kitchens and bathrooms.)",
    nec_article: "210.70(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["lighting outlets", "switches", "dwelling", "210.70"],
    lookup_path: {
      index_keywords: ["Lighting outlets, required", "Dwelling units, lighting outlets"],
      index_entry: "Lighting outlets — dwelling, required locations → 210.70(A)",
      article_or_table: "210.70(A)(1)",
      what_to_look_for: "Read (A)(1) — habitable rooms, kitchens, and bathrooms need a wall switch-controlled lighting outlet"
    }
  },
  {
    id: "210-013",
    question: "In dwelling units, luminaires and cord-and-plug-connected loads up to 1440 VA must be supplied by branch circuits not exceeding how many volts between conductors?",
    choices: ["120 volts", "208 volts", "240 volts", "277 volts"],
    correct_answer: "120 volts",
    explanation: "NEC 210.6(A) limits branch circuits in dwelling units supplying luminaires and cord-and-plug-connected loads up to 1440 VA (or less than 1/4 HP) to a maximum of 120 volts nominal between conductors.",
    nec_article: "210.6(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["voltage limitations", "branch circuits", "dwelling", "210.6"],
    lookup_path: {
      index_keywords: ["Voltage limitations, branch circuits", "Branch circuits, voltage"],
      index_entry: "Branch circuits — voltage limitations, dwellings → 210.6(A)",
      article_or_table: "210.6(A)",
      what_to_look_for: "Read (A) — 120V max between conductors for luminaires and small cord-and-plug loads in dwellings"
    }
  },
  {
    id: "215-001",
    question: "A feeder supplies a continuous load of 80 amperes and no noncontinuous load. What is the minimum required rating of the feeder overcurrent device?",
    choices: ["100 amperes", "80 amperes", "90 amperes", "125 amperes"],
    correct_answer: "100 amperes",
    explanation: "Per 215.3 (and 215.2(A)(1) for conductors), the feeder OCPD must be rated not less than the noncontinuous load plus 125% of the continuous load: 80A × 1.25 = 100A.",
    nec_article: "215.3",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["feeders", "continuous load", "125%", "215.3"],
    lookup_path: {
      index_keywords: ["Feeders, overcurrent protection", "Continuous loads, feeders"],
      index_entry: "Feeders — overcurrent protection → 215.3",
      article_or_table: "215.3",
      what_to_look_for: "Noncontinuous load + 125% of continuous load → 80 × 1.25 = 100A"
    }
  },
  {
    id: "220-005",
    question: "What is the minimum load in a dwelling service calculation for an electric clothes dryer?",
    choices: [
      "5000 VA or the nameplate rating, whichever is larger",
      "4000 VA in all cases",
      "The nameplate rating only",
      "1500 VA"
    ],
    correct_answer: "5000 VA or the nameplate rating, whichever is larger",
    explanation: "NEC 220.54 requires the load for household electric clothes dryers to be either 5,000 watts (volt-amperes) or the nameplate rating, whichever is larger, with demand factors from Table 220.54 permitted for multiple dryers.",
    nec_article: "220.54",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["load calculations", "dryers", "dwelling", "220.54"],
    lookup_path: {
      index_keywords: ["Clothes dryers, load", "Load calculations, dryers"],
      index_entry: "Clothes dryers — load calculations → 220.54",
      article_or_table: "220.54",
      what_to_look_for: "Read the rule — 5000 VA or nameplate rating, whichever is larger"
    }
  },
  {
    id: "220-006",
    question: "In a dwelling load calculation, a demand factor of 75% may be applied to the nameplate rating of how many fastened-in-place appliances (other than ranges, dryers, space heating, or A/C)?",
    choices: ["Four or more", "Two or more", "Three or more", "Five or more"],
    correct_answer: "Four or more",
    explanation: "NEC 220.53 permits a 75% demand factor to be applied to the total nameplate rating of four or more appliances fastened in place (other than electric ranges, clothes dryers, space-heating, or air-conditioning equipment) served by the same feeder or service in a dwelling.",
    nec_article: "220.53",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["load calculations", "appliances", "demand factor", "220.53"],
    lookup_path: {
      index_keywords: ["Appliances, demand factors", "Load calculations, appliances"],
      index_entry: "Appliance load — dwelling, demand factor → 220.53",
      article_or_table: "220.53",
      what_to_look_for: "Read the rule — 75% demand for 4 or more fastened-in-place appliances"
    }
  },
  {
    id: "230-004",
    question: "For one- and two-family dwellings, an emergency disconnect must be installed in a readily accessible location where?",
    choices: [
      "Outside the dwelling",
      "Inside, at the main panelboard",
      "In the garage",
      "Within 10 feet of the electric meter, inside or outside"
    ],
    correct_answer: "Outside the dwelling",
    explanation: "NEC 230.85, introduced in the 2020 code, requires service conductors for one- and two-family dwellings to be provided with an emergency disconnect in a readily accessible outdoor location, so first responders can de-energize the premises without entering.",
    nec_article: "230.85",
    nec_versions: ["2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["services", "emergency disconnect", "dwelling", "230.85"],
    lookup_path: {
      index_keywords: ["Emergency disconnects", "Services, disconnecting means"],
      index_entry: "Services — emergency disconnects, dwellings → 230.85",
      article_or_table: "230.85",
      what_to_look_for: "Read the rule — readily accessible outdoor location, marked as emergency disconnect"
    }
  },
  {
    id: "230-005",
    question: "Services supplying dwelling units are required to be provided with what protective device?",
    choices: [
      "A surge-protective device (SPD)",
      "A lightning rod system",
      "An isolation transformer",
      "A phase-failure relay"
    ],
    correct_answer: "A surge-protective device (SPD)",
    explanation: "NEC 230.67, added in the 2020 code, requires all services supplying dwelling units to be provided with a surge-protective device (Type 1 or Type 2), installed in or adjacent to the service equipment.",
    nec_article: "230.67",
    nec_versions: ["2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["surge protection", "SPD", "services", "dwelling", "230.67"],
    lookup_path: {
      index_keywords: ["Surge-protective devices", "Services, surge protection"],
      index_entry: "Surge-protective devices — dwelling services → 230.67",
      article_or_table: "230.67",
      what_to_look_for: "Read the rule — SPD required for dwelling unit services, Type 1 or Type 2"
    }
  },
  {
    id: "240-004",
    question: "Which of the following is NOT a standard ampere rating for fuses and inverse time circuit breakers?",
    choices: ["75 amperes", "45 amperes", "70 amperes", "110 amperes"],
    correct_answer: "75 amperes",
    explanation: "NEC 240.6(A) lists the standard ampere ratings. 45A, 70A, and 110A are all in the list; 75A is not a standard rating.",
    nec_article: "240.6(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["overcurrent", "standard ratings", "240.6"],
    lookup_path: {
      index_keywords: ["Overcurrent devices, standard ratings", "Standard ampere ratings"],
      index_entry: "Overcurrent protection — standard ampere ratings → 240.6",
      article_or_table: "240.6(A)",
      what_to_look_for: "Scan the list of standard ratings — 75A does not appear"
    }
  },
  {
    id: "240-005",
    question: "What is the maximum overcurrent protection permitted for 14 AWG copper conductors after any correction or adjustment factors?",
    choices: ["15 amperes", "20 amperes", "25 amperes", "10 amperes"],
    correct_answer: "15 amperes",
    explanation: "NEC 240.4(D)(3) limits overcurrent protection for 14 AWG copper to 15 amperes, unless specifically permitted elsewhere (e.g., motor applications). This is the 'small conductor rule'.",
    nec_article: "240.4(D)(3)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["overcurrent", "small conductors", "14 AWG", "240.4(D)"],
    lookup_path: {
      index_keywords: ["Small conductors, overcurrent protection", "Conductors, overcurrent protection"],
      index_entry: "Conductors — small, overcurrent protection → 240.4(D)",
      article_or_table: "240.4(D)(3)",
      what_to_look_for: "Find the 14 AWG copper line — 15 amperes maximum"
    }
  },
  {
    id: "250-006",
    question: "What is the minimum size copper equipment grounding conductor required for a circuit protected by a 100-ampere overcurrent device?",
    choices: ["8 AWG", "10 AWG", "6 AWG", "4 AWG"],
    correct_answer: "8 AWG",
    explanation: "Per Table 250.122, a circuit with a 100-ampere rating or setting of the overcurrent device requires a minimum 8 AWG copper equipment grounding conductor.",
    nec_article: "Table 250.122",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["grounding", "EGC", "Table 250.122"],
    lookup_path: {
      index_keywords: ["Equipment grounding conductors, size", "Grounding, equipment"],
      index_entry: "Equipment grounding conductors — sizing → Table 250.122",
      article_or_table: "Table 250.122",
      what_to_look_for: "Find the '100' ampere row → copper column → 8 AWG"
    }
  },
  {
    id: "250-007",
    question: "A concrete-encased electrode (Ufer ground) must consist of at least 20 feet of bare copper conductor not smaller than what size, or 1/2 inch reinforcing steel?",
    choices: ["4 AWG", "6 AWG", "2 AWG", "8 AWG"],
    correct_answer: "4 AWG",
    explanation: "NEC 250.52(A)(3) describes the concrete-encased electrode: at least 6.0 m (20 ft) of either bare copper conductor not smaller than 4 AWG, or steel reinforcing bars at least 13 mm (1/2 in.) in diameter, encased by at least 2 in. of concrete near the bottom of a foundation or footing in direct contact with earth.",
    nec_article: "250.52(A)(3)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["grounding electrodes", "concrete-encased", "Ufer", "250.52"],
    lookup_path: {
      index_keywords: ["Concrete-encased electrodes", "Grounding electrodes, types"],
      index_entry: "Grounding electrodes — concrete-encased → 250.52(A)(3)",
      article_or_table: "250.52(A)(3)",
      what_to_look_for: "Read (A)(3) — 20 ft of 4 AWG bare copper or 1/2 in. rebar, encased in 2 in. of concrete"
    }
  },
  {
    id: "250-008",
    question: "Where the grounding electrode conductor is connected only to a rod, pipe, or plate electrode, it is not required to be larger than:",
    choices: ["6 AWG copper", "4 AWG copper", "8 AWG copper", "2 AWG copper"],
    correct_answer: "6 AWG copper",
    explanation: "NEC 250.66(A) states that where the GEC is connected solely to rod, pipe, or plate electrodes, that portion of the conductor is not required to be larger than 6 AWG copper (or 4 AWG aluminum).",
    nec_article: "250.66(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["grounding electrode conductor", "ground rod", "250.66"],
    lookup_path: {
      index_keywords: ["Grounding electrode conductor, rod electrodes", "Ground rods, conductor size"],
      index_entry: "Grounding electrode conductors — connections to rod electrodes → 250.66(A)",
      article_or_table: "250.66(A)",
      what_to_look_for: "Read (A) — sole connection to a rod electrode: 6 AWG copper max required"
    }
  },
  {
    id: "300-003",
    question: "Where NM cable passes through bored holes in wood framing members, the edge of the hole must be at least how far from the nearest edge of the wood member, or the cable must be protected by a steel plate?",
    choices: ["1-1/4 inches", "1 inch", "1-1/2 inches", "2 inches"],
    correct_answer: "1-1/4 inches",
    explanation: "NEC 300.4(A)(1) requires bored holes in wood members to be at least 32 mm (1-1/4 in.) from the nearest edge, or the cable must be protected from screws and nails by a steel plate at least 1.6 mm (1/16 in.) thick.",
    nec_article: "300.4(A)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["cable protection", "bored holes", "framing", "300.4"],
    lookup_path: {
      index_keywords: ["Protection against physical damage, cables", "Bored holes, cables through"],
      index_entry: "Cables — through wood framing members → 300.4(A)",
      article_or_table: "300.4(A)(1)",
      what_to_look_for: "Read (A)(1) — 1-1/4 in. from the edge or a 1/16 in. steel plate"
    }
  },
  {
    id: "300-004",
    question: "All conductors of the same circuit, including the grounded conductor and equipment grounding conductors, must generally be installed:",
    choices: [
      "In the same raceway, cable, or trench",
      "In separate raceways to reduce heating",
      "Within 10 feet of each other",
      "In raceways of the same trade size"
    ],
    correct_answer: "In the same raceway, cable, or trench",
    explanation: "NEC 300.3(B) requires all conductors of the same circuit — ungrounded, grounded, and equipment grounding conductors — to be contained within the same raceway, cable, or trench (with limited exceptions such as paralleled installations). This prevents inductive heating and high impedance in fault paths.",
    nec_article: "300.3(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["wiring methods", "same circuit", "raceway", "300.3"],
    lookup_path: {
      index_keywords: ["Conductors, same circuit", "Wiring methods, conductors grouped"],
      index_entry: "Conductors — of same circuit, grouped → 300.3(B)",
      article_or_table: "300.3(B)",
      what_to_look_for: "Read (B) — all circuit conductors in the same raceway, cable, or trench"
    }
  },
  {
    id: "310-005",
    question: "Using the ambient temperature correction factors, what correction factor applies to a 90°C rated conductor installed where the ambient temperature is 40°C?",
    choices: ["0.91", "0.88", "0.82", "1.00"],
    correct_answer: "0.91",
    explanation: "Per Table 310.15(B)(1) (based on a 30°C ambient), a conductor with 90°C insulation in a 36–40°C ambient has a correction factor of 0.91.",
    nec_article: "Table 310.15(B)(1)",
    nec_versions: ["2020", "2023", "2026"],
    difficulty: "master",
    tags: ["ampacity", "correction factors", "ambient temperature", "310.15"],
    lookup_path: {
      index_keywords: ["Ampacity, correction factors", "Temperature correction, conductors"],
      index_entry: "Ampacities — ambient temperature correction → Table 310.15(B)(1)",
      article_or_table: "Table 310.15(B)(1)",
      what_to_look_for: "Find the '36–40°C' row → 90°C column → 0.91"
    }
  },
  {
    id: "314-004",
    question: "An outlet box used as the sole support of a ceiling-suspended (paddle) fan must be:",
    choices: [
      "Listed and marked as suitable for ceiling fan support",
      "Metal, with a minimum depth of 2-1/8 inches",
      "Supported by at least two framing members",
      "Rated for at least 50 pounds in all cases with no marking required"
    ],
    correct_answer: "Listed and marked as suitable for ceiling fan support",
    explanation: "NEC 314.27(C) requires outlet boxes used as the sole support of ceiling-suspended (paddle) fans to be listed, marked as suitable for the purpose, and not support fans over 32 kg (70 lb). Fans over 35 lb must have the weight marked on the box if box-supported.",
    nec_article: "314.27(C)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["boxes", "ceiling fans", "support", "314.27"],
    lookup_path: {
      index_keywords: ["Ceiling fans, outlet boxes", "Boxes, fan support"],
      index_entry: "Boxes — ceiling (paddle) fan support → 314.27(C)",
      article_or_table: "314.27(C)",
      what_to_look_for: "Read (C) — box must be listed and marked for ceiling fan support"
    }
  },
  {
    id: "334-002",
    question: "NM cable must be secured at intervals not exceeding 4-1/2 feet and within what distance of every box, cabinet, or fitting?",
    choices: ["12 inches", "8 inches", "18 inches", "24 inches"],
    correct_answer: "12 inches",
    explanation: "NEC 334.30 requires nonmetallic-sheathed cable to be supported and secured at intervals not exceeding 1.4 m (4-1/2 ft) and within 300 mm (12 in.) of every box, cabinet, conduit body, or other cable termination.",
    nec_article: "334.30",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["NM cable", "securing", "support", "334.30"],
    lookup_path: {
      index_keywords: ["Nonmetallic-sheathed cable, securing", "NM cable, support"],
      index_entry: "Nonmetallic-sheathed cable — securing and supporting → 334.30",
      article_or_table: "334.30",
      what_to_look_for: "Read the rule — 4-1/2 ft intervals, within 12 in. of boxes and fittings"
    }
  },
  {
    id: "404-001",
    question: "Switches and circuit breakers used as switches must be installed so the center of the operating handle grip, in its highest position, is not more than what height above the floor or working platform?",
    choices: ["6 feet 7 inches", "6 feet 0 inches", "5 feet 6 inches", "7 feet 0 inches"],
    correct_answer: "6 feet 7 inches",
    explanation: "NEC 404.8(A) requires switches and circuit breakers used as switches to be operable from a readily accessible location, with the center of the grip of the operating handle not more than 2.0 m (6 ft 7 in.) above the floor or working platform when in its highest position.",
    nec_article: "404.8(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["switches", "accessibility", "mounting height", "404.8"],
    lookup_path: {
      index_keywords: ["Switches, accessibility", "Switches, mounting height"],
      index_entry: "Switches — accessibility and grouping → 404.8(A)",
      article_or_table: "404.8(A)",
      what_to_look_for: "Read (A) — handle grip center max 6 ft 7 in. above floor"
    }
  },
  {
    id: "406-002",
    question: "A 15- or 20-ampere, 125-volt receptacle installed outdoors in a wet location must be:",
    choices: [
      "Listed weather-resistant type with an enclosure that is weatherproof with the plug inserted (in-use cover)",
      "Standard type with a flat cover plate",
      "GFCI type only, with any cover",
      "Isolated-ground type with a metal cover"
    ],
    correct_answer: "Listed weather-resistant type with an enclosure that is weatherproof with the plug inserted (in-use cover)",
    explanation: "NEC 406.9(B)(1) requires 15A and 20A, 125V and 250V receptacles in wet locations to have an enclosure that is weatherproof whether or not the attachment plug is inserted (an 'in-use' or 'bubble' cover), and 406.9(A)/(B) require them to be listed weather-resistant type.",
    nec_article: "406.9(B)(1)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["receptacles", "wet locations", "weather-resistant", "406.9"],
    lookup_path: {
      index_keywords: ["Receptacles, wet locations", "Weatherproof enclosures"],
      index_entry: "Receptacles — wet locations → 406.9(B)",
      article_or_table: "406.9(B)(1)",
      what_to_look_for: "Read (B)(1) — weatherproof with plug inserted; WR-type receptacle required"
    }
  },
  {
    id: "410-003",
    question: "Within the actual outside dimension of a bathtub, and up to 8 feet vertically from the top of the bathtub rim, which luminaires are prohibited?",
    choices: [
      "Cord-connected, chain-, cable-, or cord-suspended luminaires, lighting track, pendants, and ceiling-suspended (paddle) fans",
      "All luminaires of any type",
      "Only incandescent luminaires",
      "Recessed luminaires with lenses"
    ],
    correct_answer: "Cord-connected, chain-, cable-, or cord-suspended luminaires, lighting track, pendants, and ceiling-suspended (paddle) fans",
    explanation: "NEC 410.10(D) prohibits cord-connected luminaires, chain/cable/cord-suspended luminaires, lighting track, pendants, and ceiling-suspended (paddle) fans within a zone 3 ft horizontally and 8 ft vertically from the top of the bathtub rim or shower stall threshold.",
    nec_article: "410.10(D)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["luminaires", "bathtub zone", "bathrooms", "410.10"],
    lookup_path: {
      index_keywords: ["Luminaires, bathtub and shower areas", "Bathtubs, luminaires near"],
      index_entry: "Luminaires — bathtub and shower areas → 410.10(D)",
      article_or_table: "410.10(D)",
      what_to_look_for: "Read (D) — the 3 ft × 8 ft zone and the list of prohibited luminaire types"
    }
  },
  {
    id: "422-001",
    question: "A fixed storage-type water heater with a capacity of 120 gallons or less is considered what type of load for branch-circuit sizing?",
    choices: ["A continuous load", "A noncontinuous load", "An intermittent load", "A standby load"],
    correct_answer: "A continuous load",
    explanation: "NEC 422.13 requires a fixed storage-type water heater with a capacity of 450 L (120 gal) or less to be considered a continuous load for branch-circuit sizing — so the branch circuit must be rated at least 125% of the nameplate rating.",
    nec_article: "422.13",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["appliances", "water heaters", "continuous load", "422.13"],
    lookup_path: {
      index_keywords: ["Water heaters, branch circuits", "Appliances, water heaters"],
      index_entry: "Water heaters — storage-type → 422.13",
      article_or_table: "422.13",
      what_to_look_for: "Read the rule — 120 gal or less = continuous load (125% branch circuit)"
    }
  },
  {
    id: "424-001",
    question: "Fixed electric space-heating equipment must be considered a continuous load. The branch circuit must therefore be sized at what percentage of the total heating load?",
    choices: ["125%", "100%", "115%", "150%"],
    correct_answer: "125%",
    explanation: "NEC 424.3(B) requires fixed electric space-heating equipment and any associated motors to be considered a continuous load, so branch-circuit conductors and OCPDs must be sized at not less than 125% of the total load.",
    nec_article: "424.3(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["space heating", "continuous load", "125%", "424.3"],
    lookup_path: {
      index_keywords: ["Space-heating equipment, branch circuits", "Fixed electric space heating"],
      index_entry: "Fixed electric space-heating equipment — branch circuits → 424.3(B)",
      article_or_table: "424.3(B)",
      what_to_look_for: "Read (B) — continuous load, size at 125%"
    }
  },
  {
    id: "430-005",
    question: "Per the Article 100 definition used for motor disconnects, 'within sight' means visible and not more than what distance from the equipment?",
    choices: ["50 feet", "25 feet", "75 feet", "100 feet"],
    correct_answer: "50 feet",
    explanation: "The Article 100 definition of 'In Sight From (Within Sight From, Within Sight)' specifies that equipment must be visible and not more than 15 m (50 ft) distant. This governs rules like 430.102(B) requiring a disconnecting means in sight from the motor location.",
    nec_article: "Article 100 / 430.102(B)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["motors", "disconnecting means", "within sight", "430.102"],
    lookup_path: {
      index_keywords: ["In sight from, definition", "Motors, disconnecting means"],
      index_entry: "In sight from — definition → Article 100",
      article_or_table: "Article 100; 430.102(B)",
      what_to_look_for: "Definition: visible and not more than 50 ft distant"
    }
  },
  {
    id: "440-001",
    question: "The disconnecting means for air-conditioning or refrigerating equipment must be located:",
    choices: [
      "Within sight from, and readily accessible from, the equipment",
      "At the service panel only",
      "Within 100 feet of the equipment",
      "Inside the conditioned space"
    ],
    correct_answer: "Within sight from, and readily accessible from, the equipment",
    explanation: "NEC 440.14 requires the disconnecting means for air-conditioning and refrigerating equipment to be located within sight from, and readily accessible from, the equipment. It may be installed on or within the equipment if permitted.",
    nec_article: "440.14",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["air conditioning", "disconnecting means", "440.14"],
    lookup_path: {
      index_keywords: ["Air-conditioning equipment, disconnecting means", "Disconnecting means, A/C"],
      index_entry: "Air-conditioning and refrigerating equipment — disconnecting means → 440.14",
      article_or_table: "440.14",
      what_to_look_for: "Read the rule — within sight and readily accessible from the equipment"
    }
  },
  {
    id: "590-001",
    question: "On construction sites, GFCI protection for personnel is required for which receptacle outlets used for temporary power?",
    choices: [
      "All 125-volt, single-phase, 15-, 20-, and 30-ampere receptacle outlets",
      "Only 15-ampere receptacles",
      "Only receptacles outdoors",
      "Only receptacles within 6 feet of water"
    ],
    correct_answer: "All 125-volt, single-phase, 15-, 20-, and 30-ampere receptacle outlets",
    explanation: "NEC 590.6(A) requires GFCI protection for personnel on all 125-volt, single-phase, 15-, 20-, and 30-ampere receptacle outlets that are not part of the permanent wiring and are used by personnel during construction, remodeling, maintenance, repair, or demolition.",
    nec_article: "590.6(A)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["temporary power", "construction", "GFCI", "590.6"],
    lookup_path: {
      index_keywords: ["Temporary installations, GFCI", "Construction sites, receptacles"],
      index_entry: "Temporary installations — GFCI protection → 590.6(A)",
      article_or_table: "590.6(A)",
      what_to_look_for: "Read (A) — 125V, 1-phase, 15/20/30A receptacles require GFCI"
    }
  },
  {
    id: "625-001",
    question: "Electric vehicle supply equipment (EVSE) loads are considered continuous. The overcurrent protection for a feeder or branch circuit supplying EVSE must be sized at not less than:",
    choices: [
      "125% of the maximum load of the equipment",
      "100% of the nameplate rating",
      "115% of the maximum load",
      "150% of the maximum load"
    ],
    correct_answer: "125% of the maximum load of the equipment",
    explanation: "Article 625 treats EVSE loads as continuous: overcurrent protection for feeders and branch circuits supplying electric vehicle supply equipment must be rated not less than 125% of the maximum load of the equipment (625.41/625.42).",
    nec_article: "625.41",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["EV charging", "EVSE", "continuous load", "625"],
    lookup_path: {
      index_keywords: ["Electric vehicle supply equipment", "EV charging, overcurrent protection"],
      index_entry: "Electric vehicle supply equipment — overcurrent protection → 625.41",
      article_or_table: "625.41",
      what_to_look_for: "Read the rule — continuous load, OCPD at 125% of maximum load"
    }
  },
  {
    id: "680-002",
    question: "GFCI protection is required for which pool pump motors?",
    choices: [
      "Pool pump motors connected to single-phase, 120V through 240V branch circuits, whether cord-and-plug-connected or hardwired",
      "Only cord-and-plug-connected pump motors",
      "Only pump motors on 120V circuits",
      "Only pump motors installed outdoors"
    ],
    correct_answer: "Pool pump motors connected to single-phase, 120V through 240V branch circuits, whether cord-and-plug-connected or hardwired",
    explanation: "NEC 680.21(C) requires GFCI protection for outlets supplying pool pump motors connected to single-phase, 120V through 240V branch circuits, regardless of whether they are cord-and-plug-connected or direct (hardwired) connections.",
    nec_article: "680.21(C)",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["pools", "GFCI", "pump motors", "680.21"],
    lookup_path: {
      index_keywords: ["Swimming pools, pump motors", "GFCI, pool equipment"],
      index_entry: "Swimming pools — motors, GFCI protection → 680.21(C)",
      article_or_table: "680.21(C)",
      what_to_look_for: "Read (C) — single-phase 120V–240V pump motors require GFCI, hardwired or cord-connected"
    }
  },
  {
    id: "690-002",
    question: "PV system circuits installed on or in buildings must include a rapid shutdown function. Per the general rule, controlled conductors outside the array boundary must be reduced to 30 volts or less within how many seconds of rapid shutdown initiation?",
    choices: ["30 seconds", "10 seconds", "60 seconds", "5 seconds"],
    correct_answer: "30 seconds",
    explanation: "NEC 690.12 requires rapid shutdown for PV system circuits on or in buildings. Controlled conductors located outside the array boundary (more than 1 ft from the array) must be limited to not more than 30 volts within 30 seconds of rapid shutdown initiation.",
    nec_article: "690.12",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["solar", "PV", "rapid shutdown", "690.12"],
    lookup_path: {
      index_keywords: ["Photovoltaic systems, rapid shutdown", "Rapid shutdown, PV"],
      index_entry: "Solar photovoltaic systems — rapid shutdown → 690.12",
      article_or_table: "690.12",
      what_to_look_for: "Read the limits — outside the array boundary: 30 volts within 30 seconds"
    }
  },
  {
    id: "700-002",
    question: "Emergency systems must have power available within how many seconds after failure of the normal supply?",
    choices: ["10 seconds", "60 seconds", "30 seconds", "5 seconds"],
    correct_answer: "10 seconds",
    explanation: "NEC 700.12 requires emergency system power to be available within 10 seconds of failure of the normal supply. (Legally required standby systems under Article 701 have 60 seconds.)",
    nec_article: "700.12",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "journeyman",
    tags: ["emergency systems", "transfer time", "700.12"],
    lookup_path: {
      index_keywords: ["Emergency systems, sources of power", "Transfer time, emergency"],
      index_entry: "Emergency systems — general requirements, sources → 700.12",
      article_or_table: "700.12",
      what_to_look_for: "Read the rule — power available within 10 seconds; compare Article 701's 60 seconds"
    }
  },
  {
    id: "702-001",
    question: "For optional standby systems, transfer equipment is required primarily to:",
    choices: [
      "Prevent the inadvertent interconnection of the normal and alternate sources of supply",
      "Increase the available fault current",
      "Provide surge protection for the generator",
      "Allow both sources to operate in parallel at all times"
    ],
    correct_answer: "Prevent the inadvertent interconnection of the normal and alternate sources of supply",
    explanation: "NEC 702.5 requires transfer equipment for optional standby systems, suitable for the intended use and designed and installed so as to prevent the inadvertent interconnection of normal and alternate sources of supply — protecting utility line workers from backfeed.",
    nec_article: "702.5",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["standby systems", "transfer equipment", "generators", "702.5"],
    lookup_path: {
      index_keywords: ["Optional standby systems, transfer equipment", "Transfer switches"],
      index_entry: "Optional standby systems — transfer equipment → 702.5",
      article_or_table: "702.5",
      what_to_look_for: "Read the rule — prevent inadvertent interconnection of normal and alternate sources"
    }
  },
  {
    id: "706-001",
    question: "An energy storage system (ESS) must have a disconnecting means that is:",
    choices: [
      "Readily accessible and located within sight of the ESS, or capable of being locked in the open position where not within sight",
      "Accessible only to the utility",
      "Located at the service equipment only",
      "Automatic with no manual operation permitted"
    ],
    correct_answer: "Readily accessible and located within sight of the ESS, or capable of being locked in the open position where not within sight",
    explanation: "NEC 706.15 requires a disconnecting means for the ESS that is readily accessible and located within sight of the equipment; remote disconnects must be lockable in the open position and marked with their location.",
    nec_article: "706.15",
    nec_versions: ["2017", "2020", "2023", "2026"],
    difficulty: "master",
    tags: ["energy storage", "ESS", "disconnecting means", "706.15"],
    lookup_path: {
      index_keywords: ["Energy storage systems, disconnecting means", "Batteries, disconnects"],
      index_entry: "Energy storage systems — disconnecting means → 706.15",
      article_or_table: "706.15",
      what_to_look_for: "Read the rule — readily accessible, within sight, or lockable open if remote"
    }
  },
];

// ---------------------------------------------------------------------------
// Random selection with "freshness" memory
//
// Every exam/quiz attempt should feel new. We use an unbiased Fisher–Yates
// shuffle (Array.prototype.sort with a random comparator is biased) and we
// remember recently served question IDs in localStorage so consecutive
// attempts prioritize questions the user has NOT seen recently. Once the
// whole pool has been seen, the memory naturally cycles.
// ---------------------------------------------------------------------------

const RECENT_QUESTIONS_KEY = "cc_recent_question_ids";
const RECENT_QUESTIONS_LIMIT = 150;

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRecentQuestionIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_QUESTIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function markQuestionsAsSeen(ids: string[]): void {
  try {
    const merged = [...ids, ...getRecentQuestionIds().filter(id => !ids.includes(id))];
    localStorage.setItem(RECENT_QUESTIONS_KEY, JSON.stringify(merged.slice(0, RECENT_QUESTIONS_LIMIT)));
  } catch {
    // localStorage unavailable (private mode, SSR) — selection still works, just without memory
  }
}

export function getRandomQuestions(count: number, difficulty?: QuestionCard["difficulty"], version?: string): QuestionCard[] {
  let pool = difficulty ? questionBank.filter(q => q.difficulty === difficulty) : [...questionBank];
  if (version && version !== "all") {
    pool = pool.filter(q => q.nec_versions.includes(version as "2017" | "2020" | "2023" | "2026"));
  }

  const recent = new Set(getRecentQuestionIds());
  const unseen = pool.filter(q => !recent.has(q.id));
  const seen = pool.filter(q => recent.has(q.id));

  // Prefer questions the user hasn't seen recently, then fall back to seen ones
  const picked = [...shuffle(unseen), ...shuffle(seen)].slice(0, Math.min(count, pool.length));
  markQuestionsAsSeen(picked.map(q => q.id));

  // Final shuffle so unseen/seen questions are interleaved in random order
  return shuffle(picked);
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
