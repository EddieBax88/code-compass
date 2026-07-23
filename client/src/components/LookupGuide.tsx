/**
 * LookupGuide — the teaching reminder shown on every question.
 * Reinforces the method: Question → Index Keyword → Article/Table → Answer.
 * Reads the per-question lookup_path from the question bank.
 */
import { HelpCircle, KeyRound, Navigation, Eye } from "lucide-react";
import type { LookupPath } from "@/data/questionBank";

export default function LookupGuide({ lookup }: { lookup: LookupPath }) {
  return (
    <div className="panel-card rounded-sm p-4 border-l-2 border-l-primary">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="w-3.5 h-3.5 text-primary" />
        <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
          How to find this in your code book
        </span>
      </div>

      <ol className="space-y-3">
        {/* Step 1 — index keyword */}
        <li className="flex items-start gap-3">
          <KeyRound className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
              1 · Look up in the index
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {lookup.index_keywords.map(kw => (
                <span
                  key={kw}
                  className="text-xs font-medium text-foreground bg-primary/15 border border-primary/30 rounded-sm px-2 py-0.5"
                >
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 italic">
              {lookup.index_entry}
            </p>
          </div>
        </li>

        {/* Step 2 — article/table */}
        <li className="flex items-start gap-3">
          <Navigation className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
              2 · Turn to
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5 font-mono">
              {lookup.article_or_table}
            </p>
          </div>
        </li>

        {/* Step 3 — what to read */}
        <li className="flex items-start gap-3">
          <Eye className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
              3 · Read for
            </p>
            <p className="text-sm text-foreground mt-0.5">
              {lookup.what_to_look_for}
            </p>
          </div>
        </li>
      </ol>

      <p className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground italic">
        Open your code book and trace this path yourself — that's the skill the
        exam tests.
      </p>
    </div>
  );
}
