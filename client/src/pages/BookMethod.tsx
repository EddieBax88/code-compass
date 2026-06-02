/**
 * Code Compass — How to Use Your Book
 * Teaches the 4-step NEC index lookup methodology
 */
import AppLayout from "@/components/AppLayout";
import { BookOpen, Search, ArrowRight, Target, ChevronRight, Lightbulb } from "lucide-react";
import { Link } from "wouter";

const STEPS = [
  {
    number: "01",
    title: "Read the Question — Find the Keywords",
    icon: Search,
    color: "text-amber-400",
    border: "border-amber-400/40",
    bg: "bg-amber-400/5",
    description: "Before you touch the book, underline or mentally mark the key noun in the question. This is your index search term.",
    tip: "Ignore the numbers and percentages in the question for now. Focus on the THING the question is about.",
    example: {
      question: "What is the allowable ampacity of a 3/0 AWG THWN-2 conductor in a raceway?",
      keyword: "Ampacity",
      why: "The question is about 'ampacity' of conductors. That's your index word — not '3/0 AWG' or 'THWN-2'."
    }
  },
  {
    number: "02",
    title: "Open the Index — Look Up Your Keyword",
    icon: BookOpen,
    color: "text-blue-400",
    border: "border-blue-400/40",
    bg: "bg-blue-400/5",
    description: "The NEC index is in the back of the book. Look up your keyword alphabetically. The index gives you the article or table number — not the answer.",
    tip: "If you can't find your exact keyword, try a related word. 'Ampacity' → if not found, try 'Conductors, ampacity'.",
    example: {
      question: "You search 'Ampacity' in the index",
      keyword: "Conductors, ampacity — see 310.15, Table 310.16",
      why: "The index entry points you to Article 310, specifically Table 310.16. That's where the answer lives."
    }
  },
  {
    number: "03",
    title: "Navigate to the Article or Table",
    icon: ArrowRight,
    color: "text-green-400",
    border: "border-green-400/40",
    bg: "bg-green-400/5",
    description: "Flip to the article or table number the index gave you. Most answers live in a table — a grid of numbers you read like a map.",
    tip: "Use the article numbers printed at the top of each page to navigate fast. Don't read every word — scan for the section number.",
    example: {
      question: "You turn to Table 310.16",
      keyword: "Table 310.16 — Conductor Ampacity",
      why: "This table has conductor sizes in rows and insulation types in columns. Find your size, find your insulation column."
    }
  },
  {
    number: "04",
    title: "Read the Table — Find Your Answer",
    icon: Target,
    color: "text-primary",
    border: "border-primary/40",
    bg: "bg-primary/5",
    description: "Now use the details from the question — wire size, insulation type, temperature — to read the exact row and column that gives your answer.",
    tip: "For conductor ampacity: find the AWG size in the left column, then read across to the correct insulation temperature column.",
    example: {
      question: "3/0 AWG copper THWN-2 (90°C column)",
      keyword: "225 amperes",
      why: "Row = 3/0 AWG. Column = 90°C copper. The number at that intersection is your answer: 225A."
    }
  }
];

const COMMON_INDEXES = [
  { keyword: "Ampacity", points_to: "Table 310.16", topic: "Wire size → amps allowed" },
  { keyword: "Box fill", points_to: "Table 314.16(A)", topic: "How many wires fit in a box" },
  { keyword: "Grounding electrode conductor", points_to: "Table 250.66", topic: "GEC sizing by service size" },
  { keyword: "Motors, overcurrent protection", points_to: "Table 430.52", topic: "Fuse/breaker sizing for motors" },
  { keyword: "Small-appliance branch circuits", points_to: "210.11(C)(1)", topic: "Kitchen circuit requirements" },
  { keyword: "Service disconnecting means", points_to: "230.71", topic: "Max number of service disconnects" },
  { keyword: "Transformers, overcurrent protection", points_to: "Table 450.3(B)", topic: "Transformer protection sizing" },
  { keyword: "Hazardous locations", points_to: "500.5", topic: "Class I, II, III divisions" },
];

