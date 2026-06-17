/**
 * Stripe webhook handler — registered BEFORE express.json() so the raw body
 * is available for signature verification.
 */
import type { Express, Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    // Raw body required for Stripe signature verification
    (req, res, next) => {
      let data = "";
      req.setEncoding("utf8");
      req.on("data", (chunk) => { data += chunk; });
      req.on("end", () => {
        (req as Request & { rawBody: string }).rawBody = data;
        next();
      });
    },
    async (req: Request & { rawBody?: string }, res: Response) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const stripeKey = process.env.STRIPE_SECRET_KEY;

      if (!stripeKey || !webhookSecret) {
        console.error("[Webhook] Stripe keys not configured");
        res.status(500).send("Stripe not configured");
        return;
      }

      const stripe = new Stripe(stripeKey, { apiVersion: "2026-05-27.dahlia" });

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody ?? "",
          sig as string,
          webhookSecret
        );
      } catch (err) {
        console.error("[Webhook] Signature verification failed:", err);
        res.status(400).send("Webhook signature verification failed");
        return;
      }

      // Test event passthrough — required for Stripe webhook verification
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        res.json({ verified: true });
        return;
      }

      console.log(`[Webhook] Event: ${event.type} | ID: ${event.id}`);

      const db = await getDb();
      if (!db) {
        console.error("[Webhook] DB unavailable");
        res.status(500).send("DB unavailable");
        return;
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.user_id
              ? parseInt(session.metadata.user_id)
              : session.client_reference_id
              ? parseInt(session.client_reference_id)
              : null;
            const planId = session.metadata?.plan_id ?? null;

            if (!userId) break;

            const updateData: Record<string, unknown> = {};

            // One-time payment (lifetime). Only grant access when Stripe
            // confirms the money actually cleared — `payment_status === "paid"`.
            // Without this guard, any completed-but-unpaid (or test) session
            // would unlock lifetime access.
            if (session.mode === "payment" && session.payment_status === "paid") {
              updateData.subscriptionStatus = "active";
              updateData.subscriptionPlan = planId ?? "lifetime";
            }

            // Save Stripe customer ID if not already stored
            if (session.customer) {
              updateData.stripeCustomerId = session.customer as string;
            }

            if (Object.keys(updateData).length > 0) {
              await db.update(users).set(updateData).where(eq(users.id, userId));
            }
            break;
          }

          case "customer.subscription.created":
          case "customer.subscription.updated": {
            const sub = event.data.object as Stripe.Subscription;
            const customerId = sub.customer as string;

            const [userRow] = await db
              .select()
              .from(users)
              .where(eq(users.stripeCustomerId, customerId))
              .limit(1);

            if (!userRow) break;

            const status = sub.status as "active" | "trialing" | "past_due" | "canceled" | "none";
            const firstItem = sub.items.data[0];
            const periodEnd = firstItem?.current_period_end
              ? new Date(firstItem.current_period_end * 1000)
              : null;

            // Determine plan from price metadata or interval
            const priceId = sub.items.data[0]?.price?.id ?? "";
            const interval = sub.items.data[0]?.price?.recurring?.interval;
            const planId = interval === "year" ? "pro_annual" : "pro_monthly";

            await db.update(users).set({
              stripeSubscriptionId: sub.id,
              subscriptionStatus: status,
              subscriptionPlan: planId,
              subscriptionCurrentPeriodEnd: periodEnd,
            }).where(eq(users.id, userRow.id));

            console.log(`[Webhook] Updated subscription for user ${userRow.id}: ${status}`);
            break;
          }

          case "customer.subscription.deleted": {
            const sub = event.data.object as Stripe.Subscription;
            const customerId = sub.customer as string;

            const [userRow] = await db
              .select()
              .from(users)
              .where(eq(users.stripeCustomerId, customerId))
              .limit(1);

            if (!userRow) break;

            const deletedItem = sub.items.data[0];
            const deletedPeriodEnd = deletedItem?.current_period_end
              ? new Date(deletedItem.current_period_end * 1000)
              : null;

            await db.update(users).set({
              subscriptionStatus: "canceled",
              subscriptionCurrentPeriodEnd: deletedPeriodEnd,
            }).where(eq(users.id, userRow.id));

            console.log(`[Webhook] Subscription canceled for user ${userRow.id}`);
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const customerId = invoice.customer as string;

            const [userRow] = await db
              .select()
              .from(users)
              .where(eq(users.stripeCustomerId, customerId))
              .limit(1);

            if (!userRow) break;

            await db.update(users).set({ subscriptionStatus: "past_due" }).where(eq(users.id, userRow.id));
            console.log(`[Webhook] Payment failed for user ${userRow.id}`);
            break;
          }

          default:
            console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
      } catch (err) {
        console.error("[Webhook] Processing error:", err);
        res.status(500).send("Webhook processing error");
      }
    }
  );
}
