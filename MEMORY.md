# HERMES MEMORY — READ THIS FIRST, EVERY SESSION. UPDATE IT LAST, EVERY SESSION.

## STANDING RULES (never violate)
1. ONE Vercel project only: code-compass. Never create another.
2. Checkout = Stripe Payment Link: https://buy.stripe.com/5kQdR98Ei4VI9CWbqF3sI03 — never change buttons back to /api/stripe-checkout.
3. Guests get exactly ONE free question, enforced server-side. /practice-test, /exam-prep, /plc, /data-center are paywalled.
4. Pricing: Code Compass Pro $19.99/month. No other public price.
5. Never rebuild working features — restore from git history instead.
6. Commit AND push after every completed step, not at the end.
7. Never touch Supabase env vars without being told.

## CURRENT STATE
- Live checkout works via the payment link (in AuthNav.tsx and FoundingMemberModal.tsx).
- Known pending task: Vercel env STRIPE_SECRET_KEY holds an invalid mk_ value; owner will replace with sk_live_ key in Vercel dashboard.

## SESSION LOG (append one line per session: date — what you did)
- 2026-08-22 — Added Go Pro links & Code Compass Pro pricing section to landing page; initialized MEMORY.md.
