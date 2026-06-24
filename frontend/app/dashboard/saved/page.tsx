"use client";
import { Bookmark, BookmarkMinus, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SavedQuestionsPage() {
  const router = useRouter();
  const [savedQuestions, setSavedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await fetch("/api/questions/saved", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setSavedQuestions(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [router]);

  const removeBookmark = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Optimistic update
      setSavedQuestions(prev => prev.filter(q => q.id !== id));

      await fetch(`/api/questions/saved/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to remove bookmark", err);
    }
  };

  return (
    <div className="pb-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-amber-500 fill-current" /> Saved Questions
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Your personal collection of bookmarked study questions.</p>
        </div>
        <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl font-bold">
          {savedQuestions.length} Saved
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Loading your bookmarks...</p>
        </div>
      ) : savedQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6">
            <Bookmark className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Saved Questions</h2>
          <p className="text-gray-500 mb-8 max-w-md">You haven't bookmarked any questions yet! Explore the global bank to save questions here.</p>
          <Link href="/dashboard/search" className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors">
            Explore Global Bank
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savedQuestions.map((q, idx) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {q.topic}
                  </span>
                  <button 
                    onClick={() => removeBookmark(q.id)}
                    className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Remove Bookmark"
                  >
                    <BookmarkMinus className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-bold text-gray-800 text-lg leading-snug mb-4 group-hover:text-indigo-600 transition-colors">
                  {q.question}
                </h3>
              </div>
              
              <button 
                onClick={() => router.push('/dashboard/ask-question')}
                className="mt-4 w-full py-3 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Analyze this question <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
