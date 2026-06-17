import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import { getPlanById, PLANS, type PlanId } from "./products";
import { copilotRouter } from "./routers/copilot";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Stripe not configured" });
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    // Return ONLY the minimum the client needs. Never expose Stripe
    // identifiers (stripeCustomerId / stripeSubscriptionId) or internal
    // timestamps to the browser. Entitlement gating uses stripe.subscriptionStatus.
    me: publicProcedure.query(opts => {
      const u = opts.ctx.user;
      if (!u) return null;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        subscriptionStatus: u.subscriptionStatus,
        subscriptionPlan: u.subscriptionPlan,
      };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  copilot: copilotRouter,

  plans: router({
    list: publicProcedure.query(() => PLANS),
  }),

  stripe: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({ planId: z.string(), origin: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const plan = getPlanById(input.planId as PlanId);
        if (!plan || !plan.stripePriceId) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid plan" });
        }

        const stripe = getStripe();
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        // Get or create Stripe customer
        const [userRow] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
        let customerId = userRow?.stripeCustomerId ?? undefined;

        if (!customerId) {
          const customer = await stripe.customers.create({
            email: ctx.user.email ?? undefined,
            name: ctx.user.name ?? undefined,
            metadata: { userId: ctx.user.id.toString() },
          });
          customerId = customer.id;
          await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, ctx.user.id));
        }

        // Only lifetime (one-time payment) exists — always use payment mode
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [{ price: plan.stripePriceId, quantity: 1 }],
          allow_promotion_codes: true,
          client_reference_id: ctx.user.id.toString(),
          customer_email: !customerId ? (ctx.user.email ?? undefined) : undefined,
          metadata: {
            user_id: ctx.user.id.toString(),
            plan_id: plan.id,
            customer_email: ctx.user.email ?? "",
            customer_name: ctx.user.name ?? "",
          },
          success_url: `${input.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${input.origin}/payment-cancel`,
        });

        return { url: session.url };
      }),

    subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { status: "none", plan: null, currentPeriodEnd: null };

      const [userRow] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
      return {
        status: userRow?.subscriptionStatus ?? "none",
        plan: userRow?.subscriptionPlan ?? null,
        currentPeriodEnd: userRow?.subscriptionCurrentPeriodEnd ?? null,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
