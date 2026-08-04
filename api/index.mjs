// api/index.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  // Stripe identifiers — only IDs stored here; all other data fetched from Stripe API
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  // Cached subscription status for fast access — kept in sync via webhooks
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "trialing", "past_due", "canceled", "none"]).default("none").notNull(),
  subscriptionPlan: varchar("subscriptionPlan", { length: 64 }),
  // e.g. "pro_monthly" | "pro_annual" | "lifetime"
  subscriptionCurrentPeriodEnd: timestamp("subscriptionCurrentPeriodEnd")
});
var copilotUsage = mysqlTable("copilot_usage", {
  id: int("id").autoincrement().primaryKey(),
  /** Anonymous device id (uuid from client) or user openId */
  clientId: varchar("clientId", { length: 128 }).notNull(),
  /** Usage day in UTC, format YYYY-MM-DD */
  usageDay: varchar("usageDay", { length: 10 }).notNull(),
  /** Number of analyze calls made this day */
  count: int("count").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
import { and, eq as eqOp } from "drizzle-orm";
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
function getUtcDay(date = /* @__PURE__ */ new Date()) {
  return date.toISOString().slice(0, 10);
}
async function getCopilotUsageToday(clientId) {
  const db = await getDb();
  if (!db) return 0;
  const day = getUtcDay();
  const rows = await db.select().from(copilotUsage).where(and(eqOp(copilotUsage.clientId, clientId), eqOp(copilotUsage.usageDay, day))).limit(1);
  return rows.length > 0 ? rows[0].count : 0;
}
async function incrementCopilotUsage(clientId) {
  const db = await getDb();
  if (!db) return 0;
  const day = getUtcDay();
  const existing = await db.select().from(copilotUsage).where(and(eqOp(copilotUsage.clientId, clientId), eqOp(copilotUsage.usageDay, day))).limit(1);
  if (existing.length > 0) {
    const next = existing[0].count + 1;
    await db.update(copilotUsage).set({ count: next }).where(eqOp(copilotUsage.id, existing[0].id));
    return next;
  }
  await db.insert(copilotUsage).values({ clientId, usageDay: day, count: 1 });
  return 1;
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app2) {
  app2.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/stripeWebhook.ts
import Stripe from "stripe";
import { eq as eq2 } from "drizzle-orm";
function registerStripeWebhook(app2) {
  app2.post(
    "/api/stripe/webhook",
    // Raw body required for Stripe signature verification
    (req, res, next) => {
      let data = "";
      req.setEncoding("utf8");
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        req.rawBody = data;
        next();
      });
    },
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey || !webhookSecret) {
        console.error("[Webhook] Stripe keys not configured");
        res.status(500).send("Stripe not configured");
        return;
      }
      const stripe = new Stripe(stripeKey, { apiVersion: "2026-05-27.dahlia" });
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody ?? "",
          sig,
          webhookSecret
        );
      } catch (err) {
        console.error("[Webhook] Signature verification failed:", err);
        res.status(400).send("Webhook signature verification failed");
        return;
      }
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
            const session = event.data.object;
            const userId = session.metadata?.user_id ? parseInt(session.metadata.user_id) : session.client_reference_id ? parseInt(session.client_reference_id) : null;
            const planId = session.metadata?.plan_id ?? null;
            if (!userId) break;
            const updateData = {};
            if (session.mode === "payment" && session.payment_status === "paid") {
              updateData.subscriptionStatus = "active";
              updateData.subscriptionPlan = planId ?? "lifetime";
            }
            if (session.customer) {
              updateData.stripeCustomerId = session.customer;
            }
            if (Object.keys(updateData).length > 0) {
              await db.update(users).set(updateData).where(eq2(users.id, userId));
            }
            break;
          }
          case "customer.subscription.created":
          case "customer.subscription.updated": {
            const sub = event.data.object;
            const customerId = sub.customer;
            const [userRow] = await db.select().from(users).where(eq2(users.stripeCustomerId, customerId)).limit(1);
            if (!userRow) break;
            const status = sub.status;
            const firstItem = sub.items.data[0];
            const periodEnd = firstItem?.current_period_end ? new Date(firstItem.current_period_end * 1e3) : null;
            const priceId = sub.items.data[0]?.price?.id ?? "";
            const interval = sub.items.data[0]?.price?.recurring?.interval;
            const planId = interval === "year" ? "pro_annual" : "pro_monthly";
            await db.update(users).set({
              stripeSubscriptionId: sub.id,
              subscriptionStatus: status,
              subscriptionPlan: planId,
              subscriptionCurrentPeriodEnd: periodEnd
            }).where(eq2(users.id, userRow.id));
            console.log(`[Webhook] Updated subscription for user ${userRow.id}: ${status}`);
            break;
          }
          case "customer.subscription.deleted": {
            const sub = event.data.object;
            const customerId = sub.customer;
            const [userRow] = await db.select().from(users).where(eq2(users.stripeCustomerId, customerId)).limit(1);
            if (!userRow) break;
            const deletedItem = sub.items.data[0];
            const deletedPeriodEnd = deletedItem?.current_period_end ? new Date(deletedItem.current_period_end * 1e3) : null;
            await db.update(users).set({
              subscriptionStatus: "canceled",
              subscriptionCurrentPeriodEnd: deletedPeriodEnd
            }).where(eq2(users.id, userRow.id));
            console.log(`[Webhook] Subscription canceled for user ${userRow.id}`);
            break;
          }
          case "invoice.payment_failed": {
            const invoice = event.data.object;
            const customerId = invoice.customer;
            const [userRow] = await db.select().from(users).where(eq2(users.stripeCustomerId, customerId)).limit(1);
            if (!userRow) break;
            await db.update(users).set({ subscriptionStatus: "past_due" }).where(eq2(users.id, userRow.id));
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

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { TRPCError as TRPCError4 } from "@trpc/server";
import Stripe2 from "stripe";
import { z as z3 } from "zod";

// server/products.ts
var LIFETIME_PRICE_ID = process.env.STRIPE_LIFETIME_PRICE_ID ?? "price_1Ten4FRjzbxMHVlJikIz0EJR";
var PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Start learning the NEC method \u2014 no credit card needed.",
    priceUsd: 0,
    interval: null,
    stripePriceId: null,
    cta: "Start Free",
    features: [
      "3 AI Co-Pilot questions per day",
      "NEC Index drill-down (hierarchical)",
      "Free NFPA 70 online access guide",
      "4-step code lookup method",
      "All 4 NEC versions (2017\u20132026)"
    ]
  },
  {
    id: "lifetime",
    name: "Lifetime Access",
    description: "One payment. Unlimited Co-Pilot. All future updates. Forever.",
    priceUsd: 39.99,
    interval: "once",
    stripePriceId: LIFETIME_PRICE_ID,
    cta: "Get Lifetime Access \u2014 $39.99",
    badge: "Best Value",
    features: [
      "Unlimited AI Co-Pilot questions",
      "Hierarchical NEC Index drill-down",
      "All 65+ NEC training cards",
      "Exam Mode (timed, scored)",
      "Quiz Mode (unlimited)",
      "All 4 NEC versions (2017\u20132026)",
      "All future NEC version updates",
      "Priority support",
      "Never pay again"
    ]
  }
];
function getPlanById(id) {
  return PLANS.find((p) => p.id === id);
}

