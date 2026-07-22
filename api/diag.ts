/**
 * Diagnostic — tests each import chain to find the crash.
 * Uses dynamic imports so the function itself loads even if deps fail.
 */
export default async function handler(req: any, res: any) {
  const results: Record<string, string> = {};

  // Test 1: shared/const
  try {
    await import("../shared/const");
    results["01_shared_const"] = "OK";
  } catch (e: any) {
    results["01_shared_const"] = `FAIL: ${e.message}`;
  }

  // Test 2: shared/_core/errors
  try {
    await import("../shared/_core/errors");
    results["02_shared_errors"] = "OK";
  } catch (e: any) {
    results["02_shared_errors"] = `FAIL: ${e.message}`;
  }

  // Test 3: drizzle schema
  try {
    await import("../drizzle/schema");
    results["03_drizzle_schema"] = "OK";
  } catch (e: any) {
    results["03_drizzle_schema"] = `FAIL: ${e.message}`;
  }

  // Test 4: server env
  try {
    await import("../server/_core/env");
    results["04_server_env"] = "OK";
  } catch (e: any) {
    results["04_server_env"] = `FAIL: ${e.message}`;
  }

  // Test 5: server db (imports mysql2 + drizzle)
  try {
    await import("../server/db");
    results["05_server_db"] = "OK";
  } catch (e: any) {
    results["05_server_db"] = `FAIL: ${e.message}`;
  }

  // Test 6: server cookies
  try {
    await import("../server/_core/cookies");
    results["06_cookies"] = "OK";
  } catch (e: any) {
    results["06_cookies"] = `FAIL: ${e.message}`;
  }

  // Test 7: server sdk (imports axios, jose, cookie)
  try {
    await import("../server/_core/sdk");
    results["07_sdk"] = "OK";
  } catch (e: any) {
    results["07_sdk"] = `FAIL: ${e.message}`;
  }

  // Test 8: server trpc
  try {
    await import("../server/_core/trpc");
    results["08_trpc"] = "OK";
  } catch (e: any) {
    results["08_trpc"] = `FAIL: ${e.message}`;
  }

  // Test 9: server llm
  try {
    await import("../server/_core/llm");
    results["09_llm"] = "OK";
  } catch (e: any) {
    results["09_llm"] = `FAIL: ${e.message}`;
  }

  // Test 10: copilot router
  try {
    await import("../server/routers/copilot");
    results["10_copilot"] = "OK";
  } catch (e: any) {
    results["10_copilot"] = `FAIL: ${e.message}`;
  }

  // Test 11: server routers (full)
  try {
    await import("../server/routers");
    results["11_routers"] = "OK";
  } catch (e: any) {
    results["11_routers"] = `FAIL: ${e.message}`;
  }

  // Test 12: context
  try {
    await import("../server/_core/context");
    results["12_context"] = "OK";
  } catch (e: any) {
    results["12_context"] = `FAIL: ${e.message}`;
  }

  // Test 13: oauth
  try {
    await import("../server/_core/oauth");
    results["13_oauth"] = "OK";
  } catch (e: any) {
    results["13_oauth"] = `FAIL: ${e.message}`;
  }

  // Test 14: stripeWebhook
  try {
    await import("../server/stripeWebhook");
    results["14_stripe_webhook"] = "OK";
  } catch (e: any) {
    results["14_stripe_webhook"] = `FAIL: ${e.message}`;
  }

  // Test 15: storageProxy
  try {
    await import("../server/_core/storageProxy");
    results["15_storage_proxy"] = "OK";
  } catch (e: any) {
    results["15_storage_proxy"] = `FAIL: ${e.message}`;
  }

  // Test 16: express
  try {
    await import("express");
    results["16_express"] = "OK";
  } catch (e: any) {
    results["16_express"] = `FAIL: ${e.message}`;
  }

  // Test 17: trpc express adapter
  try {
    await import("@trpc/server/adapters/express");
    results["17_trpc_express"] = "OK";
  } catch (e: any) {
    results["17_trpc_express"] = `FAIL: ${e.message}`;
  }

  res.json({ time: new Date().toISOString(), results });
}
