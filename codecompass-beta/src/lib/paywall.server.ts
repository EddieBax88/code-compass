import crypto from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PRO_PRICE_ID = "price_1U6umNDLlScoKoy8AWbyvpjQ";
const FOUNDING_MEMBER_PRICE_ID = "price_1U2zPJDLlScoKoy8h04AOjRq";
const LIFETIME_PRICE_ID = "price_1Ten4FRjzbxMHVlJikIz0EJR";

// In-memory cache for IP and guest usage rate limiting (persists in warm serverless lambdas)
const ipUsageCache = new Map<string, { count: number; lastUsed: number }>();

function getSecretKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.STRIPE_WEBHOOK_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    "codecompass-paywall-secret-key-salt-2026"
  );
}

/**
 * Sign a payload with HMAC-SHA256
 */
function signPayload(data: string): string {
  const secret = getSecretKey();
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

/**
 * Parse and verify signed cookie value
 */
export function parseUsageCookie(cookieHeader: string | null): { count: number; valid: boolean } {
  if (!cookieHeader) return { count: 0, valid: false };

  const match = cookieHeader.match(/cc_ai_usage=([^;]+)/);
  if (!match) return { count: 0, valid: false };

  const rawVal = decodeURIComponent(match[1]);
  const parts = rawVal.split(".");
  if (parts.length !== 3) return { count: 0, valid: false };

  const [countStr, expStr, sig] = parts;
  const count = parseInt(countStr, 10);
  const exp = parseInt(expStr, 10);

  if (isNaN(count) || isNaN(exp) || exp < Date.now()) {
    return { count: 0, valid: false };
  }

  const expectedSig = signPayload(`${countStr}.${expStr}`);
  if (sig !== expectedSig) {
    return { count: 0, valid: false };
  }

  return { count, valid: true };
}

/**
 * Create a signed cookie string for Set-Cookie header
 */
export function createSignedUsageCookie(count: number): string {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const data = `${count}.${exp}`;
  const sig = signPayload(data);
  const val = encodeURIComponent(`${data}.${sig}`);
  return `cc_ai_usage=${val}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000; Secure`;
}

/**
 * Extract Client IP from Request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

/**
 * Extract authenticated user info from request Authorization header or Supabase auth cookie
 */
export async function getAuthUser(
  request: Request,
): Promise<{ id: string; email?: string } | null> {
  try {
    const authHeader = request.headers.get("authorization");
    let token: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "").trim();
    }

    if (!token) {
      // Check cookies for sb-access-token or supabase auth token
      const cookie = request.headers.get("cookie") || "";
      const sbTokenMatch =
        cookie.match(/sb-access-token=([^;]+)/) || cookie.match(/sb-[^=]+-auth-token=([^;]+)/);
      if (sbTokenMatch) {
        try {
          const parsed = JSON.parse(decodeURIComponent(sbTokenMatch[1]));
          token = Array.isArray(parsed) ? parsed[0] : parsed.access_token || parsed;
        } catch {
          token = sbTokenMatch[1];
        }
      }
    }

    if (!token) return null;

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) return null;

    // Verify token with Supabase Auth
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: serviceKey,
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) return null;
    const userData = await res.json();
    return {
      id: userData.id,
      email: userData.email,
    };
  } catch (err) {
    console.error("[Paywall] Error getting auth user:", err);
    return null;
  }
}

/**
 * Check if a user has an active Founding Member Stripe subscription in Supabase or Stripe
 */
