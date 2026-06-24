"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Calendar, Hash, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { TopicTag } from "@/components/ui/TopicTag";

type HistoryItem = {
  id: string;
  question: string;
  topic: string;
  confidence: number;
  createdAt: string;
  similarQuestions: { question: string; similarity: number }[];
};

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("All");

  const topics = [
    "All", "Indian Polity", "DSA", "Quantitative Aptitude", 
    "Physics", "Biology", "Accountancy", "Indian Economy"
  ];

  const fetchHistory = async (topic: string) => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const url = topic === "All" 
        ? "http://localhost:8000/api/history/"
        : `http://localhost:8000/api/history/${topic}`;

      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to load history");
      }

      const data = await res.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(activeTopic);
  }, [activeTopic]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-poppins font-extrabold text-foreground-light dark:text-foreground-dark mb-2">Search History</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Review your past questions and their AI classifications.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {topics.map(topic => (
          <button 
            key={topic} 
            onClick={() => setActiveTopic(topic)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
              activeTopic === topic 
                ? "bg-primary text-white border-primary shadow-md" 
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* History List */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold p-4 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
          <p className="font-bold">Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <GlassCard className="text-center p-12 flex flex-col items-center justify-center border-dashed border-2">
          <p className="text-gray-500 text-lg font-bold mb-6">No questions found for this topic.</p>
          <Link href="/dashboard">
            <button className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2">
              Ask a Question <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </GlassCard>
      ) : (
        <div className="grid gap-4">
          {history.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={item.id} 
            >
              <GlassCard className="!p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-3 group-hover:text-primary transition-colors">
                    {item.question}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(item.createdAt)}
                    </div>
                    {item.similarQuestions && item.similarQuestions.length > 0 && (
                      <div className="flex items-center gap-1.5 text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                        <Hash className="w-4 h-4" />
                        {item.similarQuestions.length} Similar Found
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t border-gray-100 dark:border-gray-800 sm:border-t-0 pt-4 sm:pt-0">
                  <TopicTag topic={item.topic} className="mb-2" />
                  <span className="text-gray-400 font-bold text-xs">
                    {(item.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
