/**
 * Code Compass — Dashboard
 * "How to Use Your Book" is the primary call to action
 */
import AppLayout from "@/components/AppLayout";
import { Link } from "wouter";
import { Timer, Zap, Search, BookOpen, TrendingUp, GraduationCap, ArrowRight, Lightbulb } from "lucide-react";
import { questionBank } from "@/data/questionBank";
import { useNecVersion } from "@/contexts/NecVersionContext";

const MODES = [
  {
    href: "/exam",
    title: "EXAM MODE",
    subtitle: "Timed scored practice",
    icon: Timer,
    description: "Simulate the real journeyman/master exam. 25 questions, 60-minute timer, scored with rationales.",
  },
  {
    href: "/quiz",
    title: "QUICK DRILL",
    subtitle: "5–20 questions + lookup path",
    icon: Zap,
    description: "Every answer reveals the exact 4-step index path to find it in your book. Builds real navigation speed.",
  },
  {
    href: "/search",
    title: "CODE LOOKUP",
    subtitle: "Fast keyword search",
    icon: Search,
    description: "Search by article number, keyword, or topic. Plain-English summaries with page references.",
  },
] as const;

export default function Dashboard() {
  const { version } = useNecVersion();
  const versionedQuestions = questionBank.filter(q => q.nec_versions.includes(version as "2017" | "2020" | "2023" | "2026"));
  const journeymanCount = versionedQuestions.filter(q => q.difficulty === "journeyman").length;
  const masterCount = versionedQuestions.filter(q => q.difficulty === "master").length;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">

        {/* How to Use Your Book — PRIMARY CTA */}
        <div className="panel-card rounded-sm p-6 border-amber-400/30 border bg-amber-400/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-amber-400/15 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="stencil-label text-amber-400/70 mb-1">START HERE</p>
              <h2 className="text-lg font-bold text-foreground mb-2">How to Use Your NEC Book</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                The exam tests your ability to <span className="text-foreground font-medium">navigate the book fast</span> — not memorize it.
                Learn the 4-step index lookup method: spot the keyword → find it in the index → navigate to the article → read the table.
                This works for every question, every edition.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link href="/book-method">
                  <button className="bg-amber-400 text-black px-5 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Learn the Method
                  </button>
                </Link>
                <span className="text-xs text-muted-foreground font-mono">4 steps · works on any edition</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "EDITION", value: `NEC ${version}`, icon: BookOpen },
            { label: "JOURNEYMAN", value: journeymanCount, icon: Zap },
            { label: "MASTER", value: masterCount, icon: TrendingUp },
            { label: "TOTAL Q's", value: versionedQuestions.length, icon: Search },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="panel-card p-4 rounded-sm">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3.5 h-3.5 text-primary" />
                <span className="stencil-label">{label}</span>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Mode Cards */}
        <div>
          <p className="stencil-label mb-3">PRACTICE MODES</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {MODES.map(({ href, title, subtitle, icon: Icon, description }) => (
              <Link key={href} href={href}>
                <div className="panel-card rounded-sm p-5 h-full hover:border-primary/40 transition-all duration-200 group cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <h3 className="font-mono text-sm font-bold text-foreground tracking-wider">{title}</h3>
                  </div>
                  <p className="stencil-label mb-2">{subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
                  <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-mono text-xs">START</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            UNOFFICIAL STUDY TOOL — NOT AFFILIATED WITH NFPA. ALWAYS VERIFY WITH YOUR CODE BOOK.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
