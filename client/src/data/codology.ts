/**
 * Code Compass — Codeology Method
 *
 * The Codeology method (taught in IBEW/union apprenticeships) navigates the
 * NEC by its STRUCTURE via the Table of Contents instead of the index:
 *
 *   1. Classify the question:  PLAN (Ch.2) / BUILD (Ch.3) / USE (Ch.4)
 *      — Special occupancies/equipment/conditions (Ch.5–7) modify the first four,
 *        Communications (Ch.8) stands alone, Tables (Ch.9) support calculations.
 *   2. Open the Table of Contents → go to that chapter.
 *   3. Scan article titles → pick the article.
 *   4. Scan the article's section layout → read the section/table.
 *
 * Everything here is derived from the question's `nec_article`, so every
 * question in the bank automatically gets a Codeology path.
 */

export type CodologyCategory =
  | "FOUNDATION"   // 90, Ch.1 — introduction, definitions, general requirements
  | "PLAN"         // Ch.2 — wiring and protection
  | "BUILD"        // Ch.3 — wiring methods and materials
  | "USE"          // Ch.4 — equipment for general use
  | "SPECIAL"      // Ch.5–7 — special occupancies / equipment / conditions
  | "COMMUNICATIONS" // Ch.8
  | "TABLES";      // Ch.9

export interface CodologyPath {
  category: CodologyCategory;
  categoryHint: string;   // how to classify the question into this category
  chapterLabel: string;   // e.g. "Chapter 4 — Equipment for General Use"
  articleLabel: string;   // e.g. "Article 430 — Motors, Motor Circuits, and Controllers"
  target: string;         // the exact section/table to land on
}

const ARTICLE_TITLES: Record<number, string> = {
  90: "Introduction",
  100: "Definitions",
  110: "Requirements for Electrical Installations",
  200: "Use and Identification of Grounded Conductors",
  210: "Branch Circuits",
  215: "Feeders",
  220: "Branch-Circuit, Feeder, and Service Load Calculations",
  225: "Outside Branch Circuits and Feeders",
  230: "Services",
  240: "Overcurrent Protection",
  250: "Grounding and Bonding",
  300: "General Requirements for Wiring Methods and Materials",
  310: "Conductors for General Wiring",
  312: "Cabinets, Cutout Boxes, and Meter Socket Enclosures",
  314: "Outlet, Device, Pull, and Junction Boxes",
  334: "Nonmetallic-Sheathed Cable (Type NM)",
  358: "Electrical Metallic Tubing (Type EMT)",
  404: "Switches",
  406: "Receptacles, Cord Connectors, and Attachment Plugs",
  408: "Switchboards, Switchgear, and Panelboards",
  410: "Luminaires, Lampholders, and Lamps",
  422: "Appliances",
  424: "Fixed Electric Space-Heating Equipment",
  430: "Motors, Motor Circuits, and Controllers",
  440: "Air-Conditioning and Refrigerating Equipment",
  445: "Generators",
  450: "Transformers and Transformer Vaults",
  480: "Stationary Standby Batteries",
  500: "Hazardous (Classified) Locations",
  517: "Health Care Facilities",
  550: "Mobile Homes, Manufactured Homes, and Mobile Home Parks",
  590: "Temporary Installations",
  625: "Electric Vehicle Power Transfer Systems",
  680: "Swimming Pools, Fountains, and Similar Installations",
  690: "Solar Photovoltaic (PV) Systems",
  700: "Emergency Systems",
  702: "Optional Standby Systems",
  706: "Energy Storage Systems",
};

interface ChapterInfo {
  category: CodologyCategory;
  chapterLabel: string;
  categoryHint: string;
}

function chapterInfo(articleNum: number): ChapterInfo {
  if (articleNum === 90) {
    return {
      category: "FOUNDATION",
      chapterLabel: "Article 90 — Introduction (before Chapter 1)",
      categoryHint: "Questions about the NEC's purpose, scope, and enforcement live in Article 90, before Chapter 1.",
    };
  }
  const ch = Math.floor(articleNum / 100);
  switch (ch) {
    case 1:
      return {
        category: "FOUNDATION",
        chapterLabel: "Chapter 1 — General",
        categoryHint: "Definitions and rules that apply to ALL installations → Chapter 1.",
      };
    case 2:
      return {
        category: "PLAN",
        chapterLabel: "Chapter 2 — Wiring and Protection",
        categoryHint: "PLAN: designing the system — circuits, feeders, services, load calcs, overcurrent protection, grounding.",
      };
    case 3:
      return {
        category: "BUILD",
        chapterLabel: "Chapter 3 — Wiring Methods and Materials",
        categoryHint: "BUILD: physically installing it — conductors, cables, raceways, boxes, enclosures.",
      };
    case 4:
      return {
        category: "USE",
        chapterLabel: "Chapter 4 — Equipment for General Use",
        categoryHint: "USE: utilization equipment — switches, receptacles, luminaires, appliances, motors, HVAC, generators, transformers.",
      };
    case 5:
      return {
        category: "SPECIAL",
        chapterLabel: "Chapter 5 — Special Occupancies",
        categoryHint: "A special PLACE (hazardous location, health care, mobile home…) → Chapter 5. It modifies Chapters 1–4.",
      };
    case 6:
      return {
        category: "SPECIAL",
        chapterLabel: "Chapter 6 — Special Equipment",
        categoryHint: "Special EQUIPMENT (EV charging, pools, PV/solar…) → Chapter 6. It modifies Chapters 1–4.",
      };
    case 7:
      return {
        category: "SPECIAL",
        chapterLabel: "Chapter 7 — Special Conditions",
        categoryHint: "A special CONDITION (emergency power, standby, energy storage…) → Chapter 7. It modifies Chapters 1–4.",
      };
    case 8:
      return {
        category: "COMMUNICATIONS",
        chapterLabel: "Chapter 8 — Communications Systems",
        categoryHint: "Communications systems stand alone in Chapter 8 — other chapters apply only where referenced.",
      };
    default:
      return {
        category: "TABLES",
        chapterLabel: "Chapter 9 — Tables",
        categoryHint: "Conductor properties, conduit fill, and other calculation tables → Chapter 9.",
      };
  }
}

/** Parse the leading article number out of strings like "Table 430.52(C)(1)" or "210.8(A)(7)". */
function parseArticleNumber(necArticle: string): number | null {
  const m = necArticle.match(/(\d{2,3})/);
  return m ? parseInt(m[1], 10) : null;
}

export function getCodologyPath(necArticle: string): CodologyPath | null {
  const num = parseArticleNumber(necArticle);
  if (num === null) return null;
  const info = chapterInfo(num);
  const title = ARTICLE_TITLES[num];
  return {
    category: info.category,
    categoryHint: info.categoryHint,
    chapterLabel: info.chapterLabel,
    articleLabel: title ? `Article ${num} — ${title}` : `Article ${num}`,
    target: necArticle,
  };
}
