import { createFileRoute } from "@tanstack/react-router";
import crypto from "crypto";

/**
 * Stripe Webhook — receives payment and subscription events and updates entitlements in Supabase.
 *
 * Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

const FOUNDING_MEMBER_PRICE_ID = "price_1U2zPJDLlScoKoy8h04AOjRq";
const LIFETIME_PRICE_ID = "price_1Ten4FRjzbxMHVlJikIz0EJR";

async function upsertSubscriptionRecord(data: {
  id: string;
  user_id?: string | null;
  customer_email?: string | null;
  stripe_customer_id: string;
  stripe_subscription_id?: string | null;
  status: string;
  price_id?: string | null;
  plan?: string | null;
  current_period_end?: string | null;
}) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("[Webhook] Missing Supabase configuration for upsert");
    return;
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/subscriptions`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: data.id,
        user_id: data.user_id || undefined,
        customer_email: data.customer_email || undefined,
        stripe_customer_id: data.stripe_customer_id,
        stripe_subscription_id: data.stripe_subscription_id || data.id,
        status: data.status,
        price_id: data.price_id || FOUNDING_MEMBER_PRICE_ID,
        plan: data.plan || "founding_member",
        current_period_end:
          data.current_period_end || new Date(Date.now() + 30 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(
        "[Webhook] Could not upsert into subscriptions table (table may need creation):",
        errText,
      );
    } else {
      console.log(
        `[Webhook] Successfully upserted subscription ${data.id} with status ${data.status}`,
      );
    }
  } catch (err) {
    console.warn("[Webhook] Error upserting subscription:", err);
  }
}

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

          // Verify webhook signature using Stripe HMAC
          const timestamp = sig.split(",")[0]?.replace("t=", "");
          const sigValues = sig
            .split(",")
            .filter((s) => s.startsWith("v1="))
            .map((s) => s.replace("v1=", ""));

          const payload = `${timestamp}.${rawBody}`;
          const computed = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex");

          const isValid = sigValues.some((v) =>
            crypto.timingSafeEqual(Buffer.from(v), Buffer.from(computed)),
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

          // 1. Checkout session completed
          if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const userId = session.metadata?.user_id || session.client_reference_id;
            const customerEmail = session.customer_details?.email || session.customer_email;
            const customerId = session.customer as string;

            if (session.payment_status === "paid" || session.status === "complete") {
              const isSubscription = session.mode === "subscription";
              const subscriptionId = session.subscription as string | undefined;

              await upsertSubscriptionRecord({
                id: subscriptionId || session.id,
                user_id: userId,
                customer_email: customerEmail,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                status: "active",
                plan: isSubscription ? "founding_member" : "lifetime",
                price_id: isSubscription ? FOUNDING_MEMBER_PRICE_ID : LIFETIME_PRICE_ID,
              });

              // Also update user profile metadata if user_id is known
              if (userId) {
                const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
                const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
                if (supabaseUrl && serviceKey) {
                  await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
                    method: "PATCH",
                    headers: {
                      apikey: serviceKey,
                      Authorization: `Bearer ${serviceKey}`,
                      "Content-Type": "application/json",
                      Prefer: "return=minimal",
                    },
                    body: JSON.stringify({
                      subscription_status: "active",
                      subscription_plan: isSubscription ? "founding_member" : "lifetime",
                      stripe_customer_id: customerId,
                    }),
                  }).catch(() => {});
                }
              }
            }
          }

          // 2. Subscription created or updated
          if (
            event.type === "customer.subscription.created" ||
            event.type === "customer.subscription.updated"
          ) {
            const subscription = event.data.object;
            const customerId = subscription.customer as string;
            const status = subscription.status; // 'active', 'trialing', 'past_due', 'canceled', etc.
            const priceId = subscription.items?.data?.[0]?.price?.id;
            const currentPeriodEnd = subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : undefined;

            let customerEmail: string | undefined;
            if (stripeKey && customerId) {
              try {
                const custRes = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
                  headers: { Authorization: `Bearer ${stripeKey}` },
                });
                if (custRes.ok) {
                  const cust = await custRes.json();
                  customerEmail = cust.email;
                }
              } catch {}
            }

            await upsertSubscriptionRecord({
              id: subscription.id,
              user_id: subscription.metadata?.user_id,
              customer_email: customerEmail,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              status,
              price_id: priceId,
              plan: "founding_member",
              current_period_end: currentPeriodEnd,
            });
          }

          // 3. Subscription deleted / canceled
          if (event.type === "customer.subscription.deleted") {
            const subscription = event.data.object;
            await upsertSubscriptionRecord({
              id: subscription.id,
              user_id: subscription.metadata?.user_id,
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              status: "canceled",
              plan: "founding_member",
            });
          }

          // 4. Invoice payment succeeded
          if (event.type === "invoice.payment_succeeded") {
            const invoice = event.data.object;
            if (invoice.subscription) {
              await upsertSubscriptionRecord({
                id: invoice.subscription as string,
                customer_email: invoice.customer_email,
                stripe_customer_id: invoice.customer as string,
                stripe_subscription_id: invoice.subscription as string,
                status: "active",
                plan: "founding_member",
              });
            }
          }

          return new Response(JSON.stringify({ received: true }), {
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Unknown error";
          console.error("[Webhook] Processing error:", errMsg);
          return new Response(JSON.stringify({ error: "Webhook processing error" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
