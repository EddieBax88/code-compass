import { createFileRoute } from "@tanstack/react-router";

/**
 * Stripe Webhook — receives payment events and updates user entitlements.
 * Ported from root server/stripeWebhook.ts.
 *
 * Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 * Register this URL in Stripe Dashboard: https://codecompass.work/api/stripe-webhook
 */

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const stripeKey = process.env.STRIPE_SECRET_KEY;
          const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

          if (!stripeKey || !webhookSecret) {
            console.error("[Webhook] Stripe keys not configured");
            return new Response("Stripe not configured", { status: 500 });
          }

          const rawBody = await request.text();
          const sig = request.headers.get("stripe-signature");

          if (!sig) {
            return new Response("Missing stripe-signature", { status: 400 });
          }

          // Verify webhook signature using Stripe REST
          // For TanStack Start we use the crypto module directly
          const crypto = await import("crypto");
          const expectedSig = crypto
            .createHmac("sha256", webhookSecret)
            .update(rawBody)
            .digest("hex");

          const timestamp = sig.split(",")[0]?.replace("t=", "");
          const sigValues = sig
            .split(",")
            .filter((s) => s.startsWith("v1="))
            .map((s) => s.replace("v1=", ""));

          const payload = `${timestamp}.${rawBody}`;
          const computed = crypto
            .createHmac("sha256", webhookSecret)
            .update(payload)
            .digest("hex");

          const isValid = sigValues.some(
            (v) => crypto.timingSafeEqual(Buffer.from(v), Buffer.from(computed)),
          );

          if (!isValid) {
            console.error("[Webhook] Signature verification failed");
            return new Response("Webhook signature verification failed", {
              status: 400,
            });
          }

          const event = JSON.parse(rawBody);

          // Test event passthrough
          if (event.id?.startsWith("evt_test_")) {
            return new Response(JSON.stringify({ verified: true }), {
              headers: { "content-type": "application/json" },
            });
          }

          console.log(`[Webhook] Event: ${event.type} | ID: ${event.id}`);

          // Handle checkout.session.completed — grant lifetime access
          if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const userId = session.metadata?.user_id;

            if (userId && session.payment_status === "paid") {
              // Update Supabase user via service role
              const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
              const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

              if (supabaseUrl && serviceKey) {
                await fetch(
                  `${supabaseUrl}/rest/v1/users?id=eq.${userId}`,
                  {
                    method: "PATCH",
                    headers: {
                      apikey: serviceKey,
                      Authorization: `Bearer ${serviceKey}`,
                      "Content-Type": "application/json",
                      Prefer: "return=minimal",
                    },
                    body: JSON.stringify({
                      subscription_status: "active",
                      subscription_plan: "lifetime",
                      stripe_customer_id: session.customer,
                    }),
                  },
                );
                console.log(`[Webhook] Granted lifetime access to user ${userId}`);
              }
            }
          }

          return new Response(JSON.stringify({ received: true }), {
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Unknown error";
          console.error("[Webhook] Processing error:", errMsg);
          return new Response(
            JSON.stringify({ error: "Webhook processing error" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
