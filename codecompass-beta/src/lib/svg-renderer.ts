import type { L5XRung, L5XToken } from "./l5x-parser";

const SVG_WIDTH = 860;
const RAIL_X_LEFT = 50;
const RAIL_X_RIGHT = SVG_WIDTH - 50;
const RAIL_WIDTH = RAIL_X_RIGHT - RAIL_X_LEFT;
const RUNG_HEIGHT = 80;
const TOP_PADDING = 60;
const BOTTOM_PADDING = 40;
const CONTACT_W = 60;
const COIL_W = 50;
const BOX_W = 90;
const BOX_H = 44;
const NODE_GAP = 12;
const RAIL_STROKE = 3;
const WIRE_STROKE = 2;
const FONT = "'JetBrains Mono', 'Fira Code', monospace";
const FONT_SIZE = 10;
const TAG_FONT_SIZE = 9;
const RUNG_NUM_FONT = 11;
const COMMENT_FONT = 10;

const COLOR_RAIL = "#f97316";
const COLOR_WIRE = "#a1a1aa";
const COLOR_CONTACT = "#e4e4e7";
const COLOR_COIL = "#e4e4e7";
const COLOR_BOX = "#27272a";
const COLOR_BOX_STROKE = "#f97316";
const COLOR_TEXT = "#fafafa";
const COLOR_TAG = "#d4d4d8";
const COLOR_COMMENT = "#71717a";
const COLOR_BG = "#09090b";
const COLOR_RUNG_NUM = "#f97316";
const COLOR_TRUE = "#22c55e";

