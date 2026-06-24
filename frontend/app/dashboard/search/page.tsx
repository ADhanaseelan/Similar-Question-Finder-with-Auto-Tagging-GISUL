"use client";
import { Search, Bookmark, BookmarkPlus, Loader2, Database, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        // Fetch Global Bank
        const bankRes = await fetch("/api/questions/global-bank", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        // Fetch Saved Questions to mark which are saved
        const savedRes = await fetch("/api/questions/saved", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (bankRes.ok && savedRes.ok) {
          const bankData = await bankRes.json();
          const savedData = await savedRes.json();
          setQuestions(bankData);
          setSavedIds(new Set(savedData.map((sq: any) => sq.id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const toggleSave = async (q: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const isSaved = savedIds.has(q.id);
    const newSaved = new Set(savedIds);
    if (isSaved) newSaved.delete(q.id);
    else newSaved.add(q.id);
    setSavedIds(newSaved);

    try {
      if (isSaved) {
        await fetch(`/api/questions/saved/${q.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
      } else {
        await fetch("/api/questions/saved", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ id: q.id, question: q.question, topic: q.topic })
        });
      }
    } catch (err) {
      console.error(err);
      // Revert on error
      if (isSaved) newSaved.add(q.id);
      else newSaved.delete(q.id);
      setSavedIds(newSaved);
    }
  };

  const filteredQuestions = useMemo(() => {
    if (!query) return questions;
    const lowerQuery = query.toLowerCase();
    return questions.filter(q => 
      q.question.toLowerCase().includes(lowerQuery) || 
      q.topic.toLowerCase().includes(lowerQuery)
    );
  }, [questions, query]);

  return (
    <div className="pb-12 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-500" /> Global Question Bank
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Explore and bookmark thousands of AI-curated questions.</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sticky top-0 z-10">
        <Search className="w-6 h-6 text-gray-400 shrink-0 ml-2" />
        <input 
          type="text" 
          placeholder="Search by keyword, topic, or concept..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-lg font-medium text-gray-700 placeholder:text-gray-300"
        />
        <div className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-sm font-bold shrink-0">
          {filteredQuestions.length} Results
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Loading global database...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No matches found</h3>
          <p className="text-gray-500">Try adjusting your search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((q, idx) => {
            const isSaved = savedIds.has(q.id);
            return (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {q.topic}
                    </span>
                    <button 
                      onClick={() => toggleSave(q)}
                      className={`p-2 rounded-xl transition-colors ${isSaved ? 'bg-amber-100 text-amber-500' : 'bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-500'}`}
                      title={isSaved ? "Remove Bookmark" : "Bookmark Question"}
                    >
                      {isSaved ? <Bookmark className="w-5 h-5 fill-current" /> : <BookmarkPlus className="w-5 h-5" />}
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg leading-snug mb-4 group-hover:text-indigo-600 transition-colors">
                    {q.question}
                  </h3>
                </div>
                
                <button 
                  onClick={() => {
                    // Navigate to ask-question and pre-fill? Just go to ask question
                    router.push('/dashboard/ask-question');
                  }}
                  className="mt-4 w-full py-3 bg-gray-50 hover:bg-indigo-500 hover:text-white text-gray-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Analyze <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
