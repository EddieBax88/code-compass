/**
 * Code Compass — Exam-Prep Funnel (/pass)
 * Angle: pass your journeyman/master exam on the first try.
 * Standalone landing page (no app chrome) for cold traffic + XPRIZE push.
 * Design: Industrial Control Panel — amber accents, stencil labels.
 */
import { Timer, BookOpen, Target, TrendingUp, ArrowRight, Check, XCircle } from "lucide-react";
import { FOUNDER_OFFER, getFounderCheckoutUrl } from "@/data/founderOffer";

const CHECKOUT_URL = getFounderCheckoutUrl("pass");

const PAIN_POINTS = [
  "You know the material — but you can't find it in the book fast enough",
  "Practice tests repeat the same questions until you memorize answers, not skills",
  "Exam prep courses cost $300–$800 and still don't teach book navigation",
];

const METHOD = [
  { icon: BookOpen, title: "Learn the lookup path", desc: "Every question teaches the full trail: index keywords → entry → article → what to read. The exact skill the exam tests." },
  { icon: Timer, title: "Train under exam pressure", desc: "Timed simulations at real exam pacing (~2.4 min/question) with fresh randomized questions every attempt." },
  { icon: Target, title: "Drill your weak areas", desc: "Rapid-fire drills by difficulty with instant feedback and full NEC citations — journeyman or master level." },
  { icon: TrendingUp, title: "Walk in confident", desc: "By exam day, finding any answer in the code book takes you under 60 seconds. That's the whole game." },
];

function CTAButton({ label = "Start prepping — " + FOUNDER_OFFER.priceLabel + FOUNDER_OFFER.period }: { label?: string }) {
  return (
    <a
      href={CHECKOUT_URL}
      className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all"
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </a>
  );
}

export default function ExamFunnel() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="stencil-label mb-4">JOURNEYMAN & MASTER EXAM PREP</p>
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
          Pass your electrical exam on the first try.
        </h1>
        <p className="text-muted-foreground text-lg mt-6 max-w-xl mx-auto">
          The exam isn't a memory test — it's a <span className="text-foreground font-medium">book navigation race</span>.
          Code Compass trains the one skill that decides it: finding any NEC answer fast.
        </p>
        <div className="mt-8">
          <CTAButton />
          <p className="mt-3 text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Founding member rate — first {FOUNDER_OFFER.cap} only. Regular {FOUNDER_OFFER.regularPriceLabel}.
          </p>
        </div>
      </header>

      {/* Pain points */}
      <section className="max-w-3xl mx-auto px-6 py-8">
        <div className="panel-card p-6 rounded-sm">
          <p className="stencil-label mb-4">SOUND FAMILIAR?</p>
          <ul className="space-y-3">
            {PAIN_POINTS.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Method */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <p className="stencil-label mb-6 text-center">HOW CODE COMPASS TRAINS YOU</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {METHOD.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="panel-card p-6 rounded-sm">
              <Icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offer */}
      <section className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <div className="panel-card p-8 rounded-sm text-center">
          <p className="stencil-label mb-4">FOUNDING MEMBER OFFER</p>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-5xl font-mono font-bold text-primary">{FOUNDER_OFFER.priceLabel}</span>
            <span className="text-muted-foreground font-mono">{FOUNDER_OFFER.period}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Less than a gas-station coffee. Limited to the first {FOUNDER_OFFER.cap} founding members —
            rate locked in for as long as you stay subscribed.
          </p>
          <ul className="text-left max-w-sm mx-auto space-y-2 mb-8">
            {[
              "Unlimited timed exam simulations",
              "Fresh randomized questions every attempt",
              "Full NEC citations + book lookup path on every question",
              "Covers NEC 2017 / 2020 / 2023 / 2026",
              "Cancel anytime",
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <CTAButton label="Claim your founder spot" />
        </div>
      </section>
    </div>
  );
}
