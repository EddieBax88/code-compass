/**
 * Code Compass — NEC 2026 Question Bank
 * Design: Industrial Control Panel aesthetic
 * Data Model: { id, question, choices[], correct_answer, explanation, nec_article, difficulty, tags[] }
 */

export interface QuestionCard {
  id: string;
  question: string;
  choices: string[];
  correct_answer: string;
  explanation: string;
  nec_article: string;
  difficulty: "journeyman" | "master" | "inspector";
  tags: string[];
}

export const questionBank: QuestionCard[] = [
  {
    id: "310-001",
    question: "What is the allowable ampacity of a 3/0 AWG copper THWN-2 conductor installed in a raceway containing three current-carrying conductors at an ambient temperature of 30°C?",
    choices: ["200 amps", "225 amps", "250 amps", "175 amps"],
    correct_answer: "225 amps",
    explanation: "Per Table 310.16, a 3/0 AWG copper conductor with 90°C rated insulation (THWN-2) has an ampacity of 225A with not more than three current-carrying conductors at 30°C ambient.",
    nec_article: "Table 310.16",
    difficulty: "journeyman",
    tags: ["ampacity", "conductors", "raceway", "THWN-2"]
  },
  {
    id: "430-001",
    question: "What is the maximum percentage of full-load current rating used to size branch-circuit short-circuit and ground-fault protection for a non-time-delay fuse protecting a single-phase motor?",
    choices: ["150%", "200%", "250%", "300%"],
    correct_answer: "300%",
    explanation: "Table 430.52(C)(1) specifies a maximum of 300% of motor FLC for non-time-delay fuses. This can increase to 400% if the motor cannot start at 300%.",
    nec_article: "Table 430.52(C)(1)",
    difficulty: "journeyman",
    tags: ["motors", "overcurrent", "fuses", "branch-circuit"]
  },
  {
    id: "250-001",
    question: "What is the minimum size copper grounding electrode conductor required for a service supplied by 4/0 AWG copper ungrounded service-entrance conductors?",
    choices: ["4 AWG", "2 AWG", "1/0 AWG", "6 AWG"],
    correct_answer: "2 AWG",
    explanation: "Table 250.66 requires a minimum 2 AWG copper grounding electrode conductor when service-entrance conductors are sized 3/0 through 250 kcmil copper.",
    nec_article: "Table 250.66",
    difficulty: "journeyman",
    tags: ["grounding", "service", "electrode conductor"]
  },
  {
    id: "210-001",
    question: "What is the minimum number of 20-ampere small-appliance branch circuits required for a dwelling unit kitchen?",
    choices: ["One", "Two", "Three", "Four"],
    correct_answer: "Two",
    explanation: "NEC 210.11(C)(1) requires at least two 20-ampere small-appliance branch circuits to serve receptacle outlets in the kitchen, pantry, dining room, and similar areas.",
    nec_article: "210.11(C)(1)",
    difficulty: "journeyman",
    tags: ["dwelling", "kitchen", "branch circuits", "receptacles"]
  },
  {
    id: "450-001",
    question: "What is the maximum overcurrent protection rating for the primary of a transformer (600V or less) with a primary current of 9 amperes or more, when there is no secondary protection?",
    choices: ["125%", "150%", "167%", "200%"],
    correct_answer: "125%",
    explanation: "NEC 450.3(B) requires primary-only overcurrent protection for transformers rated 600V or less with primary current of 9A or more to be set at not more than 125% of rated primary current.",
    nec_article: "450.3(B)",
    difficulty: "master",
    tags: ["transformers", "overcurrent", "primary protection"]
  },
  {
    id: "500-001",
    question: "What is the classification of a location where ignitable concentrations of flammable gases are present continuously under normal operating conditions?",
    choices: ["Class I, Division 1", "Class I, Division 2", "Class II, Division 1", "Zone 0"],
    correct_answer: "Class I, Division 1",
    explanation: "NEC 500.5(B)(1) defines Class I, Division 1 as locations where ignitable concentrations of flammable gases or vapors can exist under normal operating conditions.",
    nec_article: "500.5(B)(1)",
    difficulty: "master",
    tags: ["hazardous locations", "classification", "flammable gases"]
  },
  {
    id: "690-001",
    question: "What is the maximum permitted system voltage for a photovoltaic (PV) system installed in a one-family dwelling?",
    choices: ["300 volts", "480 volts", "600 volts", "1000 volts"],
    correct_answer: "600 volts",
    explanation: "NEC 690.7(2) limits the maximum DC system voltage for PV systems on one- and two-family dwellings to 600 volts.",
    nec_article: "690.7(2)",
    difficulty: "master",
    tags: ["solar", "photovoltaic", "voltage", "dwelling"]
  },
  {
    id: "314-001",
    question: "What is the maximum number of 10 AWG conductors permitted in a 4 inch x 1½ inch square box?",
    choices: ["6", "7", "8", "9"],
    correct_answer: "8",
    explanation: "Table 314.16(A)(2) permits a maximum of 8 conductors of 10 AWG in a 4 x 1½ inch square metal box (21.0 cubic inches volume).",
    nec_article: "Table 314.16(A)(2)",
    difficulty: "journeyman",
    tags: ["box fill", "conductors", "square box"]
  },
  {
    id: "240-001",
    question: "What is the standard ampere rating for an overcurrent device immediately above 800 amperes?",
    choices: ["850 amperes", "900 amperes", "1000 amperes", "1200 amperes"],
    correct_answer: "1000 amperes",
    explanation: "Table 240.6(A) lists 1000 amperes as the next standard rating above 800 amperes for fuses and inverse time circuit breakers.",
    nec_article: "Table 240.6(A)",
    difficulty: "journeyman",
    tags: ["overcurrent", "standard ratings", "circuit breakers"]
  },
  {
    id: "680-001",
    question: "What is the minimum required depth for a wet-niche luminaire installed in a permanently installed swimming pool?",
    choices: ["12 inches", "18 inches", "24 inches", "4 inches"],
    correct_answer: "18 inches",
    explanation: "NEC 680.23(A)(5) requires the top of the luminaire lens to be installed at least 18 inches below the normal water level of the pool.",
    nec_article: "680.23(A)(5)",
    difficulty: "master",
    tags: ["swimming pool", "luminaire", "wet-niche", "depth"]
  },
  {
    id: "230-001",
    question: "What is the minimum clearance above a residential driveway for overhead service-drop conductors not exceeding 600 volts?",
    choices: ["10 feet", "12 feet", "15 feet", "18 feet"],
    correct_answer: "12 feet",
    explanation: "NEC 230.24(B)(1) requires a minimum clearance of 12 feet above residential driveways for service-drop conductors not exceeding 600 volts.",
    nec_article: "230.24(B)(1)",
    difficulty: "journeyman",
    tags: ["service drop", "clearance", "driveway", "overhead"]
  },
  {
    id: "210-002",
    question: "What is the maximum continuous load permitted on a 20-ampere branch circuit?",
    choices: ["16 amperes", "18 amperes", "20 amperes", "15 amperes"],
    correct_answer: "16 amperes",
    explanation: "NEC 210.20(A) requires that branch-circuit conductors have an ampacity not less than the maximum load, and continuous loads shall not exceed 80% of the branch-circuit rating (20A × 80% = 16A).",
    nec_article: "210.20(A)",
    difficulty: "journeyman",
    tags: ["continuous load", "branch circuit", "80% rule"]
  },
  {
    id: "430-002",
    question: "What is the maximum permitted setting for an inverse time circuit breaker protecting a 3-phase, 460-volt, 50-hp squirrel-cage induction motor?",
    choices: ["150 amps", "175 amps", "195 amps", "250 amps"],
    correct_answer: "195 amps",
    explanation: "Per Table 430.250, a 50-hp 460V motor has an FLC of 65A. Table 430.52(C)(1) allows 250% for inverse time breakers (65A × 2.5 = 162.5A). The next standard size up per 240.6(A) is 175A, but if the motor cannot start, it can go to the next standard size. The maximum is 300% = 195A.",
    nec_article: "Table 430.52(C)(1)",
    difficulty: "master",
    tags: ["motors", "circuit breaker", "3-phase", "overcurrent"]
  },
  {
    id: "310-002",
    question: "What is the ampacity adjustment factor for 4 to 6 current-carrying conductors installed in a single raceway?",
    choices: ["70%", "80%", "60%", "50%"],
    correct_answer: "80%",
    explanation: "Table 310.15(C)(1) requires an adjustment factor of 80% when 4 to 6 current-carrying conductors are installed in a single raceway or cable.",
    nec_article: "Table 310.15(C)(1)",
    difficulty: "journeyman",
    tags: ["ampacity", "adjustment", "raceway", "derating"]
  },
  {
    id: "250-002",
    question: "What is the minimum size copper main bonding jumper required for a service supplied by 500 kcmil copper ungrounded conductors?",
    choices: ["2 AWG", "1/0 AWG", "2/0 AWG", "3/0 AWG"],
    correct_answer: "1/0 AWG",
    explanation: "Table 250.66 requires a minimum 1/0 AWG copper main bonding jumper for service conductors sized over 250 kcmil through 500 kcmil copper.",
    nec_article: "Table 250.66",
    difficulty: "master",
    tags: ["bonding", "service", "main bonding jumper"]
  }
];

export function getRandomQuestions(count: number, difficulty?: QuestionCard["difficulty"]): QuestionCard[] {
  let pool = [...questionBank];
  if (difficulty) {
    pool = pool.filter(q => q.difficulty === difficulty);
  }
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function searchQuestions(query: string): QuestionCard[] {
  const lower = query.toLowerCase();
  return questionBank.filter(q =>
    q.question.toLowerCase().includes(lower) ||
    q.nec_article.toLowerCase().includes(lower) ||
    q.tags.some(t => t.toLowerCase().includes(lower)) ||
    q.explanation.toLowerCase().includes(lower)
  );
}