export default function BookMethod() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-10 max-w-3xl mx-auto">

        {/* Header */}
        <div>
          <p className="stencil-label mb-2">METHODOLOGY</p>
          <h2 className="text-2xl font-bold text-foreground">How to Use Your NEC Book</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            The exam doesn't test memorization — it tests whether you can navigate the book fast.
            This 4-step method works on every question, every edition.
          </p>
        </div>

        {/* Key Insight Banner */}
        <div className="panel-card border-l-2 border-l-amber-400 p-5 rounded-sm flex gap-4">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-mono text-sm font-bold text-amber-400 mb-1">THE BIG SECRET</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Most people fail the NEC exam because they try to memorize code sections.
              Working electricians pass because they know <span className="text-foreground font-medium">how to find answers in 60 seconds</span>.
              The index is your GPS. The table is the destination. The question gives you the address.
            </p>
          </div>
        </div>

        {/* 4 Steps */}
        <div>
          <p className="stencil-label mb-4">THE 4-STEP METHOD</p>
          <div className="space-y-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className={`panel-card rounded-sm p-5 border ${step.border} ${step.bg}`}>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <span className={`font-mono text-3xl font-black ${step.color} opacity-40`}>{step.number}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${step.color}`} />
                        <h3 className={`font-mono text-sm font-bold ${step.color}`}>{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.description}</p>

                      {/* Tip */}
                      <div className="bg-secondary/50 rounded-sm p-3 mb-3">
                        <p className="text-xs text-muted-foreground">
                          <span className="text-foreground font-mono font-bold">PRO TIP: </span>
                          {step.tip}
                        </p>
                      </div>

                      {/* Example */}
                      <div className="space-y-2">
                        <p className="stencil-label">EXAMPLE</p>
                        <div className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground">{step.example.question}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <ChevronRight className={`w-3.5 h-3.5 ${step.color} shrink-0 mt-0.5`} />
                          <p className={`text-xs font-mono font-bold ${step.color}`}>{step.example.keyword}</p>
                        </div>
                        <p className="text-xs text-muted-foreground italic pl-5">{step.example.why}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Common Index Entries Cheat Sheet */}
        <div>
          <p className="stencil-label mb-4">HIGH-FREQUENCY INDEX ENTRIES</p>
          <p className="text-xs text-muted-foreground mb-3">These index keywords appear on almost every NEC exam. Know where they point.</p>
          <div className="panel-card rounded-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left p-3 font-mono text-muted-foreground uppercase tracking-wider">Index Keyword</th>
                  <th className="text-left p-3 font-mono text-muted-foreground uppercase tracking-wider">Points To</th>
                  <th className="text-left p-3 font-mono text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Topic</th>
                </tr>
              </thead>
              <tbody>
                {COMMON_INDEXES.map((row, i) => (
                  <tr key={row.keyword} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                    <td className="p-3 font-mono text-primary text-xs">{row.keyword}</td>
                    <td className="p-3 font-mono text-amber-400 text-xs">{row.points_to}</td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">{row.topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NEC Version Note */}
        <div className="panel-card p-5 rounded-sm border-l-2 border-l-blue-400">
          <p className="font-mono text-sm font-bold text-blue-400 mb-2">CITY & STATE VERSION NOTE</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Each state and city adopts a different NEC edition. Missouri uses <span className="text-foreground font-medium">NEC 2017</span> for most jurisdictions.
            Always check which edition your exam requires — the article numbers and tables are the same method,
            but values may differ slightly between editions. Use the version selector in the header to filter
            questions to your specific exam edition.
          </p>
        </div>

        {/* CTA */}
        <div className="flex gap-3 pt-2">
          <Link href="/quiz">
            <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all">
              Practice the Method →
            </button>
          </Link>
          <Link href="/search">
            <button className="border border-border text-foreground px-5 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider hover:bg-secondary transition-all">
              Code Lookup
            </button>
          </Link>
        </div>

      </div>
    </AppLayout>
  );
}
