import { describe, it, expect } from "vitest";
import {
  parseUsageCookie,
  createSignedUsageCookie,
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
