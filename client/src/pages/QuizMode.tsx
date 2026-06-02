/**
 * Code Compass — Quiz Mode (Quick Drill)
 * Shows full NEC index lookup path after every answer
 */
import { useState, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { getRandomQuestions, type QuestionCard } from "@/data/questionBank";
import { useNecVersion } from "@/contexts/NecVersionContext";
import { Zap, CheckCircle, XCircle, BookOpen, RotateCcw, ArrowRight, Search, Target, ChevronRight } from "lucide-react";

type QuizState = "setup" | "active" | "complete";

function LookupPathPanel({ card }: { card: QuestionCard }) {
  return (
    <div className="panel-card rounded-sm p-4 border-l-2 border-l-amber-400/60 space-y-3">
      <p className="font-mono text-xs font-bold text-amber-400 tracking-wider">HOW TO FIND THIS IN YOUR BOOK</p>

      <div className="space-y-2">
        {/* Step 1: Index Keywords */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-sm bg-amber-400/15 flex items-center justify-center shrink-0 mt-0.5">
            <Search className="w-3 h-3 text-amber-400" />
          </div>
          <div>
            <p className="stencil-label mb-0.5">1 — INDEX KEYWORD</p>
            <div className="flex flex-wrap gap-1.5">
              {card.lookup_path.index_keywords.map(kw => (
                <span key={kw} className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 rounded-sm font-mono text-xs text-amber-400">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Index Entry */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-sm bg-blue-400/15 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-3 h-3 text-blue-400" />
          </div>
          <div>
            <p className="stencil-label mb-0.5">2 — INDEX ENTRY READS</p>
            <p className="text-xs text-blue-400 font-mono">{card.lookup_path.index_entry}</p>
          </div>
        </div>

        {/* Step 3: Article/Table */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-sm bg-green-400/15 flex items-center justify-center shrink-0 mt-0.5">
            <ArrowRight className="w-3 h-3 text-green-400" />
          </div>
          <div>
            <p className="stencil-label mb-0.5">3 — NAVIGATE TO</p>
            <span className="px-2 py-0.5 bg-green-400/10 border border-green-400/30 rounded-sm font-mono text-xs text-green-400">
              {card.lookup_path.article_or_table}
            </span>
          </div>
        </div>

        {/* Step 4: What to look for */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-sm bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
            <Target className="w-3 h-3 text-primary" />
          </div>
          <div>
            <p className="stencil-label mb-0.5">4 — WHAT TO READ</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{card.lookup_path.what_to_look_for}</p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">{card.explanation}</p>
      </div>
    </div>
  );
}

export default function QuizMode() {
  const { version } = useNecVersion();
  const [state, setState] = useState<QuizState>("setup");
  const [questions, setQuestions] = useState<QuestionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  const startQuiz = useCallback((count: number, difficulty?: QuestionCard["difficulty"]) => {
    const q = getRandomQuestions(count, difficulty, version);
    setQuestions(q);
    setAnswers({});
    setCurrentIndex(0);
    setRevealed(false);
    setState("active");
  }, [version]);

  const selectAnswer = (questionId: string, answer: string) => {
    if (revealed) return;
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    setRevealed(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setRevealed(false);
    } else {
      setState("complete");
    }
  };

  const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correct_answer ? 1 : 0), 0);

  if (state === "setup") {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
          <div>
            <p className="stencil-label mb-2">QUICK DRILL — NEC {version}</p>
            <h2 className="text-2xl font-bold text-foreground">Rapid-Fire Practice</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              No timer. After each answer you'll see the exact index path to find it in your book.
            </p>
          </div>

          <div>
            <p className="stencil-label mb-3">SELECT DRILL SIZE</p>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15].map(count => (
                <button
                  key={count}
                  onClick={() => startQuiz(count)}
                  data-testid={`drill-size-${count}`}
                  className="panel-card p-4 rounded-sm text-center hover:border-primary/40 transition-all"
                >
                  <p className="text-2xl font-mono font-bold text-primary">{count}</p>
                  <p className="stencil-label mt-1">QUESTIONS</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="stencil-label mb-3">FILTER BY LEVEL</p>
            <div className="grid grid-cols-2 gap-3">
              {(["journeyman", "master"] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => startQuiz(5, diff)}
                  data-testid={`drill-level-${diff}`}
                  className="panel-card p-4 rounded-sm text-center hover:border-primary/40 transition-all"
                >
                  <Zap className="w-4 h-4 text-primary mx-auto mb-2" />
                  <p className="font-mono text-sm font-bold text-foreground uppercase">{diff}</p>
                  <p className="stencil-label mt-1">5 QUESTIONS</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (state === "complete") {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
          <div className="panel-card p-8 rounded-sm text-center">
            <Zap className="w-8 h-8 text-primary mx-auto mb-4" />
            <p className="stencil-label mb-2">DRILL COMPLETE</p>
            <p className="text-4xl font-mono font-bold text-foreground">{score}/{questions.length}</p>
            <p className="text-muted-foreground font-mono text-sm mt-2">{percentage}% accuracy</p>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={() => startQuiz(questions.length)}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 inline mr-2" />
                Again
              </button>
              <button
                onClick={() => setState("setup")}
                className="border border-border text-foreground px-5 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider hover:bg-secondary transition-all"
              >
                New Drill
              </button>
            </div>
          </div>

          {questions.filter(q => answers[q.id] !== q.correct_answer).length > 0 && (
            <div>
              <p className="stencil-label mb-3">REVIEW MISSED — LOOKUP PATHS</p>
              <div className="space-y-4">
                {questions.filter(q => answers[q.id] !== q.correct_answer).map(q => (
                  <div key={q.id} className="space-y-2">
                    <p className="text-sm text-foreground font-medium">{q.question}</p>
                    <p className="text-xs text-green-400 font-mono flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {q.correct_answer}
                    </p>
                    <LookupPathPanel card={q} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    );
  }

  const currentQ = questions[currentIndex];
  const userAnswer = answers[currentQ.id];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-5">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="stencil-label">QUESTION {currentIndex + 1} OF {questions.length} — NEC {version}</span>
          <span className="font-mono text-xs text-green-400">{score} correct</span>
        </div>
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="panel-card p-6 rounded-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider ${
              currentQ.difficulty === "master" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
            }`}>
              {currentQ.difficulty}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{currentQ.nec_article}</span>
          </div>
          <p className="text-foreground font-medium leading-relaxed">{currentQ.question}</p>
        </div>

        {/* Choices */}
        <div className="space-y-2">
          {currentQ.choices.map((choice, i) => {
            const letter = String.fromCharCode(65 + i);
            const selected = userAnswer === choice;
            const isCorrect = choice === currentQ.correct_answer;

            return (
              <button
                key={choice}
                onClick={() => selectAnswer(currentQ.id, choice)}
                disabled={revealed}
                data-testid={`choice-${letter}`}
                className={`w-full panel-card p-4 rounded-sm flex items-center gap-3 transition-all text-left ${
                  revealed && isCorrect
                    ? "border-green-400/60 bg-green-400/5"
                    : revealed && selected && !isCorrect
                    ? "border-destructive/60 bg-destructive/5"
                    : "hover:border-primary/30"
                }`}
              >
                <span className={`w-7 h-7 rounded-sm flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                  revealed && isCorrect
                    ? "bg-green-400/20 text-green-400"
                    : revealed && selected && !isCorrect
                    ? "bg-destructive/20 text-destructive"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {letter}
                </span>
                <span className="text-sm text-foreground flex-1">{choice}</span>
                {revealed && isCorrect && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                {revealed && selected && !isCorrect && <XCircle className="w-4 h-4 text-destructive shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Lookup Path — shown after answer */}
        {revealed && (
          <>
            <LookupPathPanel card={currentQ} />
            <button
              onClick={nextQuestion}
              data-testid="next-question"
              className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-mono text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {currentIndex < questions.length - 1 ? "NEXT QUESTION" : "FINISH DRILL"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </AppLayout>
  );
}
