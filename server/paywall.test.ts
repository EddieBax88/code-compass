import { describe, it, expect } from "vitest";
import {
  parseUsageCookie,
  createSignedUsageCookie,
  enforcePaywall,
} from "../codecompass-beta/src/lib/paywall.server";

describe("Paywall Cookie Signing & Verification", () => {
  it("should create and verify a signed cookie for usage count 1", () => {
    const cookieHeader = createSignedUsageCookie(1);
    expect(cookieHeader).toContain("cc_ai_usage=");
    expect(cookieHeader).toContain("HttpOnly");

    // Extract cookie value
    const match = cookieHeader.match(/cc_ai_usage=([^;]+)/);
    expect(match).toBeTruthy();

    const parsed = parseUsageCookie(cookieHeader);
    expect(parsed.valid).toBe(true);
    expect(parsed.count).toBe(1);
  });

  it("should reject tampered cookie with altered count", () => {
    const cookieHeader = createSignedUsageCookie(1);
    // Tamper count to 0 while keeping same signature
    const tampered = cookieHeader.replace(/cc_ai_usage=1\./, "cc_ai_usage=0.");
    const parsed = parseUsageCookie(tampered);
    expect(parsed.valid).toBe(false);
  });

  it("should handle null or invalid cookie gracefully", () => {
    expect(parseUsageCookie(null)).toEqual({ count: 0, valid: false });
    expect(parseUsageCookie("")).toEqual({ count: 0, valid: false });
    expect(parseUsageCookie("random_cookie=123")).toEqual({
      count: 0,
      valid: false,
    });
    expect(parseUsageCookie("cc_ai_usage=invalid.data")).toEqual({
      count: 0,
      valid: false,
    });
  });
});

describe("enforcePaywall Server-Side Enforcement", () => {
  it("should allow first guest question and reject subsequent questions with 402 error", async () => {
    const testIp = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;

    // First request from guest
    const req1 = new Request("http://localhost:3000/api/nec-lookup", {
      method: "POST",
      headers: {
        "x-forwarded-for": testIp,
        "content-type": "application/json",
      },
    });

    const result1 = await enforcePaywall(req1);
    expect(result1.allowed).toBe(true);
    expect(result1.isPaid).toBe(false);
    expect(result1.setCookieHeader).toBeTruthy();

    // Extract cookie for second request
    const cookieVal = result1.setCookieHeader?.split(";")[0];

    // Second request with cookie
    const req2WithCookie = new Request("http://localhost:3000/api/nec-lookup", {
      method: "POST",
      headers: {
        "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200) + 10}`, // different IP
        cookie: cookieVal || "",
        "content-type": "application/json",
      },
    });

    const result2 = await enforcePaywall(req2WithCookie);
    expect(result2.allowed).toBe(false);
    expect(result2.isPaid).toBe(false);
    if (!result2.allowed) {
      expect(result2.error).toBe("founding_member_required");
    }

    // Second request from same IP even without cookie
    const req2SameIp = new Request("http://localhost:3000/api/nec-lookup", {
      method: "POST",
      headers: {
        "x-forwarded-for": testIp,
        "content-type": "application/json",
      },
    });

    const result3 = await enforcePaywall(req2SameIp);
    expect(result3.allowed).toBe(false);
    expect(result3.isPaid).toBe(false);
    if (!result3.allowed) {
      expect(result3.error).toBe("founding_member_required");
    }
  });
});
