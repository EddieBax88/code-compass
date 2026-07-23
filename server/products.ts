/**
 * Code Compass — Stripe product/price definitions.
 * All prices are in USD cents.
 *
 * Sandbox/test price (account acct_1Te7oTRjzbxMHVlJ):
 *   Lifetime $39.99 one-time: price_1Ten4FRjzbxMHVlJikIz0EJR  (Product prod_Ue5EAuqJMvI6kb)
 *
 * GOING LIVE: Stripe price IDs are mode-specific — a test price does NOT exist
 * in live mode. Create the $39.99 product/price in LIVE mode and set its id as
 * STRIPE_LIFETIME_PRICE_ID in the host env. The fallback below keeps sandbox
 * working until then, so the test→live switch is env-only (no code change).
 */

export type PlanId = "free" | "lifetime";

/** Lifetime price ID — overridable per Stripe mode via env. */
export const LIFETIME_PRICE_ID =
  process.env.STRIPE_LIFETIME_PRICE_ID ?? "price_1Ten4FRjzbxMHVlJikIz0EJR";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  priceUsd: number; // display price in dollars
  interval: "once" | null;
  stripePriceId: string | null; // null = free tier
  features: string[];
  badge?: string;
  cta: string;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Start learning the NEC method — no credit card needed.",
    priceUsd: 0,
    interval: null,
    stripePriceId: null,
    cta: "Start Free",
    features: [
      "3 AI Co-Pilot questions per day",
      "NEC Index drill-down (hierarchical)",
      "Free NFPA 70 online access guide",
      "4-step code lookup method",
      "All 4 NEC versions (2017–2026)",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime Access",
    description:
      "One payment. Unlimited Co-Pilot. All future updates. Forever.",
    priceUsd: 39.99,
    interval: "once",
    stripePriceId: LIFETIME_PRICE_ID,
    cta: "Get Lifetime Access — $39.99",
    badge: "Best Value",
    features: [
      "Unlimited AI Co-Pilot questions",
      "Hierarchical NEC Index drill-down",
      "All 65+ NEC training cards",
      "Exam Mode (timed, scored)",
      "Quiz Mode (unlimited)",
      "All 4 NEC versions (2017–2026)",
      "All future NEC version updates",
      "Priority support",
      "Never pay again",
    ],
  },
];

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find(p => p.id === id);
}