// server/routers/copilot.ts
import { z as z2 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/_core/llm.ts
var ensureArray = (value) => Array.isArray(value) ? value : [value];
var normalizeContentPart = (part) => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }
  if (part.type === "text") {
    return part;
  }
  if (part.type === "image_url") {
    return part;
  }
  if (part.type === "file_url") {
    return part;
  }
  throw new Error("Unsupported message content part");
};
var normalizeMessage = (message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    return {
      role,
      name,
      tool_call_id,
      content
    };
  }
  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text
    };
  }
  return {
    role,
    name,
    content: contentParts
  };
};
var normalizeToolChoice = (toolChoice, tools) => {
  if (!toolChoice) return void 0;
  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }
    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }
    return {
      type: "function",
      function: { name: tools[0].function.name }
    };
  }
  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name }
    };
  }
  return toolChoice;
};
var resolveApiUrl = () => ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0 ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions` : "https://forge.manus.im/v1/chat/completions";
var assertApiKey = () => {
  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};
var normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return void 0;
  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }
  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
    }
  };
};
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const payload = {
    model: "gemini-2.5-flash",
    messages: messages.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = 32768;
  payload.thinking = {
    "budget_tokens": 128
  };
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}

// server/routers/copilot.ts
var FREE_DAILY_LIMIT = 3;
function hasUnlimitedAccess(user) {
  if (!user) return false;
  return user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing";
}
var SUGGESTED_QUESTIONS = [
  "Wall outlet spacing in a living room",
  "Working space depth for 120/240V panel",
  "GFCI required in residential bathroom",
  "Vertical clearance over a driveway",
  "Wire gauge for a 20-amp circuit",
  "Bonding requirements for metal water pipe",
  "Service entrance conductor sizing",
  "Receptacle spacing on kitchen countertop"
];
var SYSTEM_PROMPT = `You are an expert NEC (National Electrical Code) instructor and licensed master electrician.
Your job is to teach electricians HOW TO USE the NEC code book \u2014 not just give them the answer.

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
  "answer": "A concise paraphrase of the code requirement \u2014 never quote verbatim. Cite the article number.",
  "examTip": "A practical tip for remembering this rule on exam day",
  "necVersion": "2026"
}

