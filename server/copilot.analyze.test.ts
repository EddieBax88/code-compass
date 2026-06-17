import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the built-in LLM helper
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            keywords: ["Receptacles", "Dwelling Units", "Wall Spacing"],
            indexDrilldown: [
              { level: 1, entry: "Receptacles", description: "Start here" },
              { level: 2, entry: "Dwelling Units", description: "Sub-entry" },
            ],
            article: "Article 210.52(A)",
            articleTitle: "Dwelling Unit Receptacle Outlets",
            lookupSteps: [
              "Step 1: Open the NEC Index and look up 'Receptacles'",
              "Step 2: Under Receptacles, find 'Dwelling Units'",
              "Step 3: Follow the reference to Article 210.52(A)",
            ],
            answer:
              "Article 210.52(A) requires receptacles to be placed so that no point along the floor line is more than 6 feet from a receptacle outlet.",
            examTip:
              "Remember the 6-foot rule — no point on a wall can be more than 6 feet from a receptacle.",
            necVersion: "2026",
          }),
        },
      },
    ],
  }),
}));

// Mock the usage-tracking DB helpers so the freemium gate is deterministic.
const usageState = { count: 0 };
vi.mock("./db", () => ({
  getCopilotUsageToday: vi.fn(async () => usageState.count),
  incrementCopilotUsage: vi.fn(async () => {
    usageState.count += 1;
    return usageState.count;
  }),
}));

function makeCtx(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

beforeEach(() => {
  usageState.count = 0;
});

describe("copilot.analyze", () => {
  it("returns structured NEC analysis for a valid question", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.copilot.analyze({
      question: "How far apart must wall receptacles be in a living room?",
      necVersion: "2026",
      clientId: "test-device-1",
    });

    expect(result.keywords).toContain("Receptacles");
    expect(result.article).toBe("Article 210.52(A)");
    expect(result.lookupSteps.length).toBeGreaterThan(0);
    expect(result.answer).toBeTruthy();
    expect(result.examTip).toBeTruthy();
  });

  it("returns suggested questions list", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const suggestions = await caller.copilot.suggestedQuestions();
    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it("blocks free users after the daily limit is reached", async () => {
    usageState.count = 3; // already at FREE_DAILY_LIMIT
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.copilot.analyze({
        question: "What is the working space depth for a 120/240V panel?",
        necVersion: "2026",
        clientId: "test-device-2",
      })
    ).rejects.toThrow(/LIMIT_REACHED/);
  });

  it("allows subscribers unlimited access past the free limit", async () => {
    usageState.count = 99; // way past the free limit
    const subscriber = {
      id: 1,
      openId: "sub-user",
      email: "pro@example.com",
      name: "Pro User",
      loginMethod: "manus",
      role: "user",
      subscriptionStatus: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } as unknown as TrpcContext["user"];

    const caller = appRouter.createCaller(makeCtx(subscriber));
    const result = await caller.copilot.analyze({
      question: "GFCI required in residential bathroom?",
      necVersion: "2026",
      clientId: "sub-user",
    });
    expect(result.article).toBe("Article 210.52(A)");
  });

  it("reports remaining free questions via usageStatus", async () => {
    usageState.count = 1;
    const caller = appRouter.createCaller(makeCtx());
    const status = await caller.copilot.usageStatus({ clientId: "test-device-3" });
    expect(status.unlimited).toBe(false);
    expect(status.remaining).toBe(2);
  });
});
