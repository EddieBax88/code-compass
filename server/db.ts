import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ----- Co-Pilot usage tracking (freemium gate) -----
import { and, eq as eqOp } from "drizzle-orm";
import { copilotUsage } from "../drizzle/schema";

/** Returns the current UTC day as YYYY-MM-DD. */
export function getUtcDay(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Returns how many Co-Pilot analyses a client has run today (0 if none/no DB). */
export async function getCopilotUsageToday(clientId: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const day = getUtcDay();
  const rows = await db
    .select()
    .from(copilotUsage)
    .where(
      and(
        eqOp(copilotUsage.clientId, clientId),
        eqOp(copilotUsage.usageDay, day)
      )
    )
    .limit(1);
  return rows.length > 0 ? rows[0].count : 0;
}

/** Increments the client's usage for today, creating the row if needed. Returns new count. */
export async function incrementCopilotUsage(clientId: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const day = getUtcDay();
  const existing = await db
    .select()
    .from(copilotUsage)
    .where(
      and(
        eqOp(copilotUsage.clientId, clientId),
        eqOp(copilotUsage.usageDay, day)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const next = existing[0].count + 1;
    await db
      .update(copilotUsage)
      .set({ count: next })
      .where(eqOp(copilotUsage.id, existing[0].id));
    return next;
  }

  await db.insert(copilotUsage).values({ clientId, usageDay: day, count: 1 });
  return 1;
}