CRITICAL RULES:
- NEVER reproduce verbatim NEC text \u2014 always paraphrase and cite the article number
- TEACH THE HIERARCHICAL INDEX DRILL-DOWN: Show every level the user must navigate through the index
- Each level in indexDrilldown should be a real NEC Index entry that users actually see when looking up the topic
- Always include 3-5 levels of drill-down to teach the real lookup path
- Keep answers factual, cite specific article numbers (e.g., Article 210.52)
- If the question involves a calculation, include the formula in the answer
- necVersion should reflect the most applicable version (2017/2020/2023/2026)
- Respond ONLY with the JSON object \u2014 no markdown fences, no extra text`;
var copilotRouter = router({
  suggestedQuestions: publicProcedure.query(() => SUGGESTED_QUESTIONS),
  // Returns the caller's remaining free analyses for today (and whether they're unlimited).
  usageStatus: publicProcedure.input(z2.object({ clientId: z2.string().min(1).max(128) })).query(async ({ ctx, input }) => {
    const unlimited = hasUnlimitedAccess(ctx.user);
    if (unlimited) {
      return { unlimited: true, used: 0, limit: FREE_DAILY_LIMIT, remaining: FREE_DAILY_LIMIT };
    }
    const used = await getCopilotUsageToday(input.clientId);
    return {
      unlimited: false,
      used,
      limit: FREE_DAILY_LIMIT,
      remaining: Math.max(0, FREE_DAILY_LIMIT - used)
    };
  }),
  analyze: publicProcedure.input(
    z2.object({
      question: z2.string().min(5).max(1e3),
      necVersion: z2.enum(["2017", "2020", "2023", "2026"]).default("2026"),
      clientId: z2.string().min(1).max(128)
    })
  ).mutation(async ({ ctx, input }) => {
    const unlimited = hasUnlimitedAccess(ctx.user);
    if (!unlimited) {
      const used = await getCopilotUsageToday(input.clientId);
      if (used >= FREE_DAILY_LIMIT) {
        throw new TRPCError3({
          code: "FORBIDDEN",
          message: `LIMIT_REACHED: You've used your ${FREE_DAILY_LIMIT} free Co-Pilot questions today. Upgrade to Pro for unlimited access.`
        });
      }
    }
    try {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `NEC Version: ${input.necVersion}
Question/Scenario: ${input.question}`
          }
        ]
      });
      const rawText = response.choices?.[0]?.message?.content;
      if (!rawText || typeof rawText !== "string") {
        throw new Error("Empty response from AI");
      }
      const cleaned = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      const parsed = JSON.parse(cleaned);
      if (!parsed.keywords || !parsed.article || !parsed.answer) {
        throw new Error("Invalid response structure from AI");
      }
      if (!unlimited) {
        await incrementCopilotUsage(input.clientId);
      }
      return {
        keywords: parsed.keywords,
        indexDrilldown: parsed.indexDrilldown ?? [],
        article: parsed.article,
        articleTitle: parsed.articleTitle ?? "",
        lookupSteps: parsed.lookupSteps ?? [],
        answer: parsed.answer,
        examTip: parsed.examTip ?? "",
        necVersion: parsed.necVersion ?? input.necVersion
      };
    } catch (err) {
      if (err instanceof TRPCError3) throw err;
      console.error("[Copilot] AI analysis error:", err);
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: "AI analysis failed. Please try again."
      });
    }
  })
});

