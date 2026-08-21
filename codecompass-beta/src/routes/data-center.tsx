import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";
import { useSubscription } from "@/lib/useSubscription";
import { FoundingMemberModal } from "@/components/FoundingMemberModal";

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
  const { isFoundingMember } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Back to dashboard
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-ember">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="text-[10px] uppercase tracking-[0.2em] text-accent">Module 03</div>
        </div>

        {!isFoundingMember && (
          <button
            onClick={() => setShowPaywall(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-500 hover:bg-amber-500/30 transition"
          >
            <Lock className="h-3.5 w-3.5" /> Pro Early Access
          </button>
        )}
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
          wired to the predictive training engine for Pro Members (founding rate is closed).
        </p>

        {!isFoundingMember && (
          <div className="mt-6">
            <button
              onClick={() => setShowPaywall(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-6 py-2.5 text-sm font-bold text-black shadow-lg transition"
            >
              Code Compass Pro — $19.99/month
            </button>
          </div>
        )}
      </div>

      <FoundingMemberModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        title="Unlock Data Center Compliance"
        description="Upgrade to Code Compass Pro to access upcoming arc-flash calculators, EMS compliance tools, and high-voltage training modules."
      />
    </main>
  );
}