export async function checkIsFoundingMember(userId?: string, userEmail?: string): Promise<boolean> {
  if (!userId && !userEmail) return false;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    try {
      let subscriptions: any[] = [];

      // First try by user_id
      if (userId) {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${userId}&status=in.(active,trialing)`,
          {
            headers: {
              apikey: serviceKey,
              Authorization: "Bearer " + serviceKey,
            },
          },
        );
        if (res.ok) {
          subscriptions = await res.json();
        }
      }

      // Fallback by customer_email if not found by user_id
      if ((!subscriptions || subscriptions.length === 0) && userEmail) {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/subscriptions?customer_email=eq.${encodeURIComponent(userEmail)}&status=in.(active,trialing)`,
          {
            headers: {
              apikey: serviceKey,
              Authorization: "Bearer " + serviceKey,
            },
          },
        );
        if (res.ok) {
          subscriptions = await res.json();
        }
      }

      if (Array.isArray(subscriptions) && subscriptions.length > 0) {
        // Check if subscription has valid status and price/plan
        const hasActiveSub = subscriptions.some((sub: any) => {
          const isActive = sub.status === "active" || sub.status === "trialing";
          const isTargetPrice =
            !sub.price_id ||
            sub.price_id === PRO_PRICE_ID ||
            sub.price_id === FOUNDING_MEMBER_PRICE_ID ||
            sub.price_id === LIFETIME_PRICE_ID ||
            sub.plan === "pro" ||
            sub.plan === "founding_member" ||
            sub.plan === "lifetime";
          return isActive && isTargetPrice;
        });
        if (hasActiveSub) return true;
      }
    } catch (err) {
      console.warn("[Paywall] Error querying Supabase subscriptions table:", err);
    }
  }

  // Fallback: Check Stripe API directly if customer exists and STRIPE_SECRET_KEY is present
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && userEmail) {
    try {
      const custRes = await fetch(
        `https://api.stripe.com/v1/customers?email=${encodeURIComponent(userEmail)}&limit=1`,
        {
          headers: { Authorization: "Bearer " + stripeKey },
        },
      );
      if (custRes.ok) {
        const custData = await custRes.json();
        const customer = custData.data?.[0];
        if (customer) {
          const subRes = await fetch(
            `https://api.stripe.com/v1/subscriptions?customer=${customer.id}&status=active&limit=5`,
            {
              headers: { Authorization: "Bearer " + stripeKey },
            },
          );
          if (subRes.ok) {
            const subData = await subRes.json();
            if (subData.data && subData.data.length > 0) {
              return true;
            }
          }
        }
      }
    } catch (err) {
      console.warn("[Paywall] Error verifying with Stripe directly:", err);
    }
  }

  return false;
}

export type PaywallCheckResult =
  | { allowed: true; isPaid: boolean; setCookieHeader?: string }
  | { allowed: false; isPaid: false; error: "founding_member_required"; setCookieHeader?: string };

/**
 * Server-side gate check:
 * - Paid members get unlimited access.
 * - Anonymous / guest / unpaid users get exactly 1 free query.
 * - Tracked via HMAC signed cookie and client IP.
 * - From request 2 onward, returns allowed: false.
 */
export async function enforcePaywall(request: Request): Promise<PaywallCheckResult> {
  // 1. Check if user is authenticated and is a paid founding member
  const user = await getAuthUser(request);
  if (user) {
    const isPaid = await checkIsFoundingMember(user.id, user.email);
    if (isPaid) {
      return { allowed: true, isPaid: true };
    }
  }

  // 2. Unpaid or guest user: Check signed cookie
  const cookieHeader = request.headers.get("cookie");
  const parsedCookie = parseUsageCookie(cookieHeader);

  // 3. Check IP usage cache
  const clientIp = getClientIp(request);
  const now = Date.now();
  const ipRecord = ipUsageCache.get(clientIp);
  const ipCount =
    ipRecord && now - ipRecord.lastUsed < 30 * 24 * 60 * 60 * 1000 ? ipRecord.count : 0;

  const currentUsage = Math.max(parsedCookie.valid ? parsedCookie.count : 0, ipCount);

  // If already used 1 or more questions, reject with 402 founding_member_required
  if (currentUsage >= 1) {
    return {
      allowed: false,
      isPaid: false,
      error: "founding_member_required",
      setCookieHeader: createSignedUsageCookie(currentUsage),
    };
  }

  // First free query (usage == 0) -> Allow and issue signed cookie for count = 1
  const newCount = 1;
  ipUsageCache.set(clientIp, { count: newCount, lastUsed: now });
  const setCookieHeader = createSignedUsageCookie(newCount);

  return {
    allowed: true,
    isPaid: false,
    setCookieHeader,
  };
}

const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// In-memory sliding window cache as supplementary / fallback cache
const localRateLimitCache = new Map<string, { count: number; windowStart: number }>();

export type RateLimitResult = { allowed: boolean };