// server/routers.ts
import { eq as eq3 } from "drizzle-orm";
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Stripe not configured" });
  return new Stripe2(key, { apiVersion: "2026-05-27.dahlia" });
}
var appRouter = router({
  system: systemRouter,
  auth: router({
    // Return ONLY the minimum the client needs. Never expose Stripe
    // identifiers (stripeCustomerId / stripeSubscriptionId) or internal
    // timestamps to the browser. Entitlement gating uses stripe.subscriptionStatus.
    me: publicProcedure.query((opts) => {
      const u = opts.ctx.user;
      if (!u) return null;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        subscriptionStatus: u.subscriptionStatus,
        subscriptionPlan: u.subscriptionPlan
      };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  copilot: copilotRouter,
  plans: router({
    list: publicProcedure.query(() => PLANS)
  }),
  stripe: router({
    createCheckoutSession: protectedProcedure.input(z3.object({ planId: z3.string(), origin: z3.string() })).mutation(async ({ ctx, input }) => {
      const plan = getPlanById(input.planId);
      if (!plan || !plan.stripePriceId) {
        throw new TRPCError4({ code: "BAD_REQUEST", message: "Invalid plan" });
      }
      const stripe = getStripe();
      const db = await getDb();
      if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const [userRow] = await db.select().from(users).where(eq3(users.id, ctx.user.id)).limit(1);
      let customerId = userRow?.stripeCustomerId ?? void 0;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: ctx.user.email ?? void 0,
          name: ctx.user.name ?? void 0,
          metadata: { userId: ctx.user.id.toString() }
        });
        customerId = customer.id;
        await db.update(users).set({ stripeCustomerId: customerId }).where(eq3(users.id, ctx.user.id));
      }
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [{ price: plan.stripePriceId, quantity: 1 }],
        allow_promotion_codes: true,
        client_reference_id: ctx.user.id.toString(),
        customer_email: !customerId ? ctx.user.email ?? void 0 : void 0,
        metadata: {
          user_id: ctx.user.id.toString(),
          plan_id: plan.id,
          customer_email: ctx.user.email ?? "",
          customer_name: ctx.user.name ?? ""
        },
        success_url: `${input.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${input.origin}/payment-cancel`
      });
      return { url: session.url };
    }),
    subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { status: "none", plan: null, currentPeriodEnd: null };
      const [userRow] = await db.select().from(users).where(eq3(users.id, ctx.user.id)).limit(1);
      return {
        status: userRow?.subscriptionStatus ?? "none",
        plan: userRow?.subscriptionPlan ?? null,
        currentPeriodEnd: userRow?.subscriptionCurrentPeriodEnd ?? null
      };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// api/index.ts
var app = express();
registerStripeWebhook(app);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
registerStorageProxy(app);
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var index_default = app;
export {
  index_default as default
};
