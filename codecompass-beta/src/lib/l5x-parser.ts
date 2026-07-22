import { XMLParser } from "fast-xml-parser";
import { createHash } from "crypto";

export interface L5XToken {
  type: string;
  tag: string | null;
  args?: string[];
  id: string;
  x: number;
  y: number;
}

export interface L5XRung {
  index: number;
  comment: string | null;
  logic_text: string | null;
  tokens: L5XToken[];
  warnings?: Array<{ type: string; instruction: string; tag: string; message: string }>;
  rung_sha256: string | null;
}

export interface L5XRoutine {
  name: string;
  type: string;
  rungs: L5XRung[];
  rung_count: number;
}

export interface L5XMetadata {
  project_name: string;
  version: string;
  l5x_hash: string;
  controller: {
    name: string | null;
    processorType: string | null;
    majorRev: string | null;
    minorRev: string | null;
  } | null;
  programs: Array<{ name: string | null; mainRoutineName: string | null }>;
  generated_at: string;
}

export interface L5XParseResult {
  metadata: L5XMetadata;
  routines: L5XRoutine[];
  routine: L5XRoutine;
  tag_inventory: string[];
  validation_summary: {
    total_rungs: number;
    total_warnings: number;
    tags_defined: number;
  };
}

const VALID_CONTACTS = new Set([
  "XIC",
  "XIO",
  "EQU",
  "NEQ",
  "LES",
  "GRT",
  "LEQ",
  "GEQ",
  "LIM",
  "MEQ",
  "FSC",
  "FSO",
  "FSU",
  "AFI",
  "ONS",
  "OSF",
  "OSR",
]);

const VALID_OUTPUTS = new Set(["OTE", "OTL", "OTU"]);

const VALID_FUNCTION_BLOCKS = new Set([
  "TON",
  "TOF",
  "RTO",
  "CTU",
  "CTD",
  "RES",
  "MOV",
  "MVM",
  "ADD",
  "SUB",
  "MUL",
  "DIV",
  "MOD",
  "CPT",
  "FSC",
  "JSR",
  "SBR",
  "RET",
  "FOR",
  "NXT",
  "BRK",
  "MSG",
  "GSV",
  "SSV",
  "SCL",
  "FAL",
  "FLL",
  "BTD",
  "CPS",
  "COP",
  "SWP",
  "PID",
  "AOI",
]);

const BRANCH_KEYWORDS = new Set(["BST", "NXB", "BND"]);
const ALL_VALID = new Set([
  ...VALID_CONTACTS,
  ...VALID_OUTPUTS,
  ...VALID_FUNCTION_BLOCKS,
  ...BRANCH_KEYWORDS,
]);

function tokenizeRungText(text: string | null): Array<{ instruction: string; args: string[] }> {
  if (!text) return [];
  const tokens: Array<{ instruction: string; args: string[] }> = [];
  const cleaned = text.replace(/;+\s*$/, "").trim();
  const pattern = /([A-Z_][A-Z_0-9]*)\s*(?:\(([^)]*)\))?/g;
  let match;
  while ((match = pattern.exec(cleaned)) !== null) {
    const instr = match[1];
    const args = match[2]
      ? match[2]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    if (ALL_VALID.has(instr)) {
      tokens.push({ instruction: instr, args });
    }
  }
  return tokens;
}

function extractTags(controller: any): Set<string> {
  const tags = new Set<string>();
  const tagList = controller?.Tags?.Tag;
  if (tagList) {
    const arr = Array.isArray(tagList) ? tagList : [tagList];
    for (const tag of arr) {
      const name = tag.attributes?.Name;
      if (name) tags.add(name);
    }
  }
  const programs = controller?.Programs?.Program;
  if (programs) {
    const progArr = Array.isArray(programs) ? programs : [programs];
    for (const prog of progArr) {
      const progTags = prog?.Tags?.Tag;
      if (progTags) {
        const pArr = Array.isArray(progTags) ? progTags : [progTags];
        for (const tag of pArr) {
          const name = tag.attributes?.Name;
          if (name) tags.add(name);
        }
      }
    }
  }
  return tags;
}

function validateTokens(
  tokens: Array<{ instruction: string; args: string[] }>,
  knownTags: Set<string>,
): Array<{ type: string; instruction: string; tag: string; message: string }> {
  const warnings: Array<{ type: string; instruction: string; tag: string; message: string }> = [];
  for (const token of tokens) {
    const tag = token.args[0];
    if (tag && knownTags.size > 0 && !knownTags.has(tag)) {
      if (!tag.includes(":") && !tag.includes(".")) {
        warnings.push({
          type: "TAG_NOT_FOUND",
          instruction: token.instruction,
          tag: tag,
          message: `Tag '${tag}' referenced by ${token.instruction} not found in <Tags> collection`,
        });
      }
    }
  }
  return warnings;
}

function computeHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

function assignCoordinates(
  tokens: Array<{ instruction: string; args: string[] }>,
  baseX = 10,
  spacing = 40,
): L5XToken[] {
  let cursorX = baseX;
  return tokens.map((token, i) => {
    const id = `t${i + 1}`;
    const x = cursorX;
    if (BRANCH_KEYWORDS.has(token.instruction)) cursorX += 30;
    else if (VALID_OUTPUTS.has(token.instruction)) cursorX += 40;
    else if (VALID_CONTACTS.has(token.instruction)) cursorX += 50;
    else cursorX += spacing;
    cursorX += 10;
    return {
      type: token.instruction,
      tag: token.args[0] || null,
      args: token.args.length > 1 ? token.args.slice(1) : undefined,
      id,
      x,
      y: 0,
    };
  });
}

export function parseL5X(fileBuffer: Buffer): L5XParseResult {
  // CRITICAL: Buffer size validation (prevent memory exhaustion)
  if (fileBuffer.length > 10 * 1024 * 1024) {
    throw new Error(`L5X file too large: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB exceeds 10 MB limit`);
  }

  const xmlString = fileBuffer.toString("utf-8");
  const l5xHash = computeHash(xmlString);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: "attributes",
    textNodeName: "text",
    parseAttributeValue: true,
    trimValues: true,
    // parseTrueNumberOnly removed in fast-xml-parser v5 — use numberParseOptions instead
    numberParseOptions: { leadingZeros: false, hex: true, skipLike: /\.[0-9]+$/ },
  });

  const parsed = parser.parse(xmlString);
  const controller = parsed.RSLogix5000Content?.Controller;

  const projectName = controller?.attributes?.Name || "Unknown";
  const version = parsed.RSLogix5000Content?.attributes?.TargetType
    ? `v${parsed.RSLogix5000Content.attributes.MajorRev || "?"}.${parsed.RSLogix5000Content.attributes.MinorRev || "?"}`
    : "unknown";

  const metadata: L5XMetadata = {
    project_name: projectName,
    version,
    l5x_hash: `sha256_${l5xHash}`,
    controller: controller
      ? {
          name: controller.attributes?.Name || null,
          processorType: controller.attributes?.ProcessorType || null,
          majorRev: controller.attributes?.MajorRev || null,
          minorRev: controller.attributes?.MinorRev || null,
        }
      : null,
    programs: [],
    generated_at: new Date().toISOString(),
  };

  const programs = controller?.Programs?.Program;
  if (programs) {
    const progArr = Array.isArray(programs) ? programs : [programs];
    metadata.programs = progArr.map((p: any) => ({
      name: p.attributes?.Name || null,
      mainRoutineName: p.attributes?.MainRoutineName || null,
    }));
  }

  const knownTags = extractTags(controller);
  const routines: L5XRoutine[] = [];

  const routineList = controller?.Routines?.Routine;
  if (routineList) {
    const routineArr = Array.isArray(routineList) ? routineList : [routineList];
    for (const routine of routineArr) {
      const routineName = routine.attributes?.Name || "Unknown";
      const routineType = routine.attributes?.Type || "LadderLogic";
      const rungs: L5XRung[] = [];

      const rungList = routine.Rung;
      if (rungList) {
        const rungArr = Array.isArray(rungList) ? rungList : [rungList];
        for (let i = 0; i < rungArr.length; i++) {
          const rung = rungArr[i];
          const logicText = typeof rung.Text === "string" ? rung.Text : rung.Text?.text || null;
          const comment =
            typeof rung.Comment === "string" ? rung.Comment : rung.Comment?.text || null;
          const tokens = tokenizeRungText(logicText);
          const warnings = validateTokens(tokens, knownTags);
          const coordTokens = assignCoordinates(tokens);

          rungs.push({
            index: rung.attributes?.Number !== undefined ? rung.attributes.Number : i,
            comment,
            logic_text: logicText,
            tokens: coordTokens,
            warnings: warnings.length > 0 ? warnings : undefined,
            rung_sha256: logicText ? `sha256_${computeHash(logicText)}` : null,
          });
        }
      }

      routines.push({
        name: routineName,
        type: routineType,
        rungs,
        rung_count: rungs.length,
      });
    }
  }

  return {
    metadata,
    routines,
    routine: routines.length > 0 ? routines[0] : { name: "No routines found", type: "empty", rungs: [], rung_count: 0 },
    tag_inventory: [...knownTags],
    validation_summary: {
      total_rungs: routines.reduce((s, r) => s + r.rung_count, 0),
      total_warnings: routines.reduce(
        (s, r) => s + r.rungs.reduce((ws, rn) => ws + (rn.warnings?.length || 0), 0),
        0,
      ),
      tags_defined: knownTags.size,
    },
  };
}
