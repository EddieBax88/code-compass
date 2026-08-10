/**
 * Code Compass — Founders Funnel (/founders)
 * Angle: AI-powered NEC co-pilot for working electricians.
 * Standalone landing page (no app chrome) for cold traffic + XPRIZE push.
 * Design: Industrial Control Panel — amber accents, stencil labels.
 */
import { Zap, Search, Timer, Bot, BookOpen, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { FOUNDER_OFFER, getFounderCheckoutUrl } from "@/data/founderOffer";

const CHECKOUT_URL = getFounderCheckoutUrl("founders");

const FEATURES = [
  { icon: Bot, title: "AI Code Co-Pilot", desc: "Ask any NEC question in plain English. Get the article, the answer, and the why — in seconds." },
  { icon: Search, title: "Instant NEC Lookup", desc: "Trained book-navigation method: index → article → exception. Find any answer in under 60 seconds." },
  { icon: Timer, title: "Timed Exam Simulations", desc: "Realistic journeyman & master exam sims with fresh randomized questions every attempt." },
  { icon: Zap, title: "Rapid-Fire Drills", desc: "Build lookup muscle memory with instant feedback and full NEC citations on every question." },
];

function CTAButton({ label = "Claim your founder spot" }: { label?: string }) {
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

export default function FoundersFunnel() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="stencil-label mb-4">FOUNDING MEMBER OFFER — LIMITED TO THE FIRST {FOUNDER_OFFER.cap}</p>
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
          The NEC co-pilot master electricians wish they had as apprentices.
        </h1>
        <p className="text-muted-foreground text-lg mt-6 max-w-xl mx-auto">
          Stop flipping through 1,200 pages on the tailgate. Code Compass finds the article,
          explains it in plain English, and trains you to verify it in your own code book.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-mono font-bold text-primary">{FOUNDER_OFFER.priceLabel}</span>
            <span className="text-muted-foreground font-mono">{FOUNDER_OFFER.period}</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Founder rate — locked in for life. Regular price {FOUNDER_OFFER.regularPriceLabel}.
          </p>
          <div className="mt-2">
            <CTAButton />
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <p className="stencil-label mb-6 text-center">WHAT YOU GET</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="panel-card p-6 rounded-sm">
              <Icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why founder pricing */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="panel-card p-8 rounded-sm">
          <p className="stencil-label mb-4">WHY {FOUNDER_OFFER.priceLabel}{FOUNDER_OFFER.period}?</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We're opening Code Compass to the first {FOUNDER_OFFER.cap} founding members at a price
            any apprentice can afford. In exchange, we want your feedback — the questions you wish
            it answered, the drills you wish it had. Founders keep this rate for as long as they
            stay subscribed, even after the price goes up.
          </p>
          <ul className="mt-6 space-y-2">
            {[
              "Full access to every feature — no locked tiers",
              `Founder rate locked in for life (regular ${FOUNDER_OFFER.regularPriceLabel})`,
              "Cancel anytime, no questions asked",
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust + final CTA */}
      <section className="max-w-3xl mx-auto px-6 py-12 pb-20 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Every answer cites the NEC article — verify it in your own book
          </span>
        </div>
        <CTAButton label={`Become a founding member — ${FOUNDER_OFFER.priceLabel}${FOUNDER_OFFER.period}`} />
        <p className="mt-4 text-xs text-muted-foreground">
          <BookOpen className="w-3 h-3 inline mr-1" />
          Covers NEC 2017 / 2020 / 2023 / 2026
        </p>
      </section>
    </div>
  );
}