const CONTACTS = new Set([
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
const COILS = new Set(["OTE", "OTL", "OTU", "ONS", "OSR", "OSF"]);
const BOX_INSTRUCTIONS = new Set([
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
  "DINT_TO_REAL",
  "PID",
  "AOI",
  "PCCC",
  "CIP",
]);

function escapeXml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function nodeWidth(instruction: string): number {
  if (instruction === "BST" || instruction === "NXB" || instruction === "BND") return 40;
  if (CONTACTS.has(instruction) && !BOX_INSTRUCTIONS.has(instruction)) return CONTACT_W;
  if (COILS.has(instruction)) return COIL_W;
  return BOX_W;
}

function svgContact(
  x: number,
  y: number,
  instruction: string,
  tag: string,
  isLive: boolean,
): string {
  const cy = y;
  const midX = x + CONTACT_W / 2;
  const isNormallyClosed = instruction === "XIO";
  const slash = isNormallyClosed
    ? `<line x1="${midX - 8}" y1="${cy + 14}" x2="${midX + 8}" y2="${cy - 14}" stroke="${COLOR_CONTACT}" stroke-width="2"/>`
    : "";
  const pulseClass = isLive ? ' class="live-pulse"' : "";
  return `
    <g${pulseClass}>
      <line x1="${x}" y1="${cy}" x2="${midX - 12}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <line x1="${midX - 12}" y1="${cy - 14}" x2="${midX - 12}" y2="${cy + 14}" stroke="${COLOR_CONTACT}" stroke-width="2.5"/>
      <line x1="${midX + 12}" y1="${cy - 14}" x2="${midX + 12}" y2="${cy + 14}" stroke="${COLOR_CONTACT}" stroke-width="2.5"/>
      ${slash}
      <line x1="${midX + 12}" y1="${cy}" x2="${x + CONTACT_W}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <text x="${midX}" y="${cy - 20}" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="${FONT_SIZE}" font-weight="700">${escapeXml(instruction)}</text>
      <text x="${midX}" y="${cy + 28}" text-anchor="middle" fill="${COLOR_TAG}" font-family="${FONT}" font-size="${TAG_FONT_SIZE}">${escapeXml(tag || "")}</text>
    </g>`;
}

function svgCoil(x: number, y: number, instruction: string, tag: string, isLive: boolean): string {
  const cy = y;
  const midX = x + COIL_W / 2;
  const r = 14;
  const leftArc = `M ${midX - 2} ${cy - r} A ${r} ${r} 0 0 0 ${midX - 2} ${cy + r}`;
  const rightArc = `M ${midX + 2} ${cy - r} A ${r} ${r} 0 0 1 ${midX + 2} ${cy + r}`;
  let latchIndicator = "";
  if (instruction === "OTL") {
    latchIndicator = `<text x="${midX}" y="${cy + 4}" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="10" font-weight="700">L</text>`;
  } else if (instruction === "OTU") {
    latchIndicator = `<text x="${midX}" y="${cy + 4}" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="10" font-weight="700">U</text>`;
  }
  const pulseClass = isLive ? ' class="live-pulse"' : "";
  return `
    <g${pulseClass}>
      <line x1="${x}" y1="${cy}" x2="${midX - r - 2}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <path d="${leftArc}" fill="none" stroke="${COLOR_COIL}" stroke-width="2.5"/>
      <path d="${rightArc}" fill="none" stroke="${COLOR_COIL}" stroke-width="2.5"/>
      ${latchIndicator}
      <line x1="${midX + r + 2}" y1="${cy}" x2="${x + COIL_W}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <text x="${midX}" y="${cy - 20}" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="${FONT_SIZE}" font-weight="700">${escapeXml(instruction)}</text>
      <text x="${midX}" y="${cy + 28}" text-anchor="middle" fill="${COLOR_TAG}" font-family="${FONT}" font-size="${TAG_FONT_SIZE}">${escapeXml(tag || "")}</text>
    </g>`;
}

function svgBox(
  x: number,
  y: number,
  instruction: string,
  args: string[],
  isLive: boolean,
): string {
  const cy = y;
  const bx = x;
  const by = cy - BOX_H / 2;
  const midX = bx + BOX_W / 2;
  const argLines: string[] = [];
  if (args.length > 0) {
    const line1 = args.slice(0, 2).join(", ");
    argLines.push(line1);
    if (args.length > 2) {
      argLines.push(args.slice(2, 4).join(", "));
    }
  }
  const argsText = argLines
    .map(
      (line, i) =>
        `<text x="${midX}" y="${cy + 2 + (i - (argLines.length - 1) / 2) * 12}" text-anchor="middle" fill="${COLOR_TAG}" font-family="${FONT}" font-size="${TAG_FONT_SIZE}">${escapeXml(line)}</text>`,
    )
    .join("\n");
  const pulseClass = isLive ? ' class="live-pulse"' : "";
  return `
    <g${pulseClass}>
      <line x1="${x}" y1="${cy}" x2="${bx}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <rect x="${bx}" y="${by}" width="${BOX_W}" height="${BOX_H}" rx="4" fill="${COLOR_BOX}" stroke="${COLOR_BOX_STROKE}" stroke-width="1.5"/>
      <text x="${midX}" y="${by + 13}" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="${FONT_SIZE}" font-weight="700">${escapeXml(instruction)}</text>
      ${argsText}
      <line x1="${bx + BOX_W}" y1="${cy}" x2="${bx + BOX_W}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
    </g>`;
}

function svgBranchKeyword(x: number, y: number, keyword: string): string {
  const cy = y;
  const midX = x + 20;
  return `
    <g>
      <line x1="${x}" y1="${cy}" x2="${midX - 8}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
      <rect x="${midX - 8}" y="${cy - 10}" width="16" height="20" rx="2" fill="none" stroke="${COLOR_COMMENT}" stroke-width="1" stroke-dasharray="3,2"/>
      <text x="${midX}" y="${cy + 3}" text-anchor="middle" fill="${COLOR_COMMENT}" font-family="${FONT}" font-size="7">${escapeXml(keyword)}</text>
      <line x1="${midX + 8}" y1="${cy}" x2="${midX + 28}" y2="${cy}" stroke="${COLOR_WIRE}" stroke-width="${WIRE_STROKE}"/>
    </g>`;
}

const LIVE_PULSE_CSS = `
  <style>
    @keyframes pulse-glow {
      0%, 100% { filter: drop-shadow(0 0 2px rgba(34, 197, 94, 0.4)); }
      50% { filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.8)); }
    }
    .live-pulse line, .live-pulse path, .live-pulse rect {
      stroke: ${COLOR_TRUE} !important;
      animation: pulse-glow 2s ease-in-out infinite;
    }
  </style>`;

export interface RenderOptions {
  title?: string;
  maxRungs?: number;
  liveTags?: Set<string>;
  metadata?: string;
}

export function renderLadderSVG(rungs: L5XRung[], options: RenderOptions = {}): string {
  const title = options.title || "Ladder Logic";
  const maxRungs = options.maxRungs || 100; // CRITICAL: Default limit to prevent browser truncation
  const liveTags = options.liveTags || new Set<string>();
  const metadata = options.metadata || null;

  // Enforce hard limit
  const MAX_RUNGS = 500;
  const effectiveMaxRungs = Math.min(maxRungs, MAX_RUNGS);
  const renderRungs = effectiveMaxRungs > 0 ? rungs.slice(0, effectiveMaxRungs) : rungs.slice(0, MAX_RUNGS);
  const numRungs = renderRungs.length;

  if (numRungs === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="120" viewBox="0 0 ${SVG_WIDTH} 120">
  <rect width="100%" height="100%" fill="${COLOR_BG}"/>
  <text x="${SVG_WIDTH / 2}" y="60" text-anchor="middle" fill="${COLOR_COMMENT}" font-family="${FONT}" font-size="14">No rungs to render</text>
</svg>`;
  }

  const svgHeight = TOP_PADDING + numRungs * RUNG_HEIGHT + BOTTOM_PADDING;
  const railTop = TOP_PADDING;
  const railBottom = TOP_PADDING + numRungs * RUNG_HEIGHT;
  const usableWidth = RAIL_WIDTH - 20;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${svgHeight}" viewBox="0 0 ${SVG_WIDTH} ${svgHeight}" font-family="${FONT}">
  ${LIVE_PULSE_CSS}
  <rect width="100%" height="100%" fill="${COLOR_BG}"/>
  <text x="${SVG_WIDTH / 2}" y="22" text-anchor="middle" fill="${COLOR_TEXT}" font-family="${FONT}" font-size="14" font-weight="700" letter-spacing="1">${escapeXml(title)}</text>
  <text x="${SVG_WIDTH / 2}" y="38" text-anchor="middle" fill="${COLOR_COMMENT}" font-family="${FONT}" font-size="9">${numRungs} rung${numRungs === 1 ? "" : "s"}${metadata ? " — " + escapeXml(metadata) : ""}</text>
  <line x1="${RAIL_X_LEFT}" y1="${railTop}" x2="${RAIL_X_LEFT}" y2="${railBottom}" stroke="${COLOR_RAIL}" stroke-width="${RAIL_STROKE}"/>
  <text x="${RAIL_X_LEFT}" y="${railTop - 8}" text-anchor="middle" fill="${COLOR_RAIL}" font-family="${FONT}" font-size="10" font-weight="700">L1</text>
  <line x1="${RAIL_X_RIGHT}" y1="${railTop}" x2="${RAIL_X_RIGHT}" y2="${railBottom}" stroke="${COLOR_RAIL}" stroke-width="${RAIL_STROKE}"/>
  <text x="${RAIL_X_RIGHT}" y="${railTop - 8}" text-anchor="middle" fill="${COLOR_RAIL}" font-family="${FONT}" font-size="10" font-weight="700">L2</text>
`;

  for (let i = 0; i < numRungs; i++) {
    const rung = renderRungs[i];
    const rungY = TOP_PADDING + i * RUNG_HEIGHT + RUNG_HEIGHT / 2;
    const rungNum = rung.index;

    svg += `
  <text x="${RAIL_X_LEFT - 22}" y="${rungY + 4}" text-anchor="middle" fill="${COLOR_RUNG_NUM}" font-family="${FONT}" font-size="${RUNG_NUM_FONT}" font-weight="700">${rungNum}</text>`;

    if (rung.comment) {
      svg += `
  <text x="${RAIL_X_LEFT + 14}" y="${rungY - 26}" fill="${COLOR_COMMENT}" font-family="${FONT}" font-size="${COMMENT_FONT}" font-style="italic">// ${escapeXml(rung.comment)}</text>`;
    }

    svg += `
  <line x1="${RAIL_X_LEFT}" y1="${rungY}" x2="${RAIL_X_RIGHT}" y2="${rungY}" stroke="${COLOR_WIRE}" stroke-width="1" stroke-dasharray="2,4" opacity="0.3"/>`;

    const tokens = rung.tokens;

    if (tokens.length === 0) {
      svg += `
  <text x="${SVG_WIDTH / 2}" y="${rungY + 4}" text-anchor="middle" fill="${COLOR_COMMENT}" font-family="${FONT}" font-size="9">(empty rung)</text>`;
    } else {
      const totalNodeWidth =
        tokens.reduce((sum, t) => sum + nodeWidth(t.type) + NODE_GAP, 0) - NODE_GAP;
      const startX = RAIL_X_LEFT + 10;
      const availableSpace = usableWidth - totalNodeWidth;
      const gap = tokens.length > 1 ? Math.max(NODE_GAP, availableSpace / (tokens.length + 1)) : 0;
      let cursorX = startX + (tokens.length > 1 ? gap / 2 : (usableWidth - totalNodeWidth) / 2);

      for (let t = 0; t < tokens.length; t++) {
        const token = tokens[t];
        const instr = token.type;
        const tag = token.tag || "";
        const isLive = liveTags.has(tag);
        const args = token.args || [];

        if (instr === "BST" || instr === "NXB" || instr === "BND") {
          svg += svgBranchKeyword(cursorX, rungY, instr);
          cursorX += 40 + (t < tokens.length - 1 ? gap : 0);
        } else if (CONTACTS.has(instr) && !BOX_INSTRUCTIONS.has(instr) && !COILS.has(instr)) {
          svg += svgContact(cursorX, rungY, instr, tag, isLive);
          cursorX += CONTACT_W + (t < tokens.length - 1 ? gap : 0);
        } else if (COILS.has(instr) && !BOX_INSTRUCTIONS.has(instr)) {
          svg += svgCoil(cursorX, rungY, instr, tag, isLive);
          cursorX += COIL_W + (t < tokens.length - 1 ? gap : 0);
        } else {
          svg += svgBox(cursorX, rungY, instr, args.length > 0 ? args : tag ? [tag] : [], isLive);
          cursorX += BOX_W + (t < tokens.length - 1 ? gap : 0);
        }
      }
    }

    if (i < numRungs - 1) {
      svg += `
  <line x1="${RAIL_X_LEFT + 5}" y1="${rungY + RUNG_HEIGHT / 2}" x2="${RAIL_X_RIGHT - 5}" y2="${rungY + RUNG_HEIGHT / 2}" stroke="${COLOR_COMMENT}" stroke-width="0.5" opacity="0.15"/>`;
    }
  }

  svg += `
</svg>`;

  return svg;
}