/**
 * Per-IP request cap (20 requests per hour per IP) enforced before LLM calls.
 * Backed by Supabase ip_rate_limits table with local in-memory fallback.
 * Fails OPEN on any database or network error.
 */
export async function checkIpRateLimit(clientIp: string): Promise<RateLimitResult> {
  try {
    if (!clientIp) return { allowed: true };

    const now = Date.now();
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Check local in-memory cache first
    const local = localRateLimitCache.get(clientIp);
    if (local && now - local.windowStart < RATE_LIMIT_WINDOW_MS) {
      if (local.count >= RATE_LIMIT_MAX_REQUESTS) {
        return { allowed: false };
      }
    }

    if (!supabaseUrl || !serviceKey) {
      // If no Supabase config, track in memory and fail open
      if (!local || now - local.windowStart >= RATE_LIMIT_WINDOW_MS) {
        localRateLimitCache.set(clientIp, { count: 1, windowStart: now });
      } else {
        local.count += 1;
        if (local.count > RATE_LIMIT_MAX_REQUESTS) {
          return { allowed: false };
        }
      }
      return { allowed: true };
    }

    // Query Supabase ip_rate_limits table
    const getRes = await fetch(
      `${supabaseUrl}/rest/v1/ip_rate_limits?ip=eq.${encodeURIComponent(clientIp)}&select=*`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: "Bearer " + serviceKey,
        },
      },
    );

    if (getRes.ok) {
      const rows = await getRes.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const record = rows[0];
        const windowStart = new Date(record.window_start).getTime();
        const requestCount = typeof record.request_count === "number" ? record.request_count : 1;

        if (now - windowStart > RATE_LIMIT_WINDOW_MS) {
          // Reset window
          await fetch(
            `${supabaseUrl}/rest/v1/ip_rate_limits?ip=eq.${encodeURIComponent(clientIp)}`,
            {
              method: "PATCH",
              headers: {
                apikey: serviceKey,
                Authorization: "Bearer " + serviceKey,
                "Content-Type": "application/json",
                Prefer: "return=minimal",
              },
              body: JSON.stringify({
                request_count: 1,
                window_start: new Date(now).toISOString(),
                updated_at: new Date(now).toISOString(),
              }),
            },
          ).catch(() => {});
          localRateLimitCache.set(clientIp, { count: 1, windowStart: now });
          return { allowed: true };
        } else {
          if (requestCount >= RATE_LIMIT_MAX_REQUESTS) {
            localRateLimitCache.set(clientIp, { count: requestCount, windowStart });
            return { allowed: false };
          }
          // Increment count
          const nextCount = requestCount + 1;
          await fetch(
            `${supabaseUrl}/rest/v1/ip_rate_limits?ip=eq.${encodeURIComponent(clientIp)}`,
            {
              method: "PATCH",
              headers: {
                apikey: serviceKey,
                Authorization: "Bearer " + serviceKey,
                "Content-Type": "application/json",
                Prefer: "return=minimal",
              },
              body: JSON.stringify({
                request_count: nextCount,
                updated_at: new Date(now).toISOString(),
              }),
            },
          ).catch(() => {});
          localRateLimitCache.set(clientIp, { count: nextCount, windowStart });
          return { allowed: true };
        }
      } else {
        // Insert new row
        await fetch(`${supabaseUrl}/rest/v1/ip_rate_limits`, {
          method: "POST",
          headers: {
            apikey: serviceKey,
            Authorization: "Bearer " + serviceKey,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            ip: clientIp,
            request_count: 1,
            window_start: new Date(now).toISOString(),
            updated_at: new Date(now).toISOString(),
          }),
        }).catch(() => {});
        localRateLimitCache.set(clientIp, { count: 1, windowStart: now });
        return { allowed: true };
      }
    } else {
      // If table query returned non-2xx, track locally & fail open
      if (!local || now - local.windowStart >= RATE_LIMIT_WINDOW_MS) {
        localRateLimitCache.set(clientIp, { count: 1, windowStart: now });
      } else {
        local.count += 1;
        if (local.count > RATE_LIMIT_MAX_REQUESTS) {
          return { allowed: false };
        }
      }
      return { allowed: true };
    }
  } catch (err) {
    console.warn("[RateLimit] Error checking IP rate limit, failing open:", err);
    return { allowed: true };
  }
}
