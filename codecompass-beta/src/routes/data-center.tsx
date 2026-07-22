import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/data-center")({
  head: () => {
    const title = "Data Center Compliance (Arc Flash / EMS) — Code Compass";
    const description =
      "Arc-flash boundary calculations and EMS compliance workflows for hyperscale and colo facilities. Built to NFPA 70E and NEC Article 645.";
    const url = "https://codecompass-beta.lovable.app/data-center";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: DataCenterPage,
});

function DataCenterPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Back to dashboard
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-ember">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="text-[10px] uppercase tracking-[0.2em] text-accent">Module 03</div>
      </div>

      <h1 className="mt-3 font-display text-4xl font-semibold">Data Center Compliance</h1>
      <p className="mt-2 text-muted-foreground max-w-xl">
        Arc-flash boundary calcs and EMS compliance workflows for hyperscale and colo environments.
        Built to NFPA 70E and NEC Article 645.
      </p>

      <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
        <div className="text-[10px] uppercase tracking-[0.18em] text-primary">
          In active development
        </div>
        <h2 className="mt-2 font-display text-xl font-semibold">
          Compliance engine online next release
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Incident-energy tables, working-boundary calculators, and EMS audit checklists are being
          wired to the predictive training engine.
        </p>
      </div>
    </main>
  );
}
