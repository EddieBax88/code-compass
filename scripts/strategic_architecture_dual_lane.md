# Code Compass & Hermes AI - Strategic Architecture & Dual-Lane Roadmap

Source: Gemini agent session, pasted 2026-07-27

## Executive Summary
- Addresses 300,000 industrial labor deficit ("Experience Bottleneck") and 72% first-time NEC exam failure rate
- Positions Code Compass as hybrid digital trade infrastructure: AI lookup speed + field trade wisdom

## 1. Architectural Pivot & Google ADK 2.0 Multi-Agent Network
- **Infrastructure Upgrade:** Migration to Google Gemini Enterprise Agent Platform + ADK 2.0 → targeting $2M Gemini XPRIZE
- **Tiered Multi-Agent Network:**
  - The Foreman Agent: Master orchestration, safety gates, ISO 13849 compliance
  - The Codeology Agent: NEC 2017–2026 navigation, fast field lookups
  - The Industrial Agent: L5X XML parsing, tag mapping, SVG ladder logic rendering

## 2. Industrial Logic Engine & Deterministic Safety
- Deterministic L5X Parser (Rockwell XML as rigid data — no hallucinations)
- SHA-256 hashing of modified L5X logic blocks
- Inline SVG renderer with live-pulse CSS animations

## 3. Market Positioning & Dual-Lane Strategy
- **"Experience-Maxing" Moat:** Founder field electrician background + AI speed
- **The "Wage Tax" (WT):** $15/hr gap = $2,400/mo = $14,400 over 6 months lost by uncarded apprentices

### B2C Lane (Apprentice NEC Prep)
- Positions Code Compass as essential tool against 72% first-time NEC exam failure rate
- Focus: Bridging the "Wage Tax" by accelerating exam mastery and credentialing
- **PRICING: $20/user flat fee** (Section 3) — NOTE: conflicts with Section 5 below

### B2B Lane (Hermes Industrial)
- Targets "Experience Bottleneck" — Hermes AI as critical industrial infrastructure
- Focus: Data Center Commissioning ($460,000/day delay penalties)
- **PRICING: Custom enterprise-tier site licensing** — no consumer pricing visible

## 4. 2026 NEC Regulatory Alignment
Key rules: Arc-Flash 110.16(B), Equipment Egress 110.26, Special GFCI 210.8(B), MCC Disconnect Marking 430.98, Power Control Systems 120.7

## 5. Monetization & $10M ARR Financial Model
⚠️ **PRICING CONFLICT:** Section 3 says $20/user, this section says $39.99 founder's offer.

### B2C Lane (Apprentice Exam Prep)
- Pricing: $20/user flat fee (Section 3) OR $39.99 Founder's Offer capped 500 users → $199/yr or $39.99/mo (Section 5)
- Funnel: Low-ticket, fully self-serve digital funnel
- Scope: NEC 2017–2026 navigation and study resources ONLY

### B2B Lane (Hermes Industrial)
- Sales: Demo-led, pilot-led, invoice-led ONLY
- Tier 2 (JATC/Classrooms): $1,000–$5,000/year site licenses
- Tier 3 (Data Centers): $40,000/year commissioning site licenses
- Scope: Hermes Industrial / L5X parser, contractor workflow tools, commissioning site licenses

### Phased Transition Path
- Aug 2026: B2C Founder's Offer
- Q4 2026: B2B Pilot Phase
- H1 2027: Institutional Licensing → $10M ARR milestone

## 6. Non-Dilutive Funding & Social Impact
- Build with Gemini XPRIZE ($2M), NSF SBIR Phase I ($305k), MTC IDEA ($25k–$50k), Innovate SOMO ($50k–$200k)
- "1-in-250" Give Back: Every $250k institutional revenue → 1 sponsored apprenticeship

## 7. Operational Status — Real-Time Audit (July 27, 2026)

### Infrastructure Status

