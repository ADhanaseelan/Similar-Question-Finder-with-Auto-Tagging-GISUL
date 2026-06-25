"use client";
import { Copy, Search, Tag, Loader2, Database, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function SimilarQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };
        
        // Fetch global bank
        const resBank = await fetch("/api/questions/global-bank", { headers });
        if (resBank.ok) {
          const data = await resBank.json();
          setQuestions(data);
        }
        
        // Fetch currently saved to show active state
        const resSaved = await fetch("/api/questions/saved", { headers });
        if (resSaved.ok) {
          const savedData = await resSaved.json();
          setSavedQuestions(new Set(savedData.map((s: any) => s.id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleSave = async (q: any) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };
      
      if (savedQuestions.has(q.id)) {
        // Unsave
        const res = await fetch(`/api/questions/saved/${q.id}`, { method: "DELETE", headers });
        if (res.ok) {
          setSavedQuestions(prev => {
            const next = new Set(prev);
            next.delete(q.id);
            return next;
          });
        }
      } else {
        // Save
        const res = await fetch("/api/questions/saved", { 
          method: "POST", 
          headers,
          body: JSON.stringify({ id: q.id, question: q.question, topic: q.topic })
        });
        if (res.ok) {
          setSavedQuestions(prev => new Set(prev).add(q.id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const topics = ["All", ...Array.from(new Set(questions.map(q => q.topic)))].sort();

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesTopic = selectedTopic === "All" || q.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="pb-12 space-y-8 max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8 text-center px-4">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
          <Database className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">Global Question Bank</h1>
        <p className="text-gray-500 mt-2 text-base md:text-lg max-w-2xl mx-auto">
          Explore the dataset of related questions and duplicates across all topics.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search the global bank..." 
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
              />
            </div>
            <select 
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-gray-700 min-w-[150px] md:min-w-[200px]"
            >
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQuestions.map((q, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={q.id} 
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider shrink-0">
                    <Tag className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{q.topic}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-[10px] md:text-xs font-bold text-gray-400">
                      {(q.confidence * 100).toFixed(0)}% Match
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSave(q);
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        savedQuestions.has(q.id) 
                          ? 'text-indigo-500 bg-indigo-50' 
                          : 'text-gray-300 hover:text-indigo-500 hover:bg-indigo-50'
                      }`}
                      title={savedQuestions.has(q.id) ? "Remove Bookmark" : "Bookmark Question"}
                    >
                      <Bookmark className="w-4 h-4 md:w-5 md:h-5" fill={savedQuestions.has(q.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors leading-snug flex-1">
                  {q.question}
                </h3>
              </motion.div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Questions Found</h3>
              <p className="text-gray-500">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
