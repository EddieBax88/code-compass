/**
 * Diagnostic endpoint — returns what loaded and what crashed.
 * This will tell us exactly which import is breaking the serverless function.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const results: Record<string, string> = {};

  // Test 1: dotenv
  try {
    await import("dotenv/config");
    results["dotenv"] = "OK";
  } catch (e: any) {
    results["dotenv"] = `FAIL: ${e.message}`;
  }

  // Test 2: express
  try {
    const express = await import("express");
    results["express"] = "OK";
  } catch (e: any) {
    results["express"] = `FAIL: ${e.message}`;
  }

  // Test 3: trpc
  try {
    const trpc = await import("@trpc/server/adapters/express");
    results["trpc"] = "OK";
  } catch (e: any) {
    results["trpc"] = `FAIL: ${e.message}`;
  }

  // Test 4: mysql2
  try {
    const mysql2 = await import("mysql2");
    results["mysql2"] = "OK";
  } catch (e: any) {
    results["mysql2"] = `FAIL: ${e.message}`;
  }

  // Test 5: drizzle
  try {
    const drizzle = await import("drizzle-orm/mysql2");
    results["drizzle"] = "OK";
  } catch (e: any) {
    results["drizzle"] = `FAIL: ${e.message}`;
  }

  // Test 6: stripe
  try {
    const stripe = await import("stripe");
    results["stripe"] = "OK";
  } catch (e: any) {
    results["stripe"] = `FAIL: ${e.message}`;
  }

  // Test 7: server db
  try {
    const db = await import("../server/db");
    results["server/db"] = "OK";
  } catch (e: any) {
    results["server/db"] = `FAIL: ${e.message}`;
  }

  // Test 8: server routers
  try {
    const routers = await import("../server/routers");
    results["server/routers"] = "OK";
  } catch (e: any) {
    results["server/routers"] = `FAIL: ${e.message}`;
  }

  // Test 9: shared const
  try {
    const shared = await import("../shared/const");
    results["shared/const"] = "OK";
  } catch (e: any) {
    results["shared/const"] = `FAIL: ${e.message}`;
  }

  // Test 10: context
  try {
    const ctx = await import("../server/_core/context");
    results["server/context"] = "OK";
  } catch (e: any) {
    results["server/context"] = `FAIL: ${e.message}`;
  }

  // Test 11: oauth
  try {
    const oauth = await import("../server/_core/oauth");
    results["server/oauth"] = "OK";
  } catch (e: any) {
    results["server/oauth"] = `FAIL: ${e.message}`;
  }

  // Test 12: stripeWebhook
  try {
    const webhook = await import("../server/stripeWebhook");
    results["server/stripeWebhook"] = "OK";
  } catch (e: any) {
    results["server/stripeWebhook"] = `FAIL: ${e.message}`;
  }

  res.json({ timestamp: new Date().toISOString(), results });
}
