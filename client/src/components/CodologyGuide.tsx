/**
 * CodologyGuide — the Codeology (table-of-contents) navigation path.
 * Plan / Build / Use classification → TOC → chapter → article → section.
 * Companion to LookupGuide (index method); users pick their preferred method.
 */
import { Compass, ListTree, BookMarked, Eye } from "lucide-react";
import { getCodologyPath, type CodologyCategory } from "@/data/codology";

const CATEGORY_STYLE: Record<CodologyCategory, string> = {
  FOUNDATION: "bg-secondary text-foreground border-border",
  PLAN: "bg-primary/15 text-primary border-primary/30",
  BUILD: "bg-primary/15 text-primary border-primary/30",
  USE: "bg-primary/15 text-primary border-primary/30",
  SPECIAL: "bg-primary/15 text-primary border-primary/30",
  COMMUNICATIONS: "bg-secondary text-foreground border-border",
  TABLES: "bg-secondary text-foreground border-border",
};

export default function CodologyGuide({
  necArticle,
  whatToLookFor,
}: {
  necArticle: string;
  whatToLookFor: string;
}) {
  const path = getCodologyPath(necArticle);
  if (!path) return null;

  return (
    <div className="panel-card rounded-sm p-4 border-l-2 border-l-primary">
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-3.5 h-3.5 text-primary" />
        <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
          Codeology path — navigate by the table of contents
        </span>
      </div>

      <ol className="space-y-3">
        {/* Step 1 — classify */}
        <li className="flex items-start gap-3">
          <ListTree className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
              1 · Classify the question
            </p>
            <span
              className={`inline-block mt-1 text-xs font-mono font-bold uppercase tracking-wider border rounded-sm px-2 py-0.5 ${CATEGORY_STYLE[path.category]}`}
            >
              {path.category}
            </span>
            <p className="text-xs text-muted-foreground mt-1.5 italic">{path.categoryHint}</p>
          </div>
        </li>

        {/* Step 2 — TOC → chapter → article */}
        <li className="flex items-start gap-3">
          <BookMarked className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
              2 · Table of contents
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5 font-mono">{path.chapterLabel}</p>
            <p className="text-sm text-foreground mt-0.5 font-mono">→ {path.articleLabel}</p>
          </div>
        </li>

        {/* Step 3 — land on the section */}
        <li className="flex items-start gap-3">
          <Eye className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
              3 · Go to {path.target}
            </p>
            <p className="text-sm text-foreground mt-0.5">{whatToLookFor}</p>
          </div>
        </li>
      </ol>

      <p className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground italic">
        Codeology reads the book the way it's organized: Plan (Ch.2) → Build (Ch.3) → Use (Ch.4),
        with special occupancies, equipment, and conditions (Ch.5–7) modifying them.
      </p>
    </div>
  );
}
