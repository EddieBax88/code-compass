/**
 * Code Compass — Exam Mode
 * Design: Industrial Control Panel — timed, scored, full simulation
 */
import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { getRandomQuestions, type QuestionCard } from "@/data/questionBank";
import { Timer, CheckCircle, XCircle, RotateCcw, BookOpen } from "lucide-react";

type ExamState = "setup" | "active" | "review";

export default function ExamMode() {
  const [state, setState] = useState<ExamState>("setup");
  const [questions, setQuestions] = useState<QuestionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showRationale, setShowRationale] = useState(false);

  const startExam = useCallback((count: number) => {
    const q = getRandomQuestions(count);
    setQuestions(q);
    setAnswers({});
    setCurrentIndex(0);
    setTimeLeft(count * 144); // ~2.4 min per question
    setShowRationale(false);
    setState("active");
  }, []);

  // Timer
  useEffect(() => {
    if (state !== "active" || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setState("review");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state, timeLeft]);

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowRationale(false);
    } else {
      setState("review");
    }
  };

  const score = questions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correct_answer ? 1 : 0);
  }, 0);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (state === "setup") {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
          <div>
            <p className="stencil-label mb-2">EXAM MODE</p>
            <h2 className="text-2xl font-bold text-foreground">Timed Practice Exam</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Simulate exam conditions. Timer starts immediately. Each question shows rationale and NEC reference after you answer.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { count: 5, label: "Quick Check", time: "12 min" },
              { count: 10, label: "Half Exam", time: "24 min" },
              { count: 15, label: "Full Bank", time: "36 min" },
            ].map(({ count, label, time }) => (
              <button
                key={count}
                onClick={() => startExam(count)}
                className="w-full panel-card p-4 rounded-sm flex items-center justify-between hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Timer className="w-4 h-4 text-primary" />
                  <div className="text-left">
                    <p className="font-mono text-sm font-bold text-foreground">{label}</p>
                    <p className="stencil-label">{count} questions • {time}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-primary">START →</span>
              </button>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (state === "review") {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <AppLayout>
        <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
          <div className="panel-card p-6 rounded-sm text-center">
            <p className="stencil-label mb-3">EXAM COMPLETE</p>
            <p className={`text-5xl font-mono font-bold ${passed ? "text-green-400" : "text-destructive"}`}>
              {percentage}%
            </p>
            <p className="text-muted-foreground mt-2 font-mono text-sm">
              {score} / {questions.length} correct
            </p>
            <p className={`mt-2 font-mono text-xs uppercase tracking-wider ${passed ? "text-green-400" : "text-destructive"}`}>
              {passed ? "PASS" : "NEEDS REVIEW"}
            </p>
          </div>

          {/* Question Review */}
          <div className="space-y-3">
            {questions.map((q, i) => {
              const userAnswer = answers[q.id];
              const correct = userAnswer === q.correct_answer;
              return (
                <div key={q.id} className="panel-card p-4 rounded-sm">
                  <div className="flex items-start gap-3">
                    {correct ? (
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">
                        {i + 1}. {q.question}
                      </p>
                      {!correct && (
                        <p className="text-xs text-destructive mt-1 font-mono">
                          Your answer: {userAnswer || "No answer"}
                        </p>
                      )}
                      <p className="text-xs text-green-400 mt-1 font-mono">
                        Correct: {q.correct_answer}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">{q.explanation}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <BookOpen className="w-3 h-3 text-primary" />
                        <span className="font-mono text-xs text-primary">{q.nec_article}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setState("setup")}
            className="w-full panel-card p-4 rounded-sm flex items-center justify-center gap-2 hover:border-primary/40 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-bold text-foreground">NEW EXAM</span>
          </button>
        </div>
      </AppLayout>
    );
  }

  // Active exam
  const currentQ = questions[currentIndex];
  const userAnswer = answers[currentQ.id];
  const hasAnswered = !!userAnswer;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
        {/* Timer Bar */}
        <div className="flex items-center justify-between panel-card p-3 rounded-sm">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-primary indicator-pulse" />
            <span className="font-mono text-sm font-bold text-foreground">{formatTime(timeLeft)}</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
          <div className="flex gap-1">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex
                    ? "bg-primary"
                    : answers[q.id]
                    ? "bg-green-400/60"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="panel-card p-6 rounded-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="stencil-label">QUESTION {currentIndex + 1}</span>
            <span className={`ml-auto px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider ${
              currentQ.difficulty === "master" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
            }`}>
              {currentQ.difficulty}
            </span>
          </div>
          <p className="text-foreground font-medium leading-relaxed">{currentQ.question}</p>
        </div>

        {/* Choices */}
        <div className="space-y-2">
          {currentQ.choices.map((choice, i) => {
            const letter = String.fromCharCode(65 + i);
            const selected = userAnswer === choice;
            const isCorrect = choice === currentQ.correct_answer;
            const showResult = hasAnswered && showRationale;

            return (
              <button
                key={choice}
                onClick={() => {
                  if (!hasAnswered) {
                    selectAnswer(currentQ.id, choice);
                    setShowRationale(true);
                  }
                }}
                disabled={hasAnswered}
                className={`w-full panel-card p-4 rounded-sm flex items-center gap-3 transition-all text-left ${
                  showResult && isCorrect
                    ? "border-green-400/60 bg-green-400/5"
                    : showResult && selected && !isCorrect
                    ? "border-destructive/60 bg-destructive/5"
                    : selected
                    ? "border-primary/60 bg-primary/5"
                    : "hover:border-primary/30"
                }`}
              >
                <span className={`w-7 h-7 rounded-sm flex items-center justify-center font-mono text-xs font-bold ${
                  showResult && isCorrect
                    ? "bg-green-400/20 text-green-400"
                    : showResult && selected && !isCorrect
                    ? "bg-destructive/20 text-destructive"
                    : selected
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {letter}
                </span>
                <span className="text-sm text-foreground">{choice}</span>
                {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
                {showResult && selected && !isCorrect && <XCircle className="w-4 h-4 text-destructive ml-auto" />}
              </button>
            );
          })}
        </div>

        {/* Rationale */}
        {showRationale && (
          <div className="panel-card p-4 rounded-sm border-l-2 border-l-primary">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono text-xs font-bold text-primary">{currentQ.nec_article}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{currentQ.explanation}</p>
            <p className="mt-3 text-xs text-muted-foreground italic">
              Open your code book to verify this reference.
            </p>
          </div>
        )}

        {/* Next Button */}
        {hasAnswered && (
          <button
            onClick={nextQuestion}
            className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-mono text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all"
          >
            {currentIndex < questions.length - 1 ? "NEXT QUESTION →" : "FINISH EXAM"}
          </button>
        )}
      </div>
    </AppLayout>
  );
}
