/**
 * AI Co-Pilot router — uses the built-in invokeLLM helper (Manus Forge API)
 * to analyze any NEC exam question and return:
 * - Extracted index keywords
 * - Step-by-step NEC lookup path
 * - Relevant article citation
 * - Plain-English explanation
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { getCopilotUsageToday, incrementCopilotUsage } from "../db";

/** Free users (anonymous or no active subscription) get this many analyses per UTC day. */
export const FREE_DAILY_LIMIT = 3;

/** True if the user has an active or trialing subscription (unlimited access). */
function hasUnlimitedAccess(
  user: { subscriptionStatus?: string } | null | undefined
): boolean {
  if (!user) return false;
  return (
    user.subscriptionStatus === "active" ||
    user.subscriptionStatus === "trialing"
  );
}

const SUGGESTED_QUESTIONS = [
  "Wall outlet spacing in a living room",
  "Working space depth for 120/240V panel",
  "GFCI required in residential bathroom",
  "Vertical clearance over a driveway",
  "Wire gauge for a 20-amp circuit",
  "Bonding requirements for metal water pipe",
  "Service entrance conductor sizing",
  "Receptacle spacing on kitchen countertop",
];

const SYSTEM_PROMPT = `You are an expert NEC (National Electrical Code) instructor and licensed master electrician.
Your job is to teach electricians HOW TO USE the NEC code book — not just give them the answer.

When given an exam question or electrical scenario, respond ONLY with a valid JSON object in this exact structure:
{
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "indexDrilldown": [
    { "level": 1, "entry": "Branch Circuits", "description": "Start here in the NEC Index" },
    { "level": 2, "entry": "Conductors", "description": "Find this sub-entry" },
    { "level": 3, "entry": "Minimum Ampacity and Size", "description": "Then this sub-sub-entry" }
  ],
  "article": "Article 210.19",
  "articleTitle": "Conductor Sizing",
  "lookupSteps": [
    "Step 1: Open the NEC Index and look up 'Branch Circuits'",
    "Step 2: Under Branch Circuits, find 'Conductors'",
    "Step 3: Under Conductors, find 'Minimum Ampacity and Size'",
    "Step 4: Follow the reference to Article 210.19"
  ],
  "answer": "A concise paraphrase of the code requirement — never quote verbatim. Cite the article number.",
  "examTip": "A practical tip for remembering this rule on exam day",
  "necVersion": "2026"
}

CRITICAL RULES:
- NEVER reproduce verbatim NEC text — always paraphrase and cite the article number
- TEACH THE HIERARCHICAL INDEX DRILL-DOWN: Show every level the user must navigate through the index
- Each level in indexDrilldown should be a real NEC Index entry that users actually see when looking up the topic
- Always include 3-5 levels of drill-down to teach the real lookup path
- Keep answers factual, cite specific article numbers (e.g., Article 210.52)
- If the question involves a calculation, include the formula in the answer
- necVersion should reflect the most applicable version (2017/2020/2023/2026)
- Respond ONLY with the JSON object — no markdown fences, no extra text`;

export const copilotRouter = router({
  suggestedQuestions: publicProcedure.query(() => SUGGESTED_QUESTIONS),

  // Returns the caller's remaining free analyses for today (and whether they're unlimited).
  usageStatus: publicProcedure
    .input(z.object({ clientId: z.string().min(1).max(128) }))
    .query(async ({ ctx, input }) => {
      const unlimited = hasUnlimitedAccess(
        ctx.user as { subscriptionStatus?: string } | null
      );
      if (unlimited) {
        return {
          unlimited: true,
          used: 0,
          limit: FREE_DAILY_LIMIT,
          remaining: FREE_DAILY_LIMIT,
        };
      }
      const used = await getCopilotUsageToday(input.clientId);
      return {
        unlimited: false,
        used,
        limit: FREE_DAILY_LIMIT,
        remaining: Math.max(0, FREE_DAILY_LIMIT - used),
      };
    }),

  analyze: publicProcedure
    .input(
      z.object({
        question: z.string().min(5).max(1000),
        necVersion: z.enum(["2017", "2020", "2023", "2026"]).default("2026"),
        clientId: z.string().min(1).max(128),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Freemium gate: subscribers are unlimited; everyone else gets FREE_DAILY_LIMIT/day.
      const unlimited = hasUnlimitedAccess(
        ctx.user as { subscriptionStatus?: string } | null
      );
      if (!unlimited) {
        const used = await getCopilotUsageToday(input.clientId);
        if (used >= FREE_DAILY_LIMIT) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `LIMIT_REACHED: You've used your ${FREE_DAILY_LIMIT} free Co-Pilot questions today. Upgrade to Pro for unlimited access.`,
          });
        }
      }
      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `NEC Version: ${input.necVersion}\nQuestion/Scenario: ${input.question}`,
            },
          ],
        });

        const rawText = response.choices?.[0]?.message?.content;
        if (!rawText || typeof rawText !== "string") {
          throw new Error("Empty response from AI");
        }

        // Strip markdown code fences if present
        const cleaned = rawText
          .replace(/^```(?:json)?\n?/, "")
          .replace(/\n?```$/, "")
          .trim();

        const parsed = JSON.parse(cleaned);

        // Validate required fields
        if (!parsed.keywords || !parsed.article || !parsed.answer) {
          throw new Error("Invalid response structure from AI");
        }

        // Count this successful analysis against the free quota (subscribers exempt).
        if (!unlimited) {
          await incrementCopilotUsage(input.clientId);
        }

        return {
          keywords: parsed.keywords as string[],
          indexDrilldown:
            (parsed.indexDrilldown as Array<{
              level: number;
              entry: string;
              description: string;
            }>) ?? [],
          article: parsed.article as string,
          articleTitle: (parsed.articleTitle as string) ?? "",
          lookupSteps: (parsed.lookupSteps as string[]) ?? [],
          answer: parsed.answer as string,
          examTip: (parsed.examTip as string) ?? "",
          necVersion: (parsed.necVersion as string) ?? input.necVersion,
        };
      } catch (err) {
        // Re-throw quota/permission errors unchanged so the UI can show the upgrade prompt.
        if (err instanceof TRPCError) throw err;
        console.error("[Copilot] AI analysis error:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI analysis failed. Please try again.",
        });
      }
    }),
});
