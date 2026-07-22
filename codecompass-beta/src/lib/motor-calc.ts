/**
 * Motor calculation engine + validation framework.
 *
 * Scope: covers the NEC 430 workflow taught in the "Motor Calculations" course —
 * FLA table lookup → branch-circuit conductor sizing → branch-circuit
 * short-circuit & ground-fault protection sizing → disconnect sizing.
 *
 * Design rules:
 *  - Every numeric FLA is a verbatim value from an NEC 430 table. Only the
 *    (HP, voltage, phase) rows listed below are supported; anything else
 *    returns `{ missing: true }` rather than being interpolated or invented.
 *  - Percentages are the maximum values from NEC 430.22, Table 430.52, and
 *    430.110(A). Multipliers are hard-coded so the reasoning is auditable.
 *  - Overload sizing (430.32) uses nameplate FLA, not table FLA, and is
 *    not part of this engine — it belongs to a nameplate-driven flow.
 *  - Feeder sizing per 430.24 is implemented for the "largest motor +
 *    sum of other motor FLAs" case, which is what the exam tests.
 *
 * Citations use bare NEC references (article.section) — edition is passed
 * through separately so the same math applies across 2017 / 2020 / 2023.
 */

export type Phase = 1 | 3;
export type NecEdition = "2017" | "2020" | "2023";

export type OcpDeviceType =
  | "nonTimeDelayFuse" // Table 430.52 — 300% max
  | "dualElementFuse" // Table 430.52 — 175% max
  | "instantaneousTripBreaker" // Table 430.52 — 800% max (adjustable, 1300% max per note)
  | "inverseTimeBreaker"; // Table 430.52 — 250% max

// -------------------------------------------------------------------
// FLA tables (NEC 430.248 single-phase, 430.250 three-phase).
// Values are verbatim from the NEC. Rows not listed below are not
// supported — the engine returns { missing: true } for those inputs
// rather than interpolating.
// -------------------------------------------------------------------

// NEC Table 430.248 — full-load current, single-phase AC motors (amps).
const FLA_SINGLE_PHASE: Record<string, Record<number, number>> = {
  // hp: { voltage: amps }
  "0.5": { 115: 9.8, 200: 5.6, 208: 5.4, 230: 4.9 },
  "0.75": { 115: 13.8, 200: 7.9, 208: 7.6, 230: 6.9 },
  "1": { 115: 16, 200: 9.2, 208: 8.8, 230: 8 },
  "1.5": { 115: 20, 200: 11.5, 208: 11, 230: 10 },
  "2": { 115: 24, 200: 13.8, 208: 13.2, 230: 12 },
  "3": { 115: 34, 200: 19.6, 208: 18.7, 230: 17 },
  "5": { 115: 56, 200: 32.2, 208: 30.8, 230: 28 },
  "7.5": { 115: 80, 200: 46, 208: 44, 230: 40 },
  "10": { 115: 100, 200: 57.5, 208: 55, 230: 50 },
};

// NEC Table 430.250 — full-load current, three-phase AC motors (amps).
const FLA_THREE_PHASE: Record<string, Record<number, number>> = {
  "0.5": { 200: 2.5, 208: 2.4, 230: 2.2, 460: 1.1, 575: 0.9 },
  "0.75": { 200: 3.7, 208: 3.5, 230: 3.2, 460: 1.6, 575: 1.3 },
  "1": { 200: 4.8, 208: 4.6, 230: 4.2, 460: 2.1, 575: 1.7 },
  "1.5": { 200: 6.9, 208: 6.6, 230: 6, 460: 3, 575: 2.4 },
  "2": { 200: 7.8, 208: 7.5, 230: 6.8, 460: 3.4, 575: 2.7 },
  "3": { 200: 11, 208: 10.6, 230: 9.6, 460: 4.8, 575: 3.9 },
  "5": { 200: 17.5, 208: 16.7, 230: 15.2, 460: 7.6, 575: 6.1 },
  "7.5": { 200: 25.3, 208: 24.2, 230: 22, 460: 11, 575: 9 },
  "10": { 200: 32.2, 208: 30.8, 230: 28, 460: 14, 575: 11 },
  "15": { 200: 48.3, 208: 46.2, 230: 42, 460: 21, 575: 17 },
  "20": { 200: 62.1, 208: 59.4, 230: 54, 460: 27, 575: 22 },
  "25": { 200: 78.2, 208: 74.8, 230: 68, 460: 34, 575: 27 },
  "30": { 200: 92, 208: 88, 230: 80, 460: 40, 575: 32 },
  "40": { 200: 120, 208: 114, 230: 104, 460: 52, 575: 41 },
  "50": { 200: 150, 208: 143, 230: 130, 460: 65, 575: 52 },
  "60": { 200: 177, 208: 169, 230: 154, 460: 77, 575: 62 },
  "75": { 200: 221, 208: 211, 230: 192, 460: 96, 575: 77 },
  "100": { 200: 285, 208: 273, 230: 248, 460: 124, 575: 99 },
};

