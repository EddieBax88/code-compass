/**
 * Code Compass — Search Mode (Code Lookup)
 * Design: Industrial Control Panel — fast keyword search, plain-English summaries
 */
import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { searchQuestions, questionBank, type QuestionCard } from "@/data/questionBank";
import { Search, BookOpen, Tag, Filter } from "lucide-react";

export default function SearchMode() {
  const [query, setQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<"all" | "journeyman" | "master">("all");

  const results = useMemo(() => {
    let items: QuestionCard[];
    if (query.trim()) {
      items = searchQuestions(query);
    } else {
      items = [...questionBank];
    }
    if (filterDifficulty !== "all") {
      items = items.filter(q => q.difficulty === filterDifficulty);
    }
    return items;
  }, [query, filterDifficulty]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    questionBank.forEach(q => q.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, []);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <p className="stencil-label mb-2">CODE LOOKUP</p>
          <h2 className="text-2xl font-bold text-foreground">Search the NEC</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Search by article number, keyword, or topic. Get plain-English summaries with page references.
          </p>
        </div>

        {/* Search Bar */}
        <div className="panel-card rounded-sm p-1 flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground ml-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by article (e.g. 310.16), keyword (e.g. ampacity), or topic..."
            className="flex-1 bg-transparent py-3 px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="mr-3 text-xs text-muted-foreground hover:text-foreground font-mono"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          {(["all", "journeyman", "master"] as const).map(level => (
            <button
              key={level}
              onClick={() => setFilterDifficulty(level)}
              className={`px-3 py-1.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                filterDifficulty === level
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {level}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 12).map(tag => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-mono transition-all ${
                query === tag
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-3">
          {results.map(q => (
            <div key={q.id} className="panel-card p-5 rounded-sm hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-xs font-bold text-primary">{q.nec_article}</span>
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider ${
                      q.difficulty === "master" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-foreground font-medium leading-relaxed mb-2">
                    {q.question}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="text-green-400 font-mono font-bold">→</span> {q.explanation}
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {q.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-secondary rounded-sm text-[10px] font-mono text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-lg font-bold text-primary">{q.correct_answer}</p>
                  <p className="stencil-label mt-1">ANSWER</p>
                </div>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="panel-card p-8 rounded-sm text-center">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-mono text-sm">No results found for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-2">Try a different keyword or article number.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
