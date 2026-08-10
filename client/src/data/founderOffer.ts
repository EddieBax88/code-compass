/**
 * Code Compass — Founding Member Offer
 *
 * Central config for the founder-pricing funnels. Each funnel gets its OWN
 * Stripe payment link so conversion can be attributed per funnel directly
 * in the Stripe dashboard (no extra analytics wiring needed).
 *
 * Once the Stripe payment links are created, paste them below. Until then,
 * CTAs fall back to /pricing so the pages are safe to deploy at any time.
 */

export const FOUNDER_OFFER = {
  priceLabel: "$1.99",
  period: "/month",
  cap: 500,
  regularPriceLabel: "$39.99",
} as const;

/** Stripe payment link per funnel (leave "" to fall back to /pricing). */
export const FOUNDER_CHECKOUT_LINKS: Record<string, string> = {
  /** /founders — working-electrician "co-pilot" angle */
  founders: "",
  /** /pass — exam-prep angle */
  pass: "",
};

export function getFounderCheckoutUrl(funnel: keyof typeof FOUNDER_CHECKOUT_LINKS): string {
  const link = FOUNDER_CHECKOUT_LINKS[funnel];
  return link && link.startsWith("https://") ? link : "/pricing";
}