// NEC 240.6(A) — standard fuse and inverse-time circuit-breaker sizes (amps).
export const STANDARD_OCP_SIZES = [
  15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350,
  400, 450, 500, 600, 700, 800, 1000, 1200, 1600, 2000, 2500, 3000, 4000, 5000, 6000,
];

// NEC Table 430.52 — max OCP as % of FLA.
const OCP_MULTIPLIER: Record<OcpDeviceType, number> = {
  nonTimeDelayFuse: 3.0,
  dualElementFuse: 1.75,
  instantaneousTripBreaker: 8.0,
  inverseTimeBreaker: 2.5,
};

// -------------------------------------------------------------------
// Engine
// -------------------------------------------------------------------

export type LookupResult =
  | { ok: true; amps: number; citation: string }
  | { ok: false; missing: true; reason: string };

export function lookupFLA(hp: number, voltage: number, phase: Phase): LookupResult {
  const table = phase === 1 ? FLA_SINGLE_PHASE : FLA_THREE_PHASE;
  const citation = phase === 1 ? "Table 430.248" : "Table 430.250";
  const row = table[String(hp)];
  if (!row) {
    return {
      ok: false,
      missing: true,
      reason: `${hp} HP not listed in ${citation} lookup.`,
    };
  }
  const v = row[voltage];
  if (v === undefined) {
    return {
      ok: false,
      missing: true,
      reason: `${hp} HP @ ${voltage} V not listed in ${citation}.`,
    };
  }
  return { ok: true, amps: v, citation };
}

/** NEC 430.22 — branch-circuit conductor min ampacity for a single continuous-duty motor. */
export function branchConductorMinAmpacity(fla: number): {
  amps: number;
  citation: string;
} {
  return { amps: round1(fla * 1.25), citation: "430.22" };
}

/**
 * NEC Table 430.52 — max branch-circuit short-circuit and ground-fault
 * protection, then NEC 430.52(C)(1) Ex. 1 permits rounding UP to the
 * next standard size from 240.6(A) when the calculated value isn't standard.
 */
export function ocpSize(
  fla: number,
  device: OcpDeviceType,
): { calculated: number; sized: number; citation: string } {
  const calc = fla * OCP_MULTIPLIER[device];
  return {
    calculated: round1(calc),
    sized: nextStandardOcpSize(calc),
    citation: "Table 430.52 + 430.52(C)(1) Ex. 1 + 240.6(A)",
  };
}

/** Round UP to the next standard 240.6(A) size. Exact hits stay the same. */
export function nextStandardOcpSize(amps: number): number {
  for (const s of STANDARD_OCP_SIZES) {
    if (s >= amps - 1e-9) return s;
  }
  return STANDARD_OCP_SIZES[STANDARD_OCP_SIZES.length - 1];
}

/** NEC 430.110(A) — motor disconnect ampere rating shall be ≥ 115% of FLA. */
export function disconnectMinAmps(fla: number): {
  amps: number;
  citation: string;
} {
  return { amps: round1(fla * 1.15), citation: "430.110(A)" };
}

/**
 * NEC 430.24 — feeder ampacity for a group of motors: 125% of the largest
 * motor's FLA plus the sum of the FLAs of the remaining motors.
 * `flas` = every motor's table FLA (amps).
 */
