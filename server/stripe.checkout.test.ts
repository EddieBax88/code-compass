import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock Stripe and DB to avoid real network calls
vi.mock("stripe", () => {
  const mockStripe = {
    customers: {
      create: vi.fn().mockResolvedValue({ id: "cus_test123" }),
    },
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/test" }),
      },
    },
  };
  return { default: vi.fn(() => mockStripe) };
});

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 1, stripeCustomerId: null }]),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  }),
}));

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "none",
      subscriptionPlan: null,
      subscriptionCurrentPeriodEnd: null,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("stripe.createCheckoutSession", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
  });

  it("rejects invalid plan IDs", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.stripe.createCheckoutSession({ planId: "invalid_plan", origin: "https://example.com" })
    ).rejects.toThrow("Invalid plan");
  });

  it("rejects free plan (no Stripe price ID)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.stripe.createCheckoutSession({ planId: "free", origin: "https://example.com" })
    ).rejects.toThrow("Invalid plan");
  });
});

describe("stripe.subscriptionStatus", () => {
  it("returns none status for new user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.stripe.subscriptionStatus();
    expect(result.status).toBe("none");
  });
});
