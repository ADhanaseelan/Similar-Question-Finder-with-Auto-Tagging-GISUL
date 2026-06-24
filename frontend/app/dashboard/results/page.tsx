"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, ChevronRight, CheckCircle2, ChevronDown, MessageSquare, Bot } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { TopicTag } from "@/components/ui/TopicTag";

export default function ResultsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [resultData, setResultData] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const q = sessionStorage.getItem("last_query");
    const dataStr = sessionStorage.getItem("last_result");
    if (!q || !dataStr) {
      router.push("/dashboard");
    } else {
      setQuery(q);
      try {
        setResultData(JSON.parse(dataStr));
      } catch(e) {
        console.error(e);
      }
    }
  }, [router]);

  const getSimilarityColor = (score: number) => {
    if (score >= 90) return "text-green-500 bg-green-50 dark:bg-green-900/20";
    if (score >= 80) return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
    return "text-orange-500 bg-orange-50 dark:bg-orange-900/20";
  };

  if (!query || !resultData) return null;

  const results = resultData.similarQuestions || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium mb-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      <GlassCard className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Your Question
        </h2>
        <p className="text-2xl md:text-3xl font-poppins font-bold text-foreground-light dark:text-foreground-dark mb-4">
          "{query}"
        </p>
        
        {!resultData.isDuplicate && resultData.topic && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-primary/10">
            <span className="text-sm font-bold text-gray-500">Auto-Tagged Topic:</span>
            <TopicTag topic={resultData.topic} />
            <span className="text-xs font-bold text-gray-400">
              ({(resultData.confidence * 100).toFixed(0)}% confident)
            </span>
          </div>
        )}
      </GlassCard>

      {resultData.chatResponse && (
        <GlassCard className="bg-white/80 dark:bg-gray-800/80 border-accent/20">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-1">AI Assistant</h3>
              <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                {resultData.chatResponse}
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {resultData.isDuplicate ? (
        <GlassCard className="border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10">
          <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">Duplicate Detected!</h3>
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">
            You've asked a nearly identical question before ({resultData.similarity}% match):
          </p>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <p className="font-bold text-foreground-light dark:text-foreground-dark">"{resultData.duplicateQuestion}"</p>
          </div>
        </GlassCard>
      ) : (
        <>
          <div className="flex items-center justify-between mt-8 mb-4">
            <h3 className="text-xl font-poppins font-bold text-foreground-light dark:text-foreground-dark">
              Top Semantic Matches
            </h3>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
              Found {results.length} results
            </span>
          </div>

          <div className="space-y-4">
            {results.length === 0 ? (
              <GlassCard className="text-center p-8 border-dashed border-2">
                <p className="text-gray-500 font-bold">No similar past questions found. This is a brand new concept for you!</p>
              </GlassCard>
            ) : (
              results.map((result: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <GlassCard className="!p-0 overflow-hidden border-gray-200 dark:border-gray-800 hover:border-primary/30 transition-colors">
                    <div 
                      className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                      onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getSimilarityColor(Math.round(result.similarity * 100))}`}>
                            {Math.round(result.similarity * 100)}% Match
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">
                          {result.question}
                        </h4>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          {expandedId === idx ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {expandedId === idx && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="px-6 pb-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 pt-4"
                      >
                        <h5 className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" /> Verified Answer
                        </h5>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          You haven't added an explicit answer to this yet, but revisiting this past question might spark your memory!
                        </p>
                      </motion.div>
                    )}
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
