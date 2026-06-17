import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
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
  subscriptionPlan: varchar("subscriptionPlan", { length: 64 }), // e.g. "pro_monthly" | "pro_annual" | "lifetime"
  subscriptionCurrentPeriodEnd: timestamp("subscriptionCurrentPeriodEnd"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tracks daily Co-Pilot usage for the freemium gate.
 * Keyed by a device/client identifier (anonymous) OR user openId (logged in),
 * plus the usage day (YYYY-MM-DD in UTC). One row per client per day.
 */
export const copilotUsage = mysqlTable("copilot_usage", {
  id: int("id").autoincrement().primaryKey(),
  /** Anonymous device id (uuid from client) or user openId */
  clientId: varchar("clientId", { length: 128 }).notNull(),
  /** Usage day in UTC, format YYYY-MM-DD */
  usageDay: varchar("usageDay", { length: 10 }).notNull(),
  /** Number of analyze calls made this day */
  count: int("count").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CopilotUsage = typeof copilotUsage.$inferSelect;
