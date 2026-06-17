/**
 * Code Compass — Quiz Mode (Quick Drill)
 * Gated: requires Lifetime Access (PaywallGate at top level)
 */
import { useState, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { PaywallGate } from "@/components/PaywallGate";
import { getRandomQuestions, type QuestionCard } from "@/data/questionBank";
import { Zap, CheckCircle, XCircle, BookOpen, RotateCcw, ArrowRight } from "lucide-react";
import BackButton from "@/components/BackButton";
import LookupGuide from "@/components/LookupGuide";

type QuizState = "setup" | "active" | "complete";

function QuizContent() {
  const [state, setState] = useState<QuizState>("setup");
  const [questions, setQuestions] = useState<QuestionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  const startQuiz = useCallback((count: number, difficulty?: QuestionCard["difficulty"]) => {
    const q = getRandomQuestions(count, difficulty);
    setQuestions(q);
    setAnswers({});
    setCurrentIndex(0);
    setRevealed(false);
    setState("active");
  }, []);

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
      <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
        <BackButton fallback="/" label="Back to Panel" className="-ml-3" />
        <div>
          <p className="stencil-label mb-2">QUICK DRILL</p>
          <h2 className="text-2xl font-bold text-foreground">Rapid-Fire Practice</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            No timer. Instant feedback. Perfect for building muscle memory on NEC lookups.
          </p>
        </div>
        <div>
          <p className="stencil-label mb-3">SELECT DRILL SIZE</p>
          <div className="grid grid-cols-3 gap-3">
            {[5, 10, 15].map(count => (
              <button
                key={count}
                onClick={() => startQuiz(count)}
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
    );
  }

  if (state === "complete") {
    const percentage = Math.round((score / questions.length) * 100);
    return (
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
            <p className="stencil-label mb-3">REVIEW MISSED</p>
            <div className="space-y-2">
              {questions.filter(q => answers[q.id] !== q.correct_answer).map(q => (
                <div key={q.id} className="panel-card p-4 rounded-sm">
                  <p className="text-sm text-foreground font-medium mb-2">{q.question}</p>
                  <p className="text-xs text-green-400 font-mono">✓ {q.correct_answer}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <BookOpen className="w-3 h-3 text-primary" />
                    <span className="font-mono text-xs text-primary">{q.nec_article}</span>
                    <span className="text-xs text-muted-foreground">· index:</span>
                    <span className="text-xs text-foreground">{q.lookup_path.index_keywords[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active quiz
  const currentQ = questions[currentIndex];
  const userAnswer = answers[currentQ.id];

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <span className="stencil-label">DRILL {currentIndex + 1} OF {questions.length}</span>
        <span className="font-mono text-xs text-green-400">{score} correct</span>
      </div>
      <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>
      <div className="panel-card p-6 rounded-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider ${
            currentQ.difficulty === "master" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
          }`}>{currentQ.difficulty}</span>
          <span className="font-mono text-xs text-muted-foreground">{currentQ.nec_article}</span>
        </div>
        <p className="text-foreground font-medium leading-relaxed">{currentQ.question}</p>
      </div>
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
              className={`w-full panel-card p-4 rounded-sm flex items-center gap-3 transition-all text-left ${
                revealed && isCorrect ? "border-green-400/60 bg-green-400/5"
                : revealed && selected && !isCorrect ? "border-destructive/60 bg-destructive/5"
                : "hover:border-primary/30"
              }`}
            >
              <span className={`w-7 h-7 rounded-sm flex items-center justify-center font-mono text-xs font-bold ${
                revealed && isCorrect ? "bg-green-400/20 text-green-400"
                : revealed && selected && !isCorrect ? "bg-destructive/20 text-destructive"
                : "bg-secondary text-muted-foreground"
              }`}>{letter}</span>
              <span className="text-sm text-foreground flex-1">{choice}</span>
              {revealed && isCorrect && <CheckCircle className="w-4 h-4 text-green-400" />}
              {revealed && selected && !isCorrect && <XCircle className="w-4 h-4 text-destructive" />}
            </button>
          );
        })}
      </div>
      {revealed && (
        <>
          <LookupGuide lookup={currentQ.lookup_path} />
          <div className="panel-card p-4 rounded-sm border-l-2 border-l-primary">
            <p className="text-sm text-muted-foreground leading-relaxed">{currentQ.explanation}</p>
            <p className="mt-2 text-xs text-muted-foreground italic">
              Open your code book to {currentQ.nec_article} to verify.
            </p>
          </div>
          <button
            onClick={nextQuestion}
            className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-mono text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            {currentIndex < questions.length - 1 ? "NEXT" : "FINISH"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}

export default function QuizMode() {
  return (
    <AppLayout>
      <PaywallGate featureName="Quick Drill">
        <QuizContent />
      </PaywallGate>
    </AppLayout>
  );
}
