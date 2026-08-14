import posthog from "posthog-js";

export type RoleType = "apprentice" | "journeyman" | "master";
export type EditionType = "2017" | "2020" | "2023" | "2026";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined" || initialized) return;

  const key = "phc_nLqQ3eo5AZPWN2SyM6Hy3mASFaWHfqBev5baowhfyQXi";
  const host = "https://us.i.posthog.com";

  try {
    posthog.init(key, {
      api_host: host,
      capture_pageview: "history_change",
      capture_pageleave: true,
      persistence: "localStorage+cookie",
    });
    initialized = true;
  } catch (e) {
    console.warn("[PostHog] Init warning:", e);
  }
}

export function trackEvent(eventName: string, properties: Record<string, unknown> = {}) {
  initPostHog();
  if (typeof window !== "undefined") {
    const safeProps = { ...properties };
    delete safeProps.question;
    delete safeProps.answer;
    delete safeProps.email;
    delete safeProps.password;
    delete safeProps.token;

    try {
      posthog.capture(eventName, safeProps);
      console.log(`[Analytics Event] ${eventName}`, safeProps);
    } catch (e) {
      console.warn(`[Analytics Error] Failed to track ${eventName}:`, e);
    }
  }
}
