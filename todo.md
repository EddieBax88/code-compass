# Code Compass TODO

## Stripe Payments

- [x] Add stripe_customer_id and stripe_subscription_id columns to users table in drizzle/schema.ts
- [x] Run pnpm db:push to migrate schema
- [x] Create server/products.ts with plan definitions (Free, Pro monthly, Pro annual)
- [x] Create Stripe checkout session tRPC procedure in server/routers.ts
- [x] Create Stripe webhook handler at /api/stripe/webhook in server/\_core/index.ts
- [x] Build /pricing page with plan cards and checkout buttons
- [x] Build /payment-success page
- [x] Build /payment-cancel page
- [x] Add Pricing link to app navigation
- [x] Write vitest for checkout session procedure

## AI Co-Pilot Page

- [x] Add Gemini-powered tRPC procedure: analyze any NEC question, return keywords + lookup path + article citation + explanation
- [x] Build /copilot page: dark bg, orange accent, input feed at top, suggested keyword chips, results panel, bottom tab nav (Search/Index/Co-Pilot)
- [x] Add AI icon to AppLayout sidebar nav
- [x] Wire Gemini API key via GEMINI_API_KEY env var on server (uses built-in invokeLLM)
- [x] Write vitest for the copilot.analyze procedure

## 24-Hour Launch (Revenue Roadmap)

- [x] Add light mode toggle (dark/light theme switcher in header)
- [x] Add custom back button to all pages (state-aware navigation)
- [x] Simplify landing page (remove feature overload, 3-section layout: Hero + CTA + Social Proof)
- [x] Wire Stripe Price IDs from dashboard into server/products.ts — $39.99 lifetime price_1Ten4FRjzbxMHVlJikIz0EJR
- [x] Implement freemium 3-query/day limit for free users (track in DB)
- [ ] Test mobile responsiveness (iPhone 12/14, Android Chrome) — MANUAL
- [ ] Test Stripe checkout flow end-to-end (card: 4242 4242 4242 4242) — MANUAL
- [x] Save checkpoint and publish to codecompass.work
- [ ] Share Stripe payment link in Facebook electrician groups — MANUAL (marketing)

## Week 1 Refinements (POST-LAUNCH — not launch-blocking)

# These need Drizzle schema changes + new tRPC procedures + tests. Build them

# properly in a follow-up (push the repo so the app can be built/tested first),

# not blind into a snapshot right before the payment test.

- [ ] Add gamification (progress bar, study streaks, badges)
- [ ] Add tiered pricing UI ($9.99/mo, $79/year, $149 lifetime) — needs live Stripe prices per tier
- [ ] Build performance analytics dashboard (weak areas, success rate by article)
- [ ] Add daily challenge (bonus free query for correct answer)
- [ ] Add social proof copy to landing page — NEEDS REAL numbers/testimonials. Do NOT ship fabricated "500+ electricians"/fake quotes (dishonest + FTC risk). Provide real ones to drop in.

## Front-End Redesign (Method-First Beta)

- [x] Theme switcher: exactly 2 themes — OLED Black (#000000, default) + Light (readability-first), drop Industrial Dark
- [x] Theme toggle in header on every screen (single shared toggle in root layout), persist in localStorage cc_theme, default OLED Black
- [x] Full-width welcome page: hero (name + promise line), 3 modes in a row, primary CTA (Get Started) + Sign in
- [x] Teaching method shown front and center on welcome page (Question → Keyword → Article → Answer)
- [x] Remove forced onboarding redirect from / so welcome page is the front page (onboarding now opt-in)
- [x] Per-question NEC navigation reminders (LookupGuide: index keyword → article → what to read) on Exam, Quiz, and Search
- [x] Test theme persistence + welcome page + per-question guide, checkpoint, push to GitHub

## OAuth In-App Browser Fix (Error 403 disallowed_useragent)

- [x] Detect in-app browsers (Messenger/Instagram/Facebook/TikTok/X/LinkedIn/Snapchat/LINE) - useInAppBrowser hook + 6 passing tests
- [x] Show 'Open in Safari/Chrome' guidance banner (InAppBrowserBanner) mounted globally in AppLayout, with copy-link button
- [x] Test detection logic (15/15 tests pass), checkpoint, guide publish

## Homepage Redesign + Paywall (Jun 6 2026)

- [x] Find high-quality electrical/lightning/nature hero image (Unsplash/Pexels) — hero-electrician-tower wired in Dashboard.tsx
- [x] Flip default theme to Light for public pages (home, pricing, onboarding) — :root is now Light in index.css
- [x] Redesign homepage: full-bleed hero image, minimal text, single CTA — Dashboard.tsx
- [x] Gate Exam/Drill/Lookup behind paywall — free tier = Co-Pilot 3/day only — all 3 pages wrapped in <PaywallGate>
- [ ] Test, checkpoint, publish — MANUAL (run pnpm check + load app in Manus, then publish)

## Launch Blockers (theme + checkout) — Jun 6 2026

- [x] All pages default to Light theme; OLED reserved for paid users only — index.css :root=Light, OLED under .dark (paid only)
- [x] OLED toggle hidden/locked for free users (only shows after paywall) — AppLayout: {oledUnlocked && <ThemeToggle/>}, unlocked only on active/trialing sub
- [x] Diagnose card-declined checkout issue (mom's Visa) — ROOT CAUSE: Stripe in TEST mode; live cards rejected (only 4242... works in test). Code reads keys from env, nothing hardcoded.
- [ ] Fix checkout so cards are accepted — CONFIG (no code): in host env set STRIPE*SECRET_KEY=sk_live*…, STRIPE*LIFETIME_PRICE_ID=<live price id>, STRIPE_WEBHOOK_SECRET=<live whsec*…> after Stripe KYC. Code is now env-ready (products.ts).
- [ ] Test, checkpoint, guide publish — MANUAL (after live keys: run one real low-value charge end-to-end)
