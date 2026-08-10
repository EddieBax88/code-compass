/**
 * MethodGuide — lets the user choose HOW they navigate the code book:
 *   INDEX     → LookupGuide (index-word method)
 *   CODEOLOGY → CodologyGuide (table-of-contents method, Plan/Build/Use)
 * The choice persists in localStorage so it sticks across questions & sessions.
 * Also renders the step-by-step CalcWalkthrough when a question has calc_steps.
 */
import { useState } from "react";
import LookupGuide from "./LookupGuide";
import CodologyGuide from "./CodologyGuide";
import CalcWalkthrough from "./CalcWalkthrough";
import type { QuestionCard } from "@/data/questionBank";

const METHOD_KEY = "cc_lookup_method";
type Method = "index" | "codology";

function loadMethod(): Method {
  try {
    return localStorage.getItem(METHOD_KEY) === "codology" ? "codology" : "index";
  } catch {
    return "index";
  }
}

export default function MethodGuide({ question }: { question: QuestionCard }) {
  const [method, setMethod] = useState<Method>(loadMethod);

  const choose = (m: Method) => {
    setMethod(m);
    try {
      localStorage.setItem(METHOD_KEY, m);
    } catch {
      /* private browsing — non-fatal */
    }
  };

  return (
    <div className="space-y-3">
      {/* Method toggle */}
      <div className="flex items-center gap-2">
        <span className="stencil-label">LOOKUP METHOD</span>
        <div className="flex border border-border rounded-sm overflow-hidden">
          {(
            [
              ["index", "INDEX"],
              ["codology", "CODEOLOGY"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => choose(value)}
              className={`px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                method === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {method === "codology" ? (
        <CodologyGuide
          necArticle={question.nec_article}
          whatToLookFor={question.lookup_path.what_to_look_for}
        />
      ) : (
        <LookupGuide lookup={question.lookup_path} />
      )}

      {question.calc_steps && question.calc_steps.length > 0 && (
        <CalcWalkthrough steps={question.calc_steps} answer={question.correct_answer} />
      )}
    </div>
  );
}
