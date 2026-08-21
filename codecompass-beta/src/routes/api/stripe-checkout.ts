import { createFileRoute } from "@tanstack/react-router";

/**
 * Stripe Checkout — creates a subscription checkout session for Code Compass Pro ($19.99/month).
 * Env: STRIPE_SECRET_KEY, STRIPE_PRO_PRICE_ID
 */

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? "price_1U6umNDLlScoKoy8AWbyvpjQ";

export const Route = createFileRoute("/api/stripe-checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const stripeKey = process.env.STRIPE_SECRET_KEY;
          if (!stripeKey) {
            return new Response(JSON.stringify({ error: "Stripe not configured" }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }

          const body = await request.json().catch(() => ({}));
          const origin = body.origin || new URL(request.url).origin;
          const customerEmail = body.customerEmail || undefined;

          // Use Stripe REST directly — create subscription session with Pro price ID
          const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${stripeKey}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              mode: "subscription",
              "payment_method_types[]": "card",
              "line_items[0][price]": PRO_PRICE_ID,
              "line_items[0][quantity]": "1",
              allow_promotion_codes: "true",
              success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${origin}/?payment=cancelled`,
              ...(customerEmail ? { customer_email: customerEmail } : {}),
              "metadata[plan_id]": "pro",
            }),
          });

          if (!sessionRes.ok) {
            const err = await sessionRes.text();
            console.error("[Stripe Checkout] API error:", err);
            return new Response(JSON.stringify({ error: "Stripe API error", detail: err }), {
              status: 502,
              headers: { "content-type": "application/json" },
            });
          }

          const session = await sessionRes.json();
          return new Response(JSON.stringify({ url: session.url, id: session.id }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Unknown error";
          console.error("[Stripe Checkout] Error:", errMsg);
          return new Response(
            JSON.stringify({ error: "Failed to create checkout session", message: errMsg }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
      GET: async ({ request }) => {
        try {
          const stripeKey = process.env.STRIPE_SECRET_KEY;
          if (!stripeKey) {
            return new Response("Stripe not configured", { status: 500 });
          }

          const origin = new URL(request.url).origin;
          const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${stripeKey}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              mode: "subscription",
              "payment_method_types[]": "card",
              "line_items[0][price]": PRO_PRICE_ID,
              "line_items[0][quantity]": "1",
              allow_promotion_codes: "true",
              success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${origin}/?payment=cancelled`,
              "metadata[plan_id]": "pro",
            }),
          });

          if (!sessionRes.ok) {
            const err = await sessionRes.text();
            console.error("[Stripe Checkout] API error:", err);
            return new Response("Failed to create Stripe checkout session", { status: 502 });
          }

          const session = await sessionRes.json();
          return Response.redirect(session.url, 303);
        } catch (error) {
          return new Response("Internal error creating checkout session", { status: 500 });
        }
      },
    },
  },
});
