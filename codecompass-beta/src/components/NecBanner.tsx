import { Link } from "@tanstack/react-router";
import { NEC_EDITIONS, useNecEdition, type NecEdition } from "@/lib/nec-edition";

export function NecBanner() {
  const { edition, setEdition, hydrated } = useNecEdition();
  if (!hydrated) return null;

  if (!edition) {
    return (
      <div className="border-b border-primary/40 bg-primary/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-3 text-sm">
          <span className="font-semibold">Pick your NEC edition:</span>
          <span className="text-muted-foreground">
            Every code reference in the app adjusts to match your jurisdiction.
          </span>
          <div className="ml-auto flex gap-2">
            {NEC_EDITIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEdition(e as NecEdition)}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/70"
              >
                NEC {e}
              </button>
            ))}
          </div>
          <Link to="/study-tools" className="w-full text-xs text-muted-foreground sm:w-auto">
            Unsure? Check with your local AHJ or your electrical inspector — cities and states adopt
            different NEC editions. Learn more →
          </Link>
        </div>
      </div>
    );
  }
  return null;
}

export function NecPill() {
  const { edition, hydrated } = useNecEdition();
  if (!hydrated || !edition) return null;
  return (
    <Link
      to="/study-tools"
      className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/60"
      title="Change NEC edition"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      NEC {edition}
    </Link>
  );
}

export function NecEditionSwitcher() {
  const { edition, setEdition } = useNecEdition();
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-[10px] uppercase tracking-[0.18em] text-primary">NEC edition</div>
      <h3 className="mt-1 font-display text-2xl font-semibold">Which NEC edition do I need?</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The NEC is adopted at the state or local level and editions vary — Texas is largely on 2023,
        California adopted 2020 through Title 24, New York State runs 2020, some rural jurisdictions
        still enforce 2017. Verify with your local Authority Having Jurisdiction (AHJ), your
        apprenticeship program coordinator, or your state electrical board's website before you sit
        for an exam.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {NEC_EDITIONS.map((e) => {
          const active = edition === e;
          return (
            <button
              key={e}
              onClick={() => setEdition(e as NecEdition)}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-ember"
                  : "border-border bg-background hover:border-primary/60"
              }`}
            >
              NEC {e}
            </button>
          );
        })}
      </div>
      {edition && (
        <div className="mt-4 text-xs text-muted-foreground">
          All code references in the app will render as{" "}
          <span className="font-mono text-foreground">NEC {edition} · Article X.Y</span>.
        </div>
      )}
    </div>
  );
}
