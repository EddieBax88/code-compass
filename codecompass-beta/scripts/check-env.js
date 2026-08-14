#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

// Load local env files if variables are not already injected by the environment (e.g. in local builds)
const envPaths = [
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env.local"),
  path.resolve(process.cwd(), "../.env"),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, quiet: true });
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const errors = [];

if (!supabaseUrl || !supabaseUrl.trim()) {
  errors.push("Missing or empty VITE_SUPABASE_URL");
} else if (!supabaseUrl.startsWith("https://") && !supabaseUrl.startsWith("http://")) {
  errors.push(
    `Invalid VITE_SUPABASE_URL: must start with https:// or http:// (got: ${supabaseUrl})`,
  );
}

if (!supabaseAnonKey || !supabaseAnonKey.trim()) {
  errors.push(
    "Missing or empty VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY)",
  );
}

if (errors.length > 0) {
  console.error("\n==================================================");
  console.error("❌ PREBUILD SAFETY CHECK FAILED");
  console.error("==================================================");
  for (const err of errors) {
    console.error(` - ${err}`);
  }
  console.error(
    "\nVite requires these environment variables at build time to bake valid Supabase credentials into the client bundle.",
  );
  console.error("Please configure these variables in Vercel or your local .env file before building.\n");
  process.exit(1);
}

console.log("✓ Prebuild check passed: Supabase environment variables verified.");
