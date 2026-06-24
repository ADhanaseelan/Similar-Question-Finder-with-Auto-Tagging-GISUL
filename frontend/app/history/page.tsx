"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, Loader2, Calendar, Hash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-100 blur-[120px] animate-blob pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-blue-100 blur-[120px] animate-blob animation-delay-4000 pointer-events-none" />

      {/* Header */}
      <header className="p-6 relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 font-bold hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-extrabold text-foreground tracking-tight">StudyMind</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-8 relative z-10 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground mb-2">Search History</h1>
            <p className="text-slate-500 font-medium text-lg">Review your past questions and their AI classifications.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {topics.map(topic => (
            <button 
              key={topic} 
              onClick={() => setActiveTopic(topic)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                activeTopic === topic 
                  ? "bg-foreground text-white border-foreground shadow-md" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* History List */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 font-bold p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
            <p className="font-bold">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white/60 p-12 rounded-3xl text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg font-bold mb-6">No questions found for this topic.</p>
            <Link href="/ask">
              <button className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors shadow-sm">
                Ask a Question
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {history.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={item.id} 
                className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-blue-700 transition-colors">
                    {item.question}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(item.createdAt)}
                    </div>
                    {item.similarQuestions && item.similarQuestions.length > 0 && (
                      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        <Hash className="w-4 h-4" />
                        {item.similarQuestions.length} Similar Found
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t border-slate-100 sm:border-t-0 pt-4 sm:pt-0">
                  <span className="px-4 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-black uppercase tracking-wider border border-violet-100 mb-2">
                    {item.topic}
                  </span>
                  <span className="text-slate-400 font-bold text-xs">
                    {(item.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