export function feederMinAmpacity(flas: number[]): {
  amps: number;
  citation: string;
} {
  if (flas.length === 0) return { amps: 0, citation: "430.24" };
  const largest = Math.max(...flas);
  const rest = flas.reduce((s, v) => s + v, 0) - largest;
  return { amps: round1(largest * 1.25 + rest), citation: "430.24" };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

// -------------------------------------------------------------------
// Validation test cases
// -------------------------------------------------------------------

export type TestKind = "fla" | "conductor" | "ocp" | "disconnect" | "feeder" | "standardOcp";

export type MotorTest = {
  id: string;
  kind: TestKind;
  edition: NecEdition;
  description: string;
  citation: string;
  input: Record<string, unknown>;
  expected: number;
};

export const MOTOR_TEST_CASES: MotorTest[] = [
  // ---- FLA lookups (Table 430.248 / 430.250) ----
  {
    id: "fla-5hp-230v-3ph",
    kind: "fla",
    edition: "2023",
    description: "5 HP, 230 V, 3-phase → Table 430.250",
    citation: "Table 430.250",
    input: { hp: 5, voltage: 230, phase: 3 },
    expected: 15.2,
  },
  {
    id: "fla-10hp-208v-3ph",
    kind: "fla",
    edition: "2023",
    description: "10 HP, 208 V, 3-phase → Table 430.250",
    citation: "Table 430.250",
    input: { hp: 10, voltage: 208, phase: 3 },
    expected: 30.8,
  },
  {
    id: "fla-25hp-460v-3ph",
    kind: "fla",
    edition: "2020",
    description: "25 HP, 460 V, 3-phase → Table 430.250",
    citation: "Table 430.250",
    input: { hp: 25, voltage: 460, phase: 3 },
    expected: 34,
  },
  {
    id: "fla-1hp-120v-1ph",
    kind: "fla",
    edition: "2017",
    description: "1 HP, 115 V, single-phase → Table 430.248",
    citation: "Table 430.248",
    input: { hp: 1, voltage: 115, phase: 1 },
    expected: 16,
  },
  {
    id: "fla-50hp-460v-3ph",
    kind: "fla",
    edition: "2023",
    description: "50 HP, 460 V, 3-phase → Table 430.250",
    citation: "Table 430.250",
    input: { hp: 50, voltage: 460, phase: 3 },
    expected: 65,
  },

  // ---- Conductor sizing (430.22, FLA × 1.25) ----
  {
    id: "cond-5hp-230v-3ph",
    kind: "conductor",
    edition: "2023",
    description: "5 HP, 230 V, 3-phase (FLA 15.2) → min conductor ampacity",
    citation: "430.22",
    input: { fla: 15.2 },
    expected: 19,
  },
  {
    id: "cond-10hp-208v-3ph",
    kind: "conductor",
    edition: "2023",
    description: "10 HP, 208 V, 3-phase (FLA 30.8) → min conductor ampacity",
    citation: "430.22",
    input: { fla: 30.8 },
    expected: 38.5,
  },
  {
    id: "cond-25hp-460v-3ph",
    kind: "conductor",
    edition: "2020",
    description: "25 HP, 460 V, 3-phase (FLA 34) → min conductor ampacity",
    citation: "430.22",
    input: { fla: 34 },
    expected: 42.5,
  },

  // ---- OCP sizing (Table 430.52 + 240.6(A) round-up) ----
  {
    id: "ocp-10hp-208v-inv",
    kind: "ocp",
    edition: "2023",
    description: "10 HP, 208 V, 3-phase (FLA 30.8), inverse-time breaker",
    citation: "Table 430.52 + 240.6(A)",
    input: { fla: 30.8, device: "inverseTimeBreaker" },
    expected: 80,
  },
  {
    id: "ocp-25hp-460v-inv",
    kind: "ocp",
    edition: "2020",
    description: "25 HP, 460 V, 3-phase (FLA 34), inverse-time breaker",
    citation: "Table 430.52 + 240.6(A)",
    input: { fla: 34, device: "inverseTimeBreaker" },
    expected: 90,
  },
  {
    id: "ocp-5hp-230v-def",
    kind: "ocp",
    edition: "2023",
    description: "5 HP, 230 V, 3-phase (FLA 15.2), dual-element fuse",
    citation: "Table 430.52 + 240.6(A)",
    input: { fla: 15.2, device: "dualElementFuse" },
    expected: 30, // 15.2 × 1.75 = 26.6 → round up to 30
  },
  {
    id: "ocp-10hp-460v-ntdf",
    kind: "ocp",
    edition: "2023",
    description: "10 HP, 460 V, 3-phase (FLA 14), non-time-delay fuse",
    citation: "Table 430.52 + 240.6(A)",
    input: { fla: 14, device: "nonTimeDelayFuse" },
    expected: 45, // 14 × 3.00 = 42 → round up to 45
  },

  // ---- Disconnect sizing (430.110(A), FLA × 1.15) ----
  {
    id: "disc-25hp-460v",
    kind: "disconnect",
    edition: "2020",
    description: "25 HP, 460 V, 3-phase (FLA 34) → min disconnect amps",
    citation: "430.110(A)",
    input: { fla: 34 },
    expected: 39.1,
  },
  {
    id: "disc-10hp-208v",
    kind: "disconnect",
    edition: "2023",
    description: "10 HP, 208 V, 3-phase (FLA 30.8) → min disconnect amps",
    citation: "430.110(A)",
    input: { fla: 30.8 },
    expected: 35.4,
  },

  // ---- Feeder ampacity (430.24) ----
  {
    id: "feeder-three-motors",
    kind: "feeder",
    edition: "2023",
    description: "Feeder for three motors: FLA 34 (largest), 15.2, 7.6 → 125% × 34 + 15.2 + 7.6",
    citation: "430.24",
    input: { flas: [34, 15.2, 7.6] },
    expected: 65.3,
  },

  // ---- Standard-size ladder (240.6(A)) ----
  {
    id: "std-77",
    kind: "standardOcp",
    edition: "2023",
    description: "77 A → next standard size",
    citation: "240.6(A)",
    input: { amps: 77 },
    expected: 80,
  },
  {
    id: "std-85",
    kind: "standardOcp",
    edition: "2023",
    description: "85 A → next standard size",
    citation: "240.6(A)",
    input: { amps: 85 },
    expected: 90,
  },
  {
    id: "std-exact-100",
    kind: "standardOcp",
    edition: "2023",
    description: "100 A (exact standard) → 100",
    citation: "240.6(A)",
    input: { amps: 100 },
    expected: 100,
  },
];

// -------------------------------------------------------------------
// Test runner
// -------------------------------------------------------------------

export type TestOutcome = {
  test: MotorTest;
  status: "pass" | "fail" | "missing";
  actual: number | null;
  note: string;
};

export function runMotorTest(t: MotorTest): TestOutcome {
  const near = (a: number, b: number) => Math.abs(a - b) < 0.05;
  switch (t.kind) {
    case "fla": {
      const { hp, voltage, phase } = t.input as {
        hp: number;
        voltage: number;
        phase: Phase;
      };
      const r = lookupFLA(hp, voltage, phase);
      if (!r.ok) return { test: t, status: "missing", actual: null, note: r.reason };
      return {
        test: t,
        status: near(r.amps, t.expected) ? "pass" : "fail",
        actual: r.amps,
        note: r.citation,
      };
    }
    case "conductor": {
      const { fla } = t.input as { fla: number };
      const r = branchConductorMinAmpacity(fla);
      return {
        test: t,
        status: near(r.amps, t.expected) ? "pass" : "fail",
        actual: r.amps,
        note: r.citation,
      };
    }
    case "ocp": {
      const { fla, device } = t.input as {
        fla: number;
        device: OcpDeviceType;
      };
      const r = ocpSize(fla, device);
      return {
        test: t,
        status: r.sized === t.expected ? "pass" : "fail",
        actual: r.sized,
        note: `${r.calculated} A calc → ${r.sized} A standard (${r.citation})`,
      };
    }
    case "disconnect": {
      const { fla } = t.input as { fla: number };
      const r = disconnectMinAmps(fla);
      return {
        test: t,
        status: near(r.amps, t.expected) ? "pass" : "fail",
        actual: r.amps,
        note: r.citation,
      };
    }
    case "feeder": {
      const { flas } = t.input as { flas: number[] };
      const r = feederMinAmpacity(flas);
      return {
        test: t,
        status: near(r.amps, t.expected) ? "pass" : "fail",
        actual: r.amps,
        note: r.citation,
      };
    }
    case "standardOcp": {
      const { amps } = t.input as { amps: number };
      const r = nextStandardOcpSize(amps);
      return {
        test: t,
        status: r === t.expected ? "pass" : "fail",
        actual: r,
        note: "240.6(A)",
      };
    }
  }
}

export type TestSummary = {
  total: number;
  passed: number;
  failed: number;
  missing: number;
  outcomes: TestOutcome[];
};

export function runAllMotorTests(): TestSummary {
  const outcomes = MOTOR_TEST_CASES.map(runMotorTest);
  return {
    total: outcomes.length,
    passed: outcomes.filter((o) => o.status === "pass").length,
    failed: outcomes.filter((o) => o.status === "fail").length,
    missing: outcomes.filter((o) => o.status === "missing").length,
    outcomes,
  };
}
