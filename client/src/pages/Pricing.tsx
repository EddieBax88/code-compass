/**
 * Code Compass — Pricing Page
 * 2-plan layout: Free + Lifetime $39.99
 * Industrial Control Panel design — amber/orange accents on near-black
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Check, Zap, Infinity, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import AppLayout from "@/components/AppLayout";
import BackButton from "@/components/BackButton";

export default function Pricing() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { data: plans = [] } = trpc.plans.list.useQuery();
  const { data: subStatus } = trpc.stripe.subscriptionStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecting to checkout...");
        window.open(data.url, "_blank");
      }
      setLoadingPlan(null);
    },
    onError: (err) => {
      toast.error(err.message || "Checkout failed. Please try again.");
      setLoadingPlan(null);
    },
  });

  const handleCheckout = (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setLoadingPlan(planId);
    createCheckout.mutate({ planId, origin: window.location.origin });
  };

  const isCurrentPlan = (planId: string) => {
    if (planId === "free" && (!subStatus?.status || subStatus.status === "none")) return true;
    return subStatus?.plan === planId && subStatus.status === "active";
  };

  const freePlan = plans.find((p) => p.id === "free");
  const lifetimePlan = plans.find((p) => p.id === "lifetime");

  return (
    <AppLayout>
      <div className="min-h-screen bg-background px-4 py-12">
        <div className="max-w-4xl mx-auto mb-4">
          <BackButton fallback="/" label="Back to Panel" className="-ml-3" />
        </div>

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="stencil-label mb-3">PLANS & PRICING</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Stop guessing. Start finding.
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Code Compass teaches you to find any NEC answer in under 60 seconds —
            the same skill journeyman and master electricians use on the job.
          </p>
        </div>

        {/* 2-Plan Cards */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Free Plan */}
          {freePlan && (
            <div className="relative flex flex-col rounded-sm border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span className="font-mono text-sm font-bold tracking-wider uppercase text-foreground">
                  Free
                </span>
              </div>

              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground text-sm ml-2">forever</span>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                {freePlan.description}
              </p>

              <ul className="space-y-2 mb-8 flex-1">
                {freePlan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan("free") ? (
                <Button variant="outline" disabled className="w-full font-mono text-xs tracking-wider">
                  CURRENT PLAN
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full font-mono text-xs tracking-wider"
                  onClick={() => navigate("/")}
                >
                  GET STARTED FREE
                </Button>
              )}
            </div>
          )}

          {/* Lifetime Plan */}
          {lifetimePlan && (
            <div className="relative flex flex-col rounded-sm border-2 border-primary bg-primary/5 shadow-[0_0_30px_rgba(245,158,11,0.2)] p-6">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground font-mono text-xs tracking-wider px-3">
                  BEST VALUE
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Infinity className="w-5 h-5 text-primary" />
                <span className="font-mono text-sm font-bold tracking-wider uppercase text-foreground">
                  Lifetime Access
                </span>
              </div>

              <div className="mb-1">
                <span className="text-4xl font-bold text-foreground">$39.99</span>
                <span className="text-muted-foreground text-sm ml-2">one-time</span>
              </div>
              <p className="text-xs text-primary font-mono mb-4">NO RECURRING FEES. EVER.</p>

              <p className="text-sm text-muted-foreground mb-6">
                {lifetimePlan.description}
              </p>

              <ul className="space-y-2 mb-8 flex-1">
                {lifetimePlan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan("lifetime") ? (
                <Button variant="outline" disabled className="w-full font-mono text-xs tracking-wider">
                  YOU HAVE LIFETIME ACCESS
                </Button>
              ) : (
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm tracking-wider py-5"
                  disabled={loadingPlan === "lifetime"}
                  onClick={() => handleCheckout("lifetime")}
                >
                  {loadingPlan === "lifetime" ? "LOADING..." : "GET LIFETIME ACCESS — $39.99"}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Trust signal */}
        <div className="max-w-3xl mx-auto mb-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Zap className="w-4 h-4 text-primary" />
          <span>Instant access after payment. No subscription. Cancel nothing.</span>
        </div>

        {/* Free NEC Access Banner */}
        <div className="max-w-3xl mx-auto mb-8 p-4 border border-border rounded-sm bg-card flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Free NEC Access via NFPA</p>
            <p className="text-xs text-muted-foreground">
              NFPA provides free online read-only access to NFPA 70 (NEC).{" "}
              <a
                href="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Create a free NFPA account →
              </a>{" "}
              then use Code Compass to navigate it faster.
            </p>
          </div>
        </div>

        {/* Test card notice — DEV ONLY. import.meta.env.DEV is false in any
            production build (vite build), so real customers never see this. */}
        {import.meta.env.DEV && (
          <div className="max-w-3xl mx-auto mb-10 p-3 border border-border rounded-sm bg-card">
            <p className="text-xs text-muted-foreground text-center font-mono">
              TEST MODE — Use card <span className="text-primary">4242 4242 4242 4242</span> · any future date · any CVC.
              Live payments activate after Stripe KYC.
            </p>
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-sm font-bold text-foreground text-center font-mono tracking-wider mb-5 stencil-label">
            COMMON QUESTIONS
          </h2>
          {[
            {
              q: "What does 'Lifetime Access' actually mean?",
              a: "One payment of $39.99 gets you unlimited AI Co-Pilot queries, all 65+ NEC training cards, and every future NEC version update. No monthly fees, no renewal reminders.",
            },
            {
              q: "Which NEC versions are included?",
              a: "All four: 2017, 2020, 2023, and 2026. Exam requirements vary by state — you get all of them.",
            },
            {
              q: "What is the AI Co-Pilot?",
              a: "Ask any NEC question in plain English. Co-Pilot walks you through the exact index path — keyword to article to table — so you learn the method, not just the answer. Free tier: 3 questions/day. Lifetime: unlimited.",
            },
            {
              q: "Is this an official NFPA product?",
              a: "No. Code Compass is an unofficial study tool. It paraphrases and cites NEC articles — it never reproduces copyrighted text.",
            },
            {
              q: "Can I get a refund?",
              a: "If it does not help you find NEC answers faster, email support within 30 days for a full refund. No questions asked.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border border-border rounded-sm p-4 bg-card">
              <p className="font-medium text-foreground text-sm mb-1">{q}</p>
              <p className="text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
