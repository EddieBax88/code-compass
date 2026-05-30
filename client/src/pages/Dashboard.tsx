/**
 * Code Compass — Dashboard ("Control Panel" landing)
 * Design: Industrial Control Panel — card-based modules, immediate utility
 */
import AppLayout from "@/components/AppLayout";
import { Link } from "wouter";
import { Timer, Zap, Search, BookOpen, TrendingUp } from "lucide-react";
import { questionBank } from "@/data/questionBank";

const MODES = [
  {
    href: "/exam",
    title: "EXAM MODE",
    subtitle: "Timed scored practice",
    icon: Timer,
    description: "Simulate the real journeyman/master exam. 25 questions, 60-minute timer, scored with rationales.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663501556292/h96iBuVHfguftcpG5HiHBb/exam-mode-card-UVo7MMpxYfCAYPkp3cuUmA.webp",
  },
  {
    href: "/quiz",
    title: "QUICK DRILL",
    subtitle: "5-20 question bursts",
    icon: Zap,
    description: "Rapid-fire drills by topic or difficulty. Perfect for lunch breaks and van rides.",
    image: null,
  },
  {
    href: "/search",
    title: "CODE LOOKUP",
    subtitle: "Fast keyword search",
    icon: Search,
    description: "Search by article number, keyword, or scenario. Plain-English summaries with page references.",
    image: null,
  },
] as const;

export default function Dashboard() {
  const totalQuestions = questionBank.length;
  const journeymanCount = questionBank.filter(q => q.difficulty === "journeyman").length;
  const masterCount = questionBank.filter(q => q.difficulty === "master").length;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-sm panel-card">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663501556292/h96iBuVHfguftcpG5HiHBb/hero-panel-SosmoRYk3dL2SGAM2K4Zco.webp"
            alt="Electrical panel"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 p-8 lg:p-12">
            <p className="stencil-label mb-2">NEC 2026 CO-PILOT</p>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-3">
              Navigate the Code.<br />Pass the Exam.
            </h2>
            <p className="text-muted-foreground max-w-lg text-sm lg:text-base">
              The methodology layer on top of your NEC book. We don't replace the book — we make the book usable.
            </p>
            <div className="mt-6 flex items-center gap-6">
              <Link href="/exam">
                <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all">
                  Start Exam
                </button>
              </Link>
              <Link href="/quiz">
                <button className="border border-primary/40 text-primary px-5 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider hover:bg-primary/10 transition-all">
                  Quick Drill
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "TOTAL CARDS", value: totalQuestions, icon: BookOpen },
            { label: "JOURNEYMAN", value: journeymanCount, icon: Zap },
            { label: "MASTER", value: masterCount, icon: TrendingUp },
            { label: "ARTICLES", value: "15+", icon: Search },
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {MODES.map(({ href, title, subtitle, icon: Icon, description, image }) => (
            <Link key={href} href={href}>
              <div className="panel-card rounded-sm p-5 h-full hover:border-primary/40 transition-all duration-200 group">
                {image && (
                  <div className="mb-4 rounded-sm overflow-hidden h-32">
                    <img src={image} alt={title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <h3 className="font-mono text-sm font-bold text-foreground tracking-wider">{title}</h3>
                </div>
                <p className="stencil-label mb-2">{subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            UNOFFICIAL STUDY TOOL — NOT AFFILIATED WITH NFPA. ALWAYS VERIFY WITH YOUR CODE BOOK.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