| Item | Status | Evidence |
|------|--------|----------|
| **DashScope/Qwen API** | DONE | Tested live: NEC Co-Pilot returned full 4-step Codeology response for "NEC 110.26". API is functional. The $42.79 balance may exist on the Alibaba Cloud account but is NOT blocking operations. |
| **DNS / Cloudflare / Vercel** | DONE | codecompass.work → 308 → www.codecompass.work. Both served by Vercel (x-vercel-id confirmed). Site is fully live and functional. No Cloudflare in the chain (server header is "Vercel" not "cloudflare"). If Cloudflare was planned as a CDN layer, it's not currently needed — Vercel handles DNS + edge. |
| **GitHub Enterprise** | STILL BLOCKED / NEEDS MANUAL USER ACTION | Aug 19 trial expiration is real. gh CLI is not authenticated locally. You need to upgrade in GitHub billing settings. This affects repo management, CI/CD, and XPRIZE submission (requires sharing repo with Devpost). |
| **Namecheap ICANN verification** | REMOVE FROM CHECKLIST | Domain is resolving and live. ICANN verification is a one-time email confirmation — if the domain works, this is done. Not an ongoing operational concern. |

### What's Actually Working Right Now
- codecompass.work is LIVE on Vercel
- NEC Co-Pilot is FUNCTIONAL (4-mode: Guided Method, Index Search, Quick Answer, Ugly's Reference)
- Intent routing + scope guards are working (tested: NEC 110.26 → correct Codeology 4-step response)
- Exam prep module is accessible (25-question practice test, timed drills)
- PLC Parsing and Data Center Compliance modules are on the landing page (marked PREMIUM)

### What's Actually Blocking Revenue
- **No B2C checkout funnel** — no Systeme.io funnel or Stripe payment link connected. Users can use the tool but can't pay.
- **No B2B outreach started** — no pilot emails sent to contractors or JATC directors.
- **GitHub Enterprise trial** — must resolve before Aug 19 for XPRIZE submission.

### Top 3 Open Actions (Priority Order)
1. **Wire B2C payment funnel** — Create Systeme.io funnel with $20 Stripe checkout for exam prep access
2. **Draft and send first B2B pilot outreach** — Target: Bryan Hensley (IBEW 453) or a Texas/VA data center contractor
3. **Upgrade GitHub Enterprise** — Before Aug 19 trial expiration (XPRIZE requires repo sharing)

## 8. Master Q3 2026 – H1 2027 Timeline
- July 27: NSF SBIR submission
- August 1: RevenueCat Ship-a-thon launch
- August 17: Gemini XPRIZE submission
- Q4 2026: Texas/VA Data Center contractor cohort pilot
- H1 2027: Institutional licensing rollout ($999–$3,500/mo) → $8M–$10M valuation

### Strategic Partnerships
- IBEW/NECA: JATC curriculum integration
- Rockwell Automation: L5X XML parsing gold standard

## Module 9: Hermes Agentic OS (4-Lane Execution Engine)
### 9.1 Operational Architecture
- Persistent Memory, Skill Automation, Subagent Delegation, Terminal & API Control

### 9.2 The 4 Operating Lanes
1. **Research Lane:** NEC revisions, grant deadlines, data center construction (TX/VA)
2. **Build Lane:** Multi-agent orchestration, L5X validation, ADK 2.0/Gemini integration
3. **Sales & Outreach Lane:** $460k/day penalty B2B pitch, automated email sequences, B2C "Wage Tax" messaging
4. **Ops & Health Lane:** Domain/DNS monitoring, Vercel alerts, GitHub trial timelines, cloud API balances

## Module 10: Hermes Master System Prompts
- Prompt 1: Gemini XPRIZE winning alignment (pitch video, ADK 2.0 architecture, revenue proof)
- Prompt 2: B2B contractor & JATC lead generation
- Prompt 3: Sales outbound & conversion workflow

## Module 11: Hybrid Model Execution & Token Optimization
- Dev: Qwen (DashScope) + Gemini 2.0 Flash free tier
- Production/XPRIZE: Gemini 2.0 Pro/Flash via ADK 2.0
- Google Cloud $300 free trial + Google for Startups credits

## Module 12: Risk Mitigation
- XPRIZE miss → pivot to NSF SBIR + MTC IDEA + Q1 2027 OpenAI Build Week
- B2B resistance → "Efficiency Audits" as low-friction entry
- ADK 2.0 migration hurdles → maintain Qwen/DashScope fallback parallel container
