/**
 * Vercel serverless entry point.
 * Wraps the Express app so /api/trpc/* and /api/stripe/webhook work on Vercel.
 */
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { registerStripeWebhook } from "../server/stripeWebhook";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

// Stripe webhook MUST be registered before express.json() for raw body access
registerStripeWebhook(app);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

registerStorageProxy(app);
registerOAuthRoutes(app);

// tRPC API — this is what the frontend calls
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Do NOT call app.listen() — Vercel invokes the handler directly
export default app;
