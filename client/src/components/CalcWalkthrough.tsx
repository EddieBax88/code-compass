/**
 * CalcWalkthrough — worked solution for calculation questions.
 * Shows exactly WHERE each variable comes from (table/article) and
 * exactly WHAT math to do, step by step, down to the answer.
 */
import { Calculator, Equal } from "lucide-react";
import type { CalcStep } from "@/data/questionBank";

export default function CalcWalkthrough({
  steps,
  answer,
}: {
  steps: CalcStep[];
  answer: string;
}) {
  return (
    <div className="panel-card rounded-sm p-4 border-l-2 border-l-primary">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-3.5 h-3.5 text-primary" />
        <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
          Work the math — step by step
        </span>
      </div>

      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 rounded-sm bg-primary/15 border border-primary/30 font-mono text-xs font-bold text-primary mt-0.5">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{step.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className="font-mono text-primary">{step.source}</span>
              </p>
              {step.math && (
                <p className="font-mono text-sm text-foreground mt-1 bg-secondary rounded-sm px-2 py-1 inline-block">
                  {step.math}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                → <span className="text-foreground font-medium">{step.result}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
        <Equal className="w-4 h-4 text-primary" />
        <span className="font-mono text-sm font-bold text-primary">{answer}</span>
      </div>
    </div>
  );
}
