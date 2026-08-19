# Intent System Logic

## Overview
The Code Compass NEC Co-Pilot uses an intent-based routing system to ensure each user query is handled by the appropriate mode with proper scope guards. This prevents mode leakage and ensures responses stay within their designated knowledge boundaries.

## Modes and Purposes

### 1. Guided Method (book)
**Purpose:** Teaching mode that walks users through the Code Compass Method lookup process
**Response Format:** 4-step Code Compass Method framework (Classify → Keywords → Article → Verify)
**Use Case:** Learning how to navigate the NEC codebook systematically

### 2. Index Search (fast)
**Purpose:** Fast jobsite lookup without teaching framework
**Response Format:** KEYWORDS → INDEX → ANSWER
**Use Case:** Quick reference when you need the answer fast but still want index guidance

### 3. Quick Answer (quick)
**Purpose:** Direct answer with NEC citation
**Response Format:** Direct answer + citation
**Use Case:** When you already know how to look things up and just need confirmation

### 4. Ugly's Reference (uglys)
**Purpose:** Pocket field-reference for calculations and formulas
**Response Format:** Formula/calculation steps-by-step
**Use Case:** Conduit bending, ampacity, voltage drop, NEMA configurations, transformer diagrams

## Intent Classification

### Priority 1: PLC/L5X Detection
**Keywords:** l5x, l5k, plc, ladder logic, rung, routine, rockwell, studio 5000, parse
**Routing Logic:**
- If 2+ PLC keywords found → `plc_l5x` intent
- If 1 PLC keyword + (parse|analyze|count) → `plc_l5x` intent
- Response: Redirect to /plc module

### Priority 2: Ugly's Scope Validation (when mode=uglys)
**IN_SCOPE Patterns:**
- bend|offset|stub|saddle|kick
- formula|calculate|calculation
- voltage drop|ohm|watt
- ampacity|conductor size|wire size
- conduit fill
- nema|pinout|plug|receptacle config
- transformer|control circuit|diagram
- conversion|metric|imperial

**OUT_OF_SCOPE Patterns:**
- article|section|nec
- requirement|shall|must
- minimum|maximum|clearance|depth|spacing
- working space|gfci|grounding|bonding
- what does.*say|what is.*required

**Routing Logic:**
- If matches OUT_OF_SCOPE patterns AND NOT in IN_SCOPE → `out_of_scope` intent
- If matches IN_SCOPE patterns → `uglys_reference` intent
- If ambiguous → `out_of_scope` intent (fail-safe)

**Refusal Message:** "This question is outside Ugly's Reference scope. Switch to Guided Method, Index Search, or Quick Answer for NEC article lookup."

### Priority 3: Mode-Based Routing
- mode=book → `guided_method` intent
- mode=fast → `index_search` intent
- mode=quick → `quick_answer` intent

## Example Queries by Intent

### Guided Method (book mode)
**Q:** "What's the working space requirement for a 480V panel?"
**A:** 
```
STEP 1 - CLASSIFY: General requirements, Chapter 1
STEP 2 - KEYWORDS: "working space", "480V"
STEP 3 - ARTICLE: Article 110.26
STEP 4 - VERIFY: Table 110.26(A)(1) shows 3-4 feet depending on conditions
Open your codebook to Article 110.26 and verify.
```

### Index Search (fast mode)
**Q:** "What's the working space requirement for a 480V panel?"
**A:**
```
KEYWORDS: working space, 480V
INDEX: Article 110.26
ANSWER: Table 110.26(A)(1) requires 3-4 feet working space depending on conditions and voltage
```

### Quick Answer (quick mode)
**Q:** "What's the working space requirement for a 480V panel?"
**A:**
```
Table 110.26(A)(1) requires 3-4 feet working space for 480V equipment depending on conditions.
Citation: NEC 2020, Article 110.26, Table 110.26(A)(1)
```

### Ugly's Reference - IN SCOPE (uglys mode)
**Q:** "How do I calculate voltage drop for 100ft of 12 AWG copper wire at 20A?"
**A:**
```
Voltage Drop Formula: VD = (2 × K × I × L) / CM
Where:
- K = 12.9 (copper at 75°C)
- I = 20 amps
- L = 100 feet
- CM = 6530 (12 AWG circular mils)

VD = (2 × 12.9 × 20 × 100) / 6530
VD = 51600 / 6530
VD = 7.9 volts (3.3% of 240V)
```

### Ugly's Reference - OUT OF SCOPE (uglys mode)
**Q:** "What's the working space requirement for a 480V panel?"
**A:** "This question is outside Ugly's Reference scope. Switch to Guided Method, Index Search, or Quick Answer for NEC article lookup."

### PLC/L5X (any mode)
**Q:** "Parse my L5X file"
**A:** "For L5X parsing, please use the PLC Parser module. Upload your L5X file at /plc to parse routines, count rungs, and analyze ladder logic."

## Logging
The system logs three key events to console:
1. `[chat.ts] Incoming request - mode: {mode}, message length: {length}`
2. `[chat.ts] Intent classified - mode: {mode}, intent: {intent}`
3. `[chat.ts] Refusal/Redirect sent - reason: {out_of_scope|plc_l5x}` (when applicable)

## Scope Guard Summary
- **Ugly's Reference:** Only answers calculation/formula questions. Refuses NEC article lookups.
- **PLC/L5X:** Always routes to parser module, never answers in chat.
- **NEC Modes:** Stay within NEC knowledge base, never answer Ugly's-style calculations.

## Implementation Details
- Intent classification runs before mode selection
- Fail-safe defaults to `out_of_scope` when ambiguous
- Each intent has its own system prompt with explicit boundaries
- Scope validation uses regex patterns for keyword matching
