import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { runAllMotorTests, type TestOutcome } from "@/lib/motor-calc";

export const Route = createFileRoute("/dev/motor-calcs")({
  head: () => ({
    meta: [{ title: "Motor-Calc Diagnostics (Internal) — Code Compass" }],
  }),
  component: MotorCalcDiagnostics,
});

const KIND_LABEL: Record<string, string> = {
  fla: "FLA lookup",
  conductor: "Conductor (430.22)",
  ocp: "OCP (Table 430.52)",
  disconnect: "Disconnect (430.110)",
  feeder: "Feeder (430.24)",
  standardOcp: "Standard OCP (240.6)",
};

function MotorCalcDiagnostics() {
  const [nonce, setNonce] = useState(0);
  const summary = useMemo(() => runAllMotorTests(), [nonce]);
  const [filter, setFilter] = useState<"all" | "fail" | "missing" | "pass">("all");

  const rows = summary.outcomes.filter((o) => (filter === "all" ? true : o.status === filter));

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-primary">
        Internal · Dev
        <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] normal-case tracking-normal text-muted-foreground">
          Motor-calc validation
        </span>
      </div>
      <h1 className="mt-1 font-display text-4xl font-semibold">Motor-calc diagnostics.</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Runs every motor calculation test case against the current engine (
        <code className="font-mono">src/lib/motor-calc.ts</code>). Use this before demo day to
        confirm FLA lookups, conductor sizing, OCP sizing, disconnect sizing, and feeder ampacity
        all match the NEC-cited expected values.
      </p>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Total" value={summary.total} tone="muted" />
        <SummaryCard label="Passed" value={summary.passed} tone="pass" />
        <SummaryCard label="Failed" value={summary.failed} tone="fail" />
        <SummaryCard label="Missing logic" value={summary.missing} tone="missing" />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {(["all", "pass", "fail", "missing"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/60"
            }`}
          >
            {f} (
            {f === "all"
              ? summary.total
              : summary[f === "pass" ? "passed" : f === "fail" ? "failed" : "missing"]}
            )
          </button>
        ))}
        <button
          onClick={() => setNonce((n) => n + 1)}
          className="ml-auto rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/60"
        >
          ↻ Re-run
        </button>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Case</th>
              <th className="px-4 py-3">Expected</th>
              <th className="px-4 py-3">Actual</th>
              <th className="px-4 py-3">NEC</th>
              <th className="px-4 py-3">Edition</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <Row key={o.test.id} o={o} />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No test cases match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm">
        <div className="text-[10px] uppercase tracking-[0.18em] text-accent">Scope notes</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
          <li>
            FLA lookups cover common exam rows in NEC Table 430.248 (single-phase) and Table 430.250
            (three-phase). Unsupported (HP, V, phase) combinations return <em>missing</em> — never
            an interpolated value.
          </li>
          <li>
            Overload sizing (NEC 430.32) is intentionally NOT modelled here — it requires nameplate
            FLA, not table FLA, and belongs in a nameplate flow.
          </li>
          <li>
            Feeder ampacity uses 430.24 for a group of continuous-duty motors. Feeder OCP (430.62)
            is not yet modelled — add before shipping to trades that need it.
          </li>
        </ul>
      </section>

      <div className="mt-10 text-sm">
        <Link to="/study-tools" className="text-primary hover:underline">
          ← Back to study tools
        </Link>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "pass" | "fail" | "missing" | "muted";
}) {
  const color =
    tone === "pass"
      ? "text-primary"
      : tone === "fail"
        ? "text-red-500"
        : tone === "missing"
          ? "text-amber-500"
          : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-3xl font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function Row({ o }: { o: TestOutcome }) {
  const badge =
    o.status === "pass"
      ? "border-primary/40 bg-primary/10 text-primary"
      : o.status === "fail"
        ? "border-red-500/40 bg-red-500/10 text-red-500"
        : "border-amber-500/40 bg-amber-500/10 text-amber-500";
  const label = o.status === "pass" ? "✓ pass" : o.status === "fail" ? "✗ fail" : "⚠ missing";
  return (
    <tr className="border-t border-border/60 align-top">
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium ${badge}`}
        >
          {label}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {KIND_LABEL[o.test.kind] ?? o.test.kind}
      </td>
      <td className="px-4 py-3">
        <div className="font-medium">{o.test.description}</div>
        <div className="mt-1 font-mono text-[11px] text-muted-foreground">
          input: {JSON.stringify(o.test.input)}
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">{o.note}</div>
      </td>
      <td className="px-4 py-3 font-mono">{o.test.expected}</td>
      <td className="px-4 py-3 font-mono">
        {o.actual === null ? <span className="text-amber-500">—</span> : o.actual}
      </td>
      <td className="px-4 py-3 font-mono text-xs">{o.test.citation}</td>
      <td className="px-4 py-3 text-xs">{o.test.edition}</td>
    </tr>
  );
}
