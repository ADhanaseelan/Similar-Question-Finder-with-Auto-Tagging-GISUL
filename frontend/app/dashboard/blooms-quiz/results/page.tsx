"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Brain, Download, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  bloomLevel: string;
};

export default function BloomsQuizResultsPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const dataStr = sessionStorage.getItem("last_quiz_result");
    if (!dataStr) {
      router.push("/dashboard/blooms-quiz");
      return;
    }
    
    try {
      const data = JSON.parse(dataStr);
      if (data.questions) setQuizData(data.questions);
    } catch (err) {
      console.error("Failed to parse quiz data", err);
    }
  }, [router]);

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    if (showResults) return; // Prevent changing after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [qIndex]: optIndex
    }));
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let score = 0;
    quizData.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  if (!quizData) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => router.push("/dashboard/blooms-quiz")}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Generator
          </button>
          <h1 className="text-3xl md:text-4xl font-poppins font-extrabold text-foreground-light dark:text-foreground-dark flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            Your Generated Quiz
          </h1>
        </div>
        
        {showResults && (
          <div className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-xl text-center">
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Final Score</p>
            <p className="text-3xl font-black text-primary">
              {calculateScore()} <span className="text-lg text-primary/70">/ {quizData.length}</span>
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {quizData.map((q, qIndex) => (
          <motion.div 
            key={qIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qIndex * 0.1 }}
          >
            <GlassCard className="border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md text-xs font-bold uppercase tracking-wider">
                  Question {qIndex + 1}
                </span>
                <span className="px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 rounded-md text-xs font-bold uppercase tracking-wider">
                  {q.bloomLevel}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-6">
                {q.question}
              </h3>

              <div className="space-y-3">
                {q.options.map((opt, optIndex) => {
                  const isSelected = selectedAnswers[qIndex] === optIndex;
                  const isCorrect = q.correctAnswer === optIndex;
                  
                  let optionClass = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 text-gray-700 dark:text-gray-300";
                  let Icon = null;

                  if (showResults) {
                    if (isCorrect) {
                      optionClass = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
                      Icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
                    } else if (isSelected && !isCorrect) {
                      optionClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                      Icon = <XCircle className="w-5 h-5 text-red-500" />;
                    } else {
                      optionClass = "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 opacity-50";
                    }
                  } else if (isSelected) {
                    optionClass = "border-primary bg-primary/5 text-primary ring-1 ring-primary";
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(qIndex, optIndex)}
                      disabled={showResults}
                      className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all flex items-center justify-between ${optionClass} ${showResults ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <span>
                        <span className="inline-block w-6 font-bold opacity-50">{String.fromCharCode(65 + optIndex)}.</span>
                        {opt}
                      </span>
                      {Icon}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Explanation</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <button 
          className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" /> Export PDF
        </button>
        {!showResults ? (
          <button 
            onClick={() => setShowResults(true)}
            disabled={Object.keys(selectedAnswers).length < quizData.length}
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Submit Quiz
          </button>
        ) : (
          <button 
            onClick={() => {
              setSelectedAnswers({});
              setShowResults(false);
            }}
            className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center"
          >
            Retry Quiz
          </button>
        )}
      </div>
    </motion.div>
  );
}
